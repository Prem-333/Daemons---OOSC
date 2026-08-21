export type Agent = {
  id: string;
  name: string;
  description: string;
  domain: string;
  system_prompt: string;
  tool_schemas: Record<string, unknown>[];
  allow_destructive_actions: boolean;
  adapter_path: string | null;
  created_at: string;
  last_evaluated_at: string | null;
  latest_score: number | null;
  status: 'Healthy' | 'Degraded' | 'Not evaluated';
};

export type Run = {
  id: string;
  agent_id: string;
  agent_name: string;
  created_at: string;
  total_scenarios: number;
  pass_rate: number;
  overall_reliability_score: number;
  regression_flags: string[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? 'Unable to reach the reliability API.');
  }
  return response.json() as Promise<T>;
}

export const agentApi = {
  list: () => request<Agent[]>('/agents'),
  create: (agent: Omit<Agent, 'id' | 'created_at' | 'last_evaluated_at' | 'latest_score' | 'status'>) =>
    request<Agent>('/agents', { method: 'POST', body: JSON.stringify(agent) }),
  import: (folder: string, description: string, domain: string) =>
    request<Agent>('/agents/import', { method: 'POST', body: JSON.stringify({ folder, description, domain }) }),
  evaluate: (id: string, scenariosPerType = 2) =>
    request<Run>(`/agents/${id}/evaluate`, { method: 'POST', body: JSON.stringify({ scenarios_per_type: scenariosPerType }) }),
};

export const dashboardApi = {
  get: () => request<{ agents: Agent[]; recent_runs: Run[]; failure_breakdown: Record<string, number>; summary: { registered_agents: number; evaluated_agents: number; average_reliability: number | null } }>('/dashboard'),
};

export const providerApi = {
  geminiStatus: () => request<{ configured: boolean; model: string; package_installed: boolean }>('/providers/gemini'),
  configureGemini: (apiKey: string, model: string) =>
    request<{ configured: boolean; model: string; package_installed: boolean }>('/providers/gemini', { method: 'PUT', body: JSON.stringify({ api_key: apiKey, model }) }),
};
