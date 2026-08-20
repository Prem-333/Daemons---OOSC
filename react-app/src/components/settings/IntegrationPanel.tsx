import React from 'react';
import { Terminal } from 'lucide-react';
import './Settings.css';

export const IntegrationPanel: React.FC = () => {
  return (
    <div className="card settings-card" style={{ height: '100%' }}>
      <div className="settings-card-header">
        <div>
          <h3 className="settings-card-title">
            <Terminal size={18} className="stat-icon" />
            CI/CD Integration
          </h3>
          <p className="settings-card-subtitle" style={{ marginTop: '0.75rem', lineHeight: 1.5 }}>
            Add AgentCI to your pipeline to automatically evaluate changes.
          </p>
        </div>
      </div>

      <div className="tabs-header">
        <button className="tab-btn active">GitHub Actions</button>
        <button className="tab-btn">GitLab CI</button>
      </div>

      <div className="code-block">
{`steps:
  - name: Checkout code
    uses: actions/checkout@v3
    
  - name: Run AgentCI Evals
    uses: agentci/eval-action@v1
    with:
      api-key: \${{ secrets.AGENTC
I_KEY }}
      fail-on-regression: true`}
      </div>
    </div>
  );
};
