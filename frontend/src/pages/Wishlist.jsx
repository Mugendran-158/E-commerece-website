import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading && wishlistItems.length === 0) {
    return <Loading fullPage message="Loading your favorite items..." />;
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}
          >
            <Heart size={24} fill="#ef4444" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>My Wishlist</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'saved item' : 'saved items'}
            </p>
          </div>
        </div>

        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--border-color)',
            maxWidth: '520px',
            margin: '2rem auto'
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#ef4444'
            }}
          >
            <Heart size={34} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Explore our vast catalog of top-quality products and click the heart icon to save your favorite items here!
          </p>
          <Link to="/products">
            <Button variant="primary" icon={ArrowRight}>
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {wishlistItems.map((item) => {
            const product = item.product || {
              id: item.productId,
              name: item.productName,
              description: item.description,
              originalPrice: item.originalPrice,
              discountPrice: item.discountPrice,
              stockQuantity: item.stockQuantity,
              rating: item.rating,
              reviewsCount: item.reviewsCount,
              imageUrl: item.imageUrl,
              category: item.category
            };

            const originalPrice = product.originalPrice || product.price || 0;
            const discountPrice = product.discountPrice;
            const hasDiscount = discountPrice && discountPrice < originalPrice;
            const currentPrice = hasDiscount ? discountPrice : originalPrice;
            const inStock = product.stockQuantity > 0;

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'white',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                {/* Product Image */}
                <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--danger)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>
                      {product.category || 'General'}
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: 1.4,
                        color: 'var(--text-main)',
                        marginBottom: '0.5rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {product.name}
                    </Link>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
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
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{product.rating || '4.8'}</span>
                      {product.reviewsCount && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        ${currentPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
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
                        onClick={() => handleAddToCart(product)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <ShoppingCart size={15} /> Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="btn btn-secondary btn-sm"
                        title="Remove"
                        style={{ padding: '0.4rem 0.65rem', color: 'var(--danger)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
