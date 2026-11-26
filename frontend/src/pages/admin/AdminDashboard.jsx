import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, DollarSign, Clock, CheckCircle, ArrowUpRight, Plus, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import AdminNav from '../../components/admin/AdminNav';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          adminService.getDashboardStats(),
          orderService.getAllOrdersAdmin()
        ]);
        setStats(statsData);
        setRecentOrders((ordersData || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading fullPage message="Loading administrative metrics..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time platform metrics, store performance, and fulfillment status
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary" icon={Plus}>
            Add New Product
          </Button>
        </Link>
      </div>

      <AdminNav />

      {/* 6 Metric Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}
      >
        {/* Total Products */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Products
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats?.totalProducts || 0}
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#faf5ff',
              color: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Users
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats?.totalUsers || 0}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Orders
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats?.totalOrders || 0}
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ecfdf5',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Pending Orders
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>
              {stats?.pendingOrders || 0}
            </div>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Delivered Orders
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
              {stats?.deliveredOrders || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Platform Orders</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Latest customer checkout transactions awaiting fulfillment
            </p>
          </div>
          <Link
            to="/admin/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            Manage All Orders <ArrowUpRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No customer orders placed yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Date</th>
                  <th>Customer Address</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>
                        {ord.orderNumber || `ORD-${ord.id}`}
                      </strong>
                    </td>
                    <td>{new Date(ord.orderDate || Date.now()).toLocaleDateString()}</td>
                    <td>
                      {ord.city}, {ord.state}
                    </td>
                    <td>{ord.items?.length || 1} items</td>
                    <td>${ord.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${ord.status === 'DELIVERED' ? 'success' : ord.status === 'CANCELLED' ? 'danger' : 'info'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${ord.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/admin/coupons" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'var(--transition)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>🎟️</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Manage Coupons</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Create discount codes</div>
            </div>
            <ArrowUpRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
          </div>
        </Link>
        <Link to="/admin/analytics" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'var(--transition)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Advanced Analytics</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Revenue & sales insights</div>
            </div>
            <ArrowUpRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
          </div>
        </Link>
        <Link to="/admin/reviews" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'var(--transition)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>⭐</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Manage Reviews</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Moderate customer reviews</div>
            </div>
            <ArrowUpRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
