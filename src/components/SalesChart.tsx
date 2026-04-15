'use client';

import React from 'react';
import { MOCK_SALES_DATA } from '@/lib/mock-data';

const SalesChart = () => {
  const maxSales = Math.max(...MOCK_SALES_DATA.map(d => d.sales));
  const height = 150;
  const width = 600;
  const padding = 20;

  const points = MOCK_SALES_DATA.map((d, i) => {
    const x = (i / (MOCK_SALES_DATA.length - 1)) * (width - padding * 2) + padding;
    const y = height - (d.sales / maxSales) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `
    ${padding},${height}
    ${points}
    ${width - padding},${height}
  `;

  return (
    <div className="sales-chart-container glass">
      <div className="chart-header">
        <div>
          <h3>Today's Sales Analysis</h3>
          <p className="chart-subtitle">Hourly revenue vs target projections</p>
        </div>
        <div className="total-sales">
          <span className="label">Daily Total</span>
          <span className="value">₹{MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.sales, 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="svg-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

          {/* Area */}
          <polyline points={areaPoints} fill="url(#chartGradient)" />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {MOCK_SALES_DATA.map((d, i) => {
            const x = (i / (MOCK_SALES_DATA.length - 1)) * (width - padding * 2) + padding;
            const y = height - (d.sales / maxSales) * (height - padding * 2) - padding;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth="2"
                className="chart-dot"
              />
            );
          })}
        </svg>
      </div>

      <div className="time-labels">
        {['08:00', '12:00', '16:00', '20:00', '00:00'].map(time => (
          <span key={time} className="time-label">{time}</span>
        ))}
      </div>

      <style jsx>{`
        .sales-chart-container {
          padding: 24px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        h3 {
          font-size: 18px;
          margin-bottom: 4px;
        }

        .chart-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }

        .total-sales {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .total-sales .label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }

        .total-sales .value {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary);
        }

        .svg-wrap {
          height: 180px;
          width: 100%;
          position: relative;
        }

        svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .time-labels {
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
        }

        .time-label {
          font-size: 11px;
          color: var(--text-muted);
          font-family: monospace;
        }

        .chart-dot {
          transition: r 0.2s;
          cursor: pointer;
        }

        .chart-dot:hover {
          r: 5;
        }
      `}</style>
    </div>
  );
};

export default SalesChart;
