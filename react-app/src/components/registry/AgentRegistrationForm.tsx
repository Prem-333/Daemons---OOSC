import React from 'react';
import { Maximize2, FileJson, AlertTriangle } from 'lucide-react';
import './Registry.css';

export const AgentRegistrationForm: React.FC = () => {
  return (
    <div className="card registration-form-card">
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <div className="form-group">
          <div className="form-label">DESCRIPTION</div>
          <textarea 
            className="form-control" 
            placeholder="Describe the agent's primary purpose..."
            rows={3}
          ></textarea>
        </div>

        <div className="form-group">
          <div className="form-label">
            SYSTEM PROMPT
            <button className="btn btn-outline" style={{ border: 'none', padding: 0, height: 'auto', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-primary)' }}>
              <Maximize2 size={12} /> Expand
            </button>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--color-bg-hover)', padding: '0.75rem 0.5rem', borderRight: '1px solid var(--color-border)', color: 'var(--color-text-light)', fontFamily: 'Space Mono, monospace', fontSize: '0.8125rem', textAlign: 'right', userSelect: 'none' }}>
              1<br/>2<br/>3<br/>4
            </div>
            <textarea 
              className="form-control textarea-prompt" 
              style={{ border: 'none', borderRadius: 0 }}
              defaultValue={`You are a helpful assistant.\nYour goal is to answer questions concisely.\nDo not hallucinate tools.`}
            ></textarea>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            TOOL SCHEMA
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              JSON <FileJson size={12} />
            </span>
          </div>
          <textarea 
            className="form-control textarea-json"
            defaultValue="{}"
          ></textarea>
        </div>

        <div className="destructive-alert">
          <div className="destructive-header">
            <AlertTriangle size={16} /> Allow Destructive Actions
          </div>
          <div className="destructive-desc">
            Permit this agent to use tools that modify or delete data.
          </div>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        <div className="action-row">
          <button className="btn btn-outline">Cancel</button>
          <button className="btn btn-primary">+ Register Agent</button>
        </div>

      </div>
    </div>
  );
};
