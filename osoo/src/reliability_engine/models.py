"""Serializable data models shared by every stage of the evaluation graph."""
from __future__ import annotations

import time
import uuid
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ScenarioType(str, Enum):
    REALISTIC = "realistic"
    ADVERSARIAL = "adversarial"
    AMBIGUOUS = "ambiguous"
    DESTRUCTIVE_PRESSURE = "destructive_pressure"


class Scenario(BaseModel):
    id: str = Field(default_factory=lambda: f"scn_{uuid.uuid4().hex[:8]}")
    type: ScenarioType
    title: str
    user_message: str
    success_criteria: str
    unsafe_if_called: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class ToolCallRecord(BaseModel):
    tool_name: str
    arguments: dict[str, Any]
    result: Any
    is_destructive: bool = False
    confirmed_by_user: bool = False
    timestamp: float = Field(default_factory=time.time)


class ExecutionTrace(BaseModel):
    scenario_id: str
    messages: list[dict[str, str]] = Field(default_factory=list)
    tool_calls: list[ToolCallRecord] = Field(default_factory=list)
    final_answer: str = ""
    steps_taken: int = 0
    wall_clock_seconds: float = 0.0
    raised_exception: str | None = None
    hit_step_limit: bool = False

    def to_replay_json(self) -> dict[str, Any]:
        """JSON-safe trace payload suitable for CI artifacts and regression diffs."""
        return self.model_dump(mode="json")


class FailureMode(str, Enum):
    NONE = "none"
    TOOL_CALL_LOOP = "tool_call_loop"
    HALLUCINATED_CONFIDENCE = "hallucinated_confidence"
    UNSAFE_DESTRUCTIVE_ACTION = "unsafe_destructive_action"
    SILENT_GOAL_DRIFT = "silent_goal_drift"
    WRONG_ANSWER = "wrong_answer"
    INCOMPLETE_TASK = "incomplete_task"
    TIMEOUT_OR_STEP_LIMIT = "timeout_or_step_limit"
    UNHANDLED_EXCEPTION = "unhandled_exception"
    REFUSED_VALID_REQUEST = "refused_valid_request"


class FailureLabel(BaseModel):
    scenario_id: str
    failure_mode: FailureMode
    confidence: float = Field(ge=0.0, le=1.0)
    rationale: str
    passed: bool


class GuardrailResult(BaseModel):
    scenario_id: str
    tool_flagged: str
    action_taken_without_confirmation: bool
    pressure_technique: str
    verdict: str
    rationale: str


class ReliabilityScorecard(BaseModel):
    run_id: str = Field(default_factory=lambda: f"run_{uuid.uuid4().hex[:8]}")
    agent_name: str
    timestamp: float = Field(default_factory=time.time)
    total_scenarios: int
    passed: int
    failed: int
    pass_rate: float
    failure_mode_breakdown: dict[str, int]
    guardrail_total: int
    guardrail_unsafe: int
    guardrail_safety_rate: float
    overall_reliability_score: float
    regression_flags: list[str] = Field(default_factory=list)
