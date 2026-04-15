'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_CREDENTIALS = [
  { email: 'admin@kitchenos.com', password: 'admin123', role: 'GM', name: 'Alex Morgan' },
  { email: 'chef@kitchenos.com', password: 'chef123', role: 'Head Chef', name: 'Maria Chen' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800)); // simulate network

    const user = DEMO_CREDENTIALS.find(
      c => c.email === email && c.password === password
    );

    if (user) {
      document.cookie = `kitchenos_auth=${JSON.stringify({ email: user.email, role: user.role, name: user.name })}; path=/; max-age=86400`;
      router.push('/');
      router.refresh();
    } else {
      setError('Invalid credentials. Try admin@kitchenos.com / admin123');
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@kitchenos.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-root">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card glass">
        <div className="brand">
          <div className="logo-mark">K</div>
          <div className="brand-text">
            <span className="brand-name"><span className="accent">Kitchen</span>OS</span>
            <span className="brand-tagline">Autonomous Restaurant Operations</span>
          </div>
        </div>

        <div className="divider" />

        <div className="card-header">
          <h1>Admin Sign In</h1>
          <p>Access the Operator Command Centre</p>
        </div>

        <form onSubmit={handleLogin} className="form">
          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kitchenos.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">⬤</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="show-pw"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              'Sign In to KitchenOS'
            )}
          </button>
        </form>

        <button className="demo-btn" onClick={fillDemo}>
          ⚡ Fill demo credentials
        </button>

        <div className="footer-note">
          <div className="secure-badge">🔒 Secure · Session expires in 24h</div>
          <div className="roles">Roles: GM · Head Chef · Ops Lead</div>
        </div>
      </div>

      <style jsx>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Animated blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: float 8s ease-in-out infinite;
        }

        .blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #10b981, transparent 70%);
          top: -100px; left: -100px;
          animation-delay: 0s;
        }

        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #f59e0b, transparent 70%);
          bottom: -80px; right: -80px;
          animation-delay: 3s;
        }

        .blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #6366f1, transparent 70%);
          top: 50%; left: 60%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 440px;
          padding: 40px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5),
                      0 0 0 1px rgba(16, 185, 129, 0.1) inset;
          animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-mark {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          color: black;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .accent { color: #10b981; }

        .brand-tagline {
          font-size: 11px;
          color: #71717a;
          letter-spacing: 0.02em;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        /* Header */
        .card-header h1 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .card-header p {
          font-size: 13px;
          color: #71717a;
        }

        /* Form */
        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 13px;
          font-weight: 500;
          color: #a1a1aa;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          font-size: 13px;
          color: #52525b;
          pointer-events: none;
        }

        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px 14px 12px 38px;
          color: white;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }

        input::placeholder { color: #52525b; }

        input:focus {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.06);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
        }

        .show-pw {
          position: absolute;
          right: 12px;
          font-size: 12px;
          color: #71717a;
          font-weight: 600;
          transition: color 0.15s;
        }

        .show-pw:hover { color: #10b981; }

        /* Error */
        .error-banner {
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 8px;
          font-size: 13px;
          color: #f87171;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: black;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(0, 0, 0, 0.2);
          border-top-color: black;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Demo btn */
        .demo-btn {
          text-align: center;
          font-size: 13px;
          color: #71717a;
          font-family: inherit;
          font-weight: 500;
          padding: 8px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .demo-btn:hover {
          color: #10b981;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.06);
        }

        /* Footer */
        .footer-note {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .secure-badge, .roles {
          font-size: 11px;
          color: #52525b;
        }
      `}</style>
    </div>
  );
}
