import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import CategoryCard from '../components/category/CategoryCard';
import Button from '../components/common/Button';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          productService.getFeaturedProducts(),
          categoryService.getCategories()
        ]);
        setFeaturedProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: 'white',
          padding: '5rem 0',
          overflow: 'hidden',
          marginBottom: '4rem'
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#e0e7ff',
                  marginBottom: '1.5rem'
                }}
              >
                <Sparkles size={16} color="#fbbf24" /> Exclusive Summer 2026 Collection
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: 'white',
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Shop Everything <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  You Love.
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.125rem',
                  color: '#c7d2fe',
                  marginBottom: '2rem',
                  lineHeight: 1.6,
                  maxWidth: '520px'
                }}
              >
                Discover premium essentials, trending electronics, athletic footwear, and luxury styles tailored to elevate your everyday lifestyle.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/categories">
                  <button
                    type="button"
                    className="btn btn-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Browse Categories
                  </button>
                </Link>
              </div>

              {/* Trust stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '2.5rem',
                  marginTop: '3rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>50k+</div>
                  <div style={{ fontSize: '0.825rem', color: '#a5b4fc' }}>Active Shoppers</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>99.4%</div>
                  <div style={{ fontSize: '0.825rem', color: '#a5b4fc' }}>Positive Ratings</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>24h</div>
                  <div style={{ fontSize: '0.825rem', color: '#a5b4fc' }}>Fast Dispatch</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '460px',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <img
                  src="/images/hero-showcase.jpg"
                  alt="ShopEase Showcase"
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    left: '1.25rem',
                    right: '1.25rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      Limited Drop
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Up to 40% OFF Trends</div>
                  </div>
                  <Link to="/products" className="badge badge-primary" style={{ padding: '0.4rem 0.75rem' }}>
                    Claim Offer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Explore Collections
            </span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Curated collections spanning our most popular lifestyle categories
            </p>
          </div>
          <Link
            to="/categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}
          >
            All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Top Picks
            </span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Handpicked bestsellers rated highest by our shopping community
            </p>
          </div>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Promotional Banner */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem'
              }}
            >
              Special Deal of the Week
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
              Upgrade Your Setup With Premium Sound
            </h2>
            <p style={{ color: '#e0e7ff', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Experience sound without compromise. Save $70 instantly on the award-winning Sony WH-1000XM5 wireless noise-canceling headphones today.
            </p>
            <Link to="/products/1">
              <Button
                variant="secondary"
                size="lg"
                style={{ backgroundColor: 'white', color: 'var(--primary)', fontWeight: 700 }}
              >
                Shop Deal Now
              </Button>
            </Link>
          </div>

          <div
            style={{
              width: '260px',
              height: '260px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              backgroundColor: 'white'
            }}
          >
            <img
              src="/images/promo-headphone.jpg"
              alt="Promo Headphone"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
