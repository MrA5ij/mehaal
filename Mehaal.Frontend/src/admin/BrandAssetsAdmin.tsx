import React, { useState, useEffect } from 'react';
import './admin.css';

interface BrandAsset {
  id: number;
  asset_key: string;
  file_path: string;
  asset_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function BrandAssetsAdmin() {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const API_BASE = 'http://localhost:8000';
  const UPLOAD_DIR = '/uploads/brand';

  // Fetch assets
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/cms/admin/brand-assets`);
      if (!response.ok) throw new Error('Failed to fetch brand assets');
      const data = await response.json();
      setAssets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploadingAsset) return;

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);

      // First, upload file to backend
      const uploadResponse = await fetch(`${API_BASE}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file');
      
      const uploadedFile = await uploadResponse.json();
      const filePath = uploadedFile.file_url || `${UPLOAD_DIR}/${file.name}`;

      // Then save brand asset record
      const assetResponse = await fetch(`${API_BASE}/cms/admin/brand-assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_key: uploadingAsset,
          file_path: filePath,
          asset_type: file.type.split('/')[0] || 'file',
          description: `${uploadingAsset} brand asset`,
        }),
      });

      if (!assetResponse.ok) throw new Error('Failed to save brand asset');

      await fetchAssets();
      setUploadingAsset(null);
      setFile(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDeleteAsset = async (assetKey: string) => {
    if (!confirm('Are you sure you want to delete this brand asset?')) return;
    try {
      const response = await fetch(`${API_BASE}/cms/admin/brand-assets/${assetKey}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete brand asset');
      await fetchAssets();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading) return <div className="admin-content"><p>Loading brand assets...</p></div>;

  const brandAssetKeys = ['logo', 'favicon', 'og_image', 'banner', 'placeholder'];

  return (
    <div className="admin-content">
      <div className="content-header">
        <h2>Brand Assets</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="brand-assets-grid">
        {brandAssetKeys.map((key) => {
          const asset = assets.find((a) => a.asset_key === key);
          return (
            <div key={key} className="asset-card">
              <div className="asset-preview">
                {asset ? (
                  asset.asset_type === 'image' ? (
                    <img src={asset.file_path} alt={key} />
                  ) : (
                    <div className="file-placeholder">📄</div>
                  )
                ) : (
                  <div className="file-placeholder empty">Empty</div>
                )}
              </div>
              <div className="asset-info">
                <h3>{key}</h3>
                {asset && (
                  <>
                    <p className="asset-path">{asset.file_path}</p>
                    <p className="asset-date">
                      Updated: {new Date(asset.updated_at).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
              <div className="asset-actions">
                {uploadingAsset === key ? (
                  <form onSubmit={handleUploadFile} className="upload-form">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                    />
                    <button type="submit" className="btn btn-sm btn-success">
                      Upload
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setUploadingAsset(null);
                        setFile(null);
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setUploadingAsset(key)}
                    >
                      {asset ? 'Change' : 'Upload'}
                    </button>
                    {asset && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteAsset(key)}
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
