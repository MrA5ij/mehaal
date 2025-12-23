import React, { useState, useEffect } from 'react';
import './admin.css';

interface CMSNavItem {
  id: number;
  label: string;
  slug: string;
  position: number;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CMSNavigationAdmin() {
  const [items, setItems] = useState<CMSNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSNavItem | null>(null);

  const API_BASE = 'http://localhost:8000';

  // Fetch navigation items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/cms/admin/navigation`);
      if (!response.ok) throw new Error('Failed to fetch navigation items');
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateItem = async (formData: Partial<CMSNavItem>) => {
    try {
      const response = await fetch(`${API_BASE}/cms/admin/navigation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: formData.label,
          slug: formData.slug,
          position: formData.position || items.length,
          parent_id: formData.parent_id || null,
          is_active: true,
        }),
      });
      if (!response.ok) throw new Error('Failed to create navigation item');
      await fetchItems();
      setShowNewItemForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleUpdateItem = async (id: number, formData: Partial<CMSNavItem>) => {
    try {
      const response = await fetch(`${API_BASE}/cms/admin/navigation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update navigation item');
      await fetchItems();
      setEditingItem(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;
    try {
      const response = await fetch(`${API_BASE}/cms/admin/navigation/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete navigation item');
      await fetchItems();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleToggleActive = async (item: CMSNavItem) => {
    await handleUpdateItem(item.id, { is_active: !item.is_active });
  };

  if (loading) return <div className="admin-content"><p>Loading navigation items...</p></div>;

  return (
    <div className="admin-content">
      <div className="content-header">
        <h2>Navigation Menu</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewItemForm(!showNewItemForm)}
        >
          {showNewItemForm ? '❌ Cancel' : '➕ Add Item'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showNewItemForm && (
        <NavItemForm onSubmit={handleCreateItem} />
      )}

      {editingItem && (
        <NavItemForm
          item={editingItem}
          onSubmit={(data) => {
            handleUpdateItem(editingItem.id, data);
          }}
          onCancel={() => setEditingItem(null)}
        />
      )}

      <div className="nav-items-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Label</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.position}</td>
                <td>{item.label}</td>
                <td>
                  <code>{item.slug}</code>
                </td>
                <td>{item.parent_id || '-'}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={() => handleToggleActive(item)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setEditingItem(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface NavItemFormProps {
  item?: CMSNavItem;
  onSubmit: (data: Partial<CMSNavItem>) => void;
  onCancel?: () => void;
}

function NavItemForm({ item, onSubmit, onCancel }: NavItemFormProps) {
  const [formData, setFormData] = useState<Partial<CMSNavItem>>(
    item || {
      label: '',
      slug: '',
      position: 0,
      parent_id: null,
      is_active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Label</label>
        <input
          type="text"
          value={formData.label || ''}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Position</label>
        <input
          type="number"
          value={formData.position || 0}
          onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
        />
      </div>
      <div className="form-group">
        <label>Parent ID (optional)</label>
        <input
          type="number"
          value={formData.parent_id || ''}
          onChange={(e) =>
            setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })
          }
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.is_active || false}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          Active
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {item ? 'Update' : 'Create'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
