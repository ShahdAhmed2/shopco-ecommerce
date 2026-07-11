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
      <i 
        className="bi bi-search position-absolute search-icon"
        style={{ cursor: 'pointer' }}
        onClick={handleSubmit}
      ></i>
      <input
        type="text"
        className="form-control rounded-pill ps-5 py-2"
        placeholder="Search products in shop..."
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;
