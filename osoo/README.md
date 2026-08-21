# AI Agent Evaluation and Reliability Engine

An evaluation pipeline for autonomous agents, built with LangGraph. It generates realistic and adversarial scenarios, executes an agent against mocked tools, labels failures, probes destructive-action guardrails, and stores a regression-aware reliability scorecard.

## Quick start

```bash
uv sync --extra dev
uv run python -m reliability_engine.demo --n-per-type 3
```

The default run is offline and deterministic. To use Gemini for scenario generation, failure classification, and the sample ReAct agent:

```bash
uv sync --extra gemini
export GOOGLE_API_KEY=...
uv run python -m reliability_engine.demo
```

The agent under test implements `AgentAdapter`, making it straightforward to replace `SampleSupportAgent` with an existing LangGraph or LangChain agent.

## API service

The separate backend exposes the agent registry and reliability runs to the React app.

```bash
uv sync --extra dev
uv run agent-reliability-api
```

It starts at `http://localhost:8000`; interactive API documentation is at
`http://localhost:8000/docs`. The local JSON store and evaluation history are
created under `osoo/data/` (and are intentionally not source code).

## Evaluate your own agent folder

Copy or place a trusted agent package in `osoo/agents/<your-agent>/agent.py`.
It must expose `create_agent()` (or `agent`) with the `AgentAdapter` methods:
`get_tool_schemas`, `get_system_prompt`, and `run`. Import the folder name from
the Agent Registry, then choose **Evaluate**. The engine only supplies mocked
tools to that adapter, so its test execution cannot reach your business tools.

See [`agents/README.md`](agents/README.md) and `example_support_agent` for the
full contract. Importing Python executes its code, so only import locally
trusted packages; use a container or VM for third-party agent code.

### Live Gemini demo agent

The included `agents/gemini_support_agent` is a Gemini-powered LangGraph Aria
support agent. Configure the optional dependency and key before starting the API:

```bash
uv sync --extra gemini
export GOOGLE_API_KEY="your-key"
uv run agent-reliability-api
```

Then import `gemini_support_agent` from the Registry. It uses Gemini for
reasoning, but every tool invocation goes through a fake evaluation tool.

You can alternatively paste the key into **Settings → Gemini API Key**. That
stores it only in the running backend process; it is not written to the project
or returned to the browser after submission.
