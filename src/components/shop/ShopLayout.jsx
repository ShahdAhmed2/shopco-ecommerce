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
          <FilterSidebar />
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
