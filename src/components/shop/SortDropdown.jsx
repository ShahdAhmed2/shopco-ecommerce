import React from 'react';
import { useFilters } from '../../contexts/FilterContext';
import './SortDropdown.css';

/**
 * SortDropdown Component.
 */
const SortDropdown = () => {
  const { sort, setSort } = useFilters();

  const options = [
    { value: '', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Highest Rated' },
  ];

  return (
    <div className="sort-dropdown-container d-flex align-items-center gap-2">
      <span className="text-muted small text-nowrap">Sort by:</span>
      <select
        className="form-select form-select-sm rounded-pill sort-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{ width: '180px', cursor: 'pointer' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
