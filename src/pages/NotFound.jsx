import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './NotFound.css';

/**
 * Reusable Custom 404 (Not Found) Page component.
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <>
      <Header />
      <main className="container d-flex flex-column align-items-center justify-content-center not-found-container text-center py-5">
        <div className="not-found-card p-5 bg-white border rounded-3">
          {/* Exclamation Icon */}
          <div className="not-found-icon-wrapper mb-4">
            <i className="bi bi-exclamation-octagon-fill text-dark not-found-icon"></i>
          </div>

          {/* Heading */}
          <h1 className="fw-bold not-found-code mb-2">404</h1>
          <h2 className="fw-bold text-dark not-found-title mb-3">Page Not Found</h2>

          {/* Helper Message */}
          <p className="text-muted not-found-message mb-4 mx-auto" style={{ maxWidth: '450px' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Actions */}
          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
            <Link to="/" className="btn btn-dark rounded-pill px-4 py-2 fw-semibold not-found-btn">
              Back Home
            </Link>
            <a 
              href="#"
              onClick={handleGoBack}
              className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold not-found-btn"
            >
              Go Back
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
