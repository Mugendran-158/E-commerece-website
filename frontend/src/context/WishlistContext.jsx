import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlistItems(data || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistItems.some(
        (item) => item.productId === productId || item.product?.id === productId
      );
    },
    [wishlistItems]
  );

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      addToast('Please login to save items to your wishlist', 'warning');
      return false;
    }
    const productId = product.id || product.productId;
    if (isInWishlist(productId)) {
      addToast('Product is already in your wishlist', 'info');
      return true;
    }
    try {
      const newItem = await wishlistService.addToWishlist(productId);
      setWishlistItems((prev) => [newItem, ...prev]);
      addToast(`${product.name || 'Product'} added to your wishlist ❤️`, 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to wishlist';
      addToast(msg, 'error');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId && item.product?.id !== productId)
      );
      addToast('Removed from wishlist', 'info');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove from wishlist';
      addToast(msg, 'error');
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product.id || product.productId;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
