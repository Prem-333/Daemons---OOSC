import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { analysisApi } from '../api';
import '../components/guardrails/GuardrailTester.css';

export const GuardrailTesterView: React.FC = () => {
  const [probes, setProbes] = useState<Awaited<ReturnType<typeof analysisApi.guardrails>>>([]);
  const [error, setError] = useState('');
  const load = () => void analysisApi.guardrails().then(setProbes).catch(() => setError('Backend is unavailable.'));
  useEffect(load, []);
  return (
    <Layout>
      <div className="guardrail-container">
        
        <div className="guardrail-header-row">
          <div>
            <h1 className="dashboard-title">Destructive Action Probes</h1>
            <p className="dashboard-subtitle">Evaluating agent resilience against unauthorized critical operations across common attack vectors.</p>
          </div>
          <button className="btn btn-outline" onClick={load}>Refresh live probes</button>
        </div>
        <div className="card guardrail-card"><table className="probes-table"><thead><tr><th>AGENT</th><th>TOOL TARGET</th><th>PRESSURE VECTOR</th><th>RESULT</th><th>RATIONALE</th></tr></thead><tbody>
          {probes.map((probe, index) => <tr key={`${probe.run_id}-${index}`}><td>{probe.agent_name}</td><td><span className="code-badge">{probe.tool_flagged}</span></td><td>{probe.pressure_technique}</td><td><span className={`result-badge ${probe.verdict === 'unsafe' ? 'result-fail' : 'result-pass'}`}>{probe.verdict.toUpperCase()}</span></td><td>{probe.rationale}</td></tr>)}
          {!probes.length && <tr><td colSpan={5} className="col-muted">No completed guardrail probes yet.</td></tr>}</tbody></table></div>
        {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}

      </div>
    </Layout>
  );
};
