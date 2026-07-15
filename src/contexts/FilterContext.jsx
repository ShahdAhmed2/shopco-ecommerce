import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterContext = createContext();

/**
 * FilterProvider Component supplying context values.
 */
export const FilterProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDressStyle = searchParams.get('dressStyle') || '';

  const [category, setCategory] = useState('');
  const [dressStyle, setDressStyle] = useState(initialDressStyle);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('');

  useEffect(() => {
    const styleParam = searchParams.get('dressStyle') || '';
    if (styleParam !== dressStyle) {
      setDressStyle(styleParam);
    }
  }, [searchParams]);

  const setDressStyleAndParam = (newStyle) => {
    setDressStyle(newStyle);
    const newParams = new URLSearchParams(searchParams);
    if (newStyle) {
      newParams.set('dressStyle', newStyle);
    } else {
      newParams.delete('dressStyle');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setCategory('');
    setColor('');
    setSize('');
    setMinPrice(0);
    setMaxPrice(1000);
    setRating(0);
    setSort('');
    // Clear dress style and param
    setDressStyle('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('dressStyle');
    setSearchParams(newParams);
  };

  const value = {
    category,
    setCategory,
    dressStyle,
    setDressStyle: setDressStyleAndParam,
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
