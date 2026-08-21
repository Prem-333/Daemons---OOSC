import React from 'react';
import type { Run } from '../../api';
import './Dashboard.css';

interface RunData {
  target: string;
  version: string;
  batch: string;
  scenarios: string;
  passRate: string;
  status: 'PASS' | 'FAILED';
  timestamp: string;
}

const mockRuns: RunData[] = [
  {
    target: 'Customer Support',
    version: 'v2.1.4-rc',
    batch: 'edge-cases-q3',
    scenarios: '1,250',
    passRate: '99.1%',
    status: 'PASS',
    timestamp: '2 mins ago',
  },
  {
    target: 'Code Review',
    version: 'v1.9.0-beta',
    batch: 'security-audit-full',
    scenarios: '850',
    passRate: '72.4%',
    status: 'FAILED',
    timestamp: '15 mins ago',
  }
];

export const RecentRunsTable: React.FC<{ runs?: Run[] }> = ({ runs }) => {
  const displayedRuns = runs === undefined ? mockRuns : runs.map((run) => ({
    target: run.agent_name,
    version: run.id,
    batch: 'reliability evaluation',
    scenarios: run.total_scenarios.toLocaleString(),
    passRate: `${(run.pass_rate * 100).toFixed(1)}%`,
    status: run.regression_flags.length ? 'FAILED' as const : 'PASS' as const,
    timestamp: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(run.created_at)),
  }));
  return (
    <div className="card" style={{ marginTop: '1.25rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-h3">Recent Evaluated Runs</h3>
        <a href="#" className="text-small" style={{ color: 'var(--color-primary)' }}>View All Logs</a>
      </div>
      <div className="recent-runs-table-wrapper">
        <table className="runs-table">
          <thead>
            <tr>
              <th>AGENT TARGET</th>
              <th>VERSION</th>
              <th>SCENARIO BATCH</th>
              <th>SCENARIOS</th>
              <th>PASS RATE</th>
              <th>STATUS</th>
              <th>TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {displayedRuns.map((run, i) => (
              <tr key={i}>
                <td className="col-mono">{run.target}</td>
                <td className="col-mono col-muted">{run.version}</td>
                <td className="col-mono">{run.batch}</td>
                <td className="col-mono" style={{ textAlign: 'right', paddingRight: '2rem' }}>{run.scenarios}</td>
                <td className="col-mono">{run.passRate}</td>
                <td>
                  <span className={`badge ${run.status === 'PASS' ? 'badge-success' : 'badge-error'}`}>
                    {run.status}
                  </span>
                </td>
                <td className="col-mono col-muted">{run.timestamp}</td>
              </tr>
            ))}
            {displayedRuns.length === 0 && <tr><td colSpan={7} className="col-muted" style={{ textAlign: 'center', padding: '2rem' }}>No evaluations yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
