'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendType = 'neutral', color = 'var(--primary)' }) => {
  return (
    <div className="stat-card glass animate-fade-in">
      <div className="label">{label}</div>
      <div className="value" style={{ color }}>{value}</div>
      {trend && (
        <div className={`trend ${trendType}`}>
          {trendType === 'positive' ? '↑' : trendType === 'negative' ? '↓' : '→'} {trend}
        </div>
      )}

      <style jsx>{`
        .stat-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 200px;
          flex: 1;
        }

        .label {
          color: var(--text-muted);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .value {
          font-size: 32px;
          font-weight: 700;
        }

        .trend {
          font-size: 13px;
          font-weight: 500;
        }

        .trend.positive { color: var(--primary); }
        .trend.negative { color: var(--error); }
        .trend.neutral { color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default StatCard;
