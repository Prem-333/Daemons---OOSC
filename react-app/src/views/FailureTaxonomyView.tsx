import React from 'react';
import { Layout } from '../components/layout/Layout';
import { TaxonomyMetrics } from '../components/taxonomy/TaxonomyMetrics';
import { FailureModesExplorer } from '../components/taxonomy/FailureModesExplorer';
import { RefreshCcw } from 'lucide-react';
import '../components/taxonomy/FailureTaxonomy.css';

export const FailureTaxonomyView: React.FC = () => {
  return (
    <Layout>
      <div className="taxonomy-view-container">
        
        <div className="taxonomy-header-row">
          <div>
            <h1 className="dashboard-title">Failure Taxonomy</h1>
            <p className="dashboard-subtitle">Analysis of autonomous agent execution paths and deviation modes.</p>
          </div>
          <div className="refresh-text">
            <RefreshCcw size={14} />
            Last updated: 2 mins ago
          </div>
        </div>

        <TaxonomyMetrics />
        <FailureModesExplorer />

      </div>
    </Layout>
  );
};
