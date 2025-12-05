(() => {
  const settingsPanel = document.getElementById('settingsPanel');
  const toggleBtn = document.getElementById('toggleSettings');
  const closeBtn = document.getElementById('closeSettings');
  const disableBtn = document.getElementById('disableSettings');
  const resetBtn = document.getElementById('resetSettings');
  const saveBtn = document.getElementById('saveSettings');
  const loadBtn = document.getElementById('loadSettings');

  // Logo Controls
  const logoSizeInput = document.getElementById('logoSize');
  const logoPosXInput = document.getElementById('logoPosX');
  const logoPosYInput = document.getElementById('logoPosY');
  const logoRotInput = document.getElementById('logoRotation');
  const logoScaleInput = document.getElementById('logoScale');
  const logoGlowInput = document.getElementById('logoGlow');
  const logoAnimSpeedInput = document.getElementById('logoAnimSpeed');
  const logoAnimToggle = document.getElementById('logoAnimToggle');

  // Headline Controls
  const headlineSizeInput = document.getElementById('headlineSize');
  const headlineColorInput = document.getElementById('headlineColor');
  const headlineAccentInput = document.getElementById('headlineAccent');
  const headlineGlowInput = document.getElementById('headlineGlow');
  const headlineLetterInput = document.getElementById('headlineLetter');
  const headlineWeightInput = document.getElementById('headlineWeight');
  const headlineGradientToggle = document.getElementById('headlineGradient');

  // Video Controls
  const videoSpeedInput = document.getElementById('videoSpeed');
  const videoVolumeInput = document.getElementById('videoVolume');
  const fadeDurationInput = document.getElementById('fadeDuration');
  const fadeOpacityInput = document.getElementById('fadeOpacity');
  const fadeToggle = document.getElementById('fadeToggle');

  // Display Value Elements
  const logoSizeVal = document.getElementById('logoSizeVal');
  const logoPosXVal = document.getElementById('logoPosXVal');
  const logoPosYVal = document.getElementById('logoPosYVal');
  const logoRotVal = document.getElementById('logoRotVal');
  const logoScaleVal = document.getElementById('logoScaleVal');
  const logoGlowVal = document.getElementById('logoGlowVal');
  const logoAnimSpeedVal = document.getElementById('logoAnimSpeedVal');

  const headlineSizeVal = document.getElementById('headlineSizeVal');
  const headlineGlowVal = document.getElementById('headlineGlowVal');
  const headlineLetterVal = document.getElementById('headlineLetterVal');
  const headlineWeightVal = document.getElementById('headlineWeightVal');

  const videoSpeedVal = document.getElementById('videoSpeedVal');
  const videoVolumeVal = document.getElementById('videoVolumeVal');
  const fadeDurationVal = document.getElementById('fadeDurationVal');
  const fadeOpacityVal = document.getElementById('fadeOpacityVal');

  const heroLogo = document.getElementById('heroLogo');
  const heroHeadline = document.getElementById('heroHeadline');
  const bgVideo = document.getElementById('bgVideo');
  const logoContainer = document.querySelector('.logo-container');
  const headlineContainer = document.querySelector('.headline-container');

  let settingsEnabled = true;
  let lastPlaybackRate = 1;

  // Default values
  const defaults = {
    logoSize: 50,
    logoPosX: 0,
    logoPosY: 0,
    logoRot: 0,
    logoScale: 1,
    logoGlow: 25,
    logoAnimSpeed: 7,
    logoAnim: true,
    headlineSize: 4.2,
    headlineColor: '#f4f4ff',
    headlineAccent: '#a855ff',
    headlineGlow: 20,
    headlineLetter: 0.12,
    headlineWeight: 500,
    headlineGradient: true,
    videoSpeed: 1,
    videoVolume: 0,
    fadeDuration: 0.5,
    fadeOpacity: 0.4,
    fadeToggle: true
  };

  // Save settings to localStorage
  function saveSettingsToStorage() {
    const settings = {
      logoSize: logoSizeInput.value,
      logoPosX: logoPosXInput.value,
      logoPosY: logoPosYInput.value,
      logoRot: logoRotInput.value,
      logoScale: logoScaleInput.value,
      logoGlow: logoGlowInput.value,
      logoAnimSpeed: logoAnimSpeedInput.value,
      logoAnim: logoAnimToggle.checked,
      headlineSize: headlineSizeInput.value,
      headlineColor: headlineColorInput.value,
      headlineAccent: headlineAccentInput.value,
      headlineGlow: headlineGlowInput.value,
      headlineLetter: headlineLetterInput.value,
      headlineWeight: headlineWeightInput.value,
      headlineGradient: headlineGradientToggle.checked,
      videoSpeed: videoSpeedInput.value,
      videoVolume: videoVolumeInput.value,
      fadeDuration: fadeDurationInput.value,
      fadeOpacity: fadeOpacityInput.value,
      fadeToggle: fadeToggle.checked
    };
    localStorage.setItem('mehaalSettings', JSON.stringify(settings));
    showNotification('Settings saved!');
  }

  // Load settings from localStorage
  function loadSettingsFromStorage() {
    const saved = localStorage.getItem('mehaalSettings');
    if (!saved) {
      showNotification('No saved settings found');
      return;
    }

    const settings = JSON.parse(saved);

    logoSizeInput.value = settings.logoSize || defaults.logoSize;
    logoPosXInput.value = settings.logoPosX || defaults.logoPosX;
    logoPosYInput.value = settings.logoPosY || defaults.logoPosY;
    logoRotInput.value = settings.logoRot || defaults.logoRot;
    logoScaleInput.value = settings.logoScale || defaults.logoScale;
    logoGlowInput.value = settings.logoGlow || defaults.logoGlow;
    logoAnimSpeedInput.value = settings.logoAnimSpeed || defaults.logoAnimSpeed;
    logoAnimToggle.checked = settings.logoAnim !== undefined ? settings.logoAnim : defaults.logoAnim;

    headlineSizeInput.value = settings.headlineSize || defaults.headlineSize;
    headlineColorInput.value = settings.headlineColor || defaults.headlineColor;
    headlineAccentInput.value = settings.headlineAccent || defaults.headlineAccent;
    headlineGlowInput.value = settings.headlineGlow || defaults.headlineGlow;
    headlineLetterInput.value = settings.headlineLetter || defaults.headlineLetter;
    headlineWeightInput.value = settings.headlineWeight || defaults.headlineWeight;
    headlineGradientToggle.checked = settings.headlineGradient !== undefined ? settings.headlineGradient : defaults.headlineGradient;

    videoSpeedInput.value = settings.videoSpeed || defaults.videoSpeed;
    videoVolumeInput.value = settings.videoVolume || defaults.videoVolume;
    fadeDurationInput.value = settings.fadeDuration || defaults.fadeDuration;
    fadeOpacityInput.value = settings.fadeOpacity || defaults.fadeOpacity;
    fadeToggle.checked = settings.fadeToggle !== undefined ? settings.fadeToggle : defaults.fadeToggle;

    // Trigger all inputs to update display
    logoSizeInput.dispatchEvent(new Event('input'));
    logoPosXInput.dispatchEvent(new Event('input'));
    logoPosYInput.dispatchEvent(new Event('input'));
    logoRotInput.dispatchEvent(new Event('input'));
    logoScaleInput.dispatchEvent(new Event('input'));
    logoGlowInput.dispatchEvent(new Event('input'));
    logoAnimSpeedInput.dispatchEvent(new Event('input'));
    logoAnimToggle.dispatchEvent(new Event('change'));

    headlineSizeInput.dispatchEvent(new Event('input'));
    headlineColorInput.dispatchEvent(new Event('input'));
    headlineAccentInput.dispatchEvent(new Event('input'));
    headlineGlowInput.dispatchEvent(new Event('input'));
    headlineLetterInput.dispatchEvent(new Event('input'));
    headlineWeightInput.dispatchEvent(new Event('input'));
    headlineGradientToggle.dispatchEvent(new Event('change'));

    videoSpeedInput.dispatchEvent(new Event('input'));
    videoVolumeInput.dispatchEvent(new Event('input'));
    fadeDurationInput.dispatchEvent(new Event('input'));
    fadeOpacityInput.dispatchEvent(new Event('input'));
    fadeToggle.dispatchEvent(new Event('change'));

    showNotification('Settings loaded!');
  }

  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 2rem;
      background: rgba(34, 197, 94, 0.9);
      color: #f5f5ff;
      padding: 1rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      z-index: 2000;
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
      animation: fadeInOut 2s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  // Add fade animation to document
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);

  // Toggle settings panel
  toggleBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('open');
  });

  // LOGO CONTROLS
  logoSizeInput.addEventListener('input', (e) => {
    const size = e.target.value;
    logoSizeVal.textContent = size;
    heroLogo.style.width = `min(${size}vw, 600px)`;
  });

  logoPosXInput.addEventListener('input', (e) => {
    const x = e.target.value;
    logoPosXVal.textContent = x;
    updateLogoContainerTransform();
  });

  logoPosYInput.addEventListener('input', (e) => {
    const y = e.target.value;
    logoPosYVal.textContent = y;
    updateLogoContainerTransform();
  });

  logoRotInput.addEventListener('input', (e) => {
    const rot = e.target.value;
    logoRotVal.textContent = rot;
    updateLogoContainerTransform();
  });

  logoScaleInput.addEventListener('input', (e) => {
    const scale = e.target.value;
    logoScaleVal.textContent = scale;
    updateLogoContainerTransform();
  });

  logoGlowInput.addEventListener('input', (e) => {
    const glow = e.target.value;
    logoGlowVal.textContent = glow;
    heroLogo.style.filter = `drop-shadow(0 0 ${glow}px rgba(168, 85, 255, 0.8)) drop-shadow(0 0 ${glow * 2}px rgba(147, 51, 234, 0.35))`;
  });

  logoAnimSpeedInput.addEventListener('input', (e) => {
    const speed = e.target.value;
    logoAnimSpeedVal.textContent = speed;
    if (logoAnimToggle.checked) {
      heroLogo.style.animationDuration = `${speed}s`;
    }
  });

  logoAnimToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      heroLogo.style.animation = `logo-breathe ${logoAnimSpeedInput.value}s ease-in-out infinite`;
    } else {
      heroLogo.style.animation = 'none';
    }
  });

  function updateLogoContainerTransform() {
    const x = logoPosXInput.value;
    const y = logoPosYInput.value;
    const rot = logoRotInput.value;
    const scale = logoScaleInput.value;
    logoContainer.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`;
  }

  // HEADLINE CONTROLS
  headlineSizeInput.addEventListener('input', (e) => {
    const size = e.target.value;
    headlineSizeVal.textContent = size;
    heroHeadline.style.fontSize = `${size}rem`;
  });

  headlineColorInput.addEventListener('input', (e) => {
    updateHeadlineGradient();
  });

  headlineAccentInput.addEventListener('input', (e) => {
    updateHeadlineGradient();
  });

  headlineGlowInput.addEventListener('input', (e) => {
    const glow = e.target.value;
    headlineGlowVal.textContent = glow;
    heroHeadline.style.filter = `drop-shadow(0 0 ${glow}px rgba(168, 85, 255, 0.7))`;
  });

  headlineLetterInput.addEventListener('input', (e) => {
    const letter = e.target.value;
    headlineLetterVal.textContent = letter;
    heroHeadline.style.letterSpacing = `${letter}em`;
  });

  headlineWeightInput.addEventListener('input', (e) => {
    const weight = e.target.value;
    headlineWeightVal.textContent = weight;
    heroHeadline.style.fontWeight = weight;
  });

  headlineGradientToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      updateHeadlineGradient();
    } else {
      const color = headlineColorInput.value;
      heroHeadline.style.background = 'none';
      heroHeadline.style.color = color;
      heroHeadline.style.webkitTextFillColor = 'unset';
    }
  });

  function updateHeadlineGradient() {
    if (headlineGradientToggle.checked) {
      const color1 = headlineColorInput.value;
      const color2 = headlineAccentInput.value;
      heroHeadline.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
      heroHeadline.style.webkitBackgroundClip = 'text';
      heroHeadline.style.webkitTextFillColor = 'transparent';
      heroHeadline.style.backgroundClip = 'text';
    }
  }

  // VIDEO CONTROLS - Smooth playback rate without stuttering
  videoSpeedInput.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    videoSpeedVal.textContent = speed.toFixed(2);
    lastPlaybackRate = speed;
    bgVideo.playbackRate = speed;
  });

  videoVolumeInput.addEventListener('input', (e) => {
    const volume = e.target.value;
    videoVolumeVal.textContent = volume;
    bgVideo.volume = volume / 100;
  });

  fadeDurationInput.addEventListener('input', (e) => {
    const duration = e.target.value;
    fadeDurationVal.textContent = duration;
    document.documentElement.style.setProperty('--fade-duration', `${duration}s`);
  });

  fadeOpacityInput.addEventListener('input', (e) => {
    const opacity = e.target.value;
    fadeOpacityVal.textContent = opacity;
    document.documentElement.style.setProperty('--fade-opacity', opacity);
  });

  fadeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      setupVideoFade();
    } else {
      bgVideo.style.animation = 'none';
      bgVideo.style.opacity = '1';
    }
  });

  // Video fade effect on loop
  function setupVideoFade() {
    const fadeDuration = parseFloat(fadeDurationInput.value);
    const fadeOpacity = parseFloat(fadeOpacityInput.value);

    bgVideo.addEventListener('ended', () => {
      bgVideo.classList.add('fade-out');
      setTimeout(() => {
        bgVideo.classList.remove('fade-out');
        bgVideo.play();
      }, fadeDuration * 1000);
    });

    bgVideo.addEventListener('play', () => {
      bgVideo.classList.remove('fade-out');
    });
  }

  if (fadeToggle.checked) {
    setupVideoFade();
  }

  // Save Button
  saveBtn.addEventListener('click', () => {
    saveSettingsToStorage();
  });

  // Load Button
  loadBtn.addEventListener('click', () => {
    loadSettingsFromStorage();
  });

  // Reset All
  resetBtn.addEventListener('click', () => {
    logoSizeInput.value = defaults.logoSize;
    logoPosXInput.value = defaults.logoPosX;
    logoPosYInput.value = defaults.logoPosY;
    logoRotInput.value = defaults.logoRot;
    logoScaleInput.value = defaults.logoScale;
    logoGlowInput.value = defaults.logoGlow;
    logoAnimSpeedInput.value = defaults.logoAnimSpeed;
    logoAnimToggle.checked = defaults.logoAnim;

    headlineSizeInput.value = defaults.headlineSize;
    headlineColorInput.value = defaults.headlineColor;
    headlineAccentInput.value = defaults.headlineAccent;
    headlineGlowInput.value = defaults.headlineGlow;
    headlineLetterInput.value = defaults.headlineLetter;
    headlineWeightInput.value = defaults.headlineWeight;
    headlineGradientToggle.checked = defaults.headlineGradient;

    videoSpeedInput.value = defaults.videoSpeed;
    videoVolumeInput.value = defaults.videoVolume;
    fadeDurationInput.value = defaults.fadeDuration;
    fadeOpacityInput.value = defaults.fadeOpacity;
    fadeToggle.checked = defaults.fadeToggle;

    // Trigger all inputs to update display
    logoSizeInput.dispatchEvent(new Event('input'));
    logoPosXInput.dispatchEvent(new Event('input'));
    logoPosYInput.dispatchEvent(new Event('input'));
    logoRotInput.dispatchEvent(new Event('input'));
    logoScaleInput.dispatchEvent(new Event('input'));
    logoGlowInput.dispatchEvent(new Event('input'));
    logoAnimSpeedInput.dispatchEvent(new Event('input'));

    headlineSizeInput.dispatchEvent(new Event('input'));
    headlineColorInput.dispatchEvent(new Event('input'));
    headlineAccentInput.dispatchEvent(new Event('input'));
    headlineGlowInput.dispatchEvent(new Event('input'));
    headlineLetterInput.dispatchEvent(new Event('input'));
    headlineWeightInput.dispatchEvent(new Event('input'));
    headlineGradientToggle.dispatchEvent(new Event('change'));

    videoSpeedInput.dispatchEvent(new Event('input'));
    videoVolumeInput.dispatchEvent(new Event('input'));
    fadeDurationInput.dispatchEvent(new Event('input'));
    fadeOpacityInput.dispatchEvent(new Event('input'));

    showNotification('All settings reset');
  });

  // Disable Settings
  disableBtn.addEventListener('click', () => {
    settingsEnabled = false;
    settingsPanel.classList.add('hidden');
    toggleBtn.classList.add('hidden');
    localStorage.setItem('mehaalSettingsDisabled', 'true');
  });

  // Check if settings were previously disabled
  if (localStorage.getItem('mehaalSettingsDisabled') === 'true') {
    settingsPanel.classList.add('hidden');
    toggleBtn.classList.add('hidden');
  }

  // Load saved settings on page load
  const autoLoad = localStorage.getItem('mehaalSettings');
  if (autoLoad) {
    loadSettingsFromStorage();
  }

  // Initialize fade CSS variables
  document.documentElement.style.setProperty('--fade-duration', `${defaults.fadeDuration}s`);
  document.documentElement.style.setProperty('--fade-opacity', defaults.fadeOpacity);
})();
