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
