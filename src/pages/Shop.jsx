import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ShopLayout from '../components/shop/ShopLayout';
import { FilterProvider } from '../contexts/FilterContext';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <FilterProvider>
      <Header />
      <ShopLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Footer />
    </FilterProvider>
  );
};

export default Shop;
