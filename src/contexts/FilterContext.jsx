import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

/**
 * FilterProvider Component supplying context values.
 */
export const FilterProvider = ({ children }) => {
  const [category, setCategory] = useState('');
  const [dressStyle, setDressStyle] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('');

  const resetFilters = () => {
    setCategory('');
    setDressStyle('');
    setColor('');
    setSize('');
    setMinPrice(0);
    setMaxPrice(1000);
    setRating(0);
    setSort('');
  };

  const value = {
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
    sort,
    setSort,
    resetFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
