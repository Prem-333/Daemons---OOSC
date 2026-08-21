import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { agentApi, type Agent, type Scenario } from '../api';
import '../components/scenarios/ScenarioGenerator.css';

export const ScenarioGeneratorView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState('');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [message, setMessage] = useState('');
  useEffect(() => { void agentApi.list().then((items) => { setAgents(items); setAgentId(items[0]?.id ?? ''); }).catch(() => setMessage('Backend is unavailable.')); }, []);
  const generate = async () => {
    if (!agentId) return;
    try { setMessage('Generating scenarios…'); setScenarios(await agentApi.generateScenarios(agentId)); setMessage(''); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Scenario generation failed.'); }
  };
  return (
    <Layout>
      <div className="scenario-container">
        
        <div className="scenario-header">
          <h1 className="dashboard-title">Scenario Generator</h1>
          <p className="dashboard-subtitle">Configure and generate synthetic test batches for agent validation.</p>
        </div>

        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select className="select-control" value={agentId} onChange={(event) => setAgentId(event.target.value)}>
              <option value="">Select an imported agent</option>
              {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
            </select>
            <button className="btn btn-primary" onClick={generate} disabled={!agentId}>Generate real preview batch</button>
          </div>
          {message && <p style={{ color: 'var(--color-error)', marginBottom: 0 }}>{message}</p>}
        </div>
        <div className="card preview-card">
          <div className="preview-header"><div className="preview-title">Generated Scenario Pool ({scenarios.length})</div></div>
          {scenarios.length === 0 && <p className="text-muted" style={{ padding: '1rem' }}>Select an agent and generate a batch. Nothing is mocked on this screen.</p>}
          <div className="preview-list">{scenarios.map((scenario) => <div className="scenario-item" key={scenario.id}>
            <div className="scenario-id-row"><span className="scenario-id">{scenario.id}</span><span className="tag tag-realistic">{scenario.type}</span></div>
            <p className="scenario-desc">{scenario.user_message}</p><div className="scenario-expected"><span className="highlight">Expected: </span>{scenario.success_criteria}</div>
          </div>)}</div>
        </div>

      </div>
    </Layout>
  );
};
