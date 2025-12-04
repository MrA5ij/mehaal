(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  const rgba = (rgb, alpha) => `rgba(${rgb}, ${alpha})`;

  const waveBlueprints = [
    {
      rgb: '168, 85, 255',
      alpha: 0.9,
      glowAlpha: 0.95,
      amplitude: 46,
      wavelength: 1.5,
      speed: 0.34,
      noise: 0.24,
      lineWidth: 2.4,
      particleColor: { rgb: '192, 132, 252', alpha: 0.9 },
      particleSpacing: 85,
      verticalShift: -0.02,
      resolution: 5,
      direction: -1,
      origin: 1.08,
      pathScale: 1.15,
      tilt: -0.08,
      depth: 0.15
    },
    {
      rgb: '147, 51, 234',
      alpha: 0.65,
      glowAlpha: 0.75,
      amplitude: 70,
      wavelength: 2.1,
      speed: 0.24,
      noise: 0.4,
      lineWidth: 3.1,
      particleColor: { rgb: '147, 51, 234', alpha: 0.5 },
      particleSpacing: 110,
      verticalShift: 0,
      resolution: 7,
      direction: -1,
      origin: 1.02,
      pathScale: 1.32,
      tilt: -0.06,
      depth: 0.4
    },
    {
      rgb: '140, 120, 255',
      alpha: 0.4,
      glowAlpha: 0.45,
      amplitude: 90,
      wavelength: 3.2,
      speed: 0.16,
      noise: 0.45,
      lineWidth: 2.2,
      particleColor: { rgb: '160, 148, 255', alpha: 0.3 },
      particleSpacing: 150,
      verticalShift: 0.05,
      resolution: 9,
      direction: -1,
      origin: 0.95,
      pathScale: 1.45,
      tilt: -0.04,
      depth: 0.7
    }
  ];

  const waves = waveBlueprints.map((wave, index) => ({
    ...wave,
    phase: Math.random() * Math.PI * 2,
    timeOffset: index * 0.6
  }));

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGlowBand(elapsed) {
    ctx.save();
    const bandHeight = height * 0.3;
    const gradient = ctx.createLinearGradient(width * 0.3, height * 0.5 - bandHeight / 2, width, height * 0.5 + bandHeight / 2);
    gradient.addColorStop(0, 'rgba(10, 0, 25, 0)');
    gradient.addColorStop(0.35, 'rgba(90, 24, 150, 0.25)');
    gradient.addColorStop(0.65, 'rgba(168, 85, 255, 0.5)');
    gradient.addColorStop(0.9, 'rgba(120, 45, 200, 0.25)');
    gradient.addColorStop(1, 'rgba(10, 0, 25, 0)');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.6;
    const offset = Math.sin(elapsed * 0.2) * 15;
    ctx.fillRect(0, height * 0.45 + offset, width, bandHeight);
    ctx.restore();
  }

  function drawWave(wave, elapsed) {
    const t = (elapsed + wave.timeOffset) * wave.speed;
    const scale = width < 768 ? 0.55 : width < 1200 ? 0.82 : 1;
    const baseline = height * (0.52 + wave.verticalShift * (width < 768 ? 1.3 : 1));
    const amplitude = wave.amplitude * scale * (1 + (1 - wave.depth) * 0.2);
    const pathWidth = Math.max(width, 800) * wave.pathScale;
    const startX = width * wave.origin;

    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= pathWidth; i += wave.resolution) {
      const normalized = i / pathWidth;
      const xWorld = startX + i * wave.direction;
      const progress = normalized * Math.PI * 2 * wave.wavelength;
      const sine = Math.sin(progress + t + wave.phase);
      const noise = Math.sin(progress * 2.3 + elapsed * 0.6 + wave.phase) * wave.noise;
      const offset = Math.sin(progress * 0.7 + elapsed * 0.4) * wave.noise * 18;
      const tilt = (normalized - 0.5) * wave.tilt * height;
      const y = baseline + tilt + sine * amplitude + noise * amplitude * 0.65 + offset;

      if (i === 0) {
        ctx.moveTo(xWorld, y);
      } else {
        ctx.lineTo(xWorld, y);
      }
    }

    const gradient = ctx.createLinearGradient(width * 0.2, baseline, width * 1.05, baseline);
    gradient.addColorStop(0, rgba(wave.rgb, 0));
    gradient.addColorStop(0.35, rgba(wave.rgb, wave.alpha * 0.25));
    gradient.addColorStop(0.65, rgba(wave.rgb, wave.alpha));
    gradient.addColorStop(1, rgba(wave.rgb, 0));

    ctx.strokeStyle = gradient;
    ctx.lineWidth = wave.lineWidth * (1 + (1 - wave.depth) * 0.35);
    ctx.lineCap = 'round';
    ctx.shadowColor = rgba(wave.rgb, wave.glowAlpha);
    ctx.shadowBlur = 50 * (1 - wave.depth * 0.5);
    ctx.globalAlpha = 0.35 + (1 - wave.depth) * 0.35;
    ctx.stroke();
    ctx.restore();

    drawParticles(wave, elapsed, baseline, amplitude, startX, pathWidth);
  }

  function drawParticles(wave, elapsed, baseline, amplitude, startX, pathWidth) {
    const spacing = wave.particleSpacing * (width < 768 ? 0.7 : 1);
    for (let i = 0; i <= pathWidth; i += spacing) {
      const normalized = i / pathWidth;
      const xWorld = startX + i * wave.direction;
      const progress = normalized * Math.PI * 2 * wave.wavelength;
      const sine = Math.sin(progress + elapsed * wave.speed + wave.phase);
      const noise = Math.sin(progress * 1.9 + elapsed * 0.45) * wave.noise;
      const tilt = (normalized - 0.5) * wave.tilt * height;
      const y = baseline + tilt + sine * amplitude * 0.55 + noise * amplitude * 0.4;
      const depthFade = Math.max(0.15, 1 - normalized * 0.9) * (1 - wave.depth * 0.6);
      const radius = 1 + depthFade * 2 + Math.sin(elapsed * 0.8 + i * 0.01) * 0.4;
      const dynamicAlpha = Math.max(0, Math.min(1, wave.particleColor.alpha * (0.6 + depthFade * 0.8)));

      ctx.beginPath();
      ctx.fillStyle = `rgba(${wave.particleColor.rgb}, ${dynamicAlpha.toFixed(3)})`;
      ctx.shadowColor = rgba(wave.rgb, wave.glowAlpha);
      ctx.shadowBlur = 25 * depthFade;
      ctx.arc(xWorld, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render(timestamp) {
    const elapsedSeconds = timestamp / 1000;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    drawGlowBand(elapsedSeconds);
    ctx.globalCompositeOperation = 'lighter';
    waves.forEach((wave) => drawWave(wave, elapsedSeconds));
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(render);
})();
