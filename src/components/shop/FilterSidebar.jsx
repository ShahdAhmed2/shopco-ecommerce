import React from 'react';
import { useFilters } from '../../contexts/FilterContext';
import './FilterSidebar.css';

/**
 * Color picker option component
 */
const ColorPicker = ({ selectedColor, onSelectColor }) => {
  const colors = [
    { name: 'Black', hex: '#000000', border: '1px solid #000' },
    { name: 'White', hex: '#ffffff', border: '1px solid #ccc' },
    { name: 'Red', hex: '#ff0000', border: 'none' },
    { name: 'Blue', hex: '#0000ff', border: 'none' },
    { name: 'Green', hex: '#008000', border: 'none' },
    { name: 'Yellow', hex: '#ffff00', border: 'none' },
    { name: 'Pink', hex: '#ffc0cb', border: 'none' },
  ];

  return (
    <div className="d-flex flex-wrap gap-2">
      {colors.map((c) => {
        const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
        return (
          <button
            key={c.name}
            type="button"
            className={`color-dot-btn position-relative rounded-circle ${isSelected ? 'active' : ''}`}
            style={{
              backgroundColor: c.hex,
              border: c.border,
              width: '28px',
              height: '28px',
            }}
            title={c.name}
            onClick={() => onSelectColor(isSelected ? '' : c.name)}
          >
            {isSelected && (
              <span
                className="position-absolute start-50 top-50 translate-middle"
                style={{
                  color: c.name === 'White' || c.name === 'Yellow' ? '#000' : '#fff',
                  fontSize: '12px',
                }}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Size selector options component
 */
const SizeSelector = ({ selectedSize, onSelectSize }) => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="d-flex flex-wrap gap-2">
      {sizes.map((s) => {
        const isSelected = selectedSize === s;
        return (
          <button
            key={s}
            type="button"
            className={`btn btn-sm ${isSelected ? 'btn-dark' : 'btn-outline-dark'} px-3 py-1 rounded-pill`}
            onClick={() => onSelectSize(isSelected ? '' : s)}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
};

/**
 * FilterSidebar component presenting all filter sections.
 */
const FilterSidebar = () => {
  const {
    category,
    setCategory,
    dressStyle,
    setDressStyle,
    color,
    setColor,
    size,
    setSize,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    rating,
    setRating,
    resetFilters,
  } = useFilters();

  const categories = ['T-Shirts', 'Jeans', 'Hoodies', 'Shirts', 'Shorts'];
  const dressStyles = ['Casual', 'Formal', 'Party', 'Gym'];

  return (
    <div className="filter-sidebar p-4 border rounded-3 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h5 className="fw-bold mb-0">Filters</h5>
        <button
          type="button"
          className="btn btn-link text-decoration-none text-muted p-0 small"
          onClick={resetFilters}
        >
          Reset All
        </button>
      </div>

      {/* Category Section */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-2">Category</h6>
        <div className="d-flex flex-column gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-link-btn text-start p-0 border-0 bg-transparent ${category === cat ? 'fw-bold text-dark' : 'text-muted'}`}
              onClick={() => setCategory(category === cat ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dress Style Section */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-2">Dress Style</h6>
        <div className="d-flex flex-column gap-2">
          {dressStyles.map((style) => (
            <button
              key={style}
              type="button"
              className={`filter-link-btn text-start p-0 border-0 bg-transparent ${dressStyle === style ? 'fw-bold text-dark' : 'text-muted'}`}
              onClick={() => setDressStyle(dressStyle === style ? '' : style)}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-3">Price Range</h6>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className="form-control"
              placeholder="Min"
              aria-label="Minimum price"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </div>
          <span className="text-muted">-</span>
          <div className="input-group input-group-sm">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className="form-control"
              placeholder="Max"
              aria-label="Maximum price"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-2">Colors</h6>
        <ColorPicker selectedColor={color} onSelectColor={setColor} />
      </div>

      {/* Sizes Section */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-2">Sizes</h6>
        <SizeSelector selectedSize={size} onSelectSize={setSize} />
      </div>

      {/* Ratings Section */}
      <div className="filter-section">
        <h6 className="fw-bold mb-2">Rating</h6>
        <div className="d-flex flex-column gap-2">
          {[5, 4, 3, 2, 1].map((r) => {
            const isSelected = rating === r;
            return (
              <button
                key={r}
                type="button"
                className={`filter-link-btn text-start p-0 border-0 bg-transparent ${isSelected ? 'fw-bold text-dark' : 'text-muted'}`}
                onClick={() => setRating(isSelected ? 0 : r)}
              >
                {'★'.repeat(r)}
                {'☆'.repeat(5 - r)}
                <span className="ms-1 small">{r === 5 ? '' : '& Up'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
