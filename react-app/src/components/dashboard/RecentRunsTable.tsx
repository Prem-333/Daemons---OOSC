import React from 'react';
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

export const RecentRunsTable: React.FC = () => {
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
            {mockRuns.map((run, i) => (
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
          </tbody>
        </table>
      </div>
    </div>
  );
};
