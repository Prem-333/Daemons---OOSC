import React from 'react';
import { Activity, Timer, PieChart } from 'lucide-react';
import './FailureTaxonomy.css';

export const TaxonomyMetrics: React.FC = () => {
  return (
    <div className="metrics-grid">
      
      <div className="card metric-card">
        <div className="metric-label-row">
          TOTAL FAILURES (24H)
          <Activity size={16} />
        </div>
        <div className="metric-value-row">
          <span className="metric-value">1,204</span>
          <span className="metric-trend">↑12%</span>
        </div>
      </div>

      <div className="card metric-card">
        <div className="metric-label-row">
          MEAN TIME TO FAILURE
          <Timer size={16} />
        </div>
        <div className="metric-value-row">
          <span className="metric-value">14.2</span>
          <span className="metric-unit">mins</span>
        </div>
      </div>

      <div className="card metric-card">
        <div className="metric-label-row">
          DOMINANT VECTOR
          <PieChart size={16} />
        </div>
        <div className="vector-list">
          
          <div className="vector-item">
            <div className="vector-label">
              <span><span className="dot" style={{ backgroundColor: 'var(--color-error)' }}></span>Tool-Call Loop</span>
              <span>54%</span>
            </div>
            <div className="vector-bar">
              <div className="vector-bar-fill" style={{ width: '54%', backgroundColor: 'var(--color-error)' }}></div>
            </div>
          </div>

          <div className="vector-item">
            <div className="vector-label">
              <span><span className="dot" style={{ backgroundColor: '#c2410c' }}></span>Goal Drift</span>
              <span>28%</span>
            </div>
            <div className="vector-bar">
              <div className="vector-bar-fill" style={{ width: '28%', backgroundColor: '#c2410c' }}></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
