import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import './ScenarioGenerator.css';

export const ScenarioConfigPanel: React.FC = () => {
  return (
    <div className="card config-card">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SlidersHorizontal size={18} className="stat-icon" />
        <h3 className="text-h3">Configuration</h3>
      </div>
      
      <div className="config-body">
        
        <div className="config-section">
          <div className="form-label" style={{ fontSize: '0.65rem' }}>TARGET AGENT</div>
          <select className="select-control">
            <option>Customer Support Bot v2</option>
            <option>CodeReview_Bot</option>
            <option>DataAnalyzer_Prod</option>
          </select>
        </div>

        <div className="config-section" style={{ marginTop: '0.5rem' }}>
          <div className="form-label" style={{ fontSize: '0.65rem', marginBottom: '1rem' }}>DISTRIBUTION MIX</div>
          <div className="slider-group">
            
            <div className="slider-row">
              <div className="slider-label-row">
                <span>Realistic</span>
                <span className="percent">40%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="40" />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span>Adversarial</span>
                <span className="percent">30%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="30" />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span>Prompt Injection</span>
                <span className="percent">20%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="20" />
            </div>

            <div className="slider-row">
              <div className="slider-label-row">
                <span>Destructive Pressure</span>
                <span className="percent">10%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="10" />
            </div>

          </div>
        </div>

        <div className="config-section" style={{ marginTop: '0.5rem' }}>
          <div className="form-label" style={{ fontSize: '0.65rem' }}>GENERATION VOLUME</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="range" min="0" max="1000" defaultValue="250" style={{ flex: 1 }} />
            <input type="text" className="volume-input" defaultValue="250" readOnly />
          </div>
        </div>

        <div className="action-row" style={{ marginTop: 'auto', paddingTop: '1.5rem', justifyContent: 'space-between' }}>
          <button className="btn btn-outline" style={{ flex: 1 }}>Reset Config</button>
          <button className="btn btn-primary" style={{ flex: 1 }}>Generate Batch</button>
        </div>
        
      </div>
    </div>
  );
};
