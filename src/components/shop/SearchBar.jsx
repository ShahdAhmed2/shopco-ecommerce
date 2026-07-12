import React, { useState, useEffect } from 'react';
import './SearchBar.css';

/**
 * Reusable SearchBar Component for the Shop Page.
 * @param {Object} props
 * @param {string} props.value - Active search text value
 * @param {Function} props.onChange - Value change callback trigger
 */
const SearchBar = ({ value, onChange }) => {
  const [localVal, setLocalVal] = useState(value);

  // Sync internal input value with external prop changes (e.g. from URL search param)
  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const handleSubmit = () => {
    onChange(localVal);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="shop-search-bar mb-4 position-relative">
      <button
        type="button"
        className="position-absolute border-0 bg-transparent search-icon-btn"
        style={{
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          padding: 0,
          zIndex: 5
        }}
        onClick={handleSubmit}
        aria-label="Submit search"
      >
        <i className="bi bi-search" style={{ cursor: 'pointer' }}></i>
      </button>
      <input
        type="text"
        className="form-control rounded-pill ps-5 py-2"
        placeholder="Search products in shop..."
        aria-label="Search products in shop"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;
