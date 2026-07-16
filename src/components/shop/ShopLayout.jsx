import React from 'react';
import FilterSidebar from './FilterSidebar';
import ShopGrid from './ShopGrid';
import SearchBar from './SearchBar';
import './ShopLayout.css';

/**
 * ShopLayout Component coordinating filters and grids.
 */
const ShopLayout = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="container py-4 shop-layout">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/" className="text-decoration-none text-dark">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Shop
          </li>
        </ol>
      </nav>

      {/* Grid wrapper */}
      <div className="row g-4">
        <div className="col-12 col-md-4 col-lg-3">
          <button 
            className="btn btn-outline-dark w-100 d-md-none mb-3 py-2.5 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mobileFiltersCollapse" 
            aria-expanded="false" 
            aria-controls="mobileFiltersCollapse"
          >
            <i className="bi bi-sliders"></i> Filter Products
          </button>
          
          <div className="collapse d-md-block mb-3 mb-md-0" id="mobileFiltersCollapse">
            <FilterSidebar />
          </div>
        </div>
        <div className="col-12 col-md-8 col-lg-9">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <ShopGrid searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default ShopLayout;
