import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import ProductSection from '../components/product/ProductSection';
import BrowseByDressStyle from '../components/ui/BrowseByDressStyle';
import CustomerReviews from '../components/review/CustomerReviews';
import Footer from '../components/layout/Footer';
import SEO from '../components/common/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="SHOP.CO | Premium Fashion Store" 
        description="Discover premium fashion, new arrivals, top selling products and exclusive collections." 
      />
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
