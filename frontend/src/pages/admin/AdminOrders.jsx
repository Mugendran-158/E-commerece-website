import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/admin/AdminNav';
import Loading from '../../components/common/Loading';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrdersAdmin();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      addToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === 'ALL' ? true : o.status === statusFilter
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Manage Customer Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review transactions, verify shipping details, and transition fulfillment status
        </p>
      </div>

      <AdminNav />

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        {['ALL', 'PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <Loading message="Loading customer orders..." />
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found for this status.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>
                        {ord.orderNumber || `ORD-${ord.id}`}
                      </strong>
                    </td>
                    <td>
                      <div>
                        {ord.user ? `${ord.user.firstName} ${ord.user.lastName}` : 'Guest Customer'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ord.city}, {ord.state}
                      </div>
                    </td>
                    <td>{new Date(ord.orderDate || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <strong>${ord.totalAmount?.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${ord.status === 'DELIVERED' ? 'success' : ord.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Eye size={14} /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
