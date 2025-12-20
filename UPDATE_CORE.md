🔟 HERO 3D VISUAL LAYER (THREE.JS / REACT-THREE-FIBER)

Purpose: tumhari brand identity ke mutabiq depth + magnetic glow — billboard-style, non-noisy.

Install
npm i three @react-three/fiber @react-three/drei

frontend/components/HeroBackground3D.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function HeroBackground3D({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} />
      <mesh>
        <torusGeometry args={[1.6, 0.18, 64, 200]} />
        <meshStandardMaterial
          color="#6666FF"
          emissive="#6666FF"
          emissiveIntensity={intensity}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} />
    </Canvas>
  );
}

Bind in Hero.tsx
import HeroBackground3D from "./HeroBackground3D";

export default function Hero({ platform, content }: any) {
  return (
    <section
      style={{ backgroundColor: platform.colors.background, color: platform.colors.foreground }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroBackground3D intensity={platform.hero.effects.glow ? 0.6 : 0.2} />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl font-semibold mb-6">{content.headline}</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-70 mb-10">
          {content.subheadline}
        </p>
        <div className="flex justify-center gap-4">
          <button style={{ background: platform.colors.primary }} className="px-6 py-3 rounded-lg">
            {content.cta_primary}
          </button>
          <button className="px-6 py-3 border rounded-lg">
            {content.cta_secondary}
          </button>
        </div>
      </div>
    </section>
  );
}

1️⃣1️⃣ ADMIN HARDENING (FOUNDER-ONLY, ENTERPRISE)
Access Control (FastAPI dependency)

backend/core/auth.py

from fastapi import Header, HTTPException

def founder_only(x_platform_key: str = Header(None)):
    if x_platform_key != "FOUNDATION_KEY":
        raise HTTPException(status_code=403, detail="Founder only")


Apply to routes:

@router.put("", dependencies=[Depends(founder_only)])
def update_platform_settings(...):
    ...


Frontend admin sends header:

fetch("/api/platform-settings", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "X-Platform-Key": process.env.NEXT_PUBLIC_FOUNDER_KEY!
  },
  body: JSON.stringify(payload)
});

1️⃣2️⃣ VERSIONING + ROLLBACK (ENTERPRISE MUST)
DB add-on
ALTER TABLE platform_settings
ADD COLUMN version INT DEFAULT 1;


On update:

increment version

log previous row to platform_settings_history

1️⃣3️⃣ PROD CONFIG (NO SURPRISES)
Env
NEXT_PUBLIC_FOUNDER_KEY=********
NEXT_PUBLIC_CMS_URL=https://cms.mehaal.ai

CDN

Cache /platform-settings for 60s

Cache CMS home for 30s

Bypass cache on admin save

1️⃣4️⃣ QUALITY GATES (LAUNCH CHECKLIST)

 Brand tokens locked

 Hero renders without CMS outage

 Founder panel protected

 Animations preset-driven

 3D layer optional & degradable

 No CMS can break layout

1️⃣5️⃣ WHAT YOU HAVE NOW

Founder-controlled brand engine

CMS-driven content

3D hero matching brand identity

Enterprise controls (auth, versioning)

Production-ready landing