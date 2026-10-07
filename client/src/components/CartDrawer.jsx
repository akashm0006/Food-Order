import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout, onExploreMenu }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    totalAmount,
    itemCount,
    freeDeliveryThreshold,
  } = useCart();

  if (!isCartOpen) return null;

  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 13, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#111827',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.6)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
              Your Cart ({itemCount})
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Free Delivery Meter Banner */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: 'rgba(249, 115, 22, 0.07)',
              borderBottom: '1px solid rgba(249, 115, 22, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              <span style={{ color: neededForFreeDelivery === 0 ? '#10b981' : '#cbd5e1', fontWeight: 600 }}>
                {neededForFreeDelivery === 0
                  ? '🎉 Hooray! You unlocked FREE Delivery!'
                  : `Add ₹${neededForFreeDelivery} more for FREE Delivery`}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{deliveryProgress}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${deliveryProgress}%`,
                  height: '100%',
                  background: 'var(--primary-gradient)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#64748b',
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                Your cart is empty
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '240px' }}>
                Looks like you haven't added any appetizing dishes to your cart yet.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onExploreMenu();
                }}
                className="btn btn-primary"
              >
                Browse Our Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.food._id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: 0, lineHeight: 1.3 }}>
                          {item.food.name}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                          ₹{item.food.price} each
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.food._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '6px',
                          padding: '0.15rem 0.4rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        ₹{item.food.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Order Summary */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#0d131f',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Estimated Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '0.2rem',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
