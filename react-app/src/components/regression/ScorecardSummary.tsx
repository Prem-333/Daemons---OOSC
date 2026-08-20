import React from 'react';
import './RegressionTracker.css';

interface ScorecardData {
  category: string;
  base: string;
  curr: string;
  status: 'Stable' | 'Regression' | 'Watch';
}

const mockScores: ScorecardData[] = [
  { category: 'Reasoning', base: '92.4', curr: '93.1', status: 'Stable' },
  { category: 'Code Gen', base: '88.7', curr: '74.2', status: 'Regression' },
  { category: 'Tool Use', base: '81.0', curr: '85.5', status: 'Watch' },
  { category: 'Context Recall', base: '96.2', curr: '96.0', status: 'Stable' },
];

export const ScorecardSummary: React.FC = () => {
  return (
    <div className="card scorecard-card">
      <h3 className="chart-title">Scorecard Summary</h3>
      
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Base</th>
            <th>Curr</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockScores.map((score, i) => (
            <tr key={i}>
              <td>{score.category}</td>
              <td className="col-mono">{score.base}</td>
              <td className="col-mono" style={{ color: score.status === 'Regression' ? 'var(--color-error)' : 'inherit' }}>
                {score.curr}
              </td>
              <td>
                <span className={`status-label status-${score.status.toLowerCase()}`}>
                  {score.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
