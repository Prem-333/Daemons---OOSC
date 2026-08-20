import React, { useState } from 'react';
import { Repeat, ChevronDown, ChevronUp, ArrowRight, Route } from 'lucide-react';
import './FailureTaxonomy.css';

interface TraceData {
  id: string;
  tool: string;
  latency: string;
  isTimeout?: boolean;
}

const mockTraces: TraceData[] = [
  { id: 'trc_982f4a1c', tool: 'db_query_executor', latency: '12.4s' },
  { id: 'trc_771e2b99', tool: 'api_fetch_weather', latency: '8.1s' },
  { id: 'trc_334c8d01', tool: 'file_system_read', latency: '45.2s', isTimeout: true },
];

export const FailureModesExplorer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="explorer-container">
      <h3 className="explorer-header">Failure Modes Explorer</h3>
      
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
          <div className="accordion-title-row">
            <Repeat size={18} color="var(--color-error)" />
            <span className="accordion-title">Tool-Call Loop</span>
            <span className="badge badge-error" style={{ fontSize: '0.65rem' }}>CRITICAL</span>
          </div>
          <div className="accordion-incidents">
            <div className="incident-count">
              <span className="incident-count-label">Incidents</span>
              <span className="incident-count-val">650</span>
            </div>
            {isOpen ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
          </div>
        </div>

        {isOpen && (
          <div className="accordion-content">
            <div className="recent-runs-table-wrapper">
              <table className="runs-table">
                <thead>
                  <tr>
                    <th>Trace ID</th>
                    <th>Tool Targeted</th>
                    <th>Latency</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTraces.map((trace, i) => (
                    <tr key={i}>
                      <td className="col-mono trace-id">{trace.id}</td>
                      <td className="col-mono">{trace.tool}</td>
                      <td className="col-mono" style={{ color: trace.isTimeout ? 'var(--color-error)' : 'inherit' }}>
                        {trace.latency} {trace.isTimeout && '(T/O)'}
                      </td>
                      <td>
                        <a href="#" className="table-row-link text-small">
                          Inspect <ArrowRight size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--color-border-light)' }}>
              <a href="#" className="text-small text-muted" style={{ display: 'inline-block' }}>View all 650 traces</a>
            </div>
          </div>
        )}
      </div>

      <div className="accordion-item">
        <div className="accordion-header">
          <div className="accordion-title-row">
            <Route size={18} color="#c2410c" />
            <span className="accordion-title">Goal Drift</span>
            <span className="badge" style={{ backgroundColor: '#ffedd5', color: '#c2410c', fontSize: '0.65rem' }}>WARNING</span>
          </div>
          <div className="accordion-incidents">
            <div className="incident-count">
              <span className="incident-count-label">Incidents</span>
              <span className="incident-count-val">337</span>
            </div>
            <ChevronDown size={20} className="text-muted" />
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <div className="accordion-header">
          <div className="accordion-title-row">
            <span style={{ color: 'var(--color-primary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </span>
            <span className="accordion-title">Hallucinated Tool</span>
            <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '0.65rem' }}>INFO</span>
          </div>
          <div className="accordion-incidents">
            <div className="incident-count">
              <span className="incident-count-label">Incidents</span>
              <span className="incident-count-val">112</span>
            </div>
            <ChevronDown size={20} className="text-muted" />
          </div>
        </div>
      </div>

    </div>
  );
};
