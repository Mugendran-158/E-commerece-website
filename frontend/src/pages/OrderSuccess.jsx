import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, Truck } from 'lucide-react';
import Button from '../components/common/Button';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '680px' }}>
      <div
        className="card"
        style={{
          padding: '3rem 2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <CheckCircle size={44} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Thank You! Your Order is Placed
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
          We've received your order and are preparing it for express dispatch.
        </p>

        {/* Order Details card */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
            <strong style={{ color: 'var(--primary)' }}>{order?.orderNumber || orderId || 'ORD-98231'}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
            <strong>Cash on Delivery (COD)</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Delivery Status:</span>
            <span className="badge badge-primary">Order Placed</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
            <strong>Within 2–4 Business Days</strong>
          </div>

          {order?.totalAmount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', fontSize: '1.05rem', fontWeight: 700 }}>
              <span>Total Amount:</span>
              <span style={{ color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders">
            <Button variant="primary" size="md" icon={Package}>
              View My Orders
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="md" icon={Home}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
