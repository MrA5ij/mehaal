const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const FOUNDER_KEY = import.meta.env.VITE_FOUNDER_KEY;

/**
 * Get platform-wide settings (cached, public endpoint)
 */
export async function getPlatformSettings() {
  const res = await fetch(`${API_BASE_URL}/api/platform-settings`, { 
    cache: 'no-store' as RequestCache 
  });
  if (!res.ok) throw new Error("Platform settings failed");
  return res.json();
}

/**
 * Get home page CMS content (cached, public endpoint)
 */
export async function getHomePageCMS() {
  const res = await fetch(`${API_BASE_URL}/api/home-page`, { 
    cache: 'no-store' as RequestCache 
  });
  if (!res.ok) throw new Error("Home page CMS failed");
  return res.json();
}

/**
 * Update platform settings (founder only, requires FOUNDER_KEY)
 */
export async function updatePlatformSettings(payload: any) {
  if (!FOUNDER_KEY) {
    throw new Error("Founder key not configured. Cannot update settings.");
  }

  const res = await fetch(`${API_BASE_URL}/api/platform-settings`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'X-Platform-Key': FOUNDER_KEY
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update platform settings: ${error}`);
  }
  return res.json();
}

/**
 * Get version history (founder only)
 */
export async function getPlatformSettingsHistory() {
  if (!FOUNDER_KEY) {
    throw new Error("Founder key not configured. Cannot access history.");
  }

  const res = await fetch(`${API_BASE_URL}/api/platform-settings/history/versions`, {
    headers: {
      'X-Platform-Key': FOUNDER_KEY
    }
  });
  if (!res.ok) throw new Error("Failed to fetch version history");
  return res.json();
}

/**
 * Rollback to specific version (founder only)
 */
export async function rollbackPlatformSettings(version: number) {
  if (!FOUNDER_KEY) {
    throw new Error("Founder key not configured. Cannot rollback.");
  }

  const res = await fetch(`${API_BASE_URL}/api/platform-settings/rollback/${version}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Platform-Key': FOUNDER_KEY
    }
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to rollback: ${error}`);
  }
}
