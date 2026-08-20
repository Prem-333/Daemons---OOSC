import React from 'react';
import { Layout } from '../components/layout/Layout';
import { RegressionAlert } from '../components/regression/RegressionAlert';
import { ReliabilityChart } from '../components/regression/ReliabilityChart';
import { ScorecardSummary } from '../components/regression/ScorecardSummary';
import '../components/regression/RegressionTracker.css';

export const RegressionTrackerView: React.FC = () => {
  return (
    <Layout>
      <div className="regression-container">
        
        <div className="regression-header-row">
          <div>
            <h1 className="dashboard-title">Regression Tracker</h1>
            <p className="dashboard-subtitle">Monitor performance drift across model versions and tool capabilities.</p>
          </div>
          <div>
            <select className="dropdown-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        <RegressionAlert />

        <div className="tracker-grid">
          <ReliabilityChart />
          <ScorecardSummary />
        </div>

      </div>
    </Layout>
  );
};
