import React from 'react';

export default function WishlistModal({ isOpen, onClose, wishlist, restaurants, onOpenRestaurant, onToggleWishlist }) {
  if (!isOpen) return null;

  const wishedRests = restaurants.filter(r => wishlist.has(r.id));

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '650px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
          <i className="fa-solid fa-heart" style={{ color: 'var(--primary)' }}></i> Saved Kitchens ({wishedRests.length})
        </h2>

        <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '8px' }}>
          {wishedRests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <i className="fa-regular fa-heart" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
              <p>No kitchens in your wishlist yet</p>
            </div>
          ) : (
            wishedRests.map((r) => (
              <div 
                key={r.id} 
                className="glass-card" 
                onClick={() => {
                  onClose();
                  onOpenRestaurant(r.id);
                }}
                style={{
                  padding: '12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={r.image_url} 
                  alt={r.name}
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{r.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{r.cuisine_type}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', marginTop: '4px', fontWeight: 600 }}>
                    <i className="fa-solid fa-star"></i> {r.rating} • {r.delivery_time} mins
                  </div>
                </div>
                <button 
                  className="icon-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(r.id);
                  }} 
                  title="Remove from wishlist"
                >
                  <i className="fa-solid fa-trash" style={{ fontSize: '0.9rem', color: '#EF4444' }}></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
