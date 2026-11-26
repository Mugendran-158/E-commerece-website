import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Calendar, CreditCard, Package } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/admin/AdminNav';
import Loading from '../../components/common/Loading';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details:', err);
        addToast(err.message || 'Failed to fetch order details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const updated = await orderService.updateOrderStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      addToast(`Order #${id} status updated to ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading fullPage message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Could not find an order matching ID #{id}.
        </p>
        <Link to="/admin/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/admin/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Order List
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Order {order.orderNumber || `#${order.id}`}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Placed on {new Date(order.orderDate || Date.now()).toLocaleString()}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Update Status:</span>
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontWeight: 600 }}
            >
              <option value="PLACED">PLACED</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </div>

      <AdminNav />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Customer Information */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" /> Customer Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <div>
              <strong>Name:</strong> {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest Customer'}
            </div>
            <div>
              <strong>Email:</strong> {order.user?.email || 'N/A'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={15} color="var(--text-muted)" />
              <strong>Phone:</strong> {order.phone || 'N/A'}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--primary)" /> Shipping Address
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
            <div>{order.shippingAddress}</div>
            <div>
              {order.city}, {order.state} - {order.pincode}
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={15} color="var(--text-muted)" />
              <strong>Payment Method:</strong> {order.paymentMethod || 'CASH_ON_DELIVERY'}
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Table */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={18} color="var(--primary)" /> Order Items
        </h3>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, index) => (
                <tr key={item.id || index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>{item.productName}</span>
                    </div>
                  </td>
                  <td>${item.unitPrice ? item.unitPrice.toFixed(2) : (item.price ? item.price.toFixed(2) : '0.00')}</td>
                  <td>{item.quantity}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    ${item.subtotal ? item.subtotal.toFixed(2) : ((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '2px dashed var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '1.2rem',
            fontWeight: 800
          }}
        >
          <span>Total Amount:&nbsp;</span>
          <span style={{ color: 'var(--primary)' }}>
            ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
