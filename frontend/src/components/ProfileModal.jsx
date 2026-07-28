import React from 'react';

export default function ProfileModal({ isOpen, onClose, user, orders }) {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '650px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
          <i className="fa-solid fa-user-gear" style={{ color: 'var(--primary)' }}></i> My Account
        </h2>

        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-user"></i>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>{user.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
            <span style={{
              background: 'rgba(255, 184, 0, 0.2)',
              color: 'var(--secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginTop: '4px'
            }}>
              {user.role}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div><strong>Phone:</strong> <span>{user.phone || 'Not set'}</span></div>
          <div style={{ marginTop: '4px' }}><strong>Saved Address:</strong> <span>{user.address || 'Not set'}</span></div>
        </div>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>
          <i className="fa-solid fa-receipt" style={{ color: 'var(--secondary)' }}></i> Order History
        </h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '6px' }}>
          {!orders || orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-receipt" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
              <p>No past orders yet</p>
            </div>
          ) : (
            orders.map((o) => {
              const itemsCount = o.items ? o.items.reduce((s, i) => s + i.qty, 0) : 0;
              return (
                <div key={o.id} className="glass-card" style={{ padding: '14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.order_code || `SAV-${o.id}`}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{o.restaurant_name}</span>
                    </div>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: 'var(--accent-green)',
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {o.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{itemsCount} items • {o.payment_method}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{o.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
