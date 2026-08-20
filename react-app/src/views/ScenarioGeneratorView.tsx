import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ScenarioConfigPanel } from '../components/scenarios/ScenarioConfigPanel';
import { PreviewPoolList } from '../components/scenarios/PreviewPoolList';
import '../components/scenarios/ScenarioGenerator.css';

export const ScenarioGeneratorView: React.FC = () => {
  return (
    <Layout>
      <div className="scenario-container">
        
        <div className="scenario-header">
          <h1 className="dashboard-title">Scenario Generator</h1>
          <p className="dashboard-subtitle">Configure and generate synthetic test batches for agent validation.</p>
        </div>

        <div className="scenario-content">
          <ScenarioConfigPanel />
          <PreviewPoolList />
        </div>

      </div>
    </Layout>
  );
};
