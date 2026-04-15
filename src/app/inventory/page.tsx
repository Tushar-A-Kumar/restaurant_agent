'use client';

import React, { useState } from 'react';
import { MOCK_INVENTORY, InventoryItem } from '@/lib/mock-data';

interface PurchaseOrder {
  id: string;
  item: string;
  qty: number;
  unit: string;
  supplier: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'overridden';
  raisedAt: string;
}

const MOCK_POS: PurchaseOrder[] = [
  {
    id: 'PO-8821', item: 'Fresh Salmon', qty: 20, unit: 'kg',
    supplier: 'Ocean Prime Seafood Co.', estimatedCost: 510.00,
    status: 'pending', raisedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString()
  },
  {
    id: 'PO-8820', item: 'Unsalted Butter', qty: 10, unit: 'kg',
    supplier: 'Green Valley Dairy', estimatedCost: 80.00,
    status: 'pending', raisedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
];

export default function InventoryPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_POS);

  const handleApprove = (id: string) => {
    setOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'approved' } : po));
  };

  const handleOverride = (id: string) => {
    setOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'overridden' } : po));
  };

  const depletionPct = (item: InventoryItem) =>
    Math.min(100, Math.round((item.currentStock / item.minThreshold) * 100));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Autonomous Inventory Agent</h1>
          <p className="subtitle">Real-time stock monitoring · Auto PO generation · Anomaly detection</p>
        </div>
        <div className="agent-badge">
          <div className="agent-dot"></div>
          Agent Active
        </div>
      </div>

      <div className="two-col">
        <div className="left">
          <div className="card glass">
            <div className="card-header">
              <h2>Live Stock Levels</h2>
            </div>
            <div className="stock-list">
              {MOCK_INVENTORY.map(item => {
                const pct = depletionPct(item);
                const isCritical = item.currentStock < item.minThreshold;
                return (
                  <div key={item.id} className="stock-row">
                    <div className="stock-info">
                      <span className="name">{item.name}</span>
                      <span className="cat">{item.category}</span>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: isCritical ? 'var(--error)' : 'var(--primary)'
                          }}
                        />
                      </div>
                      <span className={`stock-val ${isCritical ? 'critical' : ''}`}>
                        {item.currentStock} / {item.minThreshold} {item.unit}
                      </span>
                    </div>
                    {isCritical && <span className="alert-tag">LOW</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="right">
          <div className="card glass">
            <div className="card-header">
              <h2>Pending Purchase Orders</h2>
              <span className="count">{orders.filter(o => o.status === 'pending').length} awaiting approval</span>
            </div>
            <div className="po-list">
              {orders.map(po => (
                <div key={po.id} className={`po-card ${po.status}`}>
                  <div className="po-top">
                    <span className="po-id">{po.id}</span>
                    <span className={`po-status ${po.status}`}>{po.status}</span>
                  </div>
                  <div className="po-item">{po.item}</div>
                  <div className="po-meta">
                    {po.qty} {po.unit} · {po.supplier}
                  </div>
                  <div className="po-cost">₹{po.estimatedCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  {po.status === 'pending' && (
                    <div className="po-actions">
                      <button className="btn-approve" onClick={() => handleApprove(po.id)}>
                        ✓ Approve
                      </button>
                      <button className="btn-override" onClick={() => handleOverride(po.id)}>
                        ✕ Override
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        h1 { font-size: 32px; margin-bottom: 4px; }
        .subtitle { color: var(--text-muted); font-size: 14px; }

        .agent-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-glow);
          border: 1px solid var(--primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--primary);
          font-weight: 600;
        }

        .agent-dot {
          width: 8px; height: 8px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--primary);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .two-col {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
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

        .count {
          font-size: 12px;
          color: var(--secondary);
          background: var(--secondary-glow);
          padding: 4px 10px;
          border-radius: 8px;
        }

        .stock-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stock-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stock-info {
          width: 140px;
          display: flex;
          flex-direction: column;
        }

        .stock-info .name { font-size: 14px; font-weight: 600; }
        .stock-info .cat { font-size: 11px; color: var(--text-muted); }

        .bar-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bar {
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

        .stock-val { font-size: 11px; color: var(--text-muted); }
        .stock-val.critical { color: var(--error); }

        .alert-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--error);
          border: 1px solid var(--error);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .po-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .po-card {
          padding: 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .po-card.approved { border-color: var(--primary); background: rgba(16,185,129,0.04); }
        .po-card.overridden { border-color: rgba(255,255,255,0.05); opacity: 0.5; }

        .po-top { display: flex; justify-content: space-between; align-items: center; }

        .po-id { font-family: monospace; font-size: 12px; color: var(--text-muted); }

        .po-status {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .po-status.pending { color: var(--secondary); background: var(--secondary-glow); }
        .po-status.approved { color: var(--primary); background: var(--primary-glow); }
        .po-status.overridden { color: var(--text-muted); background: rgba(255,255,255,0.05); }

        .po-item { font-size: 16px; font-weight: 700; }

        .po-meta { font-size: 13px; color: var(--text-muted); }

        .po-cost { font-size: 18px; font-weight: 700; color: var(--primary); }

        .po-actions { display: flex; gap: 10px; margin-top: 4px; }

        .btn-approve {
          flex: 1;
          padding: 8px;
          background: var(--primary);
          color: black;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .btn-override {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--border);
          color: var(--text-muted);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .btn-override:hover { color: white; border-color: var(--error); }
      `}</style>
    </div>
  );
}
