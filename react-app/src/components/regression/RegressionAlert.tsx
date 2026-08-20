import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './RegressionTracker.css';

export const RegressionAlert: React.FC = () => {
  return (
    <div className="critical-alert">
      <div className="alert-content">
        <div className="alert-title">
          <AlertTriangle size={18} />
          Critical Regression Detected
        </div>
        <div className="alert-desc">
          Code Generation module performance dropped by 14% on the 'v2.1-beta' staging cluster compared to the production baseline. Review required before merging to main.
        </div>
      </div>
      <button className="btn-danger-outline">View Details</button>
    </div>
  );
};
