import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const fullWidthClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn btn-${variant} ${sizeClass} ${fullWidthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
