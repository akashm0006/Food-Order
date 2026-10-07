import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = ({ onOrderPlaced, onBackToMenu, openAuthModal }) => {
  const { cartItems, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: 'Metro City',
    pincode: '110001',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate address from user profile if available
  useEffect(() => {
    if (user) {
      setDeliveryAddress((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        street: user.address || prev.street,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to place your order', 'info');
      openAuthModal();
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street) {
      setError('Please provide full name, phone number, and street address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const itemsPayload = cartItems.map((item) => ({
        foodId: item.food._id,
        name: item.food.name,
        price: item.food.price,
        quantity: item.quantity,
        image: item.food.image,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: itemsPayload,
          deliveryAddress,
          paymentMethod,
          notes: deliveryAddress.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      showToast('🎉 Order placed successfully! Tracking your delivery...', 'success');
      clearCart();
      if (onOrderPlaced) {
        onOrderPlaced(data.order._id);
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      setError(err.message || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: '#64748b',
              }}
            >
              <ShoppingBag size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.6rem' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Add some of our chef-crafted gourmet items to your cart before proceeding to checkout.
            </p>
            <button onClick={onBackToMenu} className="btn btn-primary" style={{ width: '100%' }}>
              Browse Food Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.4rem' }}>
            Review & Checkout
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
            Enter your destination details and confirm your gourmet food delivery.
          </p>
        </div>

        {!isAuthenticated && (
          <div
            style={{
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '14px',
              padding: '1.2rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '1.05rem' }}>
                Sign In For Faster Checkout
              </h4>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.85rem', marginTop: '2px' }}>
                Save delivery addresses, track live status, and view previous orders.
              </p>
            </div>
            <button onClick={openAuthModal} className="btn btn-primary btn-sm">
              Sign In or Register
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              color: '#f87171',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Delivery Address & Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Delivery Details Card */}
              <div className="glass-panel" style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.4rem' }}>
                  <MapPin size={22} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                    1. Delivery Address
                  </h3>
                </div>

                <div className="form-group">
                  <label className="form-label">Recipient's Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={deliveryAddress.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ paddingLeft: '2.6rem' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={deliveryAddress.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ paddingLeft: '2.6rem' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address & Landmark *</label>
                  <textarea
                    name="street"
                    required
                    rows={2}
                    placeholder="House/Flat number, Building name, Street, Landmark"
                    value={deliveryAddress.street}
                    onChange={handleInputChange}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={deliveryAddress.pincode}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Delivery Instructions / Cooking Note (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Ring bell twice / Extra oregano on the side"
                    value={deliveryAddress.notes}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="glass-panel" style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.4rem' }}>
                  <CreditCard size={22} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                    2. Payment Method
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {/* Option 1: Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: paymentMethod === 'Cash on Delivery' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: paymentMethod === 'Cash on Delivery' ? '1.5px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <input
                        type="radio"
                        name="payment"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <Banknote size={20} color="var(--primary)" />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>Cash on Delivery</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Pay upon doorstep arrival</div>
                      </div>
                    </div>
                    <span className="badge badge-featured">Popular</span>
                  </label>

                  {/* Option 2: Mock UPI */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: paymentMethod === 'UPI' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: paymentMethod === 'UPI' ? '1.5px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        checked={paymentMethod === 'UPI'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <QrCode size={20} color="#10b981" />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>UPI / Google Pay / PhonePe</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Instant QR Code Demo</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>⚡ Fast</span>
                  </label>

                  {/* Option 3: Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: paymentMethod === 'Online / Card' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: paymentMethod === 'Online / Card' ? '1.5px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <input
                        type="radio"
                        name="payment"
                        value="Online / Card"
                        checked={paymentMethod === 'Online / Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <CreditCard size={20} color="#60a5fa" />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>Credit / Debit Card</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Visa, Mastercard, RuPay (Demo)</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Total Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.8rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  Order Summary ({cartItems.length} items)
                </h3>

                {/* Ordered Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.2rem', paddingRight: '0.3rem' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.food._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.8rem',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={item.food.image}
                          alt={item.food.name}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ color: '#fff', fontWeight: 600 }}>{item.food.name}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                            Qty: {item.quantity} × ₹{item.food.price}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#e2e8f0' }}>
                        ₹{item.food.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>GST / Restaurant Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#fff',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '0.8rem',
                      marginTop: '0.3rem',
                    }}
                  >
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)' }}>₹{totalAmount}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginTop: '1.5rem',
                    padding: '0.95rem',
                    fontSize: '1.05rem',
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                  }}
                >
                  {submitting ? 'Placing Order...' : `Confirm & Place Order (₹${totalAmount})`}
                  <ArrowRight size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginTop: '1rem' }}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span>Secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
