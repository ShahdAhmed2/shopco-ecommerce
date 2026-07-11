import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import ProductModal from './product/ProductModal';
import ProductCard from './product/ProductCard';
import './NewArrivals.css';

const NewArrivals = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(isMobile ? 2 : 4);
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useProducts('new-arrivals');

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);
      setItemsToShow(nowMobile ? 2 : 4);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const displayed = showAll ? products : products.slice(0, itemsToShow);

  return (
    <section className="py-5 bg-white">
      <div
        className="container"
        style={{ borderBottom: '1px solid #0000001A', paddingBottom: '40px' }}
      >
        <h2 className="fw-bold text-center heading-integral mb-4 happy-heading">NEW ARRIVALS</h2>

        <div
          className={`d-flex gap-3 ${
            isMobile ? 'overflow-auto flex-nowrap px-2' : 'flex-wrap justify-content-center'
          }`}
          style={isMobile ? { scrollSnapType: 'x mandatory' } : {}}
        >
          {isLoading ? (
            <div className="text-center w-100">Loading...</div>
          ) : displayed.length === 0 ? (
            <div className="text-center w-100">No products found.</div>
          ) : (
            displayed.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openModal(product)}
                style={{
                  flex: isMobile ? '0 0 auto' : '0 0 auto',
                  scrollSnapAlign: isMobile ? 'start' : 'unset',
                  animationDelay: `${index * 0.1}s`,
                }}
                onAddToCart={(e) => handleAddToCart(product, e)}
              />
            ))
          )}
        </div>

        {products.length > itemsToShow && (
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-dark rounded-pill custom-btn-mobile"
              style={{ padding: '10px 50px' , borderColor: '#bdc0c2ff'}}
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>
        )}

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
    </section>
  );
};

export default NewArrivals;
