import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './Dashboard.css';

interface ReliabilityCardProps {
  title: string;
  value: string;
  trend: number; // positive, negative, or 0
  icon?: LucideIcon;
  colorTheme: 'green' | 'red' | 'gray';
  sparklineData: number[];
}

export const ReliabilityCard: React.FC<ReliabilityCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  colorTheme,
  sparklineData
}) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  
  let trendClass = 'trend-flat';
  let TrendIcon = Minus;
  
  if (isPositive) {
    trendClass = 'trend-up';
    TrendIcon = ArrowUpRight;
  } else if (isNegative) {
    trendClass = 'trend-down';
    TrendIcon = ArrowDownRight;
  }
  
  const displayTrend = trend > 0 ? `+${trend.toFixed(1)}%` : trend < 0 ? `${trend.toFixed(1)}%` : `- ${trend.toFixed(1)}%`;

  // Simple SVG sparkline generator
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  
  const width = 100;
  const height = 24;
  
  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = colorTheme === 'green' ? 'var(--color-success)' : 
                      colorTheme === 'red' ? 'var(--color-error)' : 
                      'var(--color-text-light)';

  return (
    <div className="card stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && <Icon size={18} className="stat-icon" />}
      </div>
      
      <div className="stat-value">{value}</div>
      
      <div className={`stat-trend ${trendClass}`}>
        <TrendIcon size={14} />
        <span>{displayTrend} Reliability Score</span>
      </div>
      
      <div className="stat-sparkline">
        <svg className="sparkline-svg" viewBox={`0 -2 ${width} ${height + 4}`} preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
};
