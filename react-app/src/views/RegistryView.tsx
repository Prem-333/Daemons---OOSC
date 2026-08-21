import React, { useCallback, useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { AgentListTable } from '../components/registry/AgentListTable';
import { AgentRegistrationForm } from '../components/registry/AgentRegistrationForm';
import { agentApi, type Agent } from '../api';
import '../components/registry/Registry.css';

export const RegistryView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState('');
  const [evaluatingId, setEvaluatingId] = useState<string>();
  const loadAgents = useCallback(async () => {
    try { setAgents(await agentApi.list()); setError(''); }
    catch { setError('Backend is unavailable. Start the API service on port 8000.'); }
  }, []);
  useEffect(() => { void loadAgents(); }, [loadAgents]);
  const evaluate = async (agentId: string) => {
    try { setEvaluatingId(agentId); await agentApi.evaluate(agentId); await loadAgents(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Evaluation failed.'); }
    finally { setEvaluatingId(undefined); }
  };
  return (
    <Layout>
      <div className="registry-container">
        
        {/* Header Section */}
        <div className="registry-header">
          <h1 className="dashboard-title">Agent Registry</h1>
          <p className="dashboard-subtitle">Manage and monitor connected AI agents.</p>
        </div>

        {/* Content Area */}
        <div className="registry-content">
          <AgentListTable agents={agents} onEvaluate={evaluate} evaluatingId={evaluatingId} />
          <AgentRegistrationForm onRegistered={loadAgents} />
        </div>
        {error && <p style={{ color: 'var(--color-error)', marginTop: '1rem' }}>{error}</p>}

      </div>
    </Layout>
  );
};
