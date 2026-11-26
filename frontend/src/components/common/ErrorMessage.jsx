import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({
  message = 'An unexpected error occurred. Please try again.',
  onRetry
}) => {
  return (
    <div
      style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: '#fef2f2',
        border: '1px solid #fee2e2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        margin: '2rem auto',
        maxWidth: '500px'
      }}
    >
      <AlertCircle size={36} color="var(--danger)" />
      <div>
        <h4 style={{ color: '#991b1b', marginBottom: '0.25rem' }}>Oops! Something went wrong</h4>
        <p style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
