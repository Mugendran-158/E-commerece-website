import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag, Plus, Edit2, Trash2, AlertTriangle, ChevronLeft,
  Check, X, ToggleLeft, ToggleRight, Search
} from 'lucide-react';
import { couponService } from '../../services/couponService';

const DISCOUNT_TYPE_LABEL = { PERCENTAGE: 'Percentage', FLAT: 'Flat Amount', FIXED: 'Fixed Amount' };

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const defaultForm = {
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  validFrom: '',
  validUntil: '',
  maxUses: '',
  active: true
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAllCoupons();
      setCoupons(data);
    } catch { } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (c) => {
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: c.discountValue?.toString() || '',
      minOrderAmount: c.minOrderAmount?.toString() || '',
      maxDiscountAmount: c.maxDiscountAmount?.toString() || '',
      validFrom: c.validFrom ? c.validFrom.substring(0, 16) : '',
      validUntil: c.validUntil ? c.validUntil.substring(0, 16) : '',
      maxUses: c.maxUses?.toString() || '',
      active: c.active
    });
    setEditingId(c.id);
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : null,
        validFrom: form.validFrom ? form.validFrom + ':00' : null,
        validUntil: form.validUntil ? form.validUntil + ':00' : null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        active: form.active
      };
      if (editingId) {
        await couponService.updateCoupon(editingId, payload);
      } else {
        await couponService.createCoupon(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await couponService.deleteCoupon(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const now = new Date();

  const getStatus = (c) => {
    if (!c.active) return { label: 'Inactive', color: '#94a3b8' };
    if (new Date(c.validUntil) < now) return { label: 'Expired', color: '#ef4444' };
    if (new Date(c.validFrom) > now) return { label: 'Upcoming', color: '#f59e0b' };
    if (c.maxUses && c.usedCount >= c.maxUses) return { label: 'Used Up', color: '#ef4444' };
    return { label: 'Active', color: '#10b981' };
  };

  return (
    <div className="admin-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin" style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <ChevronLeft size={20} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Coupon Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Create and manage discount coupons
          </p>
        </div>
        <button
          id="create-coupon-btn"
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)',
            background: 'var(--primary)', color: 'white', border: 'none',
            fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
          }}
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '320px' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Search coupons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.25rem' }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{
          backgroundColor: 'white', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)', overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                {['Code', 'Type', 'Discount', 'Min Order', 'Valid Until', 'Uses', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No coupons found.</td></tr>
              ) : filtered.map(c => {
                const status = getStatus(c);
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{c.code}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{DISCOUNT_TYPE_LABEL[c.discountType]}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                      {c.maxDiscountAmount && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>(max ₹{c.maxDiscountAmount})</span>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{c.minOrderAmount ? `₹${c.minOrderAmount}` : '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{formatDate(c.validUntil)}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                      {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px',
                        borderRadius: '999px', backgroundColor: status.color + '18', color: status.color
                      }}>{status.label}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }} title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '580px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={18} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                  {editingId ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Coupon Code *</label>
                  <input type="text" className="form-control" required
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE20"
                    disabled={!!editingId}
                    style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <input type="text" className="form-control"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. 20% off on all products"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Type *</label>
                  <select className="form-control" required
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Discount Value * {form.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}
                  </label>
                  <input type="number" className="form-control" required min="0.01" step="0.01"
                    max={form.discountType === 'PERCENTAGE' ? 100 : undefined}
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === 'PERCENTAGE' ? '20' : '100'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min Order Amount (₹)</label>
                  <input type="number" className="form-control" min="0" step="0.01"
                    value={form.minOrderAmount}
                    onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                {form.discountType === 'PERCENTAGE' && (
                  <div className="form-group">
                    <label className="form-label">Max Discount Cap (₹)</label>
                    <input type="number" className="form-control" min="0" step="0.01"
                      value={form.maxDiscountAmount}
                      onChange={e => setForm({ ...form, maxDiscountAmount: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Valid From *</label>
                  <input type="datetime-local" className="form-control" required
                    value={form.validFrom}
                    onChange={e => setForm({ ...form, validFrom: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valid Until *</label>
                  <input type="datetime-local" className="form-control" required
                    value={form.validUntil}
                    onChange={e => setForm({ ...form, validUntil: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Uses (leave blank = unlimited)</label>
                  <input type="number" className="form-control" min="1"
                    value={form.maxUses}
                    onChange={e => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.75rem' }}>
                  <button type="button"
                    onClick={() => setForm({ ...form, active: !form.active })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: form.active ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                  >
                    {form.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {form.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : (editingId ? 'Update Coupon' : 'Create Coupon')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '420px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              </div>
              <h3 style={{ fontWeight: 700, margin: 0 }}>Delete Coupon</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete coupon <strong>{deleteTarget.code}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleDelete}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
