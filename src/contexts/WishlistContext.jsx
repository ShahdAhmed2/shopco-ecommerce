import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map backend wishlist item schema to frontend property key formats
  const mapBackendWishlistToFrontend = (backendWishlist) => {
    if (!backendWishlist || !backendWishlist.items) return [];
    return backendWishlist.items.map((item) => {
      const product = item.product || {};
      return {
        id: product._id || product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        discount: product.discount,
        rating: product.rating,
        addedAt: item.addedAt,
      };
    });
  };

  // Fetch wishlist on mount or when auth state changes
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const wishlistData = await wishlistService.getWishlist();
      setWishlistItems(mapBackendWishlistToFrontend(wishlistData));
    } catch (error) {
      console.error('Failed to retrieve wishlist details:', error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some((item) => item.id === productId);
  }, [wishlistItems]);

  const isWishlisted = useCallback((productId) => {
    return isInWishlist(productId);
  }, [isInWishlist]);

  // Add product to wishlist
  const addToWishlist = useCallback(async (product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to manage your wishlist.', { toastId: 'wishlist-auth-required' });
      // Redirect to login page
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      const wishlistData = await wishlistService.addToWishlist(product.id || product._id);
      setWishlistItems(mapBackendWishlistToFrontend(wishlistData));
      toast.success('Added to wishlist', {
        toastId: `add-wishlist-${product.id || product._id}`,
      });
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Remove product from wishlist
  const removeFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const wishlistData = await wishlistService.removeFromWishlist(productId);
      setWishlistItems(mapBackendWishlistToFrontend(wishlistData));
      toast.info('Removed from wishlist', {
        toastId: `remove-wishlist-${productId}`,
      });
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const wishlistData = await wishlistService.clearWishlist();
      setWishlistItems(mapBackendWishlistToFrontend(wishlistData));
      toast.warn('Wishlist cleared', {
        toastId: 'wishlist-cleared',
      });
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to clear wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      wishlistItems,
      loading,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      isWishlisted,
      fetchWishlist,
    }),
    [
      wishlistItems,
      loading,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      isWishlisted,
      fetchWishlist,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
