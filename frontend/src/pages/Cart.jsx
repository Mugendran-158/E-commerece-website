import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';

const Cart = () => {
  const { items, clearCart, totalItems, subtotal, shippingFee, grandTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem 6rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '460px',
            margin: '0 auto',
            padding: '3rem 2rem',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--primary)'
            }}
          >
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Looks like you haven't added anything to your cart yet. Explore our top-tier collections and find what you love!
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Review your {totalItems} {totalItems === 1 ? 'item' : 'items'} before proceeding to checkout
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '2.5rem',
          alignItems: 'start'
        }}
        className="cart-layout"
      >
        {/* Cart items list */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem 2rem'
          }}
        >
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            position: 'sticky',
            top: '90px'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal ({totalItems})</span>
              <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
              <span style={{ fontWeight: 600 }}>
                {shippingFee === 0 ? (
                  <span style={{ color: 'var(--success)' }}>FREE</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Add ${(100 - subtotal).toFixed(2)} more to qualify for <strong>FREE shipping</strong>!
              </div>
            )}

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                marginTop: '0.5rem',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 800
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={ArrowRight}
            onClick={() => navigate('/checkout')}
            style={{ marginTop: '1.5rem' }}
          >
            Proceed to Checkout
          </Button>

          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="var(--primary)" /> Safe and encrypted transactions
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={16} color="var(--primary)" /> Cash on Delivery available at checkout
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
