import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Package,
  Layers,
  ChevronDown,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            gap: '1rem'
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: 800,
              fontSize: '1.45rem',
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <ShoppingBag size={22} />
            </div>
            <span>ShopEase</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.5rem',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
            className="desktop-nav"
          >
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              })}
            >
              Products
            </NavLink>
            <NavLink
              to="/categories"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              })}
            >
              Categories
            </NavLink>
          </nav>

          {/* Search bar on desktop */}
          <div className="desktop-search" style={{ display: 'none', flex: 1, maxWidth: '420px', margin: '0 1rem' }}>
            <SearchBar />
          </div>

          {/* Right side actions: Cart, User menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Wishlist Icon with count */}
            <Link
              to="/wishlist"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                transition: 'var(--transition)'
              }}
              title="My Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                  }}
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Cart Icon with count */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                transition: 'var(--transition)'
              }}
              title="View Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                  }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Profile or Login/Register */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-main)'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}
                  >
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.firstName || 'Account'}
                  </span>
                  <ChevronDown size={16} color="var(--text-muted)" />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '210px',
                      backgroundColor: 'white',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      zIndex: 110
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                        {user?.email}
                      </div>
                      {isAdmin && (
                        <span className="badge badge-primary" style={{ marginTop: '0.4rem' }}>
                          Admin
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '0.4rem 0' }}>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-main)'
                        }}
                      >
                        <UserIcon size={16} /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-main)'
                        }}
                      >
                        <Package size={16} /> My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-main)'
                        }}
                      >
                        <Heart size={16} color="#ef4444" /> My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.55rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            backgroundColor: 'var(--primary-light)'
                          }}
                        >
                          <ShieldCheck size={16} /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--danger)',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger toggle */}
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                color: 'var(--text-main)'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 0 1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <SearchBar onSearch={() => setMobileMenuOpen(false)} />
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', fontWeight: 600 }}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', fontWeight: 600 }}
              >
                Products
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', fontWeight: 600 }}
              >
                Categories
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={16} color="#ef4444" /> Wishlist
                </span>
                {wishlistCount > 0 && <span className="badge badge-primary">{wishlistCount}</span>}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-search {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
