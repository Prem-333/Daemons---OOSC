import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { RecentRunsTable } from '../components/dashboard/RecentRunsTable';
import { TraceCanvas } from '../components/dashboard/TraceCanvas';
import { dashboardApi, type Run, type RunDetails } from '../api';
import '../components/dashboard/Dashboard.css';

export const ReplayViewerView: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRun, setSelectedRun] = useState<RunDetails>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadReplay = async (runId: string) => {
    try {
      setLoading(true);
      setError('');
      setSelectedRun(await dashboardApi.run(runId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the replay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void dashboardApi.get()
      .then((data) => {
        setRuns(data.recent_runs);
        if (data.recent_runs[0]) void loadReplay(data.recent_runs[0].id);
      })
      .catch(() => setError('Backend is unavailable. Start the API service on port 8000.'));
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Replay Viewer</h1>
            <p className="dashboard-subtitle">Inspect recorded agent messages, mock tool calls, and failure decisions for each evaluation scenario.</p>
          </div>
        </div>
        <div style={{ minHeight: '460px' }}>
          <TraceCanvas run={selectedRun} loading={loading} />
        </div>
        <RecentRunsTable runs={runs} onReplay={loadReplay} />
        {error && <p style={{ color: 'var(--color-error)', marginTop: '1rem' }}>{error}</p>}
      </div>
    </Layout>
  );
};
