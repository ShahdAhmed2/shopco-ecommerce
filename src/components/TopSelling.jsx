import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import ProductModal from './product/ProductModal';
import './TopSelling.css';

const TopSelling = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(isMobile ? 2 : 4);
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useProducts('top-selling');

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
      <div className="container" style={{ borderBottom: '1px solid #0000001A', paddingBottom: '40px' }}>
        <h2 className="fw-bold text-center heading-integral mb-4 happy-heading">TOP SELLING</h2>

        <div
          className={`d-flex gap-3 ${isMobile ? 'overflow-auto flex-nowrap px-2' : 'flex-wrap justify-content-center'}`}
          style={isMobile ? { scrollSnapType: 'x mandatory' } : {}}
        >
          {isLoading ? (
            <div className="text-center w-100">Loading...</div>
          ) : displayed.length === 0 ? (
            <div className="text-center w-100">No products found.</div>
          ) : (
            displayed.map((product, index) => {
              const safeRating = Math.max(0, Math.min(5, Math.floor(product.rating || 0)));
              const discountPercent = product.discount ? `${product.discount}% OFF` : null;

              return (
                <div
                  key={product.id}
                  className="card product-card border-0 text-center bg-white flex-shrink-0 animate-entry"
                  style={{
                    width: '300px',
                    flex: isMobile ? '0 0 auto' : '0 0 auto',
                    scrollSnapAlign: isMobile ? 'start' : 'unset',
                    animationDelay: `${index * 0.1}s`,
                    cursor: 'pointer',
                  }}
                  onClick={() => openModal(product)}
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/300x260.png'}
                    alt={product.name}
                    className="img-fluid mb-2"
                    style={{
                      width: '100%',
                      height: '260px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x260.png';
                    }}
                  />
                  <div className="card-body p-2">
                    <div className="text-warning mb-1" style={{ fontSize: '0.9rem' }}>
                      {'★'.repeat(safeRating)}
                      {'☆'.repeat(5 - safeRating)}
                      <span className="ms-1 text-dark small">
                        {product.rating ? `${product.rating}/5` : ''}
                      </span>
                    </div>
                    <div className="fw-semibold mb-1" style={{ fontSize: '1rem' }}>
                      {product.name}
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold me-2">${product.price}</span>
                      {discountPercent && (
                        <span className="text-danger small bg-light px-2 py-1 rounded">
                          {discountPercent}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-dark btn-sm w-100"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
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

export default TopSelling;
