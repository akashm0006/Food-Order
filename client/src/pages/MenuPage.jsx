import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, UtensilsCrossed } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';

export const MenuPage = ({
  initialCategory = 'All',
  initialSearch = '',
  onSelectFood,
}) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'veg', 'non-veg', 'vegan'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc', 'rating-desc'
  const [loading, setLoading] = useState(true);

  // Sync initial search if passed from hero
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Sync initial category if clicked on home
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch foods with dynamic filters
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        if (dietaryFilter !== 'all') {
          params.append('dietary', dietaryFilter);
        }
        if (inStockOnly) {
          params.append('isAvailable', 'true');
        }
        if (sortBy) {
          params.append('sort', sortBy);
        }

        const res = await fetch(`/api/food?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setFoods(data.foods || []);
        }
      } catch (err) {
        console.error('Failed to fetch food items:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFoods();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, dietaryFilter, inStockOnly, sortBy]);

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header & Page Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.6rem', color: '#fff', marginBottom: '0.4rem' }}>
            Culinary Menu
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
            Freshly prepared artisanal dishes, authentic recipes, and handcrafted beverages.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          {/* Top row: Search input & Sorting */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                minWidth: '260px',
              }}
            >
              <Search
                size={18}
                color="#64748b"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                placeholder="Search food by name, ingredient, flavor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem', borderRadius: '9999px' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* In Stock Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.88rem',
                color: '#cbd5e1',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                }}
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="var(--primary)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{
                  width: 'auto',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.88rem',
                  background: '#131a29',
                }}
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.2rem',
              scrollbarWidth: 'none',
            }}
          >
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                border: 'none',
                background: selectedCategory === 'All' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === 'All' ? '#fff' : '#cbd5e1',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              All Dishes
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: selectedCategory === cat.name ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat.name ? '#fff' : '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Dietary Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Dietary Preference:
            </span>
            <button
              onClick={() => setDietaryFilter('all')}
              style={{
                background: dietaryFilter === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: dietaryFilter === 'all' ? '#fff' : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Types
            </button>
            <button
              onClick={() => setDietaryFilter('veg')}
              style={{
                background: dietaryFilter === 'veg' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: dietaryFilter === 'veg' ? '#10b981' : '#94a3b8',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ● Pure Veg
            </button>
            <button
              onClick={() => setDietaryFilter('non-veg')}
              style={{
                background: dietaryFilter === 'non-veg' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                color: dietaryFilter === 'non-veg' ? '#ef4444' : '#94a3b8',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ▲ Non-Veg
            </button>
            <button
              onClick={() => setDietaryFilter('vegan')}
              style={{
                background: dietaryFilter === 'vegan' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: dietaryFilter === 'vegan' ? '#38bdf8' : '#94a3b8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🌱 100% Plant-Based
            </button>
          </div>
        </div>

        {/* Results Info Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Showing <strong>{foods.length}</strong> delicious dishes
            {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>

          {(searchQuery || selectedCategory !== 'All' || dietaryFilter !== 'all' || inStockOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setDietaryFilter('all');
                setInStockOnly(false);
                setSortBy('newest');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.8rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-card"
                style={{ height: '360px', opacity: 0.5, animation: 'pulseGlow 1.5s infinite' }}
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: '#64748b',
              }}
            >
              <UtensilsCrossed size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.4rem' }}>
              No dishes found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px', marginBottom: '1.5rem' }}>
              We couldn't find anything matching your search criteria. Try modifying your filters or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setDietaryFilter('all');
                setInStockOnly(false);
              }}
              className="btn btn-primary"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.8rem',
            }}
          >
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} onSelectFood={onSelectFood} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
