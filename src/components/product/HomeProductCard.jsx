import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeProductCard.css';

/**
 * Lightweight Dedicated Home Page Product Card
 */
const HomeProductCard = ({
  product,
  onClick,
  showRating = true,
  className = '',
  style = {},
}) => {
  const navigate = useNavigate();
  const safeRating = Math.max(0, Math.min(5, Math.floor(product.rating || 0)));

  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount 
    ? Number((product.price * (1 - product.discount / 100)).toFixed(2))
    : product.price;

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      className={`card home-product-card border-0 bg-transparent flex-shrink-0 ${className}`}
      style={{
        cursor: 'pointer',
        position: 'relative',
        ...style,
      }}
      onClick={handleCardClick}
    >
      {/* Product Image Wrapper with Aspect Ratio */}
      <div className="home-product-card-img-wrapper">
        <img
          src={product.image || 'https://via.placeholder.com/300x300.png'}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300.png';
          }}
        />
      </div>

      <div className="home-product-card-body pt-3 text-start">
        {/* Name */}
        <h3 className="fw-bold home-product-title mb-1 text-dark">
          {product.name}
        </h3>

        {/* Ratings */}
        {showRating && (
          <div 
            className="text-warning mb-1 d-flex align-items-center" 
            style={{ fontSize: '0.8rem' }}
            aria-label={`Rating: ${product.rating || 0} out of 5 stars`}
            title={`Rating: ${product.rating || 0} out of 5 stars`}
          >
            <span className="me-1">
              {'★'.repeat(safeRating)}
              {'☆'.repeat(5 - safeRating)}
            </span>
            <span className="text-muted small">({product.numReviews || 0})</span>
          </div>
        )}

        {/* Pricing */}
        <div className="d-flex align-items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="fw-bold text-dark fs-6">${discountedPrice}</span>
              <span className="text-muted text-decoration-line-through small" style={{ fontSize: '0.8rem' }}>${originalPrice}</span>
              <span className="badge bg-danger-subtle text-danger px-1 rounded" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
                -{product.discount}%
              </span>
            </>
          ) : (
            <span className="fw-bold text-dark fs-6">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeProductCard);
