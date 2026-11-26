import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  Search,
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL query parameters
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'default';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';
  const inStockParam = searchParams.get('inStock') === 'true';

  // Local inputs
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setMinPriceInput(minPriceParam);
  }, [minPriceParam]);

  useEffect(() => {
    setMaxPriceInput(maxPriceParam);
  }, [maxPriceParam]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats || []);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (minPriceParam) params.minPrice = minPriceParam;
        if (maxPriceParam) params.maxPrice = maxPriceParam;
        if (ratingParam) params.rating = ratingParam;
        if (inStockParam) params.inStock = true;
        if (sortBy && sortBy !== 'default') params.sort = sortBy;

        const data = await productService.getProducts(params);
        setProducts(data.content || []);
        setCurrentPage(1); // Reset page on filter change
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, minPriceParam, maxPriceParam, ratingParam, inStockParam]);

  // Update query params helper
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput.trim());
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');

    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
    searchQuery ||
    minPriceParam ||
    maxPriceParam ||
    ratingParam ||
    inStockParam ||
    sortBy !== 'default'
  );

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Explore Products</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.25rem 0 0' }}>
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
              {selectedCategory && ` in "${selectedCategory}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}
            >
              <SlidersHorizontal size={16} /> Filters
              {hasActiveFilters && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)'
                  }}
                />
              )}
            </button>

            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="form-control"
                style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.875rem' }}
              >
                <option value="default">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating: Highest First</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '520px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search by product name or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: searchInput ? '2.25rem' : '1rem' }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilter('search', '');
                }}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button type="submit" variant="primary" size="md">
            Search
          </Button>
        </form>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }}
        className="products-layout"
      >
        {/* Sidebar Filters */}
        <aside
          className={`filter-sidebar ${showMobileFilters ? 'open' : ''}`}
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem',
            position: 'sticky',
            top: '90px'
          }}
        >
          {/* Filter Header & Clear Filters button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filters
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <RefreshCw size={13} /> Clear Filters
              </button>
            )}
          </div>

          {/* 1. Category Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => updateFilter('category', '')}
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: !selectedCategory ? 600 : 400,
                  backgroundColor: !selectedCategory ? 'var(--primary-light)' : 'transparent',
                  color: !selectedCategory ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilter('category', cat.name)}
                  style={{
                    textAlign: 'left',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: selectedCategory === cat.name ? 600 : 400,
                    backgroundColor: selectedCategory === cat.name ? 'var(--primary-light)' : 'transparent',
                    color: selectedCategory === cat.name ? 'var(--primary)' : 'var(--text-main)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Price Range ($)
            </h4>
            <form onSubmit={handlePriceApply} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
              </div>
              <Button type="submit" variant="primary" size="sm" fullWidth>
                Apply Price
              </Button>
            </form>
          </div>

          {/* 3. Rating Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Customer Rating
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { value: '', label: 'All Ratings' },
                { value: '4', label: '4★ & above' },
                { value: '3', label: '3★ & above' },
                { value: '2', label: '2★ & above' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateFilter('rating', opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textAlign: 'left',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: ratingParam === opt.value ? 600 : 400,
                    backgroundColor: ratingParam === opt.value ? 'var(--primary-light)' : 'transparent',
                    color: ratingParam === opt.value ? 'var(--primary)' : 'var(--text-main)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {opt.value && <Star size={14} fill="#f59e0b" color="#f59e0b" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Stock Availability Filter */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Availability
            </h4>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: inStockParam ? 600 : 400,
                color: inStockParam ? 'var(--primary)' : 'var(--text-main)'
              }}
            >
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Products List & Pagination */}
        <div>
          <ProductGrid
            products={paginatedProducts}
            loading={loading}
            emptyMessage="No products match your search or filter combination."
            onReset={handleResetFilters}
          />

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '3rem',
                flexWrap: 'wrap'
              }}
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                icon={ChevronLeft}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      backgroundColor: currentPage === pageNum ? 'var(--primary)' : 'white',
                      color: currentPage === pageNum ? 'white' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .products-layout {
            grid-template-columns: 1fr !important;
          }
          .filter-sidebar {
            display: none;
          }
          .filter-sidebar.open {
            display: block !important;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;
