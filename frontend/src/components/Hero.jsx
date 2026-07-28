import React from 'react';

export default function Hero({ onExploreClick, canInstallPwa, onInstallPwa }) {
  return (
    <section className="hero-section">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" 
        alt="Gourmet Banner" 
        className="hero-bg" 
      />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-tag">
          <i className="fa-solid fa-crown"></i> #1 Gourmet Delivery App
        </div>
        <h1 className="hero-title">
          Craving <span>Perfection?</span> Delivered in Minutes.
        </h1>
        <p className="hero-desc">
          Discover top-rated Michelin & local artisan kitchens with live driver tracking and instant AI pairings.
        </p>
        <div className="hero-cta-group">
          <button className="btn-primary" onClick={onExploreClick}>
            Explore Kitchens <i className="fa-solid fa-arrow-right"></i>
          </button>
          {canInstallPwa && (
            <button 
              className="btn-secondary" 
              onClick={onInstallPwa} 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFF',
                padding: '12px 22px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}
            >
              <i className="fa-solid fa-download"></i> Install App
            </button>
          )}
        </div>
        {/* Hero Trust Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <i className="fa-solid fa-bolt" style={{ color: 'var(--secondary)' }}></i>
            <span><strong>20 Min</strong> Avg Delivery</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-star" style={{ color: 'var(--accent-green)' }}></i>
            <span><strong>4.9★</strong> Top Rated</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-cyan)' }}></i>
            <span><strong>100%</strong> Live Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
