import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color)
        )
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initializer = (initialState) => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        return { items: parsedCart.items || [] };
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  }, initializer);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, size = 'M', color = 'Black') => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, size, color }
    });
    toast.success('Product added to cart', {
      toastId: `add-to-cart-${product.id}-${size}-${color}`
    });
  };

  const removeFromCart = (product, size, color) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: product.id, size, color }
    });
    toast.info('Product removed from cart', {
      toastId: `remove-from-cart-${product.id}-${size}-${color}`
    });
  };

  const updateQuantity = (product, size, color, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: product.id, size, color, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.warn('Cart cleared', {
      toastId: 'cart-cleared'
    });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const itemPrice = item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const applyPromoCode = (code) => {
    if (code.toLowerCase() === 'save20') {
      toast.success('Promo code applied successfully!', {
        toastId: 'promo-success'
      });
      return true;
    } else {
      toast.error('Invalid promo code', {
        toastId: 'promo-error'
      });
      return false;
    }
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    applyPromoCode
  };

  return (
    <CartContext.Provider value={value}>
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