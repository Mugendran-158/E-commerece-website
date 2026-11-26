import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/admin/AdminNav';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    originalPrice: '',
    discountPrice: '',
    stockQuantity: '',
    imageUrl: '',
    description: '',
    rating: '4.8',
    isFeatured: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prod, cats] = await Promise.all([
          productService.getProductById(id),
          categoryService.getCategories()
        ]);
        setCategories(cats || []);
        setFormData({
          name: prod.name || '',
          category: prod.category || (cats && cats[0]?.name) || 'Electronics',
          originalPrice: prod.originalPrice || prod.price || '',
          discountPrice: prod.discountPrice || '',
          stockQuantity: prod.stockQuantity || 0,
          imageUrl: prod.imageUrl || '',
          description: prod.description || '',
          rating: prod.rating ? String(prod.rating) : '4.8',
          isFeatured: Boolean(prod.isFeatured)
        });
      } catch (err) {
        addToast('Failed to load product details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        category: formData.category,
        originalPrice: parseFloat(formData.originalPrice),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl,
        description: formData.description,
        rating: formData.rating ? parseFloat(formData.rating) : 4.8,
        isFeatured: formData.isFeatured
      };

      await productService.updateProduct(id, payload);
      addToast(`Updated "${formData.name}" successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      addToast(err.message || 'Failed to update product', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullPage message="Loading product data..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Edit Product #{id}</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Update specifications, pricing, stock, or promotional state
        </p>
      </div>

      <AdminNav />

      <div className="card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              required
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                {categories.length === 0 && (
                  <>
                    <option value="Electronics">Electronics</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Home">Home</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                name="stockQuantity"
                className="form-control"
                value={formData.stockQuantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Original Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                name="originalPrice"
                className="form-control"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="discountPrice"
                className="form-control"
                value={formData.discountPrice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-control"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {formData.imageUrl && (
              <div style={{ marginTop: '0.75rem', width: '120px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="4"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Feature this product on homepage</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
            <Button type="submit" variant="primary" loading={saving} icon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
