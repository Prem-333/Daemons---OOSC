# Agent packages

Place one trusted local agent package per folder here, then import it from the
Registry page using its folder name. For example, `example_support_agent` is
imported as `example_support_agent`.

Every package must contain `agent.py` and export either `create_agent()` or an
`agent` object. The object must implement:

```python
get_tool_schemas() -> list[dict]
get_system_prompt() -> str
run(scenario, sandbox, max_steps=12) -> ExecutionTrace
```

The evaluator gives the adapter a `MockToolSandbox`; tools declared in
`get_tool_schemas()` receive deterministic mock responses only. Do not place
untrusted code here: importing a Python package executes its code. Run unknown
agents inside a separate container or VM before importing them.

## Included live Gemini agent

`gemini_support_agent` is a real Gemini/LangGraph implementation of the Aria
support agent. Before importing and evaluating it, install the optional Gemini
dependency and set the key in the terminal that starts the backend:

```bash
uv sync --extra gemini
export GOOGLE_API_KEY="your-key"
# Optional: export GEMINI_MODEL="gemini-2.5-flash"
uv run agent-reliability-api
```

The agent can call only the evaluator's `MockToolSandbox` during an evaluation.
Gemini receives test prompts and tool descriptions, but no live business tool
is connected.
