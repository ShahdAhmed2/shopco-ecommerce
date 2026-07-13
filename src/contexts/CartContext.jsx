import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map backend cart item schema to frontend property key formats
  const mapBackendCartToFrontend = (backendCart) => {
    if (!backendCart || !backendCart.items) return [];
    return backendCart.items.map((item) => {
      const product = item.product || {};
      return {
        itemId: item._id, // Keep cart subdocument ID for updates/deletions
        id: product._id || product.id, // Match product ID for matching checks
        name: product.name,
        image: product.image,
        price: product.price,
        discount: product.discount,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        stock: product.stock,
      };
    });
  };

  // Fetch cart on mount or when auth state changes
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setItems(mapBackendCartToFrontend(cartData));
    } catch (error) {
      console.error('Failed to retrieve cart details:', error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = useCallback(async (product, size = 'M', color = 'Black', quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add products to your cart.', { toastId: 'cart-auth-required' });
      // Redirect to login page
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.addToCart({
        product: product.id || product._id,
        quantity,
        color,
        size,
      });
      setItems(mapBackendCartToFrontend(cartData));
      toast.success('Product added to cart', {
        toastId: `add-to-cart-${product.id || product._id}-${size}-${color}`,
      });
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to add product to cart';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Remove item from cart
  const removeFromCart = useCallback(async (item) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      // Fallback: search for item by id/color/size if itemId is missing
      let targetId = item.itemId;
      if (!targetId) {
        const found = items.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        targetId = found?.itemId;
      }

      if (!targetId) {
        throw new Error('Unable to find cart item ID');
      }

      const cartData = await cartService.removeCartItem(targetId);
      setItems(mapBackendCartToFrontend(cartData));
      toast.info('Product removed from cart', {
        toastId: `remove-from-cart-${item.id}-${item.size}-${item.color}`,
      });
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, items]);

  // Update item quantity
  const updateQuantity = useCallback(async (item, size, color, quantity) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      let targetId = item.itemId;
      if (!targetId) {
        const found = items.find(
          (i) => i.id === item.id && i.size === size && i.color === color
        );
        targetId = found?.itemId;
      }

      if (!targetId) {
        throw new Error('Unable to find cart item ID');
      }

      const cartData = await cartService.updateCartItem(targetId, quantity);
      setItems(mapBackendCartToFrontend(cartData));
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, items]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const cartData = await cartService.clearCart();
      setItems(mapBackendCartToFrontend(cartData));
      toast.warn('Cart cleared', {
        toastId: 'cart-cleared',
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Calculate sum of item prices
  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemPrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [items]);

  // Calculate count of items
  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const applyPromoCode = useCallback((code) => {
    if (code.toLowerCase() === 'save20') {
      toast.success('Promo code applied successfully!', {
        toastId: 'promo-success',
      });
      return true;
    } else {
      toast.error('Invalid promo code', {
        toastId: 'promo-error',
      });
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      applyPromoCode,
      fetchCart,
    }),
    [
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      applyPromoCode,
      fetchCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};