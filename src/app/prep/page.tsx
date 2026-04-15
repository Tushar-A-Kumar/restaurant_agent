'use client';

import React, { useState } from 'react';
import { MOCK_PREP_LIST, PrepItem } from '@/lib/mock-data';

const STATUS_COLORS: Record<PrepItem['status'], string> = {
  'completed': 'var(--primary)',
  'in-progress': 'var(--secondary)',
  'pending': 'var(--text-muted)',
  'delayed': 'var(--error)',
};

const RESERVATIONS = [
  { time: '12:00', covers: 24, status: 'confirmed' },
  { time: '13:00', covers: 18, status: 'confirmed' },
  { time: '19:00', covers: 42, status: 'confirmed' },
  { time: '19:30', covers: 38, status: 'confirmed' },
  { time: '20:00', covers: 51, status: 'confirmed' },
  { time: '21:00', covers: 22, status: 'pending' },
];

export default function PrepPage() {
  const [prep, setPrep] = useState<PrepItem[]>(MOCK_PREP_LIST);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const totalCovers = RESERVATIONS.reduce((a, b) => a + b.covers, 0);
  const dinnerCovers = RESERVATIONS.filter(r => parseInt(r.time) >= 18).reduce((a, b) => a + b.covers, 0);

  const handleAIForecast = async () => {
    setAiRunning(true);
    setAiSuggestion(null);
    // Simulate agent processing
    await new Promise(r => setTimeout(r, 1500));
    setAiSuggestion(
      `Based on ${totalCovers} covers (${dinnerCovers} dinner service), Prep Intelligence suggests: increase [Salmon Filleting] by 6 portions, prep [Wasabi Aioli] +2L. High confidence in protein demand surge. Estimated prep window: 09:00–11:45 AM.`
    );
    setAiRunning(false);
  };

  const markDone = (id: string) => {
    setPrep(prev => prev.map(p => p.id === id ? { ...p, status: 'completed', currentQuantity: p.neededQuantity } : p));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Prep Intelligence Engine</h1>
          <p className="subtitle">AI-generated prep lists · Pacing alerts · Station load visibility</p>
        </div>
        <button
          className={`ai-btn ${aiRunning ? 'loading' : ''}`}
          onClick={handleAIForecast}
          disabled={aiRunning}
        >
          {aiRunning ? '⟳ Analysing covers...' : '⚡ Run Forecast'}
        </button>
      </div>

      {aiSuggestion && (
        <div className="ai-alert glass">
          <div className="ai-alert-icon">AI</div>
          <p>{aiSuggestion}</p>
        </div>
      )}

      <div className="two-col">
        <div className="left">
          <div className="card glass">
            <div className="card-header">
              <h2>Today's Prep List</h2>
              <span className="badge">{prep.filter(p => p.status === 'completed').length}/{prep.length} complete</span>
            </div>
            <div className="prep-list">
              {prep.map(item => {
                const pct = item.neededQuantity > 0
                  ? Math.round((item.currentQuantity / item.neededQuantity) * 100)
                  : 0;
                return (
                  <div key={item.id} className="prep-item">
                    <div className="item-top">
                      <div className="item-name-group">
                        <span className="item-name">{item.name}</span>
                        <span className="station-badge">{item.station}</span>
                      </div>
                      <div className="deadline-group">
                        <span className="deadline">⏰ {item.deadline}</span>
                        <span
                          className="status-dot"
                          style={{ color: STATUS_COLORS[item.status] }}
                        >
                          ● {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="bar-row">
                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: STATUS_COLORS[item.status]
                          }}
                        />
                      </div>
                      <span className="qty-text">
                        {item.currentQuantity}/{item.neededQuantity} {item.unit}
                      </span>
                    </div>
                    {item.status !== 'completed' && (
                      <button className="mark-done-btn" onClick={() => markDone(item.id)}>
                        Mark Complete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="right">
          <div className="card glass">
            <div className="card-header">
              <h2>Today's Reservations</h2>
              <span className="badge">{totalCovers} covers</span>
            </div>
            <div className="res-list">
              {RESERVATIONS.map((r, i) => {
                const heightPct = Math.round((r.covers / 60) * 100);
                return (
                  <div key={i} className="res-row">
                    <span className="time">{r.time}</span>
                    <div className="res-bar-wrap">
                      <div className="res-bar">
                        <div
                          className="res-fill"
                          style={{
                            width: `${heightPct}%`,
                            background: parseInt(r.time) >= 18 ? 'var(--secondary)' : 'var(--primary)'
                          }}
                        />
                      </div>
                    </div>
                    <span className="covers-count">{r.covers} cvrs</span>
                    <span className={`res-status ${r.status}`}>{r.status}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-box">
              <div className="sum-row">
                <span>Lunch service:</span>
                <strong>{RESERVATIONS.filter(r => parseInt(r.time) < 18).reduce((a, b) => a + b.covers, 0)} covers</strong>
              </div>
              <div className="sum-row">
                <span>Dinner service:</span>
                <strong style={{ color: 'var(--secondary)' }}>{dinnerCovers} covers</strong>
              </div>
            </div>
          </div>
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

        .ai-btn {
          background: linear-gradient(135deg, var(--primary), #059669);
          color: black;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 0 20px var(--primary-glow);
          transition: all 0.2s;
        }

        .ai-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 30px var(--primary-glow);
        }

        .ai-btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ai-alert {
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.06);
          animation: fadeSlide 0.4s ease;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ai-alert-icon {
          background: var(--primary);
          color: black;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .ai-alert p {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
        }

        .two-col {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
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
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 8px;
          background: var(--primary-glow);
          color: var(--primary);
        }

        .prep-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .prep-item {
          padding: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-name-group { display: flex; align-items: center; gap: 8px; }

        .item-name { font-weight: 700; font-size: 15px; }

        .station-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.07);
          color: var(--text-muted);
        }

        .deadline-group { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }

        .deadline { font-size: 12px; color: var(--text-muted); }

        .status-dot { font-size: 12px; text-transform: capitalize; }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .qty-text { font-size: 12px; color: var(--text-muted); white-space: nowrap; }

        .mark-done-btn {
          align-self: flex-start;
          font-size: 12px;
          padding: 5px 14px;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 6px;
          font-weight: 600;
          transition: all 0.15s;
        }

        .mark-done-btn:hover {
          background: var(--primary);
          color: black;
        }

        .res-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .res-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time {
          font-family: monospace;
          font-size: 13px;
          color: var(--text-muted);
          width: 42px;
        }

        .res-bar-wrap { flex: 1; }

        .res-bar {
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .res-fill {
          height: 100%;
          border-radius: 4px;
        }

        .covers-count { font-size: 12px; font-weight: 600; width: 52px; text-align: right; }

        .res-status {
          font-size: 10px;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          width: 72px;
          text-align: center;
        }

        .res-status.confirmed { color: var(--primary); background: var(--primary-glow); }
        .res-status.pending { color: var(--text-muted); background: rgba(255,255,255,0.05); }

        .summary-box {
          margin-top: 20px;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sum-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-muted);
        }

        .sum-row strong { color: var(--foreground); }
      `}</style>
    </div>
  );
}
