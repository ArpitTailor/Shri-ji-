import React from 'react';
import { FaFire, FaUtensils } from 'react-icons/fa';

export default function Categories({ categories, activeCategory, onSelectCategory }) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <div className="section-header">
        <h2 className="section-title">
          <FaFire style={{ color: 'var(--primary)', marginRight: '8px' }} /> 
          Explore Categories
        </h2>
      </div>
      <div className="categories-container">
        <div 
          className={`category-card glass-card ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <div className="category-img-wrapper" style={{ background: 'rgba(255,77,77,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaUtensils style={{ fontSize: '1.8rem', color: activeCategory === 'all' ? '#FFF' : 'var(--primary)' }} />
          </div>
          <div className="category-name">All Foods</div>
        </div>

        {categories.map((cat) => (
          <div 
            key={cat.id || cat.slug}
            className={`category-card glass-card ${activeCategory === cat.slug ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.slug)}
          >
            <div className="category-img-wrapper">
              <img src={cat.image_url} alt={cat.name} />
            </div>
            <div className="category-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
