import React from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import './WishlistButton.css';

/**
 * Reusable Wishlist Button Component.
 * @param {Object} props
 * @param {Object} props.product - The product object to wishlist
 * @param {string} [props.className] - Optional custom classes
 */
const WishlistButton = ({ product, className = '' }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleToggle = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isWishlisted, product.id, removeFromWishlist, addToWishlist]);

  return (
    <button
      className={`wishlist-btn d-flex align-items-center justify-content-center ${
        isWishlisted ? 'wishlisted' : ''
      } ${className}`}
      onClick={handleToggle}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
    </button>
  );
};

export default React.memo(WishlistButton);
