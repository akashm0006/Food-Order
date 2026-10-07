import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Package,
  Menu,
  X,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ activeTab, setActiveTab, openAuthModalWithRole }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isAdmin ? 'rgba(15, 20, 32, 0.95)' : 'rgba(11, 15, 25, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isAdmin ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => {
              if (isAdmin) {
                setActiveTab('admin');
              } else {
                setActiveTab('home');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: isAdmin
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                  : 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isAdmin ? '0 4px 14px rgba(245, 158, 11, 0.45)' : '0 4px 14px rgba(249, 115, 22, 0.45)',
              }}
            >
              {isAdmin ? <ShieldCheck size={24} color="#0b0f19" /> : <Flame size={24} color="#ffffff" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                  }}
                >
                  Food<span style={{ color: isAdmin ? '#fbbf24' : 'var(--primary)' }}>Hub</span>
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(249, 115, 22, 0.15)',
                    color: isAdmin ? '#fbbf24' : 'var(--primary)',
                    border: isAdmin ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(249, 115, 22, 0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {isAdmin ? '👑 ADMIN' : 'CUSTOMER'}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, marginTop: '-2px' }}>
                {isAdmin ? 'Management Control Center' : 'Gourmet Dining & Delivery'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links based on role */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.35rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            className="desktop-nav"
          >
            {isAdmin ? (
              /* ADMIN-ONLY NAVIGATION */
              <>
                <button
                  onClick={() => setActiveTab('admin')}
                  style={{
                    background: activeTab === 'admin' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                    color: activeTab === 'admin' ? '#000' : '#fbbf24',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <ShieldCheck size={16} /> Admin Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: activeTab === 'menu' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: activeTab === 'menu' ? '#fff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  View Food Menu (Live)
                </button>
              </>
            ) : (
              /* CUSTOMER & GUEST NAVIGATION */
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  style={{
                    background: activeTab === 'home' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                    color: activeTab === 'home' ? 'var(--primary)' : '#cbd5e1',
                    border: activeTab === 'home' ? '1px solid rgba(249, 115, 22, 0.35)' : '1px solid transparent',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: activeTab === 'menu' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                    color: activeTab === 'menu' ? 'var(--primary)' : '#cbd5e1',
                    border: activeTab === 'menu' ? '1px solid rgba(249, 115, 22, 0.35)' : '1px solid transparent',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Food Menu
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                      background: activeTab === 'orders' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                      color: activeTab === 'orders' ? 'var(--primary)' : '#cbd5e1',
                      border: activeTab === 'orders' ? '1px solid rgba(249, 115, 22, 0.35)' : '1px solid transparent',
                      borderRadius: '9999px',
                      padding: '0.45rem 1.1rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Package size={15} /> My Orders
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Show Cart ONLY to Customers & Guests (Admins don't have shopping cart clutter) */}
            {!isAdmin && (
              <button
                onClick={() => setIsCartOpen(true)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(249, 115, 22, 0.12)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                aria-label="View Shopping Cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      minWidth: '20px',
                      height: '20px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      border: '2px solid #0b0f19',
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Dropdown if logged in */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '12px',
                    background: isAdmin ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    border: isAdmin ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isAdmin ? '#fbbf24' : 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#000',
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ textAlign: 'left', display: 'none' }} className="user-text-desk">
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: isAdmin ? '#fbbf24' : '#94a3b8' }}>
                      {isAdmin ? '👑 Administrator' : '👤 Customer'}
                    </p>
                  </div>
                  <ChevronDown size={14} color="#94a3b8" />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '115%',
                      width: '220px',
                      backgroundColor: '#161f30',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.6rem',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.6rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.4rem' }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{user.name}</p>
                      <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</p>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '0.3rem',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          background: isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                          color: isAdmin ? '#fbbf24' : 'var(--primary)',
                        }}
                      >
                        {isAdmin ? '👑 Administrator' : '👤 Customer'}
                      </span>
                    </div>

                    {!isAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('orders');
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.6rem',
                          background: 'none',
                          border: 'none',
                          color: '#cbd5e1',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          borderRadius: '6px',
                        }}
                      >
                        <Package size={16} /> My Orders
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.6rem',
                          background: 'none',
                          border: 'none',
                          color: '#fbbf24',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          borderRadius: '6px',
                        }}
                      >
                        <ShieldCheck size={16} /> Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        setActiveTab('home');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.6rem',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '6px',
                        marginTop: '0.2rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* GUEST BUTTONS: Distinct Customer Sign In vs Admin Portal */
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => openAuthModalWithRole('customer')}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.55rem 1rem' }}
                >
                  <UserIcon size={15} /> Customer Sign In
                </button>
                <button
                  onClick={() => openAuthModalWithRole('admin')}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '0.55rem 0.85rem',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    background: 'rgba(245, 158, 11, 0.1)',
                  }}
                  title="Restaurant Administrator Access"
                >
                  <ShieldCheck size={15} /> Admin Portal
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.4rem',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {isAdmin ? (
              <button
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'flex-start', background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
              >
                👑 Admin Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  Home
                </button>
                <button
                  onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  Food Menu
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    My Orders
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .user-text-desk { display: block !important; }
        }
      `}</style>
    </header>
  );
};
