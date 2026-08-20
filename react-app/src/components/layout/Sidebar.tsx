import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { 
  LayoutDashboard, 
  Archive, 
  FlaskConical, 
  PlayCircle, 
  Bug, 
  ShieldCheck, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Registry', path: '/registry', icon: Archive },
  { label: 'Scenario Generator', path: '/scenario-generator', icon: FlaskConical },
  { label: 'Replay Viewer', path: '/replay-viewer', icon: PlayCircle },
  { label: 'Failure Taxonomy', path: '/failure-taxonomy', icon: Bug },
  { label: 'Guardrail Tester', path: '/guardrail-tester', icon: ShieldCheck },
  { label: 'Regression Tracker', path: '/regression-tracker', icon: TrendingUp },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">AgentCI</span>
        </div>
        <div className="version-tag">v1.2.4</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
