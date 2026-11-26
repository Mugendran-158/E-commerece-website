import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, AlertTriangle, ChevronLeft, Search, RefreshCw } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';

/* ─────────────────────────────────────────
   Star display helper
───────────────────────────────────────── */
const StarDisplay = ({ rating }) => (
  <div style={{ display: 'flex', gap: '1px' }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={14}
        fill={i <= rating ? '#f59e0b' : 'none'}
        color={i <= rating ? '#f59e0b' : '#d1d5db'}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────
   Delete confirm modal
───────────────────────────────────────── */
const DeleteModal = ({ review, onConfirm, onCancel, deleting }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}
  >
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <AlertTriangle size={22} color="var(--danger)" />
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Delete Review</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
        Are you sure you want to delete the review by <strong>{review.userName}</strong> for{' '}
        <strong>{review.productName}</strong>?
      </p>
      <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm" disabled={deleting}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={deleting}
          style={{
            padding: '0.4rem 1rem',
            background: 'var(--danger)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Trash2 size={14} />
          {deleting ? 'Deleting…' : 'Delete Review'}
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   AdminReviews Page
───────────────────────────────────────── */
const AdminReviews = () => {
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingReview, setDeletingReview] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
      setFiltered(data);
    } catch (err) {
      addToast('Failed to load reviews.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Client-side search
  useEffect(() => {
    const q = search.toLowerCase();
    if (!q) {
      setFiltered(reviews);
    } else {
      setFiltered(
        reviews.filter(
          (r) =>
            r.userName.toLowerCase().includes(q) ||
            r.productName.toLowerCase().includes(q) ||
            r.comment.toLowerCase().includes(q)
        )
      );
    }
  }, [search, reviews]);

  const handleDeleteConfirm = async () => {
    if (!deletingReview) return;
    setDeleteInProgress(true);
    try {
      await reviewService.adminDeleteReview(deletingReview.id);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      setDeletingReview(null);
      addToast('Review deleted successfully.', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete review.', 'error');
    } finally {
      setDeleteInProgress(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Delete confirm modal */}
      {deletingReview && (
        <DeleteModal
          review={deletingReview}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingReview(null)}
          deleting={deleteInProgress}
        />
      )}

      {/* Back link */}
      <Link
        to="/admin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: '1.5rem'
        }}
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>Review Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {reviews.length} total review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={loadReviews}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '1.5rem' }}>
        <Search
          size={16}
          style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          placeholder="Search by user, product, or comment…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem 0.6rem 2.25rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading reviews…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)'
          }}
        >
          <Star size={32} color="#d1d5db" style={{ marginBottom: '0.75rem' }} />
          <p style={{ margin: 0 }}>No reviews found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-subtle)' }}>
                {['#', 'Customer', 'Product', 'Rating', 'Comment', 'Date', 'Action'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: h === 'Action' ? 'center' : 'left',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((review, idx) => (
                <tr
                  key={review.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    {review.userName}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <Link
                      to={`/products/${review.productId}`}
                      style={{ color: 'var(--primary)', fontWeight: 600 }}
                    >
                      {review.productName}
                    </Link>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <StarDisplay rating={review.rating} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {review.rating} / 5
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', maxWidth: '300px' }}>
                    <p
                      style={{
                        margin: 0,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: 'var(--text-main)',
                        lineHeight: 1.5
                      }}
                      title={review.comment}
                    >
                      {review.comment}
                    </p>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                    {formatDate(review.createdAt)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setDeletingReview(review)}
                      title="Delete review"
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        padding: '0.35rem 0.6rem',
                        color: 'var(--danger)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
