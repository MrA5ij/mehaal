import React, { useState, useEffect } from 'react';
import { getPlatformSettings } from '../lib/api';

export default function AdminLogoTest() {
  const [platformSettings, setPlatformSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getPlatformSettings();
        setPlatformSettings(settings);
        setLogoUrl(settings.logo?.wordmark || '/assets/logo-wordmark.svg');
        setLoading(false);
      } catch (error) {
        console.error('Failed to load platform settings:', error);
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleLogoChange = async () => {
    const newLogoUrl = prompt('Enter new logo URL:', logoUrl);
    if (newLogoUrl) {
      setLogoUrl(newLogoUrl);
      // In a real scenario, this would send to backend
      // await updatePlatformSettings({ logo: { wordmark: newLogoUrl } })
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Admin - Logo Test</h1>
      
      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #666', borderRadius: '8px' }}>
        <h2>Current Logo</h2>
        <img 
          src={logoUrl} 
          alt="Logo" 
          style={{ maxWidth: '300px', maxHeight: '100px', objectFit: 'contain' }}
          onError={() => setLogoUrl('/assets/logo-wordmark.svg')}
        />
        <br />
        <button 
          onClick={handleLogoChange}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#6666FF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Change Logo
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #666', borderRadius: '8px' }}>
        <h2>Platform Settings (JSON)</h2>
        <pre style={{ 
          background: '#0B0B0F', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(platformSettings, null, 2)}
        </pre>
      </div>
    </div>
  );
}
