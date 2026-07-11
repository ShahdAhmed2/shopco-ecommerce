import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Shop = () => {
  return (
    <>
      <Header />
      <div className="container py-5 text-center" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="fw-bold mb-3">Shop Page Coming Soon</h1>
        <p className="text-muted">We are working on bringing you our full clothing collections!</p>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
