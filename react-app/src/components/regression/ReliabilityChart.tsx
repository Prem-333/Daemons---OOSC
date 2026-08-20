import React from 'react';
import './RegressionTracker.css';

export const ReliabilityChart: React.FC = () => {
  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Reliability Trends</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'var(--color-success)' }}></span> Reasoning
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'var(--color-error)' }}></span> Code Gen
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#9333ea' }}></span> Tool Use
          </div>
        </div>
      </div>
      
      <div className="chart-area">
        {/* Horizontal grid lines */}
        <div style={{ position: 'absolute', top: '0', left: 0, right: 0, borderTop: '1px dashed var(--color-border)' }}></div>
        <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, borderTop: '1px dashed var(--color-border)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed var(--color-border)' }}></div>
        <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, borderTop: '1px dashed var(--color-border)' }}></div>
        <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, borderTop: '1px solid var(--color-border)' }}></div>

        {/* Custom SVG Line Chart matching mockup */}
        <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Reasoning (Green) */}
          <path d="M 0 50 C 20 48, 40 55, 60 52 C 80 48, 90 40, 100 45" fill="none" stroke="var(--color-success)" strokeWidth="1.5" />
          
          {/* Code Gen (Red) - drops sharply */}
          <path d="M 0 45 C 20 47, 40 52, 55 58 C 65 70, 75 90, 80 92 C 90 94, 95 95, 100 95" fill="none" stroke="var(--color-error)" strokeWidth="2" />
          {/* Highlight point for regression */}
          <circle cx="80" cy="92" r="2.5" fill="#fca5a5" stroke="var(--color-error)" strokeWidth="1" />
          
          {/* Tool Use (Purple) */}
          <path d="M 0 80 C 20 75, 40 70, 60 65 C 70 58, 80 55, 100 54" fill="none" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="4,2" />
        </svg>
      </div>

      <div className="x-axis-labels">
        <span>v1.9</span>
        <span>v2.0</span>
        <span>v2.0.1</span>
        <span>v2.1-alpha</span>
        <span>v2.1-beta</span>
      </div>
    </div>
  );
};
