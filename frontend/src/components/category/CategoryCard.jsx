import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="card"
      style={{
        display: 'block',
        position: 'relative',
        height: '240px',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s ease'
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(category.name)}/600/400`;
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
      {/* Dark overlay for high contrast text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, rgba(15, 23, 42, 0) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.5rem',
          color: 'white'
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#cbd5e1',
            fontWeight: 600,
            marginBottom: '0.25rem'
          }}
        >
          {category.itemCount ? `${category.itemCount}+ Products` : 'Explore'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ color: 'white', fontSize: '1.35rem', fontWeight: 700 }}>{category.name}</h3>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
