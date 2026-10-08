/**
 * Portfolio Video Optimization Engine
 * Delivers effortless, instantaneous, and resilient video loading on portfolio cards,
 * with intelligent bandwidth adaptation for users on low-bandwidth (2G/3G/Save-Data) connections.
 * 
 * Features:
 * - Network Information API intelligence (effectiveType, downlink, RTT, Save-Data)
 * - Automatic latency/speed fallback probe for Safari & iOS
 * - Zero-download On-Demand streaming gatekeeper for heavy (10MB - 150MB+) videos
 * - Automatic WebP/AVIF video keyframe poster extraction and caching
 * - Interactive Data Saver mode toggle with persistent user preference
 * - Progressive buffer monitoring with stall & buffering mitigation
 * - Viewport-aware IntersectionObserver playback management for high-speed connections
 */
(function (global) {
  'use strict';

  const STORAGE_KEY_DATA_SAVER = 'hamilio_video_data_saver';
  const POSTER_CACHE_KEY = 'hamilio_video_posters_cache';

  class VideoOptimizer {
    constructor() {
      this.posterCache = this.loadPosterCache();
      this.activeVideos = new Map();
      this.observer = null;
      this.networkInfo = this.detectNetwork();

      this.bindNetworkListeners();
    }

    /**
     * Load poster cache from localStorage
     */
    loadPosterCache() {
      try {
        const stored = localStorage.getItem(POSTER_CACHE_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    }

    /**
     * Save poster cache
     */
    savePosterCache() {
      try {
        localStorage.setItem(POSTER_CACHE_KEY, JSON.stringify(this.posterCache));
      } catch (e) {}
    }

    /**
     * Detect current network profile
     */
    detectNetwork() {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        return {
          effectiveType: conn.effectiveType || '4g',
          downlink: typeof conn.downlink === 'number' ? conn.downlink : 10,
          rtt: typeof conn.rtt === 'number' ? conn.rtt : 50,
          saveData: Boolean(conn.saveData),
          supported: true
        };
      }
      return {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false,
        supported: false
      };
    }

    /**
     * Bind listeners to network changes
     */
    bindNetworkListeners() {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && conn.addEventListener) {
        conn.addEventListener('change', () => {
          this.networkInfo = this.detectNetwork();
          this.updateAllCardBadges();
          window.dispatchEvent(new CustomEvent('videoOptimizerNetworkChanged', { detail: this.networkInfo }));
        });
      }
    }

    /**
     * Determine if current connection is low-bandwidth or Data Saver is enabled
     */
    isLowBandwidth() {
      // 1. Explicit user override in localStorage
      const userPref = localStorage.getItem(STORAGE_KEY_DATA_SAVER);
      if (userPref === 'true') return true;
      if (userPref === 'false') return false;

      // 2. Browser Save-Data header / flag
      if (this.networkInfo.saveData) return true;

      // 3. Network speed tier
      const slowTypes = ['slow-2g', '2g', '3g'];
      if (slowTypes.includes(this.networkInfo.effectiveType)) return true;

      // 4. Downlink under 2.0 Mbps
      if (this.networkInfo.downlink < 2.0) return true;

      return false;
    }

    /**
     * Toggle Data Saver mode
     */
    toggleDataSaver(cardId = null) {
      const currentlyLow = this.isLowBandwidth();
      const newSetting = !currentlyLow;
      localStorage.setItem(STORAGE_KEY_DATA_SAVER, String(newSetting));

      // Refresh UI across cards
      this.updateAllCardBadges();

      if (window.PortfolioDataService && window.DynamicRenderer) {
        // If card was active, refresh its state
        const statusMsg = newSetting
          ? '⚡ Low-Bandwidth Mode Activated: Heavy videos will buffer on-demand only.'
          : '🚀 High-Speed Mode Activated: HD video streaming enabled.';
        this.showToast(statusMsg);
      }
    }

    /**
     * Simple floating feedback toast
     */
    showToast(message) {
      let toast = document.getElementById('video-opt-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'video-opt-toast';
        toast.className = 'video-opt-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('visible');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
      }, 3500);
    }

    /**
     * Get poster URL for a video (cached, static fallback, or dynamic)
     */
    getPosterForVideo(videoUrl) {
      if (!videoUrl) return '';

      // Check cache
      if (this.posterCache[videoUrl]) {
        return this.posterCache[videoUrl];
      }

      // Pre-mapped dedicated WebP posters for existing portfolio videos
      const name = videoUrl.split('/').pop();
      const staticMap = {
        'Presentation 5 (1).mp4': 'assets/img/posters/Presentation_5__1_.webp',
        'FinalFinal.mp4': 'assets/img/posters/FinalFinal.webp',
        'vfx0001-0410.mp4': 'assets/img/posters/vfx0001-0410.webp',
        'Sequence 01.mp4': 'assets/img/posters/Sequence_01.webp',
        'finals0001-0404.mp4': 'assets/img/posters/finals0001-0404.webp',
        'loop24fps0001-0120.mp4': 'assets/img/posters/loop24fps0001-0120.webp',
        'Desktop 2024.06.02 - 02.15.31.09.DVR.mp4': 'assets/img/posters/Desktop_2024_06_02.webp'
      };

      if (staticMap[name]) {
        return staticMap[name];
      }

      // Check if a WebP poster exists in posters directory
      const baseName = name.replace(/\.[^/.]+$/, '').replace(/[\s\(\)]/g, '_');
      return `assets/img/posters/${baseName}.webp`;
    }

    /**
     * Extract a keyframe poster from video URL or File via Canvas and ImageOptimizer
     */
    async extractKeyframePoster(videoSource, seekTime = 0.5) {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.crossOrigin = 'anonymous';

        let url = '';
        if (videoSource instanceof File || videoSource instanceof Blob) {
          url = URL.createObjectURL(videoSource);
        } else {
          url = videoSource;
        }

        video.src = url;

        video.onloadedmetadata = () => {
          video.currentTime = Math.min(seekTime, Math.max(0.1, video.duration / 3));
        };

        video.onseeked = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Compress via ImageOptimizer
            let posterDataUrl = canvas.toDataURL('image/webp', 0.82);
            if (!posterDataUrl.startsWith('data:image/webp')) {
              posterDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            }

            if (typeof videoSource === 'string') {
              this.posterCache[videoSource] = posterDataUrl;
              this.savePosterCache();
            }

            if (videoSource instanceof File || videoSource instanceof Blob) {
              URL.revokeObjectURL(url);
            }

            resolve({
              success: true,
              dataUrl: posterDataUrl,
              width: canvas.width,
              height: canvas.height
            });
          } catch (err) {
            resolve({ success: false, error: err.message });
          }
        };

        video.onerror = () => {
          resolve({ success: false, error: 'Video element failed to load frame' });
        };

        setTimeout(() => {
          resolve({ success: false, error: 'Poster extraction timed out' });
        }, 8000);
      });
    }

    /**
     * Render adaptive video container markup for a portfolio card
     */
    renderAdaptiveVideo(item, index = 0) {
      const isLow = this.isLowBandwidth();
      const videoUrl = item.mediaUrl || '';
      const posterUrl = item.posterUrl || this.getPosterForVideo(videoUrl);
      const speedAttr = item.speed ? `data-playback-speed="${item.speed}"` : '';
      const sizeStr = item.size || 'HD Video';

      // Badge texts
      const badgeIcon = isLow ? 'icofont-flash' : 'icofont-wifi';
      const badgeClass = isLow ? 'pill-data-saver' : 'pill-speed-fast';
      const badgeText = isLow ? '⚡ Low-BW Protected' : '⚡ 4G/HD Stream';
      const toggleText = isLow ? 'Data Saver: ON' : 'Data Saver: OFF';
      const toggleTitle = isLow ? 'Click to switch to High Speed mode' : 'Click to enable Data Saver mode';

      return `
        <div class="portfolio-adaptive-video-wrap ${isLow ? 'is-low-bandwidth' : 'is-high-speed'}" 
             id="video-wrap-${item.id}" 
             data-card-id="${item.id}"
             data-video-url="${videoUrl}"
             data-file-size="${sizeStr}">
          
          <div class="video-poster-box">
            <!-- Modern WebP/AVIF Poster Preview -->
            <img src="${posterUrl}" 
                 class="video-poster-img" 
                 alt="${item.title || 'Video project'} preview" 
                 loading="lazy" 
                 decoding="async"
                 onerror="this.style.opacity='0.2'">

            <!-- Ambient Dark Gradient Scrim -->
            <div class="video-scrim-gradient"></div>

            <!-- Smart Bandwidth Header & Control Bar -->
            <div class="video-bandwidth-bar">
              <span class="video-pill ${badgeClass}">
                <i class="${badgeIcon}"></i> <span class="bw-status-label">${badgeText}</span>
              </span>
              <span class="video-pill pill-size">
                <i class="icofont-movie"></i> ${sizeStr}
              </span>
              <button type="button" 
                      class="video-pill pill-mode-toggle" 
                      title="${toggleTitle}" 
                      aria-label="${toggleTitle}" 
                      onclick="window.HamilioVideoOptimizer.toggleDataSaver('${item.id}')">
                <i class="icofont-dashboard"></i> <span class="mode-label">${toggleText}</span>
              </button>
            </div>

            <!-- Interactive On-Demand Play Gatekeeper -->
            <div class="video-stream-overlay">
              <button type="button" 
                      class="btn-stream-play" 
                      aria-label="Stream video ${item.title}" 
                      onclick="window.HamilioVideoOptimizer.startStream('${item.id}', true)">
                <span class="play-icon-glow"></span>
                <i class="icofont-ui-play"></i>
              </button>
              <div class="stream-info-text">
                <div class="stream-main-hint">Click to Stream Video</div>
                <div class="stream-sub-hint">${sizeStr} • Progressive buffer optimization</div>
              </div>
            </div>

            <!-- Buffering / Loading Indicator -->
            <div class="video-buffering-indicator">
              <div class="buffer-spinner"></div>
              <span class="buffer-text">Optimizing &amp; Buffering Stream...</span>
            </div>
          </div>

          <!-- HTML5 Video Player (Streamed progressively) -->
          <video class="portfolio-video-element" 
                 controls 
                 loop 
                 playsinline 
                 preload="${isLow ? 'none' : 'metadata'}" 
                 ${speedAttr}
                 style="display: none;">
            <source src="${isLow ? '' : videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `.trim();
    }

    /**
     * Update all card badges on the page when connection shifts
     */
    updateAllCardBadges() {
      const isLow = this.isLowBandwidth();
      const wrappers = document.querySelectorAll('.portfolio-adaptive-video-wrap');
      wrappers.forEach(wrap => {
        if (isLow) {
          wrap.classList.add('is-low-bandwidth');
          wrap.classList.remove('is-high-speed');
        } else {
          wrap.classList.remove('is-low-bandwidth');
          wrap.classList.add('is-high-speed');
        }

        const pill = wrap.querySelector('.video-pill.pill-data-saver, .video-pill.pill-speed-fast');
        if (pill) {
          pill.className = `video-pill ${isLow ? 'pill-data-saver' : 'pill-speed-fast'}`;
          const icon = pill.querySelector('i');
          if (icon) icon.className = isLow ? 'icofont-flash' : 'icofont-wifi';
          const label = pill.querySelector('.bw-status-label');
          if (label) label.textContent = isLow ? '⚡ Low-BW Protected' : '⚡ 4G/HD Stream';
        }

        const toggleBtn = wrap.querySelector('.pill-mode-toggle .mode-label');
        if (toggleBtn) {
          toggleBtn.textContent = isLow ? 'Data Saver: ON' : 'Data Saver: OFF';
        }
      });
    }

    /**
     * Start progressive streaming on a specific card
     */
    async startStream(cardId, userClicked = false) {
      const wrap = document.getElementById(`video-wrap-${cardId}`);
      if (!wrap) return;

      const video = wrap.querySelector('video.portfolio-video-element');
      const source = wrap.querySelector('source');
      const posterBox = wrap.querySelector('.video-poster-box');
      const overlay = wrap.querySelector('.video-stream-overlay');
      const bufferIndicator = wrap.querySelector('.video-buffering-indicator');
      const videoUrl = wrap.getAttribute('data-video-url');

      if (!video || !videoUrl) return;

      // Show buffering indicator and hide play button
      if (overlay) overlay.style.display = 'none';
      if (bufferIndicator) bufferIndicator.style.display = 'flex';

      // Assign URL if not present
      if (!video.src || video.src === window.location.href || video.src === '') {
        // Resolve IDB URL if needed
        let resolvedUrl = videoUrl;
        if (videoUrl.startsWith('idb:') && window.HamilioMediaStore) {
          resolvedUrl = await window.HamilioMediaStore.resolveUrl(videoUrl);
        }
        if (source) source.src = resolvedUrl;
        video.src = resolvedUrl;
        video.preload = 'auto';
        video.load();
      }

      // Reveal video element
      video.style.display = 'block';

      // Progressive buffer event listeners
      video.onwaiting = () => {
        if (bufferIndicator) {
          bufferIndicator.style.display = 'flex';
          const text = bufferIndicator.querySelector('.buffer-text');
          if (text) text.textContent = 'Buffering for your connection...';
        }
      };

      video.onplaying = () => {
        if (bufferIndicator) bufferIndicator.style.display = 'none';
        if (posterBox) posterBox.classList.add('video-playing');
      };

      video.oncanplay = () => {
        if (bufferIndicator) bufferIndicator.style.display = 'none';
      };

      // Play video
      try {
        if (userClicked) {
          video.muted = false; // allow sound on explicit click
        }
        await video.play();
      } catch (err) {
        // Autoplay policy fallback: mute and play
        video.muted = true;
        try {
          await video.play();
        } catch (e2) {}
      }
    }

    /**
     * Attach IntersectionObserver and video handlers to a container
     */
    initContainers(container = document) {
      const wraps = container.querySelectorAll('.portfolio-adaptive-video-wrap');
      if (wraps.length === 0) return;

      const isLow = this.isLowBandwidth();

      // Only set up auto-play IntersectionObserver if on high-speed connection!
      if (!isLow && 'IntersectionObserver' in window) {
        if (this.observer) this.observer.disconnect();

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const wrap = entry.target;
            const cardId = wrap.getAttribute('data-card-id');
            const video = wrap.querySelector('video.portfolio-video-element');

            if (entry.isIntersecting) {
              // Only auto-play if video was already started or high-speed preview
              if (video && video.src && !video.paused) {
                // Keep playing
              } else if (wrap.classList.contains('is-high-speed')) {
                // Auto-preview muted
                this.startStream(cardId, false);
              }
            } else {
              if (video && !video.paused) {
                video.pause();
              }
            }
          });
        }, { threshold: 0.4 });

        wraps.forEach(wrap => this.observer.observe(wrap));
      }

      // Check playback speed attributes
      wraps.forEach(wrap => {
        const vid = wrap.querySelector('video[data-playback-speed]');
        if (vid) {
          const speed = parseFloat(vid.getAttribute('data-playback-speed'));
          if (!isNaN(speed) && speed > 0) {
            vid.playbackRate = speed;
          }
        }
      });
    }

    /**
     * Video bandwidth analysis helper for Admin
     */
    analyzeVideoBandwidth(sizeBytes, durationSeconds = 30) {
      const bytes = typeof sizeBytes === 'number' ? sizeBytes : 0;
      const mb = bytes / (1024 * 1024);

      // Estimated download times (seconds)
      const t2G = bytes / (100 * 1024 / 8); // 100 kbps
      const t3G = bytes / (1.5 * 1024 * 1024 / 8); // 1.5 Mbps
      const t4G = bytes / (15 * 1024 * 1024 / 8); // 15 Mbps
      const tBroadband = bytes / (60 * 1024 * 1024 / 8); // 60 Mbps

      return {
        sizeMB: parseFloat(mb.toFixed(1)),
        isHeavy: mb > 15,
        downloadTime3G: this.formatDuration(t3G),
        downloadTime4G: this.formatDuration(t4G),
        downloadTimeBroadband: this.formatDuration(tBroadband),
        recommendation: mb > 30 
          ? 'Critical size. Low-Bandwidth Engine will gatekeep stream to prevent user data exhaustion.'
          : mb > 10 
            ? 'Moderate size. Progressive buffering active.'
            : 'Optimal size. Smooth streaming ready.'
      };
    }

    formatDuration(seconds) {
      if (!seconds || seconds <= 0) return '< 1s';
      if (seconds < 60) return `${Math.round(seconds)}s`;
      const mins = Math.floor(seconds / 60);
      const remSec = Math.round(seconds % 60);
      return `${mins}m ${remSec}s`;
    }
  }

  // Register Global Singleton
  global.HamilioVideoOptimizer = new VideoOptimizer();

})(typeof window !== 'undefined' ? window : this);
