'use client';

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Agent guardrails · API integrations · Notification preferences</p>
        </div>
      </div>

      <div className="sections">
        <div className="section glass">
          <h2>Agent Guardrails</h2>
          <div className="settings-list">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-name">Auto-approve POs under</span>
                <span className="setting-desc">Agent will auto-execute purchase orders below this threshold</span>
              </div>
              <div className="input-group">
                <span className="prefix">₹</span>
                <input type="number" defaultValue={5000} className="setting-input" />
              </div>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-name">Override window</span>
                <span className="setting-desc">Seconds GM has to cancel an autonomous action</span>
              </div>
              <div className="input-group">
                <input type="number" defaultValue={60} className="setting-input" />
                <span className="suffix">sec</span>
              </div>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-name">Dry-run mode</span>
                <span className="setting-desc">Log all agent decisions but do not execute any actions</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={true} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="section glass">
          <h2>Integrations</h2>
          <div className="integrations-grid">
            {[
              { name: 'Square POS', status: 'connected', color: 'var(--primary)' },
              { name: 'Supabase DB', status: 'connected', color: 'var(--primary)' },
              { name: 'Supplier API', status: 'sandbox', color: 'var(--secondary)' },
              { name: 'KDS System', status: 'not connected', color: 'var(--error)' },
            ].map(int => (
              <div key={int.name} className="integration-card">
                <div className="int-name">{int.name}</div>
                <div className="int-status" style={{ color: int.color }}>{int.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page { display: flex; flex-direction: column; gap: 28px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        h1 { font-size: 32px; margin-bottom: 4px; }
        .subtitle { color: var(--text-muted); font-size: 14px; }
        .sections { display: flex; flex-direction: column; gap: 20px; }
        .section { padding: 24px; border-radius: 12px; }
        h2 { font-size: 18px; margin-bottom: 20px; }
        .settings-list { display: flex; flex-direction: column; gap: 20px; }
        .setting-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px; background: rgba(255,255,255,0.02); border-radius: 8px;
          border: 1px solid var(--border);
        }
        .setting-info { display: flex; flex-direction: column; gap: 4px; }
        .setting-name { font-weight: 600; font-size: 14px; }
        .setting-desc { font-size: 12px; color: var(--text-muted); }
        .input-group { display: flex; align-items: center; gap: 8px; }
        .setting-input {
          background: rgba(255,255,255,0.08); border: 1px solid var(--border);
          color: white; padding: 8px 12px; border-radius: 6px;
          font-size: 14px; width: 90px; font-family: monospace;
          outline: none;
        }
        .setting-input:focus { border-color: var(--primary); }
        .prefix, .suffix { color: var(--text-muted); font-size: 14px; }
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; inset: 0;
          background: rgba(255,255,255,0.1); border-radius: 24px;
          transition: 0.3s;
        }
        .slider:before {
          content: ''; position: absolute; height: 18px; width: 18px;
          left: 3px; bottom: 3px; background: white; border-radius: 50%;
          transition: 0.3s;
        }
        input:checked + .slider { background: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }
        .integrations-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        .integration-card {
          padding: 16px; border-radius: 8px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .int-name { font-weight: 600; font-size: 14px; }
        .int-status { font-size: 12px; text-transform: capitalize; font-weight: 600; }
      `}</style>
    </div>
  );
}
