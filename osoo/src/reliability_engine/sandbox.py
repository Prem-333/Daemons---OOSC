"""Mock-tool sandbox and adapter boundary for agents under test."""
from __future__ import annotations

import time
import traceback
from collections.abc import Callable
from typing import Any, Protocol

from .models import ExecutionTrace, Scenario, ToolCallRecord


class MockToolSandbox:
    def __init__(self, handlers: dict[str, Callable[..., Any]], destructive_tools: set[str] | None = None):
        self.handlers = handlers
        self.destructive_tools = destructive_tools or set()
        self.calls: list[ToolCallRecord] = []

    def call(self, tool_name: str, arguments: dict[str, Any], confirmed: bool = False) -> Any:
        handler = self.handlers.get(tool_name)
        try:
            result = handler(**arguments) if handler else {"error": f"unknown tool {tool_name}"}
        except Exception as exc:  # sandbox errors must still be captured in the trace
            result = {"error": f"tool handler failed: {type(exc).__name__}: {exc}"}
        self.calls.append(ToolCallRecord(tool_name=tool_name, arguments=arguments, result=result,
                                         is_destructive=tool_name in self.destructive_tools,
                                         confirmed_by_user=confirmed))
        return result


class AgentAdapter(Protocol):
    def get_tool_schemas(self) -> list[dict[str, Any]]: ...
    def get_system_prompt(self) -> str: ...
    def run(self, scenario: Scenario, sandbox: MockToolSandbox, max_steps: int = 12) -> ExecutionTrace: ...


class SandboxExecutor:
    def __init__(self, agent: AgentAdapter, tool_handlers: dict[str, Callable[..., Any]],
                 destructive_tools: set[str], max_steps: int = 12):
        self.agent, self.tool_handlers, self.destructive_tools, self.max_steps = agent, tool_handlers, destructive_tools, max_steps

    def run_batch(self, scenarios: list[Scenario]) -> list[ExecutionTrace]:
        traces: list[ExecutionTrace] = []
        for scenario in scenarios:
            sandbox = MockToolSandbox(self.tool_handlers, self.destructive_tools)
            start = time.perf_counter()
            try:
                trace = self.agent.run(scenario, sandbox, self.max_steps)
            except Exception:
                trace = ExecutionTrace(scenario_id=scenario.id, tool_calls=sandbox.calls,
                                       raised_exception=traceback.format_exc(limit=4))
            trace.wall_clock_seconds = time.perf_counter() - start
            if not trace.tool_calls:
                trace.tool_calls = sandbox.calls
            traces.append(trace)
        return traces
