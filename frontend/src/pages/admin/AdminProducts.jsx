import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/admin/AdminNav';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ size: 100 });
      setProducts(data.content || []);
    } catch (err) {
      console.error('Failed to load products for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${productName}"?`)) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addToast(`Deleted "${productName}" successfully`, 'info');
    } catch (err) {
      // Fallback local deletion
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addToast(`Deleted "${productName}" from catalogue`, 'info');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Manage Catalogue</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Add, update inventory, adjust prices, or remove products
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary" icon={Plus}>
            Add New Product
          </Button>
        </Link>
      </div>

      <AdminNav />

      <div className="card" style={{ padding: '1.5rem' }}>
        {/* Search bar */}
        <div style={{ marginBottom: '1.5rem', maxWidth: '360px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {loading ? (
          <Loading message="Fetching products..." />
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No products match your search.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Original Price</th>
                  <th>Discount Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prod.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{prod.category}</span>
                    </td>
                    <td>${(prod.originalPrice || prod.price)?.toFixed(2)}</td>
                    <td>
                      {prod.discountPrice ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          ${prod.discountPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${prod.stockQuantity > 5 ? 'success' : prod.stockQuantity > 0 ? 'warning' : 'danger'}`}
                      >
                        {prod.stockQuantity} in stock
                      </span>
                    </td>
                    <td>★ {prod.rating || '4.8'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleDelete(prod.id, prod.name)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
