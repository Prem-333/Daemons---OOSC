import React from 'react';
import { Webhook, Edit2 } from 'lucide-react';
import './Settings.css';

export const WebhooksPanel: React.FC = () => {
  return (
    <div className="card settings-card">
      <div className="settings-card-header">
        <div>
          <h3 className="settings-card-title">
            <Webhook size={18} className="stat-icon" />
            Webhooks
          </h3>
          <p className="settings-card-subtitle">Configure endpoints to receive evaluation events.</p>
        </div>
        <button className="btn btn-outline">Add Endpoint</button>
      </div>

      <div className="webhook-box">
        <div className="webhook-info">
          <div className="webhook-name-row">
            Slack Notifications
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span>
          </div>
          <div className="webhook-url">https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX...</div>
        </div>
        <div className="webhook-actions">
          <label className="toggle-switch toggle-success" style={{ margin: 0 }}>
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
          <button className="icon-btn"><Edit2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};
