import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, User as UserIcon } from 'lucide-react';
import { adminService } from '../../services/adminService';
import AdminNav from '../../components/admin/AdminNav';
import Loading from '../../components/common/Loading';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error('Failed to load registered users:', err);
        setError(err.message || 'Failed to load user management list');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          View all registered customer accounts and administrator profiles
        </p>
      </div>

      <AdminNav />

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', maxWidth: '360px', position: 'relative' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <Loading message="Loading registered users..." />
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No registered users found matching your search.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>#{u.id}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'ADMIN' ? 'var(--primary-light)' : '#f3f4f6',
                            color: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem'
                          }}
                        >
                          {u.role === 'ADMIN' ? <Shield size={16} /> : <UserIcon size={16} />}
                        </div>
                        {u.firstName} {u.lastName}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role === 'ADMIN' ? 'primary' : 'info'}`}>
                        {u.role}
                      </span>
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

export default AdminUsers;
