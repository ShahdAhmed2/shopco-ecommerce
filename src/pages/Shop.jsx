import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ShopLayout from '../components/shop/ShopLayout';
import { FilterProvider } from '../contexts/FilterContext';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const handleSearchChange = (newVal) => {
    const trimmed = newVal.trim();
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  return (
    <FilterProvider>
      <Header />
      <ShopLayout searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
      <Footer />
    </FilterProvider>
  );
};

export default Shop;
