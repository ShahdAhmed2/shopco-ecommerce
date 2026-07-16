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

  const renderSearchInput = (idSuffix) => (
    <div className="position-relative w-100">
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
        aria-label="Submit search query"
      >
        <i className="bi bi-search"></i>
      </button>
      <input
        type="text"
        id={`search-input-${idSuffix}`}
        className="form-control rounded-pill ps-5 py-2 w-100"
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
  );

  const renderIconsBlock = (idSuffix) => (
    <div className="d-flex align-items-center gap-3">
      <Link
        to="/wishlist"
        className="position-relative text-decoration-none"
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
            id={`profileDropdown-${idSuffix}`}
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label={`Account profile, logged in as ${user?.name}`}
          >
            <i className="bi bi-person fs-5" aria-hidden="true"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby={`profileDropdown-${idSuffix}`}>
            <li className="dropdown-header text-dark fw-bold border-bottom pb-2 mb-1">
              Hi, {user?.name}
            </li>
            <li>
              <Link className="dropdown-item py-2 fw-medium" to="/my-orders">
                <i className="bi bi-bag-check me-2"></i> My Orders
              </Link>
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
  );

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
        <div className="container d-flex flex-wrap align-items-center justify-content-between">
          
          {/* Mobile Top Bar: Logo, Toggler, Icons */}
          <div className="d-flex align-items-center justify-content-between w-100 d-lg-none mb-2 mb-lg-0">
            <div className="d-flex align-items-center">
              {/* Toggler for mobile */}
              <button
                className="navbar-toggler border-0 p-0 me-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                <span className="navbar-toggler-icon" style={{ width: '22px', height: '22px' }}></span>
              </button>

              {/* Logo */}
              <Link className="navbar-brand fw-bold heading-integral mb-0" to="/" style={{ fontSize: '26px' }} aria-label="SHOP.CO Homepage">SHOP.CO</Link>
            </div>

            {/* Icons Block for Mobile */}
            <div className="d-flex align-items-center">
              {renderIconsBlock('mobile')}
            </div>
          </div>

          {/* Desktop Logo (hidden on mobile) */}
          <Link className="navbar-brand fw-bold heading-integral mb-0 d-none d-lg-block" to="/" style={{ fontSize: '30px' }} aria-label="SHOP.CO Homepage">SHOP.CO</Link>

          {/* Collapsible Navbar Links & Mobile Search */}
          <div className="collapse navbar-collapse navbar-collapse-mobile-w-100" id="navbarNav">
            <style>{`
              @media (max-width: 991px) {
                .navbar-collapse-mobile-w-100 {
                  width: 100% !important;
                }
              }
            `}</style>
            <ul className="navbar-nav mx-auto d-flex align-items-start align-items-lg-center gap-3 gap-lg-4 mt-3 mt-lg-0">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle fw-medium" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Shop
                </a>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=T-Shirts')}>T-Shirts</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=Shirts')}>Shirts</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=Jeans')}>Jeans</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=Hoodies')}>Hoodies</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=Formal Wear')}>Formal Wear</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=Party Wear')}>Party Wear</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?category=Activewear')}>Activewear</button></li>
                </ul>
              </li>
              {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle fw-medium" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Brands
                </a>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=UrbanX')}>UrbanX</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=StreetCore')}>StreetCore</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=NovaWear')}>NovaWear</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=PrimeWear')}>PrimeWear</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=Aura')}>Aura</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=MotionFit')}>MotionFit</button></li>
                  <li><button className="dropdown-item py-2 fw-medium" onClick={() => navigate('/shop?brand=EliteWear')}>EliteWear</button></li>
                </ul>
              </li> */}
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/shop?section=new-arrivals">
                  New Arrivals
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/shop?section=top-selling">
                  Top Selling
                </NavLink>
              </li>
              {user && user.role === 'admin' && (
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`} to="/admin">
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
            {/* Search Bar for Mobile view inside collapse */}
            <div className="d-block d-lg-none mt-3 w-100">
              {renderSearchInput('mobile')}
            </div>
          </div>

          {/* Search Bar for Desktop view (hidden on mobile) */}
          <div className="d-none d-lg-block mx-4 flex-grow-1" style={{ maxWidth: '350px' }}>
            {renderSearchInput('desktop')}
          </div>

          {/* Header Icons Block for Desktop (hidden on mobile) */}
          <div className="d-none d-lg-block">
            {renderIconsBlock('desktop')}
          </div>

        </div>
      </nav>
    </header>
  );
};

export default Header;
