import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Check, CheckCheck, ShoppingBag, Package, Truck, Gift, AlertCircle, Tag, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const TYPE_ICONS = {
  ORDER_PLACED:          { icon: ShoppingBag, color: '#6366f1' },
  ORDER_CONFIRMED:       { icon: Check,       color: '#10b981' },
  ORDER_SHIPPED:         { icon: Package,     color: '#f59e0b' },
  ORDER_OUT_FOR_DELIVERY:{ icon: Truck,       color: '#3b82f6' },
  ORDER_DELIVERED:       { icon: Gift,        color: '#10b981' },
  ORDER_CANCELLED:       { icon: AlertCircle, color: '#ef4444' },
  COUPON_AVAILABLE:      { icon: Tag,         color: '#8b5cf6' },
  GENERAL:               { icon: Info,        color: '#64748b' },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {}
  }, [isAuthenticated]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch {} finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Poll unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Load notifications when panel opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Close panel when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)
          && bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated) return null;

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deleted && !deleted.read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleNotificationClick = (n) => {
    if (!n.read) handleMarkRead(n.id);
    if (n.referenceId && (n.type?.startsWith('ORDER_'))) {
      navigate(`/orders`);
      setOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        id="notification-bell"
        ref={bellRef}
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          transition: 'background 0.2s'
        }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '360px',
            maxHeight: '480px',
            backgroundColor: 'var(--bg-card, white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Notifications</h3>
              {unreadCount > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}
                title="Mark all as read"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                <Bell size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.4 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const typeInfo = TYPE_ICONS[n.type] || TYPE_ICONS.GENERAL;
                const IconComponent = typeInfo.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      backgroundColor: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.04)',
                      transition: 'background 0.15s',
                      position: 'relative'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover, rgba(0,0,0,0.04))'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(99, 102, 241, 0.04)'}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: typeInfo.color + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <IconComponent size={16} style={{ color: typeInfo.color }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: n.read ? 500 : 700,
                        fontSize: '0.85rem',
                        marginBottom: '0.2rem',
                        color: 'var(--text-primary)'
                      }}>{n.title}</div>
                      <div style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.4,
                        marginBottom: '0.25rem'
                      }}>{n.message}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                        {timeAgo(n.createdAt)}
                      </div>
                    </div>

                    {/* Unread dot + Delete */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      {!n.read && (
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          backgroundColor: '#6366f1', flexShrink: 0
                        }} />
                      )}
                      <button
                        onClick={(e) => handleDelete(e, n.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-muted)', padding: '2px', opacity: 0.5,
                          display: 'flex', alignItems: 'center'
                        }}
                        title="Delete notification"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
            backgroundColor: 'var(--bg-subtle)'
          }}>
            <button
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              View All Notifications &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
