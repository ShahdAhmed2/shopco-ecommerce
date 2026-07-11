import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './ProductDetails.css';

/**
 * ProductDetails Page Component.
 */
const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  return (
    <>
      <Header />
      <div className="container py-4 product-details-page">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none text-dark">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/shop" className="text-decoration-none text-dark">Shop</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Product Details
            </li>
          </ol>
        </nav>

        {/* Details grid layout */}
        <div className="row g-5">
          {/* Image gallery */}
          <div className="col-12 col-md-6">
            <div className="image-gallery-placeholder border rounded-3 p-4 bg-light text-center py-5 text-muted">
              <i className="bi bi-image fs-1 mb-2 d-block"></i>
              <span>Product Image Gallery Placeholder</span>
            </div>
          </div>

          {/* Info and selectors */}
          <div className="col-12 col-md-6">
            <h1 className="fw-bold mb-2">Product Title Placeholder</h1>
            <p className="text-warning fs-5 mb-3">
              ★★★★★ <span className="text-dark small ms-1">(5.0/5)</span>
            </p>
            <h3 className="fw-bold mb-3">$99.99</h3>
            
            <p className="text-muted mb-4">
              This is a placeholder description of the product. Once live product data is connected, 
              this paragraph will be populated with the actual specifications, material information, 
              and fitting instructions of the item.
            </p>
            
            <hr />

            {/* Colors */}
            <div className="mb-3">
              <span className="fw-semibold d-block mb-2">Select Color</span>
              <div className="d-flex gap-2">
                {['Black', 'White', 'Red', 'Blue'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`btn btn-sm ${selectedColor === c ? 'btn-dark' : 'btn-outline-dark'} rounded-pill px-3`}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <span className="fw-semibold d-block mb-2">Choose Size</span>
              <div className="d-flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn btn-sm ${selectedSize === s ? 'btn-dark' : 'btn-outline-dark'} rounded-circle`}
                    style={{ width: '36px', height: '36px', padding: 0 }}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <hr />

            {/* Quantity & Add to Cart */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="btn-group border rounded-pill overflow-hidden">
                <button
                  type="button"
                  className="btn btn-light px-3"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="align-self-center px-3 fw-semibold">{quantity}</span>
                <button
                  type="button"
                  className="btn btn-light px-3"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn btn-dark rounded-pill px-5 py-2 fw-bold flex-grow-1"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related section */}
        <div className="mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-4">You Might Also Like</h4>
          <div className="related-products-placeholder border border-dashed rounded-3 p-5 text-center text-muted bg-light">
            <i className="bi bi-collection fs-1 mb-2 d-block"></i>
            <span>Related Products Catalog Grid Placeholder</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
