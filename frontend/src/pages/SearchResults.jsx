import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import SearchBar from '../components/common/SearchBar';
import { ArrowLeft } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts({ search: query });
        setProducts(data.content || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [query]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Search Results</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {query ? (
              <>
                Found <strong>{products.length}</strong> items for query: <em>"{query}"</em>
              </>
            ) : (
              'Enter a keyword to search products'
            )}
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '380px' }}>
          <SearchBar
            initialQuery={query}
            onSearch={(val) => setSearchParams(val ? { q: val } : {})}
          />
        </div>
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage={`No products found matching "${query}". Try checking your spelling or using different keywords.`}
      />
    </div>
  );
};

export default SearchResults;
