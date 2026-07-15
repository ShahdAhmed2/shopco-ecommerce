import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import HomeProductCard from './HomeProductCard';
import ProductModal from './ProductModal';
import ProductCardSkeleton from '../ui/ProductCardSkeleton';
import './ProductSection.css';

/**
 * Premium Draggable Horizontal Product Slider Component
 */
const ProductSection = ({
  title,
  section,
  showViewAll = true,
  initialItems,
  className = '',
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts(section);

  const sliderRef = useRef(null);
  const wrapperRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isRealDrag, setIsRealDrag] = useState(false);
  const [revealActive, setRevealActive] = useState(false);

  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const hasMoved = useRef(false);

  // Check scroll boundary to disable/enable circular buttons
  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // Give a tiny offset buffer for rounding
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      // Run initial check
      checkScroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
    };
  }, [products]);

  // Viewport entrance animation trigger via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealActive(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse drag scrolling handlers
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setIsRealDrag(false);
    hasMoved.current = false;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftVal.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsRealDrag(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Tiny delay to ensure the click event finishes propagating before class changes
    setTimeout(() => {
      setIsRealDrag(false);
    }, 50);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag speed multiplier
    if (Math.abs(x - startX.current) > 5) {
      hasMoved.current = true;
      setIsRealDrag(true);
    }
    sliderRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  // Prevent card click when dragging
  const handleCardClickCapture = (e) => {
    if (hasMoved.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Click arrow navigation scrolling offsets
  const handleArrowClick = (direction) => {
    if (sliderRef.current) {
      const offset = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === 'right' ? offset : -offset,
        behavior: 'smooth',
      });
    }
  };

  const handleViewAllRedirect = () => {
    navigate(`/shop?section=${section}`);
  };

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

  return (
    <section className={`py-4 bg-white ${className}`}>
      <div
        className="container"
        style={{ borderBottom: '1px solid #0000001A', paddingBottom: '35px' }}
      >
        <h2 className="fw-bold text-center heading-integral mb-4 happy-heading">{title}</h2>

        <div
          ref={wrapperRef}
          className={`home-products-slider-wrapper home-slider-reveal ${revealActive ? 'reveal-active' : ''}`}
        >
          {/* Previous Arrow Button */}
          <button
            type="button"
            className="slider-arrow-btn slider-arrow-left"
            onClick={() => handleArrowClick('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            ‹
          </button>

          {/* Draggable Snapping Container */}
          <div
            ref={sliderRef}
            className={`home-products-slider ${isRealDrag ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={`section-skele-${idx}`}>
                  <ProductCardSkeleton style={{ width: '260px' }} />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="text-center w-100 text-muted small py-5">No products found.</div>
            ) : (
              products.map((product, index) => (
                <div
                  key={product.id}
                  onClickCapture={handleCardClickCapture}
                  style={{
                    opacity: revealActive ? 1 : 0,
                    transform: revealActive ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`,
                  }}
                >
                  <HomeProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))
            )}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className="slider-arrow-btn slider-arrow-right"
            onClick={() => handleArrowClick('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        {showViewAll && products.length > 0 && (
          <div className="text-center mt-4 pt-2">
            <button
              className="btn btn-outline-dark rounded-pill"
              style={{ padding: '10px 50px', borderColor: '#e0e0e0', fontWeight: '600', fontSize: '0.95rem' }}
              onClick={handleViewAllRedirect}
            >
              View All
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
            closeModal();
          }}
        />
      </div>
    </section>
  );
};

export default ProductSection;
