import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { AuthModal } from './components/AuthModal';

function MainLayout() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Set default active view based on user role
  const [activeTab, setActiveTab] = useState(() => (isAdmin ? 'admin' : 'home'));
  const [selectedFood, setSelectedFood] = useState(null);
  const [authModalState, setAuthModalState] = useState({ open: false, initialRole: 'customer' });
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);

  // Automatically switch views and enforce security when role changes
  useEffect(() => {
    if (isAdmin) {
      if (activeTab !== 'menu' && activeTab !== 'admin') {
        setActiveTab('admin');
      }
    } else {
      // Customer or Guest must NEVER be on admin tab
      if (activeTab === 'admin') {
        setActiveTab('home');
      }
    }
  }, [isAdmin]);

  const handleSelectCategoryFromHome = (categoryName) => {
    setMenuCategoryFilter(categoryName);
    setMenuSearchQuery('');
    setActiveTab('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHome = (query) => {
    setMenuSearchQuery(query);
    setActiveTab('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (orderId) => {
    setActiveTrackingOrderId(orderId);
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModalWithRole = (role = 'customer') => {
    setAuthModalState({ open: true, initialRole: role });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // Guard: prevent non-admins from switching to admin tab
          if (tab === 'admin' && !isAdmin) {
            openAuthModalWithRole('admin');
            return;
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAuthModalWithRole={openAuthModalWithRole}
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && !isAdmin && (
          <HomePage
            onSelectCategory={handleSelectCategoryFromHome}
            onSelectFood={(food) => setSelectedFood(food)}
            onExploreMenu={() => {
              setActiveTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSearch={handleSearchFromHome}
          />
        )}

        {activeTab === 'menu' && (
          <MenuPage
            initialCategory={menuCategoryFilter}
            initialSearch={menuSearchQuery}
            onSelectFood={(food) => setSelectedFood(food)}
          />
        )}

        {activeTab === 'checkout' && !isAdmin && (
          <CheckoutPage
            onOrderPlaced={handleOrderPlaced}
            onBackToMenu={() => {
              setActiveTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            openAuthModal={() => openAuthModalWithRole('customer')}
          />
        )}

        {activeTab === 'orders' && !isAdmin && (
          <MyOrdersPage
            selectedOrderId={activeTrackingOrderId}
            onExploreMenu={() => {
              setActiveTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            openAuthModal={() => openAuthModalWithRole('customer')}
          />
        )}

        {activeTab === 'admin' && isAdmin && <AdminDashboard />}
      </main>

      {/* Overlays & Drawers (Customers and Guests only) */}
      {!isAdmin && (
        <CartDrawer
          onProceedToCheckout={() => {
            setActiveTab('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreMenu={() => {
            setActiveTab('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}

      <AuthModal
        isOpen={authModalState.open}
        initialRole={authModalState.initialRole}
        onClose={() => setAuthModalState({ open: false, initialRole: 'customer' })}
        onSuccess={(role) => {
          if (role === 'admin') {
            setActiveTab('admin');
          } else {
            setActiveTab('menu');
          }
        }}
      />

      {/* Footer */}
      <Footer
        setActiveTab={(tab) => {
          if (tab === 'admin' && !isAdmin) {
            openAuthModalWithRole('admin');
            return;
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
