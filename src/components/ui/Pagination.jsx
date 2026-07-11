import React from 'react';
import './Pagination.css';

/**
 * Reusable Pagination Component
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-based index)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Handler for page change events
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top pagination-container">
      {/* Previous Button */}
      <button
        className="btn btn-outline-dark btn-sm rounded-3 px-3 d-flex align-items-center gap-1 prev-next-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="bi bi-arrow-left"></i> Previous
      </button>

      {/* Page Numbers */}
      <div className="d-flex align-items-center gap-1 page-numbers-group">
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`btn btn-sm rounded-3 page-number-btn ${
              currentPage === page ? 'btn-dark' : 'btn-light text-dark'
            }`}
            style={{ width: '36px', height: '36px', padding: 0 }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className="btn btn-outline-dark btn-sm rounded-3 px-3 d-flex align-items-center gap-1 prev-next-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next <i className="bi bi-arrow-right"></i>
      </button>
    </nav>
  );
};

export default Pagination;
