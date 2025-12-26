'use client'
import React from 'react';

interface ThemeProps {
  tenant?: {
    primaryColor?: string;
    radius?: string;
  };
  children: React.ReactNode;
}

export function ThemeProvider({ tenant, children }: ThemeProps) {
  // Agar Tenant/Admin ka custom color hai, to default ko override karo
  const styles = tenant?.primaryColor ? {
    '--primary': hexToHsl(tenant.primaryColor),
    '--ring': hexToHsl(tenant.primaryColor),
  } as React.CSSProperties : {};

  return (
    <div style={styles} className="theme-wrapper contents">
      {children}
    </div>
  )
}

// Helper: Hex (#ff0000) to HSL (0 100% 50%) for Tailwind
function hexToHsl(hex: string) {
  let c = hex.substring(1).split('');
  if(c.length=== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const cStr = '0x'+c.join('');
  const r = (parseInt(cStr)>>16)&255;
  const g = (parseInt(cStr)>>8)&255;
  const b = parseInt(cStr)&255;
  
  // Simple conversion logic (simplified for script)
  // In production use a robust library like 'tinycolor2'
  return `${r} ${g}% ${b}%`; // Dummy HSL for illustration, real conversion needs math
}
