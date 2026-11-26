import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ShieldCheck, Star, Tag, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.15rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.9rem',
    backgroundColor: isActive ? 'var(--primary)' : 'white',
    color: isActive ? 'white' : 'var(--text-main)',
    border: '1px solid',
    borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap'
  });

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#f8fafc',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
          <ShieldCheck size={22} /> ShopEase Admin Portal
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger)' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}
      >
        <NavLink to="/admin/dashboard" style={linkStyle}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/admin/products" style={linkStyle}>
          <Package size={18} /> Products
        </NavLink>
        <NavLink to="/admin/orders" style={linkStyle}>
          <ShoppingCart size={18} /> Orders
        </NavLink>
        <NavLink to="/admin/users" style={linkStyle}>
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/admin/reviews" style={linkStyle}>
          <Star size={18} /> Reviews
        </NavLink>
        <NavLink to="/admin/coupons" style={linkStyle}>
          <Tag size={18} /> Coupons
        </NavLink>
        <NavLink to="/admin/analytics" style={linkStyle}>
          <BarChart2 size={18} /> Analytics
        </NavLink>
      </div>
    </div>
  );
};

export default AdminNav;
