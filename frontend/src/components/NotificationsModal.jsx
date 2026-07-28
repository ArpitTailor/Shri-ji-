import React from 'react';

export default function NotificationsModal({ isOpen, onClose, notifications, onClear }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '550px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem' }}>
            <i className="fa-solid fa-bell" style={{ color: 'var(--secondary)' }}></i> Notifications
          </h2>
          <button className="modal-close" style={{ position: 'static' }} onClick={onClose}>&times;</button>
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          {!notifications || notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <i className="fa-regular fa-bell" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '14px', marginBottom: '10px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 77, 77, 0.2)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>{n.title || 'Notification'}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{n.message || n}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications && notifications.length > 0 && (
          <button className="btn-secondary" onClick={onClear} style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
            Clear All Notifications
          </button>
        )}
      </div>
    </div>
  );
}
