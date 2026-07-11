import React from 'react';
import './ShopGrid.css';

/**
 * ShopGrid component placeholder
 */
const ShopGrid = () => {
  return (
    <div className="shop-grid p-3 border rounded-3 bg-white">
      <h5 className="fw-bold mb-3">Products</h5>
      <div className="placeholder-content py-5 text-center text-muted border border-dashed rounded-3">
        <i className="bi bi-grid-3x3-gap fs-3 mb-2 d-block"></i>
        <span>Product Grid Placeholder</span>
      </div>
    </div>
  );
};

export default ShopGrid;
