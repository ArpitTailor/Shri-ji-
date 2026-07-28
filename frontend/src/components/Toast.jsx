import React, { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '14px 28px',
        zIndex: 4000,
        color: '#FFF',
        fontWeight: '600',
        fontSize: '0.95rem',
        borderColor: 'var(--primary)',
        background: 'rgba(11,14,20,0.95)',
        boxShadow: 'var(--shadow-glow)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '1.2rem' }}
      >
        &times;
      </button>
    </div>
  );
}
