import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import ProductSection from '../components/product/ProductSection';
import BrowseByDressStyle from '../components/ui/BrowseByDressStyle';
import CustomerReviews from '../components/review/CustomerReviews';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ProductSection title="NEW ARRIVALS" section="new-arrivals" />
      <ProductSection title="TOP SELLING" section="top-selling" />
      <BrowseByDressStyle />
      <CustomerReviews />
      <Footer />
    </>
  );
};

export default Home;
