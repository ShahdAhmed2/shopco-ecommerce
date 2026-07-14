import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { reviewService } from '../services/reviewService';
import { toast } from 'react-toastify';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RelatedProducts from '../components/product/RelatedProducts';
import WishlistButton from '../components/ui/WishlistButton';
import ProductDetailsSkeleton from '../components/ui/ProductDetailsSkeleton';
import SEO from '../components/common/SEO';
import './ProductDetails.css';

/**
 * ProductDetails Page Component.
 */
const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data: product, isLoading, isError, error } = useProduct(id);

  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      setReviewsLoading(true);
      const data = await reviewService.getProductReviews(id);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Pre-fill form if current user already submitted a review
  useEffect(() => {
    if (isAuthenticated && user && reviews.length > 0) {
      const myReview = reviews.find(
        (r) => r.user?._id === user.id || r.user === user.id
      );
      if (myReview) {
        setRatingInput(myReview.rating);
        setCommentInput(myReview.comment);
      } else {
        setRatingInput(5);
        setCommentInput('');
      }
    } else {
      setRatingInput(5);
      setCommentInput('');
    }
  }, [reviews, user, isAuthenticated]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmittingReview(true);
      await reviewService.createOrUpdateReview(id, {
        rating: ratingInput,
        comment: commentInput,
      });
      toast.success('Review submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!id || !window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(id, reviewId);
      toast.success('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete review');
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  const handleAddToCart = React.useCallback(() => {
    if (!product) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  }, [product, quantity, selectedSize, selectedColor, addToCart]);

  const handleDecreaseQuantity = React.useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const handleIncreaseQuantity = React.useCallback(() => {
    setQuantity((q) => q + 1);
  }, []);

  const handleColorSelect = React.useCallback((c) => {
    setSelectedColor(c);
  }, []);

  const handleSizeSelect = React.useCallback((s) => {
    setSelectedSize(s);
  }, []);

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
      <SEO
        title={`${product.name} | SHOP.CO`}
        description={product.description || "Step up your style game with this premium apparel. Carefully designed with comfort and durability in mind."}
        image={product.image}
        type="product"
      />
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
                {product.rating ? `${Number(product.rating).toFixed(1)}/5` : '0/5'}
                <span className="text-muted ms-1">({product.numReviews || 0} reviews)</span>
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
                    onClick={() => handleColorSelect(c)}
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
                    onClick={() => handleSizeSelect(s)}
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
                  onClick={handleDecreaseQuantity}
                >
                  -
                </button>
                <span className="align-self-center px-3 fw-semibold">{quantity}</span>
                <button
                  type="button"
                  className="btn btn-light px-3"
                  onClick={handleIncreaseQuantity}
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

        {/* Reviews Section */}
        <div className="mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-4 heading-integral">Customer Reviews ({reviews.length})</h4>
          
          <div className="row g-4">
            {/* Reviews List */}
            <div className="col-12 col-lg-7">
              {reviewsLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading reviews...</span>
                  </div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-5 text-muted bg-light rounded-3">
                  <i className="bi bi-chat-left-text fs-1 mb-2 d-block"></i>
                  <p className="mb-0">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => {
                    const reviewerId = rev.user?._id || rev.user;
                    const canDelete = isAuthenticated && (user?.id === reviewerId || user?.role === 'admin');
                    
                    return (
                      <div key={rev._id} className="card p-3 border border-light-subtle rounded-3 shadow-sm">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-bold mb-1">{rev.name}</h6>
                            <div className="text-warning mb-2 small">
                              {'★'.repeat(rev.rating)}
                              {'☆'.repeat(5 - rev.rating)}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-muted small">
                              {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {canDelete && (
                              <button
                                className="btn btn-outline-danger btn-sm border-0"
                                onClick={() => handleDeleteReview(rev._id)}
                                aria-label="Delete review"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mb-0 text-muted small mt-1">{rev.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="col-12 col-lg-5">
              <div className="card p-4 border rounded-3 bg-light">
                <h5 className="fw-bold mb-3">
                  {reviews.some(r => r.user?._id === user?.id || r.user === user?.id)
                    ? 'Update Your Review'
                    : 'Write a Customer Review'}
                </h5>
                
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Rating</label>
                      <div className="d-flex gap-2 fs-4 text-warning">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setRatingInput(star)}
                          >
                            {star <= ratingInput ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="review-comment" className="form-label fw-semibold small">Comment</label>
                      <textarea
                        id="review-comment"
                        className="form-control"
                        rows="4"
                        placeholder="Share your experience with this product..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-dark w-100 rounded-pill py-2.5 fw-bold"
                      disabled={submittingReview}
                    >
                      {submittingReview ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted small">You must be logged in to leave a review.</p>
                    <Link to="/login" className="btn btn-outline-dark rounded-pill px-4 btn-sm">
                      Log In to Review
                    </Link>
                  </div>
                )}
              </div>
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
