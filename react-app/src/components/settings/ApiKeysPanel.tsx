import React, { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { providerApi } from '../../api';
import './Settings.css';

export const ApiKeysPanel: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [configured, setConfigured] = useState(false);
  const [packageInstalled, setPackageInstalled] = useState(true);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void providerApi.geminiStatus()
      .then((status) => { setConfigured(status.configured); setModel(status.model); setPackageInstalled(status.package_installed); })
      .catch(() => setMessage('Backend is unavailable. Start the API service on port 8000.'));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true); setMessage('');
      const status = await providerApi.configureGemini(apiKey, model);
      setConfigured(status.configured); setPackageInstalled(status.package_installed); setApiKey('');
      setMessage('Gemini is configured for this backend session.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save Gemini configuration.'); }
    finally { setSaving(false); }
  };

  return (
    <form className="card settings-card" onSubmit={save}>
      <div className="settings-card-header">
        <div>
          <h3 className="settings-card-title">
            <KeyRound size={18} className="stat-icon" />
            Gemini API Key
          </h3>
          <p className="settings-card-subtitle">Used only by the local backend to evaluate the live Gemini agent.</p>
        </div>
        <span className={`badge ${configured ? 'badge-success' : 'badge-error'}`}>{configured ? 'Configured' : 'Not configured'}</span>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <input className="form-control" type="password" autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Paste your Gemini API key" required />
        <input className="form-control" value={model} onChange={(event) => setModel(event.target.value)} placeholder="Gemini model name" required />
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save for this session'}</button>
        <p className="text-small text-muted" style={{ margin: 0 }}>The key is never returned, displayed, or saved to the project. Restarting the backend clears it.</p>
        {!packageInstalled && <p style={{ color: 'var(--color-error)', margin: 0, fontSize: '0.8rem' }}>Run <code>uv sync --extra gemini</code> before evaluating the Gemini agent.</p>}
        {message && <p style={{ color: message.includes('configured') ? 'var(--color-success)' : 'var(--color-error)', margin: 0, fontSize: '0.8rem' }}>{message}</p>}
      </div>
    </form>
  );
};
