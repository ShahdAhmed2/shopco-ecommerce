import React from 'react';
import './Pagination.css';

/**
 * Reusable Pagination Component with ellipsis
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = React.useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

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
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted">
                ...
              </span>
            );
          }
          return (
            <button
              key={`page-${page}`}
              className={`btn btn-sm rounded-3 page-number-btn ${
                currentPage === page ? 'btn-dark' : 'btn-light text-dark'
              }`}
              style={{ width: '36px', height: '36px', padding: 0 }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
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

export default React.memo(Pagination);
