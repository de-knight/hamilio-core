/**
 * Data Service & Portfolio Data Store
 * Provides real-time dynamic data for the portfolio website and admin management.
 * Supports LocalStorage persistence with optional Supabase cloud synchronization.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'hamilio_portfolio_site_data_v1';
  const MESSAGES_KEY = 'hamilio_portfolio_messages_v1';
  const ANALYTICS_KEY = 'hamilio_visitor_analytics_v1';
  const CONSENT_KEY = 'hamilio_privacy_consent';

  // Complete seed data with modern professional profile and projects
  const DEFAULT_DATA = {
    version: 5,
    hero: {
      name: "Hamim Mahamud Hamy",
      title: "Head of Creative & HR",
      tagline: "Leading creative direction, technical web optimization, SEO strategy, and agile operations at Omega Solution.",
      bgWebp: "",
      bgFallback: "assets/img/bg1-opt.jpg",
      socialLinks: {
        twitter: "https://twitter.com/BdNeck?t=ZFvFV2Ylt7SbBM6ByKal1g&s=08",
        facebook: "https://www.facebook.com/hamimmahamudhamy",
        instagram: "https://www.instagram.com/jst.hamim/",
        skype: "https://join.skype.com/invite/vyOGGHm0eexF",
        linkedin: "https://www.linkedin.com/in/hamim-mahmud"
      }
    },
    about: {
      profileImage: "assets/img/profile-opt.jpg",
      headline: "Head of Creative & HR | Business Management Executive | Digital Strategist",
      quote: "“Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.” — Antoine de Saint-Exupéry",
      birthDate: "2004-03-30",
      website: "hamilio.netlify.app",
      phone: "+880 1755 069752",
      city: "Dhaka, Bangladesh",
      degree: "B.Sc. in CSE (Ongoing) | Diploma in CSE (CGPA 3.54)",
      email: "hmmahmud145@gmail.com",
      freelance: "Available for Consulting & Leadership",
      bio: "Serving as Head of Creative & HR and Business Management Executive at Omega Solution, I bridge technical execution, web optimization, SEO strategy, team administration, and B2B growth. Whether boosting enterprise web performance from 54 to 94 PageSpeed, driving organic visibility through topic clusters, managing client acquisition pipelines, or orchestrating day-to-day HR operations, I translate complex technical workflows into measurable business results.",
      stats: {
        happyClients: 35,
        projects: 120,
        supportHours: 1500,
        hardWorkers: 25
      }
    },
    skills: [
      { id: "s1", name: "SEO & Content Clustering", level: 95 },
      { id: "s2", name: "Web Management & Speed Optimization", level: 92 },
      { id: "s3", name: "Creative Direction & Brand Design", level: 92 },
      { id: "s4", name: "HR Operations & Team Management", level: 90 },
      { id: "s5", name: "B2B Sales & Upwork Pipeline", level: 88 },
      { id: "s6", name: "Multimedia & Video Production", level: 88 }
    ],
    services: [
      {
        id: "srv1",
        title: "SEO & Growth Strategy",
        icon: "bx bx-line-chart",
        description: "Data-driven organic search growth through topic cluster architecture, keyword-targeted content strategies, technical site audits (Semrush/Ahrefs), backlink planning, and Google Search Console indexing.",
        whatsappText: "I am interested in your SEO & Growth Strategy Service. When can we start?"
      },
      {
        id: "srv2",
        title: "Web Management & Speed",
        icon: "bx bx-tachometer",
        description: "End-to-end website administration, landing page engineering, LiteSpeed cache configuration, and mobile speed optimization—elevating mobile PageSpeed from 54 to 94+.",
        whatsappText: "I am interested in your Web Management & Speed Service. When can we start?"
      },
      {
        id: "srv3",
        title: "Creative Direction & Branding",
        icon: "bx bx-paint-roll",
        description: "Comprehensive brand identity systems, high-converting social media creatives, LinkedIn carousel decks, product packaging, and modern visual branding crafted in Photoshop and Illustrator.",
        whatsappText: "I am interested in your Creative Direction & Branding Service. When can we start?"
      },
      {
        id: "srv4",
        title: "HR Operations & Leadership",
        icon: "bx bx-group",
        description: "Operational leadership, agile team monitoring, automated attendance & leave management, intern onboarding, recruitment workflows, and streamlined office administration.",
        whatsappText: "I am interested in your HR Operations & Leadership Service. When can we start?"
      },
      {
        id: "srv5",
        title: "B2B Business Development",
        icon: "bx bx-trending-up",
        description: "Direct client acquisition, high-converting Upwork proposal engineering, marketplace strategy (Fiverr & CodeCanyon), competitor market analysis, and Meta ad campaign management.",
        whatsappText: "I am interested in your B2B Business Development Service. When can we start?"
      },
      {
        id: "srv6",
        title: "Multimedia & Video Production",
        icon: "bx bx-video-recording",
        description: "High-resolution 2K product feature walkthroughs, software demo recordings with OBS & Audacity, promotional video ads, and engaging multimedia storytelling.",
        whatsappText: "I am interested in your Multimedia & Video Production Service. When can we start?"
      }
    ],
    resume: {
      pdfUrl: "assets/img/HamimMahamudHamyCV.pdf",
      downloadName: "HamimMahamudHamyCV.pdf",
      showViewer: true
    },
    portfolio: [
      {
        id: "p1",
        title: "Enterprise Web Optimization & Performance",
        description: "Technical website optimization, LiteSpeed caching configuration, and topic cluster deployment for high-growth software platforms. Successfully boosted mobile performance speed from 54 to 94 and established authoritative organic search visibility.",
        mediaType: "image",
        mediaUrl: "assets/img/Casadecodelogo3d.png",
        tools: "WordPress, LiteSpeed, Google Search Console, Semrush, Custom CSS",
        category: "Web Management & SEO",
        client: "Omega Solution",
        date: "2025 – 2026"
      },
      {
        id: "p2",
        title: "Youtube Intro",
        description: "Offensive Rhino Youtube Intro Video.",
        mediaType: "video",
        mediaUrl: "assets/img/FinalFinal.mp4",
        posterUrl: "assets/img/posters/FinalFinal.webp",
        size: "5.3 MB",
        tools: "Photoshop, Blender, Premiere Pro",
        category: "3D Animation",
        client: "Offensive Rhino",
        date: "2024"
      },
      {
        id: "p3",
        title: "VFX",
        description: "The Lamborghini in this Video is part of VFX.",
        mediaType: "video",
        mediaUrl: "assets/img/vfx0001-0410.mp4",
        posterUrl: "assets/img/posters/vfx0001-0410.webp",
        size: "42 MB",
        tools: "Blender, Premiere Pro",
        category: "VFX",
        client: "Freelance",
        date: "2023"
      },
      {
        id: "p4",
        title: "Offensive Rhino March",
        description: "3d walking T-shirt with Offensive Rhino Branding in it.",
        mediaType: "video",
        mediaUrl: "assets/img/Sequence 01.mp4",
        posterUrl: "assets/img/posters/Sequence_01.webp",
        size: "32 MB",
        tools: "Blender, Premiere Pro",
        category: "Product Advertising",
        client: "Freelance",
        date: "2024"
      },
      {
        id: "p5",
        title: "3D Animation",
        description: "This is the biggest project I have done in 3D animation. My PC reached its limit with this project.",
        mediaType: "video",
        mediaUrl: "assets/img/finals0001-0404.mp4",
        posterUrl: "assets/img/posters/finals0001-0404.webp",
        size: "9.2 MB",
        tools: "Blender, Premiere Pro",
        category: "3D Animation",
        client: "Freelance",
        date: "2023"
      },
      {
        id: "p6",
        title: "3D Loop Video",
        description: "This type of videos can be used in music videos and aesthetic visualizers.",
        mediaType: "video",
        mediaUrl: "assets/img/loop24fps0001-0120.mp4",
        posterUrl: "assets/img/posters/loop24fps0001-0120.webp",
        size: "5.0 MB",
        tools: "Blender, Premiere Pro",
        category: "3D Animation",
        client: "Freelance",
        date: "2022"
      },
      {
        id: "p7",
        title: "Video Editing",
        description: "This clip is from GOT which was later edited and stylized.",
        mediaType: "video",
        mediaUrl: "assets/img/Desktop 2024.06.02 - 02.15.31.09.DVR.mp4",
        posterUrl: "assets/img/posters/Desktop_2024_06_02.webp",
        size: "135 MB",
        tools: "Premiere Pro",
        category: "Video Editing",
        client: "Freelance",
        date: "2024"
      },
      {
        id: "p8",
        title: "Gundam Vector Art",
        description: "This was one of the biggest Vector Art pieces I have done in Photoshop.",
        mediaType: "image",
        mediaUrl: "assets/img/bgp.png",
        tools: "Photoshop",
        category: "Vector Art",
        client: "Personal Project",
        date: "2022"
      },
      {
        id: "p9",
        title: "Mitsubishi Evo",
        description: "A little tribute to my favourite car brand.",
        mediaType: "image",
        mediaUrl: "assets/img/evoV1998vector-opt.jpg",
        tools: "Photoshop",
        category: "Vector Art",
        client: "Personal Project",
        date: "2024"
      },
      {
        id: "p10",
        title: "3D Product Modeling",
        description: "This was later turned into a chilled glass of soft drink.",
        mediaType: "image",
        mediaUrl: "assets/img/mojo-opt.jpg",
        tools: "Premiere Pro, Blender",
        category: "Product Advertising",
        client: "Personal Project",
        date: "2023"
      },
      {
        id: "p11",
        title: "Planet Earth",
        description: "In this Project I used NASA earth Textures to create an Earth accurate to ours in Blender.",
        mediaType: "image",
        mediaUrl: "assets/img/PlanetEarth-opt.jpg",
        tools: "Blender",
        category: "3D Renders",
        client: "Freelance",
        date: "2022"
      },
      {
        id: "p12",
        title: "Logo Designing",
        description: "Logos designed for fashion brand Behula, Alamin Bandhu Shangathan, and CasadeCode.",
        mediaType: "image",
        mediaUrl: "assets/img/behula-opt.jpg",
        extraImages: [
          "assets/img/abs3df.png",
          "assets/img/3.jpg",
          "assets/img/Casadecodelogo3d.png"
        ],
        tools: "Photoshop",
        category: "Logo Designing",
        client: "Personal Project & Clients",
        date: "2023 | 2024"
      },
      {
        id: "p13",
        title: "Vexel Art",
        description: "In this project I turned my portrait into vibrant digital Vexel Art.",
        mediaType: "image",
        mediaUrl: "assets/img/pp1-opt.jpg",
        tools: "Photoshop",
        category: "Digital Art",
        client: "Personal Project",
        date: "2023"
      },
      {
        id: "p14",
        title: "Bedroom",
        description: "A cozy 3D isometric room created out of passion and detail.",
        mediaType: "image",
        mediaUrl: "assets/img/room2-opt.jpg",
        tools: "Photoshop, Blender",
        category: "3D Rendering",
        client: "Personal Project",
        date: "2023"
      },
      {
        id: "p15",
        title: "NFT Art - Frank",
        description: "Original character digital art piece created for NFT collectibles.",
        mediaType: "image",
        mediaUrl: "assets/img/Frank.jpg",
        tools: "Photoshop",
        category: "NFT Art",
        client: "Personal Project",
        date: "2023"
      }
    ],
    seo: {
      siteTitle: "Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive",
      seoTitle: "Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive",
      language: "en",
      metaTitle: "Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive",
      focusKeyphrase: "Head of Creative & HR | Business Management Executive",
      metaDescription: "Official portfolio of Hamim Mahamud Hamy — Head of Creative & HR and Business Management Executive at Omega Solution. Specializing in Web Optimization, SEO Strategy, Creative Direction, and Business Operations.",
      featuredImage: "assets/img/profile-opt.jpg",
      socialTitle: "Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive",
      socialDescription: "Official portfolio of Hamim Mahamud Hamy — Head of Creative & HR and Business Management Executive at Omega Solution. Specializing in Web Optimization, SEO Strategy, Creative Direction, and Business Operations.",
      socialImage: "assets/img/profile-opt.jpg",
      xTitle: "Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive",
      xDescription: "Official portfolio of Hamim Mahamud Hamy — Head of Creative & HR and Business Management Executive at Omega Solution. Specializing in Web Optimization, SEO Strategy, Creative Direction, and Business Operations.",
      xImage: "assets/img/profile-opt.jpg"
    },
    customization: {
      colors: {
        primaryColor: "#18d26e",
        primaryHover: "#35e888",
        backgroundColor: "#040404",
        cardBackground: "#0e0e0e",
        textColor: "#ffffff",
        textMuted: "#b0b0b0"
      },
      typography: {
        headingFont: "'Inter', sans-serif",
        bodyFont: "'Inter', sans-serif",
        googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
        customFontName: "",
        customFontData: ""
      },
      identity: {
        logoType: "text",
        logoImage: "",
        siteTitle: "Hamim Mahamud Hamy",
        tagline: "Leading creative direction, technical web optimization, SEO strategy, and agile operations at Omega Solution.",
        siteIcon: "assets/img/hvec.png"
      }
    },
    config: {
      supabaseUrl: "",
      supabaseKey: "",
      turnstileSiteKey: ""
    }
  };

  class PortfolioDataService {
    constructor() {
      this.cachedData = null;
      this.cachedMessages = null;
    }

    /**
     * Retrieve current site data
     */
    getData() {
      if (this.cachedData) return this.cachedData;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);

          // Auto-upgrade legacy heavy assets to high-performance versions
          if (parsed.about && parsed.about.profileImage === 'assets/img/IMG_9888.png') {
            parsed.about.profileImage = 'assets/img/profile-opt.jpg';
          }
          if (parsed.hero && parsed.hero.bgFallback === 'assets/img/bg1.png') {
            parsed.hero.bgFallback = 'assets/img/bg1-opt.jpg';
          }
          if (parsed.hero && parsed.hero.bgWebp === 'assets/img/hero-bg.webp') {
            parsed.hero.bgWebp = '';
          }
          if (Array.isArray(parsed.portfolio)) {
            parsed.portfolio.forEach(p => {
              if (p.mediaUrl === 'assets/img/behula.png') p.mediaUrl = 'assets/img/behula-opt.jpg';
              if (p.mediaUrl === 'assets/img/room2.png') p.mediaUrl = 'assets/img/room2-opt.jpg';
              if (p.mediaUrl === 'assets/img/evoV1998vector.png') p.mediaUrl = 'assets/img/evoV1998vector-opt.jpg';
              if (p.mediaUrl === 'assets/img/mojo.png') p.mediaUrl = 'assets/img/mojo-opt.jpg';
              if (p.mediaUrl === 'assets/img/pp1.png') p.mediaUrl = 'assets/img/pp1-opt.jpg';
              if (p.mediaUrl === 'assets/img/PlanetEarth.png') p.mediaUrl = 'assets/img/PlanetEarth-opt.jpg';
            });
          }

          if (parsed.hero && parsed.hero.title === 'Head of Creative & HR | Business Management Executive') {
            parsed.hero.title = 'Head of Creative & HR';
          }

          // Automatic Upgrade to Version 2 (Head of Creative & HR / Business Management Executive profile)
          if (!parsed.version || parsed.version < 2) {
            parsed.version = 2;
            if (!parsed.hero) parsed.hero = {};
            parsed.hero.title = DEFAULT_DATA.hero.title;
            parsed.hero.tagline = DEFAULT_DATA.hero.tagline;

            if (!parsed.about) parsed.about = {};
            parsed.about.headline = DEFAULT_DATA.about.headline;
            parsed.about.degree = DEFAULT_DATA.about.degree;
            parsed.about.city = DEFAULT_DATA.about.city;
            parsed.about.freelance = DEFAULT_DATA.about.freelance;
            parsed.about.bio = DEFAULT_DATA.about.bio;
            parsed.about.stats = DEFAULT_DATA.about.stats;

            parsed.skills = DEFAULT_DATA.skills;
            parsed.services = DEFAULT_DATA.services;
            parsed.seo = DEFAULT_DATA.seo;

            if (parsed.customization && parsed.customization.identity) {
              parsed.customization.identity.tagline = DEFAULT_DATA.customization.identity.tagline;
            }

            // Remove legacy cybersecurity projects and add new enterprise web/SEO project
            if (Array.isArray(parsed.portfolio)) {
              parsed.portfolio = parsed.portfolio.filter(p => {
                const cat = (p.category || '').toLowerCase();
                const title = (p.title || '').toLowerCase();
                const tools = (p.tools || '').toLowerCase();
                return !(cat.includes('cyber') || title.includes('vulnerability') || tools.includes('nmap') || tools.includes('nessus'));
              });
              if (!parsed.portfolio.find(p => p.id === 'p1')) {
                parsed.portfolio.unshift(DEFAULT_DATA.portfolio[0]);
              }
            } else {
              parsed.portfolio = DEFAULT_DATA.portfolio;
            }

            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (_) {}
          }

          // Automatic Upgrade to Version 3 (Inter typography standard across site)
          if (!parsed.version || parsed.version < 3) {
            parsed.version = 3;
            if (!parsed.customization) parsed.customization = {};
            if (!parsed.customization.typography) parsed.customization.typography = {};
            if (!parsed.customization.typography.headingFont || parsed.customization.typography.headingFont.includes('Raleway')) {
              parsed.customization.typography.headingFont = DEFAULT_DATA.customization.typography.headingFont;
            }
            if (!parsed.customization.typography.bodyFont || parsed.customization.typography.bodyFont.includes('Open Sans')) {
              parsed.customization.typography.bodyFont = DEFAULT_DATA.customization.typography.bodyFont;
            }
            if (!parsed.customization.typography.googleFontUrl || parsed.customization.typography.googleFontUrl.includes('Open+Sans')) {
              parsed.customization.typography.googleFontUrl = DEFAULT_DATA.customization.typography.googleFontUrl;
            }
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (_) {}
          }

          // Automatic Upgrade to Version 4 (Decouple Professional Title / Focus from Hero Tagline)
          if (!parsed.version || parsed.version < 4) {
            parsed.version = 4;
            if (parsed.hero) {
              if (!parsed.hero.title) parsed.hero.title = DEFAULT_DATA.hero.title;
              if (!parsed.hero.tagline) parsed.hero.tagline = DEFAULT_DATA.hero.tagline;
            }
            if (parsed.customization && parsed.customization.identity) {
              const curTag = (parsed.customization.identity.tagline || '').trim();
              const heroTitle = (parsed.hero && parsed.hero.title ? parsed.hero.title : '').trim();
              if (!curTag || curTag === heroTitle || curTag.toLowerCase().includes('business management executive')) {
                parsed.customization.identity.tagline = (parsed.hero && parsed.hero.tagline) || DEFAULT_DATA.hero.tagline;
              }
            }
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (_) {}
          }

          // Automatic Upgrade to Version 5 (Services WhatsApp preset links & standardized titles)
          if (!parsed.version || parsed.version < 5) {
            parsed.version = 5;
            parsed.services = DEFAULT_DATA.services;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (_) {}
          }

          // Deep merge for seo and customization
          parsed.seo = Object.assign({}, DEFAULT_DATA.seo, parsed.seo || {});
          parsed.customization = Object.assign({}, DEFAULT_DATA.customization, parsed.customization || {});
          if (parsed.customization.colors) {
            parsed.customization.colors = Object.assign({}, DEFAULT_DATA.customization.colors, parsed.customization.colors);
          }
          if (parsed.customization.typography) {
            parsed.customization.typography = Object.assign({}, DEFAULT_DATA.customization.typography, parsed.customization.typography);
          }
          if (parsed.customization.identity) {
            parsed.customization.identity = Object.assign({}, DEFAULT_DATA.customization.identity, parsed.customization.identity);
          }
          this.cachedData = Object.assign({}, DEFAULT_DATA, parsed);
          return this.cachedData;
        }
      } catch (err) {
        console.warn("Failed to load data from localStorage, falling back to defaults", err);
      }

      this.cachedData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      return this.cachedData;
    }

    /**
     * Save site data
     */
    saveData(data) {
      this.cachedData = data;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error("Failed to save data to localStorage:", err);
      }

      // If Supabase credentials are configured, sync to cloud asynchronously
      if (data.config && data.config.supabaseUrl && data.config.supabaseKey) {
        this.syncToSupabase(data);
      }

      // Dispatch event for any active listeners
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: data }));
      return true;
    }

    /**
     * Retrieve contact messages
     */
    getMessages() {
      if (this.cachedMessages) return this.cachedMessages;

      try {
        const stored = localStorage.getItem(MESSAGES_KEY);
        if (stored) {
          this.cachedMessages = JSON.parse(stored);
          return this.cachedMessages;
        }
      } catch (err) {
        console.warn("Failed to read messages from localStorage", err);
      }

      this.cachedMessages = [];
      return this.cachedMessages;
    }

    /**
     * Save incoming contact message
     */
    saveMessage(messageObj) {
      const messages = this.getMessages();
      const newMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: messageObj.name || 'Anonymous',
        email: messageObj.email || '',
        subject: messageObj.subject || 'No Subject',
        message: messageObj.message || '',
        timestamp: new Date().toISOString(),
        read: false
      };

      messages.unshift(newMessage);
      this.cachedMessages = messages;

      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error("Storage full or error saving message:", err);
      }

      // Dispatch event
      window.dispatchEvent(new CustomEvent('newContactMessage', { detail: newMessage }));
      return newMessage;
    }

    /**
     * Delete a single message by ID
     */
    deleteMessage(id) {
      let messages = this.getMessages();
      messages = messages.filter(m => m.id !== id);
      this.cachedMessages = messages;
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error("Error saving after delete:", err);
      }
      return messages;
    }

    /**
     * Delete multiple messages by an array of IDs
     */
    deleteMessages(ids) {
      if (!Array.isArray(ids) || ids.length === 0) return this.getMessages();
      const idSet = new Set(ids);
      let messages = this.getMessages();
      messages = messages.filter(m => !idSet.has(m.id));
      this.cachedMessages = messages;
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error("Error saving after batch delete:", err);
      }
      return messages;
    }

    /**
     * Mark a message as read
     */
    markMessageRead(id) {
      const messages = this.getMessages();
      const target = messages.find(m => m.id === id);
      if (target) {
        target.read = true;
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      }
      return messages;
    }

    /**
     * Purge / clear all messages to free storage
     */
    clearAllMessages() {
      this.cachedMessages = [];
      try {
        localStorage.removeItem(MESSAGES_KEY);
      } catch (err) {
        console.error("Error clearing messages:", err);
      }
      return [];
    }

    /**
     * Reset everything to factory defaults
     */
    resetDefaults() {
      this.cachedData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cachedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: this.cachedData }));
      return this.cachedData;
    }

    /**
     * Export all data as JSON file for backup
     */
    exportJSON() {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        siteData: this.getData(),
        messages: this.getMessages()
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hamilio-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    /**
     * Import data from JSON string
     */
    importJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.siteData) {
          this.saveData(parsed.siteData);
        }
        if (parsed.messages && Array.isArray(parsed.messages)) {
          this.cachedMessages = parsed.messages;
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(parsed.messages));
        }
        return { success: true };
      } catch (err) {
        console.error("Import failed:", err);
        return { success: false, error: err.message };
      }
    }

    /**
     * Asynchronous Cloud Sync (Supabase)
     */
    async syncToSupabase(data) {
      try {
        const { supabaseUrl, supabaseKey } = data.config;
        if (!supabaseUrl || !supabaseKey) return;

        // Upsert site_settings
        const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/site_settings?id=eq.default`;
        await fetch(endpoint, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            data: data,
            updated_at: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn("Supabase sync warning:", err);
      }
    }

    /**
     * Privacy & Cookie Consent Methods
     */
    getConsentStatus() {
      try {
        return localStorage.getItem(CONSENT_KEY);
      } catch (e) {
        return null;
      }
    }

    setConsentStatus(status) {
      try {
        localStorage.setItem(CONSENT_KEY, status);
        window.dispatchEvent(new CustomEvent('privacyConsentChanged', { detail: { status } }));
      } catch (e) {
        console.error("Failed to save consent status:", e);
      }
      return status;
    }

    /**
     * Visitor Analytics Retrieval & Persistence
     */
    getVisitorAnalytics() {
      try {
        const raw = localStorage.getItem(ANALYTICS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Purge demo sessions if any exist
          if (Array.isArray(parsed.sessions) && (parsed.sessions.some(s => s.id && s.id.startsWith('sess_demo_')) || parsed.summary?.totalVisits === 1248)) {
            const realSessions = parsed.sessions.filter(s => s.id && !s.id.startsWith('sess_demo_'));
            const clean = this.getEmptyVisitorAnalytics();
            realSessions.forEach(s => {
              clean.sessions.push(s);
              const cCode = s.countryCode || 'UNK';
              if (!clean.countryCounts[cCode]) {
                clean.countryCounts[cCode] = { name: s.country || 'Global Visitor', count: 0, flag: s.flag || '🌐' };
              }
              clean.countryCounts[cCode].count += 1;
              const dev = s.device || 'Desktop';
              clean.deviceCounts[dev] = (clean.deviceCounts[dev] || 0) + 1;
              const br = s.browser || 'Chrome';
              clean.browserCounts[br] = (clean.browserCounts[br] || 0) + 1;
              const day = (s.timestamp || '').slice(0, 10);
              if (day) clean.dailyCounts[day] = (clean.dailyCounts[day] || 0) + 1;
            });
            clean.summary.totalVisits = realSessions.length;
            clean.summary.uniqueVisitors = new Set(realSessions.map(s => s.id)).size;
            clean.summary.totalStayingTimeSeconds = realSessions.reduce((acc, s) => acc + (s.stayingTimeSeconds || 0), 0);
            if (clean.summary.totalVisits > 0) {
              clean.summary.avgStayingTimeSeconds = Math.round(clean.summary.totalStayingTimeSeconds / clean.summary.totalVisits);
            }
            clean.summary.consentAccepted = realSessions.filter(s => s.consent === 'accepted').length;
            clean.summary.consentRejected = realSessions.filter(s => s.consent === 'rejected').length;
            this.saveVisitorAnalytics(clean);
            return clean;
          }
          return parsed;
        }
      } catch (e) {
        console.warn("Error reading analytics:", e);
      }
      // If empty, initialize clean zero-state (100% REAL)
      const clean = this.getEmptyVisitorAnalytics();
      this.saveVisitorAnalytics(clean);
      return clean;
    }

    saveVisitorAnalytics(analytics) {
      try {
        analytics.lastUpdated = new Date().toISOString();
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
        window.dispatchEvent(new CustomEvent('visitorAnalyticsUpdated', { detail: analytics }));
      } catch (e) {
        console.error("Failed to save visitor analytics:", e);
      }
      return analytics;
    }

    /**
     * Record a new or active visitor session
     */
    recordVisitorSession(session) {
      const data = this.getVisitorAnalytics();
      if (!data.summary) {
        data.summary = { totalVisits: 0, uniqueVisitors: 0, totalStayingTimeSeconds: 0, avgStayingTimeSeconds: 0, consentAccepted: 0, consentRejected: 0 };
      }
      if (!Array.isArray(data.sessions)) data.sessions = [];
      if (!data.countryCounts) data.countryCounts = {};
      if (!data.browserCounts) data.browserCounts = {};
      if (!data.deviceCounts) data.deviceCounts = {};
      if (!data.dailyCounts) data.dailyCounts = {};

      const existingIndex = data.sessions.findIndex(s => s.id === session.id);
      const isNewSession = existingIndex === -1;

      if (isNewSession) {
        data.summary.totalVisits = (data.summary.totalVisits || 0) + 1;
        data.summary.uniqueVisitors = (data.summary.uniqueVisitors || 0) + 1;
        
        if (session.consent === 'accepted') {
          data.summary.consentAccepted = (data.summary.consentAccepted || 0) + 1;
        } else if (session.consent === 'rejected') {
          data.summary.consentRejected = (data.summary.consentRejected || 0) + 1;
        }

        // Increment Country
        const cCode = session.countryCode || 'UNK';
        if (!data.countryCounts[cCode]) {
          data.countryCounts[cCode] = {
            name: session.country || 'Global Visitor',
            count: 0,
            flag: session.flag || '🌐'
          };
        }
        data.countryCounts[cCode].count += 1;

        // Increment Device
        const dev = session.device || 'Desktop';
        data.deviceCounts[dev] = (data.deviceCounts[dev] || 0) + 1;

        // Increment Browser
        const br = session.browser || 'Chrome';
        data.browserCounts[br] = (data.browserCounts[br] || 0) + 1;

        // Daily count
        const todayKey = new Date().toISOString().slice(0, 10);
        data.dailyCounts[todayKey] = (data.dailyCounts[todayKey] || 0) + 1;

        data.sessions.unshift(session);
        if (data.sessions.length > 100) {
          data.sessions = data.sessions.slice(0, 100);
        }
      } else {
        // Update existing session
        const oldTime = data.sessions[existingIndex].stayingTimeSeconds || 0;
        const newTime = session.stayingTimeSeconds || oldTime;
        const diff = Math.max(0, newTime - oldTime);

        data.summary.totalStayingTimeSeconds = (data.summary.totalStayingTimeSeconds || 0) + diff;
        if (data.summary.totalVisits > 0) {
          data.summary.avgStayingTimeSeconds = Math.round(data.summary.totalStayingTimeSeconds / data.summary.totalVisits);
        }

        data.sessions[existingIndex] = { ...data.sessions[existingIndex], ...session };
      }

      this.saveVisitorAnalytics(data);
      return data;
    }

    /**
     * Heartbeat update for staying duration
     */
    updateVisitorStayingTime(sessionId, stayingTimeSeconds) {
      const data = this.getVisitorAnalytics();
      if (!Array.isArray(data.sessions)) return data;

      const session = data.sessions.find(s => s.id === sessionId);
      if (session) {
        const oldTime = session.stayingTimeSeconds || 0;
        const diff = Math.max(0, stayingTimeSeconds - oldTime);
        session.stayingTimeSeconds = stayingTimeSeconds;
        session.lastActive = new Date().toISOString();

        data.summary.totalStayingTimeSeconds = (data.summary.totalStayingTimeSeconds || 0) + diff;
        if (data.summary.totalVisits > 0) {
          data.summary.avgStayingTimeSeconds = Math.round(data.summary.totalStayingTimeSeconds / data.summary.totalVisits);
        }
        this.saveVisitorAnalytics(data);
      }
      return data;
    }

    /**
     * Clean Empty Zero-State for 100% Real Visitor Analytics
     */
    getEmptyVisitorAnalytics() {
      return {
        summary: {
          totalVisits: 0,
          uniqueVisitors: 0,
          totalStayingTimeSeconds: 0,
          avgStayingTimeSeconds: 0,
          consentAccepted: 0,
          consentRejected: 0
        },
        sessions: [],
        countryCounts: {},
        browserCounts: {},
        deviceCounts: {},
        dailyCounts: {},
        durationBuckets: { bounce: 0, skim: 0, engaged: 0, deep: 0, fan: 0 },
        sectionsViewed: {},
        lastUpdated: new Date().toISOString()
      };
    }

    /**
     * Reset analytics to zero
     */
    resetVisitorAnalytics() {
      const clean = this.getEmptyVisitorAnalytics();
      this.saveVisitorAnalytics(clean);
      return clean;
    }
  }

  // Register globally
  window.PortfolioDataService = new PortfolioDataService();
})();
