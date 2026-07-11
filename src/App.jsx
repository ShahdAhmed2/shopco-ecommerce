import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './components/AdminDashboard';
import CartPage from './components/CartPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cart" element={
          <>
            <Header />
            <CartPage />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
