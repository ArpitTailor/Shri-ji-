import React, { useState, useEffect } from 'react';

export default function CheckoutModal({ isOpen, onClose, cart, user, onPlaceOrder }) {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');

  useEffect(() => {
    if (user && user.address) {
      setAddress(user.address);
    } else {
      setAddress(localStorage.getItem('savoria_location') || 'Downtown, Tech District');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const discount = cart.discountAmount || 0;
  const total = Math.max(0, subtotal - discount + 3.50);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder({
      address,
      paymentMethod,
      subtotal,
      tax: 1.50,
      delivery_fee: 2.00,
      discount,
      total_amount: total
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '600px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
          <i className="fa-solid fa-truck-fast" style={{ color: 'var(--primary)' }}></i> Complete Order
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Delivery Address
            </label>
            <textarea 
              rows="3" 
              required 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full street address and building number..."
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '10px'
              }}
            ></textarea>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <label 
                className="glass-card" 
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: paymentMethod === 'Card' ? '2px solid var(--primary)' : '1px solid var(--border-glass)'
                }}
                onClick={() => setPaymentMethod('Card')}
              >
                <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === 'Card'} readOnly style={{ display: 'none' }} />
                <i className="fa-regular fa-credit-card" style={{ display: 'block', fontSize: '1.3rem', marginBottom: '4px', color: paymentMethod === 'Card' ? 'var(--primary)' : 'inherit' }}></i>
                Card
              </label>

              <label 
                className="glass-card" 
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-glass)'
                }}
                onClick={() => setPaymentMethod('UPI')}
              >
                <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} readOnly style={{ display: 'none' }} />
                <i className="fa-solid fa-qrcode" style={{ display: 'block', fontSize: '1.3rem', marginBottom: '4px', color: paymentMethod === 'UPI' ? 'var(--primary)' : 'inherit' }}></i>
                UPI / QR
              </label>

              <label 
                className="glass-card" 
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border-glass)'
                }}
                onClick={() => setPaymentMethod('COD')}
              >
                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} readOnly style={{ display: 'none' }} />
                <i className="fa-solid fa-money-bill-wave" style={{ display: 'block', fontSize: '1.3rem', marginBottom: '4px', color: paymentMethod === 'COD' ? 'var(--primary)' : 'inherit' }}></i>
                Cash on Delivery
              </label>
            </div>
          </div>

          <div style={{ background: 'var(--border-glass)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Payable Amount:</span> 
              <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem' }}>
            Confirm & Pay Order <i className="fa-solid fa-lock"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
