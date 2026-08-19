/* =============================================================
   NAVIN KUMAR S — PORTFOLIO JAVASCRIPT
   script.js
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. BACKEND DATA AUTO-SYNC (CGPA, Year, Institution) ── */
  async function syncBackendContent() {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const data = await res.json();
        if (data && data.portfolio) {
          const p = data.portfolio;
          
          // Hero status bar CGPA
          const heroCgpa = document.getElementById('hero-cgpa-badge');
          if (heroCgpa && p.cgpa) {
            heroCgpa.textContent = p.cgpa.startsWith('CGPA') ? p.cgpa : `CGPA ${p.cgpa.replace(' / 10', '')}`;
          }

          // Hero status bar Year
          const heroYear = document.getElementById('hero-year-badge');
          if (heroYear && p.year) {
            heroYear.textContent = p.year.includes('—') ? p.year : `2022 — ${p.year}`;
          }

          // Education Section CGPA
          const eduCgpa = document.getElementById('edu-cgpa-value');
          if (eduCgpa && p.cgpa) {
            eduCgpa.textContent = p.cgpa.includes('/ 10') ? p.cgpa : `${p.cgpa} / 10`;
          }

          // Education Section Institution
          const eduInst = document.getElementById('edu-institution');
          if (eduInst && p.institution) {
            const valEl = eduInst.querySelector('.edu-meta-value');
            if (valEl) valEl.textContent = p.institution;
          }

          // Modal CGPA Badge
          const modalCgpaBadge = document.getElementById('modal-cgpa-badge');
          if (modalCgpaBadge && p.cgpa) {
            modalCgpaBadge.textContent = `CGPA: ${p.cgpa.includes('/ 10') ? p.cgpa : p.cgpa + ' / 10'}`;
          }

          // Modal CGPA Grid Value
          const modalCgpaVal = document.getElementById('modal-cgpa-val');
          if (modalCgpaVal && p.cgpa) {
            const cleanCgpa = p.cgpa.replace(' / 10', '');
            modalCgpaVal.textContent = `${cleanCgpa} CGPA (Out of 10.0)`;
          }

          // Modal Institution Value
          const modalInstVal = document.getElementById('modal-institution-val');
          if (modalInstVal && p.institution) {
            modalInstVal.textContent = p.institution;
          }

          // Modal Year Badge
          const modalYearBadge = document.getElementById('modal-year-badge');
          if (modalYearBadge && p.year) {
            modalYearBadge.textContent = `Graduation: ${p.year}`;
          }
        }
      }
    } catch (err) {
      console.log('Backend sync offline');
    }
  }

  syncBackendContent();

  /* ── ELEMENT REFERENCES ─────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const backToTop   = document.getElementById('back-to-top');

  // All navigation links (desktop + mobile)
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  // All sections that should trigger active nav state
  const sections = document.querySelectorAll('section[id]');

  // All elements that should animate in on scroll
  const revealElements = document.querySelectorAll('.reveal');


  /* ── 1. NAVBAR SCROLL SHADOW ─────────────────────────────── */
  function handleNavbarScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }


  /* ── 2. BACK-TO-TOP VISIBILITY ───────────────────────────── */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 3. ACTIVE NAV LINK (Intersection Observer) ──────────── */
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          setActiveLink(id);
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((sec) => navObserver.observe(sec));

  function setActiveLink(sectionId) {
    desktopLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === sectionId);
    });
    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === sectionId);
    });
  }


  /* ── 4. SCROLL REVEAL (Intersection Observer) ────────────── */
  revealElements.forEach((el) => el.classList.add('visible'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ── 5. HAMBURGER / MOBILE MENU ──────────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });


  /* ── 6. SMOOTH SCROLL for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH   = navbar.offsetHeight;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 7. COMBINED SCROLL HANDLER ──────────────────────────── */
  function onScroll() {
    handleNavbarScroll();
    handleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── 8. PROJECT CARD HOVER EFFECT ────────────────────────── */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width  / 2;
        const cy     = rect.height / 2;
        const rotX   = ((y - cy) / cy) * -2;
        const rotY   = ((x - cx) / cx) *  2;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ── 9. TYPED CURSOR EFFECT ──────────────────────────────── */
  const subtitle = document.getElementById('hero-subtitle');
  if (subtitle && !subtitle.querySelector('span')) {
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = `
      display: inline-block;
      margin-left: 3px;
      color: var(--accent);
      font-weight: 300;
      animation: blink 1s step-end infinite;
    `;
    subtitle.appendChild(cursor);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


  /* ── 10. STAGGER REVEAL for skill tags ───────────────────── */
  const skillTagObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.skill-tag');
          tags.forEach((tag, i) => {
            tag.style.opacity    = '0';
            tag.style.transform  = 'translateY(12px)';
            tag.style.transition = `opacity 0.35s ease ${i * 55}ms, transform 0.35s ease ${i * 55}ms`;

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                tag.style.opacity   = '1';
                tag.style.transform = 'translateY(0)';
              });
            });
          });
          skillTagObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsGrid = document.getElementById('skills-grid');
  if (skillsGrid) skillTagObserver.observe(skillsGrid);


  /* ── 11. TOAST NOTIFICATION ──────────────────────────────── */
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #111;
      border: 1px solid var(--accent);
      color: var(--text-primary);
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-12px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }


  /* ── 12. CERTIFICATES RENDERER ────────────────────────────── */
  function renderCertificates(certs) {
    const container = document.getElementById('certificates-grid');
    if (!container) return;

    if (!certs || certs.length === 0) {
      container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">No certificates added yet. Use Admin Panel (Ctrl+Shift+A) to add.</p>`;
      return;
    }

    container.innerHTML = certs.map((c) => {
      const tags = (c.tags || []).map((t) => `<span class="cert-tag">${t}</span>`).join('');
      return `
        <div class="cert-card" id="${c.id || ''}">
          <div class="cert-top">
            <span class="cert-date">${c.date || 'Certified'}</span>
            <span style="font-size:0.75rem;color:var(--text-muted);">${c.issuer || ''}</span>
          </div>
          <h3 class="cert-title">${c.title || 'Certificate Title'}</h3>
          <p class="cert-issuer">${c.issuer || 'Issuing Body'}</p>
          ${c.credentialId ? `<div class="cert-id">Credential ID: ${c.credentialId}</div>` : ''}
          <div class="cert-tags">${tags}</div>
          <div class="cert-action">
            <a href="${c.link || 'https://github.com/SNK9728'}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost" style="width:100%;justify-content:center;">
              Verify Credential ↗
            </a>
          </div>
        </div>
      `;
    }).join('');
  }


  /* ── 13. ADMIN PORTAL MANAGEMENT ─────────────────────────── */
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = '1234';
  let isAdminAuthenticated = false;

  const loginModal  = document.getElementById('admin-login-modal');
  const panelModal  = document.getElementById('admin-panel-modal');
  const loginForm   = document.getElementById('admin-login-form');
  const panelForm   = document.getElementById('admin-panel-form');
  const userInput   = document.getElementById('admin-username-input');
  const passInput   = document.getElementById('admin-password-input');
  const loginError  = document.getElementById('admin-login-error');

  const btnOpenAdmin = document.getElementById('btn-open-admin');
  const btnMobileAdmin = document.getElementById('m-admin');
  const btnCloseLogin = document.getElementById('close-login-modal');
  const btnCancelLogin = document.getElementById('btn-cancel-login');
  const btnClosePanel = document.getElementById('close-panel-modal');
  const btnResetData  = document.getElementById('btn-reset-data');
  const btnExportData = document.getElementById('btn-export-data');

  function openAdminPortal() {
    if (isAdminAuthenticated) {
      populateAdminFields();
      panelModal.classList.add('open');
      panelModal.setAttribute('aria-hidden', 'false');
    } else {
      if (loginError) loginError.classList.remove('show');
      if (userInput) userInput.value = '';
      if (passInput) passInput.value = '';
      loginModal.classList.add('open');
      loginModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => { if (userInput) userInput.focus(); }, 150);
    }
  }

  function closeAdminModals() {
    if (loginModal) loginModal.classList.remove('open');
    if (panelModal) panelModal.classList.remove('open');
    if (loginModal) loginModal.setAttribute('aria-hidden', 'true');
    if (panelModal) panelModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenAdmin) btnOpenAdmin.addEventListener('click', openAdminPortal);
  if (btnMobileAdmin) btnMobileAdmin.addEventListener('click', openAdminPortal);
  if (btnCloseLogin) btnCloseLogin.addEventListener('click', closeAdminModals);
  if (btnCancelLogin) btnCancelLogin.addEventListener('click', closeAdminModals);
  if (btnClosePanel) btnClosePanel.addEventListener('click', closeAdminModals);

  // Keyboard shortcut Ctrl + Shift + A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openAdminPortal();
    }
  });

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredUser = userInput ? userInput.value.trim() : '';
      const enteredPass = passInput ? passInput.value : '';

      if (enteredUser === ADMIN_USER && enteredPass === ADMIN_PASS) {
        isAdminAuthenticated = true;
        loginModal.classList.remove('open');
        showToast('🔓 Admin Authenticated Successfully!');
        populateAdminFields();
        panelModal.classList.add('open');
      } else {
        if (loginError) loginError.classList.add('show');
        if (passInput) passInput.focus();
      }
    });
  }

  // Admin Tab Switching
  const adminTabs = document.querySelectorAll('.admin-tab');
  adminTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      adminTabs.forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Populate form fields from Backend API / localStorage
  async function populateAdminFields() {
    let data = getStoredPortfolioData();

    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const fullDb = await res.json();
        data = { ...data, ...fullDb.portfolio, certificates: fullDb.certificates, projects: fullDb.projects };
      }
    } catch (e) {
      console.log('Serving from local storage fallback');
    }

    // Hero & Bio
    if (document.getElementById('edit-badge')) document.getElementById('edit-badge').value = data.heroBadge || '● Engineering Student & Tech Enthusiast';
    if (document.getElementById('edit-title')) document.getElementById('edit-title').value = data.heroTitle || "Hi, I am Navin Kumar S";
    if (document.getElementById('edit-subtitle')) document.getElementById('edit-subtitle').value = data.heroSubtitle || 'ECE Student | Electronics & Technology Enthusiast';
    if (document.getElementById('edit-hero-intro')) document.getElementById('edit-hero-intro').value = data.heroIntro || 'I am an Electronics and Communication Engineering student...';
    if (document.getElementById('edit-tech-tags')) document.getElementById('edit-tech-tags').value = data.techTags || 'Web Development, Embedded Systems, Electronics, IoT, Chip Design';
    if (document.getElementById('edit-about-p1')) document.getElementById('edit-about-p1').value = data.aboutP1 || 'I am an Electronics and Communication Engineering student...';
    if (document.getElementById('edit-about-p2')) document.getElementById('edit-about-p2').value = data.aboutP2 || 'My goal is to continuously improve my technical skills...';

    // Contact
    if (document.getElementById('edit-email')) document.getElementById('edit-email').value = data.email || 'navinkumarsingaravelan@gmail.com';
    if (document.getElementById('edit-phone')) document.getElementById('edit-phone').value = data.phone || '+91 91501 66423';
    if (document.getElementById('edit-whatsapp')) document.getElementById('edit-whatsapp').value = data.whatsapp || '919150166423';
    if (document.getElementById('edit-github')) document.getElementById('edit-github').value = data.github || 'https://github.com/SNK9728';
    if (document.getElementById('edit-linkedin')) document.getElementById('edit-linkedin').value = data.linkedin || 'https://www.linkedin.com/in/navin-kumar-singaravelan-812a70387...';

    // Education
    if (document.getElementById('edit-degree')) document.getElementById('edit-degree').value = data.degree || 'B.E. Electronics and Communication Engineering';
    if (document.getElementById('edit-edu-status')) document.getElementById('edit-edu-status').value = data.eduStatus || 'Engineering Student';
    if (document.getElementById('edit-institution')) document.getElementById('edit-institution').value = data.institution || '';
    if (document.getElementById('edit-cgpa')) document.getElementById('edit-cgpa').value = data.cgpa || '';
    if (document.getElementById('edit-year')) document.getElementById('edit-year').value = data.year || '';

    // Skills
    if (document.getElementById('edit-skills-lang')) document.getElementById('edit-skills-lang').value = data.skillsLang || 'HTML, CSS, JavaScript, C, C++';
    if (document.getElementById('edit-skills-hw')) document.getElementById('edit-skills-hw').value = data.skillsHW || 'Arduino, ESP32, Embedded Systems, IoT, Electronics';
    if (document.getElementById('edit-skills-tools')) document.getElementById('edit-skills-tools').value = data.skillsTools || 'Git, GitHub';

    // Projects
    const projs = data.projects || [];
    for (let i = 1; i <= 5; i++) {
      const p = projs[i - 1] || data[`project${i}`] || {};
      const t = document.getElementById(`edit-p${i}-title`);
      const d = document.getElementById(`edit-p${i}-desc`);
      const tg = document.getElementById(`edit-p${i}-tags`);
      if (t) t.value = p.title || '';
      if (d) d.value = p.shortDesc || p.desc || '';
      if (tg) tg.value = Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.tags || '');
    }

    // Certificates
    const certs = data.certificates || [];
    for (let i = 1; i <= 4; i++) {
      const c = certs[i - 1] || {};
      const t = document.getElementById(`edit-c${i}-title`);
      const iss = document.getElementById(`edit-c${i}-issuer`);
      const dt = document.getElementById(`edit-c${i}-date`);
      const cid = document.getElementById(`edit-c${i}-id`);
      const tg = document.getElementById(`edit-c${i}-tags`);
      if (t) t.value = c.title || '';
      if (iss) iss.value = c.issuer || '';
      if (dt) dt.value = c.date || '';
      if (cid) cid.value = c.credentialId || '';
      if (tg) tg.value = Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || '');
    }
  }

  // Get stored portfolio data
  function getStoredPortfolioData() {
    try {
      return JSON.parse(localStorage.getItem('navin_portfolio_data')) || {};
    } catch (e) {
      return {};
    }
  }

  // Apply data to DOM
  function applyPortfolioData(data) {
    if (!data || Object.keys(data).length === 0) return;

    // Hero & Bio
    const badgeEl = document.getElementById('hero-badge');
    if (badgeEl && data.heroBadge) {
      badgeEl.innerHTML = `<span class="badge-dot" aria-hidden="true">●</span> ${data.heroBadge.replace('●', '').trim()}`;
    }

    const titleEl = document.getElementById('hero-title');
    if (titleEl && data.heroTitle) {
      const parts = data.heroTitle.split(' ');
      const last = parts.pop();
      titleEl.innerHTML = `${parts.join(' ')} <span class="accent">${last}</span>`;
    }

    const subEl = document.getElementById('hero-subtitle');
    if (subEl && data.heroSubtitle) {
      subEl.innerHTML = `${data.heroSubtitle}<span style="display:inline-block;margin-left:3px;color:var(--accent);font-weight:300;animation:blink 1s step-end infinite;">|</span>`;
    }

    const introEl = document.getElementById('hero-intro');
    if (introEl && data.heroIntro) introEl.textContent = data.heroIntro;

    const techTagsContainer = document.getElementById('tech-tags');
    if (techTagsContainer && data.techTags) {
      const tags = data.techTags.split(',').map((t) => t.trim()).filter(Boolean);
      techTagsContainer.innerHTML = tags.map((t) => `<span class="tech-tag">${t}</span>`).join('');
    }

    // About
    const aboutContainer = document.querySelector('.about-content');
    if (aboutContainer && (data.aboutP1 || data.aboutP2)) {
      let html = '';
      if (data.aboutP1) html += `<p class="about-text">${data.aboutP1}</p>`;
      if (data.aboutP2) html += `<p class="about-text">${data.aboutP2}</p>`;
      aboutContainer.innerHTML = html;
    }

    // Contact
    if (data.email) {
      const emailCard = document.getElementById('contact-email');
      if (emailCard) {
        emailCard.href = `mailto:${data.email}`;
        emailCard.querySelector('.contact-value').textContent = data.email;
      }
    }
    if (data.phone) {
      const phoneCard = document.getElementById('contact-phone');
      if (phoneCard) {
        const cleanPhone = data.phone.replace(/[^0-9+]/g, '');
        phoneCard.href = `tel:${cleanPhone}`;
        phoneCard.querySelector('.contact-value').textContent = data.phone;
      }
    }
    if (data.whatsapp) {
      const waCard = document.getElementById('contact-whatsapp');
      if (waCard) {
        const cleanWA = data.whatsapp.replace(/[^0-9]/g, '');
        waCard.href = `https://wa.me/${cleanWA}`;
        waCard.querySelector('.contact-value').textContent = data.phone || `+${cleanWA}`;
      }
    }
    if (data.github) {
      const ghCard = document.getElementById('contact-github');
      if (ghCard) {
        ghCard.href = data.github;
        ghCard.querySelector('.contact-value').textContent = data.github.replace('https://', '');
      }
      const ghFooter = document.getElementById('footer-github');
      if (ghFooter) ghFooter.href = data.github;
    }
    if (data.linkedin) {
      const liCard = document.getElementById('contact-linkedin');
      if (liCard) {
        liCard.href = data.linkedin;
        liCard.querySelector('.contact-value').textContent = 'linkedin.com/in/navin-kumar-singaravelan';
      }
      const liFooter = document.getElementById('footer-linkedin');
      if (liFooter) liFooter.href = data.linkedin;
    }

    // Education
    if (data.degree) {
      const degreeEl = document.querySelector('.edu-degree');
      if (degreeEl) degreeEl.textContent = data.degree;
    }
    if (data.eduStatus) {
      const statusEl = document.getElementById('edu-status');
      if (statusEl) statusEl.textContent = data.eduStatus;
    }
    if (data.institution) {
      const instVal = document.querySelector('#edu-institution .edu-meta-value');
      if (instVal) {
        instVal.textContent = data.institution;
        instVal.classList.remove('placeholder-value');
      }
    }
    if (data.cgpa) {
      const cgpaVal = document.querySelector('#edu-cgpa .edu-meta-value');
      if (cgpaVal) {
        cgpaVal.textContent = data.cgpa;
        cgpaVal.classList.remove('placeholder-value');
      }
    }
    if (data.year) {
      const yearVal = document.querySelector('#edu-year .edu-meta-value');
      if (yearVal) {
        yearVal.textContent = data.year;
        yearVal.classList.remove('placeholder-value');
      }
    }

    // Certificates Rendering
    if (data.certificates) {
      renderCertificates(data.certificates);
    }
  }

  // Load Initial Data from REST API
  async function loadInitialData() {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const fullDb = await res.json();
        applyPortfolioData({ ...fullDb.portfolio, certificates: fullDb.certificates, projects: fullDb.projects });
        return;
      }
    } catch (e) {
      console.log('Rest API not active, loading local cache');
    }
    applyPortfolioData(getStoredPortfolioData());
  }

  loadInitialData();

  // Save Form Handler
  if (panelForm) {
    panelForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newPortfolioData = {
        heroBadge:     document.getElementById('edit-badge')?.value || '',
        heroTitle:     document.getElementById('edit-title')?.value || '',
        heroSubtitle:  document.getElementById('edit-subtitle')?.value || '',
        heroIntro:     document.getElementById('edit-hero-intro')?.value || '',
        techTags:      document.getElementById('edit-tech-tags')?.value || '',
        aboutP1:       document.getElementById('edit-about-p1')?.value || '',
        aboutP2:       document.getElementById('edit-about-p2')?.value || '',
        email:         document.getElementById('edit-email')?.value || '',
        phone:         document.getElementById('edit-phone')?.value || '',
        whatsapp:      document.getElementById('edit-whatsapp')?.value || '',
        github:        document.getElementById('edit-github')?.value || '',
        linkedin:      document.getElementById('edit-linkedin')?.value || '',
        degree:        document.getElementById('edit-degree')?.value || '',
        eduStatus:     document.getElementById('edit-edu-status')?.value || '',
        institution:   document.getElementById('edit-institution')?.value || '',
        cgpa:          document.getElementById('edit-cgpa')?.value || '',
        year:          document.getElementById('edit-year')?.value || '',
        skillsLang:    document.getElementById('edit-skills-lang')?.value || '',
        skillsHW:      document.getElementById('edit-skills-hw')?.value || '',
        skillsTools:   document.getElementById('edit-skills-tools')?.value || '',
      };

      const newCertificates = [];
      for (let i = 1; i <= 4; i++) {
        const title = document.getElementById(`edit-c${i}-title`)?.value;
        if (title) {
          newCertificates.push({
            id: `cert-${i}`,
            title: title,
            issuer: document.getElementById(`edit-c${i}-issuer`)?.value || '',
            date: document.getElementById(`edit-c${i}-date`)?.value || '2024',
            credentialId: document.getElementById(`edit-c${i}-id`)?.value || '',
            tags: (document.getElementById(`edit-c${i}-tags`)?.value || '').split(',').map(t => t.trim()).filter(Boolean),
            link: 'https://github.com/SNK9728'
          });
        }
      }

      // Try PUT request to Backend Server API
      try {
        await fetch('/api/portfolio', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPortfolioData)
        });
        if (newCertificates.length > 0) {
          await fetch('/api/certificates', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCertificates)
          });
        }
      } catch (err) {
        console.log('Backend API sync offline, saving locally');
      }

      const fullSave = { ...newPortfolioData, certificates: newCertificates };
      localStorage.setItem('navin_portfolio_data', JSON.stringify(fullSave));
      applyPortfolioData(fullSave);
      closeAdminModals();
      showToast('⚡ Live Portfolio Content & Certificates Updated!');
    });
  }

  // Reset Handler
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('Reset all portfolio content to default settings?')) {
        localStorage.removeItem('navin_portfolio_data');
        location.reload();
      }
    });
  }

  // Export JSON Handler
  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      const data = getStoredPortfolioData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'navin_portfolio_config.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Portfolio Config Exported as JSON!');
    });
  }

  // Check URL route for /admin or #admin on page load & hash change
  function checkAdminRoute() {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.endsWith('/admin') || path.endsWith('/admin/') || hash === '#admin') {
      openAdminPortal();
    }
  }

  checkAdminRoute();
  window.addEventListener('hashchange', checkAdminRoute);


  /* ── 14. BACKEND API PROJECT DETAIL MODAL ─────────────────── */
  const pModal       = document.getElementById('project-detail-modal');
  const pCloseBtn    = document.getElementById('close-project-modal');
  const pCloseBtn2   = document.getElementById('pmodal-close-btn');

  function closeProjectModal() {
    if (pModal) {
      pModal.classList.remove('open');
      pModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (pCloseBtn) pCloseBtn.addEventListener('click', closeProjectModal);
  if (pCloseBtn2) pCloseBtn2.addEventListener('click', closeProjectModal);

  // Attach click listener to "View Project ->" buttons
  const p1View = document.getElementById('p1-view');
  if (p1View) {
    p1View.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'project-traffic-light.html';
    });
  }

  for (let i = 2; i <= 5; i++) {
    const viewBtn = document.getElementById(`p${i}-view`);
    if (viewBtn) {
      viewBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          showToast(`⚡ Fetching Project ${i} details from Backend REST API...`);
          const res = await fetch(`/api/projects/${i}`);
          if (!res.ok) throw new Error('API request failed');
          const proj = await res.json();

          document.getElementById('pmodal-title').textContent = proj.title;
          document.getElementById('pmodal-category').textContent = proj.category || 'Engineering Project';
          document.getElementById('pmodal-desc').textContent = proj.fullDesc || proj.shortDesc;
          document.getElementById('pmodal-arch').textContent = proj.architecture || 'Sensor -> Microcontroller -> Output';
          
          const featuresList = document.getElementById('pmodal-features');
          if (featuresList && proj.features) {
            featuresList.innerHTML = proj.features.map(f => `<li>${f}</li>`).join('');
          }

          const codeEl = document.getElementById('pmodal-code');
          if (codeEl) codeEl.textContent = proj.codeSnippet || '// Code implementation available upon request';

          const tagsEl = document.getElementById('pmodal-tags');
          if (tagsEl && proj.technologies) {
            tagsEl.innerHTML = proj.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
          }

          const ghLink = document.getElementById('pmodal-github');
          if (ghLink) ghLink.href = proj.github || 'https://github.com/SNK9728';

          pModal.classList.add('open');
          pModal.setAttribute('aria-hidden', 'false');
        } catch (err) {
          console.error('Error fetching project details:', err);
          pModal.classList.add('open');
        }
      });
    }
  }

  /* ── 16. COPY CODE BUTTON HANDLER ────────────────────────── */
  const copyBtn = document.getElementById('btn-copy-code');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeTargetId = copyBtn.getAttribute('data-code-target') || 'arduino-code-block';
      const codeEl = document.getElementById(codeTargetId);
      if (!codeEl) return;

      const codeText = codeEl.textContent || codeEl.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.classList.add('copied');
        const btnText = document.getElementById('copy-btn-text');
        if (btnText) btnText.textContent = 'Copied!';

        if (typeof showToast === 'function') {
          showToast('✓ Arduino code copied to clipboard!');
        }

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (btnText) btnText.textContent = 'Copy Code';
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    });
  }

  /* ── 17. LIGHTBOX GALLERY MODAL HANDLER ─────────────────── */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightboxModal && lightboxImg) {
    const triggers = document.querySelectorAll('.gallery-lightbox-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const fullSrc = trigger.getAttribute('data-fullsrc') || trigger.getAttribute('src');
        const caption = trigger.getAttribute('data-caption') || trigger.getAttribute('alt') || '';
        
        lightboxImg.src = fullSrc;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('open');
      lightboxModal.setAttribute('aria-hidden', 'true');
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('open')) closeLightbox();
    });
  }


  /* ── 18. PERSONAL DETAILS PHOTO CLICK MODAL HANDLER ──────── */
  const profileModal = document.getElementById('profile-details-modal');
  const profileCloseBtn = document.getElementById('profile-modal-close');
  const profileCloseBtnFooter = document.getElementById('profile-modal-close-btn');
  const profileAvatars = document.querySelectorAll('.hero-profile-avatar, .nav-logo-avatar');

  if (profileModal) {
    const openProfileModal = (e) => {
      e.preventDefault();
      profileModal.classList.add('open');
      profileModal.setAttribute('aria-hidden', 'false');
    };

    const closeProfileModal = () => {
      profileModal.classList.remove('open');
      profileModal.setAttribute('aria-hidden', 'true');
    };

    profileAvatars.forEach(avatar => {
      avatar.addEventListener('click', openProfileModal);
    });

    if (profileCloseBtn) profileCloseBtn.addEventListener('click', closeProfileModal);
    if (profileCloseBtnFooter) profileCloseBtnFooter.addEventListener('click', closeProfileModal);

    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) closeProfileModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileModal.classList.contains('open')) {
        closeProfileModal();
      }
    });
  }


  /* ── 19. CERTIFICATE DETAILS MODAL HANDLER ─────────────── */
  const certModal = document.getElementById('cert-details-modal');
  const certCloseBtn = document.getElementById('cert-modal-close');
  const certCloseBtnFooter = document.getElementById('cert-modal-close-btn');
  const certTriggers = document.querySelectorAll('.cert-card-clickable, .cert-btn');

  if (certModal) {
    const openCertModal = (e) => {
      e.preventDefault();
      certModal.classList.add('open');
      certModal.setAttribute('aria-hidden', 'false');
    };

    const closeCertModal = () => {
      certModal.classList.remove('open');
      certModal.setAttribute('aria-hidden', 'true');
    };

    certTriggers.forEach(trigger => {
      trigger.addEventListener('click', openCertModal);
    });

    if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
    if (certCloseBtnFooter) certCloseBtnFooter.addEventListener('click', closeCertModal);

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('open')) {
        closeCertModal();
      }
    });
  /* ── 20. AMBIENT SPACE CANVAS BACKGROUND ENGINE ─── */
  function initUltraRealisticReactorEngine() {
    const canvas = document.getElementById('reactor-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Parallax Lerp State
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    // Reduced Motion Detection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Window Listeners
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    // Particle Palette
    const palette = ['#ffffff', '#00f0ff', '#00b4d8', '#7209b7', '#4895ef'];

    // Particle System
    const particleCount = width < 768 ? 60 : 120;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }

    // Main Render Loop
    function render() {
      ctx.clearRect(0, 0, width, height);

      // Smooth Mouse Lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Render Ambient Particles & Connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = 'rgba(0, 240, 255, ' + (0.25 * (1 - dist / 90)) + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(render);
    }

    render();
  }

  initUltraRealisticReactorEngine();

}); // end DOMContentLoaded
