import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ApiKeysPanel } from '../components/settings/ApiKeysPanel';
import { WebhooksPanel } from '../components/settings/WebhooksPanel';
import { IntegrationPanel } from '../components/settings/IntegrationPanel';
import { Info } from 'lucide-react';
import '../components/settings/Settings.css';

export const SettingsView: React.FC = () => {
  return (
    <Layout>
      <div className="settings-container">
        
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="dashboard-title">Settings & Integrations</h1>
          <p className="dashboard-subtitle">Manage your API keys, configure webhooks, and integrate AgentCI into your existing CI/CD pipelines.</p>
        </div>

        <div className="settings-grid">
          
          <div className="settings-left-col">
            <ApiKeysPanel />
            <WebhooksPanel />
            
            <div className="info-alert-full">
              <div style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
                <Info size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                  Require Passing Evaluations
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  When configured in your CI provider (e.g., branch protection rules in GitHub), setting <span className="code-inline">fail-on-regression: true</span> will block pull requests if agent performance degrades below configured thresholds.
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <IntegrationPanel />
          </div>

        </div>

      </div>
    </Layout>
  );
};
