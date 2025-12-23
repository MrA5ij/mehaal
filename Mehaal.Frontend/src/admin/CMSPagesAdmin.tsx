import React, { useState, useEffect } from 'react';
import './admin.css';

interface CMSBlock {
  type: string;
  data: Record<string, any>;
}

interface CMSPage {
  id: number;
  slug: string;
  title: string;
  content: {
    blocks: CMSBlock[];
  };
  status: 'draft' | 'published';
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export default function CMSPagesAdmin() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);

  const API_BASE = 'http://localhost:8000';

  // Fetch pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/cms/admin/pages`);
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setPages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (formData: Partial<CMSPage>) => {
    try {
      const response = await fetch(`${API_BASE}/cms/admin/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug,
          title: formData.title,
          content: formData.content || { blocks: [] },
          seo_title: formData.seo_title,
          seo_description: formData.seo_description,
          seo_image: formData.seo_image,
        }),
      });
      if (!response.ok) throw new Error('Failed to create page');
      await fetchPages();
      setShowNewPageForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handlePublishPage = async (slug: string, status: 'published' | 'draft') => {
    try {
      const response = await fetch(`${API_BASE}/cms/admin/pages/${slug}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to publish page');
      await fetchPages();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDeletePage = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const response = await fetch(`${API_BASE}/cms/admin/pages/${slug}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete page');
      await fetchPages();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading) return <div className="admin-content"><p>Loading pages...</p></div>;

  return (
    <div className="admin-content">
      <div className="content-header">
        <h2>CMS Pages</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewPageForm(!showNewPageForm)}
        >
          {showNewPageForm ? '❌ Cancel' : '➕ New Page'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showNewPageForm && <NewPageForm onSubmit={handleCreatePage} />}

      {selectedPage && (
        <PageEditor
          page={selectedPage}
          onClose={() => setSelectedPage(null)}
          onSave={(updated) => {
            // Update page
            setSelectedPage(null);
            fetchPages();
          }}
        />
      )}

      <div className="pages-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>
                  <code>{page.slug}</code>
                </td>
                <td>
                  <span className={`badge badge-${page.status}`}>
                    {page.status}
                  </span>
                </td>
                <td>{new Date(page.updated_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedPage(page)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      handlePublishPage(
                        page.slug,
                        page.status === 'published' ? 'draft' : 'published'
                      )
                    }
                  >
                    {page.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeletePage(page.slug)}
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

interface NewPageFormProps {
  onSubmit: (data: Partial<CMSPage>) => void;
}

function NewPageForm({ onSubmit }: NewPageFormProps) {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    seo_title: '',
    seo_description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Page Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          placeholder="e.g., about-us"
        />
      </div>
      <div className="form-group">
        <label>SEO Title</label>
        <input
          type="text"
          value={formData.seo_title}
          onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>SEO Description</label>
        <textarea
          value={formData.seo_description}
          onChange={(e) =>
            setFormData({ ...formData, seo_description: e.target.value })
          }
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Create Page
      </button>
    </form>
  );
}

interface PageEditorProps {
  page: CMSPage;
  onClose: () => void;
  onSave: (updated: CMSPage) => void;
}

function PageEditor({ page, onClose, onSave }: PageEditorProps) {
  const [content, setContent] = useState(page.content);

  const handleAddBlock = (blockType: string) => {
    const newBlock: CMSBlock = {
      type: blockType,
      data: {},
    };
    setContent({
      blocks: [...content.blocks, newBlock],
    });
  };

  const handleUpdateBlock = (index: number, updatedBlock: CMSBlock) => {
    const blocks = [...content.blocks];
    blocks[index] = updatedBlock;
    setContent({ blocks });
  };

  const handleDeleteBlock = (index: number) => {
    const blocks = content.blocks.filter((_, i) => i !== index);
    setContent({ blocks });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit: {page.title}</h3>
          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="block-editor">
            <div className="blocks-list">
              {content.blocks.map((block, index) => (
                <BlockRenderer
                  key={index}
                  block={block}
                  index={index}
                  onUpdate={handleUpdateBlock}
                  onDelete={handleDeleteBlock}
                />
              ))}
            </div>

            <div className="add-block-menu">
              <p>Add Block:</p>
              {['hero', 'text', 'image', 'gallery', 'call_to_action'].map(
                (blockType) => (
                  <button
                    key={blockType}
                    className="btn btn-sm"
                    onClick={() => handleAddBlock(blockType)}
                  >
                    {blockType}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface BlockRendererProps {
  block: CMSBlock;
  index: number;
  onUpdate: (index: number, block: CMSBlock) => void;
  onDelete: (index: number) => void;
}

function BlockRenderer({ block, index, onUpdate, onDelete }: BlockRendererProps) {
  return (
    <div className="block">
      <div className="block-header">
        <span className="block-type">{block.type}</span>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(index)}
        >
          Delete
        </button>
      </div>
      <div className="block-content">
        <pre>{JSON.stringify(block.data, null, 2)}</pre>
      </div>
    </div>
  );
}
