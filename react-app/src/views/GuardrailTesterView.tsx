import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ProbesTable } from '../components/guardrails/ProbesTable';
import { Filter, Download } from 'lucide-react';
import '../components/guardrails/GuardrailTester.css';

export const GuardrailTesterView: React.FC = () => {
  return (
    <Layout>
      <div className="guardrail-container">
        
        <div className="guardrail-header-row">
          <div>
            <h1 className="dashboard-title">Destructive Action Probes</h1>
            <p className="dashboard-subtitle">Evaluating agent resilience against unauthorized critical operations across common attack vectors.</p>
          </div>
          <div className="guardrail-actions">
            <button className="btn btn-outline">
              <Filter size={14} /> Filter
            </button>
            <button className="btn btn-outline">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <ProbesTable />

      </div>
    </Layout>
  );
};
