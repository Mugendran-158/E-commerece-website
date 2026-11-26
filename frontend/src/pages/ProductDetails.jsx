import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Minus,
  Plus,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/product/ProductCard';
import ProductReviews from '../components/product/ProductReviews';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);
        setQuantity(1);

        // Fetch related products in the same category
        const allProds = await productService.getProducts({ category: data.category });
        setRelatedProducts(
          (allProds.content || []).filter((p) => p.id !== data.id).slice(0, 4)
        );
      } catch (err) {
        setError('Failed to find this product. It may have been removed or is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <Loading fullPage message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <ErrorMessage message={error} />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/products" className="btn btn-outline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const originalPrice = product.originalPrice || product.price || 0;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < originalPrice;
  const currentPrice = hasDiscount ? discountPrice : originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;
  const inStock = product.stockQuantity > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Back button */}
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={16} /> Back to all products
      </Link>

      {/* Main product detail grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start',
          marginBottom: '5rem'
        }}
      >
        {/* Large Product Image */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {hasDiscount && (
            <span
              className="badge badge-danger"
              style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2, fontSize: '0.85rem' }}
            >
              Save {discountPercentage}%
            </span>
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '480px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Information */}
        <div>
          {/* Category & Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="badge badge-primary"
            >
              {product.category}
            </Link>
            {inStock ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle size={16} /> In Stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                <AlertTriangle size={16} /> Out of Stock
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(product.rating || 4.8) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{product.rating || '4.8'}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              ({product.reviewsCount || 420} customer reviews)
            </span>
          </div>

          {/* Pricing */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.75rem'
            }}
          >
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                  You save ${(originalPrice - discountPrice).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Product Overview
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
              {product.description}
            </p>
          </div>

          {/* Quantity selector & Actions */}
          {inStock && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'white'
                  }}
                >
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 0.75rem', fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= product.stockQuantity}
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={ShoppingCart}
                  onClick={handleAddToCart}
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Zap}
                  onClick={handleBuyNow}
                  style={{ flex: 1, minWidth: '160px', backgroundColor: '#0f172a', color: 'white' }}
                >
                  Buy Now
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-secondary btn-lg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: isInWishlist(product.id) ? '#ef4444' : 'var(--text-main)',
                    borderColor: isInWishlist(product.id) ? '#fca5a5' : 'var(--border-color)',
                    backgroundColor: isInWishlist(product.id) ? '#fee2e2' : 'white',
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist(product.id) ? '#ef4444' : 'none'}
                    color={isInWishlist(product.id) ? '#ef4444' : 'currentColor'}
                  />
                  {isInWishlist(product.id) ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>
            </div>
          )}

          {!inStock && (
            <div style={{ marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="btn btn-secondary btn-lg"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: isInWishlist(product.id) ? '#ef4444' : 'var(--text-main)',
                  borderColor: isInWishlist(product.id) ? '#fca5a5' : 'var(--border-color)',
                  backgroundColor: isInWishlist(product.id) ? '#fee2e2' : 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <Heart
                  size={20}
                  fill={isInWishlist(product.id) ? '#ef4444' : 'none'}
                  color={isInWishlist(product.id) ? '#ef4444' : 'currentColor'}
                />
                {isInWishlist(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          )}

          {/* Assurance perks */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Truck size={18} color="var(--primary)" />
              <span>Free standard delivery on orders above $100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RotateCcw size={18} color="var(--primary)" />
              <span>30-Day returns with 100% money-back guarantee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>2-Year manufacturer warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ProductReviews productId={parseInt(id)} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Similar in {product.category}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
