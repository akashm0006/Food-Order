import React, { useState } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodDetailModal = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', padding: 0, overflow: 'hidden' }}
      >
        {/* Modal Header Image */}
        <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#1e293b' }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #131a29 0%, transparent 60%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <X size={18} />
          </button>

          {/* Floating Badges */}
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1.5rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#fff',
                background: 'var(--primary)',
                padding: '0.25rem 0.7rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}
            >
              {food.category}
            </span>
            {food.dietary === 'veg' && <span className="badge badge-veg">● Pure Veg</span>}
            {food.dietary === 'non-veg' && <span className="badge badge-non-veg">▲ Non-Veg</span>}
            {food.dietary === 'vegan' && <span className="badge badge-vegan">🌱 Vegan</span>}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, flex: 1, paddingRight: '1rem' }}>
              {food.name}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                padding: '0.3rem 0.65rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <Star size={14} fill="#fbbf24" />
              <span>{food.rating || 4.8}</span>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {food.description}
          </p>

          {/* Meta Information Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
              }}
            >
              <Clock size={16} color="var(--primary)" style={{ margin: '0 auto 0.3rem auto' }} />
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Prep Time</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>{food.preparationTime || '20 mins'}</div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
              }}
            >
              <Flame size={16} color="#f59e0b" style={{ margin: '0 auto 0.3rem auto' }} />
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Calories</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>{food.calories || '450 kcal'}</div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.85rem', margin: '0 auto 0.2rem auto' }}>
                {food.isAvailable ? '🟢' : '🔴'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Availability</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: food.isAvailable ? '#10b981' : '#ef4444' }}>
                {food.isAvailable ? 'In Kitchen' : 'Sold Out'}
              </div>
            </div>
          </div>

          {/* Ingredients list if present */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Key Ingredients & Toppings:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {food.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Footer Action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '0.5rem',
            }}
          >
            {/* Quantity Stepper */}
            {food.isAvailable && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1rem', minWidth: '22px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}

            {/* Total & Add CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Total</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  ₹{food.price * quantity}
                </div>
              </div>

              {food.isAvailable ? (
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{ minWidth: '150px' }}
                >
                  {added ? (
                    <>
                      <Check size={18} /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Cart
                    </>
                  )}
                </button>
              ) : (
                <button className="btn btn-secondary" disabled>
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
