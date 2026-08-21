import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getActiveSessionId, sessionApi, setActiveSessionId, type EvaluationSession } from '../../api';
import './Sidebar.css';
import {
  LayoutDashboard, 
  Archive, 
  FlaskConical, 
  PlayCircle, 
  Bug, 
  ShieldCheck, 
  TrendingUp, 
  Settings, Pencil, Trash2, Check, X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Registry', path: '/registry', icon: Archive },
  { label: 'Scenario Generator', path: '/scenario-generator', icon: FlaskConical },
  { label: 'Replay Viewer', path: '/replay-viewer', icon: PlayCircle },
  { label: 'Failure Taxonomy', path: '/failure-taxonomy', icon: Bug },
  { label: 'Guardrail Tester', path: '/guardrail-tester', icon: ShieldCheck },
  { label: 'Regression Tracker', path: '/regression-tracker', icon: TrendingUp },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [sessions, setSessions] = useState<EvaluationSession[]>([]);
  const [activeId, setActiveId] = useState(getActiveSessionId());
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string>();
  const [editingName, setEditingName] = useState('');
  const loadSessions = async () => {
    try {
      const items = await sessionApi.list();
      setSessions(items);
      if (!getActiveSessionId() && items[0]) { setActiveSessionId(items[0].id); setActiveId(items[0].id); }
      if (!getActiveSessionId() && !items.length) {
        const created = await sessionApi.create();
        setSessions([created]); setActiveSessionId(created.id); setActiveId(created.id);
      }
    } catch { setError('Session history unavailable'); }
  };
  useEffect(() => { void loadSessions(); }, []);
  const newSession = async () => {
    try {
      const created = await sessionApi.create();
      setSessions((items) => [created, ...items]); setActiveSessionId(created.id); setActiveId(created.id);
    } catch { setError('Could not create session'); }
  };
  const selectSession = (id: string) => { setActiveSessionId(id); setActiveId(id); };
  const beginRename = (session: EvaluationSession) => { setEditingId(session.id); setEditingName(session.name); };
  const saveRename = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      const updated = await sessionApi.rename(id, name);
      setSessions((items) => items.map((item) => item.id === id ? { ...item, ...updated } : item));
      setEditingId(undefined);
    } catch { setError('Could not rename session'); }
  };
  const deleteSession = async (session: EvaluationSession) => {
    if (!window.confirm(`Delete “${session.name}”? This permanently removes its agents, runs, and replay traces.`)) return;
    try {
      await sessionApi.delete(session.id);
      const remaining = sessions.filter((item) => item.id !== session.id);
      setSessions(remaining);
      if (activeId === session.id) {
        const next = remaining[0] ?? await sessionApi.create();
        if (!remaining.length) setSessions([next]);
        setActiveSessionId(next.id); setActiveId(next.id);
      }
    } catch { setError('Could not delete session'); }
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">AgentCI</span>
        </div>
        <div className="version-tag">v1.2.4</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="session-history">
        <div className="session-history-header"><span>SESSION HISTORY</span><button className="new-session-button" onClick={newSession}>+ New</button></div>
        <div className="session-list">
          {sessions.map((session) => <div key={session.id} className={`session-item ${session.id === activeId ? 'active' : ''}`}>
            {editingId === session.id ? <div className="session-rename"><input autoFocus value={editingName} onChange={(event) => setEditingName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void saveRename(session.id)} /><button title="Save" onClick={() => void saveRename(session.id)}><Check size={13} /></button><button title="Cancel" onClick={() => setEditingId(undefined)}><X size={13} /></button></div> : <button className="session-select" onClick={() => selectSession(session.id)}><span>{session.name}</span><small>{new Date(session.created_at).toLocaleString()} · {session.run_count} runs</small></button>}
            {editingId !== session.id && <div className="session-actions"><button title="Rename session" onClick={() => beginRename(session)}><Pencil size={12} /></button><button title="Delete session" onClick={() => void deleteSession(session)}><Trash2 size={12} /></button></div>}
          </div>)}
          {!sessions.length && !error && <span className="session-empty">Creating your first session…</span>}
          {error && <span className="session-empty">{error}</span>}
        </div>
      </div>
    </aside>
  );
};
