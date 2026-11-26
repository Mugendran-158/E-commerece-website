import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2, TrendingUp, ShoppingBag, Users, Package,
  IndianRupee, ChevronLeft, RefreshCw, Award, AlertCircle,
  Clock, CheckCircle, Folder, Eye
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';

// ─── Minimal Bar Chart (pure CSS/SVG) ───────────────────────────────────────
const BarChartComponent = ({ data, valueKey, labelKey, color = '#6366f1', height = 220 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No sales data available for this timeframe
      </div>
    );
  }
  const max = Math.max(...data.map((d) => parseFloat(d[valueKey]) || 0));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: `${height}px`,
        padding: '0 8px',
        overflowX: 'auto'
      }}
    >
      {data.map((d, i) => {
        const val = parseFloat(d[valueKey]) || 0;
        const barH = max > 0 ? Math.max(6, (val / max) * (height - 36)) : 6;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              minWidth: '32px'
            }}
          >
            <div
              title={`${d[labelKey]}: ₹${val.toLocaleString('en-IN')}`}
              style={{
                width: '100%',
                height: `${barH}px`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.4s ease',
                cursor: 'default',
                minHeight: '6px'
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}
            >
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Donut Chart ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  PLACED: '#f59e0b',
  CONFIRMED: '#3b82f6',
  SHIPPED: '#8b5cf6',
  OUT_FOR_DELIVERY: '#06b6d4',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444'
};

const DonutChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data</div>;
  }
  const total = data.reduce((s, d) => s + Number(d.count), 0);
  if (total === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet</div>;
  }

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const innerR = 42;

  let cumulative = 0;
  const slices = data.map((d) => {
    const pct = Number(d.count) / total;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, end: cumulative };
  });

  const polarToCartesian = (pct) => {
    const angle = pct * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  const innerPoint = (pct) => {
    const angle = pct * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle)
    };
  };

  const slicePath = (start, end) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const si = innerPoint(start);
    const ei = innerPoint(end);
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${innerR} ${innerR} 0 ${large} 0 ${si.x} ${si.y} Z`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={slicePath(s.start, s.end)}
            fill={STATUS_COLORS[s.status] || '#94a3b8'}
            stroke="white"
            strokeWidth={2}
          >
            <title>{s.status}: {s.count}</title>
          </path>
        ))}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          style={{ fontSize: '22px', fontWeight: 800, fill: 'var(--text-primary)' }}
        >
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: '11px', fill: 'var(--text-muted)' }}>
          Total Orders
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, minWidth: 0 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                backgroundColor: STATUS_COLORS[s.status] || '#94a3b8',
                flexShrink: 0
              }}
            />
            <span
              style={{
                flex: 1,
                color: 'var(--text-muted)',
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {s.status.replace(/_/g, ' ')}
            </span>
            <span style={{ fontWeight: 700 }}>{s.count}</span>
            <span style={{ color: 'var(--text-muted)' }}>({(s.pct * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.9rem'
    }}
  >
    <div
      style={{
        width: '46px',
        height: '46px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: color + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesTimeframe, setSalesTimeframe] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, ordersData] = await Promise.all([
        adminService.getAnalytics(),
        orderService.getAllOrdersAdmin()
      ]);
      setAnalytics(analyticsData);
      setRecentOrders((ordersData || []).slice(0, 5));
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (v) => {
    const n = parseFloat(v) || 0;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <RefreshCw size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading real platform analytics...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
        <h2>{error}</h2>
        <button
          onClick={loadData}
          style={{
            marginTop: '1rem',
            padding: '0.65rem 1.5rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const summary = analytics?.summary || {};
  const totalRevenue = summary.totalRevenue || 0;
  const totalOrders = summary.totalOrders || 0;
  const totalUsers = summary.totalUsers || 0;
  const totalProducts = summary.totalProducts || 0;
  const pendingOrders = summary.pendingOrders || 0;
  const deliveredOrders = summary.deliveredOrders || 0;
  const cancelledOrders = summary.cancelledOrders || 0;

  // Active sales data for chart
  let chartData = [];
  let chartValueKey = 'revenue';
  let chartLabelKey = 'month';

  if (salesTimeframe === 'daily') {
    chartData = analytics?.dailySales || [];
    chartLabelKey = 'date';
  } else if (salesTimeframe === 'weekly') {
    chartData = analytics?.weeklySales || [];
    chartLabelKey = 'week';
  } else {
    chartData = analytics?.monthlyRevenue || [];
    chartLabelKey = 'month';
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/admin" style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <ChevronLeft size={22} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Advanced Admin Analytics</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
              Real-time MySQL data, sales metrics, and business intelligence
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'white',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* 7 KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(totalRevenue)} color="#6366f1" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={Number(totalOrders).toLocaleString()} color="#f59e0b" />
        <StatCard icon={Users} label="Total Users" value={Number(totalUsers).toLocaleString()} color="#3b82f6" />
        <StatCard icon={Package} label="Total Products" value={Number(totalProducts).toLocaleString()} color="#10b981" />
        <StatCard icon={Clock} label="Pending Orders" value={Number(pendingOrders).toLocaleString()} color="#f59e0b" />
        <StatCard icon={CheckCircle} label="Delivered Orders" value={Number(deliveredOrders).toLocaleString()} color="#10b981" />
        <StatCard icon={AlertCircle} label="Cancelled Orders" value={Number(cancelledOrders).toLocaleString()} color="#ef4444" />
      </div>

      {/* Sales Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
        className="analytics-grid"
      >
        {/* Sales Chart with Daily / Weekly / Monthly Switcher */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Sales Analytics</h3>
            </div>

            {/* Timeframe Buttons */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '3px'
              }}
            >
              {['daily', 'weekly', 'monthly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSalesTimeframe(tf)}
                  style={{
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    backgroundColor: salesTimeframe === tf ? 'white' : 'transparent',
                    color: salesTimeframe === tf ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: salesTimeframe === tf ? 'var(--shadow-sm)' : 'none',
                    transition: 'var(--transition)'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <BarChartComponent
            data={chartData}
            valueKey={chartValueKey}
            labelKey={chartLabelKey}
            color="#6366f1"
            height={220}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            Revenue in ₹ from completed & placed orders (excluding cancelled)
          </div>
        </div>

        {/* Orders by Status Donut */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart2 size={18} style={{ color: '#f59e0b' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Orders by Status</h3>
          </div>
          <DonutChart data={analytics?.ordersByStatus || []} />
        </div>
      </div>

      {/* Row 2: Top Selling Products and Best Selling Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
        className="analytics-grid"
      >
        {/* Top Products */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={18} style={{ color: '#10b981' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Top Selling Products</h3>
          </div>

          {!analytics?.topProducts?.length ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No product order data yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Product</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Units Sold</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.slice(0, 5).map((p, i) => (
                    <tr key={p.productId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>#{i + 1}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{Number(p.totalQuantity).toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{parseFloat(p.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Best Selling Categories */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Folder size={18} style={{ color: '#8b5cf6' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Best Selling Categories</h3>
          </div>

          {!analytics?.topCategories?.length ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No category order data yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Units Sold</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topCategories.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{c.category}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{Number(c.unitsSold).toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#8b5cf6' }}>
                        ₹{parseFloat(c.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Recent Orders */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '1.5rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Recent Orders</h3>
          </div>
          <Link
            to="/admin/orders"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}
          >
            View All Orders &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No orders placed yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Order ID</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {ord.orderNumber || `ORD-${ord.id}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {ord.user ? `${ord.user.firstName || ''} ${ord.user.lastName || ''}`.trim() || ord.user.email : ord.city || 'Customer'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                      {new Date(ord.orderDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>
                      ₹{parseFloat(ord.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          backgroundColor: (STATUS_COLORS[ord.status] || '#94a3b8') + '18',
                          color: STATUS_COLORS[ord.status] || '#94a3b8'
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                      >
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;
