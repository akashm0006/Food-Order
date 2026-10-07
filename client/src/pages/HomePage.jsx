import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Clock,
  Truck,
  Award,
  ChevronRight,
} from 'lucide-react';
import { FoodCard } from '../components/FoodCard';

export const HomePage = ({
  onSelectCategory,
  onSelectFood,
  onExploreMenu,
  onSearch,
}) => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, foodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/food'),
        ]);

        const catData = await catRes.json();
        const foodData = await foodRes.json();

        if (catData.success) {
          setCategories(catData.categories || []);
        }

        if (foodData.success) {
          const foods = foodData.foods || [];
          setFeaturedFoods(foods.filter((f) => f.isFeatured).slice(0, 4));
          setPopularFoods(foods.filter((f) => f.isPopular).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
    onExploreMenu();
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 5.5rem 0',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Hero Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(249, 115, 22, 0.12)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1.2rem',
                }}
              >
                <Sparkles size={16} />
                <span>Premium Gourmet Dining & Express Delivery</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  marginBottom: '1.2rem',
                  color: '#ffffff',
                }}
              >
                Craving Something <br />
                <span
                  style={{
                    background: 'var(--primary-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Extraordinary?
                </span>
              </h1>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  maxWidth: '520px',
                }}
              >
                From wood-fired artisan sourdough pizzas to sizzling double smash burgers and rich miso ramen. Prepared fresh by culinary masters and delivered to your doorstep in 30 minutes.
              </p>

              {/* Live Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.5rem 0.4rem 1.4rem',
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: '2rem',
                  maxWidth: '520px',
                }}
              >
                <Search size={20} color="#94a3b8" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search for pizza, burgers, ramen, alfredo..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '0.95rem',
                    flex: 1,
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
                  Search
                </button>
              </form>

              {/* Guarantees Badges */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.88rem' }}>
                  <Clock size={18} color="var(--primary)" />
                  <span>30 Min Express Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.88rem' }}>
                  <Award size={18} color="#f59e0b" />
                  <span>100% Quality Ingredients</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.88rem' }}>
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Live Kitchen Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards Showcase */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  maxHeight: '440px',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
                  alt="Artisan Pizza Gourmet"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11, 15, 25, 0.85) 0%, transparent 60%)',
                  }}
                />

                {/* Floating Dish Highlights */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(17, 24, 39, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '18px',
                    padding: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="badge badge-featured" style={{ marginBottom: '0.3rem' }}>
                      🔥 Trending Item
                    </span>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Truffle Mushroom Artisan Pizza</h4>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>₹349</span>
                  </div>
                  <button
                    onClick={onExploreMenu}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.6rem 1rem' }}
                  >
                    Order Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Strip */}
      <section style={{ padding: '2rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: 0 }}>Explore Categories</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, marginTop: '2px' }}>
                Handpicked collections designed for every culinary mood
              </p>
            </div>
            <button
              onClick={onExploreMenu}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.9rem',
              }}
            >
              See all <ChevronRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.name);
                  onExploreMenu();
                }}
                className="glass-card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  borderRadius: '14px',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: 0 }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Explore</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef's Specials / Featured Food Items */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-featured" style={{ marginBottom: '0.5rem' }}>
                Chef's Recommendations
              </span>
              <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Featured Dishes</h2>
            </div>
            <button onClick={onExploreMenu} className="btn btn-secondary">
              View Full Menu <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.8rem',
            }}
          >
            {featuredFoods.map((food) => (
              <FoodCard key={food._id} food={food} onSelectFood={onSelectFood} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Popular Items */}
      <section style={{ padding: '2rem 0 5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f97316', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <Flame size={18} />
                <span>CUSTOMER FAVORITES</span>
              </div>
              <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Popular This Week</h2>
            </div>
            <button onClick={onExploreMenu} className="btn btn-secondary">
              Explore All <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.8rem',
            }}
          >
            {popularFoods.map((food) => (
              <FoodCard key={food._id} food={food} onSelectFood={onSelectFood} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works banner */}
      <section style={{ padding: '4rem 0', background: 'rgba(249, 115, 22, 0.04)', borderTop: '1px solid rgba(249, 115, 22, 0.1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.6rem' }}>
              How FoodHub Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Seamless online food ordering experience designed for ease, transparency, and speed.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto', fontSize: '1.4rem', fontWeight: 800 }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Browse Menu</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Explore fresh artisanal pizzas, burgers, bowls, and pastas with detailed descriptions & prices.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto', fontSize: '1.4rem', fontWeight: 800 }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Add to Cart & Checkout</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Easily customize item quantities, enter delivery address, and confirm your order.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto', fontSize: '1.4rem', fontWeight: 800 }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Track Order Live</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Watch your order progress from Placed, Confirmed, Preparing, Out for Delivery, to Delivered!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
