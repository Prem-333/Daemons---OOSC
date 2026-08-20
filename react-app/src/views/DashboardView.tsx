import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ReliabilityCard } from '../components/dashboard/ReliabilityCard';
import { FailureTaxonomy } from '../components/dashboard/FailureTaxonomy';
import { TraceCanvas } from '../components/dashboard/TraceCanvas';
import { RecentRunsTable } from '../components/dashboard/RecentRunsTable';
import { FileText, SearchCode, Beaker } from 'lucide-react';
import '../components/dashboard/Dashboard.css';

export const DashboardView: React.FC = () => {
  return (
    <Layout>
      <div className="dashboard-container">
        
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Reliability Dashboard</h1>
            <p className="dashboard-subtitle">Aggregate performance across active autonomous agents.</p>
          </div>
          <button className="time-dropdown">
            Last 7 Days
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>

        {/* Reliability Metrics Grid */}
        <div className="reliability-grid">
          <ReliabilityCard 
            title="Customer Support" 
            value="98.2%" 
            trend={1.2} 
            colorTheme="green"
            sparklineData={[60, 65, 75, 72, 85, 90, 98.2]}
          />
          <ReliabilityCard 
            title="Data Extraction" 
            value="94.5%" 
            trend={-0.0} 
            icon={FileText}
            colorTheme="gray"
            sparklineData={[95, 94.8, 94.2, 95.1, 94.5, 94.5, 94.5]}
          />
          <ReliabilityCard 
            title="Code Review" 
            value="89.1%" 
            trend={-3.4} 
            icon={SearchCode}
            colorTheme="red"
            sparklineData={[96, 95, 92, 90, 85, 87, 89.1]}
          />
          <ReliabilityCard 
            title="Research Intel" 
            value="96.8%" 
            trend={0.5} 
            icon={Beaker}
            colorTheme="green"
            sparklineData={[93, 94, 94.5, 95, 96, 96.2, 96.8]}
          />
        </div>

        {/* Middle Section (Taxonomy + Trace Canvas) */}
        <div className="dashboard-middle-row">
          <FailureTaxonomy />
          <TraceCanvas />
        </div>

        {/* Bottom Section */}
        <RecentRunsTable />

      </div>
    </Layout>
  );
};
