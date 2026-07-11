import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../contexts/CartContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 'M', 'Black');
  };

  const isFewItems = wishlistItems.length > 0 && wishlistItems.length < 4;

  return (
    <>
      <Header />
      <div className="container py-4 wishlist-page-container">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-dark">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Wishlist
            </li>
          </ol>
        </nav>

        {/* Title Section */}
        <div className="wishlist-title-section">
          <h1 className="fw-bold mb-0 heading-integral">My Wishlist</h1>
          <p className="wishlist-subtitle">Your favorite products</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty-card text-center">
            <i className="bi bi-heart-fill wishlist-empty-heart"></i>
            <h4 className="wishlist-empty-title">Your Wishlist is Empty</h4>
            <p className="wishlist-empty-desc">Keep track of items you love by tapping the heart icon.</p>
            <Link to="/shop" className="btn btn-dark rounded-pill px-4 py-2 btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className={`wishlist-products-grid ${isFewItems ? 'few-items' : ''}`}>
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                style={{ maxWidth: '300px', width: '100%' }}
                onAddToCart={(e) => handleAddToCart(product, e)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
