import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import './ShopGrid.css';

/**
 * ShopGrid Component rendering dynamically fetched products.
 */
const ShopGrid = () => {
  const { addToCart } = useCart();
  const { data: products = [], isLoading, isError, error } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="shop-grid d-flex align-items-center justify-content-center border rounded-3 bg-white">
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="shop-grid d-flex align-items-center justify-content-center border rounded-3 bg-white">
        <div className="text-center py-5 text-danger">
          <i className="bi bi-exclamation-triangle fs-1 mb-2 d-block"></i>
          <h5 className="fw-bold">Failed to load products</h5>
          <p className="text-muted small mb-0">{error?.message || 'An unknown network error occurred.'}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="shop-grid d-flex align-items-center justify-content-center border rounded-3 bg-white">
        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox fs-1 mb-2 d-block"></i>
          <h5 className="fw-bold">No products found</h5>
          <p className="small mb-0">Check back later or try adjusting filters once enabled!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-grid p-4 border rounded-3 bg-white">
      <h5 className="fw-bold mb-4">All Products</h5>
      
      {/* Product Cards Layout Grid */}
      <div className="shop-products-layout">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => openModal(product)}
            onAddToCart={(e) => handleAddToCart(product, e)}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={closeModal}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        onAddToCart={() => {
          addToCart(selectedProduct, selectedSize, selectedColor);
          toast.success(`${selectedProduct.name} added to cart!`);
          closeModal();
        }}
      />
    </div>
  );
};

export default ShopGrid;
