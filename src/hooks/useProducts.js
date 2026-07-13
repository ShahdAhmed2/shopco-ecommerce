import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

/**
 * Custom hook to fetch products using React Query caching
 * @param {string} [section] - Optional section ('new-arrivals' | 'top-selling') to filter by
 */
export const useProducts = (filters) => {
  return useQuery({
    queryKey: filters ? ['products', filters] : ['products'],
    queryFn: () => {
      if (typeof filters === 'string') {
        return productService.getProductsBySection(filters);
      }
      return productService.getProducts(filters);
    },
  });
};
