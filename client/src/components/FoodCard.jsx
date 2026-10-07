import React from 'react';
import { Plus, Minus, Star, Clock, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ food, onSelectFood }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const inCart = cartItems.find((item) => item.food._id === food._id);

  const getDietaryBadge = () => {
    if (food.dietary === 'veg') {
      return <span className="badge badge-veg">● Pure Veg</span>;
    } else if (food.dietary === 'non-veg') {
      return <span className="badge badge-non-veg">▲ Non-Veg</span>;
    } else if (food.dietary === 'vegan') {
      return <span className="badge badge-vegan">🌱 Vegan</span>;
    }
    return null;
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Food Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '65%',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: '#1a2234',
        }}
        onClick={() => onSelectFood(food)}
      >
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Gradient Overlay for bottom text clarity */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, transparent 60%)',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {getDietaryBadge()}
          {food.isFeatured && <span className="badge badge-featured">★ Chef Special</span>}
        </div>

        {/* Preparation Time Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.6rem',
            right: '0.75rem',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            color: '#cbd5e1',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Clock size={12} color="var(--primary)" />
          {food.preparationTime || '20 mins'}
        </div>
      </div>

      {/* Food Content */}
      <div
        style={{
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Category & Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {food.category}
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#fbbf24',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
              }}
            >
              <Star size={12} fill="#fbbf24" />
              <span>{food.rating || 4.7}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectFood(food)}
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.45rem',
              cursor: 'pointer',
              lineHeight: 1.3,
            }}
          >
            {food.name}
          </h3>

          {/* Description snippet */}
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {food.description}
          </p>
        </div>

        {/* Pricing & Cart Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Price</span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
              }}
            >
              ₹{food.price}
            </span>
          </div>

          {/* Action button */}
          {!food.isAvailable ? (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              Sold Out
            </span>
          ) : inCart ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                borderRadius: '9999px',
                padding: '0.25rem 0.5rem',
              }}
            >
              <button
                onClick={() => updateQuantity(food._id, inCart.quantity - 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                {inCart.quantity}
              </span>
              <button
                onClick={() => updateQuantity(food._id, inCart.quantity + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food, 1)}
              className="btn btn-primary btn-sm"
              style={{
                padding: '0.45rem 1rem',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              }}
            >
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
