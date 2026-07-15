import React from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistButton from '../ui/WishlistButton';
import './ProductCard.css';

/**
 * Reusable Product Card Component
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

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleCartClick = React.useCallback((e) => {
    e.stopPropagation();
    if (onAddToCart && product.stock > 0) {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  // Badge priority selector (Max 2 badges)
  const activeBadges = React.useMemo(() => {
    const list = [];
    if (product.stock === 0) {
      list.push({ text: 'Out of Stock', bg: 'bg-danger text-white' });
    } else if (product.stock > 0 && product.stock <= 5) {
      list.push({ text: `Only ${product.stock} left`, bg: 'bg-warning text-dark' });
    }
    if (product.section === 'new-arrivals') {
      list.push({ text: 'NEW', bg: 'bg-primary text-white' });
    }
    if (product.section === 'top-selling') {
      list.push({ text: 'TOP SELLER', bg: 'bg-success text-white' });
    }
    if (product.rating >= 4.8) {
      list.push({ text: 'POPULAR', bg: 'bg-warning text-dark' });
    }
    return list.slice(0, 2);
  }, [product.stock, product.section, product.rating]);

  return (
    <div
      className={`card product-card border-0 bg-white flex-shrink-0 ${className}`}
      style={{
        cursor: 'pointer',
        position: 'relative',
        ...style,
      }}
      onClick={handleCardClick}
    >
      {/* Product Image Badges Overlay - Smaller and cleaner */}
      <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1" style={{ zIndex: 5 }}>
        {activeBadges.map((badge, idx) => (
          <span 
            key={`badge-${idx}`} 
            className={`badge ${badge.bg} text-uppercase`}
            style={{ fontSize: '0.6rem', padding: '3px 6px', borderRadius: '3px', fontWeight: 'bold' }}
          >
            {badge.text}
          </span>
        ))}
      </div>

      <WishlistButton product={product} className="wishlist-card-overlay" />

      {/* Image & Quick Action Overlay Container */}
      <div className="product-card-img-wrapper position-relative">
        <img
          src={product.image || 'https://via.placeholder.com/300x260.png'}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x260.png';
          }}
        />
        {/* Desktop Quick Actions Overlay */}
        <div className="quick-actions-overlay">
          <button 
            type="button" 
            className="btn btn-light btn-sm rounded-pill px-3 fw-bold shadow-sm"
            style={{ width: '120px', height: '36px', fontSize: '0.75rem' }}
            onClick={handleViewDetails}
          >
            View Details
          </button>
          {onAddToCart && (
            <button 
              type="button" 
              className="btn btn-dark btn-sm rounded-pill px-3 fw-bold shadow-sm"
              style={{ width: '120px', height: '36px', fontSize: '0.75rem' }}
              onClick={handleCartClick}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between text-start">
        <div>
          {/* Brand */}
          <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            {product.brand || 'Premium Wear'}
          </div>

          {/* Title */}
          <h3 className="fw-bold product-title-clamp mb-1 text-dark" style={{ fontSize: '0.9rem' }}>
            {product.name}
          </h3>

          {/* Category & Dress Style Tag */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {product.category || 'Clothing'}
            </span>
            {product.dressStyle && (
              <span className="badge bg-light text-muted border-0 px-2 py-1" style={{ fontSize: '0.65rem', borderRadius: '4px' }}>
                {product.dressStyle}
              </span>
            )}
          </div>

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

          {/* Pricing (Directly below ratings) */}
          <div className="mb-2 d-flex align-items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>${discountedPrice}</span>
                <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>${originalPrice}</span>
                <span className="badge bg-danger-subtle text-danger px-1 rounded" style={{ fontSize: '0.65rem' }}>
                  -{product.discount}%
                </span>
              </>
            ) : (
              <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>${originalPrice}</span>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Accessible Quick Actions */}
        <div className="d-lg-none d-flex gap-2 mt-2">
          <button 
            type="button" 
            className="btn btn-outline-dark btn-sm flex-grow-1 py-1 rounded-pill"
            style={{ fontSize: '0.7rem', height: '32px' }}
            onClick={handleViewDetails}
          >
            Details
          </button>
          {onAddToCart && (
            <button 
              type="button" 
              className="btn btn-dark btn-sm flex-grow-1 py-1 rounded-pill"
              style={{ fontSize: '0.7rem', height: '32px' }}
              onClick={handleCartClick}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
