import React, { useState, useEffect } from 'react';

export default function OrderTrackerModal({ isOpen, onClose, order, onOrderDelivered }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen || !order) {
      setStep(1);
      return;
    }

    // Simulate animated timeline progress
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 3500);

    const timer2 = setTimeout(() => {
      setStep(3);
    }, 7000);

    const timer3 = setTimeout(() => {
      setStep(4);
      if (onOrderDelivered) onOrderDelivered();
    }, 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, order, onOrderDelivered]);

  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '650px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="ai-badge" style={{ background: 'var(--accent-green)', borderColor: 'var(--accent-green)', color: '#FFF' }}>
            Live Tracking
          </span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '6px' }}>Order #{order.order_code || 'SAV-9821'}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Preparing from {order.restaurant_name}</p>
        </div>

        {/* Animated Timeline */}
        <div className="timeline-container">
          <div className={`timeline-step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'current' : ''}`}>
            <div className="step-icon"><i className="fa-solid fa-check"></i></div>
            <div>
              <h4 style={{ fontSize: '1rem' }}>Order Placed</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your order has been sent to the kitchen.</p>
            </div>
          </div>

          <div className={`timeline-step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'current' : ''}`}>
            <div className="step-icon"><i className="fa-solid fa-utensils"></i></div>
            <div>
              <h4 style={{ fontSize: '1rem' }}>Preparing in Kitchen</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chefs are crafting your gourmet meal with care.</p>
            </div>
          </div>

          <div className={`timeline-step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'current' : ''}`}>
            <div className="step-icon"><i className="fa-solid fa-motorcycle"></i></div>
            <div>
              <h4 style={{ fontSize: '1rem' }}>Driver Picked Up</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Courier Michael has picked up your parcel.</p>
            </div>
          </div>

          <div className={`timeline-step ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'current' : ''}`}>
            <div className="step-icon"><i className="fa-solid fa-house-chimney"></i></div>
            <div>
              <h4 style={{ fontSize: '1rem' }}>Delivered</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enjoy your delicious food!</p>
            </div>
          </div>
        </div>

        {/* Driver & Map Card */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Driver"
              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>Delivery Partner: Michael</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>
                <i className="fa-solid fa-star"></i> 4.9 (1,240 deliveries)
              </p>
            </div>
          </div>
          <a href="tel:5550199" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-phone"></i> Call Driver
          </a>
        </div>
      </div>
    </div>
  );
}
