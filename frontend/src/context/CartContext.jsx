import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage initially
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopease_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shopease_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart to localStorage:', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        if (product.stockQuantity && newQty > product.stockQuantity) {
          addToast(`Only ${product.stockQuantity} items available in stock`, 'warning');
          updated[existingIndex].quantity = product.stockQuantity;
        } else {
          updated[existingIndex].quantity = newQty;
          addToast(`Updated ${product.name} quantity in cart`, 'success');
        }
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stockQuantity || 99);
        addToast(`Added ${product.name} to cart`, 'success');
        return [...prevItems, { product, quantity: initialQty }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockQuantity || 99;
          if (newQuantity > maxStock) {
            addToast(`Maximum available stock is ${maxStock}`, 'warning');
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.product.id === productId);
      if (target) {
        addToast(`Removed ${target.product.name} from cart`, 'info');
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.originalPrice;
    return sum + price * item.quantity;
  }, 0);

  // Free shipping over $100, else $9.99
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const grandTotal = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        grandTotal,
        setItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
