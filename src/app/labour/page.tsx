'use client';

import React, { useState } from 'react';

const SHIFTS = [
  { id: '1', name: 'Maria C.', role: 'Sous Chef', start: '07:00', end: '15:00', status: 'clocked-in', hourlyRate: 18 },
  { id: '2', name: 'James R.', role: 'Line Cook', start: '10:00', end: '18:00', status: 'scheduled', hourlyRate: 14 },
  { id: '3', name: 'Priya L.', role: 'Pastry Chef', start: '08:00', end: '14:00', status: 'clocked-in', hourlyRate: 16 },
  { id: '4', name: 'Tom H.', role: 'Dishwasher', start: '11:00', end: '19:00', status: 'scheduled', hourlyRate: 11 },
  { id: '5', name: 'Sara M.', role: 'Expo', start: '17:00', end: '23:00', status: 'on-call', hourlyRate: 13 },
  { id: '6', name: 'Chen W.', role: 'Grill Cook', start: '15:00', end: '23:00', status: 'gap', hourlyRate: 15 },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  'clocked-in': { color: 'var(--primary)', bg: 'var(--primary-glow)' },
  'scheduled': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  'on-call': { color: 'var(--secondary)', bg: 'var(--secondary-glow)' },
  'gap': { color: 'var(--error)', bg: 'rgba(239,68,68,0.1)' },
};

export default function LabourPage() {
  const [shifts, setShifts] = useState(SHIFTS);

  const totalCoveredHours = shifts.filter(s => s.status !== 'gap').reduce((acc, s) => {
    const hours = parseInt(s.end) - parseInt(s.start);
    return acc + hours;
  }, 0);

  const labourCostEstimate = shifts.reduce((acc, s) => {
    const hours = parseInt(s.end) - parseInt(s.start);
    return acc + (hours * s.hourlyRate);
  }, 0);

  const fillShift = (id: string) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, status: 'scheduled' } : s));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Labour Optimiser</h1>
          <p className="subtitle">Shift coverage · Labour cost % · On-call management</p>
        </div>
        <div className="cost-chip">
          Est. Labour Cost: <strong>₹{labourCostEstimate.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric glass">
          <div className="metric-label">Labour Cost %</div>
          <div className="metric-value" style={{ color: 'var(--secondary)' }}>31.2%</div>
          <div className="metric-target">Target: &lt;30%</div>
        </div>
        <div className="metric glass">
          <div className="metric-label">Staffed Hours Today</div>
          <div className="metric-value">{totalCoveredHours}h</div>
          <div className="metric-target">Required: 72h</div>
        </div>
        <div className="metric glass">
          <div className="metric-label">Clocked In Now</div>
          <div className="metric-value" style={{ color: 'var(--primary)' }}>
            {shifts.filter(s => s.status === 'clocked-in').length}
          </div>
          <div className="metric-target">of {shifts.length} today</div>
        </div>
        <div className="metric glass">
          <div className="metric-label">Open Gaps</div>
          <div className="metric-value" style={{ color: 'var(--error)' }}>
            {shifts.filter(s => s.status === 'gap').length}
          </div>
          <div className="metric-target">Needs filling</div>
        </div>
      </div>

      <div className="card glass">
        <div className="card-header">
          <h2>Today's Shift Schedule</h2>
          <span className="badge">{new Date().toLocaleDateString('en-US', { weekday: 'long' })} · Dinner Rush</span>
        </div>
        <div className="shifts-table">
          <div className="table-head">
            <span>Staff</span>
            <span>Role</span>
            <span>Shift</span>
            <span>Rate</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {shifts.map(shift => {
            const style = STATUS_STYLES[shift.status];
            const hours = parseInt(shift.end) - parseInt(shift.start);
            return (
              <div key={shift.id} className="table-row">
                <span className="staff-name">{shift.name}</span>
                <span className="role">{shift.role}</span>
                <span className="shift-time">{shift.start} – {shift.end}</span>
                <span className="rate">₹{shift.hourlyRate}/hr</span>
                <span className="status-pill" style={{ color: style.color, background: style.bg }}>
                  {shift.status.replace('-', ' ')}
                </span>
                <span>
                  {shift.status === 'gap' ? (
                    <button className="fill-btn" onClick={() => fillShift(shift.id)}>
                      Send Fill Request
                    </button>
                  ) : (
                    <span className="hours-worked">{hours}h</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        h1 { font-size: 32px; margin-bottom: 4px; }
        .subtitle { color: var(--text-muted); font-size: 14px; }

        .cost-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .cost-chip strong { color: var(--foreground); }

        .metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric {
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .metric-value {
          font-size: 30px;
          font-weight: 700;
        }

        .metric-target {
          font-size: 12px;
          color: var(--text-muted);
        }

        .card {
          padding: 24px;
          border-radius: 12px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 { font-size: 18px; }

        .badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 8px;
          background: var(--secondary-glow);
          color: var(--secondary);
          font-weight: 600;
        }

        .shifts-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-head {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 0.8fr 1fr 1fr;
          padding: 8px 12px;
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 0.8fr 1fr 1fr;
          align-items: center;
          padding: 14px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .table-row:hover {
          background: rgba(255,255,255,0.05);
        }

        .staff-name { font-weight: 600; font-size: 14px; }
        .role { font-size: 13px; color: var(--text-muted); }
        .shift-time { font-family: monospace; font-size: 13px; }
        .rate { font-size: 13px; color: var(--text-muted); }

        .status-pill {
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
          width: fit-content;
        }

        .fill-btn {
          font-size: 12px;
          padding: 6px 12px;
          background: var(--error);
          color: white;
          border-radius: 6px;
          font-weight: 600;
          transition: opacity 0.15s;
        }

        .fill-btn:hover { opacity: 0.8; }

        .hours-worked {
          font-size: 13px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
