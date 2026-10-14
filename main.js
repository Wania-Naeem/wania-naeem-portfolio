/**
 * WANIA NAEEM — UI/UX DESIGNER & SOFTWARE ENGINEERING STUDENT
 * Monochrome Architectural Portfolio — Core Motion & Interaction Engine
 * GSAP 3 + ScrollTrigger Choreography with Native Accessibility & Offline Fallbacks
 */

(function () {
  'use strict';

  // System Accessibility Preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { site: SITE, projects: PROJECTS, journey: JOURNEY } = window.PORTFOLIO;
  const hasGsap = () => typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion;
  const $ = (s, r = document) => r.querySelector(s);
  const E = (s) => escapeHtml(s);

  /* Screen image with graceful placeholder when file is not added yet */
  function shot(p, img, cls = '') {
    const src = `assets/projects/${p.folder}/${img.src}`;
    return `<figure class="shot ${cls}" tabindex="0" aria-label="View ${E(img.label)} larger"><img src="${src}" alt="${E(p.title)} — ${E(img.label)}" loading="lazy" onerror="this.parentNode.classList.add('is-missing');this.remove()"><div class="shot-ph"><span>${E(img.label)}</span><small>add ${E(img.src)}</small></div><figcaption>${E(img.label)}</figcaption></figure>`;
  }

  /* ==========================================================================
     02. Initialization & Loader Experience (~1s Clean Reveal)
     ========================================================================== */
  function initLoader() {
    const loader = document.getElementById('siteLoader');
    if (!loader) return;

    // Minimum display duration ~850ms so animations are perceived
    const timer = setTimeout(() => {
      loader.classList.add('is-loaded');
      document.body.classList.remove('is-loading');

      // Trigger hero entrance after loader fades
      setTimeout(() => {
        initHeroMotion();
      }, 250);
    }, 900);

    window.addEventListener('load', () => {
      // Ensure loader hides even on fast networks
      clearTimeout(timer);
      setTimeout(() => {
        loader.classList.add('is-loaded');
        document.body.classList.remove('is-loading');
        setTimeout(initHeroMotion, 250);
      }, 650);
    }, { once: true });
  }

  /* ==========================================================================
     03. Custom Desktop Interactive Cursor Follower
     ========================================================================== */
  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const follower = document.getElementById('cursorFollower');
    const followerText = document.getElementById('cursorFollowerText');

    if (!dot || !follower || prefersReducedMotion) return;

    // Only enable on fine pointer devices (desktops/laptops with mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth lerp follower loop
    function renderCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        follower.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        follower.classList.remove('is-hovering');
      });
    });

    // Project Cards Hover Reveal
    const projectCards = document.querySelectorAll('.project-media-wrap');
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        follower.classList.add('is-project-hover');
        if (followerText) followerText.textContent = 'EXPLORE';
      });
      card.addEventListener('mouseleave', () => {
        follower.classList.remove('is-project-hover');
      });
    });
  }

  /* ==========================================================================
     04. Header Navigation & Sticky Scrolled State
     ========================================================================== */
  function initNavigation() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Smooth navigation links scroll
    const navLinks = document.querySelectorAll('.nav-link, .site-logo, a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerHeight = header.offsetHeight || 70;
            const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: topPos,
              behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
          }
        }
      });
    });
  }

  /* Mobile hamburger menu */
  function initMobileMenu() {
    const header = document.getElementById('siteHeader');
    const btn = document.getElementById('navToggle');
    if (!header || !btn) return;
    const set = (open) => {
      header.classList.toggle('is-menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', () => set(!header.classList.contains('is-menu-open')));
    header.querySelectorAll('.nav-link').forEach((a) => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) set(false); });
  }

  /* ==========================================================================
     05. Hero Section Pinned Motion & Kinetic Words (GSAP 3 + Fallback)
     ========================================================================== */
  let heroMotionStarted = false;
  function initHeroMotion() {
    if (heroMotionStarted) return;          // the loader timer AND the window 'load' event both call this — only run once
    heroMotionStarted = true;
    const heroStage = document.getElementById('home');
    const identityCard = document.getElementById('identityCard');
    if (!heroStage || !identityCard) return;

    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger);

      // Kinetic words entrance animation
      const words = document.querySelectorAll('.kinetic-word');
      gsap.fromTo(words, 
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: (i, target) => {
            if (target.classList.contains('word-creator') || target.classList.contains('word-solver')) return 0.35;
            return 1;
          },
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );

      // Hero Scroll scrubbing
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroStage,
          // The hero is always the very first thing on the page, so use FIXED numbers instead of measuring it.
          // (Measuring while the browser was restoring an old scroll position gave start = -3000 and left the hero faded forever.)
          start: 0,
          end: () => Math.max(1, heroStage.offsetHeight),
          invalidateOnRefresh: true,
          scrub: 0.8
        }
      });

      // fromTo with FIXED start values (immediateRender:false): scrolling back to the top always restores the hero exactly,
      // no matter when the scroll animation first measured the elements (this was leaving the words invisible).
      const fx = { ease: 'none', immediateRender: false };
      heroTl
        .fromTo('.word-designer', { x: 0, opacity: 1 }, { x: -160, opacity: 0.1, ...fx }, 0)
        .fromTo('.word-uiux', { x: 0, opacity: 1 }, { x: 180, opacity: 0.1, ...fx }, 0)
        .fromTo('.word-creator', { y: 0, opacity: 0.35 }, { y: -80, opacity: 0, ...fx }, 0)
        .fromTo('.word-thinker', { y: 0, opacity: 1 }, { y: -120, opacity: 0, ...fx }, 0)
        .fromTo('.word-solver', { x: 0, opacity: 0.35 }, { x: -80, opacity: 0, ...fx }, 0)
        .fromTo(['#identityCard', '#heroRevealCanvas'], { scale: 1, y: 0, opacity: 1 }, { scale: 0.9, y: 50, opacity: 0.1, ...fx }, 0);

      // About Section Scroll Trigger Reveal
      gsap.from('#aboutImageFrame', {
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.from('.about-oversized-title', {
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%'
        },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out'
      });

      gsap.from('.about-pillar-card', {
        scrollTrigger: {
          trigger: '.about-pillars-grid',
          start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out'
      });

      // Work: clip-path image reveal, parallax, text rise
      document.querySelectorAll('.project-scene').forEach((scene) => {
        const media = scene.querySelector('.project-media-wrap'), img = scene.querySelector('.shot');
        gsap.fromTo(media, { clipPath: 'inset(12% 8% 12% 8%)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: scene, start: 'top 80%' } });
        gsap.fromTo(scene.querySelectorAll('.shot img, .shot-ph'), { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.0, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from(scene.querySelector('.project-info-wrap').children, { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: scene, start: 'top 70%' } });
      });
      // Journey: each milestone slides in
      document.querySelectorAll('.timeline-node-item').forEach((n) => {
        gsap.from(n.querySelector('.timeline-institution-title'), { yPercent: 100, opacity: 0, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: n, start: 'top 80%' } });
        gsap.from(n.querySelectorAll('.timeline-left-meta, .timeline-field-subtitle, .timeline-takeaways-tags'), { x: -30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 80%' } });
      });
      // Contact: headline reveal
      gsap.from('.contact-headline-statement', { clipPath: 'inset(0 0 100% 0)', y: 60, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 70%' } });
      gsap.from('.contact-form-box', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 60%' } });

    } else {
      // Fallback for offline or reduced motion: ensure all elements are visible
      document.querySelectorAll('.kinetic-word').forEach(w => w.style.opacity = '1');
    }
  }

  /* ==========================================================================
     06. Academic Journey Timeline (Progressive Vertical Fill)
     ========================================================================== */
  function initJourneyTimeline() {
    const timelineWrap = document.querySelector('.timeline-vertical-wrap');
    const fillBar = document.getElementById('timelineProgressFill');
    const nodes = document.querySelectorAll('.timeline-node-item');

    if (!timelineWrap || !fillBar) return;

    function updateTimeline() {
      const rect = timelineWrap.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress percentage through timeline
      const startTrigger = windowHeight * 0.75;
      const endTrigger = windowHeight * 0.25;

      const totalScrollable = rect.height;
      const currentScroll = startTrigger - rect.top;

      let progress = (currentScroll / totalScrollable) * 100;
      progress = Math.max(0, Math.min(100, progress));

      fillBar.style.height = `${progress.toFixed(1)}%`;

      // Highlight active milestone dots as line passes them
      nodes.forEach((node) => {
        const nodeRect = node.getBoundingClientRect();
        const dot = node.querySelector('.timeline-dot-anchor');
        if (dot) {
          if (nodeRect.top < startTrigger) {
            dot.style.backgroundColor = 'var(--color-accent)';
            dot.style.transform = 'translate(-50%, 0) scale(1.2)';
          } else {
            dot.style.backgroundColor = 'var(--color-white)';
            dot.style.transform = 'translate(-50%, 0) scale(1)';
          }
        }
      });
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  /* ==========================================================================
     Render: Work list + Journey + Contact info (all from data.js)
     ========================================================================== */
  function renderWork() {
    const list = $('#workList'); if (!list) return;
    list.innerHTML = PROJECTS.map((p, i) => {
      const wip = p.layout === 'wip';
      return `<article class="project-scene${i % 2 ? ' project-scene--reverse' : ''}">
        <div class="project-media-wrap" data-open-modal="${p.id}" role="button" tabindex="0" aria-label="Open ${E(p.title)}">
          <span class="project-scene-badge">${E(p.category).toUpperCase()}</span>
          <div class="cover-strip">${p.images.slice(0, 3).map(im => shot(p, im).replace(/ tabindex="0" aria-label="[^"]*"/, '')).join('')}</div>
        </div>
        <div class="project-info-wrap">
          <div class="project-number-index">PROJECT 0${i + 1}</div>
          <h3 class="project-title">${E(p.title)}</h3>
          <span class="project-status${wip ? ' is-wip' : ''}">${wip ? '<i></i>' : ''}${E(p.status)}</span>
          <p class="project-summary">${E(p.description)}</p>
          <div class="project-meta-pills">${p.tools.map(t => `<span class="tag-pill">${E(t)}</span>`).join('')}</div>
          <div><button class="project-explore-btn" data-open-modal="${p.id}"><span>${p.layout === 'case' ? 'View Case Study' : p.layout === 'gallery' ? 'Explore Gallery' : 'View Project'}</span> <span aria-hidden="true">→</span></button></div>
        </div></article>`;
    }).join('');
  }

  function renderJourney() {
    const el = $('#journeyList'); if (!el) return;
    el.innerHTML = JOURNEY.map(s => `
      <div class="timeline-node-item">
        <div class="timeline-left-meta"><div class="timeline-stage-tag">${E(s.tag)}</div><div class="timeline-period-label">${s.n}</div></div>
        <div class="timeline-dot-anchor" aria-hidden="true"></div>
        <div class="timeline-card-content"><h3 class="timeline-institution-title">${E(s.title)}</h3>
          <div class="timeline-field-subtitle">${E(s.sub)}</div>
          ${s.detail ? `<div class="timeline-takeaways-tags"><span class="tag-pill tag-pill--solid">${E(s.detail)}</span></div>` : ''}
        </div></div>`).join('');
  }

  function renderContactInfo() {
    if (SITE.email) { $('#copyBox').hidden = false; $('#emailText').textContent = SITE.email; $('#copyEmailBtn').dataset.email = SITE.email; }
    $('#socialRow').innerHTML = Object.entries(SITE.socials).filter(([, u]) => u)
      .map(([n, u]) => `<a href="${E(u)}" target="_blank" rel="noopener noreferrer" class="contact-social-link">${E(n)} ↗</a>`).join('');
    // CV download buttons (header, menu, contact) + social links in the menu — all driven by data.js
    document.querySelectorAll('[data-cv]').forEach((a) => { if (SITE.cv) a.setAttribute('href', SITE.cv); else a.hidden = true; });
    document.querySelectorAll('[data-social]').forEach((a) => {
      const url = SITE.socials && SITE.socials[a.dataset.social];
      if (url) a.setAttribute('href', url); else a.hidden = true;
    });
  }

  /* ==========================================================================
     Home extension: infinite UI screens loop (only shows images that exist)
     ========================================================================== */
  function initScreensLoop() {
    const wrap = $('#screensLoop'), track = $('#screensTrack'); if (!wrap || !track) return;
    const P = window.PORTFOLIO;
    const srcs = [...(P.marquee || []).map(f => `assets/marquee/${f}`),
      ...PROJECTS.flatMap(p => p.images.map(i => `assets/projects/${p.folder}/${i.src}`))];
    const test = (s) => new Promise(r => { const im = new Image(); im.onload = () => r({ s, ratio: (im.naturalWidth / im.naturalHeight) || 1 }); im.onerror = () => r(null); im.src = s; });
    Promise.all(srcs.map(test)).then(list => {
      const ok = list.filter(Boolean); if (!ok.length) return;
      const item = (o) => `<div class="screens-item" style="aspect-ratio:${o.ratio.toFixed(4)}"><img src="${E(o.s)}" alt="" loading="lazy" draggable="false"></div>`;
      const set = ok.map(item).join('');
      track.innerHTML = set; wrap.hidden = false;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      const setW = [...track.children].reduce((a, el) => a + el.offsetWidth + gap, 0);
      const reps = Math.max(1, Math.ceil((window.innerWidth * 1.2) / setW));
      const half = set.repeat(reps);
      track.innerHTML = half + half;               // two identical halves -> seamless -50% loop
      const dist = setW * reps;
      track.style.setProperty('--loop-duration', `${Math.max(20, dist / 70)}s`);
      if (hasGsap()) gsap.from(wrap, { opacity: 0, y: 60, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 90%' } });
    });
  }

  /* ==========================================================================
     Light / Dark theme toggle (saved in localStorage, defaults to system)
     ========================================================================== */
  function initTheme() {
    const btn = document.getElementById('themeToggle'); if (!btn) return;
    const root = document.documentElement;
    const sync = () => {
      const dark = root.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    sync();
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (!prefersReducedMotion) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 600); }
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      sync();
    });
  }

  /* ==========================================================================
     07. Project Detail Overlay (full-screen <dialog>, per-layout content)
     ========================================================================== */
  function projectBody(p) {
    const links = [p.figmaUrl && ['View in Figma', p.figmaUrl], p.prototypeUrl && ['Open Prototype', p.prototypeUrl]].filter(Boolean)
      .map(([t, u]) => `<a class="btn btn--primary" href="${E(u)}" target="_blank" rel="noopener noreferrer">${t} ↗</a>`).join('');
    const head = `<div class="modal-header-meta"><div class="modal-badge-row"><span class="tag-pill tag-pill--solid">${E(p.category)}</span><span class="tag-pill">${E(p.status)}</span>${p.tools.map(t => `<span class="tag-pill">${E(t)}</span>`).join('')}</div>
      <h2 class="modal-title" id="modalProjectTitle">${E(p.title)}</h2><p class="modal-subtitle">${E(p.description)}</p></div>`;
    const foot = `<div class="modal-footer-cta">${links || '<span class="modal-note">Figma link will be added soon.</span>'}<button class="btn btn--primary" id="modalDismissBtn">Close ✕</button></div>`;
    let body = '';
    if (p.layout === 'case') {
      const c = p.caseStudy;
      body = `<div class="modal-deepdive-card"><h3 class="modal-subheading">Overview</h3><p class="modal-paragraph">${E(c.overview)}</p></div>
        <div class="flow-steps">${c.journey.map((s, i) => `<span>${i + 1}. ${E(s)}</span>`).join('')}</div>
        <h3 class="modal-subheading">Key Screens</h3><div class="shots-grid shots-grid--4">${p.images.map(im => shot(p, im)).join('')}</div>
        <div class="modal-deepdive-grid"><div class="modal-deepdive-card"><h3 class="modal-subheading">Design Approach</h3><p class="modal-paragraph">${E(c.approach)}</p>
          <ul class="plain-list">${c.approachPoints.map(x => `<li>${E(x)}</li>`).join('')}</ul></div>
          <div class="modal-deepdive-card"><h3 class="modal-subheading">Design Process</h3><ol class="plain-list">${c.process.map(x => `<li>${E(x)}</li>`).join('')}</ol></div></div>
        <div class="modal-deepdive-card"><h3 class="modal-subheading">Takeaway</h3><p class="modal-paragraph">${E(c.takeaway)}</p></div>`;
    } else if (p.layout === 'wip') {
      body = `<div class="wip-banner"><i></i> CURRENTLY DESIGNING — WORK IN PROGRESS</div><div class="shots-grid">${p.images.map(im => shot(p, im)).join('')}</div>`;
    } else if (p.layout === 'flow') {
      body = `<div class="flow-steps">${p.images.map((im, i) => `<span>0${i + 1} — ${E(im.label)}</span>`).join('')}</div><div class="shots-grid shots-grid--3">${p.images.map(im => shot(p, im)).join('')}</div>`;
    } else {
      body = `<div class="project-meta-pills">${p.labels.map(l => `<span class="tag-pill">${E(l)}</span>`).join('')}</div><div class="shots-grid gallery-masonry">${p.images.map(im => shot(p, im)).join('')}</div>`;
    }
    return head + body + foot;
  }

  function initCaseStudyModal() {
    const modal = $('#caseStudyModal'), content = $('#modalInnerContent'), closeBtn = $('#modalCloseBtn');
    if (!modal || !content) return;
    let prev = null, current = null;

    /* ---------- Screen viewer (lightbox): click any screen to view it properly ---------- */
    const lb = document.createElement('dialog');
    lb.className = 'lightbox'; lb.setAttribute('aria-label', 'Screen viewer');
    lb.innerHTML = `<button type="button" class="lb-btn lb-close" aria-label="Close viewer">✕</button>
      <button type="button" class="lb-btn lb-nav lb-prev" aria-label="Previous screen">‹</button>
      <div class="lb-stage"><img class="lb-img" alt="" draggable="false"></div>
      <button type="button" class="lb-btn lb-nav lb-next" aria-label="Next screen">›</button>
      <div class="lb-bar"><span class="lb-caption"></span><span class="lb-count"></span><span class="lb-hint">Tap image to zoom · ← → to browse</span></div>`;
    document.body.appendChild(lb);
    const lbImg = $('.lb-img', lb), lbStage = $('.lb-stage', lb);
    let idx = 0, zoomed = false;

    function sizeImg() {
      const nw = lbImg.naturalWidth, nh = lbImg.naturalHeight; if (!nw) return;
      const sw = lbStage.clientWidth, sh = lbStage.clientHeight;
      const fit = Math.min(sw / nw, sh / nh, 3);              // fit whole screen (never blow up more than 3x)
      const zoom = Math.max(fit, Math.min(sw / nw, 2));       // fill the width (max 2x), scroll vertically
      const s = zoomed ? zoom : fit;
      lbImg.style.width = Math.round(nw * s) + 'px';
      lbImg.style.height = Math.round(nh * s) + 'px';
      lbStage.classList.toggle('is-zoomed', zoomed && nh * s > sh);
      lbImg.style.cursor = zoom - fit > 0.05 ? (zoomed ? 'zoom-out' : 'zoom-in') : 'default';
    }
    function show(i) {
      const list = current.images; idx = (i + list.length) % list.length; zoomed = false;
      const im = list[idx];
      lbImg.style.width = lbImg.style.height = '';
      lbImg.src = `assets/projects/${current.folder}/${im.src}`; lbImg.alt = `${current.title} — ${im.label}`;
      $('.lb-caption', lb).textContent = im.label; $('.lb-count', lb).textContent = `${idx + 1} / ${list.length}`;
      lbStage.scrollTop = 0;
      lb.classList.toggle('is-single', list.length < 2);
    }
    lbImg.addEventListener('load', sizeImg);
    window.addEventListener('resize', () => { if (lb.open) sizeImg(); });
    lbImg.addEventListener('click', () => { zoomed = !zoomed; sizeImg(); });
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    lbStage.addEventListener('click', e => { if (e.target === lbStage) lb.close(); });
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
    let sx = null;                                              // swipe left/right on phones
    lbStage.addEventListener('pointerdown', e => { sx = e.clientX; });
    lbStage.addEventListener('pointerup', e => { if (sx !== null && !lbStage.classList.contains('is-zoomed')) { const dx = e.clientX - sx; if (Math.abs(dx) > 60) show(idx + (dx < 0 ? 1 : -1)); } sx = null; });
    content.addEventListener('click', e => {
      const f = e.target.closest('.shot'); if (!f || f.classList.contains('is-missing') || !current) return;
      const i = [...content.querySelectorAll('.shot')].indexOf(f); if (i < 0) return;
      show(i); lb.showModal();
    });
    content.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('shot')) { e.preventDefault(); e.target.click(); } });

    function open(id) {
      const p = PROJECTS.find(x => x.id === id); if (!p) return;
      current = p;
      prev = document.activeElement;
      content.innerHTML = projectBody(p);
      $('#modalDismissBtn').addEventListener('click', close);
      modal.showModal ? modal.showModal() : modal.setAttribute('open', '');
      document.body.classList.add('modal-open');
      modal.scrollTop = 0;
      if (hasGsap()) {
        gsap.fromTo(modal, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut', clearProps: 'clipPath' });
        gsap.from(content.querySelectorAll('.modal-title, .modal-subtitle, .modal-badge-row, .shot, .flow-steps > span, .modal-deepdive-card'), { y: 50, opacity: 0, duration: 0.9, stagger: 0.07, delay: 0.45, ease: 'power3.out', clearProps: 'all' });
      }
      closeBtn && closeBtn.focus();
    }
    function close() {
      const done = () => { modal.close ? modal.close() : modal.removeAttribute('open'); document.body.classList.remove('modal-open'); if (typeof gsap !== 'undefined') gsap.set(modal, { clearProps: 'clipPath' }); prev && prev.focus && prev.focus(); };
      if (hasGsap()) gsap.to(modal, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: done }); else done();
    }

    document.querySelectorAll('[data-open-modal]').forEach(b => {
      b.addEventListener('click', e => { e.preventDefault(); open(b.dataset.openModal); });
      b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(b.dataset.openModal); } });
    });
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('cancel', e => { e.preventDefault(); close(); });
  }

  /* ==========================================================================
     08. Live Pakistan Timezone Clock (GMT+5, Karachi)
     ========================================================================== */
  /* ==========================================================================
     Hero Scratch Reveal: cursor-controlled grunge / dry-brush wipe.
     Top layer (Wania's video) is painted on a canvas; each brush stamp erases an irregular blob from it,
     revealing the design-world layer underneath. Stamps physically SHRINK over ~2.7 s (no opacity fade).
     Nothing is revealed until the visitor actually moves the cursor / finger over the hero.
     ========================================================================== */
  function initHeroScratch() {
    const stage = document.getElementById('home');
    const scene = document.getElementById('identityCard');
    const canvas = document.getElementById('heroScratch');
    const vid = document.getElementById('heroVideo');
    const revealBox = document.getElementById('heroReveal');
    const revealImg = document.getElementById('heroRevealImg');
    const rCanvas = document.getElementById('heroRevealCanvas');
    if (!stage || !scene || !canvas || !vid || !revealBox || !rCanvas) return;

    const ctx = canvas.getContext('2d');
    const rctx = rCanvas.getContext('2d');
    const mask = document.createElement('canvas');
    const mctx = mask.getContext('2d');
    const poster = new Image();
    const posterSrc = vid.getAttribute('poster');
    if (posterSrc) { poster.onload = () => { dirty = true; }; poster.src = posterSrc; }

    const TAU = Math.PI * 2, LIFE = 2.7, MS = 0.5, N = 48, HN = 10, MAX = 700;
    const bufB = new Float32Array(N * 2), bufH = new Float32Array(HN * 2);
    let W = 0, H = 0, dpr = 1, cw = 0, ch = 0, R = 100, S = 1;
    let frame = { x: 0, y: 0, w: 0, h: 0 };
    let dirty = true, active = true, revealVid = null;

    // pointer / follower state
    let inside = false, started = false, first = true;
    let tx = 0, ty = 0, sx = 0, sy = 0, lx = 0, ly = 0, ang = 0, vel = 0;
    const stamps = [];

    /* ---------- layout: both layers share one frame rectangle (full 16:9 picture, anchored to the bottom, below the header) ---------- */
    function resize() {
      W = stage.clientWidth; H = stage.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cw = Math.round(W * dpr); ch = Math.round(H * dpr);
      canvas.width = cw; canvas.height = ch; rCanvas.width = cw; rCanvas.height = ch;
      mask.width = Math.round(cw * MS); mask.height = Math.round(ch * MS);
      S = dpr * MS;
      R = 0.10 * Math.min(W, H);                                   // brush radius ~ 17% of the smaller side
      const ar = (vid.videoWidth && vid.videoHeight) ? vid.videoWidth / vid.videoHeight : 16 / 9;
      if (W < 768) {
        // PHONE: fit the video by WIDTH so nothing is cropped on the left/right.
        // MOBILE_ZOOM: 1 = whole video visible (no crop). Raise it (e.g. 1.25) for a bigger avatar, but the sides will crop again.
        const MOBILE_ZOOM = 1;
        const fw = W * MOBILE_ZOOM, fh = fw / ar;
        frame = { x: (W - fw) / 2, y: Math.max(110, (H - fh) / 2 + 24), w: fw, h: fh };
      } else {
        const top = Math.max(72, H * 0.09);                        // keep her head clear of the header
        const fh = H - top, fw = fh * ar;
        frame = { x: (W - fw) / 2, y: H - fh, w: fw, h: fh };
      }
      dirty = true;
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
    vid.addEventListener('loadedmetadata', resize);
    vid.addEventListener('loadeddata', () => { dirty = true; });

    /* ---------- optional: if assets/hero/reveal.mp4 / reveal.webm exists it replaces the still image automatically ---------- */
    (function loadRevealVideo() {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.className = 'hero-reveal-media'; v.setAttribute('aria-hidden', 'true');
      ['webm', 'mp4'].forEach((ext) => {
        const s = document.createElement('source'); s.src = 'assets/hero/reveal.' + ext; s.type = 'video/' + ext; v.appendChild(s);
      });
      v.addEventListener('loadeddata', () => {
        revealBox.appendChild(v); revealVid = v;
        if (!prefersReducedMotion) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      });
    })();

    /* ---------- procedural brush ---------- */
    const rnd = Math.random;
    function makeStamp(x, y, a, st, now) {
      const seed = rnd() * 1000, t = seed * 0.37, rad = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const an = (i / N) * TAU;
        let k = 1 + 0.085 * Math.sin(3 * an + t + seed) + 0.048 * Math.sin(5 * an - t * 1.15 + seed * 2.1)
                  + 0.022 * Math.sin(9 * an + t * 0.6 + seed * 3.7) + (rnd() - 0.5) * 0.07;   // large + medium + small + rough noise
        if (rnd() < 0.06) k *= 0.82 + rnd() * 0.1;                                            // torn notches
        else if (rnd() < 0.05) k *= 1.06 + rnd() * 0.06;                                      // random protrusions
        rad[i] = k;
      }
      const holes = [];
      if (false) {                                                                    // small elongated dry-brush gaps
        const n = 1 + (rnd() < 0.4 ? 1 : 0);
        for (let j = 0; j < n; j++) {
          const hr = new Float32Array(HN), js = rnd() * 6.28;
          for (let i = 0; i < HN; i++) hr[i] = 1 + 0.28 * Math.sin(3 * (i / HN) * TAU + js) + (rnd() - 0.5) * 0.25;
          holes.push({ ox: (rnd() - 0.5) * 1.1, oy: (rnd() - 0.5) * 0.9, len: 0.12 + rnd() * 0.22, wid: 0.022 + rnd() * 0.03, rot: (rnd() - 0.5) * 0.5, rad: hr });
        }
      }
      return { x, y, r: R * (0.9 + rnd() * 0.2), a, st, born: now, rad, holes };
    }

    // closed smooth shape through n points (Catmull-Rom -> cubic Bezier)
    function blob(c, n, buf, cx, cy, ax, ay, ang2, rad) {
      const ca = Math.cos(ang2), sa = Math.sin(ang2);
      for (let i = 0; i < n; i++) {
        const an = (i / n) * TAU, rv = rad[i];
        const lx2 = Math.cos(an) * ax * rv, ly2 = Math.sin(an) * ay * rv;
        buf[2 * i] = (cx + lx2 * ca - ly2 * sa) * S; buf[2 * i + 1] = (cy + lx2 * sa + ly2 * ca) * S;
      }
      c.moveTo(buf[0], buf[1]);
      for (let i = 0; i < n; i++) {
        const i0 = (i - 1 + n) % n, i2 = (i + 1) % n, i3 = (i + 2) % n;
        const x0 = buf[2 * i0], y0 = buf[2 * i0 + 1], x1 = buf[2 * i], y1 = buf[2 * i + 1];
        const x2 = buf[2 * i2], y2 = buf[2 * i2 + 1], x3 = buf[2 * i3], y3 = buf[2 * i3 + 1];
        c.bezierCurveTo(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2);
      }
      c.closePath();
    }

    /* ---------- pointer handling (reveal only after real movement; never on idle) ---------- */
    function local(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / (r.width || 1)), y: (e.clientY - r.top) * (H / (r.height || 1)) };
    }
    function enter(e) {
      const p = local(e); tx = sx = lx = p.x; ty = sy = ly = p.y;     // follower jumps to the cursor: no stroke from an old position
      inside = true; started = false; first = true; vel = 0;
    }
    stage.addEventListener('pointerenter', enter);
    stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') enter(e); });
    stage.addEventListener('pointermove', (e) => {
      if (!inside) enter(e);
      const p = local(e); tx = p.x; ty = p.y; started = true;
    });
    stage.addEventListener('pointerleave', () => { inside = false; });
    stage.addEventListener('pointercancel', () => { inside = false; });
    stage.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') inside = false; });

    /* ---------- per-frame update ---------- */
    function tick(dt, now) {
      if (!inside || !started) return;
      const k = 1 - Math.pow(1 - 0.17, dt * 60);
      const ox = sx, oy = sy;
      sx += (tx - sx) * k; sy += (ty - sy) * k;
      const mv = Math.hypot(sx - ox, sy - oy);
      vel += (mv / dt - vel) * 0.2;
      if (mv > 0.15) {
        const ta = Math.atan2(sy - oy, sx - ox);
        let d = ta - ang; d = Math.atan2(Math.sin(d), Math.cos(d)); ang += d * 0.3;
      }
      const st = Math.min(0.32, vel / (R * 14));                       // slight stretch along the direction of movement
      if (first) { stamps.push(makeStamp(sx, sy, ang, st, now)); lx = sx; ly = sy; first = false; return; }
      const spacing = R * 0.09;
      let dx = sx - lx, dy = sy - ly, dist = Math.hypot(dx, dy);
      if (dist >= spacing) {
        const ux = dx / dist, uy = dy / dist, n = Math.floor(dist / spacing);
        for (let i = 1; i <= n; i++) stamps.push(makeStamp(lx + ux * spacing * i, ly + uy * spacing * i, ang, st, now));
        lx += ux * spacing * n; ly += uy * spacing * n;
        if (stamps.length > MAX) stamps.splice(0, stamps.length - MAX);
      }
    }

    function coverFill(src, sw, sh) {
      ctx.drawImage(src, 0, 0, sw, sh, frame.x * dpr, frame.y * dpr, frame.w * dpr, frame.h * dpr);
    }

    function draw(now) {
      // ---- layer 1: Wania's video, never erased ----
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cw, ch);
      if (vid.readyState >= 2 && vid.videoWidth) coverFill(vid, vid.videoWidth, vid.videoHeight);
      else if (poster.complete && poster.naturalWidth) coverFill(poster, poster.naturalWidth, poster.naturalHeight);

      // ---- layer 2: the design world, shown only where the brush has been (drawn above the words) ----
      rctx.setTransform(1, 0, 0, 1, 0, 0);
      rctx.globalCompositeOperation = 'source-over';
      rctx.clearRect(0, 0, cw, ch);
      for (let i = stamps.length - 1; i >= 0; i--) if (now - stamps[i].born >= LIFE * 1000) stamps.splice(i, 1);
      if (!stamps.length) return;

      // mask built from the live stamps: radius shrinks with age (never opacity)
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.globalCompositeOperation = 'source-over';
      mctx.clearRect(0, 0, mask.width, mask.height);
      mctx.fillStyle = '#000';
      mctx.beginPath();
      for (let i = 0; i < stamps.length; i++) {
        const s = stamps[i], life = Math.max(0, 1 - (now - s.born) / (LIFE * 1000));
        const rr = s.r * Math.pow(life, 0.85);
        if (rr < 1) continue;
        blob(mctx, N, bufB, s.x, s.y, rr * (1 + s.st), rr / (1 + s.st * 0.5), s.a, s.rad);
      }
      mctx.fill();

      // paint the reveal picture, then keep only the part inside the mask
      const src = (revealVid && revealVid.readyState >= 2) ? revealVid : revealImg;
      const sw = src === revealVid ? revealVid.videoWidth : (revealImg && revealImg.naturalWidth);
      const sh = src === revealVid ? revealVid.videoHeight : (revealImg && revealImg.naturalHeight);
      rctx.fillStyle = '#08080b'; rctx.fillRect(0, 0, cw, ch);
      if (src && sw && sh) {
        rctx.drawImage(src, 0, 0, sw, sh, frame.x * dpr, frame.y * dpr, frame.w * dpr, frame.h * dpr);
        const fx0 = frame.x * dpr, fx1 = (frame.x + frame.w) * dpr, fy = frame.y * dpr, fh = frame.h * dpr, fade = frame.w * dpr * 0.07;
        if (fx0 > 1) { const g = rctx.createLinearGradient(fx0, 0, fx0 + fade, 0); g.addColorStop(0, '#08080b'); g.addColorStop(1, 'rgba(8,8,11,0)'); rctx.fillStyle = g; rctx.fillRect(fx0, fy, fade, fh); }
        if (fx1 < cw - 1) { const g = rctx.createLinearGradient(fx1, 0, fx1 - fade, 0); g.addColorStop(0, '#08080b'); g.addColorStop(1, 'rgba(8,8,11,0)'); rctx.fillStyle = g; rctx.fillRect(fx1 - fade, fy, fade, fh); }
      }
      rctx.imageSmoothingEnabled = true;
      rctx.globalCompositeOperation = 'destination-in';
      rctx.drawImage(mask, 0, 0, cw, ch);
      rctx.globalCompositeOperation = 'source-over';
    }

    let last = performance.now();
    function loop(now) {
      requestAnimationFrame(loop);
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
      if (!active) return;
      tick(dt, now);
      if (dirty || stamps.length || !vid.paused) { draw(now); dirty = false; }
    }
    requestAnimationFrame(loop);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        active = e.isIntersecting; if (active) dirty = true;
        if (revealVid && !prefersReducedMotion) { if (active) { const p = revealVid.play(); if (p && p.catch) p.catch(() => {}); } else revealVid.pause(); }
      }, { threshold: 0 }).observe(stage);
    }
  }

  /* ==========================================================================
     Hero Video: muted autoplay loop, sound toggle, pauses when hero is out of view
     ========================================================================== */
  function initHeroVideo() {
    const stage = document.getElementById('home');
    const v = document.getElementById('heroVideo');
    const btn = document.getElementById('heroSoundBtn');
    if (!stage || !v) return;
    let soundOn = false;
    const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };

    v.muted = true;
    if (!prefersReducedMotion) play();           // reduced motion: keep the poster until the visitor asks

    function setSound(on) {
      soundOn = on; v.muted = !on;
      if (btn) {
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      }
      if (on) { const p = v.play(); if (p && p.catch) p.catch(() => setSound(false)); }
    }
    if (btn) btn.addEventListener('click', () => setSound(!soundOn));

    // Pause (and silence) the voice as soon as the hero is mostly scrolled away
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.intersectionRatio >= 0.35) { if (!prefersReducedMotion || soundOn) play(); } else v.pause();
      }, { threshold: [0, 0.35, 0.6, 1] }).observe(stage);
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) v.pause(); else if (!prefersReducedMotion || soundOn) play(); });
  }

  function initLiveClock() {
    const clockDisplay = document.getElementById('clockTimeDisplay');
    if (!clockDisplay) return;

    function updateClock() {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        clockDisplay.textContent = `${formatter.format(now)} PKT`;
      } catch (err) {
        // Fallback calculation for GMT+5
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const pkt = new Date(utc + (3600000 * 5));
        const hours = String(pkt.getHours()).padStart(2, '0');
        const minutes = String(pkt.getMinutes()).padStart(2, '0');
        const seconds = String(pkt.getSeconds()).padStart(2, '0');
        clockDisplay.textContent = `${hours}:${minutes}:${seconds} PKT`;
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ==========================================================================
     09. Copy Email Address with Toast Confirmation
     ========================================================================== */
  function initCopyEmail() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('toastNotice');
    if (!copyBtn || !toast) return;

    const emailToCopy = copyBtn.getAttribute('data-email') || '';
    let toastTimeout = null;

    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback legacy execCommand
          const tempInput = document.createElement('input');
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Show toast
        toast.textContent = `Copied ${emailToCopy} to clipboard!`;
        toast.classList.add('is-visible');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toast.classList.remove('is-visible');
        }, 3200);

      } catch (err) {
        console.warn('Clipboard copy error:', err);
        toast.textContent = `Email: ${emailToCopy}`;
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 3000);
      }
    });
  }

  /* ==========================================================================
     10. Contact Form Submission & Validation
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !feedback || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Reset feedback status
      feedback.className = 'form-feedback-notice';
      feedback.textContent = '';

      // Validation
      if (!name) {
        showError('Please enter your name.');
        if (nameInput) nameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message || message.length < 8) {
        showError('Please provide a message with at least 8 characters.');
        if (messageInput) messageInput.focus();
        return;
      }

      const done = (ok, msg) => { submitBtn.disabled = false; feedback.className = 'form-feedback-notice ' + (ok ? 'is-success' : 'is-error'); feedback.textContent = msg; if (ok) form.reset(); };
      if (SITE.formEndpoint) {
        submitBtn.disabled = true;
        fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, email, message }) })
          .then(r => r.ok ? done(true, 'Thank you! Your message was sent.') : done(false, 'Could not send. Please try again.'))
          .catch(() => done(false, 'Could not send. Please try again.'));
      } else if (SITE.email) {
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Message from ' + name)}&body=${encodeURIComponent(message + '\n\n' + email)}`;
        done(true, 'Opening your email app…');
      } else {
        done(false, 'Messaging is not set up yet.');
      }
    });

    function showError(msg) {
      feedback.className = 'form-feedback-notice is-error';
      feedback.textContent = msg;
    }
  }

  /* ==========================================================================
     11. Utility Helpers (Security Sanitization)
     ========================================================================== */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     12. Bootstrapping Engine
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderWork();
    renderJourney();
    renderContactInfo();
    initScreensLoop();
    initHeroVideo();
    initHeroScratch();
    initTheme();
    initLoader();
    initCustomCursor();
    initNavigation();
    initMobileMenu();
    initJourneyTimeline();
    initCaseStudyModal();
    initLiveClock();
    initCopyEmail();
    initContactForm();
  });

})();
