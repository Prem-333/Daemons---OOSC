"""Optional LangChain evaluator model, with an offline deterministic fallback."""
from __future__ import annotations

import json
import os
import re
from collections.abc import Callable
from typing import Any


def _strip_json_fences(text: str) -> str:
    return re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.IGNORECASE).strip()


class EvaluatorLLM:
    def __init__(self, model: str = "gemini-2.5-flash", temperature: float = 0.0):
        self.model_name = model
        self.temperature = temperature
        self._client: Any = None
        if os.environ.get("GOOGLE_API_KEY"):
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI

                self._client = ChatGoogleGenerativeAI(model=model, temperature=temperature)
            except ImportError:
                pass

    @property
    def is_live(self) -> bool:
        return self._client is not None

    def complete_json(self, system: str, user: str, stub_fn: Callable[[], dict | list]) -> dict | list:
        if not self._client:
            return stub_fn()
        try:
            from langchain_core.messages import HumanMessage, SystemMessage
            response = self._client.invoke([SystemMessage(content=system), HumanMessage(content=user)])
            return json.loads(_strip_json_fences(str(response.content)))
        except (json.JSONDecodeError, RuntimeError, ValueError):
            return stub_fn()
