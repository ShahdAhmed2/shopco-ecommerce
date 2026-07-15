import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterContext = createContext();

/**
 * FilterProvider Component supplying context values.
 */
export const FilterProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialDressStyle = searchParams.get('dressStyle') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSection = searchParams.get('section') || '';

  const [category, setCategory] = useState(initialCategory);
  const [dressStyle, setDressStyle] = useState(initialDressStyle);
  const [brand, setBrand] = useState(initialBrand);
  const [section, setSection] = useState(initialSection);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('');

  useEffect(() => {
    const catParam = searchParams.get('category') || '';
    if (catParam !== category) {
      setCategory(catParam);
    }
    const styleParam = searchParams.get('dressStyle') || '';
    if (styleParam !== dressStyle) {
      setDressStyle(styleParam);
    }
    const brandParam = searchParams.get('brand') || '';
    if (brandParam !== brand) {
      setBrand(brandParam);
    }
    const sectionParam = searchParams.get('section') || '';
    if (sectionParam !== section) {
      setSection(sectionParam);
    }
  }, [searchParams]);

  const setCategoryAndParam = (newCat) => {
    setCategory(newCat);
    const newParams = new URLSearchParams(searchParams);
    if (newCat) {
      newParams.set('category', newCat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

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

  const setBrandAndParam = (newBrand) => {
    setBrand(newBrand);
    const newParams = new URLSearchParams(searchParams);
    if (newBrand) {
      newParams.set('brand', newBrand);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams);
  };

  const setSectionAndParam = (newSection) => {
    setSection(newSection);
    const newParams = new URLSearchParams(searchParams);
    if (newSection) {
      newParams.set('section', newSection);
    } else {
      newParams.delete('section');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setCategory('');
    setDressStyle('');
    setBrand('');
    setSection('');
    setColor('');
    setSize('');
    setMinPrice(0);
    setMaxPrice(1000);
    setRating(0);
    setSort('');

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('dressStyle');
    newParams.delete('brand');
    newParams.delete('section');
    setSearchParams(newParams);
  };

  const value = {
    category,
    setCategory: setCategoryAndParam,
    dressStyle,
    setDressStyle: setDressStyleAndParam,
    brand,
    setBrand: setBrandAndParam,
    section,
    setSection: setSectionAndParam,
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
