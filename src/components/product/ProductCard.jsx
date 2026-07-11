import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable Product Card Component
 * @param {Object} props
 * @param {Object} props.product - The product details
 * @param {Function} props.onClick - Click handler for the card (opens modal)
 * @param {boolean} [props.showDiscount=true] - Toggle display of the discount badge
 * @param {boolean} [props.showRating=true] - Toggle display of the rating stars
 * @param {string} [props.className=''] - Custom styling classes
 * @param {Object} [props.style={}] - Custom inline style declarations
 * @param {Function} [props.onAddToCart] - Click handler for the Add to Cart button
 */
const ProductCard = ({
  product,
  onClick,
  showDiscount = true,
  showRating = true,
  className = '',
  style = {},
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const safeRating = Math.max(0, Math.min(5, Math.floor(product.rating || 0)));
  const discountPercent = product.discount ? `${product.discount}% OFF` : null;

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(e);
    }
  };

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      className={`card product-card border-0 text-center bg-white flex-shrink-0 animate-entry ${className}`}
      style={{
        width: '300px',
        cursor: 'pointer',
        ...style,
      }}
      onClick={handleCardClick}
    >
      <img
        src={product.image || 'https://via.placeholder.com/300x260.png'}
        alt={product.name}
        className="img-fluid mb-2"
        style={{
          width: '100%',
          height: '260px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x260.png';
        }}
      />
      <div className="card-body p-2">
        {showRating && (
          <div className="text-warning mb-1" style={{ fontSize: '0.9rem' }}>
            {'★'.repeat(safeRating)}
            {'☆'.repeat(5 - safeRating)}
            <span className="ms-1 text-dark small">
              {product.rating ? `${product.rating}/5` : ''}
            </span>
          </div>
        )}
        <div className="fw-semibold mb-1" style={{ fontSize: '1rem' }}>
          {product.name}
        </div>
        <div className="mb-2">
          <span className="fw-bold me-2">${product.price}</span>
          {showDiscount && discountPercent && (
            <span className="text-danger small bg-light px-2 py-1 rounded">
              {discountPercent}
            </span>
          )}
        </div>
        {onAddToCart && (
          <button
            className="btn btn-dark btn-sm w-100"
            onClick={handleCartClick}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
