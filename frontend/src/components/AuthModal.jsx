import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [tab, setTab] = useState('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('alex@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister(regName, regEmail, regPassword);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '450px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border-glass)', marginBottom: '20px', paddingBottom: '10px' }}>
          <h3 
            onClick={() => setTab('login')} 
            style={{ cursor: 'pointer', color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Login
          </h3>
          <h3 
            onClick={() => setTab('register')} 
            style={{ cursor: 'pointer', color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Register
          </h3>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required 
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }} 
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Password</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required 
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }} 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Name</label>
              <input 
                type="text" 
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required 
                placeholder="e.g. Alex Rivera"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }} 
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email Address</label>
              <input 
                type="email" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required 
                placeholder="alex@example.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }} 
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Password</label>
              <input 
                type="password" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required 
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }} 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
