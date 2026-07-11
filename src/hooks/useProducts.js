import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

/**
 * Custom hook to fetch products using React Query caching
 * @param {string} [section] - Optional section ('new-arrivals' | 'top-selling') to filter by
 */
export const useProducts = (section) => {
  return useQuery({
    queryKey: section ? ['products', section] : ['products'],
    queryFn: () => {
      if (section) {
        return productService.getProductsBySection(section);
      }
      return productService.getAllProducts();
    },
  });
};
