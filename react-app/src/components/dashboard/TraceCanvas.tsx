import React from 'react';
import { GitBranch } from 'lucide-react';
import './Dashboard.css';

export const TraceCanvas: React.FC = () => {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="text-h3">Trace Canvas</h3>
        <p className="text-muted text-body" style={{ marginTop: '0.25rem' }}>
          Select a failed run below to visualize the agent's thought process.
        </p>
      </div>
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="trace-canvas-container">
          <GitBranch className="trace-icon" />
          <span className="text-muted">No trace selected</span>
        </div>
      </div>
    </div>
  );
};
