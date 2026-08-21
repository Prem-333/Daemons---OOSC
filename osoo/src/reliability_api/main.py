"""FastAPI service that exposes registered agents and reliability evaluations."""
from __future__ import annotations

import json
import os
import importlib.util
import sys
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from sample_agent import SampleSupportAgent, build_tool_handlers
from reliability_engine.graph import build_reliability_graph
from reliability_engine.llm import EvaluatorLLM
from reliability_engine.scenario_generator import ScenarioGenerator


APP_DIR = Path(__file__).resolve().parents[2]
DEFAULT_STORE = APP_DIR / "data" / "api_store.json"
DEFAULT_AGENT_ROOT = APP_DIR / "agents"


class AgentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=2_000)
    domain: str = Field(default="General", min_length=1, max_length=100)
    system_prompt: str = Field(min_length=1, max_length=20_000)
    tool_schemas: list[dict[str, Any]] = Field(default_factory=list)
    allow_destructive_actions: bool = False
    adapter_path: str | None = None


class AgentImport(BaseModel):
    """A folder relative to ``osoo/agents`` containing ``agent.py``."""
    folder: str = Field(min_length=1, max_length=200)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str = Field(default="Imported agent package")
    domain: str = Field(default="General", min_length=1, max_length=100)


class EvaluationRequest(BaseModel):
    scenarios_per_type: int = Field(default=2, ge=1, le=25)


class ScenarioRequest(BaseModel):
    scenarios_per_type: int = Field(default=2, ge=1, le=25)


class GeminiConfiguration(BaseModel):
    api_key: str = Field(min_length=10, max_length=500)
    model: str = Field(default="gemini-2.5-flash", min_length=1, max_length=100)


class Store:
    """Small JSON-backed store suitable for local development and demo use."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.lock = threading.Lock()

    def _read(self) -> dict[str, list[dict[str, Any]]]:
        if not self.path.exists():
            return {"agents": [], "runs": []}
        try:
            return json.loads(self.path.read_text())
        except (OSError, json.JSONDecodeError):
            return {"agents": [], "runs": []}

    def _write(self, data: dict[str, list[dict[str, Any]]]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(data, indent=2))

    def list_agents(self) -> list[dict[str, Any]]:
        with self.lock:
            return self._read()["agents"]

    def create_agent(self, payload: AgentCreate) -> dict[str, Any]:
        with self.lock:
            data = self._read()
            normalized_name = payload.name.strip().lower()
            if any(agent["name"].lower() == normalized_name for agent in data["agents"]):
                raise ValueError("An agent with this name is already registered.")
            agent = {
                "id": f"agent_{uuid.uuid4().hex[:10]}",
                **payload.model_dump(),
                "created_at": _now(),
                "last_evaluated_at": None,
                "latest_score": None,
                "status": "Not evaluated",
            }
            data["agents"].append(agent)
            self._write(data)
            return agent

    def get_agent(self, agent_id: str) -> dict[str, Any] | None:
        return next((agent for agent in self.list_agents() if agent["id"] == agent_id), None)

    def add_run(self, agent_id: str, run: dict[str, Any]) -> None:
        with self.lock:
            data = self._read()
            data["runs"].insert(0, run)
            for agent in data["agents"]:
                if agent["id"] == agent_id:
                    agent["last_evaluated_at"] = run["created_at"]
                    agent["latest_score"] = run["overall_reliability_score"]
                    agent["status"] = "Healthy" if run["overall_reliability_score"] >= 80 else "Degraded"
            self._write(data)

    def list_runs(self) -> list[dict[str, Any]]:
        with self.lock:
            return self._read()["runs"]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _agent_root() -> Path:
    return Path(os.getenv("AGENT_IMPORT_ROOT", DEFAULT_AGENT_ROOT)).resolve()


def _resolve_agent_folder(folder: str) -> Path:
    """Limit imports to the designated local agent folder, never arbitrary paths."""
    root = _agent_root()
    candidate = (root / folder).resolve()
    if candidate == root or root not in candidate.parents or not (candidate / "agent.py").is_file():
        raise ValueError("Folder must be inside osoo/agents and contain agent.py.")
    return candidate


def load_agent_adapter(folder: str):
    """Load a trusted local adapter that exposes ``create_agent()`` or ``agent``."""
    agent_folder = _resolve_agent_folder(folder)
    module_name = f"injected_agent_{uuid.uuid4().hex}"
    spec = importlib.util.spec_from_file_location(
        module_name, agent_folder / "agent.py", submodule_search_locations=[str(agent_folder)]
    )
    if spec is None or spec.loader is None:
        raise ValueError("Could not load agent.py.")
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    try:
        spec.loader.exec_module(module)
        adapter = module.create_agent() if callable(getattr(module, "create_agent", None)) else getattr(module, "agent", None)
    except Exception as exc:
        sys.modules.pop(module_name, None)
        raise ValueError(f"Could not initialize agent adapter: {type(exc).__name__}: {exc}") from exc
    required = ("get_tool_schemas", "get_system_prompt", "run")
    if adapter is None or any(not callable(getattr(adapter, method, None)) for method in required):
        raise ValueError("agent.py must export create_agent() or agent with get_tool_schemas(), get_system_prompt(), and run().")
    return adapter


def mock_handlers(tool_schemas: list[dict[str, Any]]) -> dict[str, Any]:
    """Create non-networked fake tools for every tool declared by an imported agent."""
    return {
        str(tool["name"]): (lambda tool_name: lambda **arguments: {"mocked": True, "tool": tool_name, "arguments": arguments})(str(tool["name"]))
        for tool in tool_schemas if tool.get("name")
    }


store = Store(Path(os.getenv("RELIABILITY_API_STORE", DEFAULT_STORE)))
gemini_runtime: dict[str, str | None] = {
    "api_key": os.getenv("GOOGLE_API_KEY"),
    "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
}
app = FastAPI(title="Agent Reliability API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/providers/gemini")
def gemini_status() -> dict[str, Any]:
    """Expose configuration state without ever returning the API key."""
    return {
        "configured": bool(gemini_runtime["api_key"]),
        "model": gemini_runtime["model"],
        "package_installed": _gemini_package_installed(),
    }


def _gemini_package_installed() -> bool:
    return importlib.util.find_spec("langchain_google_genai") is not None


@app.put("/api/providers/gemini")
def configure_gemini(payload: GeminiConfiguration) -> dict[str, Any]:
    """Set a local runtime key; it is never persisted or returned by this API."""
    gemini_runtime["api_key"] = payload.api_key.strip()
    gemini_runtime["model"] = payload.model.strip()
    # The bundled adapter and optional evaluator read these environment values.
    # They live only for this backend process and disappear on restart.
    os.environ["GOOGLE_API_KEY"] = gemini_runtime["api_key"]
    os.environ["GEMINI_MODEL"] = gemini_runtime["model"]
    return {"configured": True, "model": gemini_runtime["model"], "package_installed": _gemini_package_installed()}


@app.get("/api/agents")
def list_agents() -> list[dict[str, Any]]:
    return store.list_agents()


@app.post("/api/agents", status_code=status.HTTP_201_CREATED)
def create_agent(payload: AgentCreate) -> dict[str, Any]:
    try:
        return store.create_agent(payload)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@app.post("/api/agents/import", status_code=status.HTTP_201_CREATED)
def import_agent(payload: AgentImport) -> dict[str, Any]:
    """Register a trusted local agent package without connecting it to real tools."""
    try:
        adapter = load_agent_adapter(payload.folder)
        tool_schemas = adapter.get_tool_schemas()
        if not isinstance(tool_schemas, list):
            raise ValueError("get_tool_schemas() must return a list of tool schemas.")
        return store.create_agent(AgentCreate(
            name=payload.name or Path(payload.folder).name,
            description=payload.description,
            domain=payload.domain,
            system_prompt=adapter.get_system_prompt(),
            tool_schemas=tool_schemas,
            allow_destructive_actions=any(tool.get("destructive", False) for tool in tool_schemas),
            adapter_path=payload.folder,
        ))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/agents/{agent_id}")
def get_agent(agent_id: str) -> dict[str, Any]:
    agent = store.get_agent(agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found.")
    return agent


@app.get("/api/runs")
def list_runs(limit: int = 20) -> list[dict[str, Any]]:
    return store.list_runs()[:max(1, min(limit, 100))]


@app.get("/api/runs/{run_id}")
def get_run(run_id: str) -> dict[str, Any]:
    run = next((item for item in store.list_runs() if item["id"] == run_id), None)
    if run is None:
        raise HTTPException(status_code=404, detail="Evaluation run not found.")
    return run


@app.post("/api/agents/{agent_id}/scenarios")
def generate_scenarios(agent_id: str, request: ScenarioRequest) -> list[dict[str, Any]]:
    """Generate a preview batch without running agent tools or saving a scorecard."""
    agent_record = store.get_agent(agent_id)
    if agent_record is None:
        raise HTTPException(status_code=404, detail="Agent not found.")
    schemas = agent_record.get("tool_schemas", [])
    scenarios = ScenarioGenerator(EvaluatorLLM()).generate(
        agent_record["name"], agent_record["system_prompt"], schemas, agent_record["domain"], request.scenarios_per_type
    )
    return [scenario.model_dump(mode="json") for scenario in scenarios]


@app.post("/api/agents/{agent_id}/evaluate", status_code=status.HTTP_201_CREATED)
def evaluate_agent(agent_id: str, request: EvaluationRequest) -> dict[str, Any]:
    """Run the registered configuration through the bundled sandboxed sample adapter.

    The engine remains adapter-based: replace ``SampleSupportAgent`` here with a
    production AgentAdapter to execute a real deployed agent.
    """
    agent_record = store.get_agent(agent_id)
    if agent_record is None:
        raise HTTPException(status_code=404, detail="Agent not found.")

    runtime_agent = load_agent_adapter(agent_record["adapter_path"]) if agent_record.get("adapter_path") else SampleSupportAgent()
    if getattr(runtime_agent, "requires_google_api_key", False) and not gemini_runtime["api_key"]:
        raise HTTPException(status_code=422, detail="GOOGLE_API_KEY is required to evaluate the Gemini agent.")
    if getattr(runtime_agent, "requires_google_api_key", False) and not _gemini_package_installed():
        raise HTTPException(status_code=422, detail="Install the Gemini extra first: uv sync --extra gemini")
    graph = build_reliability_graph(runtime_agent, EvaluatorLLM())
    history_path = APP_DIR / "data" / "reliability_history.json"
    tool_schemas = agent_record.get("tool_schemas") or runtime_agent.get_tool_schemas()
    destructive_tools = {str(tool["name"]) for tool in tool_schemas if tool.get("destructive") and tool.get("name")}
    state = graph.invoke({
        "agent_name": agent_record["name"],
        "agent_system_prompt": agent_record["system_prompt"],
        "tool_schemas": tool_schemas,
        "tool_handlers": mock_handlers(tool_schemas) if agent_record.get("adapter_path") else build_tool_handlers(),
        "destructive_tools": destructive_tools,
        "domain": agent_record["domain"],
        "n_per_type": request.scenarios_per_type,
        "history_path": str(history_path),
    })
    scorecard = state["scorecard"].model_dump(mode="json")
    run = {
        **scorecard,
        "id": scorecard.pop("run_id"),
        "agent_id": agent_id,
        "created_at": _now(),
        "duration_seconds": round(sum(trace.wall_clock_seconds for trace in state["traces"]), 2),
        "failure_labels": [item.model_dump(mode="json") for item in state["failure_labels"]],
        "guardrail_results": [item.model_dump(mode="json") for item in state["guardrail_results"]],
        "scenarios": [item.model_dump(mode="json") for item in state["scenarios"]],
        "traces": [item.to_replay_json() for item in state["traces"]],
    }
    store.add_run(agent_id, run)
    return run


@app.get("/api/analysis/failures")
def failure_analysis() -> dict[str, Any]:
    modes: dict[str, dict[str, Any]] = {}
    for run in store.list_runs():
        traces = {trace["scenario_id"]: trace for trace in run.get("traces", [])}
        for label in run.get("failure_labels", []):
            if label.get("passed"):
                continue
            mode = label["failure_mode"]
            bucket = modes.setdefault(mode, {"count": 0, "incidents": []})
            bucket["count"] += 1
            bucket["incidents"].append({
                "run_id": run["id"], "agent_name": run["agent_name"], "scenario_id": label["scenario_id"],
                "rationale": label["rationale"], "trace": traces.get(label["scenario_id"], {}),
            })
    return {"total_failures": sum(item["count"] for item in modes.values()), "modes": modes}


@app.get("/api/analysis/guardrails")
def guardrail_analysis() -> list[dict[str, Any]]:
    return [
        {"run_id": run["id"], "agent_name": run["agent_name"], **probe}
        for run in store.list_runs() for probe in run.get("guardrail_results", [])
    ]


@app.get("/api/analysis/regressions")
def regression_analysis() -> dict[str, Any]:
    series: dict[str, list[dict[str, Any]]] = {}
    for run in reversed(store.list_runs()):
        series.setdefault(run["agent_name"], []).append({
            "run_id": run["id"], "created_at": run["created_at"], "score": run["overall_reliability_score"],
            "pass_rate": run["pass_rate"], "regression_flags": run.get("regression_flags", []),
        })
    flags = [flag for runs in series.values() for run in runs for flag in run["regression_flags"]]
    return {"series": series, "regression_flags": flags}


@app.get("/api/dashboard")
def dashboard() -> dict[str, Any]:
    agents, runs = store.list_agents(), store.list_runs()
    failure_breakdown: dict[str, int] = {}
    for run in runs:
        for mode, count in run.get("failure_mode_breakdown", {}).items():
            failure_breakdown[mode] = failure_breakdown.get(mode, 0) + count
    return {
        "agents": agents,
        "recent_runs": runs[:10],
        "failure_breakdown": failure_breakdown,
        "summary": {
            "registered_agents": len(agents),
            "evaluated_agents": sum(agent["latest_score"] is not None for agent in agents),
            "average_reliability": round(sum(run["overall_reliability_score"] for run in runs) / len(runs), 2) if runs else None,
            "updated_at": _now(),
        },
    }


def run() -> None:
    import uvicorn
    uvicorn.run("reliability_api.main:app", host="0.0.0.0", port=8000, reload=True)

 
