import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <TopNav />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};
