import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = ({ initialQuery = '', placeholder = 'Search products, categories...', onSearch, compact = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    } else {
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: compact ? '260px' : '480px'
      }}
    >
      <Search
        size={18}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          left: '0.85rem',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: compact ? '0.45rem 2.2rem 0.45rem 2.4rem' : '0.65rem 2.5rem 0.65rem 2.5rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-subtle)',
          outline: 'none',
          fontSize: '0.9rem',
          transition: 'var(--transition)'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.backgroundColor = '#ffffff';
          e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.backgroundColor = 'var(--bg-subtle)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '0.85rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
