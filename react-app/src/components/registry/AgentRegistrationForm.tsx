import React, { useState } from 'react';
import { Maximize2, FileJson, AlertTriangle } from 'lucide-react';
import { agentApi } from '../../api';
import './Registry.css';

export const AgentRegistrationForm: React.FC<{ onRegistered: () => void }> = ({ onRegistered }) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('General');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.\nYour goal is to answer questions concisely.\nDo not hallucinate tools.');
  const [toolSchema, setToolSchema] = useState('[]');
  const [agentFolder, setAgentFolder] = useState('');
  const [allowDestructiveActions, setAllowDestructiveActions] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    let parsedToolSchemas: Record<string, unknown>[];
    try {
      parsedToolSchemas = JSON.parse(toolSchema);
      if (!Array.isArray(parsedToolSchemas)) throw new Error();
    } catch { setError('Tool schemas must be a JSON array.'); return; }
    try {
      setSaving(true);
      await agentApi.create({ name, domain, description, system_prompt: systemPrompt, tool_schemas: parsedToolSchemas, allow_destructive_actions: allowDestructiveActions, adapter_path: null });
      setName(''); setDescription(''); setToolSchema('[]'); onRegistered();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not register agent.'); }
    finally { setSaving(false); }
  };

  const importPackage = async () => {
    if (!agentFolder.trim()) { setError('Enter an agent folder name to import.'); return; }
    try {
      setSaving(true); setError('');
      await agentApi.import(agentFolder.trim(), description || 'Imported agent package', domain);
      setAgentFolder(''); onRegistered();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not import agent package.'); }
    finally { setSaving(false); }
  };

  const importGeminiAgent = async () => {
    try {
      setSaving(true); setError('');
      await agentApi.import('gemini_support_agent', 'Live Gemini-powered Aria customer-support agent evaluated with mocked tools.', 'E-commerce Support');
      onRegistered();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not import the Gemini agent.'); }
    finally { setSaving(false); }
  };

  return (
    <form className="card registration-form-card" onSubmit={submit}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="form-group">
          <div className="form-label">IMPORT AGENT PACKAGE</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input className="form-control" value={agentFolder} onChange={(event) => setAgentFolder(event.target.value)} placeholder="example_support_agent" />
            <button className="btn btn-outline" type="button" onClick={importPackage} disabled={saving}>Import folder</button>
          </div>
          <p className="text-small text-muted" style={{ margin: '0.4rem 0 0' }}>Folder must be inside <code>osoo/agents</code> and contain agent.py.</p>
          <button className="btn btn-outline" type="button" onClick={importGeminiAgent} disabled={saving} style={{ marginTop: '0.5rem' }}>Import included live Gemini agent</button>
          <p className="text-small text-muted" style={{ margin: '0.35rem 0 0' }}>Requires <code>GOOGLE_API_KEY</code> and <code>uv sync --extra gemini</code> before evaluation.</p>
        </div>
        <div className="form-group">
          <div className="form-label">AGENT NAME</div>
          <input className="form-control" value={name} onChange={(event) => setName(event.target.value)} placeholder="CustomerSupport_v2" required />
        </div>
        <div className="form-group">
          <div className="form-label">DOMAIN</div>
          <input className="form-control" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="Support" required />
        </div>
        <div className="form-group">
          <div className="form-label">DESCRIPTION</div>
          <textarea 
            className="form-control" 
            placeholder="Describe the agent's primary purpose..."
            rows={3} value={description} onChange={(event) => setDescription(event.target.value)} required
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
              value={systemPrompt} onChange={(event) => setSystemPrompt(event.target.value)}
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
            value={toolSchema} onChange={(event) => setToolSchema(event.target.value)}
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
            <input type="checkbox" checked={allowDestructiveActions} onChange={(event) => setAllowDestructiveActions(event.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="action-row">
          <button className="btn btn-outline" type="reset">Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Registering…' : '+ Register Agent'}</button>
        </div>
        {error && <p style={{ color: 'var(--color-error)', margin: '0.75rem 0 0', fontSize: '0.8rem' }}>{error}</p>}

      </div>
    </form>
  );
};
