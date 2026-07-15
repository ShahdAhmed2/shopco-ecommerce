import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import { useFilters } from '../../contexts/FilterContext';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import SortDropdown from './SortDropdown';
import Pagination from '../ui/Pagination';
import ProductCardSkeleton from '../ui/ProductCardSkeleton';
import './ShopGrid.css';

/**
 * ShopGrid Component rendering dynamically fetched products.
 */
const ShopGrid = ({ searchQuery }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const {
    category,
    setCategory,
    dressStyle,
    setDressStyle,
    brand,
    setBrand,
    section,
    setSection,
    color,
    setColor,
    size,
    setSize,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    rating,
    setRating,
    sort,
    resetFilters,
  } = useFilters();

  const filters = useMemo(() => ({
    search: searchQuery || undefined,
    category: category || undefined,
    dressStyle: dressStyle || undefined,
    brand: brand || undefined,
    section: section || undefined,
    color: color || undefined,
    size: size || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    rating: rating || undefined,
    sort: sort || undefined,
  }), [searchQuery, category, dressStyle, brand, section, color, size, minPrice, maxPrice, rating, sort]);

  const { data: products = [], isLoading, isError, error } = useProducts(filters);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust to 8 for neat 4-column desktop grids (multiple of 4)

  // Reset to page 1 whenever filters, search, or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, dressStyle, brand, section, color, size, minPrice, maxPrice, rating, sort]);

  // Multi-tier client-side product filtering
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Search term match (case-insensitive name match)
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }

    // 2. Category match
    if (category) {
      const term = category.toLowerCase();
      result = result.filter((p) => p.category && p.category.toLowerCase() === term);
    }

    // 3. Dress Style match
    if (dressStyle) {
      const term = dressStyle.toLowerCase();
      result = result.filter((p) => p.dressStyle && p.dressStyle.toLowerCase() === term);
    }

    // 3a. Brand match
    if (brand) {
      const term = brand.toLowerCase();
      result = result.filter((p) => p.brand && p.brand.toLowerCase() === term);
    }

    // 3b. Section match
    if (section) {
      const term = section.toLowerCase();
      result = result.filter((p) => p.section && p.section.toLowerCase() === term);
    }

    // 4. Color match
    if (color) {
      const term = color.toLowerCase();
      result = result.filter((p) => {
        if (Array.isArray(p.colors)) {
          return p.colors.some((c) => c.toLowerCase() === term);
        }
        if (typeof p.color === 'string') {
          return p.color.toLowerCase() === term;
        }
        return false;
      });
    }

    // 5. Size match
    if (size) {
      const term = size.toLowerCase();
      result = result.filter((p) => {
        if (Array.isArray(p.sizes)) {
          return p.sizes.some((s) => s.toLowerCase() === term);
        }
        if (typeof p.size === 'string') {
          return p.size.toLowerCase() === term;
        }
        return false;
      });
    }

    // 6. Price range match (taking discount rate into account)
    result = result.filter((p) => {
      const actualPrice = p.discount
        ? p.price * (1 - p.discount / 100)
        : p.price;
      return actualPrice >= minPrice && actualPrice <= maxPrice;
    });

    // 8. Sorting
    if (sort) {
      result = [...result];
      if (sort === 'price-asc') {
        result.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
      } else if (sort === 'price-desc') {
        result.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
      } else if (sort === 'rating-desc') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'newest') {
        result.sort((a, b) => String(b.id || '').localeCompare(String(a.id || '')));
      } else if (sort === 'reviews-desc') {
        result.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
      } else if (sort === 'name-asc') {
        result.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
      } else if (sort === 'name-desc') {
        result.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
      }
    }

    return result;
  }, [products, searchQuery, category, dressStyle, brand, section, color, size, minPrice, maxPrice, rating, sort]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const handleAddToCart = React.useCallback((product) => {
    addToCart(product, selectedSize, selectedColor);
  }, [addToCart, selectedSize, selectedColor]);

  // Remove individual filter chips
  const removeFilter = (filterType) => {
    if (filterType === 'category') setCategory('');
    if (filterType === 'dressStyle') setDressStyle('');
    if (filterType === 'brand') setBrand('');
    if (filterType === 'section') setSection('');
    if (filterType === 'color') setColor('');
    if (filterType === 'size') setSize('');
    if (filterType === 'price') {
      setMinPrice(0);
      setMaxPrice(1000);
    }
    if (filterType === 'rating') setRating(0);
  };

  const hasActiveFilters = category || dressStyle || brand || section || color || size || minPrice > 0 || maxPrice < 1000 || rating > 0;

  const renderActiveChips = () => {
    if (!hasActiveFilters) return null;
    return (
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <span className="text-muted small">Active Filters:</span>
        {category && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Category: {category}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('category')} aria-label="Remove category filter"></button>
          </span>
        )}
        {dressStyle && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Style: {dressStyle}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('dressStyle')} aria-label="Remove style filter"></button>
          </span>
        )}
        {brand && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Brand: {brand}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('brand')} aria-label="Remove brand filter"></button>
          </span>
        )}
        {section && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Section: {section}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('section')} aria-label="Remove section filter"></button>
          </span>
        )}
        {color && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Color: {color}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('color')} aria-label="Remove color filter"></button>
          </span>
        )}
        {size && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Size: {size}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('size')} aria-label="Remove size filter"></button>
          </span>
        )}
        {(minPrice > 0 || maxPrice < 1000) && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Price: ${minPrice} - ${maxPrice}
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('price')} aria-label="Remove price filter"></button>
          </span>
        )}
        {rating > 0 && (
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3 rounded-pill" style={{ fontSize: '0.8rem' }}>
            Rating: {rating}★ & Up
            <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} onClick={() => removeFilter('rating')} aria-label="Remove rating filter"></button>
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="shop-grid p-4 border rounded-3 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 pb-2 border-bottom">
          <h5 className="fw-bold mb-0">All Products</h5>
          <div className="skeleton-pulse" style={{ width: '120px', height: '35px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        </div>
        <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-4">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div className="col" key={`shop-skele-${idx}`}>
              <ProductCardSkeleton style={{ width: '100%' }} />
            </div>
          ))}
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

  if (filteredProducts.length === 0) {
    return (
      <div className="shop-grid p-4 border rounded-3 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 pb-2 border-bottom">
          <div className="d-flex flex-column align-items-start">
            <h5 className="fw-bold mb-0">All Products</h5>
            <span className="text-muted small mt-1">Showing 0 of {products.length} Products</span>
          </div>
          <SortDropdown />
        </div>

        {renderActiveChips()}

        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox fs-1 mb-2 d-block"></i>
          <h5 className="fw-bold text-dark">No products found</h5>
          <p className="small mb-3">Try changing your filters.</p>
          <button
            type="button"
            className="btn btn-dark btn-sm rounded-pill px-4"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-grid p-4 border rounded-3 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 pb-2 border-bottom">
        <div className="d-flex flex-column align-items-start">
          <h5 className="fw-bold mb-0">All Products</h5>
          <span className="text-muted small mt-1">
            Showing {filteredProducts.length} of {products.length} Products
          </span>
        </div>
        <SortDropdown />
      </div>

      {renderActiveChips()}

      {/* Product Cards Layout Grid */}
      <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-4 mb-4">
        {paginatedProducts.map((product) => (
          <div className="col d-flex align-items-stretch" key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              className="w-100"
            />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
  );
};

export default ShopGrid;
