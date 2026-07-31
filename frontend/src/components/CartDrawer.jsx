import React, { useState } from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onApplyCoupon,
  onProceedCheckout
}) {
  const [couponInput, setCouponInput] = useState('');

  const subtotal = cart.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const taxFee = subtotal > 0 ? 3.50 : 0.00;
  const discount = cart.discountAmount || 0;
  const total = Math.max(0, subtotal - discount + taxFee);

  const handleApply = () => {
    if (!couponInput.trim()) return;
    onApplyCoupon(couponInput.trim().toUpperCase(), subtotal);
  };

  return (
    <div className={`cart-drawer glass-panel ${isOpen ? 'active' : ''}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>
            <i className="fa-solid fa-cart-shopping" style={{ color: 'var(--primary)' }}></i> Your Cart
          </h3>
          <button className="modal-close" style={{ position: 'static' }} onClick={onClose}>&times;</button>
        </div>
        {cart.restaurant_name && (
          <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '8px' }}>
            From: {cart.restaurant_name}
          </p>
        )}
      </div>

      <div className="cart-items-list">
        {cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-basket-shopping" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.items.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                <div className="cart-item-price">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>
              </div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
        {/* Coupon Code Section */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input 
            type="text" 
            placeholder="Promo Code (SHRIJI20)" 
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            style={{
              flexGrow: 1,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              outline: 'none'
            }} 
          />
          <button 
            className="btn-primary" 
            onClick={handleApply} 
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Apply
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--accent-green)', fontSize: '0.9rem' }}>
          <span>Discount {cart.appliedCoupon ? `(${cart.appliedCoupon})` : ''}</span> <span>-₹{discount.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span>Delivery & Tax</span> <span>₹{taxFee.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700 }}>
          <span>Total Amount</span> <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
        </div>
        <button 
          className="btn-primary" 
          onClick={onProceedCheckout} 
          style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem' }}
        >
          Proceed to Checkout <i className="fa-solid fa-credit-card"></i>
        </button>
      </div>
    </div>
  );
}
