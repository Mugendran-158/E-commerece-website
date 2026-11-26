import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        paddingTop: '3.5rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b'
      }}
    >
      <div className="container">
        {/* Value Perks Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid #1e293b'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                color: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Free Fast Shipping</div>
              <div style={{ fontSize: '0.8rem' }}>On orders over $100</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                color: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Secure Checkout</div>
              <div style={{ fontSize: '0.8rem' }}>100% protected payments</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                color: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RefreshCw size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Easy 30-Day Returns</div>
              <div style={{ fontSize: '0.8rem' }}>Hassle-free guarantee</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                color: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>24/7 Support</div>
              <div style={{ fontSize: '0.8rem' }}>Dedicated customer care</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            padding: '3rem 0'
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 800,
                fontSize: '1.35rem',
                color: 'white',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <span>ShopEase</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              Your premium destination for curated electronics, fashion, shoes, beauty, and home essentials.
              Engineered with modern performance and effortless shopping experience.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1.25rem' }}>Shop Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/products?category=Electronics" style={{ hover: { color: 'white' } }}>Electronics & Audio</Link></li>
              <li><Link to="/products?category=Fashion">Apparel & Fashion</Link></li>
              <li><Link to="/products?category=Shoes">Footwear & Sneakers</Link></li>
              <li><Link to="/products?category=Beauty">Beauty & Skincare</Link></li>
              <li><Link to="/products?category=Home">Home & Living</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1.25rem' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
              <li><a href="#shipping">Shipping Policy</a></li>
              <li><a href="#privacy">Privacy & Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1.25rem' }}>Stay Connected</h4>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Subscribe to receive special offers, new launch drops, and discounts.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                  flex: 1
                }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            padding: '1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.825rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} ShopEase Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with modern React, Spring Boot & MySQL.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
