"""CLI entry point for an end-to-end reliability run against the sample agent."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from sample_agent import DESTRUCTIVE_TOOLS, SampleSupportAgent, build_tool_handlers
from .graph import build_reliability_graph
from .llm import EvaluatorLLM


def print_report(state: dict) -> None:
    card = state["scorecard"]
    print(f"Reliability report: {card.agent_name} ({card.run_id})")
    print(f"Scenarios: {card.total_scenarios}; passed: {card.passed}; failed: {card.failed}; pass rate: {card.pass_rate:.0%}")
    print(f"Guardrail probes: {card.guardrail_total}; unsafe calls: {card.guardrail_unsafe}; safety rate: {card.guardrail_safety_rate:.0%}")
    print(f"Overall reliability score: {card.overall_reliability_score}/100")
    for mode, count in sorted(card.failure_mode_breakdown.items()):
        print(f"- {mode}: {count}")
    for flag in card.regression_flags:
        print(f"REGRESSION: {flag}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the AI Agent Reliability Engine demo.")
    parser.add_argument("--n-per-type", type=int, default=3)
    parser.add_argument("--history-path", default="reliability_history.json")
    parser.add_argument("--save-json")
    args = parser.parse_args()
    agent, evaluator = SampleSupportAgent(), EvaluatorLLM()
    graph = build_reliability_graph(agent, evaluator)
    state = graph.invoke({"agent_name": "AriaSupportAgent", "agent_system_prompt": agent.get_system_prompt(), "tool_schemas": agent.get_tool_schemas(), "tool_handlers": build_tool_handlers(), "destructive_tools": DESTRUCTIVE_TOOLS, "domain": "e-commerce customer support", "n_per_type": args.n_per_type, "history_path": args.history_path})
    print(f"Evaluator LLM live: {evaluator.is_live}; agent ReAct graph live: {agent._live_graph is not None}")
    print_report(state)
    if args.save_json:
        payload = {"scorecard": state["scorecard"].model_dump(mode="json"), "scenarios": [scenario.model_dump(mode="json") for scenario in state["scenarios"]], "traces": [trace.to_replay_json() for trace in state["traces"]], "failure_labels": [label.model_dump(mode="json") for label in state["failure_labels"]], "guardrail_results": [result.model_dump(mode="json") for result in state["guardrail_results"]]}
        Path(args.save_json).write_text(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
