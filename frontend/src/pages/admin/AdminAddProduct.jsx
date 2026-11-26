import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/admin/AdminNav';
import Button from '../../components/common/Button';

const AdminAddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setFormData((prev) => ({ ...prev, category: cats[0].name }));
        } else {
          setFormData((prev) => ({ ...prev, category: 'Electronics' }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setFormData((prev) => ({ ...prev, category: 'Electronics' }));
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.originalPrice || !formData.stockQuantity) {
      addToast('Please fill in required fields: Product Name, Price, and Stock', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        category: formData.category || 'Electronics',
        originalPrice: parseFloat(formData.originalPrice),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        description: formData.description,
        isFeatured: formData.isFeatured,
        rating: formData.rating ? parseFloat(formData.rating) : 4.8
      };

      await productService.createProduct(payload);
      addToast(`Product "${formData.name}" saved successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      addToast(err.message || 'Failed to add product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Add New Product</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Create a new item in your store's inventory catalogue
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
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
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
                placeholder="e.g. 50"
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
                placeholder="399.99"
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
                placeholder="329.99"
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
                placeholder="4.8"
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
              placeholder="https://images.unsplash.com/..."
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
              placeholder="Detailed description of features, materials, and specifications..."
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
            <Button type="submit" variant="primary" loading={loading} icon={PlusCircle}>
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
