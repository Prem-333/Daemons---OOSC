import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { analysisApi } from '../api';
import '../components/regression/RegressionTracker.css';

export const RegressionTrackerView: React.FC = () => {
  const [data, setData] = useState<Awaited<ReturnType<typeof analysisApi.regressions>>>({ series: {}, regression_flags: [] });
  useEffect(() => { void analysisApi.regressions().then(setData); }, []);
  return (
    <Layout>
      <div className="regression-container">
        
        <div className="regression-header-row">
          <div>
            <h1 className="dashboard-title">Regression Tracker</h1>
            <p className="dashboard-subtitle">Monitor performance drift across model versions and tool capabilities.</p>
          </div>
          <span className="text-muted">Based on completed evaluation runs</span>
        </div>
        {data.regression_flags.map((flag, index) => <div className="critical-alert" key={index}><div className="alert-content"><div className="alert-title">Regression detected</div><div className="alert-desc">{flag}</div></div></div>)}
        <div className="card scorecard-card"><h3 className="chart-title">Reliability history</h3><table className="scorecard-table"><thead><tr><th>Agent</th><th>Run</th><th>Reliability</th><th>Pass rate</th><th>Regression</th></tr></thead><tbody>
          {Object.entries(data.series).flatMap(([agent, runs]) => runs.map((run) => <tr key={run.run_id}><td>{agent}</td><td className="col-mono">{new Date(run.created_at).toLocaleString()}</td><td>{run.score.toFixed(1)}%</td><td>{(run.pass_rate * 100).toFixed(1)}%</td><td>{run.regression_flags.length ? 'Regression' : 'Stable'}</td></tr>))}
          {!Object.keys(data.series).length && <tr><td colSpan={5} className="col-muted">No evaluation history yet.</td></tr>}</tbody></table></div>

      </div>
    </Layout>
  );
};
