import React from 'react';
import './Dashboard.css';

interface TaxonomyItemProps {
  label: string;
  percentage: number;
  colorClass: 'fill-red' | 'fill-gray';
}

const TaxonomyItem: React.FC<TaxonomyItemProps> = ({ label, percentage, colorClass }) => {
  return (
    <div className="taxonomy-item">
      <div className="taxonomy-label-row">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="taxonomy-bar-bg">
        <div 
          className={`taxonomy-bar-fill ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const FailureTaxonomy: React.FC<{ breakdown?: Record<string, number> }> = ({ breakdown }) => {
  const total = Object.values(breakdown ?? {}).reduce((sum, count) => sum + count, 0);
  const data = total ? Object.entries(breakdown ?? {}).map(([label, count], index) => ({
    label: label.replaceAll('_', ' '),
    percentage: Math.round((count / total) * 100),
    colorClass: index === 0 ? 'fill-red' as const : 'fill-gray' as const,
  })) : [];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-h3">Failure Taxonomy</h3>
      </div>
      <div className="card-body">
        <div className="taxonomy-list">
          {data.map((item, i) => (
            <TaxonomyItem key={i} {...item} />
          ))}
          {!data.length && <p className="text-muted text-small" style={{ margin: 0 }}>No failures recorded in this session. Run an evaluation to populate the taxonomy.</p>}
        </div>
      </div>
    </div>
  );
};
