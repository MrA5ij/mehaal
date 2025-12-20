const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getPlatformSettings() {
  const res = await fetch(`${API_BASE_URL}/api/platform-settings`, { 
    cache: 'no-store' as RequestCache 
  });
  if (!res.ok) throw new Error("Platform settings failed");
  return res.json();
}

export async function getHomePageCMS() {
  const res = await fetch(`${API_BASE_URL}/api/home-page`, { 
    cache: 'no-store' as RequestCache 
  });
  if (!res.ok) throw new Error("Home page CMS failed");
  return res.json();
}

export async function updatePlatformSettings(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/platform-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update platform settings");
  return res.json();
}
