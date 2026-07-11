import React from 'react';
import './ProductDetailsSkeleton.css';

/**
 * Presentational Skeleton Component for Product Details Page
 * Matches ProductDetails layout to prevent CLS
 */
const ProductDetailsSkeleton = () => {
  return (
    <div className="container py-4 product-details-skeleton skeleton-pulse">
      {/* Breadcrumb Placeholder */}
      <div className="skeleton-breadcrumbs mb-4"></div>

      {/* Grid Layout matching details page */}
      <div className="row g-5">
        {/* Left Column: Image display placeholder */}
        <div className="col-12 col-md-6">
          <div className="skeleton-details-image border rounded-3 p-3 bg-white"></div>
        </div>

        {/* Right Column: Info placeholders */}
        <div className="col-12 col-md-6">
          <div className="skeleton-details-title mb-2"></div>
          <div className="skeleton-details-rating mb-3"></div>
          <div className="skeleton-details-price mb-3"></div>
          
          <div className="skeleton-details-text mb-2"></div>
          <div className="skeleton-details-text mb-2"></div>
          <div className="skeleton-details-text mb-4" style={{ width: '60%' }}></div>

          <hr />

          {/* Color Option Placeholder */}
          <div className="mb-3">
            <div className="skeleton-option-label mb-2"></div>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-color-pill"></div>
              ))}
            </div>
          </div>

          {/* Size Option Placeholder */}
          <div className="mb-4">
            <div className="skeleton-option-label mb-2"></div>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-size-circle"></div>
              ))}
            </div>
          </div>

          <hr />

          {/* Cart Controls Placeholder */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="skeleton-qty-selector"></div>
            <div className="skeleton-cart-btn flex-grow-1"></div>
            <div className="skeleton-wish-btn"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
