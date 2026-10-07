import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Truck,
  ChefHat,
  BellRing,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = [
  { key: 'Placed', label: 'Order Placed', stepNum: 1, icon: BellRing, desc: 'Received & recorded in restaurant system' },
  { key: 'Confirmed', label: 'Confirmed', stepNum: 2, icon: CheckCircle2, desc: 'Kitchen accepted the order' },
  { key: 'Preparing', label: 'Preparing', stepNum: 3, icon: ChefHat, desc: 'Chef is crafting and baking your food' },
  { key: 'Out for Delivery', label: 'Out for Delivery', stepNum: 4, icon: Truck, desc: 'Rider on the way to your delivery address' },
  { key: 'Delivered', label: 'Delivered', stepNum: 5, icon: Package, desc: 'Delivered! Bon appétit!' },
];

export const MyOrdersPage = ({ onExploreMenu, openAuthModal, selectedOrderId }) => {
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(selectedOrderId || null);
  const pollIntervalRef = useRef(null);

  const fetchOrders = async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.orders.length > 0) {
          // If activeOrderId is null or no longer exists, select first order
          setActiveOrderId((prevId) => {
            if (prevId && data.orders.some((o) => o._id === prevId)) {
              return prevId;
            }
            return data.orders[0]._id;
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Immediate fetch on mount & whenever token/auth changes
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();

      // Real-time auto polling every 3 seconds to sync admin updates instantly!
      pollIntervalRef.current = setInterval(() => {
        fetchOrders(true);
      }, 3000);

      return () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      };
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Set active order if passed via prop
  useEffect(() => {
    if (selectedOrderId) {
      setActiveOrderId(selectedOrderId);
    }
  }, [selectedOrderId]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
            <Package size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.6rem' }}>
              Sign In to View Orders
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Please login with your customer account to view your active deliveries and order history.
            </p>
            <button onClick={openAuthModal} className="btn btn-primary" style={{ width: '100%' }}>
              Sign In as Customer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeOrder = orders.find((o) => o._id === activeOrderId) || orders[0];

  // Precise Step State Calculation
  const getStepState = (stepKey, currentStatus) => {
    if (currentStatus === 'Cancelled') {
      return stepKey === 'Placed' ? 'completed' : 'cancelled';
    }
    const stepOrder = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = stepOrder.indexOf(currentStatus);
    const thisIndex = stepOrder.indexOf(stepKey);

    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return '#3b82f6';
      case 'Confirmed': return '#a855f7';
      case 'Preparing': return '#f59e0b';
      case 'Out for Delivery': return '#f97316';
      case 'Delivered': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return 'var(--primary)';
    }
  };

  const getStatusHeadline = (status) => {
    switch (status) {
      case 'Placed': return 'Order Placed — Kitchen received your order';
      case 'Confirmed': return 'Order Confirmed — Kitchen accepted your meal';
      case 'Preparing': return 'Preparing — Chef is currently cooking';
      case 'Out for Delivery': return 'Out for Delivery — Rider is on the way';
      case 'Delivered': return 'Delivered — Order completed!';
      case 'Cancelled': return 'Order Cancelled';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                REAL-TIME LIVE TRACKING
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#fff', margin: 0 }}>
              Order Tracking & History
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, marginTop: '2px' }}>
              Follow your order lifecycle from stone-oven preparation to your doorstep.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Updating...' : 'Sync Status'}</span>
          </button>
        </div>

        {loading ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8' }}>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                color: '#64748b',
              }}
            >
              <Package size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>
              No orders placed yet
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 1.8rem auto' }}>
              Explore our chef-crafted menu and order delicious food right to your doorstep!
            </p>
            <button onClick={onExploreMenu} className="btn btn-primary">
              Browse Menu & Order
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#cbd5e1', margin: 0 }}>
                  Your Orders ({orders.length})
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Select order to track</span>
              </div>

              {orders.map((ord) => {
                const isSelected = activeOrder && activeOrder._id === ord._id;
                const statusColor = getStatusColor(ord.status);

                return (
                  <div
                    key={ord._id}
                    onClick={() => setActiveOrderId(ord._id)}
                    className="glass-card"
                    style={{
                      padding: '1.2rem',
                      cursor: 'pointer',
                      borderRadius: '16px',
                      border: isSelected ? `2px solid ${statusColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.03)',
                      boxShadow: isSelected ? `0 0 20px ${statusColor}33` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                          ORDER #{ord._id.slice(-6).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <span
                        className="badge"
                        style={{
                          background: `${statusColor}22`,
                          color: statusColor,
                          border: `1px solid ${statusColor}55`,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                        }}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '0.6rem' }}>
                      {ord.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {ord.paymentMethod}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                        ₹{ord.totalAmount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active Order Live Visual Stepper Tracker */}
            {activeOrder && (
              <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
                {/* Status Hero Card */}
                <div
                  style={{
                    background: `${getStatusColor(activeOrder.status)}18`,
                    border: `1.5px solid ${getStatusColor(activeOrder.status)}44`,
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: getStatusColor(activeOrder.status), fontWeight: 800, textTransform: 'uppercase' }}>
                      Current Live Status
                    </span>
                    <h2 style={{ fontSize: '1.45rem', color: '#fff', margin: '0.2rem 0 0 0' }}>
                      {getStatusHeadline(activeOrder.status)}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                      Order #{activeOrder._id.slice(-6).toUpperCase()} • {activeOrder.items.length} items
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      fontSize: '0.92rem',
                      padding: '0.5rem 1.2rem',
                      background: getStatusColor(activeOrder.status),
                      color: '#ffffff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      fontWeight: 800,
                    }}
                  >
                    {activeOrder.status}
                  </span>
                </div>

                {/* Cancelled Banner if cancelled */}
                {activeOrder.status === 'Cancelled' ? (
                  <div
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      color: '#f87171',
                      marginBottom: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <AlertCircle size={24} />
                    <div>
                      <strong style={{ fontSize: '1rem' }}>Order Cancelled</strong>
                      <div style={{ fontSize: '0.85rem', marginTop: '2px', color: '#cbd5e1' }}>
                        This order was marked as cancelled by restaurant administration.
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 5-Stage Live Visual Stepper */
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', position: 'relative' }}>
                      {STATUS_STEPS.map((step, idx) => {
                        const stepState = getStepState(step.key, activeOrder.status);
                        const isCurrent = stepState === 'current';
                        const isCompleted = stepState === 'completed';
                        const Icon = step.icon;

                        // Distinct styling for each step state
                        const stepColor = isCompleted
                          ? '#10b981' // Green for completed
                          : isCurrent
                          ? getStatusColor(step.key) // Vibrant stage color for active
                          : '#475569'; // Muted for upcoming

                        return (
                          <div
                            key={step.key}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '1.2rem',
                              position: 'relative',
                            }}
                          >
                            {/* Vertical Connector Line */}
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '21px',
                                  top: '44px',
                                  bottom: '-28px',
                                  width: '3px',
                                  backgroundColor: isCompleted
                                    ? '#10b981'
                                    : 'rgba(255, 255, 255, 0.1)',
                                  zIndex: 1,
                                  transition: 'background-color 0.4s ease',
                                }}
                              />
                            )}

                            {/* Node Circle */}
                            <div
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                background: isCompleted
                                  ? '#10b981'
                                  : isCurrent
                                  ? `linear-gradient(135deg, ${stepColor} 0%, ${stepColor}cc 100%)`
                                  : '#1e293b',
                                color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                                border: isCurrent ? `3px solid ${stepColor}` : '2px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: isCurrent ? `0 0 25px ${stepColor}88` : 'none',
                                animation: isCurrent ? 'pulseGlow 2s infinite' : 'none',
                                flexShrink: 0,
                              }}
                            >
                              {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                            </div>

                            {/* Stage Details */}
                            <div style={{ flex: 1, paddingTop: '0.2rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span
                                  style={{
                                    fontSize: '1.05rem',
                                    fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                                    color: isCurrent ? stepColor : isCompleted ? '#ffffff' : '#64748b',
                                  }}
                                >
                                  {step.label}
                                </span>

                                {isCurrent && (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      background: `${stepColor}28`,
                                      color: stepColor,
                                      border: `1px solid ${stepColor}55`,
                                      padding: '0.15rem 0.6rem',
                                      borderRadius: '9999px',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    ● Active Now
                                  </span>
                                )}

                                {isCompleted && (
                                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                    ✓ Done
                                  </span>
                                )}
                              </div>

                              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem', color: isCurrent ? '#cbd5e1' : '#64748b' }}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items in Active Order */}
                <div style={{ marginBottom: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.2rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.8rem' }}>
                    Items Ordered:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          fontSize: '0.88rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{item.name}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
                          </div>
                        </div>
                        <span style={{ color: '#e2e8f0', fontWeight: 700 }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destination & Payment Summary */}
                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#cbd5e1' }}>
                    <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>Delivery to:</strong> {activeOrder.deliveryAddress.fullName},{' '}
                      {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city} ({activeOrder.deliveryAddress.phone})
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ color: '#94a3b8' }}>
                      Payment: <strong>{activeOrder.paymentMethod}</strong> ({activeOrder.paymentStatus})
                    </span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>
                      Total: ₹{activeOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
