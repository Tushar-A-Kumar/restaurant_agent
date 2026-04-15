'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import AgentLog from '@/components/AgentLog';
import SalesChart from '@/components/SalesChart';
import { MOCK_AGENT_LOGS, MOCK_INVENTORY, MOCK_PREP_LIST } from '@/lib/mock-data';

export default function Dashboard() {
  const [logs, setLogs] = useState(MOCK_AGENT_LOGS);
  const [isRunning, setIsRunning] = useState(false);
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTempStock(item.currentStock);
  };

  const saveStock = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, currentStock: tempStock } : item));
    setEditingId(null);
  };

  const runAgents = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/agents/run');
      const data = await res.json();
      
      const newLogs = data.actions.map((action: any) => ({
        id: action.id,
        timestamp: action.timestamp,
        message: action.message,
        type: action.type === 'decision' ? 'action' : 'info'
      }));

      setLogs(prev => [...newLogs, ...prev].slice(0, 10));
    } catch (err) {
      console.error('Failed to run agents', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Operator Command Centre</h1>
          <p className="subtitle">Live insights from KitchenOS Agents</p>
        </div>
        <div className="header-actions">
          <button 
            className={`run-btn ${isRunning ? 'running' : ''}`} 
            onClick={runAgents}
            disabled={isRunning}
          >
            {isRunning ? 'Agents Processing...' : 'Trigger Agent Loop'}
          </button>
          <div className="current-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard label="Net Margin" value="7.4%" trend="2.1%" trendType="positive" />
        <StatCard label="Food Cost %" value="28.2%" trend="1.5%" trendType="positive" color="var(--secondary)" />
        <StatCard label="Active Prep" value="65%" trend="on pace" trendType="neutral" />
        <StatCard label="Waste/Revenue" value="1.8%" trend="0.4%" trendType="positive" color="var(--error)" />
      </div>

      <SalesChart />

      <div className="main-grid">
        <div className="left-panel">
          <div className="section glass">
            <div className="section-header">
              <h2>Kitchen Prep Status</h2>
              <button className="text-btn">View All</button>
            </div>
            <div className="prep-list">
              {MOCK_PREP_LIST.map(item => (
                <div key={item.id} className="prep-item">
                  <div className="item-info">
                    <span className="name">{item.name}</span>
                    <span className="station">{item.station}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${(item.currentQuantity / item.neededQuantity) * 100}%` }}></div>
                  </div>
                  <div className="status-badge" data-status={item.status}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section glass">
            <div className="section-header">
              <h2>Inventory Alerts</h2>
              <button className="text-btn">Manage</button>
            </div>
            <div className="inventory-grid">
              {items.filter(i => i.currentStock < i.minThreshold).map(item => {
                const isEditing = editingId === item.id;
                return (
                  <div key={item.id} className="inventory-alert-card">
                    <div className="alert-top">
                      <div className="name">{item.name}</div>
                      {!isEditing && (
                        <button onClick={() => startEdit(item)} className="edit-btn-small">✎</button>
                      )}
                    </div>
                    <div className="stock-info">
                      {isEditing ? (
                        <div className="dash-edit-wrap">
                          <input 
                            type="number" 
                            value={tempStock} 
                            onChange={e => setTempStock(Number(e.target.value))}
                            className="dash-input"
                            autoFocus
                          />
                          <button onClick={() => saveStock(item.id)} className="dash-save">Save</button>
                          <button onClick={() => setEditingId(null)} className="dash-cancel">✕</button>
                        </div>
                      ) : (
                        <>
                          <span className="current">{item.currentStock} {item.unit}</span>
                          <span className="threshold"> / min {item.minThreshold} {item.unit}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <AgentLog logs={logs} />
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .run-btn {
          background: var(--primary);
          color: black;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .run-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px var(--primary-glow);
        }

        .run-btn.running {
          opacity: 0.7;
          cursor: not-allowed;
          background: var(--text-muted);
        }

        h1 {
          font-size: 32px;
          margin-bottom: 4px;
        }

        .subtitle {
          color: var(--text-muted);
        }

        .current-date {
          font-weight: 500;
          color: var(--text-muted);
          font-size: 14px;
        }

        .stats-grid {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section {
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .text-btn {
          color: var(--primary);
          font-size: 14px;
          font-weight: 600;
        }

        .prep-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .prep-item {
          display: grid;
          grid-template-columns: 2fr 3fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .item-info {
          display: flex;
          flex-direction: column;
        }

        .name { font-weight: 600; font-size: 14px; }
        .station { font-size: 12px; color: var(--text-muted); }

        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          background: var(--primary);
          border-radius: 3px;
        }

        .status-badge {
          font-size: 11px;
          text-transform: uppercase;
          text-align: center;
          padding: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
        }

        .status-badge[data-status="completed"] { color: var(--primary); }
        .status-badge[data-status="in-progress"] { color: var(--secondary); }
        .status-badge[data-status="delayed"] { color: var(--error); }

        .inventory-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .inventory-alert-card {
          padding: 16px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-md);
        }

        .inventory-alert-card .name {
          color: var(--error);
          margin-bottom: 4px;
        }

        .alert-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .edit-btn-small {
          font-size: 10px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .inventory-alert-card:hover .edit-btn-small {
          opacity: 1;
        }

        .dash-edit-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        .dash-input {
          width: 50px;
          background: rgba(255,255,255,0.1);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: white;
          font-size: 11px;
          padding: 2px 4px;
        }

        .dash-save {
          background: var(--primary);
          color: black;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .dash-cancel {
          font-size: 10px;
          color: var(--text-muted);
        }

        .inventory-alert-card .stock-info {
          font-size: 12px;
        }

        .current { font-weight: 700; }
        .threshold { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
