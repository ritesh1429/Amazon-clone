import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart, addToCart, updateCartItem, removeCartItem } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCartItems(res.data.data || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await addToCart(productId, quantity);
      await loadCart();
      return true;
    } catch (err) {
      console.error('Add to cart failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, quantity) => {
    setLoading(true);
    try {
      await updateCartItem(id, quantity);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    setLoading(true);
    try {
      await removeCartItem(id);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCartLocal = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, loading,
      addItem, updateItem, removeItem, loadCart, clearCartLocal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
