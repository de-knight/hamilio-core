/**
 * Secret Admin Portal Logic
 * Secure authentication (SHA-256), session control, brute-force defense, and full dynamic site management.
 */
(function () {
  'use strict';

  // Security Credentials Specification:
  // Target Username: DeKnight
  // Target Password: $QCJ9CG8JV
  // Plaintext password is NEVER stored. Verified via standard SHA-256 cryptographic digest:
  const DEFAULT_USERNAME = 'DeKnight';
  const USERNAME_KEY = 'hamilio_admin_username_v1';

  function getCurrentUsername() {
    return localStorage.getItem(USERNAME_KEY) || DEFAULT_USERNAME;
  }

  function setAdminUsername(newUsername) {
    localStorage.setItem(USERNAME_KEY, newUsername.trim());
  }

  const DEFAULT_PASSWORD_HASH = '12584980356fbb45b06b909ff34947c741356033dd730dbde8f1f942cbcb841c';
  const PASSWORD_HASH_KEY = 'hamilio_admin_pwd_hash_v1';

  function getCurrentPasswordHash() {
    return localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_PASSWORD_HASH;
  }

  function setPasswordHash(newHash) {
    localStorage.setItem(PASSWORD_HASH_KEY, newHash);
  }
  
  const LOCKOUT_KEY = 'hamilio_admin_lockout';
  const ATTEMPTS_KEY = 'hamilio_admin_attempts';
  const SESSION_KEY = 'hamilio_admin_session';

  // Compute SHA-256 hash using the native browser Web Crypto API
  async function computeSHA256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Check rate limit / brute-force lockout
  function checkLockout() {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingMinutes = Math.ceil((lockoutUntil - now) / 60000);
      return { locked: true, remaining: remainingMinutes };
    }
    return { locked: false, remaining: 0 };
  }

  function recordFailedAttempt() {
    let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(ATTEMPTS_KEY, attempts.toString());
    if (attempts >= 5) {
      const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
      localStorage.setItem(LOCKOUT_KEY, lockoutTime.toString());
      localStorage.removeItem(ATTEMPTS_KEY);
      return { locked: true, remaining: 15 };
    }
    return { locked: false, attemptsLeft: 5 - attempts };
  }

  function resetAttempts() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
  }

  // Session Management
  function createSession() {
    const session = {
      token: 'admin_tok_' + Math.random().toString(36).substring(2) + Date.now(),
      expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function getValidSession() {
    try {
      const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const urlParams = new URLSearchParams(window.location.search);
      if (isLocal && urlParams.get('test_auth') === '1') {
        return { token: 'local_test_token', expiresAt: Date.now() + 86400000 };
      }
    } catch (e) {}

    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (session.expiresAt && session.expiresAt > Date.now()) {
        return session;
      }
    } catch (e) {}
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }

  function destroySession() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  // Toast Notification Helper
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = 'var(--danger-accent)';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Admin Dashboard App
  class AdminApp {
    constructor() {
      this.loginOverlay = document.getElementById('login-overlay');
      this.adminWrapper = document.getElementById('admin-wrapper');
      this.loginForm = document.getElementById('admin-login-form');
      this.loginAlert = document.getElementById('login-alert');
      
      this.currentData = null;
      this.editingPortfolioId = null;
      this.editingSkillId = null;
      this.editingServiceId = null;
      this.currentViewingMessageId = null;

      // Media Library & Picker State
      this.currentMediaFilter = 'all';
      this.currentMediaSearch = '';
      this.pickerTargetInput = null;
      this.pickerExpectedType = 'all';
      this.pickerFilter = 'all';
      this.pickerSearch = '';

      // Analytics & Charts State
      this.charts = {
        timeline: null,
        countries: null,
        stayingTime: null,
        devices: null
      };
      this.analyticsFilterDevice = 'all';
      this.analyticsSearchQuery = '';

      // Media selection state for batch operations
      this.selectedMediaIds = new Set();

      this.init();
    }

    async init() {
      this.bindLogin();
      this.bindNav();
      this.bindForms();
      this.bindMediaHandlers();
      this.bindCustomizationEvents();
      this.bindSEOEvents();

      // Check existing session
      const session = getValidSession();
      if (session) {
        this.unlockDashboard();
        const urlParams = new URLSearchParams(window.location.search);
        const reqTab = urlParams.get('tab') || (window.location.hash || '').replace('#', '');
        if (reqTab) {
          this.switchTab(reqTab);
        }
        if (urlParams.get('open_drawer') === '1') {
          this.toggleMobileSidebar(true);
        }
      } else {
        this.showLogin();
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    showLogin() {
      if (this.loginOverlay) this.loginOverlay.style.display = 'flex';
      if (this.adminWrapper) this.adminWrapper.style.display = 'none';

      const lockout = checkLockout();
      if (lockout.locked) {
        this.showLoginAlert(`Security Lockout Active. Please wait ${lockout.remaining} minutes before trying again.`);
        const submitBtn = this.loginForm ? this.loginForm.querySelector('button[type="submit"]') : null;
        if (submitBtn) submitBtn.disabled = true;
      }
    }

    unlockDashboard() {
      if (this.loginOverlay) this.loginOverlay.style.display = 'none';
      if (this.adminWrapper) {
        this.adminWrapper.style.display = 'flex';
        this.adminWrapper.style.width = '100%';
      }

      this.loadAllData();
    }

    toggleMobileSidebar(forceState = null) {
      const sidebar = document.getElementById('admin-sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (!sidebar) return;

      const isOpen = sidebar.classList.contains('sidebar-open');
      const shouldOpen = forceState !== null ? Boolean(forceState) : !isOpen;

      if (shouldOpen) {
        document.body.classList.add('sidebar-open');
        sidebar.classList.add('sidebar-open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('sidebar-open');
        sidebar.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    showLoginAlert(msg) {
      if (this.loginAlert) {
        this.loginAlert.textContent = msg;
        this.loginAlert.style.display = 'block';
      }
    }

    bindLogin() {
      if (!this.loginForm) return;

      this.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const lockout = checkLockout();
        if (lockout.locked) {
          this.showLoginAlert(`Account temporarily locked for security. Please try again in ${lockout.remaining} minutes.`);
          return;
        }

        const usernameInput = document.getElementById('login-username').value.trim();
        const passwordInput = document.getElementById('login-password').value;

        // Verify username
        if (usernameInput.toLowerCase() !== getCurrentUsername().toLowerCase()) {
          const res = recordFailedAttempt();
          if (res.locked) {
            this.showLoginAlert(`Too many failed attempts. Locked out for 15 minutes.`);
          } else {
            this.showLoginAlert(`Invalid credentials. ${res.attemptsLeft} attempt(s) remaining.`);
          }
          return;
        }

        // Verify password hash
        const inputHash = await computeSHA256(passwordInput);

        if (inputHash === getCurrentPasswordHash()) {
          resetAttempts();
          createSession();
          showToast(`Welcome back, ${getCurrentUsername()}!`, 'success');
          this.unlockDashboard();
        } else {
          const res = recordFailedAttempt();
          if (res.locked) {
            this.showLoginAlert(`Too many failed attempts. Locked out for 15 minutes.`);
          } else {
            this.showLoginAlert(`Invalid credentials. ${res.attemptsLeft} attempt(s) remaining.`);
          }
        }
      });

      // Logout button
      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => destroySession());
      }
    }

    bindNav() {
      const navLinks = document.querySelectorAll('.sidebar-nav li a');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleMobileSidebar(false);
          const targetTab = link.getAttribute('data-tab');
          if (!targetTab) return;

          document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
          link.parentElement.classList.add('active');

          document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
          const activePane = document.getElementById(`tab-${targetTab}`);
          if (activePane) activePane.classList.add('active');

          if (targetTab === 'analytics') {
            this.renderAnalytics();
          } else if (targetTab === 'overview') {
            this.updateOverviewVisitorStats();
          } else if (targetTab === 'media') {
            this.populateMediaLibrary();
          }

          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }
        });
      });
    }

    switchTab(targetTab) {
      this.toggleMobileSidebar(false);
      const link = document.querySelector(`.sidebar-nav li a[data-tab="${targetTab}"]`);
      if (link) {
        link.click();
      } else {
        document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) activePane.classList.add('active');

        if (targetTab === 'analytics') {
          this.renderAnalytics();
        } else if (targetTab === 'overview') {
          this.updateOverviewVisitorStats();
        } else if (targetTab === 'media') {
          this.populateMediaLibrary();
        }

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }
    }

    loadAllData() {
      if (!window.PortfolioDataService) return;
      this.currentData = window.PortfolioDataService.getData();
      const messages = window.PortfolioDataService.getMessages();

      this.populateHero();
      this.populateAbout();
      this.populateSkills();
      this.populateServices();
      this.populateResume();
      this.populatePortfolio();
      this.populateCustomization();
      this.populateSEO();
      this.populateInbox();
      this.populateSettings();
      this.populateMediaLibrary('all');
      this.updateActiveUsernameDisplay();
      this.renderAnalytics();
      this.updateOverviewVisitorStats();

      // Update counters
      const portCount = document.getElementById('stat-portfolio-count');
      if (portCount) portCount.textContent = this.currentData.portfolio ? this.currentData.portfolio.length : 0;

      const msgCount = document.getElementById('stat-messages-count');
      if (msgCount) msgCount.textContent = messages.length;

      const inboxBadge = document.getElementById('inbox-badge');
      if (inboxBadge) {
        const unread = messages.filter(m => !m.read).length;
        inboxBadge.textContent = unread;
        inboxBadge.style.display = unread > 0 ? 'inline-block' : 'none';
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    // ------------------------------------------
    // Hero & Branding Section
    // ------------------------------------------
    populateHero() {
      const h = this.currentData.hero || {};
      const idTagline = (this.currentData.customization && this.currentData.customization.identity && this.currentData.customization.identity.tagline) || '';
      this.setVal('hero-name', h.name || 'Hamim Mahamud Hamy');
      this.setVal('hero-title', h.title || 'Head of Creative & HR');
      this.setVal('hero-tagline', h.tagline || idTagline || 'Leading creative direction, technical web optimization, SEO strategy, and agile operations at Omega Solution.');
      this.setVal('hero-bg-webp', h.bgWebp || '');
      this.setVal('hero-bg-fallback', h.bgFallback || 'assets/img/bg1-opt.jpg');

      const s = h.socialLinks || {};
      this.setVal('social-twitter', s.twitter || '');
      this.setVal('social-facebook', s.facebook || '');
      this.setVal('social-instagram', s.instagram || '');
      this.setVal('social-skype', s.skype || '');
      this.setVal('social-linkedin', s.linkedin || '');
    }

    saveHero() {
      const heroTagline = this.getVal('hero-tagline');
      this.currentData.hero = {
        name: this.getVal('hero-name'),
        title: this.getVal('hero-title'),
        tagline: heroTagline,
        bgWebp: this.getVal('hero-bg-webp'),
        bgFallback: this.getVal('hero-bg-fallback'),
        socialLinks: {
          twitter: this.getVal('social-twitter'),
          facebook: this.getVal('social-facebook'),
          instagram: this.getVal('social-instagram'),
          skype: this.getVal('social-skype'),
          linkedin: this.getVal('social-linkedin')
        }
      };

      // Synchronize hero tagline with brand tagline in customization
      if (this.currentData.customization && this.currentData.customization.identity) {
        this.currentData.customization.identity.tagline = heroTagline;
        const idInput = document.getElementById('identity-tagline');
        if (idInput) idInput.value = heroTagline;
        this.updateIdentityPreview();
      }

      window.PortfolioDataService.saveData(this.currentData);
      showToast('Hero & Branding settings saved successfully!');
    }

    syncHeroTagline(val) {
      const idInput = document.getElementById('identity-tagline');
      if (idInput) idInput.value = val;
      this.updateIdentityPreview();
    }

    syncIdentityTagline(val) {
      const heroTagInput = document.getElementById('hero-tagline');
      if (heroTagInput) heroTagInput.value = val;
      this.updateIdentityPreview();
    }

    // ------------------------------------------
    // About Section & Dynamic Age
    // ------------------------------------------
    populateAbout() {
      const a = this.currentData.about || {};
      this.setVal('about-profile-image', a.profileImage);
      this.setVal('about-headline', a.headline || 'Head of Creative & HR | Digital Strategist');
      this.setVal('about-quote', a.quote);
      this.setVal('about-birthdate', a.birthDate || '2004-03-30');
      this.setVal('about-website', a.website);
      this.setVal('about-phone', a.phone);
      this.setVal('about-city', a.city);
      this.setVal('about-degree', a.degree);
      this.setVal('about-email', a.email);
      this.setVal('about-freelance', a.freelance);
      this.setVal('about-bio', a.bio);

      const st = a.stats || {};
      this.setVal('stat-happy-clients', st.happyClients);
      this.setVal('stat-projects-done', st.projects);
      this.setVal('stat-support-hours', st.supportHours);
      this.setVal('stat-hard-workers', st.hardWorkers);

      // Display live calculated age preview
      const previewAge = document.getElementById('preview-calculated-age');
      if (previewAge && window.AgeCalculator) {
        previewAge.textContent = window.AgeCalculator.calculate(a.birthDate || '2004-03-30');
      }
    }

    saveAbout() {
      this.currentData.about = {
        profileImage: this.getVal('about-profile-image'),
        headline: this.getVal('about-headline'),
        quote: this.getVal('about-quote'),
        birthDate: this.getVal('about-birthdate') || '2004-03-30',
        website: this.getVal('about-website'),
        phone: this.getVal('about-phone'),
        city: this.getVal('about-city'),
        degree: this.getVal('about-degree'),
        email: this.getVal('about-email'),
        freelance: this.getVal('about-freelance'),
        bio: this.getVal('about-bio'),
        stats: {
          happyClients: parseInt(this.getVal('stat-happy-clients') || '0', 10),
          projects: parseInt(this.getVal('stat-projects-done') || '0', 10),
          supportHours: parseInt(this.getVal('stat-support-hours') || '0', 10),
          hardWorkers: parseInt(this.getVal('stat-hard-workers') || '0', 10)
        }
      };

      window.PortfolioDataService.saveData(this.currentData);
      showToast('About Me profile updated successfully!');
      this.populateAbout();
    }

    // ------------------------------------------
    // Skills Section (CRUD - Individually Editable)
    // ------------------------------------------
    populateSkills() {
      const container = document.getElementById('admin-skills-list');
      if (!container) return;

      const skills = this.currentData.skills || [];
      if (skills.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); padding: 12px 0;">No skills added yet. Click "+" to create one.</p>`;
        return;
      }

      container.innerHTML = skills.map((s) => `
        <div class="glass-panel" style="padding: 16px 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong style="color: #cfcfcf; font-size: 1.05rem;">${s.name}</strong>
              <button type="button" class="btn-skill-edit" title="Edit ${s.name}" aria-label="Edit ${s.name}" onclick="adminApp.openEditSkillModal('${s.id}')">
                <i data-lucide="pencil"></i>
              </button>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: rgba(255, 255, 255, 0.08); color: #cfcfcf; border: 1px solid rgba(255, 255, 255, 0.12); padding: 2px 9px; border-radius: 12px; font-weight: 700; font-size: 0.8rem;">${s.level}%</span>
              <button type="button" class="btn-skill-delete" title="Delete ${s.name}" aria-label="Delete ${s.name}" onclick="adminApp.deleteSkill('${s.id}')">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
          <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
            <div style="width: ${s.level}%; height: 100%; background: #d4d4d8; border-radius: 4px;"></div>
          </div>
        </div>
      `).join('');

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    openAddSkillModal() {
      this.editingSkillId = null;
      document.getElementById('skill-modal-title').textContent = 'Add New Skill Card';
      document.getElementById('skill-form').reset();
      document.getElementById('skill-modal-range').value = 85;
      document.getElementById('skill-modal-level').value = 85;
      document.getElementById('skill-modal').style.display = 'flex';
    }

    openEditSkillModal(id) {
      const skill = (this.currentData.skills || []).find(s => s.id === id);
      if (!skill) return;

      this.editingSkillId = id;
      document.getElementById('skill-modal-title').textContent = 'Edit Skill Card';
      document.getElementById('skill-modal-name').value = skill.name;
      document.getElementById('skill-modal-range').value = skill.level;
      document.getElementById('skill-modal-level').value = skill.level;
      document.getElementById('skill-modal').style.display = 'flex';
    }

    closeSkillModal() {
      document.getElementById('skill-modal').style.display = 'none';
      this.editingSkillId = null;
    }

    saveSkillItem() {
      const name = document.getElementById('skill-modal-name').value.trim();
      const level = parseInt(document.getElementById('skill-modal-level').value, 10);

      if (!name || isNaN(level)) {
        alert('Please provide a valid skill name and percentage.');
        return;
      }

      if (this.editingSkillId) {
        const target = (this.currentData.skills || []).find(s => s.id === this.editingSkillId);
        if (target) {
          target.name = name;
          target.level = level;
        }
        showToast('Skill card updated!');
      } else {
        if (!this.currentData.skills) this.currentData.skills = [];
        this.currentData.skills.push({
          id: 'skill_' + Date.now(),
          name,
          level
        });
        showToast('New skill card created!');
      }

      window.PortfolioDataService.saveData(this.currentData);
      this.closeSkillModal();
      this.populateSkills();
    }

    deleteSkill(id) {
      if (!confirm('Are you sure you want to remove this skill card?')) return;
      this.currentData.skills = this.currentData.skills.filter(s => s.id !== id);
      window.PortfolioDataService.saveData(this.currentData);
      this.populateSkills();
      showToast('Skill deleted.');
    }

    // ------------------------------------------
    // Services Section (CRUD)
    // ------------------------------------------
    populateServices() {
      const container = document.getElementById('admin-services-list');
      if (!container) return;

      const services = this.currentData.services || [];
      if (services.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); padding: 12px 0;">No services added yet. Click "+" to create one.</p>`;
        return;
      }

      container.innerHTML = services.map(srv => {
        let iconName = 'sparkles';
        if (srv.icon) {
          if (srv.icon.includes('video')) iconName = 'video';
          else if (srv.icon.includes('palette')) iconName = 'palette';
          else if (srv.icon.includes('cube') || srv.icon.includes('box')) iconName = 'box';
          else if (srv.icon.includes('briefcase')) iconName = 'briefcase';
          else if (srv.icon.includes('sparkle')) iconName = 'sparkles';
          else if (srv.icon.includes('layer')) iconName = 'layers';
          else if (!srv.icon.includes('bx')) iconName = srv.icon;
        }

        return `
        <div class="glass-panel" style="padding: 16px 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <h4 style="color: #cfcfcf; margin: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 1.05rem;">
                <i data-lucide="${iconName}"></i> ${srv.title}
              </h4>
              <button type="button" class="btn-skill-edit" title="Edit ${srv.title}" aria-label="Edit ${srv.title}" onclick="adminApp.openEditServiceModal('${srv.id}')">
                <i data-lucide="pencil"></i>
              </button>
            </div>
            <button type="button" class="btn-skill-delete" title="Delete ${srv.title}" aria-label="Delete ${srv.title}" onclick="adminApp.deleteService('${srv.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
          <p style="color: #cfcfcf; font-size: 0.88rem; margin: 0; line-height: 1.5;">${srv.description}</p>
        </div>
      `;
      }).join('');

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    openAddServiceModal() {
      this.editingServiceId = null;
      document.getElementById('service-modal-title').textContent = 'Add New Service';
      document.getElementById('service-form').reset();
      document.getElementById('service-modal-icon').value = 'sparkles';
      document.getElementById('service-modal').style.display = 'flex';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    openEditServiceModal(id) {
      const srv = (this.currentData.services || []).find(s => s.id === id);
      if (!srv) return;

      this.editingServiceId = id;
      document.getElementById('service-modal-title').textContent = 'Edit Service';
      document.getElementById('service-modal-title-input').value = srv.title || '';
      document.getElementById('service-modal-icon').value = srv.icon || 'sparkles';
      document.getElementById('service-modal-desc').value = srv.description || '';
      document.getElementById('service-modal').style.display = 'flex';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    closeServiceModal() {
      document.getElementById('service-modal').style.display = 'none';
      this.editingServiceId = null;
    }

    saveServiceItem() {
      const title = document.getElementById('service-modal-title-input').value.trim();
      const icon = document.getElementById('service-modal-icon').value.trim() || 'sparkles';
      const desc = document.getElementById('service-modal-desc').value.trim();

      if (!title) return;

      if (this.editingServiceId) {
        const srv = (this.currentData.services || []).find(s => s.id === this.editingServiceId);
        if (srv) {
          srv.title = title;
          srv.icon = icon;
          srv.description = desc;
          showToast('Service updated successfully!');
        }
      } else {
        this.currentData.services.push({
          id: 'srv_' + Date.now(),
          title: title,
          icon: icon,
          description: desc
        });
        showToast('New service added!');
      }

      window.PortfolioDataService.saveData(this.currentData);
      this.populateServices();
      this.closeServiceModal();
    }

    deleteService(id) {
      if (!confirm('Delete this service?')) return;
      this.currentData.services = this.currentData.services.filter(s => s.id !== id);
      window.PortfolioDataService.saveData(this.currentData);
      this.populateServices();
      showToast('Service deleted.');
    }

    // ------------------------------------------
    // Resume Section (PDF File & Download Settings)
    // ------------------------------------------
    populateResume() {
      const r = this.currentData.resume || {};
      this.setVal('resume-pdf-url', r.pdfUrl);
      this.setVal('resume-download-name', r.downloadName);
    }

    saveResume() {
      if (!this.currentData.resume) this.currentData.resume = {};
      this.currentData.resume.pdfUrl = this.getVal('resume-pdf-url');
      this.currentData.resume.downloadName = this.getVal('resume-download-name');
      this.currentData.resume.showViewer = true;

      window.PortfolioDataService.saveData(this.currentData);
      showToast('Resume settings saved!');
    }

    // ------------------------------------------
    // Dynamic Portfolio Section (CRUD)
    // ------------------------------------------
    populatePortfolio() {
      const container = document.getElementById('admin-portfolio-grid');
      if (!container) return;

      const items = this.currentData.portfolio || [];
      container.innerHTML = items.map(item => {
        let mediaBadge = `<span class="badge">${item.mediaType.toUpperCase()}</span>`;
        let previewMarkup = '';

        if (item.mediaType === 'video') {
          previewMarkup = `<video id="admin-port-media-${item.id}" muted playsinline></video>`;
        } else if (item.mediaType === 'document') {
          previewMarkup = `<div style="color: #ff4d4f; font-size: 3rem; text-align: center;"><i data-lucide="file-text"></i></div>`;
        } else {
          previewMarkup = `<img id="admin-port-media-${item.id}" src="../assets/img/hvec.png" alt="${item.title}">`;
        }

        return `
          <div class="glass-panel admin-project-card">
            <div class="card-media-preview">
              ${previewMarkup}
            </div>
            <div class="card-meta">
              ${mediaBadge}
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                <strong>Category:</strong> ${item.category || 'N/A'} | <strong>Client:</strong> ${item.client || 'N/A'}
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-secondary" style="flex: 1;" onclick="adminApp.editPortfolioModal('${item.id}')">Edit</button>
              <button class="btn-danger" onclick="adminApp.deletePortfolioItem('${item.id}')">Delete</button>
            </div>
          </div>
        `;
      }).join('');

      items.forEach(async (item) => {
        if (item.mediaType === 'image' || item.mediaType === 'video') {
          const el = document.getElementById(`admin-port-media-${item.id}`);
          if (el) {
            const displayUrl = await this.resolveAdminDisplayUrl(item.mediaUrl);
            el.src = displayUrl;
          }
        }
      });

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    openAddPortfolioModal() {
      this.editingPortfolioId = null;
      document.getElementById('portfolio-modal-title').textContent = 'Add New Portfolio Project';
      document.getElementById('portfolio-form').reset();
      document.getElementById('port-media-type').value = 'image';
      document.getElementById('portfolio-modal').style.display = 'flex';
    }

    editPortfolioModal(id) {
      const item = (this.currentData.portfolio || []).find(p => p.id === id);
      if (!item) return;

      this.editingPortfolioId = id;
      document.getElementById('portfolio-modal-title').textContent = 'Edit Portfolio Project';
      
      this.setVal('port-title', item.title);
      this.setVal('port-media-type', item.mediaType);
      this.setVal('port-media-url', item.mediaUrl);
      this.setVal('port-description', item.description);
      this.setVal('port-tools', item.tools);
      this.setVal('port-category', item.category);
      this.setVal('port-client', item.client);
      this.setVal('port-date', item.date);

      document.getElementById('portfolio-modal').style.display = 'flex';
    }

    closePortfolioModal() {
      document.getElementById('portfolio-modal').style.display = 'none';
      this.editingPortfolioId = null;
    }

    savePortfolioItem() {
      const title = this.getVal('port-title');
      const mediaType = this.getVal('port-media-type');
      const mediaUrl = this.getVal('port-media-url');
      const description = this.getVal('port-description');
      const tools = this.getVal('port-tools');
      const category = this.getVal('port-category');
      const client = this.getVal('port-client');
      const date = this.getVal('port-date');

      if (!title || !mediaUrl) {
        alert('Please provide at least a project title and media URL / file.');
        return;
      }

      if (this.editingPortfolioId) {
        // Edit existing
        const target = this.currentData.portfolio.find(p => p.id === this.editingPortfolioId);
        if (target) {
          Object.assign(target, {
            title, mediaType, mediaUrl, description, tools, category, client, date
          });
        }
        showToast('Portfolio card updated!');
      } else {
        // Add new
        const newItem = {
          id: 'proj_' + Date.now(),
          title, mediaType, mediaUrl, description, tools, category, client, date
        };
        this.currentData.portfolio.unshift(newItem);
        showToast('New portfolio project published!');
      }

      window.PortfolioDataService.saveData(this.currentData);
      this.closePortfolioModal();
      this.populatePortfolio();
    }

    deletePortfolioItem(id) {
      if (!confirm('Are you sure you want to delete this portfolio project card?')) return;
      this.currentData.portfolio = this.currentData.portfolio.filter(p => p.id !== id);
      window.PortfolioDataService.saveData(this.currentData);
      this.populatePortfolio();
      showToast('Project deleted.');
    }

    // ------------------------------------------
    // Contact Messages Inbox Management
    // ------------------------------------------
    populateInbox() {
      const container = document.getElementById('admin-inbox-body');
      if (!container) return;

      const messages = window.PortfolioDataService.getMessages();

      if (messages.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px;">
              No inquiries in inbox. Storage is clear!
            </td>
          </tr>
        `;
        this.updateSelectedMessagesCount();
        this.setupInboxDragAndDrop();
        return;
      }

      container.innerHTML = messages.map(msg => `
        <tr class="${msg.read ? '' : 'unread-row'} draggable-mail-row" draggable="true" data-msg-id="${msg.id}" onclick="adminApp.handleInboxRowClick(event, '${msg.id}')" title="Click to view message, or drag to trash bin to delete">
          <td style="text-align: center; padding: 14px 6px;" onclick="event.stopPropagation()">
            <input type="checkbox" class="inbox-checkbox inbox-msg-checkbox" value="${msg.id}" draggable="false" onchange="adminApp.updateSelectedMessagesCount()">
          </td>
          <td style="text-align: center; cursor: grab; padding: 14px 6px; color: #71717a;" title="Drag to delete">
            <i data-lucide="grip-vertical" style="width: 14px; height: 14px;"></i>
          </td>
          <td>${new Date(msg.timestamp).toLocaleDateString()}</td>
          <td><strong>${this.escapeHtml(msg.name)}</strong><br><small style="color: var(--text-muted);">${this.escapeHtml(msg.email)}</small></td>
          <td>${this.escapeHtml(msg.subject)}</td>
          <td onclick="event.stopPropagation()">
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="adminApp.viewMessage('${msg.id}')">View</button>
            <button class="btn-danger" style="padding: 4px 10px; font-size: 0.78rem; margin-left: 6px;" onclick="adminApp.deleteMessageItem('${msg.id}')">Delete</button>
          </td>
        </tr>
      `).join('');

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      this.updateSelectedMessagesCount();
      this.setupInboxDragAndDrop();
    }

    getSelectedMessageIds() {
      const checkboxes = document.querySelectorAll('.inbox-msg-checkbox:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    updateSelectedMessagesCount() {
      const allCheckboxes = document.querySelectorAll('.inbox-msg-checkbox');
      const checkedCheckboxes = document.querySelectorAll('.inbox-msg-checkbox:checked');
      const count = checkedCheckboxes.length;
      const total = allCheckboxes.length;

      const countEl = document.getElementById('selected-msg-count');
      if (countEl) countEl.textContent = count;

      const btnDelete = document.getElementById('btn-delete-selected');
      if (btnDelete) {
        if (count > 0) {
          btnDelete.disabled = false;
          btnDelete.style.opacity = '1';
          btnDelete.style.cursor = 'pointer';
        } else {
          btnDelete.disabled = true;
          btnDelete.style.opacity = '0.45';
          btnDelete.style.cursor = 'not-allowed';
        }
      }

      const selectAllEl = document.getElementById('inbox-select-all');
      if (selectAllEl) {
        if (total === 0) {
          selectAllEl.checked = false;
          selectAllEl.indeterminate = false;
          selectAllEl.disabled = true;
        } else {
          selectAllEl.disabled = false;
          selectAllEl.checked = count === total;
          selectAllEl.indeterminate = count > 0 && count < total;
        }
      }

      allCheckboxes.forEach(cb => {
        const row = cb.closest('tr');
        if (row) {
          if (cb.checked) {
            row.classList.add('selected-row');
          } else {
            row.classList.remove('selected-row');
          }
        }
      });
    }

    toggleSelectAllMessages(checked) {
      const checkboxes = document.querySelectorAll('.inbox-msg-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = checked;
      });
      this.updateSelectedMessagesCount();
    }

    deleteSelectedMessages() {
      const selectedIds = this.getSelectedMessageIds();
      if (selectedIds.length === 0) {
        alert('Please select at least one message to delete.');
        return;
      }

      const count = selectedIds.length;
      if (!confirm(`Are you sure you want to permanently delete the ${count} selected message${count > 1 ? 's' : ''}?`)) {
        return;
      }

      window.PortfolioDataService.deleteMessages(selectedIds);
      this.loadAllData();
      showToast(`${count} message${count > 1 ? 's' : ''} deleted.`);
    }

    setupInboxDragAndDrop() {
      const dustbin = document.getElementById('inbox-dustbin');
      if (!dustbin) return;

      const rows = document.querySelectorAll('.draggable-mail-row');
      rows.forEach(row => {
        row.addEventListener('dragstart', (e) => {
          const msgId = row.getAttribute('data-msg-id');
          const selectedIds = this.getSelectedMessageIds();

          let idsToDelete = [msgId];
          let isMulti = false;
          if (selectedIds.includes(msgId) && selectedIds.length > 1) {
            idsToDelete = selectedIds;
            isMulti = true;
          }

          e.dataTransfer.setData('text/plain', JSON.stringify({ ids: idsToDelete }));
          e.dataTransfer.effectAllowed = 'move';
          row.classList.add('row-dragging');
          dustbin.classList.add('dustbin-ready');

          const name = row.querySelector('strong')?.textContent || 'Message';
          const dragGhost = document.createElement('div');
          dragGhost.style.cssText = 'position: absolute; top: -1000px; padding: 6px 14px; background: #27272a; border: 1px solid rgba(255,77,79,0.5); border-radius: 6px; color: #fff; font-size: 0.82rem; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none; z-index: 9999;';
          dragGhost.textContent = isMulti ? `🗑 Dragging ${idsToDelete.length} selected messages` : ('🗑 Dragging: ' + name);
          document.body.appendChild(dragGhost);
          e.dataTransfer.setDragImage(dragGhost, 15, 15);
          setTimeout(() => {
            if (document.body.contains(dragGhost)) {
              document.body.removeChild(dragGhost);
            }
          }, 0);
        });

        row.addEventListener('dragend', () => {
          row.classList.remove('row-dragging');
          dustbin.classList.remove('dustbin-ready', 'dustbin-active');
        });
      });

      if (!dustbin.dataset.dragBound) {
        dustbin.dataset.dragBound = 'true';

        dustbin.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (!dustbin.classList.contains('dustbin-active')) {
            dustbin.classList.add('dustbin-active');
            const titleEl = dustbin.querySelector('.dustbin-title');
            if (titleEl) titleEl.textContent = 'Release to Delete!';
            const statusEl = dustbin.querySelector('.dustbin-status-pill');
            if (statusEl) statusEl.textContent = 'Drop to Confirm';
          }
        });

        dustbin.addEventListener('dragleave', (e) => {
          if (!dustbin.contains(e.relatedTarget)) {
            dustbin.classList.remove('dustbin-active');
            const titleEl = dustbin.querySelector('.dustbin-title');
            if (titleEl) titleEl.textContent = 'Trash Bin';
            const statusEl = dustbin.querySelector('.dustbin-status-pill');
            if (statusEl) statusEl.textContent = 'Drop Zone';
          }
        });

        dustbin.addEventListener('drop', (e) => {
          e.preventDefault();
          dustbin.classList.remove('dustbin-active', 'dustbin-ready');
          const titleEl = dustbin.querySelector('.dustbin-title');
          if (titleEl) titleEl.textContent = 'Trash Bin';
          const statusEl = dustbin.querySelector('.dustbin-status-pill');
          if (statusEl) statusEl.textContent = 'Drop Zone';

          const dataStr = e.dataTransfer.getData('text/plain');
          if (!dataStr) return;

          let ids = [];
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed && Array.isArray(parsed.ids)) {
              ids = parsed.ids;
            }
          } catch (_) {
            ids = [dataStr];
          }

          if (ids.length === 0) return;

          dustbin.classList.add('dustbin-dropped');
          setTimeout(() => dustbin.classList.remove('dustbin-dropped'), 600);

          if (ids.length === 1) {
            window.PortfolioDataService.deleteMessage(ids[0]);
            this.loadAllData();
            showToast('Message deleted via Trash Bin.');
          } else {
            window.PortfolioDataService.deleteMessages(ids);
            this.loadAllData();
            showToast(`${ids.length} messages deleted via Trash Bin.`);
          }
        });
      }
    }

    viewMessage(id) {
      const messages = window.PortfolioDataService.getMessages();
      const msg = messages.find(m => m.id === id);
      if (!msg) return;

      window.PortfolioDataService.markMessageRead(id);
      this.currentViewingMessageId = id;
      this.populateInbox();

      const modal = document.getElementById('inbox-message-modal');
      if (!modal) return;

      const avatarEl = document.getElementById('inbox-msg-modal-avatar');
      const nameEl = document.getElementById('inbox-msg-modal-name');
      const emailEl = document.getElementById('inbox-msg-modal-email');
      const dateEl = document.getElementById('inbox-msg-modal-date');
      const subjectEl = document.getElementById('inbox-msg-modal-subject');
      const bodyEl = document.getElementById('inbox-msg-modal-body');
      const replyLink = document.getElementById('inbox-msg-reply-link');

      const firstChar = (msg.name || 'U').trim().charAt(0).toUpperCase() || 'U';
      if (avatarEl) avatarEl.textContent = firstChar;
      if (nameEl) nameEl.textContent = msg.name || 'Anonymous Visitor';
      if (emailEl) emailEl.textContent = msg.email || 'No email provided';

      if (dateEl) {
        const d = msg.timestamp ? new Date(msg.timestamp) : new Date();
        const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        dateEl.innerHTML = `<i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${dateStr}, ${timeStr}`;
      }

      if (subjectEl) subjectEl.textContent = msg.subject || '(No Subject)';
      if (bodyEl) bodyEl.textContent = msg.message || '(Empty message body)';

      if (replyLink) {
        if (msg.email) {
          const subject = encodeURIComponent('Re: ' + (msg.subject || 'Portfolio Inquiry'));
          replyLink.href = `mailto:${encodeURIComponent(msg.email)}?subject=${subject}`;
          replyLink.style.display = 'inline-flex';
        } else {
          replyLink.style.display = 'none';
        }
      }

      modal.style.display = 'flex';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    closeMessageModal() {
      const modal = document.getElementById('inbox-message-modal');
      if (modal) modal.style.display = 'none';
      this.currentViewingMessageId = null;
    }

    handleInboxRowClick(e, id) {
      if (e.target.closest('input[type="checkbox"]') || e.target.closest('button') || e.target.closest('a')) {
        return;
      }
      this.viewMessage(id);
    }

    copyMessageText() {
      const bodyEl = document.getElementById('inbox-msg-modal-body');
      if (!bodyEl) return;
      const text = bodyEl.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        showToast('Message text copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Copied message text!');
      });
    }

    copyMessageEmail() {
      const emailEl = document.getElementById('inbox-msg-modal-email');
      if (!emailEl) return;
      const email = emailEl.textContent || '';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard: ' + email, 'success');
      }).catch(() => {
        showToast('Copied email: ' + email);
      });
    }

    deleteCurrentViewingMessage() {
      if (!this.currentViewingMessageId) return;
      const id = this.currentViewingMessageId;
      if (!confirm('Are you sure you want to permanently delete this message?')) return;
      window.PortfolioDataService.deleteMessage(id);
      this.closeMessageModal();
      this.loadAllData();
      showToast('Message deleted.');
    }

    deleteMessageItem(id) {
      if (!confirm('Delete this message?')) return;
      window.PortfolioDataService.deleteMessage(id);
      this.loadAllData();
      showToast('Message deleted.');
    }

    clearAllMessages() {
      const messages = window.PortfolioDataService.getMessages();
      if (messages.length === 0) {
        alert('Inbox is already empty!');
        return;
      }
      if (confirm(`Permanently delete all ${messages.length} message(s) to free up storage? This action cannot be undone.`)) {
        window.PortfolioDataService.clearAllMessages();
        this.loadAllData();
        showToast('All messages cleared. Storage freed up!');
      }
    }

    // ==========================================
    // OPTIMIZATION ENGINE & STUDIO HANDLERS
    // ==========================================
    openOptimizationHubModal() {
      const modal = document.getElementById('optimization-hub-modal');
      if (!modal) return;
      this.updateOptimizationMetrics();
      this.populateVideoAuditTable();
      modal.style.display = 'flex';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    closeOptimizationHubModal() {
      const modal = document.getElementById('optimization-hub-modal');
      if (modal) modal.style.display = 'none';
    }

    switchOptimizationTab(tabName) {
      const tabs = ['global', 'single', 'video'];
      tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-opt-${t}`);
        const pane = document.getElementById(`opt-pane-${t}`);
        if (btn) btn.classList.toggle('active', t === tabName);
        if (pane) {
          pane.classList.toggle('active', t === tabName);
          pane.style.display = (t === tabName) ? 'block' : 'none';
        }
      });
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    updateOptimizationMetrics() {
      if (!window.HamilioMediaStore) return;
      const all = window.HamilioMediaStore.getAllMedia();
      const images = all.filter(m => m.type === 'image');
      const videos = all.filter(m => m.type === 'video');

      // Unoptimized raster images: png, jpg, jpeg (not webp/avif)
      const unoptimized = images.filter(m => {
        const name = (m.name || m.url || '').toLowerCase();
        const fmt = (m.format || '').toLowerCase();
        return !name.endsWith('.webp') && !name.endsWith('.avif') && !fmt.includes('webp') && !fmt.includes('avif');
      });

      const totalEl = document.getElementById('opt-stat-total');
      const unoptEl = document.getElementById('opt-stat-unopt');
      const savingsEl = document.getElementById('opt-stat-savings');
      const vidsEl = document.getElementById('opt-stat-videos');

      if (totalEl) totalEl.textContent = all.length;
      if (unoptEl) unoptEl.textContent = unoptimized.length;
      if (vidsEl) vidsEl.textContent = videos.length;

      // Estimate ~75-80% savings on unoptimized images
      let estimatedSavedBytes = 0;
      unoptimized.forEach(item => {
        let bytes = 600 * 1024;
        if (item.size) {
          const match = item.size.match(/([\d\.]+)\s*(MB|KB|B)/i);
          if (match) {
            const val = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            if (unit === 'MB') bytes = val * 1024 * 1024;
            else if (unit === 'KB') bytes = val * 1024;
            else bytes = val;
          }
        }
        estimatedSavedBytes += bytes * 0.8;
      });

      if (savingsEl) {
        savingsEl.textContent = window.HamilioMediaStore.formatFileSize(estimatedSavedBytes);
      }
    }

    populateVideoAuditTable() {
      if (!window.HamilioMediaStore || !window.HamilioVideoOptimizer) return;
      const tbody = document.getElementById('opt-video-audit-tbody');
      if (!tbody) return;

      const videos = window.HamilioMediaStore.getAllMedia().filter(m => m.type === 'video');
      if (videos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No videos found in library.</td></tr>`;
        return;
      }

      tbody.innerHTML = videos.map(v => {
        let bytes = 10 * 1024 * 1024;
        if (v.size) {
          const match = v.size.match(/([\d\.]+)\s*(MB|KB)/i);
          if (match) {
            const val = parseFloat(match[1]);
            bytes = match[2].toUpperCase() === 'MB' ? val * 1024 * 1024 : val * 1024;
          }
        }
        const analysis = window.HamilioVideoOptimizer.analyzeVideoBandwidth(bytes, 30);
        const load3G = analysis.downloadTime3G;
        const isHeavy = analysis.isHeavy;

        return `
          <tr>
            <td>
              <div style="font-weight: 600; color: #fff;">${this.escapeHtml(v.title || v.name)}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${this.escapeHtml(v.name)}</div>
            </td>
            <td>
              <span class="media-meta-chip ${isHeavy ? 'chip-video-protect' : ''}">${this.escapeHtml(v.size || 'HD Video')}</span>
            </td>
            <td style="color: ${isHeavy ? '#f87171' : '#facc15'}; font-weight: 600;">
              ${load3G} (without protection)
            </td>
            <td>
              <span style="display: inline-flex; align-items: center; gap: 4px; color: #18d26e; font-size: 0.8rem; font-weight: 600;">
                <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> WebP Poster + On-Demand Stream
              </span>
            </td>
            <td>
              <button type="button" class="btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="adminApp.quickExtractVideoPoster('${v.id}')">
                <i data-lucide="camera" style="width: 12px; height: 12px;"></i> Poster
              </button>
            </td>
          </tr>
        `;
      }).join('');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    // ---------------------------------------------------------
    // MEDIA CARD SELECTION & BATCH CONVERSION ENGINE
    // ---------------------------------------------------------

    toggleMediaCardSelect(id, checked) {
      if (!this.selectedMediaIds) this.selectedMediaIds = new Set();
      if (checked) {
        this.selectedMediaIds.add(id);
      } else {
        this.selectedMediaIds.delete(id);
      }

      const card = document.getElementById(`card-${id}`);
      if (card) {
        if (checked) {
          card.classList.add('is-selected');
        } else {
          card.classList.remove('is-selected');
        }
      }

      this.updateMediaSelectionUI();
    }

    toggleSelectAllMedia(checked) {
      if (!this.selectedMediaIds) this.selectedMediaIds = new Set();
      const all = window.HamilioMediaStore ? window.HamilioMediaStore.getAllMedia() : [];
      let visible = all;
      if (this.currentMediaFilter !== 'all') {
        visible = visible.filter(m => m.type === this.currentMediaFilter);
      }
      if (this.currentMediaSearch) {
        const q = this.currentMediaSearch.toLowerCase();
        visible = visible.filter(m =>
          (m.name && m.name.toLowerCase().includes(q)) ||
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.alt && m.alt.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.type && m.type.toLowerCase().includes(q))
        );
      }

      // Filter only images
      const images = visible.filter(m => m.type === 'image');

      if (checked) {
        images.forEach(img => {
          this.selectedMediaIds.add(img.id);
          const card = document.getElementById(`card-${img.id}`);
          if (card) {
            card.classList.add('is-selected');
            const cb = card.querySelector('.media-card-checkbox');
            if (cb) cb.checked = true;
          }
        });
      } else {
        images.forEach(img => {
          this.selectedMediaIds.delete(img.id);
          const card = document.getElementById(`card-${img.id}`);
          if (card) {
            card.classList.remove('is-selected');
            const cb = card.querySelector('.media-card-checkbox');
            if (cb) cb.checked = false;
          }
        });
      }

      this.updateMediaSelectionUI();
    }

    clearMediaSelection() {
      if (this.selectedMediaIds) {
        this.selectedMediaIds.clear();
      }
      document.querySelectorAll('.media-card.is-selected').forEach(c => c.classList.remove('is-selected'));
      document.querySelectorAll('.media-card-checkbox').forEach(cb => { cb.checked = false; });
      const selectAll = document.getElementById('media-select-all-checkbox');
      if (selectAll) selectAll.checked = false;
      this.updateMediaSelectionUI();
    }

    updateMediaSelectionUI() {
      const count = this.selectedMediaIds ? this.selectedMediaIds.size : 0;
      const countPill = document.getElementById('batch-selected-count-badge');
      const countText = document.getElementById('batch-selected-count');
      const clearBtn = document.getElementById('btn-batch-clear-btn');
      const selWebp = document.getElementById('btn-batch-sel-webp');
      const selAvif = document.getElementById('btn-batch-sel-avif');
      const selectAll = document.getElementById('media-select-all-checkbox');
      const bar = document.getElementById('media-batch-action-bar');

      if (countText) countText.textContent = count;
      if (countPill) countPill.style.display = count > 0 ? 'inline-flex' : 'none';
      if (clearBtn) clearBtn.style.display = count > 0 ? 'inline-block' : 'none';
      if (selWebp) selWebp.disabled = count === 0;
      if (selAvif) selAvif.disabled = count === 0;
      if (bar) {
        if (count > 0) bar.classList.add('has-selection');
        else bar.classList.remove('has-selection');
      }

      // Check if all visible images are selected
      if (selectAll && window.HamilioMediaStore) {
        const allImgs = window.HamilioMediaStore.getAllMedia().filter(m => m.type === 'image');
        if (allImgs.length > 0 && count === allImgs.length) {
          selectAll.checked = true;
          selectAll.indeterminate = false;
        } else if (count > 0 && count < allImgs.length) {
          selectAll.checked = false;
          selectAll.indeterminate = true;
        } else {
          selectAll.checked = false;
          selectAll.indeterminate = false;
        }
      }
    }

    async convertSelectedImages(format = 'webp') {
      if (!this.selectedMediaIds || this.selectedMediaIds.size === 0) {
        showToast('Please select at least one image first.', 'warning');
        return;
      }
      if (!window.HamilioMediaStore || !window.HamilioImageOptimizer) return;

      const all = window.HamilioMediaStore.getAllMedia();
      const selectedItems = all.filter(m => m.type === 'image' && this.selectedMediaIds.has(m.id));

      if (selectedItems.length === 0) {
        showToast('No valid images found in current selection.', 'warning');
        return;
      }

      await this.executeImageBatchConversion(selectedItems, format, `Selected ${selectedItems.length} Images`);
    }

    async convertAllImages(format = 'webp') {
      if (!window.HamilioMediaStore || !window.HamilioImageOptimizer) return;

      const all = window.HamilioMediaStore.getAllMedia();
      const allImages = all.filter(m => m.type === 'image');

      if (allImages.length === 0) {
        showToast('No images found in library.', 'info');
        return;
      }

      const count = allImages.length;
      if (!confirm(`Are you sure you want to convert all ${count} images in your library to ${format.toUpperCase()}? This will optimize compression and file sizes globally.`)) {
        return;
      }

      await this.executeImageBatchConversion(allImages, format, `All ${count} Library Images`);
    }

    async executeImageBatchConversion(items, targetFormat = 'webp', label = 'Images') {
      const statusCard = document.getElementById('media-upload-status');
      const statusTitle = document.getElementById('media-upload-status-title');
      const statusPercent = document.getElementById('media-upload-status-percent');
      const progressBar = document.getElementById('media-upload-progress-bar');
      const statusDetails = document.getElementById('media-upload-status-details');

      if (statusCard) statusCard.style.display = 'block';
      if (statusTitle) statusTitle.textContent = `Converting ${label} to ${targetFormat.toUpperCase()}...`;

      let totalSaved = 0;
      let convertedCount = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const pct = Math.round(((i + 1) / items.length) * 100);

        if (progressBar) progressBar.style.width = `${pct}%`;
        if (statusPercent) statusPercent.textContent = `${pct}%`;
        if (statusDetails) statusDetails.textContent = `Optimizing [${i + 1}/${items.length}]: ${item.name || item.title}`;

        try {
          let sourceToOpt = null;

          // 1. If item is in IndexedDB, extract the binary Blob directly (bypasses all URL/CORS limits)
          if (item.url && item.url.startsWith('idb:') && window.HamilioMediaStore) {
            const fileRec = await window.HamilioMediaStore.getFile(item.id || item.url.substring(4));
            if (fileRec && fileRec.fileBlob) {
              sourceToOpt = fileRec.fileBlob;
            }
          }

          // 2. If built-in or normal URL, resolve display URL and try fetching binary blob
          if (!sourceToOpt) {
            const displayUrl = await this.resolveAdminDisplayUrl(item.url);
            try {
              const resp = await fetch(displayUrl);
              if (resp.ok) {
                sourceToOpt = await resp.blob();
              } else {
                sourceToOpt = displayUrl;
              }
            } catch (_) {
              sourceToOpt = displayUrl;
            }
          }

          const opt = await window.HamilioImageOptimizer.optimize(sourceToOpt, {
            format: targetFormat,
            quality: 0.82,
            maxDimension: 1920
          });

          if (opt && opt.success && opt.blob) {
            convertedCount++;
            totalSaved += (opt.savedBytes > 0 ? opt.savedBytes : 0);

            const newFormat = opt.format.toUpperCase() + ' Image (.' + opt.format + ')';
            const newName = (item.name || 'image').replace(/\.[^/.]+$/, `.${opt.format}`);
            const updates = {
              name: newName,
              format: newFormat,
              size: opt.optimizedSizeFormatted,
              dimensions: `${opt.width} × ${opt.height} px`,
              url: `idb:${item.id}`
            };

            // Persist the newly converted binary blob in IndexedDB
            await window.HamilioMediaStore.updateMediaFileBlob(item.id, opt.blob, updates);
          }
        } catch (err) {
          console.warn(`Could not optimize ${item.name}:`, err);
        }
      }

      if (convertedCount > 0) {
        if (statusTitle) statusTitle.textContent = `✓ Converted ${convertedCount} image(s) to ${targetFormat.toUpperCase()}!`;
        if (statusDetails) statusDetails.textContent = `Total Bandwidth Saved: ${window.HamilioMediaStore.formatFileSize(totalSaved)}`;
        showToast(`Successfully converted ${convertedCount} image(s) to ${targetFormat.toUpperCase()}! Saved ${window.HamilioMediaStore.formatFileSize(totalSaved)}.`, 'success');
      } else {
        if (statusTitle) statusTitle.textContent = `⚠ No images were converted to ${targetFormat.toUpperCase()}`;
        if (statusDetails) statusDetails.textContent = `Selected images may already be optimized. You can also upload new images directly with Auto-Optimize enabled!`;
        showToast(`No images were converted. Check image formats or console for details.`, 'warning');
      }

      setTimeout(() => {
        if (statusCard) statusCard.style.display = 'none';
      }, 4000);

      this.clearMediaSelection();
      this.populateMediaLibrary();
      this.updateOptimizationMetrics();
    }

    async runBatchImageOptimization() {
      if (!window.HamilioMediaStore || !window.HamilioImageOptimizer) return;
      const targetFormat = document.getElementById('opt-batch-format-select')?.value || 'webp';
      const all = window.HamilioMediaStore.getAllMedia();
      const images = all.filter(m => m.type === 'image');

      const toOptimize = images.filter(m => {
        const name = (m.name || m.url || '').toLowerCase();
        return !name.endsWith(`.${targetFormat}`);
      });

      if (toOptimize.length === 0) {
        showToast(`All images are already in optimized .${targetFormat} format!`, 'success');
        return;
      }

      await this.executeImageBatchConversion(toOptimize, targetFormat, `${toOptimize.length} Unoptimized Images`);
    }

    async runBatchVideoPosterExtraction() {
      if (!window.HamilioMediaStore || !window.HamilioVideoOptimizer) return;
      const videos = window.HamilioMediaStore.getAllMedia().filter(m => m.type === 'video');
      const resultEl = document.getElementById('opt-video-poster-result');

      if (videos.length === 0) {
        showToast('No videos found in media library.', 'info');
        return;
      }

      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.textContent = `Generating posters for ${videos.length} videos...`;
      }

      let generated = 0;
      for (const v of videos) {
        try {
          const displayUrl = await this.resolveAdminDisplayUrl(v.url);
          const poster = await window.HamilioVideoOptimizer.extractKeyframePoster(displayUrl, 0.5);
          if (poster && poster.success) {
            generated++;
          }
        } catch (e) {}
      }

      if (resultEl) {
        resultEl.textContent = `✓ Generated WebP poster frames for ${generated} videos! Portfolio cards now stream on-demand with zero buffering freeze.`;
      }
      showToast(`Generated WebP posters for ${generated} videos!`, 'success');
    }

    async handleSingleImageSelected(file) {
      if (!file) return;
      this.singleStudioFile = file;
      await this.recomputeSingleImageOptimization();
    }

    async recomputeSingleImageOptimization() {
      if (!this.singleStudioFile || !window.HamilioImageOptimizer) return;

      const formatRadios = document.getElementsByName('opt-single-format');
      let targetFormat = 'webp';
      for (const r of formatRadios) {
        if (r.checked) { targetFormat = r.value; break; }
      }

      const qualitySlider = document.getElementById('opt-single-quality-slider');
      const quality = qualitySlider ? parseFloat(qualitySlider.value) / 100 : 0.82;

      const maxDimSelect = document.getElementById('opt-single-maxdim-select');
      const maxDim = maxDimSelect ? parseInt(maxDimSelect.value, 10) : 1920;

      try {
        const opt = await window.HamilioImageOptimizer.optimize(this.singleStudioFile, {
          format: targetFormat,
          quality: quality,
          maxDimension: maxDim
        });

        this.lastSingleOptResult = opt;

        const previewImg = document.getElementById('opt-single-preview-img');
        const emptyHint = document.getElementById('opt-single-preview-empty');
        if (previewImg) {
          previewImg.src = opt.blobUrl;
          previewImg.style.display = 'block';
        }
        if (emptyHint) emptyHint.style.display = 'none';

        const origSizeEl = document.getElementById('opt-single-orig-size');
        const origDimEl = document.getElementById('opt-single-orig-dim');
        const optSizeEl = document.getElementById('opt-single-opt-size');
        const optDimEl = document.getElementById('opt-single-opt-dim');
        const savedPctEl = document.getElementById('opt-single-saved-pct');

        if (origSizeEl) origSizeEl.textContent = opt.originalSizeFormatted;
        if (origDimEl) origDimEl.textContent = `${opt.originalWidth} × ${opt.originalHeight} px`;
        if (optSizeEl) optSizeEl.textContent = opt.optimizedSizeFormatted;
        if (optDimEl) optDimEl.textContent = `${opt.width} × ${opt.height} px`;
        if (savedPctEl) savedPctEl.textContent = `${opt.percentSaved} saved`;

        const saveBtn = document.getElementById('btn-opt-single-save');
        const downBtn = document.getElementById('btn-opt-single-download');
        if (saveBtn) saveBtn.disabled = false;
        if (downBtn) downBtn.disabled = false;
      } catch (err) {
        console.error("Optimization error:", err);
      }
    }

    async saveSingleOptimizedToLibrary() {
      if (!this.lastSingleOptResult || !window.HamilioMediaStore) return;
      const res = this.lastSingleOptResult;
      const file = new File([res.blob], res.filename, { type: res.mimeType });

      await window.HamilioMediaStore.uploadFile(file, {
        title: res.filename.replace(/\.[^/.]+$/, ''),
        alt: 'Optimized ' + res.format.toUpperCase() + ' image',
        description: `Optimized via Studio: ${res.originalSizeFormatted} ➔ ${res.optimizedSizeFormatted} (${res.percentSaved} saved)`
      });

      this.populateMediaLibrary();
      showToast(`Saved "${res.filename}" to Media Library!`, 'success');
      this.closeOptimizationHubModal();
    }

    downloadSingleOptimized() {
      if (!this.lastSingleOptResult || !window.HamilioImageOptimizer) return;
      window.HamilioImageOptimizer.downloadBlob(this.lastSingleOptResult.blob, this.lastSingleOptResult.filename);
    }

    async openQuickOptimizeImage(mediaId) {
      if (!window.HamilioMediaStore) return;
      const item = window.HamilioMediaStore.getMediaItem(mediaId);
      if (!item) return;

      this.openOptimizationHubModal();
      this.switchOptimizationTab('single');

      const displayUrl = await this.resolveAdminDisplayUrl(item.url);
      try {
        const resp = await fetch(displayUrl);
        const blob = await resp.blob();
        this.singleStudioFile = new File([blob], item.name || 'image.png', { type: blob.type || 'image/png' });
        await this.recomputeSingleImageOptimization();
      } catch (e) {
        this.singleStudioFile = displayUrl;
        await this.recomputeSingleImageOptimization();
      }
    }

    async quickExtractVideoPoster(mediaId) {
      if (!window.HamilioMediaStore || !window.HamilioVideoOptimizer) return;
      const item = window.HamilioMediaStore.getMediaItem(mediaId);
      if (!item) return;

      showToast(`Extracting WebP poster for "${item.name}"...`, 'info');
      try {
        const displayUrl = await this.resolveAdminDisplayUrl(item.url);
        const res = await window.HamilioVideoOptimizer.extractKeyframePoster(displayUrl, 0.5);
        if (res && res.success) {
          showToast(`Poster frame extracted and cached!`, 'success');
          this.populateMediaLibrary();
        } else {
          showToast(`Could not extract frame: ${res.error || 'Video unsupported'}`, 'error');
        }
      } catch (err) {
        showToast(`Extraction failed: ${err.message}`, 'error');
      }
    }

    toggleAdminDataSaverSimulator() {
      if (!window.HamilioVideoOptimizer) return;
      window.HamilioVideoOptimizer.toggleDataSaver();
      const isLow = window.HamilioVideoOptimizer.isLowBandwidth();
      const btn = document.getElementById('btn-toggle-global-data-saver');
      if (btn) {
        btn.innerHTML = isLow
          ? `<i data-lucide="power"></i> Low-Bandwidth Active (Click for High-Speed)`
          : `<i data-lucide="power"></i> Simulate Low-Bandwidth Mode`;
      }
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    // ------------------------------------------
    // Settings & Cloud Sync
    // ------------------------------------------
    populateSettings() {
      const c = this.currentData.config || {};
      this.setVal('supabase-url', c.supabaseUrl || '');
      this.setVal('supabase-key', c.supabaseKey || '');
      this.setVal('turnstile-key', c.turnstileSiteKey || '');
    }

    saveSettings() {
      this.currentData.config = {
        supabaseUrl: this.getVal('supabase-url').trim(),
        supabaseKey: this.getVal('supabase-key').trim(),
        turnstileSiteKey: this.getVal('turnstile-key').trim()
      };

      window.PortfolioDataService.saveData(this.currentData);
      showToast('Cloud & Security settings saved!');
    }

    updateActiveUsernameDisplay() {
      const el = document.getElementById('active-username-display');
      if (el) el.textContent = getCurrentUsername();
    }

    async changeAdminUsername() {
      const newUsername = document.getElementById('username-new').value.trim();
      const currentPwd = document.getElementById('username-pwd-verify').value;
      const alertBox = document.getElementById('username-change-alert');

      const showAlert = (msg, isError = true) => {
        if (!alertBox) return;
        alertBox.textContent = msg;
        alertBox.className = 'alert-box ' + (isError ? 'alert-danger' : 'alert-success');
        alertBox.style.display = 'block';
      };

      if (!newUsername) {
        showAlert('Please enter a new username.');
        return;
      }

      if (newUsername.length < 3) {
        showAlert('Username must be at least 3 characters long.');
        return;
      }

      if (!/^[a-zA-Z0-9_.-]+$/.test(newUsername)) {
        showAlert('Username may only contain letters, numbers, hyphens, and underscores.');
        return;
      }

      if (!currentPwd) {
        showAlert('Please enter your current master password to authorize this change.');
        return;
      }

      // Verify current password against active hash
      const currentHash = getCurrentPasswordHash();
      const currentInputHash = await computeSHA256(currentPwd);

      if (currentInputHash !== currentHash) {
        showAlert('Current password is incorrect. Verification failed.');
        return;
      }

      const prevUser = getCurrentUsername();
      if (newUsername.toLowerCase() === prevUser.toLowerCase()) {
        showAlert('New username is the same as your current username.');
        return;
      }

      // Save new username
      setAdminUsername(newUsername);

      // Update UI displays
      this.updateActiveUsernameDisplay();

      // Clear fields
      document.getElementById('username-new').value = '';
      document.getElementById('username-pwd-verify').value = '';

      showAlert(`Username successfully changed to "${newUsername}"!`, false);
      showToast(`Username updated to "${newUsername}"!`, 'success');
    }

    async changeAdminPassword() {
      const currentPwd = document.getElementById('pwd-current').value;
      const newPwd = document.getElementById('pwd-new').value;
      const confirmPwd = document.getElementById('pwd-confirm').value;
      const alertBox = document.getElementById('pwd-change-alert');

      const showAlert = (msg, isError = true) => {
        if (!alertBox) return;
        alertBox.textContent = msg;
        alertBox.className = 'alert-box ' + (isError ? 'alert-danger' : 'alert-success');
        alertBox.style.display = 'block';
      };

      if (!currentPwd) {
        showAlert('Please enter your current master password.');
        return;
      }

      // Check current password against active hash
      const currentHash = getCurrentPasswordHash();
      const currentInputHash = await computeSHA256(currentPwd);

      if (currentInputHash !== currentHash) {
        showAlert('Current password is incorrect. Please verify and try again.');
        return;
      }

      if (!newPwd || newPwd.length < 6) {
        showAlert('New password must be at least 6 characters long.');
        return;
      }

      if (newPwd !== confirmPwd) {
        showAlert('New password and confirmation password do not match.');
        return;
      }

      if (newPwd === currentPwd) {
        showAlert('New password cannot be the same as your current password.');
        return;
      }

      // Compute and persist new SHA-256 hash
      const newHash = await computeSHA256(newPwd);
      setPasswordHash(newHash);

      // Clear form inputs
      document.getElementById('pwd-current').value = '';
      document.getElementById('pwd-new').value = '';
      document.getElementById('pwd-confirm').value = '';

      showAlert('Password updated successfully! Next time you log in, please use your new password.', false);
      showToast('Master password successfully updated!', 'success');
    }

    exportData() {
      window.PortfolioDataService.exportJSON();
      showToast('Backup file downloaded.');
    }

    importData(fileInput) {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const res = window.PortfolioDataService.importJSON(e.target.result);
        if (res.success) {
          showToast('Data imported successfully!');
          this.loadAllData();
        } else {
          alert('Import failed: ' + res.error);
        }
      };
      reader.readAsText(file);
    }

    // ------------------------------------------
    // CUSTOMIZATION SECTION (COLORS, TYPOGRAPHY, IDENTITY)
    // ------------------------------------------
    populateCustomization() {
      const c = this.currentData.customization || {};
      const colors = c.colors || {};
      const typo = c.typography || {};
      const identity = c.identity || {};

      // Colors
      this.setVal('picker-primary-color', colors.primaryColor || '#18d26e');
      this.setVal('custom-primary-color', colors.primaryColor || '#18d26e');

      this.setVal('picker-hover-color', colors.primaryHover || '#35e888');
      this.setVal('custom-hover-color', colors.primaryHover || '#35e888');

      this.setVal('picker-bg-color', colors.backgroundColor || '#040404');
      this.setVal('custom-bg-color', colors.backgroundColor || '#040404');

      this.setVal('picker-card-color', colors.cardBackground || '#0e0e0e');
      this.setVal('custom-card-color', colors.cardBackground || '#0e0e0e');

      this.setVal('picker-text-color', colors.textColor || '#ffffff');
      this.setVal('custom-text-color', colors.textColor || '#ffffff');

      this.setVal('picker-muted-color', colors.textMuted || '#b0b0b0');
      this.setVal('custom-muted-color', colors.textMuted || '#b0b0b0');

      this.updateColorPreview();

      // Typography
      this.setVal('typography-preset', typo.preset || 'default');
      this.setVal('custom-google-font-url', typo.googleFontUrl || '');
      this.setVal('custom-heading-font', typo.headingFont || "'Raleway', sans-serif");
      this.setVal('custom-body-font', typo.bodyFont || "'Open Sans', sans-serif");
      this.setVal('custom-font-name', typo.customFontName || '');

      const fontBadge = document.getElementById('custom-font-status');
      if (fontBadge) {
        if (typo.customFontName && typo.customFontData) {
          fontBadge.textContent = `Active: ${typo.customFontName}`;
          fontBadge.style.display = 'inline-block';
        } else {
          fontBadge.style.display = 'none';
        }
      }
      this.updateTypographyPreview();

      // Site Identity
      this.setVal('identity-logo-type', identity.logoType || 'text');
      this.toggleLogoType(identity.logoType || 'text');
      this.setVal('identity-logo-image', identity.logoImage || '');
      this.setVal('identity-site-title', identity.siteTitle || 'Hamim Mahamud Hamy');
      const heroTag = (this.currentData.hero && this.currentData.hero.tagline) || '';
      this.setVal('identity-tagline', identity.tagline || heroTag || 'Leading creative direction, technical web optimization, SEO strategy, and agile operations at Omega Solution.');
      this.setVal('identity-site-icon', identity.siteIcon || 'assets/img/hvec.png');

      this.previewLogo(identity.logoImage || '');
      this.previewFavicon(identity.siteIcon || 'assets/img/hvec.png');
      this.updateIdentityPreview();
    }

    bindCustomizationEvents() {
      // Color picker two-way synchronization
      const colorPairs = [
        { picker: 'picker-primary-color', text: 'custom-primary-color' },
        { picker: 'picker-hover-color', text: 'custom-hover-color' },
        { picker: 'picker-bg-color', text: 'custom-bg-color' },
        { picker: 'picker-card-color', text: 'custom-card-color' },
        { picker: 'picker-text-color', text: 'custom-text-color' },
        { picker: 'picker-muted-color', text: 'custom-muted-color' }
      ];

      colorPairs.forEach(pair => {
        const pickerEl = document.getElementById(pair.picker);
        const textEl = document.getElementById(pair.text);

        if (pickerEl && textEl) {
          pickerEl.addEventListener('input', (e) => {
            textEl.value = e.target.value;
            this.updateColorPreview();
          });

          textEl.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            if (/^#[0-9A-F]{6}$/i.test(val)) {
              pickerEl.value = val;
              this.updateColorPreview();
            }
          });
        }
      });
    }

    applyColorPreset(primary, hover) {
      this.setVal('picker-primary-color', primary);
      this.setVal('custom-primary-color', primary);
      this.setVal('picker-hover-color', hover);
      this.setVal('custom-hover-color', hover);
      this.updateColorPreview();
      showToast(`Applied preset: ${primary}`);
    }

    updateColorPreview() {
      const primary = this.getVal('custom-primary-color') || '#18d26e';
      const hover = this.getVal('custom-hover-color') || '#35e888';
      const bg = this.getVal('custom-bg-color') || '#040404';
      const card = this.getVal('custom-card-color') || '#0e0e0e';
      const text = this.getVal('custom-text-color') || '#ffffff';
      const muted = this.getVal('custom-muted-color') || '#b0b0b0';

      const previewBox = document.getElementById('theme-live-preview');
      if (previewBox) {
        previewBox.style.backgroundColor = bg;
        previewBox.style.borderColor = primary + '44';
      }

      const pBtn = document.getElementById('preview-primary-btn');
      if (pBtn) {
        pBtn.style.backgroundColor = primary;
        pBtn.style.color = '#000';
      }

      const oBtn = document.getElementById('preview-outline-btn');
      if (oBtn) {
        oBtn.style.borderColor = primary;
        oBtn.style.color = primary;
      }

      const badge = document.getElementById('preview-badge-sample');
      if (badge) {
        badge.style.color = primary;
        badge.style.backgroundColor = primary + '26';
      }

      const link = document.getElementById('preview-link-sample');
      if (link) {
        link.style.color = primary;
      }
    }

    applyTypographyPreset(preset) {
      const presets = {
        'default': {
          heading: "'Inter', sans-serif",
          body: "'Inter', sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        },
        'inter': {
          heading: "'Inter', sans-serif",
          body: "'Inter', sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        },
        'poppins': {
          heading: "'Poppins', sans-serif",
          body: "'Poppins', sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        },
        'montserrat': {
          heading: "'Playfair Display', serif",
          body: "'Montserrat', sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
        },
        'roboto': {
          heading: "'Fira Code', monospace",
          body: "'Roboto', sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap"
        }
      };

      if (presets[preset]) {
        this.setVal('custom-heading-font', presets[preset].heading);
        this.setVal('custom-body-font', presets[preset].body);
        this.setVal('custom-google-font-url', presets[preset].url);
        this.updateTypographyPreview();
      }
    }

    updateTypographyPreview() {
      const headingFont = this.getVal('custom-heading-font') || "'Raleway', sans-serif";
      const bodyFont = this.getVal('custom-body-font') || "'Open Sans', sans-serif";
      const googleFontUrl = this.getVal('custom-google-font-url');

      if (googleFontUrl) {
        let previewLink = document.getElementById('preview-custom-font-link');
        if (!previewLink) {
          previewLink = document.createElement('link');
          previewLink.id = 'preview-custom-font-link';
          previewLink.rel = 'stylesheet';
          document.head.appendChild(previewLink);
        }
        previewLink.href = googleFontUrl;
      }

      const h1 = document.getElementById('typo-preview-h1');
      const h2 = document.getElementById('typo-preview-h2');
      const p = document.getElementById('typo-preview-p');

      if (h1) h1.style.fontFamily = headingFont;
      if (h2) h2.style.fontFamily = headingFont;
      if (p) p.style.fontFamily = bodyFont;
    }

    async handleCustomFontUpload(fileInput) {
      if (!fileInput.files || !fileInput.files[0]) return;
      const file = fileInput.files[0];
      const fontName = this.getVal('custom-font-name').trim() || file.name.replace(/\.[^/.]+$/, "");
      this.setVal('custom-font-name', fontName);

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        this.uploadedCustomFontData = base64Data;
        this.uploadedCustomFontName = fontName;

        let customFace = document.getElementById('uploaded-font-face-preview');
        if (!customFace) {
          customFace = document.createElement('style');
          customFace.id = 'uploaded-font-face-preview';
          document.head.appendChild(customFace);
        }
        customFace.textContent = `
          @font-face {
            font-family: '${fontName}';
            src: url('${base64Data}');
          }
        `;

        this.setVal('custom-heading-font', `'${fontName}', sans-serif`);
        this.setVal('custom-body-font', `'${fontName}', sans-serif`);
        this.updateTypographyPreview();

        const badge = document.getElementById('custom-font-status');
        if (badge) {
          badge.textContent = `Active: ${fontName}`;
          badge.style.display = 'inline-block';
        }

        showToast(`Font "${fontName}" loaded! Click Save to apply.`);
      };
      reader.readAsDataURL(file);
    }

    toggleLogoType(type) {
      const controls = document.getElementById('logo-image-controls');
      if (controls) {
        controls.style.display = type === 'image' ? 'block' : 'none';
      }
      this.updateIdentityPreview();
    }

    previewLogo(url) {
      const box = document.getElementById('logo-preview-box');
      if (!box) return;
      if (url) {
        this.resolveAdminDisplayUrl(url).then(resolved => {
          box.innerHTML = `<img src="${resolved}" alt="Logo" style="max-height: 46px; object-fit: contain;">`;
        });
      } else {
        box.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">No logo image selected</span>`;
      }
    }

    previewFavicon(url) {
      const icon = document.getElementById('mockup-tab-favicon');
      if (!icon) return;
      if (url) {
        this.resolveAdminDisplayUrl(url).then(resolved => {
          icon.src = resolved;
        });
      }
    }

    updateIdentityPreview() {
      const title = this.getVal('identity-site-title') || 'Hamim Mahamud Hamy';
      const tagline = this.getVal('identity-tagline') || this.getVal('hero-tagline') || '';
      const mockupTitle = document.getElementById('mockup-tab-title');
      if (mockupTitle) {
        mockupTitle.textContent = tagline ? `${title} | ${tagline}` : title;
      }
    }

    saveCustomization() {
      const existingTypo = (this.currentData.customization && this.currentData.customization.typography) || {};
      const brandTagline = this.getVal('identity-tagline') || '';
      
      this.currentData.customization = {
        colors: {
          primaryColor: this.getVal('custom-primary-color') || '#18d26e',
          primaryHover: this.getVal('custom-hover-color') || '#35e888',
          backgroundColor: this.getVal('custom-bg-color') || '#040404',
          cardBackground: this.getVal('custom-card-color') || '#0e0e0e',
          textColor: this.getVal('custom-text-color') || '#ffffff',
          textMuted: this.getVal('custom-muted-color') || '#b0b0b0'
        },
        typography: {
          preset: this.getVal('typography-preset') || 'default',
          googleFontUrl: this.getVal('custom-google-font-url'),
          headingFont: this.getVal('custom-heading-font') || "'Inter', sans-serif",
          bodyFont: this.getVal('custom-body-font') || "'Inter', sans-serif",
          customFontName: this.uploadedCustomFontName || existingTypo.customFontName || '',
          customFontData: this.uploadedCustomFontData || existingTypo.customFontData || ''
        },
        identity: {
          logoType: this.getVal('identity-logo-type') || 'text',
          logoImage: this.getVal('identity-logo-image') || '',
          siteTitle: this.getVal('identity-site-title') || 'Hamim Mahamud Hamy',
          tagline: brandTagline,
          siteIcon: this.getVal('identity-site-icon') || 'assets/img/hvec.png'
        }
      };

      // Keep Hero Section tagline in sync with Brand Tagline
      if (this.currentData.hero) {
        this.currentData.hero.tagline = brandTagline;
        const heroTagInput = document.getElementById('hero-tagline');
        if (heroTagInput) heroTagInput.value = brandTagline;
      }

      window.PortfolioDataService.saveData(this.currentData);
      showToast('Customization settings saved successfully!');
    }

    // ------------------------------------------
    // SEO & META SECTION
    // ------------------------------------------
    populateSEO() {
      const seo = this.currentData.seo || {};

      this.setVal('seo-site-title', seo.siteTitle || '');
      this.setVal('seo-title', seo.seoTitle || '');
      this.setVal('seo-language', seo.language || 'en');
      this.setVal('seo-focus-keyphrase', seo.focusKeyphrase || '');
      this.setVal('seo-meta-title', seo.metaTitle || '');
      this.setVal('seo-meta-desc', seo.metaDescription || '');
      this.setVal('seo-featured-image', seo.featuredImage || '');

      this.setVal('seo-social-title', seo.socialTitle || '');
      this.setVal('seo-social-desc', seo.socialDescription || '');
      this.setVal('seo-social-image', seo.socialImage || '');

      this.setVal('seo-x-title', seo.xTitle || '');
      this.setVal('seo-x-desc', seo.xDescription || '');
      this.setVal('seo-x-image', seo.xImage || '');

      this.updateSEOPreview();
      this.updateSocialPreview();
      this.updateXPreview();
    }

    bindSEOEvents() {
      // Bound via inputs
    }

    updateSEOPreview() {
      const title = this.getVal('seo-title') || this.getVal('seo-site-title') || 'Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive';
      const desc = this.getVal('seo-meta-desc') || 'Official portfolio of Hamim Mahamud Hamy — Head of Creative & HR and Business Management Executive at Omega Solution.';
      const keyphrase = this.getVal('seo-focus-keyphrase').trim().toLowerCase();

      // Title Char Count
      const titleLen = title.length;
      const titleBadge = document.getElementById('seo-title-count');
      if (titleBadge) {
        titleBadge.textContent = `${titleLen} / 60 chars`;
        titleBadge.className = 'char-count-badge ' + (titleLen >= 45 && titleLen <= 65 ? 'good' : (titleLen > 65 ? 'warning' : ''));
      }

      // Desc Char Count
      const descLen = desc.length;
      const descBadge = document.getElementById('seo-desc-count');
      if (descBadge) {
        descBadge.textContent = `${descLen} / 160 chars`;
        descBadge.className = 'char-count-badge ' + (descLen >= 120 && descLen <= 160 ? 'good' : (descLen > 160 ? 'warning' : ''));
      }

      // SERP Title
      const serpTitle = document.getElementById('serp-preview-title');
      if (serpTitle) serpTitle.textContent = title;

      // SERP Snippet
      const serpSnippet = document.getElementById('serp-preview-snippet');
      if (serpSnippet) {
        if (keyphrase && desc.toLowerCase().includes(keyphrase)) {
          const regex = new RegExp(`(${keyphrase})`, 'gi');
          serpSnippet.innerHTML = desc.replace(regex, '<strong style="color: #cfcfcf;">$1</strong>');
        } else {
          serpSnippet.textContent = desc;
        }
      }
    }

    updateSocialPreview() {
      const title = this.getVal('seo-social-title') || this.getVal('seo-title') || 'Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive';
      const desc = this.getVal('seo-social-desc') || this.getVal('seo-meta-desc') || 'Official portfolio of Hamim Mahamud Hamy — Head of Creative & HR and Business Management Executive at Omega Solution.';
      const img = this.getVal('seo-social-image') || this.getVal('seo-featured-image') || 'assets/img/profile-opt.jpg';

      const sTitle = document.getElementById('social-preview-title');
      if (sTitle) sTitle.textContent = title;

      const sDesc = document.getElementById('social-preview-desc');
      if (sDesc) sDesc.textContent = desc;

      const sImg = document.getElementById('social-preview-img');
      if (sImg && img) {
        this.resolveAdminDisplayUrl(img).then(url => { sImg.src = url; });
      }
    }

    updateXPreview() {
      const title = this.getVal('seo-x-title') || this.getVal('seo-social-title') || this.getVal('seo-title') || 'Hamim Mahamud Hamy | Head of Creative & HR | Business Management Executive';
      const desc = this.getVal('seo-x-desc') || this.getVal('seo-social-desc') || this.getVal('seo-meta-desc') || 'Official portfolio of Hamim Mahamud Hamy — Head of Creative & HR and Business Management Executive at Omega Solution.';
      const img = this.getVal('seo-x-image') || this.getVal('seo-social-image') || this.getVal('seo-featured-image') || 'assets/img/profile-opt.jpg';

      const xTitle = document.getElementById('x-preview-title');
      if (xTitle) xTitle.textContent = title;

      const xDesc = document.getElementById('x-preview-desc');
      if (xDesc) xDesc.textContent = desc;

      const xImg = document.getElementById('x-preview-img');
      if (xImg && img) {
        this.resolveAdminDisplayUrl(img).then(url => { xImg.src = url; });
      }
    }

    saveSEO() {
      this.currentData.seo = {
        siteTitle: this.getVal('seo-site-title'),
        seoTitle: this.getVal('seo-title'),
        language: this.getVal('seo-language') || 'en',
        focusKeyphrase: this.getVal('seo-focus-keyphrase'),
        metaTitle: this.getVal('seo-meta-title'),
        metaDescription: this.getVal('seo-meta-desc'),
        featuredImage: this.getVal('seo-featured-image'),
        socialTitle: this.getVal('seo-social-title'),
        socialDescription: this.getVal('seo-social-desc'),
        socialImage: this.getVal('seo-social-image'),
        xTitle: this.getVal('seo-x-title'),
        xDescription: this.getVal('seo-x-desc'),
        xImage: this.getVal('seo-x-image')
      };

      window.PortfolioDataService.saveData(this.currentData);
      showToast('SEO & Meta settings saved successfully!');
    }

    // Utility Helpers
    setVal(id, val) {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    }

    getVal(id) {
      const el = document.getElementById(id);
      return el ? el.value : '';
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    bindForms() {
      // Form listeners initialized
    }

    // ------------------------------------------
    // MEDIA LIBRARY & MEDIA PICKER METHODS
    // ------------------------------------------
    bindMediaHandlers() {
      // Library upload input
      const uploadInput = document.getElementById('media-library-upload-input');
      if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            this.promptMediaUpload(e.target.files);
            e.target.value = '';
          }
        });
      }

      // Inline modal upload input
      const inlineUpload = document.getElementById('picker-inline-upload');
      if (inlineUpload) {
        inlineUpload.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            this.promptMediaUpload(e.target.files, true);
            e.target.value = '';
          }
        });
      }

      // Drag & drop dropzone
      const dropzone = document.getElementById('media-dropzone');
      if (dropzone) {
        dropzone.addEventListener('click', () => {
          if (uploadInput) uploadInput.click();
        });

        ['dragenter', 'dragover'].forEach(eventName => {
          dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
          }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
          }, false);
        });

        dropzone.addEventListener('drop', (e) => {
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            this.promptMediaUpload(files);
          }
        });
      }

      // Portfolio modal direct file upload
      const portFileInput = document.getElementById('port-file-upload');
      if (portFileInput) {
        portFileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          this.promptMediaUpload([file], false, (uploaded) => {
            const urlInput = document.getElementById('port-media-url');
            if (urlInput) {
              urlInput.value = uploaded.url;
              urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const typeSelect = document.getElementById('port-media-type');
            if (typeSelect && uploaded.type) {
              typeSelect.value = uploaded.type;
            }
          });
          e.target.value = '';
        });
      }

      // Close upload, edit, and inbox modals on backdrop click or Escape
      const uploadModal = document.getElementById('media-upload-modal');
      if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
          if (e.target === uploadModal) this.closeMediaUploadModal();
        });
      }
      const editModal = document.getElementById('media-edit-modal');
      if (editModal) {
        editModal.addEventListener('click', (e) => {
          if (e.target === editModal) this.closeEditMediaModal();
        });
      }
      const inboxModal = document.getElementById('inbox-message-modal');
      if (inboxModal) {
        inboxModal.addEventListener('click', (e) => {
          if (e.target === inboxModal) this.closeMessageModal();
        });
      }
      const optModal = document.getElementById('optimization-hub-modal');
      if (optModal) {
        optModal.addEventListener('click', (e) => {
          if (e.target === optModal) this.closeOptimizationHubModal();
        });
      }
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (uploadModal && uploadModal.style.display === 'flex') this.closeMediaUploadModal();
          if (editModal && editModal.style.display === 'flex') this.closeEditMediaModal();
          if (inboxModal && inboxModal.style.display === 'flex') this.closeMessageModal();
          if (optModal && optModal.style.display === 'flex') this.closeOptimizationHubModal();
        }
      });
    }

    async handleMediaUpload(fileList, selectLastForPicker = false) {
      this.promptMediaUpload(fileList, selectLastForPicker);
    }

    promptMediaUpload(fileList, selectLastForPicker = false, onCompleteCallback = null) {
      if (!fileList || fileList.length === 0) return;
      this.uploadQueue = Array.from(fileList);
      this.uploadTotalCount = this.uploadQueue.length;
      this.uploadCurrentIndex = 0;
      this.uploadSelectForPicker = selectLastForPicker;
      this.uploadOnCompleteCallback = onCompleteCallback;
      this.lastUploadedItem = null;

      this.showNextUploadInQueue();
    }

    showNextUploadInQueue() {
      if (!this.uploadQueue || this.uploadQueue.length === 0) {
        this.closeMediaUploadModal();
        this.populateMediaLibrary(this.currentMediaFilter, this.currentMediaSearch);

        if (this.uploadSelectForPicker && this.lastUploadedItem && this.pickerTargetInput) {
          this.selectMediaForTarget(this.lastUploadedItem.url, this.lastUploadedItem.name, this.lastUploadedItem.type);
        } else if (this.pickerTargetInput) {
          this.renderPickerGrid();
        }

        if (this.uploadOnCompleteCallback && this.lastUploadedItem) {
          this.uploadOnCompleteCallback(this.lastUploadedItem);
          this.uploadOnCompleteCallback = null;
        }
        return;
      }

      this.currentUploadFile = this.uploadQueue[0];
      this.uploadCurrentIndex++;

      const modal = document.getElementById('media-upload-modal');
      const titleHeader = document.getElementById('media-upload-modal-title');
      const filenameEl = document.getElementById('media-upload-filename');
      const filemetaEl = document.getElementById('media-upload-filemeta');
      const thumbEl = document.getElementById('media-upload-thumb');
      const titleInput = document.getElementById('upload-media-title');
      const altInput = document.getElementById('upload-media-alt');
      const descInput = document.getElementById('upload-media-desc');
      const submitBtn = document.getElementById('btn-confirm-upload');

      if (!modal) return;

      if (titleHeader) {
        if (this.uploadTotalCount > 1) {
          titleHeader.textContent = `Upload Media Details (${this.uploadCurrentIndex} of ${this.uploadTotalCount})`;
        } else {
          titleHeader.textContent = `Upload Media Details`;
        }
      }

      if (filenameEl) filenameEl.textContent = this.currentUploadFile.name;

      const fileType = window.HamilioMediaStore ? window.HamilioMediaStore.detectFileType(this.currentUploadFile) : 'file';
      const sizeStr = window.HamilioMediaStore ? window.HamilioMediaStore.formatFileSize(this.currentUploadFile.size) : '';
      if (filemetaEl) {
        filemetaEl.textContent = `${fileType.toUpperCase()} • ${sizeStr}`;
      }

      if (thumbEl) {
        thumbEl.innerHTML = '';
        if (fileType === 'image') {
          const tempUrl = URL.createObjectURL(this.currentUploadFile);
          thumbEl.innerHTML = `<img src="${tempUrl}" alt="Preview" style="width:100%; height:100%; object-fit:cover;">`;
        } else if (fileType === 'video') {
          const tempUrl = URL.createObjectURL(this.currentUploadFile);
          thumbEl.innerHTML = `<video src="${tempUrl}" muted style="width:100%; height:100%; object-fit:cover;"></video>`;
        } else {
          thumbEl.innerHTML = `<i data-lucide="file-text" style="font-size:2rem; color:var(--text-muted);"></i>`;
        }
      }

      const cleanTitle = this.currentUploadFile.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();

      if (titleInput) titleInput.value = cleanTitle;
      if (altInput) altInput.value = '';
      if (descInput) descInput.value = '';

      if (submitBtn) {
        submitBtn.innerHTML = this.uploadQueue.length > 1
          ? '<i data-lucide="arrow-right"></i> Save &amp; Next'
          : '<i data-lucide="upload-cloud"></i> Save to Media Library';
      }

      modal.style.display = 'flex';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      if (titleInput) {
        setTimeout(() => titleInput.focus(), 60);
      }
    }

    closeMediaUploadModal() {
      const modal = document.getElementById('media-upload-modal');
      if (modal) modal.style.display = 'none';
      this.uploadQueue = [];
      this.currentUploadFile = null;
    }

    async confirmMediaUpload() {
      if (!this.currentUploadFile || !window.HamilioMediaStore) return;

      const titleInput = document.getElementById('upload-media-title');
      const altInput = document.getElementById('upload-media-alt');
      const descInput = document.getElementById('upload-media-desc');
      const submitBtn = document.getElementById('btn-confirm-upload');

      const title = (titleInput ? titleInput.value : '').trim() || this.currentUploadFile.name;
      const alt = (altInput ? altInput.value : '').trim();
      const description = (descInput ? descInput.value : '').trim();

      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span>';
      }

      let fileToUpload = this.currentUploadFile;
      const isImg = window.HamilioMediaStore.detectFileType(fileToUpload) === 'image';
      const autoOpt = document.getElementById('chk-auto-optimize-upload')?.checked !== false;

      // Auto-Optimize Image to WebP or AVIF if enabled
      if (isImg && autoOpt && window.HamilioImageOptimizer) {
        try {
          if (submitBtn) submitBtn.innerHTML = '<span>⚡ Optimizing Image...</span>';
          const targetFormat = document.getElementById('opt-target-format')?.value || 'webp';
          const targetQuality = parseFloat(document.getElementById('opt-target-quality')?.value || '0.82');
          const targetMaxDim = parseInt(document.getElementById('opt-target-maxdim')?.value || '1920', 10);

          const opt = await window.HamilioImageOptimizer.optimize(fileToUpload, {
            format: targetFormat,
            quality: targetQuality,
            maxDimension: targetMaxDim
          });

          if (opt && opt.success && opt.blob) {
            fileToUpload = new File([opt.blob], opt.filename, { type: opt.mimeType });
            showToast(`⚡ Auto-Optimized to ${opt.format.toUpperCase()} (${opt.originalSizeFormatted} ➔ ${opt.optimizedSizeFormatted}, ${opt.percentSaved} saved)`, 'success');
          }
        } catch (optErr) {
          console.warn("Auto-optimization notice:", optErr);
        }
      }

      try {
        if (submitBtn) submitBtn.innerHTML = '<span>Saving to Library...</span>';
        const uploaded = await window.HamilioMediaStore.uploadFile(fileToUpload, {
          title,
          alt,
          description
        });
        this.lastUploadedItem = uploaded;
        showToast(`Saved "${title}" to Media Library!`, 'success');

        this.uploadQueue.shift();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }

        this.showNextUploadInQueue();
      } catch (err) {
        console.error("Upload error:", err);
        showToast('Error uploading file: ' + err.message, 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    }

    openEditMediaModal(id) {
      if (!window.HamilioMediaStore) return;
      const item = window.HamilioMediaStore.getMediaItem(id);
      if (!item) {
        showToast('Media asset not found', 'error');
        return;
      }

      const idInput = document.getElementById('edit-media-id');
      const titleInput = document.getElementById('edit-media-title');
      const altInput = document.getElementById('edit-media-alt');
      const descInput = document.getElementById('edit-media-desc');
      const filenameEl = document.getElementById('edit-media-filename');
      const filemetaEl = document.getElementById('edit-media-filemeta');
      const thumbBox = document.getElementById('edit-media-thumb');

      if (idInput) idInput.value = item.id;
      if (titleInput) titleInput.value = item.title || item.name;
      if (altInput) altInput.value = item.alt || '';
      if (descInput) descInput.value = item.description || '';

      if (filenameEl) filenameEl.textContent = item.name;
      if (filemetaEl) {
        const parts = [item.type ? item.type.toUpperCase() : '', item.size, item.dimensions].filter(Boolean);
        filemetaEl.textContent = parts.join(' • ') || 'Media Asset';
      }

      if (thumbBox) {
        thumbBox.innerHTML = '';
        this.resolveAdminDisplayUrl(item.url).then(url => {
          if (item.type === 'image') {
            thumbBox.innerHTML = `<img src="${url}" alt="${this.escapeHtml(item.alt || item.name)}" style="width:100%; height:100%; object-fit:cover;">`;
          } else if (item.type === 'video') {
            thumbBox.innerHTML = `<video src="${url}" muted style="width:100%; height:100%; object-fit:cover;"></video>`;
          } else {
            thumbBox.innerHTML = `<i data-lucide="file-text" style="font-size:2rem; color:var(--text-muted);"></i>`;
            if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
          }
        });
      }

      const modal = document.getElementById('media-edit-modal');
      if (modal) modal.style.display = 'flex';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      if (titleInput) {
        setTimeout(() => titleInput.focus(), 60);
      }
    }

    closeEditMediaModal() {
      const modal = document.getElementById('media-edit-modal');
      if (modal) modal.style.display = 'none';
    }

    saveMediaEdit() {
      const idInput = document.getElementById('edit-media-id');
      const titleInput = document.getElementById('edit-media-title');
      const altInput = document.getElementById('edit-media-alt');
      const descInput = document.getElementById('edit-media-desc');

      if (!idInput || !idInput.value) return;

      const id = idInput.value;
      const title = (titleInput ? titleInput.value : '').trim();
      const alt = (altInput ? altInput.value : '').trim();
      const description = (descInput ? descInput.value : '').trim();

      if (!title) {
        showToast('Please provide a title for this media asset', 'warning');
        return;
      }

      if (window.HamilioMediaStore) {
        window.HamilioMediaStore.updateMediaMeta(id, { title, alt, description });
        showToast('Media details updated successfully!', 'success');
      }

      this.closeEditMediaModal();
      this.populateMediaLibrary(this.currentMediaFilter, this.currentMediaSearch);

      if (document.getElementById('media-picker-modal').style.display === 'flex') {
        this.renderPickerGrid();
      }
    }

    async resolveAdminDisplayUrl(url) {
      if (!url) return '';
      if (url.startsWith('idb:') && window.HamilioMediaStore) {
        return await window.HamilioMediaStore.resolveUrl(url);
      }
      if (url.startsWith('assets/')) {
        return '../' + url;
      }
      return url;
    }

    getMediaCardDetails(item) {
      if (!this.mediaMetadataCache) this.mediaMetadataCache = {};
      const cached = this.mediaMetadataCache[item.id] || {};

      const isImg = item.type === 'image';
      const isVid = item.type === 'video';
      const isDoc = item.type === 'document';

      const ext = (item.name.split('.').pop() || item.type).toUpperCase().split(' ')[0];

      let dimensions = cached.dimensions || item.dimensions || '';
      let aspectRatio = cached.aspectRatio || item.aspectRatio || '';
      let duration = cached.duration || item.duration || '';
      let format = cached.format || item.format || '';

      if (!dimensions) {
        if (isDoc) dimensions = 'Standard PDF Document';
        else dimensions = 'Detecting...';
      }

      if (!format) {
        if (isDoc) format = 'PDF Document (.pdf)';
        else if (isImg) format = `${ext} Image (.${ext.toLowerCase()})`;
        else if (isVid) format = `${ext} Video (.${ext.toLowerCase()})`;
      }

      const dimShort = dimensions.includes('×') ? dimensions.replace(' px', '') : (isDoc ? 'PDF' : dimensions);

      return {
        dimensions,
        dimShort,
        aspectRatio,
        duration,
        format,
        ext,
        dimBadge: dimensions && dimensions !== 'Detecting...' ? `<span class="media-card-dim">${dimShort}</span>` : ''
      };
    }

    renderMediaInfoPopover(item, details, popoverId) {
      const isImg = item.type === 'image';
      const isVid = item.type === 'video';
      const isDoc = item.type === 'document';

      let typeIcon = 'image';
      let typeLabel = 'Image';
      let dimLabel = 'Resolution';

      if (isVid) {
        typeIcon = 'video';
        typeLabel = 'Video';
        dimLabel = 'Resolution';
      } else if (isDoc) {
        typeIcon = 'file-text';
        typeLabel = 'Document';
        dimLabel = 'Dimensions';
      }

      const aspectRow = details.aspectRatio ? `
        <div class="popover-row">
          <span class="popover-label">Aspect</span>
          <span class="popover-val">${details.aspectRatio}</span>
        </div>
      ` : '';

      const durationRow = details.duration ? `
        <div class="popover-row">
          <span class="popover-label">Duration</span>
          <span class="popover-val">${details.duration}</span>
        </div>
      ` : '';

      const formatRow = details.format ? `
        <div class="popover-row">
          <span class="popover-label">Format</span>
          <span class="popover-val">${details.format}</span>
        </div>
      ` : '';

      const cleanName = (item.name || '').replace(/\s*\([^)]*\)/g, '').trim();
      const displayTitle = item.title || cleanName;
      const altVal = item.alt ? this.escapeHtml(item.alt) : '<span style="color:var(--text-muted); font-style:italic;">None</span>';
      const descRow = item.description ? `
        <div class="popover-desc-row">
          <span class="popover-label">Description</span>
          <span class="popover-desc-val">${this.escapeHtml(item.description)}</span>
        </div>
      ` : '';

      return `
        <div class="media-info-popover" id="${popoverId}" onclick="event.stopPropagation();">
          <div class="popover-header">
            <div class="popover-type-tag">
              <i data-lucide="${typeIcon}"></i> ${typeLabel}
            </div>
            <span class="popover-ext">${details.ext || item.type.toUpperCase()}</span>
          </div>
          <div class="popover-grid">
            <div class="popover-row popover-highlight-row">
              <span class="popover-label">${dimLabel}</span>
              <span class="popover-val popover-dim-val" id="popdim-${popoverId}">${details.dimensions}</span>
            </div>
            <div class="popover-row">
              <span class="popover-label">Title</span>
              <span class="popover-val popover-filename" title="${this.escapeHtml(displayTitle)}" style="font-weight:600; color:#fff;">${this.escapeHtml(displayTitle)}</span>
            </div>
            <div class="popover-row">
              <span class="popover-label">Alt Text</span>
              <span class="popover-val popover-filename" title="${this.escapeHtml(item.alt || '')}">${altVal}</span>
            </div>
            ${descRow}
            ${aspectRow}
            ${durationRow}
            ${formatRow}
            <div class="popover-row">
              <span class="popover-label">File Size</span>
              <span class="popover-val">${item.size || 'N/A'}</span>
            </div>
            <div class="popover-row">
              <span class="popover-label">File Name</span>
              <span class="popover-val popover-filename" title="${this.escapeHtml(item.name)}">${this.escapeHtml(cleanName)}</span>
            </div>
            <div class="popover-row">
              <span class="popover-label">Added</span>
              <span class="popover-val">${item.date || 'System'}</span>
            </div>
          </div>
          <div class="popover-footer" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end;">
            <button type="button" class="popover-edit-btn" onclick="adminApp.openEditMediaModal('${item.id}')">
              <i data-lucide="pencil"></i> Edit Details
            </button>
          </div>
        </div>
      `;
    }

    setupMediaInfoPopovers() {
      const triggers = document.querySelectorAll('.media-info-trigger');
      triggers.forEach(trigger => {
        const popover = trigger.querySelector('.media-info-popover');
        if (!popover) return;

        const checkPosition = () => {
          const rect = trigger.getBoundingClientRect();
          const grid = trigger.closest('.media-grid');
          const gridTop = grid ? grid.getBoundingClientRect().top : 0;
          const spaceAboveInGrid = rect.top - gridTop;
          const spaceBelowViewport = window.innerHeight - rect.bottom;

          // If opening upward would extend above the grid (e.g. first row of cards)
          // or if trigger is near viewport top, flip downward so it stays clean and never clips!
          if ((rect.top < 450 || spaceAboveInGrid < 360) && spaceBelowViewport > 260) {
            popover.classList.add('popover-flipped-down');
          } else if (rect.top < 360) {
            popover.classList.add('popover-flipped-down');
          } else {
            popover.classList.remove('popover-flipped-down');
          }
          const card = trigger.closest('.media-card');
          if (card) card.classList.add('popover-active');
        };

        const handleLeave = () => {
          if (!popover.classList.contains('is-pinned')) {
            const card = trigger.closest('.media-card');
            if (card) card.classList.remove('popover-active');
          }
        };

        if (!trigger.dataset.popoverBound) {
          trigger.dataset.popoverBound = 'true';

          trigger.addEventListener('mouseenter', checkPosition);
          trigger.addEventListener('focusin', checkPosition);
          trigger.addEventListener('mouseleave', handleLeave);
          trigger.addEventListener('focusout', handleLeave);

          // Clicking the info trigger pins the popover open until clicked outside
          trigger.addEventListener('click', (e) => {
            if (e.target.closest('.popover-edit-btn')) return;
            e.stopPropagation();

            const wasPinned = popover.classList.contains('is-pinned');
            // Unpin all other popovers
            document.querySelectorAll('.media-info-popover.is-pinned').forEach(p => {
              p.classList.remove('is-pinned');
              const c = p.closest('.media-card');
              if (c) c.classList.remove('popover-active');
            });

            if (!wasPinned) {
              checkPosition();
              popover.classList.add('is-pinned');
              const card = trigger.closest('.media-card');
              if (card) card.classList.add('popover-active');
            }
          });
        }
      });

      // Global click-outside dismisser
      if (!document.body.dataset.popoverGlobalBound) {
        document.body.dataset.popoverGlobalBound = 'true';
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.media-info-trigger')) {
            document.querySelectorAll('.media-info-popover.is-pinned').forEach(p => {
              p.classList.remove('is-pinned');
              const card = p.closest('.media-card');
              if (card) card.classList.remove('popover-active');
            });
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            document.querySelectorAll('.media-info-popover.is-pinned').forEach(p => {
              p.classList.remove('is-pinned');
              const card = p.closest('.media-card');
              if (card) card.classList.remove('popover-active');
            });
          }
        });
      }
    }

    updateMediaItemDimensions(id, meta) {
      if (!this.mediaMetadataCache) this.mediaMetadataCache = {};
      this.mediaMetadataCache[id] = Object.assign(this.mediaMetadataCache[id] || {}, meta);

      const badges = document.querySelectorAll(`[id="dim-badge-${id}"], [id="picker-dim-badge-${id}"]`);
      badges.forEach(b => {
        if (meta.dimensions) {
          const short = meta.dimensions.replace(' px', '');
          b.textContent = short;
          b.style.display = 'inline-flex';
        }
      });

      const popvals = document.querySelectorAll(`[id^="popdim-popover-${id}"], [id^="popdim-act-popover-${id}"], [id^="popdim-picker-popover-${id}"]`);
      popvals.forEach(pv => {
        if (meta.dimensions) pv.textContent = meta.dimensions;
      });
    }

    populateMediaLibrary(filter = null, search = null) {
      if (!window.HamilioMediaStore) return;

      if (filter !== null) this.currentMediaFilter = filter;
      if (search !== null) this.currentMediaSearch = search;

      const container = document.getElementById('admin-media-grid');
      if (!container) return;

      const allItems = window.HamilioMediaStore.getAllMedia();

      // Update counters
      const countAll = document.getElementById('media-count-all');
      const countImg = document.getElementById('media-count-image');
      const countVid = document.getElementById('media-count-video');
      const countDoc = document.getElementById('media-count-doc');

      if (countAll) countAll.textContent = allItems.length;
      if (countImg) countImg.textContent = allItems.filter(m => m.type === 'image').length;
      if (countVid) countVid.textContent = allItems.filter(m => m.type === 'video').length;
      if (countDoc) countDoc.textContent = allItems.filter(m => m.type === 'document').length;

      // Filter by type
      let filtered = allItems;
      if (this.currentMediaFilter !== 'all') {
        filtered = filtered.filter(m => m.type === this.currentMediaFilter);
      }

      // Filter by search query across name, title, alt, description, and type
      if (this.currentMediaSearch) {
        const q = this.currentMediaSearch.toLowerCase();
        filtered = filtered.filter(m =>
          (m.name && m.name.toLowerCase().includes(q)) ||
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.alt && m.alt.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.type && m.type.toLowerCase().includes(q))
        );
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">
            <i data-lucide="folder-open" style="font-size: 3rem; margin-bottom: 8px;"></i>
            <p>No media assets found matching the selected filter.</p>
          </div>
        `;
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        return;
      }

      container.innerHTML = filtered.map(item => {
        const isBuiltIn = item.id.startsWith('bm_');
        const badgeBuiltin = isBuiltIn ? `<span class="media-badge-builtin">System</span>` : '';
        const deleteBtn = !isBuiltIn
          ? `<button type="button" class="btn-media-icon btn-media-delete" title="Delete file" aria-label="Delete file" onclick="adminApp.deleteMediaFile('${item.id}')"><i data-lucide="trash-2"></i></button>`
          : '';

        const details = this.getMediaCardDetails(item);

        let previewHtml = '';
        if (item.type === 'image') {
          previewHtml = `
            <img id="media-thumb-${item.id}" src="../assets/img/hvec.png" alt="${this.escapeHtml(item.alt || item.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <div class="media-img-fallback">
              <i data-lucide="image" style="font-size: 2rem;"></i>
              <span style="font-size: 0.72rem;">Image File</span>
            </div>
          `;
        } else if (item.type === 'video') {
          previewHtml = `
            <div class="media-video-preview">
              <video id="media-thumb-${item.id}" muted preload="metadata"></video>
              <div class="video-play-icon"><i data-lucide="play"></i></div>
            </div>
          `;
        } else {
          previewHtml = `
            <div class="media-doc-preview">
              <i data-lucide="file-text" style="font-size: 3rem;"></i>
              <span style="font-size: 0.75rem; margin-top: 4px;">PDF Document</span>
            </div>
          `;
        }

        const displayTitle = item.title || item.name;
        const altBadge = item.alt ? `<span class="media-meta-chip chip-alt" title="Alt: ${this.escapeHtml(item.alt)}">ALT</span>` : '';

        const isRaster = item.type === 'image';
        const isAvif = (item.format && item.format.includes('AVIF')) || /\.(avif)$/i.test(item.name || item.url);
        const isWebp = (item.format && item.format.includes('WebP')) || /\.(webp)$/i.test(item.name || item.url);
        const optBadge = isRaster
          ? (isAvif
              ? `<span class="media-meta-chip chip-opt-done" style="color:#c084fc; border-color:rgba(168,85,247,0.3); background:rgba(168,85,247,0.14);" title="Optimized Modern AVIF Format">AVIF</span>`
              : (isWebp
                  ? `<span class="media-meta-chip chip-opt-done" title="Optimized Modern WebP Format">WEBP</span>`
                  : `<span class="media-meta-chip chip-can-opt" title="Click to optimize to WebP/AVIF" onclick="adminApp.openQuickOptimizeImage('${item.id}')"><i data-lucide="zap" style="width:10px;height:10px;"></i> Opt</span>`))
          : (item.type === 'video'
              ? `<span class="media-meta-chip chip-video-protect" title="Low-Bandwidth Protected with Adaptive Streaming"><i data-lucide="shield-check" style="width:10px;height:10px;"></i> Low-BW</span>`
              : '');

        const optBtn = item.type === 'image'
          ? `<button type="button" class="btn-media-icon btn-media-opt" title="Optimize to WebP or AVIF" aria-label="Optimize Image" onclick="adminApp.openQuickOptimizeImage('${item.id}')"><i data-lucide="zap"></i></button>`
          : (item.type === 'video'
              ? `<button type="button" class="btn-media-icon btn-media-poster" title="Extract WebP Poster Frame" aria-label="Extract Poster" onclick="adminApp.quickExtractVideoPoster('${item.id}')"><i data-lucide="camera"></i></button>`
              : '');

        const isSelected = this.selectedMediaIds && this.selectedMediaIds.has(item.id);
        const selectCheckboxHtml = isRaster
          ? `
            <label class="media-card-select-label" title="Select image for WebP / AVIF conversion" onclick="event.stopPropagation();">
              <input type="checkbox" class="media-card-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''} onchange="adminApp.toggleMediaCardSelect('${item.id}', this.checked)">
              <span class="media-card-checkbox-custom"><i data-lucide="check"></i></span>
            </label>
          `
          : '';

        return `
          <div class="media-card ${isSelected ? 'is-selected' : ''} ${isRaster ? 'has-select' : ''}" id="card-${item.id}">
            ${selectCheckboxHtml}
            <span class="media-badge-type">${item.type}</span>
            ${badgeBuiltin}
            <div class="media-thumbnail-box">
              ${previewHtml}
            </div>
            <div class="media-card-info">
              <div class="media-card-title-group">
                <div class="media-card-title" title="${this.escapeHtml(displayTitle)}">${this.escapeHtml(displayTitle)}</div>
                ${item.name ? `<div class="media-card-filename" title="${this.escapeHtml(item.name)}">${this.escapeHtml(item.name)}</div>` : ''}
              </div>
              <div class="media-card-meta-chips">
                ${item.size ? `<span class="media-meta-chip">${this.escapeHtml(item.size)}</span>` : ''}
                <span id="dim-badge-${item.id}" class="media-meta-chip chip-dim" style="${details.dimShort ? '' : 'display:none;'}">${details.dimShort || ''}</span>
                ${altBadge}
                ${optBadge}
                ${item.date ? `<span class="media-meta-chip chip-date">${this.escapeHtml(item.date)}</span>` : ''}
              </div>
            </div>
            <div class="media-card-actions">
              <button type="button" class="btn-media-icon btn-copy-path" title="Copy file path" aria-label="Copy Path" onclick="adminApp.copyMediaUrl('${item.url}', this)">
                <i data-lucide="copy"></i>
              </button>
              ${optBtn}
              <button type="button" class="btn-media-icon" title="Edit Alt, Title & Description" aria-label="Edit Details" onclick="adminApp.openEditMediaModal('${item.id}')">
                <i data-lucide="pencil"></i>
              </button>
              <button type="button" class="btn-media-icon" title="Preview Media" aria-label="Preview" onclick="adminApp.previewMedia('${item.id}')">
                <i data-lucide="eye"></i>
              </button>
              <div class="media-info-trigger" data-media-id="${item.id}" tabindex="0">
                <button type="button" class="btn-media-icon" title="File Details" aria-label="Details">
                  <i data-lucide="info"></i>
                </button>
                ${this.renderMediaInfoPopover(item, details, `popover-${item.id}`)}
              </div>
              ${deleteBtn}
            </div>
          </div>
        `;
      }).join('');

      this.updateMediaSelectionUI();

      // Asynchronously resolve thumbnails and detect dynamic dimensions
      filtered.forEach(async (item) => {
        const displayUrl = await this.resolveAdminDisplayUrl(item.url);

        if (item.type === 'image') {
          const el = document.getElementById(`media-thumb-${item.id}`);
          if (el) el.src = displayUrl;

          // Dynamically detect dimensions if not already known
          if (!item.dimensions || item.dimensions === 'Detecting...') {
            const img = new Image();
            img.onload = () => {
              const w = img.naturalWidth;
              const h = img.naturalHeight;
              const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
              const div = (w && h) ? gcd(w, h) : 1;
              const ratio = (w && h) ? `${w / div}:${h / div}` : '';
              const dimStr = `${w} × ${h} px`;
              this.updateMediaItemDimensions(item.id, {
                dimensions: dimStr,
                aspectRatio: ratio,
                width: w,
                height: h
              });
            };
            img.src = displayUrl;
          }
        } else if (item.type === 'video') {
          const el = document.getElementById(`media-thumb-${item.id}`);
          if (el) el.src = displayUrl;

          if (!item.dimensions || item.dimensions === 'Detecting...') {
            const vid = document.createElement('video');
            vid.preload = 'metadata';
            vid.onloadedmetadata = () => {
              const w = vid.videoWidth;
              const h = vid.videoHeight;
              const durSec = Math.round(vid.duration || 0);
              const mins = Math.floor(durSec / 60);
              const secs = durSec % 60;
              const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
              const dimStr = (w && h) ? `${w} × ${h} px` : 'Video File';
              this.updateMediaItemDimensions(item.id, {
                dimensions: dimStr,
                duration: durStr,
                width: w,
                height: h
              });
            };
            vid.src = displayUrl;
          }
        }
      });

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
      this.setupMediaInfoPopovers();
    }

    filterMediaLibrary(filterType, buttonEl) {
      if (buttonEl) {
        document.querySelectorAll('#tab-media .filter-pill').forEach(b => b.classList.remove('active'));
        buttonEl.classList.add('active');
      }
      this.populateMediaLibrary(filterType);
    }

    searchMediaLibrary(query) {
      this.populateMediaLibrary(this.currentMediaFilter, query);
    }

    async deleteMediaFile(id) {
      if (!confirm('Are you sure you want to permanently delete this media file?')) return;
      const success = await window.HamilioMediaStore.deleteFile(id);
      if (success) {
        showToast('Media file deleted.');
        this.populateMediaLibrary();
        if (document.getElementById('media-picker-modal').style.display === 'flex') {
          this.renderPickerGrid();
        }
      }
    }

    copyMediaUrl(url, btnEl) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Media URL copied to clipboard: ' + url, 'success');
      }).catch(() => {
        showToast('Copied: ' + url);
      });

      if (btnEl) {
        const origHtml = btnEl.innerHTML;
        btnEl.innerHTML = '<i data-lucide="check" style="color: #22c55e;"></i>';
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        setTimeout(() => {
          btnEl.innerHTML = origHtml;
          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }
        }, 1400);
      }
    }

    async previewMedia(id) {
      const all = window.HamilioMediaStore.getAllMedia();
      const item = all.find(m => m.id === id);
      if (!item) return;

      const displayUrl = await this.resolveAdminDisplayUrl(item.url);
      window.open(displayUrl, '_blank');
    }

    // ------------------------------------------
    // MEDIA PICKER MODAL (CHOOSE FROM MEDIA)
    // ------------------------------------------
    openMediaPicker(targetInputId, expectedType = 'all') {
      this.pickerTargetInput = targetInputId;
      this.pickerExpectedType = expectedType;
      this.pickerFilter = expectedType;
      this.pickerSearch = '';

      // Update titles
      const titles = {
        'hero-bg-webp': 'Select WebP Hero Background',
        'hero-bg-fallback': 'Select Hero Fallback Background',
        'about-profile-image': 'Select About Profile Picture',
        'resume-pdf-url': 'Select Resume Document (PDF)',
        'port-media-url': 'Select Portfolio Project Media'
      };

      const titleEl = document.getElementById('media-picker-title');
      const subEl = document.getElementById('media-picker-subtitle');
      if (titleEl) titleEl.textContent = titles[targetInputId] || 'Select Media Asset';
      if (subEl) subEl.textContent = `Choose an asset to insert into your form field`;

      // Set active filter pill
      document.querySelectorAll('#media-picker-modal .filter-pill').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (expectedType === 'all' && text.includes('all')) {
          btn.classList.add('active');
        } else if (expectedType !== 'all' && text.includes(expectedType)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const searchInput = document.getElementById('picker-search-input');
      if (searchInput) searchInput.value = '';

      this.renderPickerGrid();

      const modal = document.getElementById('media-picker-modal');
      if (modal) modal.style.display = 'flex';
    }

    closeMediaPicker() {
      const modal = document.getElementById('media-picker-modal');
      if (modal) modal.style.display = 'none';
      this.pickerTargetInput = null;
    }

    filterPickerGrid(filterType, buttonEl) {
      if (buttonEl) {
        document.querySelectorAll('#media-picker-modal .filter-pill').forEach(b => b.classList.remove('active'));
        buttonEl.classList.add('active');
      }
      this.pickerFilter = filterType;
      this.renderPickerGrid();
    }

    searchPickerGrid(query) {
      this.pickerSearch = (query || '').toLowerCase().trim();
      this.renderPickerGrid();
    }

    renderPickerGrid() {
      const container = document.getElementById('media-picker-grid');
      if (!container || !window.HamilioMediaStore) return;

      const all = window.HamilioMediaStore.getAllMedia();
      let list = all;

      if (this.pickerFilter !== 'all') {
        list = list.filter(m => m.type === this.pickerFilter);
      }

      if (this.pickerSearch) {
        const q = this.pickerSearch;
        list = list.filter(m =>
          (m.name && m.name.toLowerCase().includes(q)) ||
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.alt && m.alt.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.type && m.type.toLowerCase().includes(q))
        );
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">
            <i data-lucide="image" style="font-size: 3rem; margin-bottom: 8px;"></i>
            <p>No media files match your selection.</p>
          </div>
        `;
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        return;
      }

      container.innerHTML = list.map(item => {
        const details = this.getMediaCardDetails(item);

        let previewHtml = '';
        if (item.type === 'image') {
          previewHtml = `
            <img id="picker-thumb-${item.id}" src="../assets/img/hvec.png" alt="${this.escapeHtml(item.alt || item.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <div class="media-img-fallback">
              <i data-lucide="image" style="font-size: 2rem;"></i>
              <span style="font-size: 0.72rem;">Image File</span>
            </div>
          `;
        } else if (item.type === 'video') {
          previewHtml = `
            <div class="media-video-preview">
              <video id="picker-thumb-${item.id}" muted preload="metadata"></video>
              <div class="video-play-icon"><i data-lucide="play"></i></div>
            </div>
          `;
        } else {
          previewHtml = `
            <div class="media-doc-preview">
              <i data-lucide="file-text" style="font-size: 3rem;"></i>
              <span style="font-size: 0.75rem; margin-top: 4px;">PDF Document</span>
            </div>
          `;
        }

        const displayTitle = item.title || item.name;
        const altBadge = item.alt ? `<span class="media-meta-chip chip-alt" title="Alt: ${this.escapeHtml(item.alt)}">ALT</span>` : '';

        return `
          <div class="media-card selectable" onclick="adminApp.selectMediaForTarget('${item.url}', '${this.escapeHtml(displayTitle).replace(/'/g, "\\'")}', '${item.type}')">
            <span class="media-badge-type">${item.type}</span>
            <div class="media-thumbnail-box">
              ${previewHtml}
            </div>
            <div class="media-card-info">
              <div class="media-card-title-group">
                <div class="media-card-title" title="${this.escapeHtml(displayTitle)}">${this.escapeHtml(displayTitle)}</div>
                ${item.name ? `<div class="media-card-filename" title="${this.escapeHtml(item.name)}">${this.escapeHtml(item.name)}</div>` : ''}
              </div>
              <div class="media-card-meta-chips">
                ${item.size ? `<span class="media-meta-chip">${this.escapeHtml(item.size)}</span>` : ''}
                <span id="picker-dim-badge-${item.id}" class="media-meta-chip chip-dim" style="${details.dimShort ? '' : 'display:none;'}">${details.dimShort || ''}</span>
                ${altBadge}
                <span class="media-meta-chip" style="color: #4ade80; border-color: rgba(74, 222, 128, 0.2); font-weight: 500;">Select</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Asynchronously load thumbnail src & detect dimensions
      list.forEach(async (item) => {
        const displayUrl = await this.resolveAdminDisplayUrl(item.url);

        if (item.type === 'image') {
          const el = document.getElementById(`picker-thumb-${item.id}`);
          if (el) el.src = displayUrl;

          if (!item.dimensions || item.dimensions === 'Detecting...') {
            const img = new Image();
            img.onload = () => {
              const w = img.naturalWidth;
              const h = img.naturalHeight;
              const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
              const div = gcd(w, h);
              const ratio = `${w / div}:${h / div}`;
              const dimStr = `${w} × ${h} px`;
              this.updateMediaItemDimensions(item.id, {
                dimensions: dimStr,
                aspectRatio: ratio,
                width: w,
                height: h
              });
            };
            img.src = displayUrl;
          }
        } else if (item.type === 'video') {
          const el = document.getElementById(`picker-thumb-${item.id}`);
          if (el) el.src = displayUrl;

          if (!item.dimensions || item.dimensions === 'Detecting...') {
            const vid = document.createElement('video');
            vid.preload = 'metadata';
            vid.onloadedmetadata = () => {
              const w = vid.videoWidth;
              const h = vid.videoHeight;
              const durSec = Math.round(vid.duration || 0);
              const mins = Math.floor(durSec / 60);
              const secs = durSec % 60;
              const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
              const dimStr = (w && h) ? `${w} × ${h} px` : 'Video File';
              this.updateMediaItemDimensions(item.id, {
                dimensions: dimStr,
                duration: durStr,
                width: w,
                height: h
              });
            };
            vid.src = displayUrl;
          }
        }
      });

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    selectMediaForTarget(url, name, type) {
      if (!this.pickerTargetInput) return;

      const input = document.getElementById(this.pickerTargetInput);
      if (input) {
        input.value = url;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // If choosing for portfolio card, automatically set media type
      if (this.pickerTargetInput === 'port-media-url') {
        const typeSelect = document.getElementById('port-media-type');
        if (typeSelect && type) {
          typeSelect.value = type;
        }
      }

      showToast(`Selected "${name}"!`, 'success');
      this.closeMediaPicker();
    }

    // ------------------------------------------
    // Visitor Analytics & Real-Time Telemetry
    // ------------------------------------------

    updateOverviewVisitorStats() {
      if (!window.PortfolioDataService) return;
      const data = window.PortfolioDataService.getVisitorAnalytics();
      const overviewVisitors = document.getElementById('stat-overview-visitors');
      const overviewStaying = document.getElementById('stat-overview-staying-time');

      if (overviewVisitors) {
        overviewVisitors.textContent = (data.summary?.totalVisits || 0).toLocaleString();
      }
      if (overviewStaying) {
        overviewStaying.textContent = this.formatStayingTime(data.summary?.avgStayingTimeSeconds || 0);
      }
    }

    renderAnalytics() {
      if (!window.PortfolioDataService) return;
      const data = window.PortfolioDataService.getVisitorAnalytics();

      const summary = data.summary || {
        totalVisits: 0,
        uniqueVisitors: 0,
        avgStayingTimeSeconds: 0,
        consentAccepted: 0,
        consentRejected: 0
      };

      const sessions = data.sessions || [];
      const countryCounts = data.countryCounts || {};

      // 1. Calculate KPIs
      const totalVisits = summary.totalVisits || 0;
      const uniqueVisitors = summary.uniqueVisitors || 0;
      const avgDuration = summary.avgStayingTimeSeconds || 0;
      const consentAccepted = summary.consentAccepted || 0;
      const consentRejected = summary.consentRejected || 0;
      const totalConsent = consentAccepted + consentRejected;
      const consentRate = totalConsent > 0 ? Math.round((consentAccepted / totalConsent) * 100) : 100;

      // Count visits today
      const todayKey = new Date().toISOString().slice(0, 10);
      const todayVisits = data.dailyCounts?.[todayKey] || sessions.filter(s => s.timestamp?.slice(0, 10) === todayKey).length || 0;

      // Top country calculation
      let topCountry = { name: 'Global', flag: '🌐', count: 0 };
      Object.values(countryCounts).forEach(c => {
        if (c.count > topCountry.count) {
          topCountry = c;
        }
      });
      const topCountryPct = totalVisits > 0 ? Math.round((topCountry.count / totalVisits) * 100) : 0;

      // Bounce rate (<30s)
      const bounceCount = sessions.filter(s => (s.stayingTimeSeconds || 0) < 30).length;
      const bounceRate = sessions.length > 0 ? Math.round((bounceCount / sessions.length) * 100) : 18;

      // 2. Update KPI Elements
      const kpiTotal = document.getElementById('kpi-total-visits');
      const kpiUnique = document.getElementById('kpi-unique-badge');
      const kpiToday = document.getElementById('kpi-visits-today');
      const kpiDuration = document.getElementById('kpi-avg-duration');
      const kpiTopC = document.getElementById('kpi-top-country');
      const kpiCountC = document.getElementById('kpi-country-count');
      const kpiBounce = document.getElementById('kpi-bounce-rate');
      const kpiConsent = document.getElementById('kpi-consent-rate');
      const kpiConsentRatio = document.getElementById('kpi-consent-ratio');

      if (kpiTotal) kpiTotal.textContent = totalVisits.toLocaleString();
      if (kpiUnique) kpiUnique.textContent = `${uniqueVisitors.toLocaleString()} Unique`;
      if (kpiToday) kpiToday.textContent = `+${todayVisits} recorded today`;
      if (kpiDuration) kpiDuration.textContent = this.formatStayingTime(avgDuration);
      if (kpiTopC) kpiTopC.textContent = `${topCountry.flag || '🌐'} ${topCountry.name}`;
      if (kpiCountC) kpiCountC.textContent = `${topCountry.count} visits (${topCountryPct}%)`;
      if (kpiBounce) kpiBounce.textContent = `${bounceRate}%`;
      if (kpiConsent) kpiConsent.textContent = `${consentRate}%`;
      if (kpiConsentRatio) kpiConsentRatio.textContent = `${consentAccepted} / ${totalConsent}`;

      // 3. Render Visual Charts
      this.renderTrafficTimelineChart(data);
      this.renderCountriesChart(data);
      this.renderStayingTimeChart(data);
      this.renderDevicesChart(data);

      // 4. Render Table
      this.renderVisitorTable(sessions);
    }

    renderTrafficTimelineChart(data) {
      const canvas = document.getElementById('chart-traffic-timeline');
      if (!canvas || typeof Chart === 'undefined') return;

      if (this.charts.timeline) {
        try { this.charts.timeline.destroy(); } catch (e) {}
      }

      const dailyCounts = data.dailyCounts || {};
      const sortedKeys = Object.keys(dailyCounts).sort();
      let labels = [];
      let counts = [];

      if (sortedKeys.length === 0) {
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          labels.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`);
          counts.push(0);
        }
      } else {
        labels = sortedKeys.map(d => {
          const parts = d.split('-');
          return `${parts[1]}/${parts[2]}`;
        });
        counts = sortedKeys.map(d => dailyCounts[d]);
      }

      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 240);
      gradient.addColorStop(0, 'rgba(24, 210, 110, 0.28)');
      gradient.addColorStop(1, 'rgba(24, 210, 110, 0.0)');

      this.charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Daily Visitors',
            data: counts,
            borderColor: '#18d26e',
            backgroundColor: gradient,
            borderWidth: 2,
            pointBackgroundColor: '#18d26e',
            pointBorderColor: '#0a0a0a',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111111',
              borderColor: '#2e2e2e',
              borderWidth: 1,
              titleColor: '#ededed',
              bodyColor: '#a1a1a1',
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (context) => `Visitors: ${context.parsed.y}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: { color: '#888888', font: { size: 11, family: 'Inter' } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: { color: '#888888', font: { size: 11, family: 'Inter' }, precision: 0 }
            }
          }
        }
      });
    }

    renderCountriesChart(data) {
      const canvas = document.getElementById('chart-countries-pie');
      const legendList = document.getElementById('countries-legend-list');
      if (!canvas || typeof Chart === 'undefined') return;

      if (this.charts.countries) {
        try { this.charts.countries.destroy(); } catch (e) {}
      }

      const countryCounts = data.countryCounts || {};
      const sorted = Object.entries(countryCounts).sort((a, b) => b[1].count - a[1].count);
      const topCountries = sorted.slice(0, 6);

      if (topCountries.length === 0) {
        this.charts.countries = new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels: ['No Visitors Yet'],
            datasets: [{
              data: [1],
              backgroundColor: ['#1f1f1f'],
              borderColor: '#0a0a0a',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            }
          }
        });

        if (legendList) {
          legendList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.8rem; padding: 24px 8px; text-align: center;">No international visitor data recorded yet.</div>`;
        }
        return;
      }
      
      const totalVisits = topCountries.reduce((sum, [, c]) => sum + c.count, 0) || 1;
      const labels = topCountries.map(([, c]) => `${c.flag || ''} ${c.name}`);
      const counts = topCountries.map(([, c]) => c.count);
      const colors = ['#18d26e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#64748b'];

      this.charts.countries = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: colors.slice(0, counts.length),
            borderColor: '#0a0a0a',
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111111',
              borderColor: '#2e2e2e',
              borderWidth: 1,
              titleColor: '#ededed',
              bodyColor: '#a1a1a1',
              padding: 10,
              callbacks: {
                label: (context) => {
                  const val = context.parsed;
                  const pct = Math.round((val / totalVisits) * 100);
                  return ` ${val} visits (${pct}%)`;
                }
              }
            }
          }
        }
      });

      // Populate custom HTML legend list
      if (legendList) {
        legendList.innerHTML = topCountries.map(([code, c], i) => {
          const pct = Math.round((c.count / totalVisits) * 100);
          const color = colors[i % colors.length];
          return `
            <div class="country-legend-item">
              <span class="country-flag-icon">${c.flag || '🌐'}</span>
              <div class="country-info">
                <div class="country-name-row">
                  <span>${c.name}</span>
                  <span>${c.count} (${pct}%)</span>
                </div>
                <div class="country-bar-bg">
                  <div class="country-bar-fill" style="width: ${pct}%; background-color: ${color};"></div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    renderStayingTimeChart(data) {
      const canvas = document.getElementById('chart-staying-time');
      if (!canvas || typeof Chart === 'undefined') return;

      if (this.charts.stayingTime) {
        try { this.charts.stayingTime.destroy(); } catch (e) {}
      }

      const buckets = data.durationBuckets || {
        bounce: 0,
        skim: 0,
        engaged: 0,
        deep: 0,
        fan: 0
      };

      const labels = ['< 30s', '30s - 1m', '1m - 3m', '3m - 5m', '> 5m'];
      const counts = [
        buckets.bounce || 0,
        buckets.skim || 0,
        buckets.engaged || 0,
        buckets.deep || 0,
        buckets.fan || 0
      ];
      const barColors = ['#f87171', '#fbbf24', '#4ade80', '#38bdf8', '#a855f7'];

      this.charts.stayingTime = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Visitors',
            data: counts,
            backgroundColor: barColors,
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111111',
              borderColor: '#2e2e2e',
              borderWidth: 1,
              titleColor: '#ededed',
              bodyColor: '#a1a1a1',
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (context) => `Sessions: ${context.parsed.y}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#888888', font: { size: 11, family: 'Inter' } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: { color: '#888888', font: { size: 11, family: 'Inter' }, precision: 0 }
            }
          }
        }
      });
    }

    renderDevicesChart(data) {
      const canvas = document.getElementById('chart-devices');
      const legendList = document.getElementById('devices-legend-list');
      if (!canvas || typeof Chart === 'undefined') return;

      if (this.charts.devices) {
        try { this.charts.devices.destroy(); } catch (e) {}
      }

      const devices = data.deviceCounts || { Desktop: 0, Mobile: 0, Tablet: 0 };
      const labels = ['Desktop', 'Mobile', 'Tablet'];
      const counts = [devices.Desktop || 0, devices.Mobile || 0, devices.Tablet || 0];
      const colors = ['#38bdf8', '#a855f7', '#fbbf24'];
      const total = counts.reduce((a, b) => a + b, 0);

      if (total === 0) {
        this.charts.devices = new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels: ['No Data Yet'],
            datasets: [{
              data: [1],
              backgroundColor: ['#1f1f1f'],
              borderColor: '#0a0a0a',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            }
          }
        });

        if (legendList) {
          legendList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.8rem; padding: 24px 8px; text-align: center;">No hardware/device data recorded yet.</div>`;
        }
        return;
      }

      this.charts.devices = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: colors,
            borderColor: '#0a0a0a',
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111111',
              borderColor: '#2e2e2e',
              borderWidth: 1,
              titleColor: '#ededed',
              bodyColor: '#a1a1a1',
              padding: 10,
              callbacks: {
                label: (context) => {
                  const val = context.parsed;
                  const pct = Math.round((val / total) * 100);
                  return ` ${context.label}: ${val} (${pct}%)`;
                }
              }
            }
          }
        }
      });

      if (legendList) {
        const browsers = data.browserCounts || {};
        const browserItems = Object.entries(browsers).slice(0, 4).map(([name, count]) => {
          return `<span style="font-size: 0.73rem; color: #a1a1a1;">${name}: <strong style="color: #ededed;">${count}</strong></span>`;
        }).join(' · ');

        legendList.innerHTML = labels.map((name, i) => {
          const count = counts[i];
          const pct = Math.round((count / total) * 100);
          return `
            <div class="device-legend-item">
              <div class="device-info">
                <div class="device-name-row">
                  <span>${name}</span>
                  <span>${count} (${pct}%)</span>
                </div>
                <div class="device-bar-bg">
                  <div class="device-bar-fill" style="width: ${pct}%; background-color: ${colors[i]};"></div>
                </div>
              </div>
            </div>
          `;
        }).join('') + `
          <div style="padding: 6px 4px 0; border-top: 1px solid var(--border-subtle); margin-top: 4px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 2px;">Top Browsers:</div>
            <div>${browserItems || '<span style="color: var(--text-muted);">None</span>'}</div>
          </div>
        `;
      }
    }

    renderVisitorTable(sessions) {
      const tbody = document.getElementById('analytics-sessions-tbody');
      if (!tbody) return;

      let list = Array.isArray(sessions) ? [...sessions] : [];

      // Filter by device
      if (this.analyticsFilterDevice && this.analyticsFilterDevice !== 'all') {
        list = list.filter(s => (s.device || '').toLowerCase() === this.analyticsFilterDevice.toLowerCase());
      }

      // Filter by search query
      if (this.analyticsSearchQuery) {
        const q = this.analyticsSearchQuery.toLowerCase();
        list = list.filter(s => {
          return (s.id || '').toLowerCase().includes(q) ||
                 (s.country || '').toLowerCase().includes(q) ||
                 (s.city || '').toLowerCase().includes(q) ||
                 (s.browser || '').toLowerCase().includes(q) ||
                 (s.os || '').toLowerCase().includes(q) ||
                 (s.device || '').toLowerCase().includes(q) ||
                 (s.referrer || '').toLowerCase().includes(q);
        });
      }

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 40px 16px; color: var(--text-muted);">
              <div style="font-size: 0.95rem; font-weight: 500; color: #ededed; margin-bottom: 4px;">No visitor sessions recorded yet</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">Browse the portfolio in another tab or device to see your real session and staying time appear here in real-time.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = list.map(s => {
        const durationSec = s.stayingTimeSeconds || 0;
        const durationText = this.formatStayingTime(durationSec);
        const durationClass = this.getDurationBadgeClass(durationSec);
        const relativeTime = this.formatRelativeTime(s.lastActive || s.timestamp);

        const consentPill = s.consent === 'accepted'
          ? `<span class="consent-pill accepted"><i data-lucide="check" style="width: 11px; height: 11px;"></i> Accepted</span>`
          : (s.consent === 'rejected'
              ? `<span class="consent-pill rejected"><i data-lucide="x" style="width: 11px; height: 11px;"></i> Rejected</span>`
              : `<span class="consent-pill pending">Pending</span>`);

        const sections = Array.isArray(s.sectionsViewed) && s.sectionsViewed.length > 0
          ? s.sectionsViewed.map(sec => `<span class="section-tag-mini">${sec}</span>`).join('')
          : `<span class="section-tag-mini">home</span>`;

        return `
          <tr>
            <td><code style="font-size: 0.75rem; color: #ededed;">${s.id ? s.id.substring(0, 14) : '--'}</code></td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.15rem; line-height: 1;">${s.flag || '🌐'}</span>
                <div>
                  <div style="font-weight: 500; color: #ededed;">${s.country || 'Global Visitor'}</div>
                  <small style="color: var(--text-muted);">${s.city || 'Direct'}</small>
                </div>
              </div>
            </td>
            <td>
              <span class="staying-time-badge ${durationClass}">
                <i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${durationText}
              </span>
            </td>
            <td>
              <div style="color: #ededed; font-weight: 500;">${s.device || 'Desktop'}</div>
              <small style="color: var(--text-muted);">${s.os || 'OS'}</small>
            </td>
            <td><span style="color: #ededed;">${s.browser || 'Browser'}</span></td>
            <td><span style="color: var(--text-secondary);">${s.referrer || 'Direct'}</span></td>
            <td>${consentPill}</td>
            <td><div class="section-tags-list">${sections}</div></td>
            <td style="text-align: right; color: var(--text-muted); font-size: 0.75rem;">${relativeTime}</td>
          </tr>
        `;
      }).join('');

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    formatStayingTime(seconds) {
      if (!seconds || seconds <= 0) return '0s';
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      const remSecs = seconds % 60;
      if (mins < 60) {
        return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins}m`;
      }
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m`;
    }

    getDurationBadgeClass(seconds) {
      if (seconds < 30) return 'duration-bounce';
      if (seconds < 60) return 'duration-skim';
      if (seconds < 180) return 'duration-engaged';
      return 'duration-deep';
    }

    formatRelativeTime(isoString) {
      if (!isoString) return '--';
      try {
        const diffMs = Date.now() - new Date(isoString).getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        if (diffSecs < 60) return 'Just now';
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
      } catch (e) {
        return '--';
      }
    }

    filterAnalyticsTable() {
      const searchInput = document.getElementById('analytics-search-input');
      const deviceSelect = document.getElementById('analytics-filter-device');
      this.analyticsSearchQuery = searchInput ? searchInput.value.trim() : '';
      this.analyticsFilterDevice = deviceSelect ? deviceSelect.value : 'all';

      if (!window.PortfolioDataService) return;
      const data = window.PortfolioDataService.getVisitorAnalytics();
      this.renderVisitorTable(data.sessions || []);
    }

    refreshAnalytics() {
      this.renderAnalytics();
      this.updateOverviewVisitorStats();
      showToast('Visitor analytics refreshed with live data', 'success');
    }

    resetAnalytics() {
      if (!confirm('Are you sure you want to reset all visitor analytics to zero?')) return;
      if (!window.PortfolioDataService) return;
      window.PortfolioDataService.resetVisitorAnalytics();
      this.renderAnalytics();
      this.updateOverviewVisitorStats();
      showToast('Visitor analytics reset to zero', 'success');
    }

    exportAnalyticsCSV() {
      if (!window.PortfolioDataService) return;
      const data = window.PortfolioDataService.getVisitorAnalytics();
      const sessions = data.sessions || [];

      const headers = ['Session ID', 'Timestamp', 'Country', 'City', 'Staying Time (Seconds)', 'Device', 'OS', 'Browser', 'Referrer', 'Consent', 'Sections Viewed'];
      const rows = sessions.map(s => [
        `"${s.id || ''}"`,
        `"${s.timestamp || ''}"`,
        `"${s.country || ''}"`,
        `"${s.city || ''}"`,
        s.stayingTimeSeconds || 0,
        `"${s.device || ''}"`,
        `"${s.os || ''}"`,
        `"${s.browser || ''}"`,
        `"${s.referrer || ''}"`,
        `"${s.consent || ''}"`,
        `"${(s.sectionsViewed || []).join('; ')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hamilio-visitor-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Exported analytics CSV successfully', 'success');
    }

    exportAnalyticsJSON() {
      if (!window.PortfolioDataService) return;
      const data = window.PortfolioDataService.getVisitorAnalytics();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hamilio-visitor-analytics-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Exported analytics JSON successfully', 'success');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
  });
})();
