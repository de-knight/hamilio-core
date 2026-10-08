/**
 * Media Store & Upload Management
 * Provides persistent media file storage (IndexedDB + LocalStorage)
 * Supports Images, Videos, and Document PDFs, with optional Supabase Storage CDN upload.
 */
(function () {
  'use strict';

  const DB_NAME = 'HamilioMediaDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'mediaFiles';
  const REGISTRY_KEY = 'hamilio_uploaded_media_registry_v1';

  // Pre-populated catalog of existing project assets
  const BUILTIN_MEDIA = [
    // Documents
    { id: 'bm_cv', name: 'HamimMahamudHamyCV.pdf', title: 'Hamim Mahamud Hamy CV', alt: 'Official Resume and Curriculum Vitae PDF', description: 'Official career resume and CV document in PDF format', type: 'document', url: 'assets/img/HamimMahamudHamyCV.pdf', size: '920 KB', date: 'March 2025', dimensions: 'Standard Vector PDF', format: 'PDF Document (.pdf)' },
    
    // Backgrounds & Profile
    { id: 'bm_bg_webp', name: 'hero-bg.webp', title: 'Cyber City Hero Background', alt: 'Futuristic 3D Cyber City Background in WebP', description: 'Main hero landing background visual optimized in WebP', type: 'image', url: 'assets/img/hero-bg.webp', size: '110 KB', date: '2026', dimensions: '1920 × 1080 px', aspectRatio: '16:9', format: 'WebP Image (.webp)' },
    { id: 'bm_bg1_opt', name: 'bg1-opt.jpg (Optimized Hero BG)', title: 'Optimized Hero Background', alt: '3D Cybernetic City Landing Background', description: 'Optimized hero section background image', type: 'image', url: 'assets/img/bg1-opt.jpg', size: '110 KB', date: '2026', dimensions: '1920 × 1080 px', aspectRatio: '16:9', format: 'JPEG Image (.jpg)' },
    { id: 'bm_bg1', name: 'bg1.png (Original Fallback)', title: 'Hero Background Original', alt: '3D Background Original PNG Fallback', description: 'Original high-res fallback background asset', type: 'image', url: 'assets/img/bg1.png', size: '318 KB', date: '2023', dimensions: '1920 × 1080 px', aspectRatio: '16:9', format: 'PNG Image (.png)' },
    { id: 'bm_profile_opt', name: 'profile-opt.jpg (Optimized Profile Photo)', title: 'Profile Portrait (Optimized)', alt: 'Hamim Mahamud Hamy Professional Portrait', description: 'Main about section professional profile portrait', type: 'image', url: 'assets/img/profile-opt.jpg', size: '124 KB', date: '2026', dimensions: '720 × 1083 px', aspectRatio: '2:3 (Portrait)', format: 'JPEG Image (.jpg)' },
    { id: 'bm_profile', name: 'IMG_9888.png (Original Photo)', title: 'Profile Portrait (Raw Photo)', alt: 'Hamim Mahamud Hamy Original Photo', description: 'High-res original portrait photograph', type: 'image', url: 'assets/img/IMG_9888.png', size: '9.5 MB', date: '2024', dimensions: '2268 × 3411 px', aspectRatio: '2:3 (Portrait)', format: 'PNG Image (.png)' },
    { id: 'bm_hvec', name: 'hvec.png', title: 'HVEC Brand Emblem', alt: 'HVEC Official Geometric Emblem Logo', description: 'Square brand emblem and site favicon', type: 'image', url: 'assets/img/hvec.png', size: '18 KB', date: '2023', dimensions: '550 × 550 px', aspectRatio: '1:1 (Square)', format: 'PNG Image (.png)' },
    { id: 'bm_hvector', name: 'hvector.png', title: 'HVector Main Logo', alt: 'HVector High Resolution Brand Identity', description: 'Vector master brandmark logo asset', type: 'image', url: 'assets/img/hvector.png', size: '135 KB', date: '2023', dimensions: '3553 × 3120 px', aspectRatio: '8:7', format: 'PNG Image (.png)' },

    // Portfolio Images (Optimized + Originals)
    { id: 'bm_evo_opt', name: 'evoV1998vector-opt.jpg (Mitsubishi Evo)', title: 'Mitsubishi Lancer Evo V 1998', alt: '3D Model of 1998 Mitsubishi Lancer Evolution V', description: 'Detailed automotive 3D modeling and studio render', type: 'image', url: 'assets/img/evoV1998vector-opt.jpg', size: '64 KB', date: '2026', dimensions: '1000 × 668 px', aspectRatio: '3:2 (Landscape)', format: 'JPEG Image (.jpg)' },
    { id: 'bm_behula_opt', name: 'behula-opt.jpg (Behula Logo)', title: 'Behula Brand Identity', alt: '3D Sculpted Behula Typography and Logo', description: '3D typography branding render for Behula project', type: 'image', url: 'assets/img/behula-opt.jpg', size: '109 KB', date: '2026', dimensions: '1000 × 998 px', aspectRatio: '1:1 (Square)', format: 'JPEG Image (.jpg)' },
    { id: 'bm_room2_opt', name: 'room2-opt.jpg (3D Bedroom)', title: 'Isometric Cyber Bedroom', alt: 'Isometric 3D Bedroom Architecture Render', description: 'Interior architectural CGI render created in Blender', type: 'image', url: 'assets/img/room2-opt.jpg', size: '96 KB', date: '2026', dimensions: '1000 × 562 px', aspectRatio: '16:9', format: 'JPEG Image (.jpg)' },
    { id: 'bm_mojo_opt', name: 'mojo-opt.jpg (3D Soft Drink)', title: 'Mojo Energy Drink Commercial', alt: '3D Mojo Soda Can Commercial Visualization', description: 'Photorealistic commercial product packaging render', type: 'image', url: 'assets/img/mojo-opt.jpg', size: '28 KB', date: '2026', dimensions: '1000 × 562 px', aspectRatio: '16:9', format: 'JPEG Image (.jpg)' },
    { id: 'bm_pp1_opt', name: 'pp1-opt.jpg (Vexel Art)', title: 'Stylized Vexel Character', alt: 'Stylized Vexel Digital Illustration', description: 'Digital vexel vector character illustration artwork', type: 'image', url: 'assets/img/pp1-opt.jpg', size: '65 KB', date: '2026', dimensions: '1000 × 1000 px', aspectRatio: '1:1 (Square)', format: 'JPEG Image (.jpg)' },
    { id: 'bm_earth_opt', name: 'PlanetEarth-opt.jpg (Planet Earth)', title: 'Planet Earth Space CGI', alt: 'Photorealistic Planet Earth Space Render', description: 'Planetary atmosphere and space visualization', type: 'image', url: 'assets/img/PlanetEarth-opt.jpg', size: '104 KB', date: '2026', dimensions: '1000 × 565 px', aspectRatio: '16:9', format: 'JPEG Image (.jpg)' },
    { id: 'bm_bgp', name: 'bgp.png (Gundam Vector Art)', title: 'Mecha Gundam Vector Art', alt: 'Anime Mecha Gundam Detailed Vector Illustration', description: 'Intricate vector illustration of classic anime mecha', type: 'image', url: 'assets/img/bgp.png', size: '553 KB', date: '2022', dimensions: '1920 × 1080 px', aspectRatio: '16:9', format: 'PNG Image (.png)' },
    { id: 'bm_abs', name: 'abs3df.png', title: 'Abstract 3D Forms', alt: 'Abstract Flowing 3D Geometry Render', description: 'Exploration of procedural forms and shader materials', type: 'image', url: 'assets/img/abs3df.png', size: '117 KB', date: '2023', dimensions: '2000 × 2000 px', aspectRatio: '1:1 (Square)', format: 'PNG Image (.png)' },
    { id: 'bm_3', name: '3.jpg', title: 'Cosmic 3D Render', alt: 'Futuristic Cosmic Space CGI Scene', description: 'Surrealist spatial environment artwork in 3D', type: 'image', url: 'assets/img/3.jpg', size: '532 KB', date: '2023', dimensions: '1195 × 1195 px', aspectRatio: '1:1 (Square)', format: 'JPEG Image (.jpg)' },
    { id: 'bm_casade', name: 'Casadecodelogo3d.png', title: 'Casadecode 3D Logo', alt: 'Casadecode Modern 3D Identity Emblem', description: 'Corporate brandmark in embossed 3D materials', type: 'image', url: 'assets/img/Casadecodelogo3d.png', size: '302 KB', date: '2024', dimensions: '4000 × 4000 px', aspectRatio: '1:1 (Square)', format: 'PNG Image (.png)' },
    { id: 'bm_frank', name: 'Frank.jpg (NFT Art)', title: 'Frank Character NFT Art', alt: 'Frank Stylized Character NFT Digital Art', description: 'Unique digital character artwork created for NFT collection', type: 'image', url: 'assets/img/Frank.jpg', size: '267 KB', date: '2023', dimensions: '1000 × 1000 px', aspectRatio: '1:1 (Square)', format: 'JPEG Image (.jpg)' },

    // Portfolio Videos
    { id: 'bm_v_pres', name: 'Presentation 5 (1).mp4 (Project Presentation)', title: 'Diploma Capstone Presentation', alt: 'Computer Science Diploma Capstone Presentation Video Reel', description: 'Motion graphics presentation and technical showcase video', type: 'video', url: 'assets/img/Presentation 5 (1).mp4', posterUrl: 'assets/img/posters/Presentation_5__1_.webp', size: '148 MB', date: 'Jan 2025', dimensions: '1920 × 1080 px', aspectRatio: '16:9 (Full HD)', duration: '02:48', format: 'MP4 Video (.mp4)' },
    { id: 'bm_v_final', name: 'FinalFinal.mp4 (Youtube Intro)', title: 'YouTube Channel Intro Reel', alt: 'Dynamic YouTube Intro Motion Animation', description: 'High-octane animated opening sequence for video channel', type: 'video', url: 'assets/img/FinalFinal.mp4', posterUrl: 'assets/img/posters/FinalFinal.webp', size: '5.3 MB', date: '2024', dimensions: '2840 × 1598 px', aspectRatio: '16:9 (2.8K)', duration: '00:04', format: 'MP4 Video (.mp4)' },
    { id: 'bm_v_vfx', name: 'vfx0001-0410.mp4 (Lambo VFX)', title: 'Lamborghini VFX Sequence', alt: 'Lamborghini Live-Action CGI Compositing VFX Reel', description: 'Automotive VFX sequence composited in Blender and After Effects', type: 'video', url: 'assets/img/vfx0001-0410.mp4', posterUrl: 'assets/img/posters/vfx0001-0410.webp', size: '42 MB', date: '2023', dimensions: '1920 × 1080 px', aspectRatio: '16:9 (Full HD)', duration: '00:13', format: 'MP4 Video (.mp4)' },
    { id: 'bm_v_march', name: 'Sequence 01.mp4 (Offensive Rhino March)', title: 'Rhino Mech March Animation', alt: 'Rhino Mech March Cycle 3D Animation', description: 'Mechanical bipedal creature locomotion cycle', type: 'video', url: 'assets/img/Sequence 01.mp4', posterUrl: 'assets/img/posters/Sequence_01.webp', size: '32 MB', date: '2024', dimensions: '1000 × 1000 px', aspectRatio: '1:1 (Square)', duration: '00:18', format: 'MP4 Video (.mp4)' },
    { id: 'bm_v_finals', name: 'finals0001-0404.mp4 (3D Animation)', title: 'Character 3D Action Reel', alt: 'Dynamic 3D Character Action Sequence', description: 'Keyframe animated cinematic sequence render', type: 'video', url: 'assets/img/finals0001-0404.mp4', posterUrl: 'assets/img/posters/finals0001-0404.webp', size: '9.2 MB', date: '2023', dimensions: '1920 × 1080 px', aspectRatio: '16:9 (Full HD)', duration: '00:16', format: 'MP4 Video (.mp4)' },
    { id: 'bm_v_loop', name: 'loop24fps0001-0120.mp4 (3D Loop Video)', title: 'Seamless 3D Ambient Loop', alt: 'Seamless 3D Ambient Motion Loop Video', description: 'Continuous ambient visual motion art loop', type: 'video', url: 'assets/img/loop24fps0001-0120.mp4', posterUrl: 'assets/img/posters/loop24fps0001-0120.webp', size: '5.0 MB', date: '2022', dimensions: '1920 × 1080 px', aspectRatio: '16:9 (Full HD)', duration: '00:05', format: 'MP4 Video (.mp4)' },
    { id: 'bm_v_got', name: 'Desktop 2024.06.02 - 02.15.31.09.DVR.mp4 (Video Edit)', title: 'Cinematic Gaming Video Reel', alt: 'Cinematic Game Capture Video Reel Edit', description: 'Gaming montage with synchronized audio and grading', type: 'video', url: 'assets/img/Desktop 2024.06.02 - 02.15.31.09.DVR.mp4', posterUrl: 'assets/img/posters/Desktop_2024_06_02.webp', size: '135 MB', date: '2024', dimensions: '1920 × 1080 px', aspectRatio: '16:9 (Full HD)', duration: '00:23', format: 'MP4 Video (.mp4)' }
  ];

  class MediaStore {
    constructor() {
      this.db = null;
      this.objectUrlCache = {};
      this.initDBPromise = this.initIndexedDB();
    }

    initIndexedDB() {
      return new Promise((resolve) => {
        if (!window.indexedDB) {
          console.warn("IndexedDB not supported in this browser");
          resolve(null);
          return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.error("IndexedDB error:", event.target.error);
          resolve(null);
        };
      });
    }

    getRegistry() {
      try {
        const stored = localStorage.getItem(REGISTRY_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        return [];
      }
    }

    saveRegistry(list) {
      try {
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(list));
      } catch (err) {
        console.error("Registry storage error:", err);
      }
    }

    formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    detectFileType(file) {
      const mime = file.type || '';
      const name = file.name || '';
      if (mime.startsWith('image/') || /\.(webp|png|jpe?g|gif|svg)$/i.test(name)) return 'image';
      if (mime.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(name)) return 'video';
      if (mime.includes('pdf') || /\.(pdf|doc|docx|txt)$/i.test(name)) return 'document';
      return 'image';
    }

    /**
     * Retrieve file record from IndexedDB
     */
    async getFile(id) {
      await this.initDBPromise;
      if (!this.db) return null;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    /**
     * Resolve any media URL (converts idb: URLs to playable/displayable blob URLs)
     */
    async resolveUrl(url) {
      if (!url) return '';
      if (typeof url !== 'string') return url;
      if (url.startsWith('idb:')) {
        const id = url.substring(4);
        if (this.objectUrlCache[id]) {
          return this.objectUrlCache[id];
        }
        const record = await this.getFile(id);
        if (record) {
          if (record.fileBlob) {
            const blobUrl = URL.createObjectURL(record.fileBlob);
            this.objectUrlCache[id] = blobUrl;
            return blobUrl;
          }
          if (record.dataUrl) {
            return record.dataUrl;
          }
        }
      }
      return url;
    }

    /**
     * Upload and register a file
     */
    async uploadFile(file, meta = {}) {
      await this.initDBPromise;
      const type = this.detectFileType(file);
      const id = 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const sizeStr = this.formatFileSize(file.size);
      const dateStr = new Date().toLocaleDateString();

      const itemTitle = (meta && meta.title) ? meta.title : file.name;
      const itemAlt = (meta && meta.alt) ? meta.alt : '';
      const itemDesc = (meta && meta.description) ? meta.description : '';

      // Create immediate Blob URL for current session
      const immediateBlobUrl = URL.createObjectURL(file);
      this.objectUrlCache[id] = immediateBlobUrl;

      // Store in IndexedDB
      if (this.db) {
        try {
          const tx = this.db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put({
            id: id,
            name: file.name,
            title: itemTitle,
            alt: itemAlt,
            description: itemDesc,
            type: type,
            size: sizeStr,
            mimeType: file.type,
            fileBlob: file
          });
        } catch (idbErr) {
          console.warn("IndexedDB storage notice:", idbErr);
        }
      }

      // Detect dimensions and formats
      let metaDetails = { dimensions: '', aspectRatio: '', duration: '', format: '' };
      try {
        metaDetails = await this.detectDimensions(file, immediateBlobUrl, type);
      } catch (err) {}

      // Register compact metadata in localStorage
      const registry = this.getRegistry();
      const registryItem = {
        id: id,
        name: file.name,
        title: itemTitle,
        alt: itemAlt,
        description: itemDesc,
        type: type,
        size: sizeStr,
        date: dateStr,
        url: 'idb:' + id,
        uploaded: true,
        dimensions: metaDetails.dimensions || '',
        aspectRatio: metaDetails.aspectRatio || '',
        duration: metaDetails.duration || '',
        format: metaDetails.format || ''
      };
      registry.unshift(registryItem);
      this.saveRegistry(registry);

      const mediaItem = {
        ...registryItem,
        resolvedUrl: immediateBlobUrl
      };

      // Optional Supabase Storage upload
      this.uploadToSupabaseIfConfigured(file, id).then((cdnUrl) => {
        if (cdnUrl) {
          registryItem.url = cdnUrl;
          mediaItem.url = cdnUrl;
          mediaItem.resolvedUrl = cdnUrl;
          this.saveRegistry(registry);
        }
      });

      return mediaItem;
    }

    detectDimensions(file, blobUrl, type) {
      return new Promise((resolve) => {
        if (type === 'image') {
          const img = new Image();
          img.onload = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
            const div = (w && h) ? gcd(w, h) : 1;
            const ratio = (w && h) ? `${w / div}:${h / div}` : '';
            const ext = (file.name.split('.').pop() || 'IMAGE').toUpperCase();
            resolve({
              dimensions: `${w} × ${h} px`,
              aspectRatio: ratio,
              format: `${ext} Image (.${ext.toLowerCase()})`
            });
          };
          img.onerror = () => resolve({ dimensions: '', aspectRatio: '', format: 'Image' });
          img.src = blobUrl;
        } else if (type === 'video') {
          const vid = document.createElement('video');
          vid.preload = 'metadata';
          vid.onloadedmetadata = () => {
            const w = vid.videoWidth;
            const h = vid.videoHeight;
            const durSec = Math.round(vid.duration || 0);
            const mins = Math.floor(durSec / 60);
            const secs = durSec % 60;
            const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
            const div = (w && h) ? gcd(w, h) : 1;
            const ratio = (w && h) ? `${w / div}:${h / div}` : '';
            const ext = (file.name.split('.').pop() || 'VIDEO').toUpperCase();
            resolve({
              dimensions: (w && h) ? `${w} × ${h} px` : 'Video File',
              duration: durStr,
              aspectRatio: ratio,
              format: `${ext} Video (.${ext.toLowerCase()})`
            });
          };
          vid.onerror = () => resolve({ dimensions: 'Video File', duration: '', aspectRatio: '', format: 'Video' });
          vid.src = blobUrl;
        } else {
          resolve({
            dimensions: 'Standard PDF Document',
            format: 'PDF Document (.pdf)'
          });
        }
      });
    }

    /**
     * Delete an uploaded media item
     */
    async deleteFile(id) {
      await this.initDBPromise;

      // Cannot delete built-in assets
      if (id.startsWith('bm_')) {
        alert("Built-in system assets cannot be deleted.");
        return false;
      }

      // Revoke any cached object URL
      if (this.objectUrlCache[id]) {
        try {
          URL.revokeObjectURL(this.objectUrlCache[id]);
          delete this.objectUrlCache[id];
        } catch (e) {}
      }

      // Remove from IndexedDB
      if (this.db) {
        try {
          const tx = this.db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).delete(id);
        } catch (e) {}
      }

      // Remove from registry
      let registry = this.getRegistry();
      registry = registry.filter(item => item.id !== id);
      this.saveRegistry(registry);
      return true;
    }

    /**
     * Update title, alt text, format, size, url and details for any media item
     */
    updateMediaMeta(id, updates = {}) {
      let registry = this.getRegistry();
      let found = false;
      registry = registry.map(item => {
        if (item.id === id) {
          found = true;
          return {
            ...item,
            ...updates
          };
        }
        return item;
      });

      if (found) {
        this.saveRegistry(registry);
        // Also update IndexedDB if present
        if (this.db) {
          try {
            const tx = this.db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => {
              if (req.result) {
                const updated = {
                  ...req.result,
                  ...updates
                };
                store.put(updated);
              }
            };
          } catch (_) {}
        }
        return true;
      }

      // If built-in asset, persist overrides in localStorage
      const overrideKey = 'hamilio_builtin_media_overrides_v1';
      let overrides = {};
      try {
        overrides = JSON.parse(localStorage.getItem(overrideKey) || '{}');
      } catch (_) {}
      overrides[id] = {
        ...(overrides[id] || {}),
        ...updates
      };
      try {
        localStorage.setItem(overrideKey, JSON.stringify(overrides));
      } catch (_) {}
      return true;
    }

    /**
     * Update the binary blob and metadata for an uploaded item in IndexedDB
     */
    async updateMediaFileBlob(id, fileBlob, updates = {}) {
      await this.initDBPromise;
      if (this.db && fileBlob) {
        try {
          const tx = this.db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(id);
          req.onsuccess = () => {
            const baseItem = req.result || this.getMediaItem(id) || { id };
            const updated = {
              ...baseItem,
              ...updates,
              id: id,
              fileBlob: fileBlob,
              mimeType: fileBlob.type || (baseItem && baseItem.mimeType) || 'image/webp'
            };
            store.put(updated);
          };
        } catch (e) {
          console.warn("IndexedDB update error:", e);
        }
      }

      // Update object URL cache
      if (this.objectUrlCache[id]) {
        try { URL.revokeObjectURL(this.objectUrlCache[id]); } catch (_) {}
      }
      if (fileBlob) {
        this.objectUrlCache[id] = URL.createObjectURL(fileBlob);
      }

      return this.updateMediaMeta(id, updates);
    }

    /**
     * Get a single media item by ID
     */
    getMediaItem(id) {
      const all = this.getAllMedia();
      return all.find(m => m.id === id) || null;
    }

    /**
     * Get all media items (Built-in + Uploaded)
     */
    getAllMedia(filterType = null) {
      const customMedia = this.getRegistry();
      let overrides = {};
      try {
        overrides = JSON.parse(localStorage.getItem('hamilio_builtin_media_overrides_v1') || '{}');
      } catch (_) {}

      const mergedBuiltin = BUILTIN_MEDIA.map(item => {
        const ov = overrides[item.id] || {};
        return {
          ...item,
          ...ov
        };
      });

      let combined = [...customMedia, ...mergedBuiltin];

      if (filterType && filterType !== 'all') {
        combined = combined.filter(m => m.type === filterType);
      }

      return combined;
    }

    /**
     * Upload to Supabase Storage if configured
     */
    async uploadToSupabaseIfConfigured(file, id) {
      try {
        if (!window.PortfolioDataService) return null;
        const config = window.PortfolioDataService.getData().config || {};
        if (!config.supabaseUrl || !config.supabaseKey) return null;

        const cleanUrl = config.supabaseUrl.replace(/\/$/, '');
        const filename = `${id}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const endpoint = `${cleanUrl}/storage/v1/object/media/${filename}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'apikey': config.supabaseKey,
            'Authorization': `Bearer ${config.supabaseKey}`,
            'Content-Type': file.type
          },
          body: file
        });

        if (res.ok) {
          return `${cleanUrl}/storage/v1/object/public/media/${filename}`;
        }
      } catch (err) {
        console.warn("Supabase storage upload skipped:", err);
      }
      return null;
    }
  }

  // Register globally
  window.HamilioMediaStore = new MediaStore();
})();
