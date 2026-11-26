import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '1rem',
          color: 'var(--text-muted)'
        }}
      >
        <Loader2
          size={42}
          color="var(--primary)"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <p style={{ fontWeight: 500, fontSize: '1rem' }}>{message}</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '0.75rem',
        color: 'var(--text-muted)'
      }}
    >
      <Loader2
        size={24}
        color="var(--primary)"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <span>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
