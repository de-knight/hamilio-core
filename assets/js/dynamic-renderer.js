/**
 * Dynamic Website Renderer
 * Bridges DataService with index.html to render all sections dynamically.
 */
(function () {
  'use strict';

  async function resolveMediaUrl(url) {
    if (!url) return '';
    if (typeof url === 'string' && url.startsWith('idb:') && window.HamilioMediaStore) {
      return await window.HamilioMediaStore.resolveUrl(url);
    }
    return url;
  }

  function renderHero(hero) {
    if (!hero) return;

    // Name
    const nameEl = document.querySelector('#header h1 a');
    if (nameEl && hero.name) nameEl.textContent = hero.name;

    // Professional Title / Focus (Underlined text inside H2)
    const titleEl = document.querySelector('#header h2 .hero-focus-title') || document.querySelector('#header h2 span');
    if (titleEl && hero.title) titleEl.textContent = hero.title;

    // Hero Tagline / Sub-headline (Paragraph beneath H2)
    const taglineEl = document.querySelector('#header .hero-tagline') || document.querySelector('#hero-tagline-text');
    if (taglineEl) {
      const taglineText = hero.tagline || '';
      if (taglineText.trim()) {
        taglineEl.textContent = taglineText;
        taglineEl.style.display = 'block';
      } else {
        taglineEl.style.display = 'none';
      }
    }

    // Social Links
    if (hero.socialLinks) {
      const socialContainer = document.querySelector('#header .social-links');
      if (socialContainer) {
        const tw = socialContainer.querySelector('.twitter');
        if (tw && hero.socialLinks.twitter) tw.href = hero.socialLinks.twitter;
        const fb = socialContainer.querySelector('.facebook');
        if (fb && hero.socialLinks.facebook) fb.href = hero.socialLinks.facebook;
        const ig = socialContainer.querySelector('.instagram');
        if (ig && hero.socialLinks.instagram) ig.href = hero.socialLinks.instagram;
        const sk = socialContainer.querySelector('.google-plus');
        if (sk && hero.socialLinks.skype) sk.href = hero.socialLinks.skype;
        const li = socialContainer.querySelector('.linkedin');
        if (li && hero.socialLinks.linkedin) li.href = hero.socialLinks.linkedin;
      }
    }

    // Hero WebP / custom background support
    const targetBg = (hero.bgWebp && hero.bgWebp !== 'assets/img/hero-bg.webp') ? hero.bgWebp : (hero.bgFallback && hero.bgFallback !== 'assets/img/bg1-opt.jpg' ? hero.bgFallback : null);
    if (targetBg) {
      resolveMediaUrl(targetBg).then(bgUrl => {
        if (!bgUrl) return;
        const customStyle = document.getElementById('dynamic-bg-style') || document.createElement('style');
        customStyle.id = 'dynamic-bg-style';
        customStyle.textContent = `
          body::before {
            background-image: url('${bgUrl}') !important;
          }
        `;
        if (!document.getElementById('dynamic-bg-style')) {
          document.head.appendChild(customStyle);
        }
      });
    }
  }

  function renderAbout(about) {
    if (!about) return;

    // Profile Image
    const profileImg = document.querySelector('#about .about-me img');
    if (profileImg && about.profileImage) {
      resolveMediaUrl(about.profileImage).then(resolved => {
        profileImg.src = resolved;
      });
    }

    // Headline
    const headlineEl = document.querySelector('#about .about-me .content h3');
    if (headlineEl && about.headline) {
      headlineEl.textContent = about.headline;
    }

    // Quote
    const quoteEl = document.querySelector('#about .about-me .content p.font-italic');
    if (quoteEl && about.quote) {
      quoteEl.textContent = about.quote;
    }

    // Dynamic Age auto-calculation
    if (window.AgeCalculator) {
      window.AgeCalculator.render(about.birthDate || '2004-03-30');
    }

    // Contact metadata
    const infoMap = {
      '#about-website': about.website,
      '#about-phone': about.phone,
      '#about-city': about.city,
      '#about-degree': about.degree,
      '#about-email': about.email,
      '#about-freelance': about.freelance
    };

    Object.keys(infoMap).forEach(selector => {
      const el = document.querySelector(selector);
      if (el && infoMap[selector]) el.textContent = infoMap[selector];
    });

    // Bio
    const bioEl = document.querySelector('#about-bio');
    if (bioEl && about.bio) {
      bioEl.textContent = about.bio;
    }

    // Stats
    if (about.stats) {
      const statMap = {
        '#stat-clients': about.stats.happyClients,
        '#stat-projects': about.stats.projects,
        '#stat-hours': about.stats.supportHours,
        '#stat-workers': about.stats.hardWorkers
      };
      Object.keys(statMap).forEach(selector => {
        const el = document.querySelector(selector);
        if (el && statMap[selector] !== undefined) el.textContent = statMap[selector];
      });
    }
  }

  function renderSkills(skills) {
    const container = document.getElementById('dynamic-skills-container');
    if (!container || !Array.isArray(skills)) return;

    const mid = Math.ceil(skills.length / 2);
    const col1 = skills.slice(0, mid);
    const col2 = skills.slice(mid);

    const renderCol = (list) => {
      return list.map(s => `
        <div class="progress">
          <span class="skill">${s.name} <i class="val">${s.level}%</i></span>
          <div class="progress-bar-wrap">
            <div class="progress-bar" role="progressbar" aria-valuenow="${s.level}" aria-valuemin="0" aria-valuemax="100" style="width: ${s.level}%;"></div>
          </div>
        </div>
      `).join('');
    };

    container.innerHTML = `
      <div class="col-lg-6">${renderCol(col1)}</div>
      <div class="col-lg-6">${renderCol(col2)}</div>
    `;
  }

  function renderServices(services) {
    const container = document.getElementById('dynamic-services-container');
    if (!container || !Array.isArray(services)) return;

    const canonicalTitles = [
      'SEO & Growth Strategy',
      'Web Management & Speed',
      'Creative Direction & Branding',
      'HR Operations & Leadership',
      'B2B Business Development',
      'Multimedia & Video Production'
    ];

    const currentLang = window.SiteI18n ? window.SiteI18n.getLanguage() : 'en';
    let inquireLabel = 'Inquire on WhatsApp';
    if (window.SiteI18n && window.SiteI18n.translations && window.SiteI18n.translations[currentLang] && window.SiteI18n.translations[currentLang].services && window.SiteI18n.translations[currentLang].services.inquireBtn) {
      inquireLabel = window.SiteI18n.translations[currentLang].services.inquireBtn;
    }

    container.innerHTML = services.map((srv, idx) => {
      const canonicalTitle = canonicalTitles[idx] || srv.title;
      const waMsg = srv.whatsappText || `I am interested in your ${canonicalTitle} Service. When can we start?`;
      const waUrl = srv.whatsappUrl || `https://wa.me/8801755069752?text=${encodeURIComponent(waMsg)}`;
      const srvId = srv.id || ('srv' + (idx + 1));

      return `
      <div class="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
        <div class="icon-box" data-service-id="${srvId}" data-wa-url="${waUrl}">
          <div class="icon"><i class="${srv.icon || 'bx bx-layer'}"></i></div>
          <h4><a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="service-link">${srv.title}</a></h4>
          <p>${srv.description}</p>
          <div class="service-action-wrap mt-3">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="service-wa-btn" aria-label="Inquire about ${srv.title} on WhatsApp">
              <i class="bx bxl-whatsapp" aria-hidden="true"></i> <span class="service-btn-text">${inquireLabel}</span>
            </a>
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  function renderResume(resume) {
    if (!resume) return;

    const iframe = document.querySelector('#resume iframe');
    const downloadLink = document.querySelector('#resume a.resume-download-btn');

    if (resume.pdfUrl) {
      resolveMediaUrl(resume.pdfUrl).then(resolved => {
        if (iframe) iframe.src = resolved;
        if (downloadLink) {
          downloadLink.href = resolved;
          if (resume.downloadName) {
            downloadLink.download = resume.downloadName;
          }
        }
      });
    }
  }

  function renderPortfolio(portfolioItems) {
    const container = document.getElementById('dynamic-portfolio-container');
    if (!container || !Array.isArray(portfolioItems)) return;

    let html = '';

    portfolioItems.forEach((item, index) => {
      let mediaMarkup = '';

      if (item.mediaType === 'video') {
        if (window.HamilioVideoOptimizer) {
          mediaMarkup = window.HamilioVideoOptimizer.renderAdaptiveVideo(item, index);
        } else {
          const speedAttr = item.speed ? `data-playback-speed="${item.speed}"` : '';
          mediaMarkup = `
            <video class="img-fluid portfolio-video" controls loop muted playsinline preload="none" ${speedAttr}>
              <source src="${item.mediaUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        }
      } else if (item.mediaType === 'document') {
        mediaMarkup = `
          <div class="portfolio-document-card text-center p-4 bg-dark rounded border border-secondary">
            <i class="icofont-file-pdf text-danger" style="font-size: 4rem;"></i>
            <h5 class="text-white mt-3">${item.title}</h5>
            <a href="${item.mediaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-sm mt-2" aria-label="View Document for ${item.title}">
              <i class="icofont-eye"></i> View Document
            </a>
          </div>
        `;
      } else {
        // Image with WebP/AVIF Picture support
        let extraMarkup = '';
        if (item.extraImages && item.extraImages.length > 0) {
          extraMarkup = item.extraImages.map(img => {
            if (window.HamilioImageOptimizer) {
              return window.HamilioImageOptimizer.createPictureMarkup(img, item.title, 'img-fluid mt-2 rounded');
            }
            return `<img src="${img}" class="img-fluid mt-2 rounded" alt="${item.title}" loading="lazy" decoding="async">`;
          }).join('');
        }

        let mainImgMarkup = '';
        if (window.HamilioImageOptimizer) {
          mainImgMarkup = window.HamilioImageOptimizer.createPictureMarkup(item.mediaUrl, item.title, 'img-fluid rounded');
        } else {
          mainImgMarkup = `<img src="${item.mediaUrl}" class="img-fluid rounded" alt="${item.title}" loading="lazy" decoding="async">`;
        }

        mediaMarkup = `
          <a href="${item.mediaUrl}" data-gall="portfolioDetailsGallery" data-vbtype="image" class="venobox" title="${item.title}" aria-label="View ${item.title}">
            ${mainImgMarkup}
          </a>
          ${extraMarkup}
        `;
      }

      html += `
        <div class="row mb-5" data-aos="fade-right" id="portfolio-${item.id}">
          <div class="col-lg-6">
            ${mediaMarkup}
          </div>
          <div class="col-lg-6 pt-4 pt-lg-0 content">
            <h3>${item.title}</h3>
            <p class="font-italic text-muted">${item.description}</p>
            <ul class="list-unstyled">
              ${item.tools ? `<li><i class="icofont-rounded-right text-success"></i> <strong>Tools Used:</strong> ${item.tools}</li>` : ''}
              ${item.category ? `<li><i class="icofont-rounded-right text-success"></i> <strong>Category:</strong> ${item.category}</li>` : ''}
              ${item.client ? `<li><i class="icofont-rounded-right text-success"></i> <strong>Client:</strong> ${item.client}</li>` : ''}
              ${item.date ? `<li><i class="icofont-rounded-right text-success"></i> <strong>Date:</strong> ${item.date}</li>` : ''}
            </ul>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Resolve any asynchronous media URLs (e.g. from IndexedDB)
    portfolioItems.forEach(async (item) => {
      if (item.mediaUrl && item.mediaUrl.startsWith('idb:')) {
        const resolved = await resolveMediaUrl(item.mediaUrl);
        const cardEl = document.getElementById(`portfolio-${item.id}`);
        if (cardEl) {
          const wrap = cardEl.querySelector('.portfolio-adaptive-video-wrap');
          if (wrap) {
            wrap.setAttribute('data-video-url', resolved);
          }
          const vid = cardEl.querySelector('video');
          if (vid) {
            const src = vid.querySelector('source');
            if (src) src.src = resolved;
            vid.src = resolved;
          }
          const img = cardEl.querySelector('img');
          if (img) img.src = resolved;
          const a = cardEl.querySelector('a.venobox');
          if (a) a.href = resolved;
          const docLink = cardEl.querySelector('.portfolio-document-card a');
          if (docLink) docLink.href = resolved;
        }
      }
    });

    // Initialize Video Optimization Engine on container
    if (window.HamilioVideoOptimizer) {
      window.HamilioVideoOptimizer.initContainers(container);
    }

    // Initialize Global Image Optimization Engine upgrades on container
    if (window.HamilioImageOptimizer) {
      window.HamilioImageOptimizer.upgradeContainerImages(container);
    }

    // Re-initialize venobox for dynamic images if jQuery is loaded
    if (window.jQuery && typeof window.jQuery.fn.venobox === 'function') {
      window.jQuery('.venobox').venobox({
        'share': false
      });
    }
  }

  function initContactForm() {
    const form = document.querySelector('form.php-email-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const loading = form.querySelector('.loading');
      const sentMessage = form.querySelector('.sent-message');
      const errorMessage = form.querySelector('.error-message');

      const name = (form.querySelector('input[name="name"]') || {}).value || '';
      const email = (form.querySelector('input[name="email"]') || {}).value || '';
      const subject = (form.querySelector('input[name="subject"]') || {}).value || '';
      const message = (form.querySelector('textarea[name="message"]') || {}).value || '';

      if (loading) loading.style.display = 'block';
      if (sentMessage) sentMessage.style.display = 'none';
      if (errorMessage) errorMessage.style.display = 'none';

      // Save to DataService (which stores in Admin Inbox and optional Supabase)
      try {
        if (window.PortfolioDataService) {
          window.PortfolioDataService.saveMessage({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
          });
        }

        setTimeout(() => {
          if (loading) loading.style.display = 'none';
          if (sentMessage) {
            sentMessage.textContent = "Your message has been sent directly to Hamim! Thank you.";
            sentMessage.style.display = 'block';
          }
          form.reset();
        }, 500);

      } catch (err) {
        if (loading) loading.style.display = 'none';
        if (errorMessage) {
          errorMessage.textContent = "Something went wrong: " + err.message;
          errorMessage.style.display = 'block';
        }
      }
    });
  }

  function renderSEO(seo) {
    if (!seo) return;

    // Document Language & Translation Attributes
    const lang = seo.language || 'en';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('xml:lang', lang);
    document.documentElement.setAttribute('translate', 'yes');

    let httpLang = document.querySelector('meta[http-equiv="content-language"]');
    if (httpLang) httpLang.setAttribute('content', lang);

    // Document Title
    const title = seo.seoTitle || seo.siteTitle || seo.metaTitle;
    if (title) {
      document.title = title;
    }

    // Meta Description
    if (seo.metaDescription) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', seo.metaDescription);
      }
    }

    // Open Graph
    const ogTitle = seo.socialTitle || title;
    if (ogTitle) {
      const el = document.querySelector('meta[property="og:title"]');
      if (el) el.setAttribute('content', ogTitle);
    }

    const ogDesc = seo.socialDescription || seo.metaDescription;
    if (ogDesc) {
      const el = document.querySelector('meta[property="og:description"]');
      if (el) el.setAttribute('content', ogDesc);
    }

    if (seo.socialImage) {
      resolveMediaUrl(seo.socialImage).then(imgUrl => {
        const el = document.querySelector('meta[property="og:image"]');
        if (el && imgUrl) el.setAttribute('content', imgUrl);
      });
    }

    // Twitter / X
    const twTitle = seo.xTitle || ogTitle;
    if (twTitle) {
      const el = document.querySelector('meta[name="twitter:title"]');
      if (el) el.setAttribute('content', twTitle);
    }

    const twDesc = seo.xDescription || ogDesc;
    if (twDesc) {
      const el = document.querySelector('meta[name="twitter:description"]');
      if (el) el.setAttribute('content', twDesc);
    }

    if (seo.xImage || seo.socialImage) {
      resolveMediaUrl(seo.xImage || seo.socialImage).then(imgUrl => {
        const el = document.querySelector('meta[name="twitter:image"]');
        if (el && imgUrl) el.setAttribute('content', imgUrl);
      });
    }
  }

  function renderCustomization(customization) {
    if (!customization) return;

    // 1. Global Colors
    const colors = customization.colors;
    if (colors) {
      const primary = colors.primaryColor || '#18d26e';
      const hover = colors.primaryHover || '#35e888';
      const bg = colors.backgroundColor || '#040404';
      const cardBg = colors.cardBackground || '#0e0e0e';
      const text = colors.textColor || '#ffffff';
      const muted = colors.textMuted || '#b0b0b0';

      document.documentElement.style.setProperty('--primary-accent', primary);
      document.documentElement.style.setProperty('--primary-hover', hover);
      document.documentElement.style.setProperty('--bg-base', bg);

      let colorStyle = document.getElementById('dynamic-custom-colors');
      if (!colorStyle) {
        colorStyle = document.createElement('style');
        colorStyle.id = 'dynamic-custom-colors';
        document.head.appendChild(colorStyle);
      }

      colorStyle.textContent = `
        :root {
          --primary-color: ${primary} !important;
          --primary-hover: ${hover} !important;
          --bg-color: ${bg} !important;
          --card-bg: ${cardBg} !important;
          --text-color: ${text} !important;
          --text-muted: ${muted} !important;
        }
        body {
          background-color: ${bg} !important;
          color: ${text} !important;
        }
        body::before {
          background-color: ${bg} !important;
        }
        a {
          color: ${primary} !important;
        }
        a:hover {
          color: ${hover} !important;
        }
        #header h2 span {
          color: ${primary} !important;
          border-color: ${primary} !important;
        }
        #header .social-links a:hover {
          background: ${primary} !important;
          color: #fff !important;
        }
        .nav-menu a:before {
          background-color: ${primary} !important;
        }
        .nav-menu .active > a, .nav-menu li:hover > a {
          color: #fff !important;
        }
        .section-title h2::after {
          background: ${primary} !important;
        }
        .about-me .count-box i {
          color: ${primary} !important;
        }
        .skills .progress-bar {
          background-color: ${primary} !important;
        }
        .resume-download-btn, .btn-outline-success {
          color: ${primary} !important;
          border-color: ${primary} !important;
        }
        .resume-download-btn:hover, .btn-outline-success:hover {
          background-color: ${primary} !important;
          border-color: ${primary} !important;
          color: #052e16 !important;
          font-weight: 600 !important;
        }
        .services .icon-box h4 a {
          color: #ffffff !important;
        }
        .services .icon-box h4 a:hover {
          color: ${primary} !important;
        }
        .services .icon-box:hover {
          background-color: ${primary} !important;
          border-color: ${primary} !important;
        }
        .services .icon-box:hover .icon {
          background: #052e16 !important;
        }
        .services .icon-box:hover .icon i {
          color: ${primary} !important;
        }
        .services .icon-box:hover h4 a,
        .services .icon-box:hover p {
          color: #052e16 !important;
        }
        .services .icon-box:hover .service-wa-btn {
          background: #052e16 !important;
          color: ${primary} !important;
          border-color: #052e16 !important;
        }
        .services .icon-box:hover .service-wa-btn:hover {
          background: #021a0c !important;
          color: ${hover} !important;
        }
        .portfolio #portfolio-flters li:hover,
        .portfolio #portfolio-flters li.filter-active {
          background: ${primary} !important;
          color: #052e16 !important;
          font-weight: 600 !important;
        }
        .contact .info-box i {
          color: ${primary} !important;
          background: rgba(255,255,255,0.06) !important;
        }
        .contact .php-email-form button[type="submit"] {
          background: ${primary} !important;
          color: #052e16 !important;
          font-weight: 600 !important;
        }
        .contact .php-email-form button[type="submit"]:hover {
          background: ${hover} !important;
          color: #052e16 !important;
        }
        :focus-visible {
          outline-color: ${primary} !important;
        }
      `;
    }

    // 2. Typography
    const typo = customization.typography;
    if (typo) {
      if (typo.googleFontUrl) {
        let gfLink = document.getElementById('dynamic-google-fonts');
        if (!gfLink) {
          gfLink = document.createElement('link');
          gfLink.id = 'dynamic-google-fonts';
          gfLink.rel = 'stylesheet';
          document.head.appendChild(gfLink);
        }
        if (gfLink.href !== typo.googleFontUrl) {
          gfLink.href = typo.googleFontUrl;
        }
      }

      let fontStyle = document.getElementById('dynamic-custom-fonts');
      if (!fontStyle) {
        fontStyle = document.createElement('style');
        fontStyle.id = 'dynamic-custom-fonts';
        document.head.appendChild(fontStyle);
      }

      let fontFaceRule = '';
      if (typo.customFontName && typo.customFontData) {
        fontFaceRule = `
          @font-face {
            font-family: '${typo.customFontName}';
            src: url('${typo.customFontData}');
            font-display: swap;
          }
        `;
      }

      const bodyFamily = typo.bodyFont || "'Inter', sans-serif";
      const headingFamily = typo.headingFont || "'Inter', sans-serif";

      fontStyle.textContent = `
        ${fontFaceRule}
        body, p, span, a, input, textarea, button {
          font-family: ${bodyFamily} !important;
        }
        h1, h2, h3, h4, h5, h6, .section-title h2, .section-title p {
          font-family: ${headingFamily} !important;
        }
      `;
    }

    // 3. Site Identity (Logo, Site Title, Tagline, Favicon)
    const identity = customization.identity;
    if (identity) {
      const siteTitle = identity.siteTitle || 'Hamim Mahamud Hamy';
      const headerTitleLink = document.querySelector('#header h1 a');
      if (headerTitleLink) {
        if (identity.logoType === 'image' && identity.logoImage) {
          resolveMediaUrl(identity.logoImage).then(logoUrl => {
            if (logoUrl) {
              headerTitleLink.innerHTML = `<img src="${logoUrl}" alt="${siteTitle}" class="img-fluid site-logo-img" style="max-height: 52px; object-fit: contain;">`;
            } else {
              headerTitleLink.textContent = siteTitle;
            }
          });
        } else {
          headerTitleLink.textContent = siteTitle;
        }
      }

      // Brand & Hero Tagline (Does NOT overwrite #header h2 span - that belongs to Professional Title)
      if (identity.tagline) {
        const taglineEl = document.querySelector('#header .hero-tagline') || document.querySelector('#hero-tagline-text');
        if (taglineEl && (!taglineEl.textContent || !taglineEl.textContent.trim())) {
          taglineEl.textContent = identity.tagline;
          taglineEl.style.display = 'block';
        }

        // Set document title if standard template title is active
        const currentDocTitle = document.title;
        if (!currentDocTitle || currentDocTitle.includes('|')) {
          document.title = `${siteTitle} | ${identity.tagline}`;
        }
      }

      // Site Icon / Favicon
      if (identity.siteIcon) {
        resolveMediaUrl(identity.siteIcon).then(iconUrl => {
          if (!iconUrl) return;
          let fav = document.querySelector('link[rel="icon"]');
          if (fav) fav.href = iconUrl;
          let appleFav = document.querySelector('link[rel="apple-touch-icon"]');
          if (appleFav) appleFav.href = iconUrl;
        });
      }
    }
  }

  function renderAll() {
    if (!window.PortfolioDataService) return;
    const data = window.PortfolioDataService.getData();

    // Ensure document translation & language attributes are active
    const docLang = (data.seo && data.seo.language) ? data.seo.language : 'en';
    document.documentElement.lang = docLang;
    document.documentElement.setAttribute('xml:lang', docLang);
    document.documentElement.setAttribute('translate', 'yes');

    renderHero(data.hero);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderServices(data.services);
    renderResume(data.resume);
    renderPortfolio(data.portfolio);
    if (data.seo) renderSEO(data.seo);
    if (data.customization) renderCustomization(data.customization);

    if (window.SiteI18n) {
      window.SiteI18n.reapplyCurrentLanguage();
    }

    // Explicit safeguard: ensure the hero title always matches data.hero.title when viewing in English/default
    if (!window.SiteI18n || window.SiteI18n.getLanguage() === 'en') {
      const titleEl = document.querySelector('#header h2 .hero-focus-title') || document.querySelector('#header h2 span');
      if (titleEl && data.hero && data.hero.title) {
        titleEl.textContent = data.hero.title;
      }
    }

    if (window.HamilioImageOptimizer) {
      window.HamilioImageOptimizer.upgradeContainerImages(document);
    }
  }

  // Initial load
  document.addEventListener('DOMContentLoaded', function () {
    renderAll();
    initContactForm();

    // Ergonomic click delegation for service cards
    const srvContainer = document.getElementById('dynamic-services-container');
    if (srvContainer) {
      srvContainer.addEventListener('click', function (e) {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const card = e.target.closest('.icon-box');
        if (card) {
          const waLink = card.querySelector('a.service-wa-btn') || card.querySelector('h4 a');
          if (waLink && waLink.href && !waLink.href.startsWith('javascript:')) {
            window.open(waLink.href, '_blank', 'noopener,noreferrer');
          }
        }
      });
    }

    // Listen for live updates from admin panel in other tabs
    window.addEventListener('portfolioDataUpdated', function (e) {
      if (e.detail) {
        renderHero(e.detail.hero);
        renderAbout(e.detail.about);
        renderSkills(e.detail.skills);
        renderServices(e.detail.services);
        renderResume(e.detail.resume);
        renderPortfolio(e.detail.portfolio);
        if (e.detail.seo) renderSEO(e.detail.seo);
        if (e.detail.customization) renderCustomization(e.detail.customization);
        if (window.SiteI18n) {
          window.SiteI18n.reapplyCurrentLanguage();
        }
        if (!window.SiteI18n || window.SiteI18n.getLanguage() === 'en') {
          const titleEl = document.querySelector('#header h2 .hero-focus-title') || document.querySelector('#header h2 span');
          if (titleEl && e.detail.hero && e.detail.hero.title) {
            titleEl.textContent = e.detail.hero.title;
          }
        }
      }
    });
  });

  window.DynamicRenderer = {
    renderAll: renderAll
  };
})();
