import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId);
      addToast('Order cancelled successfully', 'info');
      fetchOrders();
    } catch (e) {
      addToast(e.message || 'Failed to cancel order', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="badge badge-info">Placed</span>;
      case 'CONFIRMED':
        return <span className="badge badge-primary">Confirmed</span>;
      case 'SHIPPED':
        return <span className="badge badge-warning">Shipped</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="badge badge-warning">Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  if (loading) {
    return <Loading fullPage message="Fetching your orders..." />;
  }

  if (orders.length === 0) {
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
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--text-muted)'
            }}
          >
            <Package size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Orders Yet
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            You haven't placed any orders with ShopEase yet. Check out our latest products and deals!
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Track, review, or manage your recent purchases
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => {
          const dateStr = order.orderDate
            ? new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Recent Order';

          const canCancel = order.status === 'PLACED';

          return (
            <div
              key={order.id}
              className="card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {/* Header row: Order #, Date, Status, Total */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Order Number
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                    {order.orderNumber || `ORD-${order.id}`}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Date</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{dateStr}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                  <strong style={{ fontSize: '1.1rem' }}>
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Status
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {canCancel && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              {/* Items row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(order.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.productName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Qty: {item.quantity} &times; ${item.unitPrice?.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      ${(item.subtotal || item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping destination footer */}
              {order.shippingAddress && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.825rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <strong>Delivering to:</strong> {order.shippingAddress}, {order.city}, {order.state} - {order.pincode} | Contact: {order.phone}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
