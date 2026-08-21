import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import type { RunDetails } from '../../api';
import './Dashboard.css';

export const TraceCanvas: React.FC<{ run?: RunDetails; loading?: boolean }> = ({ run, loading }) => {
  const [traceIndex, setTraceIndex] = useState(0);
  const effectiveIndex = run ? Math.min(traceIndex, Math.max(run.traces.length - 1, 0)) : 0;
  const trace = run?.traces[effectiveIndex];
  const scenario = run?.scenarios.find((item) => item.id === trace?.scenario_id);
  const failure = run?.failure_labels.find((item) => item.scenario_id === trace?.scenario_id);
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="text-h3">Trace Canvas</h3>
        <p className="text-muted text-body" style={{ marginTop: '0.25rem' }}>
          Select a completed run below to inspect its recorded agent execution.
        </p>
      </div>
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!run && <div className="trace-canvas-container">
          <GitBranch className="trace-icon" />
          <span className="text-muted">{loading ? 'Loading replay…' : 'No trace selected'}</span>
        </div>}
        {run && !trace && <div className="trace-canvas-container"><span className="text-muted">This run has no recorded traces.</span></div>}
        {run && trace && <div style={{ overflow: 'auto', maxHeight: '360px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
            <select className="select-control" value={effectiveIndex} onChange={(event) => setTraceIndex(Number(event.target.value))}>
              {run.traces.map((item, index) => <option key={item.scenario_id} value={index}>Scenario {index + 1}: {item.scenario_id}</option>)}
            </select>
            <span className={`badge ${failure?.passed ? 'badge-success' : 'badge-error'}`}>{failure?.passed ? 'PASS' : failure?.failure_mode ?? 'RECORDED'}</span>
          </div>
          {scenario && <div className="scenario-expected"><span className="highlight">Test prompt: </span>{scenario.user_message}</div>}
          <p className="text-small"><strong>Final answer:</strong> {trace.final_answer || 'No final answer'}</p>
          {failure && !failure.passed && <p style={{ color: 'var(--color-error)' }}><strong>Failure:</strong> {failure.rationale}</p>}
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', marginTop: '0.75rem' }}>{trace.messages.map((message) => `${message.role}: ${message.content}`).join('\n\n')}</div>
          <h4 className="text-h3" style={{ marginTop: '1rem' }}>Mocked tool calls</h4>
          {trace.tool_calls.length ? trace.tool_calls.map((call, index) => <div className="scenario-item" key={index}>
            <strong>{call.tool_name}</strong>{call.is_destructive ? ' · destructive' : ''}{call.confirmed_by_user ? ' · confirmed' : ' · not confirmed'}
            <div className="text-small">Arguments: {JSON.stringify(call.arguments)} · Result: {JSON.stringify(call.result)}</div>
          </div>) : <p className="text-muted text-small">No tools were called.</p>}
        </div>}
      </div>
    </div>
  );
};
