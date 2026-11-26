import React from 'react';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';
import { PackageOpen } from 'lucide-react';
import Button from '../common/Button';

const ProductGrid = ({ products = [], loading = false, emptyMessage = 'No products found matching your criteria.', onReset }) => {
  if (loading) {
    return <Loading message="Loading products..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          margin: '1.5rem 0'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <PackageOpen size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px' }}>
            {emptyMessage}
          </p>
        </div>
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
