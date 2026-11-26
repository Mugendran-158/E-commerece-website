import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, CheckCircle2, Tag, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import Button from '../components/common/Button';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState(null); // {valid, code, discountAmount, finalAmount, message}

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await couponService.applyCoupon(couponInput.trim(), grandTotal);
      setCouponResult(result);
      if (result.valid) {
        addToast(`Coupon "${result.code}" applied! You save $${parseFloat(result.discountAmount).toFixed(2)}`, 'success');
      } else {
        addToast(result.message || 'Invalid coupon', 'error');
      }
    } catch (err) {
      addToast('Failed to validate coupon', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponInput('');
  };

  const effectiveTotal = couponResult?.valid ? parseFloat(couponResult.finalAmount) : grandTotal;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'CASH_ON_DELIVERY'
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // If cart is empty, redirect to cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, address, city, state, pincode } = formData;
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !pincode) {
      addToast('Please complete all customer and shipping fields', 'warning');
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        totalAmount: effectiveTotal,
        shippingAddress: address,
        city,
        state,
        pincode,
        phone,
        paymentMethod: formData.paymentMethod,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.imageUrl,
          unitPrice: i.product.discountPrice || i.product.originalPrice,
          quantity: i.quantity,
          subtotal: (i.product.discountPrice || i.product.originalPrice) * i.quantity
        })),
        couponCode: couponResult?.valid ? couponResult.code : null
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate(`/order-success/${createdOrder.id || createdOrder.orderNumber}`, {
        state: { order: createdOrder }
      });
    } catch (err) {
      console.error('Failed to place order:', err);
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <Link
        to="/cart"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Checkout</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Please verify your delivery address and complete your order.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '3rem',
            alignItems: 'start'
          }}
          className="checkout-layout"
        >
          {/* Form inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Customer Information */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '2rem'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                1. Customer Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '2rem'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                2. Shipping Address
              </h2>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    placeholder="New York"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    placeholder="NY"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode / ZIP *</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    placeholder="10001"
                    className="form-control"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '2rem'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                3. Payment Option
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Cash on Delivery (Active) */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={handleChange}
                  />
                  <Banknote size={24} color="var(--primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Cash on Delivery (COD)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pay with cash or digital UPI upon doorstep parcel delivery
                    </div>
                  </div>
                  <span className="badge badge-success">Recommended</span>
                </label>

                {/* Card / Online (Extensible for Stripe/Razorpay) */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }}
                >
                  <input type="radio" disabled name="paymentMethod" />
                  <CreditCard size={24} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Credit / Debit Cards</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Visa, MasterCard, Amex, Apple Pay
                    </div>
                  </div>
                  <span className="badge badge-warning">Coming Soon</span>
                </label>
              </div>
            </div>
          </div>

          {/* Checkout Order Summary */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              position: 'sticky',
              top: '90px'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Order Review
            </h3>

            {/* List of checkout items */}
            <div
              style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                paddingRight: '0.25rem'
              }}
            >
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} &times; ${((item.product.discountPrice || item.product.originalPrice)).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    ${((item.product.discountPrice || item.product.originalPrice) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div style={{ marginBottom: '1rem' }}>
              {couponResult?.valid ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  backgroundColor: 'var(--success-light, #ecfdf5)', border: '1px solid var(--success, #10b981)',
                  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem'
                }}>
                  <Check size={16} style={{ color: 'var(--success, #10b981)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, color: 'var(--success, #10b981)' }}>{couponResult.code}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      –${parseFloat(couponResult.discountAmount).toFixed(2)} off
                    </span>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="coupon-input"
                      type="text"
                      className="form-control"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    style={{
                      padding: '0 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--primary)', color: 'var(--primary)',
                      background: 'transparent', fontWeight: 600, fontSize: '0.85rem',
                      cursor: 'pointer', whiteSpace: 'nowrap', opacity: couponLoading ? 0.6 : 1
                    }}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ fontWeight: 600 }}>
                  {shippingFee === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              {couponResult?.valid && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--success, #10b981)' }}>Coupon Discount ({couponResult.code})</span>
                  <span style={{ fontWeight: 600, color: 'var(--success, #10b981)' }}>–${parseFloat(couponResult.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '0.5rem',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 800
                }}
              >
                <span>Total Due</span>
                <span style={{ color: 'var(--primary)' }}>${effectiveTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={CheckCircle2}
              style={{ marginTop: '1.5rem' }}
            >
              Place Order (${effectiveTotal.toFixed(2)})
            </Button>

            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              By placing your order, you agree to ShopEase's Terms of Sale and Delivery Policy.
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
