import React, { useState, useEffect, useCallback } from 'react';
import { Star, Edit2, Trash2, Send, X, Check } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/* ─────────────────────────────────────────
   Star Rating — interactive picker
───────────────────────────────────────── */
const StarRating = ({ value, onChange, readonly = false, size = 22 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hovered || value) ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.15s ease',
            lineHeight: 1
          }}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            fill={star <= (hovered || value) ? '#f59e0b' : 'none'}
            color={star <= (hovered || value) ? '#f59e0b' : '#d1d5db'}
          />
        </button>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   Format date helper
───────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/* ─────────────────────────────────────────
   Star display (read-only avg bar)
───────────────────────────────────────── */
const StarDisplay = ({ rating, size = 16 }) => (
  <div style={{ display: 'flex', gap: '1px' }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
        color={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────
   Write / Edit Review Form
───────────────────────────────────────── */
const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }) => {
  const { addToast } = useToast();
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 0);
  const [comment, setComment] = useState(existingReview ? existingReview.comment : '');
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(existingReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      addToast('Please select a rating between 1 and 5 stars.', 'error');
      return;
    }
    if (!comment.trim()) {
      addToast('Please write a comment.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (isEdit) {
        result = await reviewService.updateReview(existingReview.id, { rating, comment });
        addToast('Your review has been updated!', 'success');
      } else {
        result = await reviewService.createReview(productId, { rating, comment });
        addToast('Your review has been submitted!', 'success');
      }
      onSuccess(result);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review. Please try again.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}
    >
      <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>
        {isEdit ? 'Edit Your Review' : 'Write a Review'}
      </h4>

      {/* Rating picker */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Rating <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <StarRating value={rating} onChange={setRating} size={28} />
        {rating > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][rating]}
          </span>
        )}
      </div>

      {/* Comment */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Comment <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            resize: 'vertical',
            fontFamily: 'inherit',
            backgroundColor: 'white',
            color: 'var(--text-main)',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          maxLength={2000}
        />
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {comment.length} / 2000
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Send size={14} />
          {submitting ? 'Submitting…' : isEdit ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>
    </form>
  );
};

/* ─────────────────────────────────────────
   Single Review Card
───────────────────────────────────────── */
const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const isOwner = currentUserId && review.userId === currentUserId;

  return (
    <div
      style={{
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'white',
        transition: 'box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
            {review.userName}
          </div>
          <StarDisplay rating={review.rating} size={15} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {formatDate(review.createdAt)}
          </span>
          {isOwner && (
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => onEdit(review)}
                title="Edit review"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--primary)',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <Edit2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(review)}
                title="Delete review"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--danger)',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.7, margin: 0 }}>
        {review.comment}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────
   Delete confirmation dialog
───────────────────────────────────────── */
const DeleteConfirmDialog = ({ review, onConfirm, onCancel, deleting }) => (
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
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}
    >
      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Delete Review</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Are you sure you want to delete your review? This action cannot be undone.
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
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Rating summary bar
───────────────────────────────────────── */
const RatingSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length
  }));

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}
    >
      {/* Big average */}
      <div style={{ textAlign: 'center', minWidth: '90px' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-main)' }}>
          {rounded.toFixed(1)}
        </div>
        <StarDisplay rating={rounded} size={18} />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {counts.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>
                {star}★
              </span>
              <div
                style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '20px' }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main ProductReviews component
───────────────────────────────────────── */
const ProductReviews = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState({ hasPurchased: false, hasReviewed: false });
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // Load reviews + status
  const loadData = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const [reviewData, statusData] = await Promise.all([
        reviewService.getReviewsByProduct(productId),
        isAuthenticated ? reviewService.getReviewStatus(productId) : Promise.resolve({ hasPurchased: false, hasReviewed: false })
      ]);
      setReviews(reviewData);
      setStatus(statusData);
    } catch {
      // silently handle
    } finally {
      setLoadingReviews(false);
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // After create review success
  const handleCreateSuccess = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setStatus((s) => ({ ...s, hasReviewed: true }));
    setShowForm(false);
  };

  // After edit review success
  const handleEditSuccess = (updatedReview) => {
    setReviews((prev) => prev.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
    setEditingReview(null);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingReview) return;
    setDeleteInProgress(true);
    try {
      await reviewService.deleteReview(deletingReview.id);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      setStatus((s) => ({ ...s, hasReviewed: false }));
      setDeletingReview(null);
      addToast('Review deleted successfully.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete review.';
      addToast(msg, 'error');
    } finally {
      setDeleteInProgress(false);
    }
  };

  return (
    <section id="product-reviews" style={{ marginTop: '4rem' }}>
      {/* Delete confirm modal */}
      {deletingReview && (
        <DeleteConfirmDialog
          review={deletingReview}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingReview(null)}
          deleting={deleteInProgress}
        />
      )}

      {/* Section header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Customer Reviews
          {reviews.length > 0 && (
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* Write review button */}
        {isAuthenticated && status.hasPurchased && !status.hasReviewed && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Star size={15} /> Write a Review
          </button>
        )}
      </div>

      {/* Rating summary */}
      {reviews.length > 0 && <RatingSummary reviews={reviews} />}

      {/* Write review form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit review form */}
      {editingReview && (
        <ReviewForm
          productId={productId}
          existingReview={editingReview}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingReview(null)}
        />
      )}

      {/* Prompt for unauthenticated users */}
      {!isAuthenticated && (
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}
        >
          <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</a> to write a review.
        </div>
      )}

      {/* Authenticated but has not purchased */}
      {isAuthenticated && !status.hasPurchased && !status.hasReviewed && (
        <div
          style={{
            padding: '1.25rem',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#92400e'
          }}
        >
          ⚠️ You can write a review only after purchasing this product.
        </div>
      )}

      {/* Loading state */}
      {loadingReviews && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Loading reviews…
        </div>
      )}

      {/* Reviews list */}
      {!loadingReviews && reviews.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Star size={32} color="#d1d5db" style={{ marginBottom: '0.75rem' }} />
          <p style={{ margin: 0 }}>No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserId={user?.id}
            onEdit={(r) => {
              setShowForm(false);
              setEditingReview(r);
            }}
            onDelete={(r) => setDeletingReview(r)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
