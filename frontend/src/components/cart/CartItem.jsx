import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const unitPrice = product.discountPrice || product.originalPrice || 0;
  const itemTotal = unitPrice * quantity;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--border-color)',
        gap: '1.25rem'
      }}
    >
      {/* Thumbnail */}
      <Link
        to={`/products/${product.id}`}
        style={{
          width: '90px',
          height: '90px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          flexShrink: 0
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Link>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {product.category}
        </div>
        <Link
          to={`/products/${product.id}`}
          style={{
            fontWeight: 600,
            fontSize: '0.975rem',
            color: 'var(--text-main)',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '0.25rem'
          }}
        >
          {product.name}
        </Link>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          ${unitPrice.toFixed(2)} each
        </div>
      </div>

      {/* Quantity controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'white'
        }}
      >
        <button
          type="button"
          onClick={() => updateQuantity(product.id, quantity - 1)}
          style={{
            padding: '0.4rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)'
          }}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span
          style={{
            padding: '0 0.6rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            minWidth: '28px',
            textAlign: 'center'
          }}
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(product.id, quantity + 1)}
          style={{
            padding: '0.4rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)'
          }}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div
        style={{
          width: '90px',
          textAlign: 'right',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text-main)'
        }}
      >
        ${itemTotal.toFixed(2)}
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => removeFromCart(product.id)}
        style={{
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        title="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
