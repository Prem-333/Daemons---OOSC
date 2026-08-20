import React from 'react';
import { Layout } from '../components/layout/Layout';
import { AgentListTable } from '../components/registry/AgentListTable';
import { AgentRegistrationForm } from '../components/registry/AgentRegistrationForm';
import '../components/registry/Registry.css';

export const RegistryView: React.FC = () => {
  return (
    <Layout>
      <div className="registry-container">
        
        {/* Header Section */}
        <div className="registry-header">
          <h1 className="dashboard-title">Agent Registry</h1>
          <p className="dashboard-subtitle">Manage and monitor connected AI agents.</p>
        </div>

        {/* Content Area */}
        <div className="registry-content">
          <AgentListTable />
          <AgentRegistrationForm />
        </div>

      </div>
    </Layout>
  );
};
