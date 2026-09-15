/**
 * Universal Project Media Player — Avataar Visora
 * Intercepts clicks on projects across all pages and plays corresponding video/audio instantly.
 */
(function () {
  'use strict';

  const PROJECT_REGISTRY = {
    'maggie': {
      title: 'Maggie',
      category: 'Ad Film',
      badgeClass: 'av-badge-adfilm',
      type: 'video',
      media: '/assets/projects/maggie.mp4',
      poster: '/assets/projects/maggie.png',
      route: '/projects/maggie'
    },
    'provogue': {
      title: 'Provogue',
      category: 'Ad Film',
      badgeClass: 'av-badge-adfilm',
      type: 'video',
      media: '/assets/projects/provogue.mp4',
      poster: '/assets/projects/provogue.png',
      route: '/projects/provogue'
    },
    'bisleri': {
      title: 'Bisleri',
      category: 'Ad Film',
      badgeClass: 'av-badge-adfilm',
      type: 'video',
      media: '/assets/projects/bisleri.mp4',
      poster: '/assets/projects/bisleri.png',
      route: '/projects/bisleri'
    },
    'nddb': {
      title: 'NDDB',
      category: 'Ad Film',
      badgeClass: 'av-badge-adfilm',
      type: 'video',
      media: '/assets/projects/nddb.mp4',
      poster: '/assets/projects/nddb.png',
      route: '/projects/nddb'
    },
    'btex': {
      title: 'B Tex',
      category: 'Jingle',
      badgeClass: 'av-badge-jingle',
      type: 'audio',
      media: '/assets/projects/b-tex.wav',
      route: '/projects/btex'
    },
    'b-tex': {
      title: 'B Tex',
      category: 'Jingle',
      badgeClass: 'av-badge-jingle',
      type: 'audio',
      media: '/assets/projects/b-tex.wav',
      route: '/projects/btex'
    },
    'comet': {
      title: 'Comet',
      category: 'UGC',
      badgeClass: 'av-badge-ugc',
      type: 'video',
      media: '/assets/projects/comet.mp4',
      poster: '/assets/projects/comet.png',
      route: '/projects/comet'
    },
    'clarion-inn': {
      title: 'Clarion Inn',
      category: 'UGC',
      badgeClass: 'av-badge-ugc',
      type: 'video',
      media: '/assets/projects/clarion-inn.mp4',
      poster: '/assets/projects/clarion-inn.png',
      route: '/projects/clarion-inn'
    },
    'madhuram': {
      title: 'Madhuram',
      category: 'Jingle',
      badgeClass: 'av-badge-jingle',
      type: 'audio',
      media: '/assets/projects/madhuram.wav',
      route: '/projects/madhuram'
    },
    'madhuram-kitchenwares': {
      title: 'Madhuram',
      category: 'Jingle',
      badgeClass: 'av-badge-jingle',
      type: 'audio',
      media: '/assets/projects/madhuram.wav',
      route: '/projects/madhuram'
    },
    'peanutji': {
      title: 'Peanutji',
      category: 'Jingle',
      badgeClass: 'av-badge-jingle',
      type: 'audio',
      media: '/assets/projects/peanutji.mp3',
      route: '/projects/peanutji'
    },
    'laneige': {
      title: 'Laneige',
      category: 'UGC',
      badgeClass: 'av-badge-ugc',
      type: 'video',
      media: '/assets/projects/laneige.mp4',
      poster: '/assets/projects/laneige.png',
      route: '/projects/laneige'
    },
    'glenn': {
      title: 'Glenn',
      category: 'UGC',
      badgeClass: 'av-badge-ugc',
      type: 'video',
      media: '/assets/projects/glenn.mp4',
      poster: '/assets/projects/glenn.png',
      route: '/projects/glenn'
    },
    'glen': {
      title: 'Glenn',
      category: 'UGC',
      badgeClass: 'av-badge-ugc',
      type: 'video',
      media: '/assets/projects/glenn.mp4',
      poster: '/assets/projects/glenn.png',
      route: '/projects/glenn'
    }
  };

  let overlayEl = null;
  let activeMediaEl = null;
  let animId = null;

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function ensureModal() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement('div');
    overlayEl.className = 'av-modal-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.setAttribute('aria-label', 'Project Media Player');

    overlayEl.innerHTML = `
      <div class="av-modal-card">
        <div class="av-modal-header">
          <div class="av-header-meta">
            <span class="av-badge" id="av-badge">AD FILM</span>
            <h2 class="av-title" id="av-title">Project Name</h2>
            <span class="av-year">2026</span>
          </div>
          <button class="av-close-btn" id="av-close" aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="av-modal-body" id="av-body"></div>
        <div class="av-modal-footer">
          <a href="#" class="av-project-route" id="av-route" target="_blank" rel="noopener">Open Dedicated Page ↗</a>
          <span class="av-hint">ESC to close • SPACE to toggle</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);

    // Close events
    overlayEl.querySelector('#av-close').addEventListener('click', closeModal);
    overlayEl.addEventListener('click', function (e) {
      if (e.target === overlayEl) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!overlayEl.classList.contains('av-open')) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
      }
    });

    return overlayEl;
  }

  function closeModal() {
    if (!overlayEl) return;
    overlayEl.classList.remove('av-open');

    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    if (activeMediaEl) {
      try {
        activeMediaEl.pause();
        activeMediaEl.src = '';
      } catch (err) {}
      activeMediaEl = null;
    }

    const bodyEl = overlayEl.querySelector('#av-body');
    if (bodyEl) bodyEl.innerHTML = '';
  }

  function togglePlayPause() {
    if (!activeMediaEl) return;
    if (activeMediaEl.paused) {
      activeMediaEl.play();
    } else {
      activeMediaEl.pause();
    }
  }

  function openProject(slug) {
    const project = PROJECT_REGISTRY[slug];
    if (!project) return;

    // Hide any floating hover thumbnails
    const hoverContainer = document.querySelector('.hover-thumbnail-container');
    if (hoverContainer) hoverContainer.classList.remove('active');

    ensureModal();

    const cardEl = overlayEl.querySelector('.av-modal-card');
    const badgeEl = overlayEl.querySelector('#av-badge');
    const titleEl = overlayEl.querySelector('#av-title');
    const bodyEl = overlayEl.querySelector('#av-body');
    const routeEl = overlayEl.querySelector('#av-route');

    // Reset card classes
    cardEl.classList.remove('av-card-audio');

    // Set badge & title
    badgeEl.className = 'av-badge ' + project.badgeClass;
    badgeEl.textContent = project.category;
    titleEl.textContent = project.title;
    routeEl.href = project.route;
    routeEl.textContent = `${project.title} Page ↗`;

    bodyEl.innerHTML = '';

    if (project.type === 'video') {
      // Build Video Player
      const container = document.createElement('div');
      container.className = 'av-video-container';

      const video = document.createElement('video');
      video.className = 'av-video-player';
      video.src = project.media;
      if (project.poster) video.poster = project.poster;
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.preload = 'auto';

      container.appendChild(video);
      bodyEl.appendChild(container);
      activeMediaEl = video;

      // Start playing
      video.play().catch(function () {});
    } else {
      // Build Audio Player
      cardEl.classList.add('av-card-audio');

      const container = document.createElement('div');
      container.className = 'av-audio-container';

      container.innerHTML = `
        <canvas class="av-audio-waveform" width="600" height="90"></canvas>
        <div class="av-audio-timeline">
          <input type="range" class="av-progress-bar" id="av-seek" value="0" min="0" max="100" step="0.1">
          <div class="av-time-row">
            <span id="av-cur-time">0:00</span>
            <span id="av-dur-time">0:00</span>
          </div>
        </div>
        <div class="av-audio-controls">
          <button class="av-play-btn" id="av-play" aria-label="Play or Pause">
            <svg id="av-play-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>
        <div class="av-audio-vol-row">
          <span>VOL</span>
          <input type="range" class="av-vol-slider" id="av-vol" min="0" max="1" step="0.01" value="0.9">
        </div>
        <audio id="av-audio" src="${project.media}" preload="auto"></audio>
      `;

      bodyEl.appendChild(container);

      const audio = container.querySelector('#av-audio');
      activeMediaEl = audio;

      const playBtn = container.querySelector('#av-play');
      const playIcon = container.querySelector('#av-play-icon');
      const seek = container.querySelector('#av-seek');
      const curTime = container.querySelector('#av-cur-time');
      const durTime = container.querySelector('#av-dur-time');
      const vol = container.querySelector('#av-vol');
      const canvas = container.querySelector('.av-audio-waveform');
      const ctx = canvas.getContext('2d');

      function updateIcon(isPlaying) {
        if (isPlaying) {
          playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
        } else {
          playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>';
        }
      }

      playBtn.addEventListener('click', function () {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      });

      audio.addEventListener('play', () => updateIcon(true));
      audio.addEventListener('pause', () => updateIcon(false));
      audio.addEventListener('ended', () => updateIcon(false));

      audio.addEventListener('loadedmetadata', function () {
        durTime.textContent = formatTime(audio.duration);
      });

      audio.addEventListener('timeupdate', function () {
        curTime.textContent = formatTime(audio.currentTime);
        if (audio.duration) {
          seek.value = (audio.currentTime / audio.duration) * 100;
        }
      });

      seek.addEventListener('input', function () {
        if (audio.duration) {
          audio.currentTime = (seek.value / 100) * audio.duration;
        }
      });

      vol.addEventListener('input', function () {
        audio.volume = vol.value;
      });

      // Canvas Visualizer wave animation
      function drawWave() {
        if (!overlayEl.classList.contains('av-open')) return;
        animId = requestAnimationFrame(drawWave);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isPlaying = !audio.paused;
        const numBars = 36;
        const barWidth = canvas.width / numBars - 4;
        const t = Date.now() * 0.005;

        for (let i = 0; i < numBars; i++) {
          let h;
          if (isPlaying) {
            const v = Math.sin(t + i * 0.4) * 0.5 + Math.cos(t * 1.5 - i * 0.2) * 0.5;
            h = Math.max(8, Math.abs(v) * 65);
          } else {
            h = 4;
          }
          const x = i * (barWidth + 4) + 2;
          const y = (canvas.height - h) / 2;

          const grad = ctx.createLinearGradient(0, y, 0, y + h);
          grad.addColorStop(0, '#00e5ff');
          grad.addColorStop(1, '#8000ff');
          ctx.fillStyle = grad;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, h, 3);
          } else {
            ctx.rect(x, y, barWidth, h);
          }
          ctx.fill();
        }
      }
      drawWave();

      // Trigger autoplay
      audio.play().then(() => updateIcon(true)).catch(() => updateIcon(false));
    }

    overlayEl.classList.add('av-open');
  }

  function getSlugFromClick(target) {
    if (!target) return null;
    const link = target.closest('a');
    if (link) {
      const href = link.getAttribute('href') || '';
      const m = href.match(/projects\/([a-z0-9-]+)/i);
      if (m) {
        const candidate = m[1].toLowerCase();
        if (PROJECT_REGISTRY[candidate]) return candidate;
      }
    }

    // Inspect parents with data-slug or text match
    let curr = target;
    let depth = 0;
    while (curr && depth < 6 && curr !== document.body) {
      const dataSlug = curr.getAttribute && curr.getAttribute('data-project');
      if (dataSlug && PROJECT_REGISTRY[dataSlug.toLowerCase()]) {
        return dataSlug.toLowerCase();
      }
      curr = curr.parentElement;
      depth++;
    }

    return null;
  }

  // Global Capture Phase click interceptor
  window.addEventListener(
    'click',
    function (e) {
      const slug = getSlugFromClick(e.target);
      if (slug) {
        // Prevent Framer router from taking over or 404ing
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        openProject(slug);
      }
    },
    true // CAPTURE phase: runs before any Framer or inline listeners!
  );

  // Expose global helper for manual triggering if ever needed
  window.AvataarPlayer = {
    open: openProject,
    close: closeModal,
    registry: PROJECT_REGISTRY
  };

  console.log('Avataar Visora Universal Project Player initialized.');
})();
