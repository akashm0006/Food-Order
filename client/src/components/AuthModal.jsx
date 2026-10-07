import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal = ({ isOpen, onClose, initialRole = 'customer', onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'customer' or 'admin'
  const [mode, setMode] = useState('login'); // 'login' or 'register' (register only for customer)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePortalSwitch = (role) => {
    setSelectedRole(role);
    setMode('login');
    setError('');
    if (role === 'admin') {
      setFormData({
        ...formData,
        email: 'admin@foodhub.com',
        password: 'admin123',
      });
    } else {
      setFormData({
        ...formData,
        email: 'customer@foodhub.com',
        password: 'customer123',
      });
    }
  };

  const handleQuickFill = () => {
    if (selectedRole === 'admin') {
      setFormData({
        ...formData,
        email: 'admin@foodhub.com',
        password: 'admin123',
      });
    } else {
      setFormData({
        ...formData,
        email: 'customer@foodhub.com',
        password: 'customer123',
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const loggedInUser = await login(formData.email, formData.password);
        
        // Enforce role check if logging in via specific portal
        if (selectedRole === 'admin' && loggedInUser.role !== 'admin') {
          throw new Error('This account does not have administrator privileges.');
        }

        showToast(
          loggedInUser.role === 'admin'
            ? 'Welcome to Admin Control Center 👑'
            : `Welcome back, ${loggedInUser.name.split(' ')[0]}! 🍽️`,
          'success'
        );

        if (onSuccess) onSuccess(loggedInUser.role);
        onClose();
      } else {
        // Customer Registration
        const newUser = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          formData.address,
          'customer'
        );
        showToast(`Account created successfully! Welcome to FoodHub, ${newUser.name}!`, 'success');
        if (onSuccess) onSuccess('customer');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '480px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Role Portal Selector (Customer vs Admin) */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: '100%',
            }}
          >
            <button
              type="button"
              onClick={() => handlePortalSwitch('customer')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === 'customer' ? 'var(--primary-gradient)' : 'transparent',
                color: selectedRole === 'customer' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              <UserCheck size={16} /> Customer Portal
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('admin')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === 'admin' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                color: selectedRole === 'admin' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              <ShieldCheck size={16} /> Admin Portal
            </button>
          </div>
        </div>

        {/* Header Title based on Portal */}
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <h2 style={{ fontSize: '1.55rem', color: '#fff', marginBottom: '0.3rem' }}>
            {selectedRole === 'admin'
              ? 'Administrator Login'
              : mode === 'login'
              ? 'Customer Sign In'
              : 'Create Customer Account'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
            {selectedRole === 'admin'
              ? 'Manage food menu, incoming orders, and sales analytics'
              : mode === 'login'
              ? 'Sign in to place orders and track deliveries'
              : 'Sign up to explore our gourmet menu & order online'}
          </p>
        </div>

        {/* 1-Click Fill Demo Credentials */}
        <div
          style={{
            background:
              selectedRole === 'admin'
                ? 'rgba(245, 158, 11, 0.09)'
                : 'rgba(249, 115, 22, 0.08)',
            border:
              selectedRole === 'admin'
                ? '1px solid rgba(245, 158, 11, 0.25)'
                : '1px solid rgba(249, 115, 22, 0.25)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: selectedRole === 'admin' ? '#fbbf24' : 'var(--primary)', fontWeight: 700 }}>
              {selectedRole === 'admin' ? '👑 Admin Demo Account' : '👤 Customer Demo Account'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              {selectedRole === 'admin' ? 'admin@foodhub.com / admin123' : 'customer@foodhub.com / customer123'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            <Sparkles size={13} /> Auto Fill
          </button>
        </div>

        {/* If Customer Portal, toggle between Sign In & Register */}
        {selectedRole === 'customer' && (
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '3px',
              marginBottom: '1.2rem',
            }}
          >
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: '6px',
                border: 'none',
                background: mode === 'login' ? 'var(--primary)' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: '6px',
                border: 'none',
                background: mode === 'register' ? 'var(--primary)' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Register New
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {selectedRole === 'customer' && mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98123 45678"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Street, Landmark, City"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={selectedRole === 'admin' ? 'admin@foodhub.com' : 'customer@foodhub.com'}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.8rem',
              padding: '0.85rem',
              background:
                selectedRole === 'admin'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                  : 'var(--primary-gradient)',
            }}
          >
            {loading
              ? 'Authenticating...'
              : selectedRole === 'admin'
              ? 'Access Admin Portal 👑'
              : mode === 'login'
              ? 'Sign In as Customer'
              : 'Create Customer Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
