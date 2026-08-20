import React from 'react';
import './TopNav.css';
import { Bell, User, Play } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <header className="topnav">
      <div className="topnav-tabs">
        <button className="tab active">Evaluations</button>
        <button className="tab">Models</button>
        <button className="tab">Teams</button>
      </div>

      <div className="topnav-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <button className="icon-btn">
          <User size={20} />
        </button>
        
        <div className="badge-prod">Production</div>
        
        <button className="btn btn-primary btn-run">
          <Play size={16} fill="currentColor" />
          Run Evaluation
        </button>
      </div>
    </header>
  );
};
