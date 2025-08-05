import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { getCartCount } = useCart();

  return (
    <header>
     
      {showBanner && (
        <div className="top-banner text-white text-center py-2 position-relative">
          Sign up and get 20% off to your first order. <span className="fw-bold">Sign Up Now</span>
        
          <button 
            className="close-btn position-absolute end-0 top-50 translate-middle-y me-3"
            onClick={() => setShowBanner(false)}
          >
            ✕
          </button>
        </div>
      )}

      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link className="navbar-brand fw-bold heading-integral" to="/" style={{ fontSize: '30px' }}>SHOP.CO</Link>

          {/* Toggler for mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto d-flex align-items-center gap-4">
              {/* Shop Dropdown */}
              <li className="nav-item dropdown custom-dropdown">
                <a
                  className="nav-link dropdown-toggle fw-medium"
                  href="#"
                  id="shopDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Shop
                </a>
                <ul className="dropdown-menu custom-menu" aria-labelledby="shopDropdown">
                  <li><a className="dropdown-item text-white" href="#">Versace</a></li>
                  <li><a className="dropdown-item text-white" href="#">Zara</a></li>
                  <li><a className="dropdown-item text-white" href="#">Gucci</a></li>
                  <li><a className="dropdown-item text-white" href="#">Prada</a></li>
                  <li><a className="dropdown-item text-white" href="#">Calvin Klein</a></li>
                </ul>
              </li>
              {/* Other nav links */}
              <li className="nav-item"><a className="nav-link fw-medium" href="#">On Sale</a></li>
              <li className="nav-item"><a className="nav-link fw-medium" href="#">New Arrivals</a></li>
              <li className="nav-item"><a className="nav-link fw-medium" href="#">Brands</a></li>
              <li className="nav-item"><Link className="nav-link fw-medium" to="/admin">Dashboard</Link></li>
            </ul>

            {/* Search & Icons */}
            <div className="d-flex align-items-center gap-3 ms-auto flex-wrap" style={{ maxWidth: '500px' }}>
              <div className="position-relative" style={{ width: '320px' }}>
                <i
                  className="bi bi-search position-absolute"
                  style={{
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888',
                    fontSize: '16px',
                  }}
                ></i>
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 py-2"
                  placeholder="Search for products..."
                  style={{
                    fontSize: '14px',
                    background: 'rgba(240, 240, 240, 1)',
                    border: '1px solid #eee',
                  }}
                />
              </div>
              <Link to="/cart" className="position-relative text-decoration-none">
                <i className="bi bi-cart fs-5 text-dark"></i>
                {getCartCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <i className="bi bi-person fs-5 text-dark"></i>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
