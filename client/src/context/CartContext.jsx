import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('foodhub_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Could not save cart to local storage:', e);
    }
  }, [cartItems]);

  const addToCart = (food, quantity = 1) => {
    if (!food.isAvailable) {
      showToast(`"${food.name}" is currently sold out`, 'error');
      return;
    }

    const existing = cartItems.find((item) => item.food._id === food._id);
    if (existing) {
      showToast(`Updated "${food.name}" quantity (${existing.quantity + quantity})`, 'info');
      setCartItems((prev) =>
        prev.map((item) =>
          item.food._id === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      showToast(`Added "${food.name}" to cart! 🛒`, 'success');
      setCartItems((prev) => [...prev, { food, quantity }]);
    }
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.food._id === foodId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (foodId) => {
    const targetItem = cartItems.find((item) => item.food._id === foodId);
    if (targetItem) {
      showToast(`Removed "${targetItem.food.name}" from cart`, 'info');
    }
    setCartItems((prev) => prev.filter((item) => item.food._id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
  const freeDeliveryThreshold = 300;
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 40;
  const tax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
        itemCount,
        freeDeliveryThreshold,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
