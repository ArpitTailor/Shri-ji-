import React, { useState } from 'react';

export default function RestaurantModal({ isOpen, restaurant, onClose, onAddToCart, onBuyNow }) {
  const [menuSearch, setMenuSearch] = useState('');

  if (!isOpen || !restaurant) return null;

  const filteredMenu = (restaurant.menu || []).filter(item => 
    item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    item.description.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div 
        className="modal-container glass-panel" 
        style={{ maxWidth: '950px', padding: 0, overflowY: 'auto', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header-image">
          <img 
            src={restaurant.banner_url || restaurant.image_url} 
            alt={restaurant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div className="modal-header-content">
            <h2 className="modal-rest-title">{restaurant.name}</h2>
            <p className="modal-rest-subtitle">
              {restaurant.cuisine_type} • {restaurant.address} • Rating {restaurant.rating}★
            </p>
          </div>
        </div>

        <div className="modal-body">
          {/* Menu Tabs & Dish Search */}
          <div className="modal-menu-header">
            <h3 className="modal-menu-title">Menu Items ({filteredMenu.length})</h3>
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="modal-menu-search"
            />
          </div>

          <div className="menu-items-grid">
            {filteredMenu.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <p>No dishes match your search.</p>
              </div>
            ) : (
              filteredMenu.map((item) => (
                <div 
                  key={item.id}
                  className="glass-card menu-item-card" 
                >
                  <div className="menu-item-info" style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={item.is_veg ? 'veg-icon' : 'nonveg-icon'}></span>
                      {item.is_bestseller && (
                        <span className="bestseller-badge" style={{
                          background: 'rgba(255, 184, 0, 0.2)',
                          color: 'var(--secondary)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          BESTSELLER
                        </span>
                      )}
                    </div>
                    <h4 className="menu-item-title">{item.name}</h4>
                    <div className="menu-item-price">
                      ₹{item.price.toFixed(2)}
                    </div>
                    <p className="menu-item-desc">{item.description}</p>
                  </div>
                  <div className="menu-item-actions">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '4px' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => onAddToCart(item.id, item.name, item.price, restaurant.id, restaurant.name)}
                        style={{ padding: '6px', fontSize: '0.75rem', width: '100%', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => onBuyNow(item.id, item.name, item.price, restaurant.id, restaurant.name)}
                        style={{ padding: '6px', fontSize: '0.75rem', width: '100%' }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
