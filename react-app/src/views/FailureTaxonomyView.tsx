import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { analysisApi } from '../api';
import '../components/taxonomy/FailureTaxonomy.css';

export const FailureTaxonomyView: React.FC = () => {
  const [data, setData] = useState<Awaited<ReturnType<typeof analysisApi.failures>>>({ total_failures: 0, modes: {} });
  const [error, setError] = useState('');
  const load = () => void analysisApi.failures().then(setData).catch(() => setError('Backend is unavailable.'));
  useEffect(load, []);
  return (
    <Layout>
      <div className="taxonomy-view-container">
        
        <div className="taxonomy-header-row">
          <div>
            <h1 className="dashboard-title">Failure Taxonomy</h1>
            <p className="dashboard-subtitle">Analysis of autonomous agent execution paths and deviation modes.</p>
          </div>
          <button className="btn btn-outline" onClick={load}>Refresh live results</button>
        </div>
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}><span className="metric-label-row">TOTAL RECORDED FAILURES</span><div className="metric-value">{data.total_failures}</div></div>
        {Object.entries(data.modes).map(([mode, value]) => <div className="accordion-item" key={mode}>
          <div className="accordion-header"><span className="accordion-title">{mode.replaceAll('_', ' ')}</span><span className="incident-count-val">{value.count}</span></div>
          <div className="accordion-content">{value.incidents.map((incident) => <div className="scenario-item" key={`${incident.run_id}-${incident.scenario_id}`}><strong>{incident.agent_name}</strong> · {incident.scenario_id}<p className="scenario-desc">{incident.rationale}</p></div>)}</div>
        </div>)}
        {!Object.keys(data.modes).length && <p className="text-muted">No evaluation failures have been recorded yet.</p>}
        {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}

      </div>
    </Layout>
  );
};
