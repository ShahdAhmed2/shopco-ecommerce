import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../contexts/AuthContext';


const Header = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync search input value when URL parameter changes
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <header>

      {showBanner && (
        <div className="top-banner text-white text-center py-2 position-relative">
          Sign up and get 20% off to your first order. <span className="fw-bold">Sign Up Now</span>
          <button 
            className="close-btn position-absolute end-0 top-50 translate-middle-y me-3"
            onClick={() => setShowBanner(false)}
            aria-label="Close promo banner"
          >
            ✕
          </button>
        </div>
      )}

      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3" aria-label="Main Navigation">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link className="navbar-brand fw-bold heading-integral" to="/" style={{ fontSize: '30px' }} aria-label="SHOP.CO Homepage">SHOP.CO</Link>

          {/* Toggler for mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto d-flex align-items-center gap-4">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/shop" end>
                  Shop
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/shop?sale=true">
                  On Sale
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/shop?section=new-arrivals">
                  New Arrivals
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/shop?brands=true">
                  Brands
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/admin">
                  Dashboard
                </NavLink>
              </li>
            </ul>

            {/* Search & Icons */}
            <div className="d-flex align-items-center gap-3 ms-auto flex-wrap" style={{ maxWidth: '500px' }}>
              <div className="position-relative" style={{ width: '320px' }}>
                <button
                  type="button"
                  className="position-absolute border-0 bg-transparent"
                  style={{
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888',
                    fontSize: '16px',
                    padding: 0,
                    zIndex: 5
                  }}
                  onClick={handleSearchSubmit}
                  aria-label="Search"
                >
                  <i className="bi bi-search"></i>
                </button>
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 py-2"
                  placeholder="Search for products..."
                  aria-label="Search for products"
                  style={{
                    fontSize: '14px',
                    background: 'rgba(240, 240, 240, 1)',
                    border: '1px solid #eee',
                  }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Link 
                to="/wishlist" 
                className="position-relative text-decoration-none me-1"
                aria-label={`View wishlist, ${wishlistItems.length} items`}
              >
                <i className="bi bi-heart fs-5 text-dark" aria-hidden="true"></i>
                {wishlistItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link 
                to="/cart" 
                className="position-relative text-decoration-none"
                aria-label={`View shopping cart, ${getCartCount()} items`}
              >
                <i className="bi bi-cart fs-5 text-dark" aria-hidden="true"></i>
                {getCartCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn btn-link p-0 text-dark border-0 dropdown-toggle no-caret"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label={`Account profile, logged in as ${user?.name}`}
                  >
                    <i className="bi bi-person fs-5" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="profileDropdown">
                    <li className="dropdown-header text-dark fw-bold border-bottom pb-2 mb-1">
                      Hi, {user?.name}
                    </li>
                    {user?.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item py-2 fw-medium" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        className="dropdown-item py-2 fw-medium text-danger"
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-dark p-0"
                  aria-label="Sign in"
                >
                  <i className="bi bi-person fs-5" aria-hidden="true"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
