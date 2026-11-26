import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Navigation,
  ShieldCheck,
  Package,
  ShoppingBag,
  LogOut,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileService } from '../services/profileService';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const UserProfile = () => {
  const { user, isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    role: 'USER'
  });

  // Form values (during edit)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile();
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || ''
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        addToast('Failed to load profile information', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [addToast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditClick = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      pincode: profile.pincode || ''
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      pincode: profile.pincode || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errs.lastName = 'Last name is required';
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneClean = formData.phone.trim();
      if (!/^\+?[0-9]{10,15}$/.test(phoneClean)) {
        errs.phone = 'Phone number must be between 10 and 15 digits';
      }
    }

    if (formData.pincode && formData.pincode.trim()) {
      const pinClean = formData.pincode.trim();
      if (!/^[0-9]{5,6}$/.test(pinClean)) {
        errs.pincode = 'Pincode must be 5 or 6 digits';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please correct the errors in the form', 'error');
      return;
    }

    try {
      setSaving(true);
      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullPage message="Loading your profile..." />;
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '800px' }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-xl)' }}>
        {/* Profile Avatar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800
              }}
            >
              {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                {profile.firstName} {profile.lastName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile.email}</span>
                {profile.role === 'ADMIN' ? (
                  <span className="badge badge-primary">Administrator</span>
                ) : (
                  <span className="badge badge-info">Verified Shopper</span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Edit Form or View Information */}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Edit Profile Information</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Required fields</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}
            >
              {/* First Name */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  First Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
                {errors.firstName && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={13} /> {errors.firstName}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Last Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={13} /> {errors.lastName}
                  </div>
                )}
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Email Address <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 400 }}>(Cannot be changed)</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={13} /> {errors.phone}
                  </div>
                )}
              </div>

              {/* Address */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              {/* City */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                />
              </div>

              {/* State */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  State / Province
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NY"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Pincode / ZIP
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="10001"
                />
                {errors.pincode && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={13} /> {errors.pincode}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Save Changes & Cancel */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <Button
                type="button"
                variant="secondary"
                icon={X}
                onClick={handleCancelClick}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        ) : (
          /* View Profile Details */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Personal Information</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>First Name</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.firstName || '—'}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Last Name</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.lastName || '—'}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem', wordBreak: 'break-all' }}>{profile.email}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Phone Number</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.phone || 'Not provided'}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Address Details</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Street Address</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.address || 'Not provided'}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>City</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.city || 'Not provided'}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>State</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.state || 'Not provided'}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pincode / ZIP</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginTop: '0.2rem' }}>{profile.pincode || 'Not provided'}</div>
                </div>
              </div>
            </div>

            {/* Quick Navigation links */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-color)',
                alignItems: 'center'
              }}
            >
              <Link to="/orders">
                <Button variant="secondary" icon={Package}>
                  My Orders
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="outline" icon={ShoppingBag}>
                  My Wishlist
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="primary" icon={ShieldCheck}>
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="danger" icon={LogOut} onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
