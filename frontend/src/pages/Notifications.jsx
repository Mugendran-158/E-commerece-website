import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ShoppingBag,
  Package,
  Truck,
  Gift,
  AlertCircle,
  Tag,
  Info,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const TYPE_ICONS = {
  ORDER_PLACED:          { icon: ShoppingBag, color: '#6366f1' },
  ORDER_CONFIRMED:       { icon: Check,       color: '#10b981' },
  ORDER_SHIPPED:         { icon: Package,     color: '#f59e0b' },
  ORDER_OUT_FOR_DELIVERY:{ icon: Truck,       color: '#3b82f6' },
  ORDER_DELIVERED:       { icon: Gift,        color: '#10b981' },
  ORDER_CANCELLED:       { icon: AlertCircle, color: '#ef4444' },
  COUPON_AVAILABLE:      { icon: Tag,         color: '#8b5cf6' },
  GENERAL:               { icon: Info,        color: '#64748b' }
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      addToast('Could not load notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      addToast('Marked as read', 'success');
    } catch (err) {
      addToast('Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      addToast('All notifications marked as read', 'success');
    } catch (err) {
      addToast('Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      addToast('Notification deleted', 'info');
    } catch (err) {
      addToast('Failed to delete notification', 'error');
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.read) {
      handleMarkAsRead(n.id);
    }
    if (n.referenceId && n.type?.startsWith('ORDER_')) {
      navigate('/orders');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading && notifications.length === 0) {
    return <Loading fullPage message="Loading notifications..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(99,102,241,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <Bell size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Notifications</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAllRead}
            >
              Mark All as Read
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={fetchNotifications}
            title="Refresh notifications"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--border-color)',
            margin: '2rem auto'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99,102,241,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--primary)'
            }}
          >
            <Bell size={30} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No notifications yet
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            We'll notify you here about order status updates and discounts!
          </p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((n) => {
            const typeInfo = TYPE_ICONS[n.type] || TYPE_ICONS.GENERAL;
            const IconComponent = typeInfo.icon;
            return (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: n.read ? 'white' : 'rgba(99, 102, 241, 0.04)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid',
                  borderColor: n.read ? 'var(--border-color)' : 'rgba(99, 102, 241, 0.25)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)',
                  position: 'relative'
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: typeInfo.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconComponent size={20} style={{ color: typeInfo.color }} />
                </div>

                {/* Content */}
                <div
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.35rem'
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        fontWeight: n.read ? 600 : 700,
                        color: 'var(--text-main)'
                      }}
                    >
                      {n.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5
                    }}
                  >
                    {n.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: n.read ? 'var(--bg-subtle)' : 'rgba(99, 102, 241, 0.1)',
                        color: n.read ? 'var(--text-muted)' : 'var(--primary)'
                      }}
                    >
                      {n.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0
                  }}
                >
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      title="Mark as Read"
                    >
                      <Check size={14} /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      color: 'var(--danger)'
                    }}
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
