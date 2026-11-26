import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import CategoryCard from '../components/category/CategoryCard';
import Loading from '../components/common/Loading';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (e) {
        console.error('Failed to load categories:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) {
    return <Loading fullPage message="Loading collections..." />;
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
          Explore Collections
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Browse All Categories
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Explore premium electronics, stylish apparel, athletic footwear, cosmetic essentials, and designer home decor.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
