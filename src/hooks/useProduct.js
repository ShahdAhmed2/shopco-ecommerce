import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

/**
 * Custom hook to fetch a single product by its ID
 * @param {string|number} id - Product ID
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};
