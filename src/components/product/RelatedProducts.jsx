import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import ProductCard from './ProductCard';
import ProductCardSkeleton from '../ui/ProductCardSkeleton';

/**
 * RelatedProducts Component.
 * Displays a list of related products based on a similarity score algorithm.
 */
const RelatedProducts = ({ currentProduct }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // Fetch all products (no filter constraint) to compute similarity scores
  const { data: allProducts = [], isLoading, isError, error } = useProducts();

  const handleAddToCart = React.useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  const relatedList = React.useMemo(() => {
    if (!currentProduct || !allProducts || allProducts.length === 0) return [];

    // Exclude currently viewed product
    const otherProducts = allProducts.filter(
      (p) => p.id !== currentProduct.id && p._id !== currentProduct.id && p._id !== currentProduct._id
    );

    // Calculate similarity score
    const scored = otherProducts.map((p) => {
      let score = 0;

      // 1. Same Category (highest priority)
      if (p.category && currentProduct.category && p.category.toLowerCase() === currentProduct.category.toLowerCase()) {
        score += 100;
      }

      // 2. Same Dress Style
      if (p.dressStyle && currentProduct.dressStyle && p.dressStyle.toLowerCase() === currentProduct.dressStyle.toLowerCase()) {
        score += 10;
      }

      // 3. Same Brand
      if (p.brand && currentProduct.brand && p.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
        score += 5;
      }

      // 4. Similar Price Range (within $30: +2 points, within $50: +1 point)
      if (typeof p.price === 'number' && typeof currentProduct.price === 'number') {
        const diff = Math.abs(p.price - currentProduct.price);
        if (diff <= 30) {
          score += 2;
        } else if (diff <= 50) {
          score += 1;
        }
      }

      // 5. Same Section (Tie-breaker)
      if (p.section && currentProduct.section && p.section.toLowerCase() === currentProduct.section.toLowerCase()) {
        score += 0.5;
      }

      return { product: p, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Return top 4 related products
    return scored.slice(0, 4).map((item) => item.product);
  }, [allProducts, currentProduct]);

  if (isLoading) {
    return (
      <div className="row g-4 justify-content-center">
        {[1, 2, 3, 4].map((i) => (
          <div key={`related-skele-${i}`} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
            <ProductCardSkeleton className="w-100" style={{ maxWidth: '280px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-5 text-danger small">
        <i className="bi bi-exclamation-triangle mb-1 d-block"></i>
        <span>Failed to load related products: {error?.message}</span>
      </div>
    );
  }

  if (relatedList.length === 0) {
    return (
      <div className="text-center py-5 text-muted small">
        <span>No related products found.</span>
      </div>
    );
  }

  return (
    <div className="row g-4 justify-content-center flex-nowrap flex-md-wrap overflow-x-auto overflow-x-md-visible pb-3 pt-1 scrollbar-hidden related-products-row">
      <style>{`
        @media (max-width: 767px) {
          .related-products-row {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            gap: 16px !important;
            padding-bottom: 12px !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
          .related-products-row::-webkit-scrollbar {
            display: none;
          }
          .related-product-item {
            flex: 0 0 200px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      {relatedList.map((product) => (
        <div key={product.id} className="col-md-6 col-lg-3 related-product-item">
          <ProductCard
            product={product}
            onAddToCart={handleAddToCart}
            className="w-100 animate-entry"
          />
        </div>
      ))}
    </div>
  );
};

export default RelatedProducts;
