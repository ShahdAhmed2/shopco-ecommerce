import React from 'react';
import './ProductCardSkeleton.css';

/**
 * Presentational Skeleton Component for ProductCard
 * Matches ProductCard dimensions to avoid Cumulative Layout Shift (CLS)
 * @param {Object} props
 * @param {Object} [props.style={}] - Custom inline style declarations
 * @param {string} [props.className=''] - Custom styling classes
 */
const ProductCardSkeleton = ({ style = {}, className = '' }) => {
  return (
    <div
      className={`card product-card-skeleton border-0 text-center bg-white flex-shrink-0 skeleton-pulse ${className}`}
      style={{
        width: '300px',
        ...style,
      }}
    >
      {/* Image Placeholder */}
      <div className="skeleton-image mb-2"></div>
      
      <div className="card-body p-2 d-flex flex-column align-items-center">
        {/* Rating Placeholder */}
        <div className="skeleton-rating mb-2"></div>
        
        {/* Title Placeholder */}
        <div className="skeleton-title mb-2"></div>
        
        {/* Price Placeholder */}
        <div className="skeleton-price mb-3"></div>
        
        {/* Button Placeholder */}
        <div className="skeleton-button w-100"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
