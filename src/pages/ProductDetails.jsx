import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RelatedProducts from '../components/product/RelatedProducts';
import WishlistButton from '../components/ui/WishlistButton';
import ProductDetailsSkeleton from '../components/ui/ProductDetailsSkeleton';
import './ProductDetails.css';

/**
 * ProductDetails Page Component.
 */
const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data: product, isLoading, isError, error } = useProduct(id);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  const handleAddToCart = () => {
    if (!product) return;
    // Add item multiple times depending on quantity selection
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    toast.success(`${product.name} (Qty: ${quantity}) added to cart!`);
  };

  const safeRating = product ? Math.max(0, Math.min(5, Math.floor(product.rating || 0))) : 0;
  const discountPercent = product?.discount ? `${product.discount}% OFF` : null;
  const itemPrice = product?.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product?.price;

  if (isLoading) {
    return (
      <>
        <Header />
        <ProductDetailsSkeleton />
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center product-details-page d-flex align-items-center justify-content-center">
          <div className="text-danger py-5">
            <i className="bi bi-exclamation-triangle fs-1 mb-2 d-block"></i>
            <h4 className="fw-bold">Failed to load product</h4>
            <p className="text-muted small">{error?.message || 'An unknown error occurred.'}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center product-details-page d-flex align-items-center justify-content-center">
          <div className="text-muted py-5">
            <i className="bi bi-search fs-1 mb-2 d-block"></i>
            <h4 className="fw-bold">Product Not Found</h4>
            <p className="small">The requested product could not be found or does not exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-4 product-details-page">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-dark">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop" className="text-decoration-none text-dark">Shop</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Details Grid */}
        <div className="row g-5">
          {/* Left Column: Image display */}
          <div className="col-12 col-md-6">
            <div className="product-image-container border rounded-3 p-3 bg-white text-center">
              <img
                src={product.image || 'https://via.placeholder.com/500x400.png'}
                alt={product.name}
                className="img-fluid rounded animate-entry"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x400.png';
                }}
              />
            </div>
          </div>

          {/* Right Column: Information & Controls */}
          <div className="col-12 col-md-6">
            <h1 className="fw-bold mb-2">{product.name}</h1>
            <div className="text-warning mb-3 fs-5">
              {'★'.repeat(safeRating)}
              {'☆'.repeat(5 - safeRating)}
              <span className="text-dark small ms-2">
                {product.rating ? `${product.rating}/5` : ''}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              {product.discount ? (
                <>
                  <span className="fw-bold fs-3 text-dark">${itemPrice}</span>
                  <span className="text-decoration-line-through text-muted fs-5">${product.price}</span>
                  <span className="badge bg-danger-subtle text-danger px-2.5 py-1 rounded">
                    {discountPercent}
                  </span>
                </>
              ) : (
                <span className="fw-bold fs-3">${product.price}</span>
              )}
            </div>
            
            <p className="text-muted mb-4">
              {product.description || "Step up your style game with this premium apparel. Carefully designed with comfort and durability in mind, it transitions effortlessly from day to night, making it a versatile staple in your wardrobe."}
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

            {/* Quantity Selector & Add to Cart */}
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
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <WishlistButton product={product} className="wishlist-detail-btn" />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-4 text-center text-lg-start heading-integral">You Might Also Like</h4>
          <RelatedProducts currentProductId={product.id} section={product.section} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
