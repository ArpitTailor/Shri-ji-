import React from 'react';
import { FaUtensils, FaMapMarkerAlt, FaChevronDown, FaSearch, FaSun, FaMoon, FaBell, FaHeart, FaShoppingBag, FaMobileAlt, FaUserShield, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar({
  theme,
  onToggleTheme,
  locationText,
  onOpenLocationModal,
  searchQuery,
  onSearchChange,
  wishlistCount,
  onOpenWishlist,
  cartCount,
  onToggleCart,
  notifCount,
  onOpenNotifications,
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onLogout,
  canInstallPwa,
  onInstallPwa
}) {
  return (
    <nav className="navbar">
      <div className="logo-container" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="logo-icon">
          <FaUtensils />
        </div>
        <div className="logo-text">Shri Ji Restaurant</div>
      </div>

      <div 
        className="location-selector" 
        onClick={onOpenLocationModal} 
        title="Click to detect or change your delivery location"
      >
        <FaMapMarkerAlt />
        <span>{locationText || 'Downtown, Tech District'}</span>
        <FaChevronDown style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} />
      </div>

      <div className="nav-search">
        <FaSearch />
        <input 
          type="text" 
          placeholder="Search dishes, cuisines, or restaurants..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="nav-actions">
        {/* Theme Toggle */}
        <button className="icon-btn" onClick={onToggleTheme} title="Toggle Light/Dark Theme">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notifications */}
        <button className="icon-btn" onClick={onOpenNotifications} title="Notifications">
          <FaBell />
          {notifCount > 0 && <span className="badge-count">{notifCount}</span>}
        </button>

        {/* Wishlist */}
        <button className="icon-btn" onClick={onOpenWishlist} title="Wishlist">
          <FaHeart />
          <span className="badge-count">{wishlistCount}</span>
        </button>

        {/* Cart Drawer Toggle */}
        <button className="icon-btn" onClick={onToggleCart} title="Shopping Cart">
          <FaShoppingBag />
          <span className="badge-count">{cartCount}</span>
        </button>

        {/* Install PWA App Button */}
        {canInstallPwa && (
          <button 
            className="btn-primary" 
            onClick={onInstallPwa} 
            style={{ background: 'linear-gradient(135deg, var(--accent-green), #059669)', padding: '8px 16px', fontSize: '0.85rem' }} 
            title="Install Savoria App"
          >
            <FaMobileAlt style={{ marginRight: '6px' }} /> Install App
          </button>
        )}

        {/* User Profile / Login */}
        <div id="userAuthContainer">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.role === 'admin' && (
                <button 
                  className="btn-primary" 
                  onClick={onOpenAdmin} 
                  style={{ background: 'linear-gradient(135deg, #FFB800, #FF7300)', fontSize: '0.85rem', padding: '8px 14px' }}
                >
                  <FaUserShield style={{ marginRight: '6px' }} /> Admin
                </button>
              )}
              <div 
                className="glass-card" 
                onClick={onOpenProfile} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', cursor: 'pointer' }}
                title="View Account & Orders"
              >
                <img 
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
              </div>
              <button className="icon-btn" onClick={onLogout} title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button className="btn-primary sign-in-btn" onClick={onOpenAuth}>
              <FaUser className="sign-in-icon" /> <span className="sign-in-text">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
