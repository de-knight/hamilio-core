/**
 * Global Image Optimization Engine
 * Converts PNG, JPG, JPEG, GIF, BMP, and other raster formats to AVIF or WebP.
 * Features:
 * - Runtime browser capability detection (AVIF & WebP canvas encoding)
 * - High-quality bicubic downscaling and aspect ratio preservation
 * - Configurable compression quality and max dimension constraints
 * - Non-blocking asynchronous conversion via Canvas / OffscreenCanvas
 * - Rich analytics: bytes saved, percent saved, before/after dimensions
 * - Single image, batch processing, and global DOM picture upgrade helpers
 */
(function (global) {
  'use strict';

  // Format capabilities detection
  const capabilities = {
    webpEncoder: false,
    avifEncoder: false,
    offscreenCanvas: typeof OffscreenCanvas !== 'undefined'
  };

  function testFormatSupport() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;

      // Test WebP
      const webpUri = canvas.toDataURL('image/webp');
      capabilities.webpEncoder = webpUri.indexOf('data:image/webp') === 0;

      // Test AVIF
      const avifUri = canvas.toDataURL('image/avif');
      capabilities.avifEncoder = avifUri.indexOf('data:image/avif') === 0;
    } catch (e) {
      capabilities.webpEncoder = true; // safe fallback
      capabilities.avifEncoder = false;
    }
  }

  // Run initial detection
  if (typeof document !== 'undefined') {
    testFormatSupport();
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Loads any image source (File, Blob, Data URL, URL, ImageElement) into an ImageBitmap or HTMLImageElement
   */
  async function loadImageSource(source) {
    if (!source) throw new Error('No image source provided');

    // If source is already an HTMLImageElement and completed
    if (source instanceof HTMLImageElement && source.complete && source.naturalWidth > 0) {
      return {
        image: source,
        width: source.naturalWidth,
        height: source.naturalHeight,
        originalSize: 0,
        name: source.alt || 'image'
      };
    }

    let blob = null;
    let name = 'image';
    let originalSize = 0;

    if (source instanceof File) {
      blob = source;
      name = source.name;
      originalSize = source.size;
    } else if (source instanceof Blob) {
      blob = source;
      originalSize = source.size;
    } else if (typeof source === 'string') {
      const srcStr = source.trim();

      // 1. Data URLs: Convert directly to Blob in memory (bypasses all network/CORS)
      if (srcStr.startsWith('data:')) {
        try {
          const parts = srcStr.split(',');
          const mimeMatch = parts[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : 'image/png';
          const bstr = atob(parts[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          blob = new Blob([u8arr], { type: mime });
          originalSize = blob.size;
          name = 'image.' + (mime.split('/')[1] || 'png');
        } catch (e) {
          // If decoding failed, proceed to image element
        }
      }

      // 2. Blob URLs: Retrieve underlying blob via fetch
      if (!blob && srcStr.startsWith('blob:')) {
        try {
          const resp = await fetch(srcStr);
          if (resp.ok) {
            blob = await resp.blob();
            originalSize = blob.size;
          }
        } catch (e) {
          // fetch blob failed, proceed to Image element
        }
      }

      // 3. Relative or Same-Origin URLs: Try fetch() first (avoids canvas tainting & CORS cache bugs)
      if (!blob && typeof fetch === 'function') {
        try {
          const resp = await fetch(srcStr, { mode: 'cors' });
          if (resp.ok) {
            blob = await resp.blob();
            originalSize = blob.size;
            name = (srcStr.split('/').pop().split('?')[0]) || 'image';
          }
        } catch (e) {
          // fetch failed (e.g. file:/// protocol or strict CORS); will fallback to Image element
        }
      }

      // 4. Fallback: Load via HTMLImageElement
      if (!blob) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const isHttp = /^https?:\/\//i.test(srcStr);
          const isSameOrigin = typeof window !== 'undefined' && window.location && srcStr.startsWith(window.location.origin);
          
          // Only set crossOrigin if it is an external HTTP URL
          if (isHttp && !isSameOrigin) {
            img.crossOrigin = 'anonymous';
          }

          img.onload = () => {
            resolve({
              image: img,
              width: img.naturalWidth,
              height: img.naturalHeight,
              originalSize: originalSize || 0,
              name: (srcStr.split('/').pop().split('?')[0]) || 'image'
            });
          };

          img.onerror = () => {
            // If crossOrigin was set and failed, retry once without crossOrigin
            if (img.crossOrigin) {
              const retryImg = new Image();
              retryImg.onload = () => {
                resolve({
                  image: retryImg,
                  width: retryImg.naturalWidth,
                  height: retryImg.naturalHeight,
                  originalSize: originalSize || 0,
                  name: (srcStr.split('/').pop().split('?')[0]) || 'image'
                });
              };
              retryImg.onerror = () => reject(new Error('Failed to load image from URL: ' + srcStr));
              retryImg.src = srcStr;
            } else {
              reject(new Error('Failed to load image from URL: ' + srcStr));
            }
          };

          img.src = srcStr;
        });
      }
    }

    if (blob) {
      // Try modern createImageBitmap for fast off-thread decoding
      if (typeof createImageBitmap === 'function') {
        try {
          const bitmap = await createImageBitmap(blob);
          return {
            image: bitmap,
            width: bitmap.width,
            height: bitmap.height,
            originalSize: originalSize,
            name: name,
            blob: blob
          };
        } catch (e) {
          // Fallback to standard Image
        }
      }

      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({
            image: img,
            width: img.naturalWidth,
            height: img.naturalHeight,
            originalSize: originalSize,
            name: name,
            blob: blob
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to decode image file'));
        };
        img.src = url;
      });
    }

    throw new Error('Unsupported image source type');
  }

  /**
   * Calculate proportional dimensions with maxDimension limit
   */
  function calculateDimensions(origWidth, origHeight, maxDim) {
    if (!maxDim || maxDim <= 0 || (origWidth <= maxDim && origHeight <= maxDim)) {
      return { width: origWidth, height: origHeight };
    }
    const ratio = Math.min(maxDim / origWidth, maxDim / origHeight);
    return {
      width: Math.max(1, Math.round(origWidth * ratio)),
      height: Math.max(1, Math.round(origHeight * ratio))
    };
  }

  /**
   * Global Image Optimization Engine Core
   */
  class ImageOptimizer {
    constructor() {
      this.capabilities = capabilities;
      this.cache = new Map();
    }

    /**
     * Check if a format is supported for encoding
     */
    isFormatSupported(format) {
      const f = (format || '').toLowerCase();
      if (f === 'webp') return this.capabilities.webpEncoder;
      if (f === 'avif') return this.capabilities.avifEncoder;
      return true;
    }

    /**
     * Determine best modern target format
     */
    resolveTargetFormat(requestedFormat) {
      const req = (requestedFormat || 'auto').toLowerCase();
      if (req === 'avif') {
        return this.capabilities.avifEncoder ? 'avif' : 'webp';
      }
      if (req === 'webp') {
        return 'webp';
      }
      // 'auto': Prefer AVIF if natively supported, otherwise WebP
      return this.capabilities.avifEncoder ? 'avif' : 'webp';
    }

    /**
     * Convert/Optimize a single image source
     * @param {File|Blob|string|HTMLImageElement} source
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    async optimize(source, options = {}) {
      const targetFormat = this.resolveTargetFormat(options.format || 'auto');
      const quality = typeof options.quality === 'number' ? Math.max(0.05, Math.min(1.0, options.quality)) : 0.82;
      const maxDimension = options.maxDimension || 0;
      const preserveIfLarger = options.preserveIfLarger !== false;

      const loaded = await loadImageSource(source);
      const targetDims = calculateDimensions(loaded.width, loaded.height, maxDimension);

      // Create high-resolution canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetDims.width;
      canvas.height = targetDims.height;
      const ctx = canvas.getContext('2d', { alpha: true });

      // Apply high-quality bicubic smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw image
      ctx.drawImage(loaded.image, 0, 0, targetDims.width, targetDims.height);

      const mimeType = targetFormat === 'avif' ? 'image/avif' : 'image/webp';

      // Convert to Blob with robust fallback (toBlob -> toDataURL -> fallback format)
      let exportDataUrl = null;
      const optimizedBlob = await new Promise((resolve, reject) => {
        const tryExport = (mType, q) => {
          let called = false;
          try {
            if (typeof canvas.toBlob === 'function') {
              canvas.toBlob((blob) => {
                if (called) return;
                called = true;
                if (blob) {
                  resolve(blob);
                } else {
                  fallbackDataUrl(mType, q);
                }
              }, mType, q);
            } else {
              fallbackDataUrl(mType, q);
            }
          } catch (err) {
            fallbackDataUrl(mType, q, err);
          }
        };

        const fallbackDataUrl = (mType, q, prevErr) => {
          try {
            const dUrl = canvas.toDataURL(mType, q);
            if (dUrl && dUrl.length > 50) {
              exportDataUrl = dUrl;
              const parts = dUrl.split(',');
              const bstr = atob(parts[1]);
              let n = bstr.length;
              const u8 = new Uint8Array(n);
              while (n--) u8[n] = bstr.charCodeAt(n);
              resolve(new Blob([u8], { type: mType }));
              return;
            }
          } catch (e) {}

          if (mType === 'image/avif') {
            // Fallback to WebP if AVIF is unsupported
            tryExport('image/webp', quality);
          } else if (mType === 'image/webp') {
            // Fallback to JPEG if WebP export fails
            try {
              const jUrl = canvas.toDataURL('image/jpeg', quality);
              exportDataUrl = jUrl;
              const parts = jUrl.split(',');
              const bstr = atob(parts[1]);
              let n = bstr.length;
              const u8 = new Uint8Array(n);
              while (n--) u8[n] = bstr.charCodeAt(n);
              resolve(new Blob([u8], { type: 'image/jpeg' }));
            } catch (finalErr) {
              reject(prevErr || finalErr || new Error('Canvas export failed'));
            }
          } else {
            reject(prevErr || new Error('Canvas export failed'));
          }
        };

        tryExport(mimeType, quality);
      });

      // Cleanup bitmap memory if applicable
      if (loaded.image && typeof loaded.image.close === 'function') {
        loaded.image.close();
      }

      // Check if original is smaller (e.g. tiny 1-bit icons)
      let finalBlob = optimizedBlob;
      let finalFormat = targetFormat;
      let finalMime = mimeType;

      if (preserveIfLarger && loaded.originalSize > 0 && optimizedBlob.size >= loaded.originalSize && (source instanceof File || source instanceof Blob)) {
        finalBlob = source;
        finalFormat = (source.type ? source.type.split('/')[1] : 'original');
        finalMime = source.type || 'image/png';
      }

      const origSize = loaded.originalSize || finalBlob.size;
      const optSize = finalBlob.size;
      const savedBytes = Math.max(0, origSize - optSize);
      const percentSaved = origSize > 0 ? ((savedBytes / origSize) * 100).toFixed(1) : '0.0';

      // Generate new filename
      const baseName = (loaded.name || 'image').replace(/\.[^/.]+$/, '');
      const newFilename = `${baseName}.${finalFormat}`;

      const blobUrl = URL.createObjectURL(finalBlob);

      return {
        success: true,
        blob: finalBlob,
        blobUrl: blobUrl,
        dataUrl: exportDataUrl || blobUrl,
        format: finalFormat,
        mimeType: finalMime,
        filename: newFilename,
        width: targetDims.width,
        height: targetDims.height,
        originalWidth: loaded.width,
        originalHeight: loaded.height,
        originalSize: origSize,
        originalSizeFormatted: formatBytes(origSize),
        optimizedSize: optSize,
        optimizedSizeFormatted: formatBytes(optSize),
        savedBytes: savedBytes,
        savedBytesFormatted: formatBytes(savedBytes),
        percentSaved: percentSaved + '%',
        percentSavedNum: parseFloat(percentSaved),
        quality: quality,
        encoderUsed: finalFormat.toUpperCase()
      };
    }

    /**
     * Batch optimize multiple files or URLs
     * @param {Array} items
     * @param {Object} options
     * @param {Function} onProgress (callback: { current, total, percent, result })
     */
    async batchOptimize(items, options = {}, onProgress = null) {
      if (!Array.isArray(items) || items.length === 0) return [];

      const results = [];
      const total = items.length;
      let totalOrigBytes = 0;
      let totalOptBytes = 0;

      for (let i = 0; i < total; i++) {
        const item = items[i];
        try {
          const res = await this.optimize(item, options);
          results.push(res);
          totalOrigBytes += res.originalSize;
          totalOptBytes += res.optimizedSize;

          if (typeof onProgress === 'function') {
            onProgress({
              current: i + 1,
              total: total,
              percent: Math.round(((i + 1) / total) * 100),
              currentResult: res,
              cumulativeSavedBytes: totalOrigBytes - totalOptBytes
            });
          }
        } catch (err) {
          results.push({
            success: false,
            error: err.message,
            item: item
          });
        }
      }

      return {
        items: results,
        totalItems: total,
        totalOriginalBytes: totalOrigBytes,
        totalOriginalFormatted: formatBytes(totalOrigBytes),
        totalOptimizedBytes: totalOptBytes,
        totalOptimizedFormatted: formatBytes(totalOptBytes),
        totalSavedBytes: Math.max(0, totalOrigBytes - totalOptBytes),
        totalSavedFormatted: formatBytes(Math.max(0, totalOrigBytes - totalOptBytes)),
        overallPercentSaved: totalOrigBytes > 0 ? (((totalOrigBytes - totalOptBytes) / totalOrigBytes) * 100).toFixed(1) + '%' : '0%'
      };
    }

    /**
     * Create high-performance responsive image HTML with lazy loading and async decoding
     */
    createPictureMarkup(src, alt = '', className = '', extraAttrs = '') {
      if (!src) return '';
      const cleanSrc = src.trim();

      return `<img src="${cleanSrc}" alt="${alt}" class="${className}" loading="lazy" decoding="async" onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';if(this.src.endsWith('.webp')){this.src=this.src.replace(/\\.webp$/i,'.png');}else if(this.src.endsWith('.png')){this.src=this.src.replace(/\\.png$/i,'.webp');}}" ${extraAttrs}>`;
    }

    /**
     * Upgrades all <img> elements within a container to use lazy loading and async decoding
     */
    upgradeContainerImages(container) {
      if (!container) return;
      const images = container.querySelectorAll('img:not([data-opt-checked])');
      images.forEach(img => {
        img.setAttribute('data-opt-checked', 'true');
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
    }

    /**
     * Triggers browser download of an optimized Blob
     */
    downloadBlob(blob, filename = 'optimized-image.webp') {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  // Register Global Singleton
  global.HamilioImageOptimizer = new ImageOptimizer();

})(typeof window !== 'undefined' ? window : this);
