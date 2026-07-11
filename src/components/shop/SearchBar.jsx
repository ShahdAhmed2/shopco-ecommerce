import React from 'react';
import './SearchBar.css';

/**
 * Reusable SearchBar Component for the Shop Page.
 * @param {Object} props
 * @param {string} props.value - Active search text value
 * @param {Function} props.onChange - Value change callback trigger
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="shop-search-bar mb-4 position-relative">
      <i className="bi bi-search position-absolute search-icon"></i>
      <input
        type="text"
        className="form-control rounded-pill ps-5 py-2"
        placeholder="Search products in shop..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
