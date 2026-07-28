import React, { useState } from 'react';

export default function AdminModal({ isOpen, onClose, orders, onUpdateOrderStatus, onAddRestaurant }) {
  const [tab, setTab] = useState('orders');

  // New restaurant form state
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState('4.5');
  const [deliveryTime, setDeliveryTime] = useState('25');
  const [priceForTwo, setPriceForTwo] = useState('50');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80');

  if (!isOpen) return null;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddRestaurant({
      name,
      cuisine_type: cuisine,
      rating: parseFloat(rating),
      delivery_time: parseInt(deliveryTime),
      price_for_two: parseInt(priceForTwo),
      image_url: image,
      banner_url: image,
      address: 'Gourmet Avenue, Prime District',
      distance_km: 2.5,
      is_pure_veg: false,
      offer_text: '20% OFF on first order',
      menu: [
        {
          id: Date.now(),
          name: `${name} Special Platter`,
          description: 'Chef signature tasting course with seasonal ingredients.',
          price: 24.99,
          image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
          is_veg: false,
          is_bestseller: true
        }
      ]
    });
    setName('');
    setCuisine('');
    setTab('orders');
  };

  const totalRev = orders ? orders.reduce((sum, o) => sum + o.total_amount, 0) : 0;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '950px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.8rem' }}>
            <i className="fa-solid fa-user-shield" style={{ color: '#FFB800' }}></i> Admin Portal
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={tab === 'orders' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setTab('orders')}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              Live Orders
            </button>
            <button 
              className={tab === 'add_rest' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setTab('add_rest')}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              + Add Kitchen
            </button>
          </div>
        </div>

        {tab === 'orders' ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div className="glass-card" style={{ padding: '16px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Orders</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{orders ? orders.length : 0}</h3>
              </div>
              <div className="glass-card" style={{ padding: '16px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Revenue</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-green)' }}>₹{totalRev.toFixed(2)}</h3>
              </div>
              <div className="glass-card" style={{ padding: '16px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Kitchens</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-cyan)' }}>12+</h3>
              </div>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>Order Management</h3>
            <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
              {!orders || orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <p>No active orders to manage.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '10px' }}>Order ID</th>
                      <th style={{ padding: '10px' }}>Kitchen</th>
                      <th style={{ padding: '10px' }}>Amount</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 700 }}>{o.order_code || `SAV-${o.id}`}</td>
                        <td style={{ padding: '12px 10px' }}>{o.restaurant_name}</td>
                        <td style={{ padding: '12px 10px', color: 'var(--primary)', fontWeight: 600 }}>₹{o.total_amount.toFixed(2)}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            background: 'rgba(255, 184, 0, 0.2)',
                            color: 'var(--secondary)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <select 
                            value={o.status}
                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                            style={{
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-glass)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddSubmit}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Add New Gourmet Kitchen</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Kitchen Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Truffle & Thyme"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cuisine Type</label>
                <input 
                  type="text" 
                  required
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g. French Gourmet, Artisan Pastry"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Initial Rating</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Delivery Time (mins)</label>
                <input 
                  type="number" 
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Price for Two (₹)</label>
                <input 
                  type="number" 
                  value={priceForTwo}
                  onChange={(e) => setPriceForTwo(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cover Image URL</label>
              <input 
                type="url" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Publish Kitchen <i className="fa-solid fa-check"></i>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
