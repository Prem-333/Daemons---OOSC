import React from 'react';
import { Bot, Code2, LineChart } from 'lucide-react';
import type { Agent } from '../../api';
import './Registry.css';

const icons = [Bot, Code2, LineChart];
const dateLabel = (date: string | null) => date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) : 'Never';

export const AgentListTable: React.FC<{ agents: Agent[]; onEvaluate: (agentId: string) => void; evaluatingId?: string }> = ({ agents, onEvaluate, evaluatingId }) => {
  return (
    <div className="card agent-list-card">
      <div className="recent-runs-table-wrapper" style={{ flex: 1 }}>
        <table className="runs-table">
          <thead>
            <tr>
              <th>AGENT NAME</th>
              <th>STATUS</th>
              <th>DOMAIN</th>
              <th>TOOLS</th>
              <th>LAST EVAL</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => {
              const Icon = icons[i % icons.length];
              return (
                <tr key={i}>
                  <td style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="agent-icon">
                      <Icon size={16} />
                    </div>
                    {agent.name}
                  </td>
                  <td>
                    <span className={`status-badge ${agent.status === 'Healthy' ? 'status-healthy' : 'status-degraded'}`}>
                      <span className="dot"></span>
                      {agent.status}
                    </span>
                  </td>
                  <td className="col-muted">{agent.domain}</td>
                  <td className="col-muted">{agent.tool_schemas.length}</td>
                  <td className="col-muted">{dateLabel(agent.last_evaluated_at)}</td>
                  <td className="col-mono" style={{ color: agent.status === 'Degraded' ? 'var(--color-error)' : 'inherit' }}>
                    {agent.latest_score === null ? '—' : `${agent.latest_score.toFixed(1)}%`}
                    <button className="btn btn-outline" style={{ marginLeft: '0.75rem', padding: '0.25rem 0.5rem', height: 'auto' }} onClick={() => onEvaluate(agent.id)} disabled={evaluatingId === agent.id}>
                      {evaluatingId === agent.id ? 'Running…' : 'Evaluate'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {agents.length === 0 && <tr><td colSpan={6} className="col-muted" style={{ textAlign: 'center', padding: '2rem' }}>No agents registered yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
