import React from 'react';
import './ErrorBoundary.css';

/**
 * Presentational Fallback UI for rendering errors.
 * @param {Object} props
 * @param {Error} props.error - The caught error object
 */
const ErrorFallback = ({ error }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <main className="container d-flex flex-column align-items-center justify-content-center error-fallback-container text-center py-5">
      <div className="error-fallback-card p-5 bg-white border rounded-3">
        {/* Error Octagon Icon */}
        <div className="error-fallback-icon-wrapper mb-4">
          <i className="bi bi-exclamation-triangle-fill text-danger error-fallback-icon"></i>
        </div>

        {/* Headings */}
        <h1 className="fw-bold text-dark mb-2">Something went wrong</h1>
        <h2 className="fs-5 text-muted mb-4">An unexpected rendering error occurred</h2>

        {/* Technical details (collapsible or small) */}
        {error && (
          <div className="text-start mb-4 p-3 bg-light rounded text-muted error-details-box">
            <p className="mb-1 fw-semibold small text-dark">Technical Details:</p>
            <code className="small text-danger d-block text-break">{error.toString()}</code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
          <button 
            onClick={handleReload}
            className="btn btn-dark rounded-pill px-4 py-2 fw-semibold error-btn"
            aria-label="Reload current page"
          >
            Reload Page
          </button>
          <a 
            href="/" 
            className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold error-btn"
            aria-label="Navigate to homepage"
          >
            Back Home
          </a>
        </div>
      </div>
    </main>
  );
};

export default ErrorFallback;
