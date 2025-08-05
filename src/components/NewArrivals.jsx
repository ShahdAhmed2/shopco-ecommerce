import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import './NewArrivals.css';

const API_URL = 'https://6888080aadf0e59551b8d6e4.mockapi.io/api/v1/products';

const fetchProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data.filter((p) => p.section === 'new-arrivals');
};

const NewArrivals = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(isMobile ? 2 : 4);
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchProducts,
  });

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
            displayed.map((product, index) => {
              const safeRating = Math.max(0, Math.min(5, Math.floor(product.rating || 4)));
              const discountPercent = product.discount
                ? `${product.discount}% OFF`
                : null;

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
                    src={product.image}
                    alt={product.name}
                    className="img-fluid mb-2"
                    style={{
                      width: '100%',
                      height: '260px',
                      objectFit: 'cover',
                      borderRadius: '8px',
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

        {showModal && selectedProduct && (
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{
              display: 'block',
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1050,
            }}
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedProduct.name}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="img-fluid mb-3"
                    style={{ borderRadius: '10px' }}
                  />
                  <p><strong>Price:</strong> ${selectedProduct.price}</p>
                  {selectedProduct.discount && (
                    <p>
                      <strong>Discount:</strong>{' '}
                      <span className="text-danger">{selectedProduct.discount}%</span>
                    </p>
                  )}
                  <p><strong>Rating:</strong> {selectedProduct.rating}/5</p>
                  
                  {/* Size Selection */}
                  <div className="mb-3">
                    <label className="form-label"><strong>Size:</strong></label>
                    <div className="btn-group" role="group">
                      {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                        <input
                          key={size}
                          type="radio"
                          className="btn-check"
                          name="size"
                          id={`size-${size}`}
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                        />
                      ))}
                      {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                        <label
                          key={size}
                          className={`btn btn-outline-dark ${selectedSize === size ? 'active' : ''}`}
                          htmlFor={`size-${size}`}
                        >
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="mb-3">
                    <label className="form-label"><strong>Color:</strong></label>
                    <div className="btn-group" role="group">
                      {['Black', 'White', 'Red', 'Blue'].map(color => (
                        <input
                          key={color}
                          type="radio"
                          className="btn-check"
                          name="color"
                          id={`color-${color}`}
                          checked={selectedColor === color}
                          onChange={() => setSelectedColor(color)}
                        />
                      ))}
                      {['Black', 'White', 'Red', 'Blue'].map(color => (
                        <label
                          key={color}
                          className={`btn btn-outline-dark ${selectedColor === color ? 'active' : ''}`}
                          htmlFor={`color-${color}`}
                        >
                          {color}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-dark w-100"
                    onClick={() => {
                      addToCart(selectedProduct, selectedSize, selectedColor);
                      toast.success(`${selectedProduct.name} added to cart!`);
                      closeModal();
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
