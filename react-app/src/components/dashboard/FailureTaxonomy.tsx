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

export const FailureTaxonomy: React.FC = () => {
  const data: TaxonomyItemProps[] = [
    { label: 'Hallucinated Confidence', percentage: 42, colorClass: 'fill-red' },
    { label: 'Tool-Call Loop', percentage: 28, colorClass: 'fill-gray' },
    { label: 'Timeout', percentage: 18, colorClass: 'fill-gray' },
    { label: 'Destructive Action', percentage: 12, colorClass: 'fill-gray' },
  ];

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
        </div>
      </div>
    </div>
  );
};
