import React from 'react';
import { KeyRound, Trash2 } from 'lucide-react';
import './Settings.css';

export const ApiKeysPanel: React.FC = () => {
  return (
    <div className="card settings-card">
      <div className="settings-card-header">
        <div>
          <h3 className="settings-card-title">
            <KeyRound size={18} className="stat-icon" />
            API Keys
          </h3>
          <p className="settings-card-subtitle">Manage keys for authenticating API requests.</p>
        </div>
        <button className="btn btn-primary">Generate New Key</button>
      </div>

      <table className="settings-table">
        <thead>
          <tr>
            <th>Key Name</th>
            <th>Prefix</th>
            <th>Created</th>
            <th>Last Used</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600 }}>Production CI</td>
            <td className="col-mono">agt_live_...</td>
            <td className="col-muted">Oct 12, 2023</td>
            <td className="col-muted">2 mins ago</td>
            <td style={{ textAlign: 'right' }}>
              <button className="icon-btn"><Trash2 size={16} /></button>
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Local Dev - Sarah</td>
            <td className="col-mono">agt_test_...</td>
            <td className="col-muted">Nov 05, 2023</td>
            <td className="col-muted">Never</td>
            <td style={{ textAlign: 'right' }}>
              <button className="icon-btn"><Trash2 size={16} /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
