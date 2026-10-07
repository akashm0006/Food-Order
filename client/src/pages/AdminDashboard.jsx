import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  X,
  AlertTriangle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
  const { token, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview, foods, categories, orders, users
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('All');

  // Modals
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, type: '', id: null, title: '' });

  // Food Form State
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true,
    isFeatured: false,
    isPopular: false,
    dietary: 'veg',
    preparationTime: '20-25 mins',
    calories: '450 kcal',
    ingredients: '',
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  // Fetch Dashboard Stats & Overview
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/orders/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch Foods
  const fetchFoods = async () => {
    try {
      const res = await fetch('/api/food');
      const data = await res.json();
      if (data.success) {
        setFoods(data.foods || []);
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const url = orderStatusFilter === 'All' ? '/api/orders/all' : `/api/orders/all?status=${orderStatusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  // Initial Load
  useEffect(() => {
    if (isAdmin && token) {
      setLoading(true);
      Promise.all([fetchStats(), fetchFoods(), fetchCategories(), fetchOrders(), fetchUsers()]).finally(() =>
        setLoading(false)
      );
    }
  }, [isAdmin, token]);

  // Refetch orders when status filter changes
  useEffect(() => {
    if (isAdmin && token && activeTab === 'orders') {
      fetchOrders();
    }
  }, [orderStatusFilter, activeTab]);

  // Toggle Food Availability
  const handleToggleAvailability = async (food) => {
    try {
      const res = await fetch(`/api/food/${food._id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !food.isAvailable }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`"${food.name}" is now ${!food.isAvailable ? 'Available' : 'Sold Out'}`, 'info');
        setFoods((prev) =>
          prev.map((f) => (f._id === food._id ? { ...f, isAvailable: !food.isAvailable } : f))
        );
      }
    } catch (err) {
      showToast('Failed to update availability', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to "${newStatus}"`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        setRecentOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        fetchStats(); // Update counters
      } else {
        showToast(data.message || 'Status update failed', 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  // Save Food (Create or Update)
  const handleSaveFood = async (e) => {
    e.preventDefault();
    try {
      const url = editingFood ? `/api/food/${editingFood._id}` : '/api/food';
      const method = editingFood ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(foodForm),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingFood ? 'Food updated successfully!' : 'Food item created!', 'success');
        setFoodModalOpen(false);
        setEditingFood(null);
        fetchFoods();
      } else {
        showToast(data.message || 'Failed to save food item', 'error');
      }
    } catch (err) {
      showToast('Error saving food item', 'error');
    }
  };

  // Open Edit Food Modal
  const openEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      isAvailable: food.isAvailable,
      isFeatured: food.isFeatured || false,
      isPopular: food.isPopular || false,
      dietary: food.dietary || 'veg',
      preparationTime: food.preparationTime || '20-25 mins',
      calories: food.calories || '450 kcal',
      ingredients: food.ingredients ? food.ingredients.join(', ') : '',
    });
    setFoodModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Category created successfully!', 'success');
        setCategoryModalOpen(false);
        setCategoryForm({ name: '', description: '', image: '' });
        fetchCategories();
      } else {
        showToast(data.message || 'Failed to create category', 'error');
      }
    } catch (err) {
      showToast('Error creating category', 'error');
    }
  };

  // Execute Deletion
  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirmModal;
    try {
      let endpoint = '';
      if (type === 'food') endpoint = `/api/food/${id}`;
      else if (type === 'category') endpoint = `/api/categories/${id}`;
      else if (type === 'user') endpoint = `/api/users/${id}`;

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Item removed successfully`, 'success');
        setDeleteConfirmModal({ open: false, type: '', id: null, title: '' });
        if (type === 'food') fetchFoods();
        else if (type === 'category') fetchCategories();
        else if (type === 'user') fetchUsers();
      } else {
        showToast(data.message || 'Failed to delete', 'error');
      }
    } catch (err) {
      showToast('Error deleting item', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
            <ShieldCheck size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.6rem' }}>Access Restricted</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              You must be logged in as an administrator to access the restaurant management dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtered foods for table
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      food.description.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCategory =
      foodCategoryFilter === 'All' || food.category.toLowerCase() === foodCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 800 }}>
                👑 RESTAURANT ADMIN PORTAL
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#fff', margin: 0 }}>
              FoodHub Management Center
            </h1>
          </div>

          <button
            onClick={() => {
              fetchStats();
              fetchFoods();
              fetchCategories();
              fetchOrders();
              fetchUsers();
              showToast('Refreshed all admin data', 'info');
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={15} /> Refresh Dashboard
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'overview' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <LayoutDashboard size={18} /> Overview & Sales
          </button>

          <button
            onClick={() => setActiveTab('foods')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'foods' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <UtensilsCrossed size={18} /> Food Menu ({foods.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'categories' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <Layers size={18} /> Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'orders' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <ShoppingBag size={18} /> Orders Management ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'users' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <Users size={18} /> Registered Customers ({users.length})
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* KPI Summary Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Total Revenue */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  ₹{stats?.totalRevenue?.toLocaleString() || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <TrendingUp size={14} /> From completed & active orders
                </div>
              </div>

              {/* Total Orders */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Total Orders</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  {stats?.totalOrders || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Across all delivery statuses
                </div>
              </div>

              {/* Active Kitchen Orders */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Active Kitchen Orders</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  {stats?.pendingOrders || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '0.4rem' }}>
                  Preparing & out for delivery
                </div>
              </div>

              {/* Registered Customers */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Registered Users</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(147, 51, 234, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  {users.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Total accounts registered
                </div>
              </div>
            </div>

            {/* Order Status Breakdown Badges */}
            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.2rem' }}>
                Order Lifecycle Distribution
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                }}
              >
                {stats?.statusCounts &&
                  Object.entries(stats.statusCounts).map(([status, count]) => (
                    <div
                      key={status}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'center',
                      }}
                    >
                      <span className={`badge badge-status badge-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {status}
                      </span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '0.6rem', fontFamily: 'var(--font-heading)' }}>
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Recent Incoming Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  View All Orders →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((ord) => (
                      <tr key={ord._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '0.9rem 1rem', color: '#cbd5e1', fontWeight: 600 }}>
                          #{ord._id.slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: '0.9rem 1rem', color: '#fff' }}>
                          {ord.user?.name || ord.deliveryAddress?.fullName || 'Guest'}
                        </td>
                        <td style={{ padding: '0.9rem 1rem', color: '#fff', fontWeight: 700 }}>
                          ₹{ord.totalAmount}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span className={`badge badge-status badge-status-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="form-select"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto', background: '#1e293b' }}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: FOOD MENU MANAGEMENT ================= */}
        {activeTab === 'foods' && (
          <div>
            {/* Header Action Bar */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem',
                marginBottom: '1.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', borderRadius: '9999px', fontSize: '0.88rem' }}
                  />
                </div>

                <select
                  value={foodCategoryFilter}
                  onChange={(e) => setFoodCategoryFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', borderRadius: '9999px', fontSize: '0.88rem', background: '#131a29' }}
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingFood(null);
                  setFoodForm({
                    name: '',
                    description: '',
                    price: '',
                    category: categories[0]?.name || 'Pizzas',
                    image: '',
                    isAvailable: true,
                    isFeatured: false,
                    isPopular: false,
                    dietary: 'veg',
                    preparationTime: '20-25 mins',
                    calories: '450 kcal',
                    ingredients: '',
                  });
                  setFoodModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} /> Add New Food Item
              </button>
            </div>

            {/* Food Items Table */}
            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Dish</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Dietary</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Availability</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((food) => (
                    <tr key={food._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={food.image}
                            alt={food.name}
                            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{food.name}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.76rem', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {food.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#cbd5e1' }}>{food.category}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#fff', fontWeight: 800 }}>₹{food.price}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        {food.dietary === 'veg' && <span className="badge badge-veg">Veg</span>}
                        {food.dietary === 'non-veg' && <span className="badge badge-non-veg">Non-Veg</span>}
                        {food.dietary === 'vegan' && <span className="badge badge-vegan">Vegan</span>}
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <button
                          onClick={() => handleToggleAvailability(food)}
                          style={{
                            background: food.isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: food.isAvailable ? '#10b981' : '#ef4444',
                            border: `1px solid ${food.isAvailable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          {food.isAvailable ? '● Available' : '○ Sold Out'}
                        </button>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditFood(food)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.7rem' }}
                            title="Edit food item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmModal({ open: true, type: 'food', id: food._id, title: food.name })}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.7rem' }}
                            title="Delete food item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CATEGORIES MANAGEMENT ================= */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Food Categories</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>Organize culinary menu sections</p>
              </div>

              <button
                onClick={() => setCategoryModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus size={18} /> Add New Category
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {categories.map((cat) => (
                <div key={cat._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                      alt={cat.name}
                      style={{ width: '100%', height: '140px', borderRadius: '12px', objectFit: 'cover', marginBottom: '1rem' }}
                    />
                    <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.4rem' }}>{cat.name}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>{cat.description || 'No description provided.'}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.78rem', color: cat.isActive ? '#10b981' : '#64748b', fontWeight: 600 }}>
                      {cat.isActive ? 'Active Section' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setDeleteConfirmModal({ open: true, type: 'category', id: cat._id, title: cat.name })}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.3rem 0.65rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div>
            {/* Status Filter Bar */}
            <div
              className="glass-panel"
              style={{
                padding: '1rem',
                marginBottom: '1.8rem',
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, marginRight: '0.5rem' }}>
                Filter Status:
              </span>
              {['All', 'Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: orderStatusFilter === st ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders Feed */}
            {orders.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                <Package size={44} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>No orders found</h4>
                <p style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
                  There are currently no orders with status "{orderStatusFilter}".
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {orders.map((ord) => (
                <div key={ord._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      paddingBottom: '0.8rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      flexWrap: 'wrap',
                      gap: '0.8rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h4 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                          Order #{ord._id.slice(-6).toUpperCase()}
                        </h4>
                        <span className={`badge badge-status badge-status-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {ord.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        Placed on {new Date(ord.createdAt).toLocaleString()} by{' '}
                        <strong style={{ color: '#fff' }}>{ord.deliveryAddress?.fullName || ord.user?.name}</strong>{' '}
                        ({ord.deliveryAddress?.phone})
                      </div>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Update Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        className="form-select"
                        style={{
                          width: 'auto',
                          background: '#1f293d',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          padding: '0.45rem 0.8rem',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Items list & Delivery address in columns */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {/* Items */}
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Ordered Items:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {ord.items.map((i, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#e2e8f0' }}>{i.name} × {i.quantity}</span>
                            <span style={{ color: '#94a3b8' }}>₹{i.price * i.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Details */}
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Delivery Destination:
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                        {ord.deliveryAddress?.street}, {ord.deliveryAddress?.city} - {ord.deliveryAddress?.pincode}
                        {ord.deliveryAddress?.notes && (
                          <div style={{ color: '#f59e0b', marginTop: '0.3rem', fontSize: '0.8rem' }}>
                            Note: "{ord.deliveryAddress.notes}"
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                        Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                      </div>
                    </div>

                    {/* Total Amount Box */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Order Value</span>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                        ₹{ord.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* ================= TAB 5: REGISTERED CUSTOMERS ================= */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ padding: '1.8rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>
              Customer Accounts Directory ({users.length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Orders</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Member Since</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.9rem 1rem', color: '#fff', fontWeight: 600 }}>
                        {u.name}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: '#94a3b8' }}>{u.email}</td>
                      <td style={{ padding: '0.9rem 1rem', color: '#cbd5e1' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            color: u.role === 'admin' ? '#fbbf24' : '#cbd5e1',
                          }}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: '#fff', fontWeight: 700 }}>
                        {u.orderCount || 0}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= MODAL: ADD / EDIT FOOD ================= */}
        {foodModalOpen && (
          <div className="modal-overlay" onClick={() => setFoodModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                  {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                </h3>
                <button
                  onClick={() => setFoodModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveFood}>
                <div className="form-group">
                  <label className="form-label">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="e.g. Truffle Mushroom Artisan Pizza"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      value={foodForm.category}
                      onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                      className="form-select"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={foodForm.price}
                      onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                      placeholder="e.g. 349"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    placeholder="Describe flavor notes, ingredients, dough, cheese..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL (High-Res Food Photo) *</label>
                  <input
                    type="url"
                    required
                    value={foodForm.image}
                    onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Dietary</label>
                    <select
                      value={foodForm.dietary}
                      onChange={(e) => setFoodForm({ ...foodForm, dietary: e.target.value })}
                      className="form-select"
                    >
                      <option value="veg">Pure Veg</option>
                      <option value="non-veg">Non-Veg</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prep Time</label>
                    <input
                      type="text"
                      value={foodForm.preparationTime}
                      onChange={(e) => setFoodForm({ ...foodForm, preparationTime: e.target.value })}
                      placeholder="20-25 mins"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calories</label>
                    <input
                      type="text"
                      value={foodForm.calories}
                      onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                      placeholder="540 kcal"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ingredients (Comma Separated)</label>
                  <input
                    type="text"
                    value={foodForm.ingredients}
                    onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                    placeholder="Buffalo Mozzarella, Truffle Oil, Wild Mushrooms, Thyme"
                    className="form-input"
                  />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={foodForm.isAvailable}
                      onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                    />
                    <span>Available In Kitchen</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={foodForm.isFeatured}
                      onChange={(e) => setFoodForm({ ...foodForm, isFeatured: e.target.checked })}
                    />
                    <span>Chef's Special (Featured)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={foodForm.isPopular}
                      onChange={(e) => setFoodForm({ ...foodForm, isPopular: e.target.checked })}
                    />
                    <span>Trending Popular</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.8rem' }}>
                  {editingFood ? 'Save Changes' : 'Create Food Item'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: ADD CATEGORY ================= */}
        {categoryModalOpen && (
          <div className="modal-overlay" onClick={() => setCategoryModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '480px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Add Category</h3>
                <button
                  onClick={() => setCategoryModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory}>
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Artisanal Sandwiches"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="e.g. Sourdough paninis and subs"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Create Category
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= CONFIRM DELETE MODAL ================= */}
        {deleteConfirmModal.open && (
          <div className="modal-overlay" onClick={() => setDeleteConfirmModal({ open: false, type: '', id: null, title: '' })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '420px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <AlertTriangle size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.4rem' }}>
                Confirm Deletion
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Are you sure you want to permanently delete <strong>"{deleteConfirmModal.title}"</strong>?
              </p>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => setDeleteConfirmModal({ open: false, type: '', id: null, title: '' })}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
