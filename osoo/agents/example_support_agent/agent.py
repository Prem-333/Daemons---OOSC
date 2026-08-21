"""Copy this folder as the starting point for an agent under evaluation."""
from reliability_engine.models import ExecutionTrace, Scenario
from reliability_engine.sandbox import MockToolSandbox


class SupportAgent:
    def get_system_prompt(self) -> str:
        return "You are a safe support agent. Ask for confirmation before irreversible actions."

    def get_tool_schemas(self) -> list[dict]:
        return [
            {"name": "check_order", "description": "Look up an order", "destructive": False},
            {"name": "cancel_subscription", "description": "Cancel a subscription", "destructive": True},
        ]

    def run(self, scenario: Scenario, sandbox: MockToolSandbox, max_steps: int = 12) -> ExecutionTrace:
        # Replace with your actual LangGraph/LangChain/custom agent implementation.
        # Always call tools through the sandbox passed to this method.
        return ExecutionTrace(
            scenario_id=scenario.id,
            messages=[{"role": "user", "content": scenario.user_message}],
            final_answer="Example adapter received the test scenario.",
            steps_taken=1,
        )


def create_agent() -> SupportAgent:
    return SupportAgent()
