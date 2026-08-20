"""LangGraph CI pipeline: generation -> sandbox -> classification -> scorecard."""
from __future__ import annotations

from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from .failure_classifier import FailureClassifier
from .guardrail_tester import GuardrailTester
from .llm import EvaluatorLLM
from .models import ExecutionTrace, FailureLabel, GuardrailResult, ReliabilityScorecard, Scenario
from .sandbox import AgentAdapter, SandboxExecutor
from .scenario_generator import ScenarioGenerator
from .scorecard import ScorecardBuilder


class PipelineState(TypedDict, total=False):
    agent_name: str
    agent_system_prompt: str
    tool_schemas: list[dict[str, Any]]
    tool_handlers: dict[str, Any]
    destructive_tools: set[str]
    domain: str
    n_per_type: int
    history_path: str
    scenarios: list[Scenario]
    traces: list[ExecutionTrace]
    failure_labels: list[FailureLabel]
    guardrail_results: list[GuardrailResult]
    scorecard: ReliabilityScorecard


def build_reliability_graph(agent: AgentAdapter, evaluator_llm: EvaluatorLLM | None = None):
    llm = evaluator_llm or EvaluatorLLM()
    generator, classifier, guardrails = ScenarioGenerator(llm), FailureClassifier(llm), GuardrailTester()

    def generate(state: PipelineState):
        return {"scenarios": generator.generate(state["agent_name"], state["agent_system_prompt"], state["tool_schemas"], state["domain"], state.get("n_per_type", 3))}
    def sandbox(state: PipelineState):
        return {"traces": SandboxExecutor(agent, state["tool_handlers"], state["destructive_tools"]).run_batch(state["scenarios"])}
    def classify(state: PipelineState):
        by_id = {scenario.id: scenario for scenario in state["scenarios"]}
        return {"failure_labels": [classifier.classify(by_id[trace.scenario_id], trace) for trace in state["traces"]]}
    def guardrail(state: PipelineState):
        by_id = {scenario.id: scenario for scenario in state["scenarios"]}
        return {"guardrail_results": [result for trace in state["traces"] for result in guardrails.evaluate(by_id[trace.scenario_id], trace)]}
    def scorecard(state: PipelineState):
        return {"scorecard": ScorecardBuilder(state.get("history_path", "reliability_history.json")).build(state["agent_name"], state["failure_labels"], state["guardrail_results"])}
    graph = StateGraph(PipelineState)
    for name, node in (("generate_scenarios", generate), ("run_sandbox", sandbox), ("classify_failures", classify), ("run_guardrails", guardrail), ("build_scorecard", scorecard)):
        graph.add_node(name, node)
    graph.set_entry_point("generate_scenarios")
    graph.add_edge("generate_scenarios", "run_sandbox")
    graph.add_edge("run_sandbox", "classify_failures")
    graph.add_edge("classify_failures", "run_guardrails")
    graph.add_edge("run_guardrails", "build_scorecard")
    graph.add_edge("build_scorecard", END)
    return graph.compile()
