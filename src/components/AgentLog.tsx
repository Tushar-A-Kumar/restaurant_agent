'use client';

import React from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: string;
}

const AgentLog: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  return (
    <div className="agent-log glass">
      <div className="header">
        <h3>Autonomous Agent Actions</h3>
        <span className="live-tag">LIVE</span>
      </div>
      <div className="logs-container">
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="timestamp">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="message">{log.message}</span>
            {log.type === 'action' && (
              <div className="actions">
                <button className="btn-approve">Approve</button>
                <button className="btn-override">Override</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .agent-log {
          border-radius: var(--radius-lg);
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }

        .live-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--primary);
          border: 1px solid var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }

        .logs-container {
          padding: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .log-entry {
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-left: 2px solid var(--primary);
        }

        .timestamp {
          font-size: 11px;
          color: var(--text-muted);
          font-family: monospace;
        }

        .message {
          font-size: 14px;
          line-height: 1.4;
        }

        .actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        button {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .btn-approve {
          background: var(--primary);
          color: black;
        }

        .btn-override {
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .btn-override:hover {
          color: white;
          border-color: white;
        }
      `}</style>
    </div>
  );
};

export default AgentLog;
