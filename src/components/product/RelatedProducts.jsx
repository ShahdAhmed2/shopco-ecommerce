import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import ProductCard from './ProductCard';

/**
 * RelatedProducts Component.
 * Displays a list of related products, excluding the current product,
 * based on the same section ('new-arrivals' or 'top-selling').
 */
const RelatedProducts = ({ currentProductId, section }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: products = [], isLoading, isError, error } = useProducts(section);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // Exclude current product and slice to max 4 items
  const relatedList = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="text-center py-5 text-muted">
        <div className="spinner-border spinner-border-sm text-dark mb-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="small mb-0">Loading related items...</p>
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
    <div className="row g-4 justify-content-center">
      {relatedList.map((product) => (
        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
          <ProductCard
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
            onAddToCart={(e) => handleAddToCart(product, e)}
            className="w-100"
            style={{ maxWidth: '280px' }}
          />
        </div>
      ))}
    </div>
  );
};

export default RelatedProducts;
