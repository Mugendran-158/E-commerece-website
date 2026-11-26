import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const originalPrice = product.originalPrice || product.price || 0;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < originalPrice;
  const currentPrice = hasDiscount ? discountPrice : originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;
  const inStock = product.stockQuantity > 0;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
      }}
    >
      {/* Badges on top: discount and stock */}
      <div
        style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 2
        }}
      >
        {hasDiscount && (
          <span className="badge badge-danger">
            -{discountPercentage}%
          </span>
        )}
        {!inStock && (
          <span className="badge badge-warning">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3,
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s ease',
          color: isInWishlist(product.id) ? '#ef4444' : 'var(--text-muted)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Heart
          size={16}
          fill={isInWishlist(product.id) ? '#ef4444' : 'none'}
          color={isInWishlist(product.id) ? '#ef4444' : 'currentColor'}
        />
      </button>

      {/* Image container */}
      <Link
        to={`/products/${product.id}`}
        style={{
          display: 'block',
          position: 'relative',
          paddingTop: '80%',
          backgroundColor: '#f8fafc',
          overflow: 'hidden'
        }}
      >
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/400`}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/product${product.id}/600/400`;
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Card body */}
      <div
        style={{
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Category */}
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              marginBottom: '0.35rem'
            }}
          >
            {product.category || 'General'}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.id}`}
            style={{
              display: 'block',
              fontWeight: 600,
              fontSize: '0.975rem',
              lineHeight: 1.4,
              color: 'var(--text-main)',
              marginBottom: '0.5rem',
              height: '2.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {product.rating || '4.8'}
            </span>
            {product.reviewsCount && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({product.reviewsCount})
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}
              >
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!inStock}
              onClick={() => addToCart(product, 1)}
              style={{ flex: 1 }}
              title={inStock ? 'Add to Cart' : 'Out of Stock'}
            >
              <ShoppingCart size={15} /> Add
            </button>
            <Link
              to={`/products/${product.id}`}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem 0.6rem' }}
              title="View Details"
            >
              <Eye size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
