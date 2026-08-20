import React from 'react';
import { Bot, Code2, LineChart } from 'lucide-react';
import './Registry.css';

interface AgentData {
  name: string;
  status: 'Healthy' | 'Degraded';
  domain: string;
  tools: number;
  lastEval: string;
  score: string;
  icon: React.FC<any>;
}

const mockAgents: AgentData[] = [
  { name: 'CustomerSupport_v2', status: 'Healthy', domain: 'Support', tools: 12, lastEval: '2 mins ago', score: '94.2%', icon: Bot },
  { name: 'CodeReview_Bot', status: 'Degraded', domain: 'Engineering', tools: 8, lastEval: '1 hr ago', score: '62.1%', icon: Code2 },
  { name: 'DataAnalyzer_Prod', status: 'Healthy', domain: 'Analytics', tools: 24, lastEval: '5 hrs ago', score: '88.9%', icon: LineChart },
];

export const AgentListTable: React.FC = () => {
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
            {mockAgents.map((agent, i) => {
              const Icon = agent.icon;
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
                  <td className="col-muted">{agent.tools}</td>
                  <td className="col-muted">{agent.lastEval}</td>
                  <td className="col-mono" style={{ color: agent.status === 'Healthy' ? 'inherit' : 'var(--color-error)' }}>{agent.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
