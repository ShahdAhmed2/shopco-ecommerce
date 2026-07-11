import React, { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import { useFilters } from '../../contexts/FilterContext';
import toast from 'react-hot-toast';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import SortDropdown from './SortDropdown';
import './ShopGrid.css';

/**
 * ShopGrid Component rendering dynamically fetched products.
 */
const ShopGrid = ({ searchQuery }) => {
  const { addToCart } = useCart();
  const { data: products = [], isLoading, isError, error } = useProducts();
  const {
    category,
    dressStyle,
    color,
    size,
    minPrice,
    maxPrice,
    rating,
    sort,
  } = useFilters();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

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
        result.sort((a, b) => Number(b.id) - Number(a.id));
      }
    }

    return result;
  }, [products, searchQuery, category, dressStyle, color, size, minPrice, maxPrice, rating, sort]);

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

  if (filteredProducts.length === 0) {
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 pb-2 border-bottom">
        <h5 className="fw-bold mb-0">All Products</h5>
        <SortDropdown />
      </div>
      
      {/* Product Cards Layout Grid */}
      <div className="shop-products-layout">
        {filteredProducts.map((product) => (
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
