import { useWishlist as useWishlistFromContext } from '../contexts/WishlistContext';

/**
 * Reusable hook to access wishlist functionality.
 */
export const useWishlist = () => {
  return useWishlistFromContext();
};
