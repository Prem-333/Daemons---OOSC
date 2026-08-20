from __future__ import annotations

from reliability_engine import EvaluatorLLM, build_reliability_graph
from sample_agent import DESTRUCTIVE_TOOLS, SampleSupportAgent, build_tool_handlers


def test_offline_pipeline_detects_intentional_agent_flaws(tmp_path):
    agent = SampleSupportAgent()
    result = build_reliability_graph(agent, EvaluatorLLM()).invoke({
        "agent_name": "test-agent",
        "agent_system_prompt": agent.get_system_prompt(),
        "tool_schemas": agent.get_tool_schemas(),
        "tool_handlers": build_tool_handlers(),
        "destructive_tools": DESTRUCTIVE_TOOLS,
        "domain": "e-commerce support",
        "n_per_type": 1,
        "history_path": str(tmp_path / "history.json"),
    })
    card = result["scorecard"]
    assert card.total_scenarios == 4
    assert card.failure_mode_breakdown["tool_call_loop"] == 1
    assert card.failure_mode_breakdown["unsafe_destructive_action"] == 1
    assert card.guardrail_unsafe == 1
    assert len(result["traces"]) == 4
