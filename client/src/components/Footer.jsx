import React from 'react';
import { Flame, Heart, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer
      style={{
        backgroundColor: '#070a12',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: '5rem',
        padding: '4rem 0 2rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                Food<span style={{ color: 'var(--primary)' }}>Hub</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              A full-featured MERN Stack Online Food Ordering & Restaurant Management System. Built with high performance, seamless ordering flow, and centralized administrative controls.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-featured">MongoDB</span>
              <span className="badge badge-featured">Express.js</span>
              <span className="badge badge-featured">React 18</span>
              <span className="badge badge-featured">Node.js</span>
              <span className="badge badge-featured">JWT Auth</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                >
                  Home & Specials
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                >
                  Explore Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                >
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ShieldCheck size={14} /> Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem' }}>Kitchen & Helpdesk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>402 Gourmet Boulevard, Midtown Hub, Downtown City</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210 / 1800-FOOD-HUB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>Open Everyday: 10:00 AM – 11:30 PM</span>
              </div>
            </div>
          </div>

          {/* Order Guarantee */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.2rem' }}>Service Standards</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                ⚡ <strong>30-Minute Delivery:</strong> Hot & fresh food guaranteed from our wood-fired oven and wok kitchens straight to your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} FoodHub Management System. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
            <span>for academic & commercial food ordering excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
