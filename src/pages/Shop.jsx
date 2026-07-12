import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ShopLayout from '../components/shop/ShopLayout';
import { FilterProvider } from '../contexts/FilterContext';
import SEO from '../components/common/SEO';

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

  const displayTitle = searchQuery
    ? `Shop - "${searchQuery}" | SHOP.CO`
    : 'Shop | SHOP.CO';

  return (
    <FilterProvider>
      <SEO 
        title={displayTitle} 
        description="Explore our collection of premium apparel. Filter by color, size, price, and category." 
      />
      <Header />
      <ShopLayout searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
      <Footer />
    </FilterProvider>
  );
};

export default Shop;
