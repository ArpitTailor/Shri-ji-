import React from 'react';

export default function AiWidget({ aiData, onRefresh, onAddToCart }) {
  if (!aiData || !aiData.recommended_dishes) return null;

  return (
    <>
      <section className="ai-widget-banner glass-panel">
        <div>
          <div className="ai-badge">
            <i className="fa-solid fa-wand-magic-sparkles"></i> Savoria AI Assistant
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
            {aiData.meal_context ? aiData.meal_context.title : 'Personalized Suggestions For You'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {aiData.meal_context ? aiData.meal_context.subtitle : 'Curated based on your mood, time of day, and trending culinary delights.'}
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={onRefresh} 
          style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', whiteSpace: 'nowrap' }}
        >
          <i className="fa-solid fa-rotate"></i> Refresh AI Mix
        </button>
      </section>

      <div className="restaurant-grid" style={{ marginBottom: '50px' }}>
        {aiData.recommended_dishes.map((item) => (
          <div 
            key={item.id} 
            className="glass-card ai-dish-card" 
            style={{ padding: '14px', display: 'flex', gap: '14px', alignItems: 'center' }}
          >
            <img 
              src={item.image_url} 
              alt={item.name}
              style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
            />
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>
                {item.restaurant_name}
              </div>
              <h4 style={{ fontSize: '0.95rem' }}>{item.name}</h4>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                ₹{item.price.toFixed(2)}
              </div>
            </div>
            <button 
              className="icon-btn" 
              onClick={() => onAddToCart(item.id, item.name, item.price, item.restaurant_id, item.restaurant_name)} 
              title="Add to Cart"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
