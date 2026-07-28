import React, { useState } from 'react';

export default function LocationModal({ isOpen, onClose, currentLocation, onSelectLocation }) {
  const [customLoc, setCustomLoc] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!isOpen) return null;

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          if (res.ok) {
             const data = await res.json();
             const address = data.address || {};
             const locName = address.village || address.city || address.town || address.county || data.display_name || `GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`;
             onSelectLocation(locName);
          } else {
             throw new Error("Failed to fetch");
          }
        } catch (error) {
          const locName = `GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}) - Prime Hub`;
          onSelectLocation(locName);
        }
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        alert('Unable to retrieve location. Please select from popular hubs below.');
      }
    );
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customLoc.trim()) return;
    onSelectLocation(customLoc.trim());
  };

  const hubs = [
    'Downtown, Tech District',
    'Beverly Hills, Prime Avenue',
    'Manhattan, Midtown East',
    'Silicon Valley, Innovation Way',
    'Kensington, Royal Borough'
  ];

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container glass-panel" style={{ maxWidth: '500px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i> Select Delivery Location
        </h2>

        <button 
          className="btn-primary" 
          onClick={handleDetectGps}
          disabled={detecting}
          style={{ width: '100%', justifyContent: 'center', marginBottom: '20px', background: 'linear-gradient(135deg, var(--accent-green), #059669)' }}
        >
          <i className={detecting ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-crosshairs"}></i>
          {detecting ? 'Detecting GPS Location...' : 'Auto-Detect Current GPS Location'}
        </button>

        <form onSubmit={handleCustomSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Enter street, neighborhood, or city..."
              value={customLoc}
              onChange={(e) => setCustomLoc(e.target.value)}
              style={{
                flexGrow: 1,
                padding: '10px 14px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '8px 18px' }}>Set</button>
          </div>
        </form>

        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Popular Gourmet Hubs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {hubs.map((h, idx) => (
            <div 
              key={idx}
              className="glass-card"
              onClick={() => onSelectLocation(h)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: currentLocation === h ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                background: currentLocation === h ? 'rgba(255, 77, 77, 0.1)' : ''
              }}
            >
              <span><i className="fa-solid fa-building-user" style={{ marginRight: '10px', color: 'var(--text-muted)' }}></i> {h}</span>
              {currentLocation === h && <i className="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
