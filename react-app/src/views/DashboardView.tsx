import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ReliabilityCard } from '../components/dashboard/ReliabilityCard';
import { FailureTaxonomy } from '../components/dashboard/FailureTaxonomy';
import { TraceCanvas } from '../components/dashboard/TraceCanvas';
import { RecentRunsTable } from '../components/dashboard/RecentRunsTable';
import { FileText, SearchCode, Beaker } from 'lucide-react';
import { dashboardApi, type Agent, type Run } from '../api';
import '../components/dashboard/Dashboard.css';

export const DashboardView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [breakdown, setBreakdown] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  useEffect(() => {
    void dashboardApi.get()
      .then((data) => { setAgents(data.agents); setRuns(data.recent_runs); setBreakdown(data.failure_breakdown); })
      .catch(() => setError('Backend is unavailable. Start the API service on port 8000.'));
  }, []);
  const cardIcons = [undefined, FileText, SearchCode, Beaker];
  return (
    <Layout>
      <div className="dashboard-container">
        
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Reliability Dashboard</h1>
            <p className="dashboard-subtitle">Aggregate performance across active autonomous agents.</p>
          </div>
          <button className="time-dropdown">
            Last 7 Days
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>

        {/* Reliability Metrics Grid */}
        <div className="reliability-grid">
          {agents.slice(0, 4).map((agent, index) => {
            const score = agent.latest_score ?? 0;
            return <ReliabilityCard key={agent.id} title={agent.name} value={agent.latest_score === null ? '—' : `${score.toFixed(1)}%`} trend={0} icon={cardIcons[index]} colorTheme={agent.status === 'Degraded' ? 'red' : agent.latest_score === null ? 'gray' : 'green'} sparklineData={[score || 0, score || 0]} />;
          })}
          {agents.length === 0 && <div className="card stat-card" style={{ gridColumn: '1 / -1' }}>Register an agent to start monitoring reliability.</div>}
        </div>

        {/* Middle Section (Taxonomy + Trace Canvas) */}
        <div className="dashboard-middle-row">
          <FailureTaxonomy breakdown={breakdown} />
          <TraceCanvas />
        </div>

        {/* Bottom Section */}
        <RecentRunsTable runs={runs} />
        {error && <p style={{ color: 'var(--color-error)', marginTop: '1rem' }}>{error}</p>}

      </div>
    </Layout>
  );
};
