import React from 'react';
import { FaStore, FaStar, FaBolt, FaSearch, FaTag, FaHeart, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function RestaurantGrid({
  restaurants,
  activeFilter,
  onSelectFilter,
  activeSort,
  onSelectSort,
  wishlist,
  onToggleWishlist,
  onOpenRestaurant
}) {
  return (
    <section id="restaurantGridSection">
      <div className="section-header">
        <h2 className="section-title">
          <FaStore style={{ color: 'var(--secondary)' }} /> Featured Restaurants
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Showing {restaurants.length} Kitchens
        </span>
      </div>

      {/* Filter & Sorting Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <button 
            className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onSelectFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-pill ${activeFilter === 'veg' ? 'active' : ''}`}
            onClick={() => onSelectFilter('veg')}
          >
            <span className="veg-icon" style={{ marginRight: '4px' }}></span> Veg Only
          </button>
          <button 
            className={`filter-pill ${activeFilter === 'rating' ? 'active' : ''}`}
            onClick={() => onSelectFilter('rating')}
          >
            <FaStar style={{ color: '#FFB800', marginRight: '6px' }} /> 4.5+ Rating
          </button>
          <button 
            className={`filter-pill ${activeFilter === 'fast' ? 'active' : ''}`}
            onClick={() => onSelectFilter('fast')}
          >
            <FaBolt style={{ color: '#06B6D4', marginRight: '6px' }} /> Fast Delivery (&lt;25 mins)
          </button>
        </div>

        <div className="filter-group">
          <label style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Sort By:</label>
          <select 
            value={activeSort} 
            onChange={(e) => onSelectSort(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-glass)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="relevance">Popularity</option>
            <option value="rating">Top Rated</option>
            <option value="delivery_time">Delivery Time</option>
            <option value="cost_low">Cost: Low to High</option>
            <option value="cost_high">Cost: High to Low</option>
          </select>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="restaurant-grid">
        {restaurants.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px' }}>
            <FaSearch style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No restaurants found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try clearing your search or filter criteria.</p>
          </div>
        ) : (
          restaurants.map((r) => {
            const isFav = wishlist && wishlist.has(r.id);
            return (
              <div 
                key={r.id} 
                className="restaurant-card glass-card"
                onClick={() => onOpenRestaurant(r.id)}
              >
                <div className="card-img-container">
                  <img src={r.image_url} alt={r.name} />
                  {r.offer_text && (
                    <div className="offer-badge">
                      <FaTag style={{ marginRight: '4px' }} /> {r.offer_text}
                    </div>
                  )}
                  <button 
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(r.id);
                    }}
                    title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div className="card-body">
                  <div>
                    <div className="card-header-row">
                      <h3 className="rest-title">{r.name}</h3>
                      <div className="rating-pill">
                        <FaStar style={{ marginRight: '4px' }} /> {r.rating}
                      </div>
                    </div>
                    <p className="cuisine-text">{r.cuisine_type}</p>
                  </div>
                  <div className="card-meta">
                    <span><FaClock style={{ marginRight: '4px' }} /> {r.delivery_time} mins</span>
                    <span><FaMapMarkerAlt style={{ marginRight: '4px' }} /> {r.distance_km} km</span>
                    <span>₹{r.price_for_two} for two</span>
                  </div>
                    <div style={{ marginTop: '12px' }}>
                      <button 
                        className="btn-primary order-btn" 
                        style={{ width: '100%', padding: '6px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRestaurant(r.id);
                        }}
                      >
                        <span className="order-btn-text-full">View Menu & Order</span>
                        <span className="order-btn-text-short" style={{ display: 'none' }}>Order</span>
                      </button>
                    </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
