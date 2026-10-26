/* ==========================================================================
   ABISHEK R & JAN VISUAL PRODUCTION — INTERACTIVE JAVASCRIPT ENGINE
   Includes: Preloader, Custom Cursor, Audio Player, Waveform Canvas & Case Studies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. PRELOADER ANIMATION
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  const counterEl = document.querySelector('.preloader-counter');
  const progressEl = document.querySelector('.preloader-progress');

  if (counterEl && progressEl) {
    let count = 1;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 3;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (preloader) {
            preloader.style.transform = 'translateY(-100%)';
            setTimeout(() => preloader.style.display = 'none', 800);
          }
        }, 300);
      }
      counterEl.textContent = (count < 10 ? '0' : '') + count + '%';
      progressEl.style.width = count + '%';
    }, 35);
  }

  /* ------------------------------------------------------------------------
     2. CUSTOM CURSOR PHYSICS
     ------------------------------------------------------------------------ */
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  if (cursor && follower && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverElements = document.querySelectorAll('[data-cursor], button, a, .project-card, .video-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor') || 'OPEN';
        cursor.classList.add('hover-active');
        cursor.setAttribute('data-cursor-text', text);
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover-active');
        cursor.removeAttribute('data-cursor-text');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. HEADER SCROLL & DYNAMIC ACTIVE SECTION NAVIGATION CAPSULE
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.header-nav');
  const lightSections = document.querySelectorAll('.light-section');
  const navActiveIndicator = document.querySelector('.nav-active-indicator');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  // Section mapping for: 1. EDITING, 2. MUSIC, 3. JAN VISUAL PRODUCTION, 4. WORK, 5. SERVICES, 6. CONTACT
  const sectionIds = ['editing', 'music', 'jan-studio', 'work', 'services', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  let currentActiveIndex = -1;
  let isClickScrolling = false;

  // Function to move single shared active indicator capsule physically to target nav link
  function moveActiveIndicator(targetLink, index) {
    if (!targetLink || !navActiveIndicator) return;

    const leftOffset = targetLink.offsetLeft;
    const linkWidth = targetLink.offsetWidth;

    // Subtle direction-aware stretch physics
    let stretchScale = 1;
    if (currentActiveIndex !== -1 && currentActiveIndex !== index) {
      stretchScale = 1.12;
    }

    navActiveIndicator.style.opacity = '1';
    navActiveIndicator.style.width = `${linkWidth}px`;
    navActiveIndicator.style.transform = `translate3d(${leftOffset}px, -50%, 0) scaleX(${stretchScale})`;

    setTimeout(() => {
      navActiveIndicator.style.transform = `translate3d(${leftOffset}px, -50%, 0) scaleX(1)`;
    }, 220);

    // Update link active states
    navLinks.forEach(link => link.classList.remove('active'));
    targetLink.classList.add('active');

    currentActiveIndex = index;
  }

  // Real-time viewport-center section detection engine
  function updateActiveSectionOnScroll() {
    if (isClickScrolling) return;

    const viewportCenter = window.innerHeight * 0.42;
    let closestIndex = -1;
    let minDistance = Infinity;

    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= 120) {
        const dist = Math.abs(rect.top);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = idx;
        }
      }
    });

    // Top of page hero check
    if (closestIndex === -1 && window.scrollY < 300) {
      if (navActiveIndicator) navActiveIndicator.style.opacity = '0';
      navLinks.forEach(l => l.classList.remove('active'));
      currentActiveIndex = -1;
      return;
    }

    if (closestIndex !== -1 && closestIndex !== currentActiveIndex) {
      if (navLinks[closestIndex]) {
        moveActiveIndicator(navLinks[closestIndex], closestIndex);
      }
    }
  }

  // Combined scroll handler for header glassmorphism and active section capsule
  window.addEventListener('scroll', () => {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let isOverLight = false;
    const headerRect = header.getBoundingClientRect();
    const headerCenter = headerRect.top + headerRect.height / 2;

    lightSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (headerCenter >= rect.top && headerCenter <= rect.bottom) {
        isOverLight = true;
      }
    });

    if (isOverLight) {
      header.classList.add('nav-light');
    } else {
      header.classList.remove('nav-light');
    }

    updateActiveSectionOnScroll();
  }, { passive: true });

  // Initial check on page load
  setTimeout(updateActiveSectionOnScroll, 100);

  // Click & smooth scroll synchronization
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', () => {
      isClickScrolling = true;
      moveActiveIndicator(link, idx);

      setTimeout(() => {
        isClickScrolling = false;
        updateActiveSectionOnScroll();
      }, 750);
    });
  });

  // Recalculate indicator position on window resize
  window.addEventListener('resize', () => {
    if (currentActiveIndex !== -1 && navLinks[currentActiveIndex]) {
      moveActiveIndicator(navLinks[currentActiveIndex], currentActiveIndex);
    }
  });

  /* ------------------------------------------------------------------------
     4. HERO CREATIVE ELEMENTS SYSTEM — CINEMATIC EMERGENCE & FLOATING PHYSICS
     ------------------------------------------------------------------------ */
  function initHeroCreativeSystem() {
    const heroSystem = document.getElementById('heroCreativeSystem');
    const heroSection = document.getElementById('hero');
    if (!heroSystem || !heroSection) return;

    const cards = Array.from(heroSystem.querySelectorAll('.creative-element-card'));
    if (!cards.length) return;

    // 6 Art-Directed Surrounding Positions around Portrait (emerging outward from center)
    const elementConfigs = [
      // 1. CapCut (Top Left)
      { id: 'capcut', endX: -38, endY: -28, baseRot: -6, scale: 1.0, floatSpeed: 0.0016, depth: 0.04 },
      // 2. Instagram (Mid Left)
      { id: 'instagram', endX: -42, endY: -2, baseRot: 4, scale: 1.0, floatSpeed: 0.0014, depth: 0.05 },
      // 3. Keyboard (Lower Left)
      { id: 'keyboard', endX: -36, endY: 26, baseRot: -5, scale: 1.0, floatSpeed: 0.0018, depth: 0.06 },
      // 4. Canva (Top Right)
      { id: 'canva', endX: 38, endY: -28, baseRot: 5, scale: 1.0, floatSpeed: 0.0015, depth: 0.04 },
      // 5. Drums (Mid Right)
      { id: 'drums', endX: 42, endY: -2, baseRot: -4, scale: 1.0, floatSpeed: 0.0013, depth: 0.05 },
      // 6. Guitar (Lower Right)
      { id: 'guitar', endX: 36, endY: 26, baseRot: 6, scale: 1.0, floatSpeed: 0.0017, depth: 0.06 }
    ];

    // Physics & Emergence State for each element
    const elementStates = cards.map((card, idx) => {
      const cfg = elementConfigs[idx] || elementConfigs[0];
      return {
        el: card,
        cfg: cfg,
        progress: 0,
        isHovered: false
      };
    });

    let emergenceTargetProgress = 0;
    let emergenceCurrentProgress = 0;

    let targetMouseX = 0, targetMouseY = 0;
    let curMouseX = 0, curMouseY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let mouseVelX = 0, mouseVelY = 0;
    let smoothVelX = 0, smoothVelY = 0;
    let scrollYOffset = 0;

    // Emergence sequence starts on page load
    setTimeout(() => {
      emergenceTargetProgress = 1;
    }, 300);

    // Mouse Tracking & Inertia Velocity Engine
    window.addEventListener('mousemove', (e) => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const normX = (e.clientX - winW / 2) / (winW / 2);
      const normY = (e.clientY - winH / 2) / (winH / 2);

      targetMouseX = Math.min(Math.max(normX, -1), 1);
      targetMouseY = Math.min(Math.max(normY, -1), 1);

      mouseVelX = e.clientX - lastMouseX;
      mouseVelY = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollYOffset = window.scrollY;
    }, { passive: true });

    // Hover listeners for scale up and neon glow boost
    elementStates.forEach(state => {
      state.el.addEventListener('mouseenter', () => state.isHovered = true);
      state.el.addEventListener('mouseleave', () => state.isHovered = false);
    });

    // 60fps Physics & Render Engine
    function renderHeroElements(timestamp) {
      // Emergence interpolation
      emergenceCurrentProgress += (emergenceTargetProgress - emergenceCurrentProgress) * 0.04;
      const p = emergenceCurrentProgress;
      const easeP = 1 - Math.pow(1 - p, 3); // Cubic ease-out

      // Mouse position & velocity damping
      curMouseX += (targetMouseX - curMouseX) * 0.05;
      curMouseY += (targetMouseY - curMouseY) * 0.05;

      mouseVelX *= 0.90;
      mouseVelY *= 0.90;
      smoothVelX += (mouseVelX * 0.08 - smoothVelX) * 0.05;
      smoothVelY += (mouseVelY * 0.08 - smoothVelY) * 0.05;

      const winW = window.innerWidth;
      const posMult = winW <= 600 ? 0.72 : (winW <= 1024 ? 0.85 : 1.0);

      elementStates.forEach((state, idx) => {
        const cfg = state.cfg;

        // 1. Emergence Interpolation (Center 50%,50% -> Surrounding Position)
        const targetPosX = cfg.endX * posMult;
        const targetPosY = cfg.endY * posMult;

        const posX = targetPosX * easeP;
        const posY = targetPosY * easeP;
        const scaleVal = (0.2 + (cfg.scale - 0.2) * easeP) * (winW <= 600 ? 0.75 : 1.0);
        const opacityVal = Math.min(1.0, easeP * 1.6);

        // 2. Idle Floating Motion (Sine Waves)
        const time = timestamp * cfg.floatSpeed;
        const floatY = Math.sin(time + idx * 1.2) * 9 * easeP;
        const floatX = Math.cos(time * 0.8 + idx) * 6 * easeP;
        const floatRot = Math.sin(time * 0.7 + idx) * 3.5 * easeP;

        // 3. Mouse Parallax & Velocity Inertia Response
        const parallaxX = curMouseX * cfg.depth * 280 * easeP + smoothVelX * cfg.depth * 25;
        const parallaxY = curMouseY * cfg.depth * 280 * easeP + smoothVelY * cfg.depth * 25;

        // 4. Scroll Shift (Shift outward & fade out past hero)
        const scrollFactor = Math.min(1.0, scrollYOffset / 600);
        const scrollShiftY = -scrollFactor * 60;
        const scrollShiftX = (idx < 3 ? -1 : 1) * scrollFactor * 40;
        const scrollOpacity = Math.max(0, 1.0 - scrollFactor * 1.2);

        // 5. Hover Boost
        let hoverScale = 1.0;
        let hoverZ = 4;

        if (state.isHovered) {
          hoverScale = 1.18;
          hoverZ = 20;
        }

        const finalX = posX + floatX + parallaxX + scrollShiftX;
        const finalY = posY + floatY + parallaxY + scrollShiftY;
        const finalRot = cfg.baseRot + floatRot;
        const finalScale = scaleVal * hoverScale;
        const finalOpacity = opacityVal * scrollOpacity;

        state.el.style.zIndex = hoverZ;
        state.el.style.opacity = finalOpacity.toFixed(3);
        state.el.style.transform = `translate(calc(-50% + ${finalX.toFixed(2)}vw), calc(-50% + ${finalY.toFixed(2)}vh)) scale(${finalScale.toFixed(3)}) rotate(${finalRot.toFixed(2)}deg)`;
      });

      requestAnimationFrame(renderHeroElements);
    }

    requestAnimationFrame(renderHeroElements);
  }

  initHeroCreativeSystem();

  /* ------------------------------------------------------------------------
     4. BEFORE / AFTER DRAGGABLE SLIDER
     ------------------------------------------------------------------------ */
  const baContainer = document.querySelector('.before-after-container');
  const baOverlay = document.querySelector('.before-after-overlay');
  const baHandle = document.querySelector('.before-after-handle');

  if (baContainer && baOverlay && baHandle) {
    let isDragging = false;

    const setSliderPosition = (x) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baOverlay.style.width = percentage + '%';
      baHandle.style.left = percentage + '%';
    };

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => isDragging = false);

    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => isDragging = false);
  }

  /* ------------------------------------------------------------------------
     5. CAPCUT TIMELINE WIDGET INTERACTION
     ------------------------------------------------------------------------ */
  const playBtn = document.querySelector('.timeline-btn.active-play');
  const playhead = document.querySelector('.timeline-playhead');

  if (playBtn && playhead) {
    let isPlaying = true;
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playhead.style.animationPlayState = 'running';
        playBtn.textContent = '❚❚';
      } else {
        playhead.style.animationPlayState = 'paused';
        playBtn.textContent = '▶';
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. AUDIO PLAYER & CANVAS WAVEFORM ANIMATION
     ------------------------------------------------------------------------ */
  const audioBtn = document.getElementById('audioPlayToggle');
  const audioCanvas = document.getElementById('audioWaveformCanvas');

  if (audioCanvas) {
    const ctx = audioCanvas.getContext('2d');
    let isAudioPlaying = false;
    let animationFrameId;

    function drawWaveform() {
      const width = audioCanvas.width = audioCanvas.offsetWidth;
      const height = audioCanvas.height = audioCanvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      const bars = 48;
      const barWidth = width / bars - 3;
      const time = Date.now() * 0.005;

      for (let i = 0; i < bars; i++) {
        let barHeight = isAudioPlaying
          ? Math.sin(i * 0.3 + time) * 14 + Math.cos(i * 0.5 + time) * 10 + 20
          : 6;

        ctx.fillStyle = isAudioPlaying ? '#D7FF00' : 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(i * (barWidth + 3), (height - barHeight) / 2, barWidth, barHeight);
      }

      animationFrameId = requestAnimationFrame(drawWaveform);
    }
    drawWaveform();

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        isAudioPlaying = !isAudioPlaying;
        if (isAudioPlaying) {
          audioBtn.textContent = '❚❚';
        } else {
          audioBtn.textContent = '▶';
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     DATA-DRIVEN PORTFOLIO VIDEO WORKS (8 UP-TO-DATE VIDEO REELS)
     ------------------------------------------------------------------------ */
  const VIDEO_WORKS_DATA = [
    {
      id: '01',
      num: '01 // REEL',
      title: 'MOTORSPORT REEL',
      fullTitle: 'MOTORSPORT NIGHT SPRINT REEL',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/poster_f1.jpg',
      driveId: '1r6BRCI0qSnoie3aLkzde5uD2Yze4JhBG',
      client: 'Motorsport Digital',
      tools: 'CapCut Pro, Speed Curves',
      brief: 'Create a high-energy, fast-cut promotional reel capturing the adrenaline and technical perfection of modern Formula 1 night racing.',
      approach: 'Utilized rapid beat-matched jump cuts, custom sound design, velocity curves, and color grading tuned to electric neon contrasts.',
      result: 'Surpassed 1.2M impressions across social media channels within the first week of launch.'
    },
    {
      id: '02',
      num: '02 // EDIT',
      title: 'CINEMATIC EDIT',
      fullTitle: 'CINEMATIC EDIT & RHYTHMIC CUTS',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/hero_editor.jpg',
      driveId: '1r7OtdV-M0Ix3A7y8l0t62CdPMnYe7v67',
      client: 'AURA Editorial',
      tools: 'CapCut, Color Grade',
      brief: 'Develop an integrated video edit blending cinematic storytelling with high retention tempo cuts.',
      approach: 'Blended slow-motion cinematic portraiture with minimalist typography overlays and slick grain textures.',
      result: 'Established an elevated brand aesthetic that boosted engagement significantly.'
    },
    {
      id: '03',
      num: '03 // SOCIAL',
      title: 'VELOCITY REEL',
      fullTitle: 'HIGH-VELOCITY SOCIAL REEL',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/Jas 1.png',
      driveId: '1rH_GAgpT9Y8KPpnguzdKzjJ4uFKH8lfU',
      client: 'Creator Studio',
      tools: 'Kinetic Typography, Sound Design',
      brief: 'Deliver retention-optimized short form content with animated motion text and engaging sound design.',
      approach: 'Crafted hook-first edits, custom text keyframing, and fast-paced visual transitions.',
      result: 'Achieved top performance across Instagram Reels and TikTok.'
    },
    {
      id: '04',
      num: '04 // PROMO',
      title: 'BRAND PROMO CUT',
      fullTitle: 'CREATOR BRAND PROMO CUT',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/Jas 4.png',
      driveId: '1rMKfuDkWTNiBh29977IQfmDc98gw-uZF',
      client: 'JAN Visual Production',
      tools: 'CapCut, Dynamic Motion',
      brief: 'Produce a high-impact brand promo cut focusing on rhythm, sound design, and retention cuts.',
      approach: 'Engineered kinetic text reveals and velocity curves for maximum visual punch.',
      result: 'Drove massive engagement and brand awareness.'
    },
    {
      id: '05',
      num: '05 // MOTION',
      title: 'EDITORIAL MOTION',
      fullTitle: 'EDITORIAL MOOD & VISUAL MOTION',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/photo_after.jpg',
      driveId: '1rVLWvXVo0zOKa_QG46NUkz11rRnoPvzG',
      client: 'Fashion & Visual House',
      tools: 'CapCut Pro, Text Keyframes',
      brief: 'Craft an atmospheric visual edit showcasing slow-motion transitions and moody color tones.',
      approach: 'Applied soft grain, selective color grading, and smooth spatial transitions.',
      result: 'Highly praised by creative directors for mood and pacing.'
    },
    {
      id: '06',
      num: '06 // BEATS',
      title: 'PERCUSSION CUT',
      fullTitle: 'PERCUSSION & BEAT SYNCED CUT',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/Jas 5.png',
      driveId: '1rVqy1vdv-tIcJPu-neBeWwTNQfnCAHfk',
      client: 'Music & Beat Production',
      tools: 'CapCut, Audio Sync',
      brief: 'Synchronize video edit keyframes directly to live drum beats and percussion transients.',
      approach: 'Matched every cut, transition, and effect to snare hits and bass drops.',
      result: 'Flawless rhythm-driven visual performance.'
    },
    {
      id: '07',
      num: '07 // STUDIO',
      title: 'JAN SHOWCASE',
      fullTitle: 'JAN VISUAL PRODUCTION SHOWCASE',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/jan_logo.jpg',
      driveId: '1rYGkh5WEj8BiFSUNTNEamADdzgdzIH_0',
      client: 'JAN Studio Production',
      tools: 'Studio Render, CapCut Pro',
      brief: 'Full showreel showcasing the creative breadth and technical mastery of JAN Visual Production.',
      approach: 'Seamlessly stitched video edits, graphic design, and brand identity projects.',
      result: 'Serves as the main flagship showcase video.'
    },
    {
      id: '08',
      num: '08 // COMMERCIAL',
      title: 'COMMERCIAL EDIT',
      fullTitle: 'CREATIVE CONCEPT & COMMERCIAL EDIT',
      category: 'VIDEO EDITING',
      thumbnail: 'assets/images/Jas 2.png',
      driveId: '1rdfX8y5Kuc7PHq51AAf_-gKNH-z_azpf',
      client: 'Commercial Client',
      tools: 'CapCut, Visual FX',
      brief: 'Deliver a high-impact commercial video edit optimized for social media brand awareness.',
      approach: 'Integrated bold typography with rhythmic cuts and vibrant color science.',
      result: 'Exceeded target conversions and click-through rates.'
    }
  ];


  /* ------------------------------------------------------------------------
     8. FEATURED GALLERY FILTERING
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     9. CASE STUDY & VIDEO LIGHTBOX MODAL INTERACTION (9:16 VERTICAL PLAYER)
     ------------------------------------------------------------------------ */
  const modal = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('modalBodyContent');
  const modalClose = document.querySelector('.modal-close-btn');

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalBody) {
        modalBody.innerHTML = ''; // Immediately stop video and audio playback!
      }
    }
  }

  // Delegate click handling for dynamically generated cards & static gallery cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;

    // Ignore secondary section clicks if they aren't project cards
    const id = card.getAttribute('data-project-id') || '01';
    const data = VIDEO_WORKS_DATA.find(item => item.id === id) || VIDEO_WORKS_DATA[0];

    if (modal && modalBody) {
      let mediaHtml = '';
      if (data.driveId) {
        mediaHtml = `
          <div style="position:relative; width:100%; max-width:380px; aspect-ratio:9/16; border-radius:20px; overflow:hidden; border:1px solid var(--border-dark); margin:0 auto 1.5rem auto; background:#000; box-shadow:0 25px 60px rgba(0,0,0,0.9), 0 0 30px var(--accent-lime-glow);">
            <iframe src="https://drive.google.com/file/d/${data.driveId}/preview" width="100%" height="100%" style="border:0;" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div style="text-align:center; margin-bottom:2rem;">
            <a href="https://drive.google.com/file/d/${data.driveId}/view?usp=sharing" target="_blank" rel="noopener noreferrer" class="split-btn-action" style="display:inline-flex;">
              OPEN VIDEO IN GOOGLE DRIVE ↗
            </a>
          </div>
        `;
      }

      modalBody.innerHTML = `
        <div class="section-label">${data.category} CASE STUDY</div>
        <h2 style="font-size: clamp(2rem, 4vw, 3.5rem); margin: 0.5rem 0 1.5rem 0;">${data.fullTitle || data.title}</h2>
        
        ${mediaHtml}

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; background: #111114; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-dark);">
          <div><span style="color:var(--text-dark-muted); font-size:0.8rem; display:block;">CLIENT</span><strong>${data.client}</strong></div>
          <div><span style="color:var(--text-dark-muted); font-size:0.8rem; display:block;">CATEGORY</span><strong>${data.category}</strong></div>
          <div><span style="color:var(--text-dark-muted); font-size:0.8rem; display:block;">TOOLS USED</span><strong style="color:var(--accent-lime);">${data.tools}</strong></div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem; line-height: 1.7;">
          <div>
            <h3 style="font-size: 1.2rem; color: var(--accent-lime); margin-bottom: 0.4rem;">THE BRIEF</h3>
            <p>${data.brief}</p>
          </div>
          <div>
            <h3 style="font-size: 1.2rem; color: var(--accent-lime); margin-bottom: 0.4rem;">THE APPROACH</h3>
            <p>${data.approach}</p>
          </div>
          <div>
            <h3 style="font-size: 1.2rem; color: var(--accent-lime); margin-bottom: 0.4rem;">THE RESULT</h3>
            <p>${data.result}</p>
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------------
     9. PARALLAX SCROLL FOR SIGNATURE WORDS
     ------------------------------------------------------------------------ */
  const sigWords = document.querySelectorAll('.signature-word');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sigWords.forEach((word, index) => {
      word.style.transform = `translateY(${Math.sin(scrollY * 0.002 + index) * 15}px)`;
    });
  });

  /* ------------------------------------------------------------------------
     10. CONTACT FORM SUBMISSION & JAN VISUAL PRODUCTION CARD INTERACTIONS
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out! Abishek R & Jan Visual Production will get back to you shortly.');
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
     11. CONTACT CARDS 3D GRAPHIC MOUSE PARALLAX
     ------------------------------------------------------------------------ */
  const visualCards = document.querySelectorAll('.contact-visual-card');

  visualCards.forEach(card => {
    const graphic = card.querySelector('.contact-3d-graphic');
    const magneticText = card.querySelector('.magnetic-action-text');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle opposite mouse tilt for 3D graphic (5px to 12px)
      if (graphic) {
        graphic.style.transform = `scale(1.08) translate3d(${-x * 0.04}px, ${-y * 0.04}px, 0) rotate(${x * 0.015}deg)`;
      }

      // Magnetic text pull (3px to 8px max)
      if (magneticText) {
        magneticText.style.transform = `translate3d(${x * 0.03}px, ${y * 0.03}px, 0)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (graphic) {
        graphic.style.transform = '';
      }
      if (magneticText) {
        magneticText.style.transform = '';
      }
    });
  });

  /* ------------------------------------------------------------------------
     12. BACKGROUND WATERMARK PARALLAX SCROLL
     ------------------------------------------------------------------------ */
  const bgWatermark = document.querySelector('.contact-bg-watermark');
  const contactSection = document.getElementById('contact');

  if (bgWatermark && contactSection) {
    window.addEventListener('scroll', () => {
      const rect = contactSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offsetY = (window.innerHeight - rect.top) * 0.05;
        bgWatermark.style.transform = `translateY(${offsetY}px)`;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     13. ABOUT ABISHEK SECTION — CURSOR VELOCITY & INERTIA MOTION ENGINE
     ------------------------------------------------------------------------ */
  const aboutSection = document.getElementById('about');

  if (aboutSection) {
    // 1. Slow Cinematic Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('in-view');
        }
      });
    }, { threshold: 0.12 });

    observer.observe(aboutSection);

    // 2. Element Targets & Layers
    const bgWatermarks = aboutSection.querySelectorAll('.about-bg-watermark');
    const headlineLines = aboutSection.querySelectorAll('.headline-mask-line');
    const leadWrapper = aboutSection.querySelector('.about-lead-wrapper');
    const disciplineCards = aboutSection.querySelectorAll('.about-discipline-card');
    const floatCoords = aboutSection.querySelectorAll('.about-floating-element');

    // Motion State Tracking
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let prevMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastTime = performance.now();

    let rawVelocity = 0;
    let smoothVelocity = 0;
    let dirX = 0, dirY = 0;
    let isHoveringAbout = false;

    // Layer Physics State Objects
    const physics = {
      bg: { curX: 0, curY: 0, targetX: 0, targetY: 0, factor: 0.025 },
      headline: Array.from(headlineLines).map((line, idx) => ({
        el: line,
        curX: 0, curY: 0, targetX: 0, targetY: 0,
        depth: (idx + 1) * 1.2, // 1.2px, 2.4px, 3.6px, 4.8px differential depth
        factor: 0.04
      })),
      lead: { el: leadWrapper, curX: 0, curY: 0, targetX: 0, targetY: 0, factor: 0.03 },
      cards: Array.from(disciplineCards).map(card => ({
        el: card,
        icon: card.querySelector('.discipline-icon-wrapper'),
        curX: 0, curY: 0, targetX: 0, targetY: 0,
        curRotX: 0, curRotY: 0, targetRotX: 0, targetRotY: 0,
        curIconX: 0, curIconY: 0, targetIconX: 0, targetIconY: 0,
        curIconRot: 0, targetIconRot: 0,
        curIconScale: 1, targetIconScale: 1,
        factor: 0.045,
        iconFactor: 0.035
      }))
    };

    // Track Cursor Movement Velocity & Coordinates
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const rect = aboutSection.getBoundingClientRect();
      isHoveringAbout = (
        e.clientY >= rect.top - 150 &&
        e.clientY <= rect.bottom + 150 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      );
    }, { passive: true });

    // Mobile / Touch Interaction Support
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        const rect = aboutSection.getBoundingClientRect();
        isHoveringAbout = (rect.top < window.innerHeight && rect.bottom > 0);
      }
    }, { passive: true });

    // Single 60fps RequestAnimationFrame Physics & Rendering Engine
    function renderPhysics(now) {
      requestAnimationFrame(renderPhysics);

      const dt = Math.max(1, now - lastTime);
      lastTime = now;

      // 1. Calculate Cursor Speed & Trajectory Direction
      const dx = mouse.x - prevMouse.x;
      const dy = mouse.y - prevMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      rawVelocity = dist / dt;
      // Damping velocity for smooth acceleration & decay
      smoothVelocity += ((rawVelocity / 1.6) - smoothVelocity) * 0.08;
      const normVel = Math.min(1.0, Math.max(0, smoothVelocity));

      if (dist > 0.1) {
        dirX = dx / dist;
        dirY = dy / dist;
      }

      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normCenterX = (mouse.x - centerX) / centerX;
      const normCenterY = (mouse.y - centerY) / centerY;

      // 2. Compute Physical Targets (Driven by Velocity + Direction + Center Parallax)
      if (isHoveringAbout) {
        // Deep Ambient Background Layer
        physics.bg.targetX = normCenterX * 14 + dirX * normVel * 3;
        physics.bg.targetY = normCenterY * 14 + dirY * normVel * 3;

        // Headline Mask Lines (Differential Speeds for Depth)
        physics.headline.forEach(lineState => {
          lineState.targetX = dirX * lineState.depth * (0.8 + normVel * 1.4) + normCenterX * lineState.depth * 0.5;
          lineState.targetY = dirY * lineState.depth * (0.8 + normVel * 1.4) + normCenterY * lineState.depth * 0.3;
        });

        // Lead Description Wrapper
        if (physics.lead.el) {
          physics.lead.targetX = dirX * 3.5 * normVel + normCenterX * 2.5;
          physics.lead.targetY = dirY * 3.5 * normVel + normCenterY * 2.0;
        }

        // Discipline Cards & Floating PNG Artwork
        physics.cards.forEach(cardState => {
          const cardRect = cardState.el.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;

          const relX = mouse.x - cardCenterX;
          const relY = mouse.y - cardCenterY;

          const isOverCard = (
            mouse.x >= cardRect.left && mouse.x <= cardRect.right &&
            mouse.y >= cardRect.top && mouse.y <= cardRect.bottom
          );

          if (isOverCard) {
            // Card subtle lean & tilt
            cardState.targetX = (relX / cardRect.width) * 5 * (1 + normVel);
            cardState.targetY = (relY / cardRect.height) * 5 * (1 + normVel) - 4;
            cardState.targetRotX = (-relY / cardRect.height) * (3.5 + normVel * 3.5);
            cardState.targetRotY = (relX / cardRect.width) * (3.5 + normVel * 3.5);

            // PNG Artwork delayed physical float above card
            cardState.targetIconX = (-relX / cardRect.width) * 12 * (1 + normVel * 0.8);
            cardState.targetIconY = (-relY / cardRect.height) * 12 * (1 + normVel * 0.8);
            cardState.targetIconRot = (relX / cardRect.width) * (2.5 + normVel * 2.5);
            cardState.targetIconScale = 1.06 + normVel * 0.04;
          } else {
            // Ambient subtle response when not hovering card directly
            cardState.targetX = dirX * 2 * normVel + normCenterX * 1.8;
            cardState.targetY = dirY * 2 * normVel + normCenterY * 1.8;
            cardState.targetRotX = dirY * 1.2 * normVel;
            cardState.targetRotY = -dirX * 1.2 * normVel;

            cardState.targetIconX = dirX * 3.5 * normVel;
            cardState.targetIconY = dirY * 3.5 * normVel;
            cardState.targetIconRot = dirX * 1.2 * normVel;
            cardState.targetIconScale = 1.0;
          }
        });
      } else {
        // Slow Natural Settling to Resting Position
        physics.bg.targetX = 0;
        physics.bg.targetY = 0;

        physics.headline.forEach(lineState => {
          lineState.targetX = 0;
          lineState.targetY = 0;
        });

        if (physics.lead.el) {
          physics.lead.targetX = 0;
          physics.lead.targetY = 0;
        }

        physics.cards.forEach(cardState => {
          cardState.targetX = 0;
          cardState.targetY = 0;
          cardState.targetRotX = 0;
          cardState.targetRotY = 0;

          cardState.targetIconX = 0;
          cardState.targetIconY = 0;
          cardState.targetIconRot = 0;
          cardState.targetIconScale = 1.0;
        });
      }

      // 3. Render Interpolated Spring Lerp Transformations
      // Background Layer
      physics.bg.curX += (physics.bg.targetX - physics.bg.curX) * physics.bg.factor;
      physics.bg.curY += (physics.bg.targetY - physics.bg.curY) * physics.bg.factor;
      bgWatermarks.forEach((wm, idx) => {
        const mult = idx % 2 === 0 ? 1 : -1;
        wm.style.transform = `translate3d(${physics.bg.curX * mult}px, ${physics.bg.curY * mult}px, 0)`;
      });

      // Headline Lines
      physics.headline.forEach(lineState => {
        lineState.curX += (lineState.targetX - lineState.curX) * lineState.factor;
        lineState.curY += (lineState.targetY - lineState.curY) * lineState.factor;
        lineState.el.style.transform = `translate3d(${lineState.curX.toFixed(2)}px, ${lineState.curY.toFixed(2)}px, 0)`;
      });

      // Lead Paragraph
      if (physics.lead.el) {
        physics.lead.curX += (physics.lead.targetX - physics.lead.curX) * physics.lead.factor;
        physics.lead.curY += (physics.lead.targetY - physics.lead.curY) * physics.lead.factor;
        physics.lead.el.style.transform = `translate3d(${physics.lead.curX.toFixed(2)}px, ${physics.lead.curY.toFixed(2)}px, 0)`;
      }

      // Cards & PNG Icons
      physics.cards.forEach(cardState => {
        cardState.curX += (cardState.targetX - cardState.curX) * cardState.factor;
        cardState.curY += (cardState.targetY - cardState.curY) * cardState.factor;
        cardState.curRotX += (cardState.targetRotX - cardState.curRotX) * cardState.factor;
        cardState.curRotY += (cardState.targetRotY - cardState.curRotY) * cardState.factor;

        cardState.el.style.transform = `perspective(1000px) translate3d(${cardState.curX.toFixed(2)}px, ${cardState.curY.toFixed(2)}px, 0) rotateX(${cardState.curRotX.toFixed(2)}deg) rotateY(${cardState.curRotY.toFixed(2)}deg)`;

        if (cardState.icon) {
          cardState.curIconX += (cardState.targetIconX - cardState.curIconX) * cardState.iconFactor;
          cardState.curIconY += (cardState.targetIconY - cardState.curIconY) * cardState.iconFactor;
          cardState.curIconRot += (cardState.targetIconRot - cardState.curIconRot) * cardState.iconFactor;
          cardState.curIconScale += (cardState.targetIconScale - cardState.curIconScale) * cardState.iconFactor;

          cardState.icon.style.transform = `translate3d(${cardState.curIconX.toFixed(2)}px, ${cardState.curIconY.toFixed(2)}px, 15px) rotate(${cardState.curIconRot.toFixed(2)}deg) scale(${cardState.curIconScale.toFixed(3)})`;
        }
      });
    }

    requestAnimationFrame(renderPhysics);
  }

  /* ------------------------------------------------------------------------
     12. HERO CREATIVE ELEMENTS EMERGING & PARALLAX ENGINE
     ------------------------------------------------------------------------ */
  function initHeroCreativeElements() {
    const heroSection = document.getElementById('hero');
    const cards = document.querySelectorAll('.creative-element-card');
    const canvas = document.getElementById('heroParticlesCanvas');

    if (!heroSection || !cards.length) return;

    // Canvas particle system setup for emergence trails
    let ctx = null;
    let particles = [];
    if (canvas) {
      ctx = canvas.getContext('2d');
      const resizeCanvas = () => {
        canvas.width = heroSection.clientWidth;
        canvas.height = heroSection.clientHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    // Target positions for 6 creative elements (Equal 1-Finger Spacing, Dynamic Zigzag System)
    const targetConfigs = [
      // LEFT SIDE ZIGZAG (CapCut: -48, Instagram: -62 [moved left], Keyboard: -48)
      { selector: '.el-capcut', targetX: -48, targetY: -55, rot: -3, delay: 300, floatPeriod: 6.5, floatAmp: 2.0 },
      { selector: '.el-instagram', targetX: -62, targetY: -18, rot: 3, delay: 600, floatPeriod: 5.8, floatAmp: 2.0 },
      { selector: '.el-keyboard', targetX: -48, targetY: 19, rot: -2, delay: 900, floatPeriod: 7.5, floatAmp: 2.0 },

      // RIGHT SIDE ZIGZAG (Canva: 48, Drums: 62 [moved right], Guitar: 48)
      { selector: '.el-canva', targetX: 48, targetY: -55, rot: 3, delay: 450, floatPeriod: 7.0, floatAmp: 2.0 },
      { selector: '.el-drums', targetX: 62, targetY: -18, rot: -3, delay: 750, floatPeriod: 8.2, floatAmp: 2.0 },
      { selector: '.el-guitar', targetX: 48, targetY: 19, rot: 2, delay: 1050, floatPeriod: 9.0, floatAmp: 2.0 }
    ];

    // Card State Management
    const cardStates = [];
    cards.forEach((card) => {
      const cls = Array.from(card.classList).find(c => c.startsWith('el-'));
      const cfg = targetConfigs.find(c => c.selector === '.' + cls) || {
        targetX: 0, targetY: 0, rot: 0, delay: 500, floatPeriod: 8, floatAmp: 8
      };

      const depth = parseFloat(card.getAttribute('data-depth') || '0.05');

      cardStates.push({
        el: card,
        cfg: cfg,
        depth: depth,
        emerged: true,
        emergeProgress: 1.0,
        curX: 0,
        curY: 0,
        curRot: 0,
        curScale: 1.0,
        curOpacity: 1
      });
    });

    // Mouse Parallax & Velocity Tracking
    let targetMouseX = 0, targetMouseY = 0;
    let curMouseX = 0, curMouseY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let mouseVelocity = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        targetMouseX = normX;
        targetMouseY = normY;

        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouseVelocity = Math.min(dist * 0.08, 3.0);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    // Spawn Particles during Emergence
    function spawnEmergenceParticles(originX, originY, targetX, targetY, color) {
      if (!ctx) return;
      for (let i = 0; i < 6; i++) {
        const angle = Math.atan2(targetY - originY, targetX - originX) + (Math.random() - 0.5) * 0.8;
        const speed = 1.5 + Math.random() * 3.5;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3.5,
          alpha: 1.0,
          decay: 0.015 + Math.random() * 0.02,
          color: color || '#D7FF00'
        });
      }
    }

    // Trigger Emergence Stagger
    setTimeout(() => {
      const heroW = heroSection.clientWidth;
      const heroH = heroSection.clientHeight;
      const originX = heroW * 0.5;
      const originY = heroH * 0.45;

      cardStates.forEach((state) => {
        setTimeout(() => {
          state.emerged = true;

          const colors = ['#D7FF00', '#00F0FF', '#7D2AE8', '#FF2A85'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const screenScale = window.innerWidth <= 768 ? 0.45 : (window.innerWidth <= 1024 ? 0.7 : 1.0);
          const tX = originX + (state.cfg.targetX / 100) * (heroW / 2) * screenScale;
          const tY = originY + (state.cfg.targetY / 100) * (heroH / 2) * screenScale;

          spawnEmergenceParticles(originX, originY, tX, tY, randomColor);
        }, state.cfg.delay);
      });
    }, 300);

    // Main Render Physics Loop
    let startTime = null;

    function renderHeroElements(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      curMouseX += (targetMouseX - curMouseX) * 0.05;
      curMouseY += (targetMouseY - curMouseY) * 0.05;
      mouseVelocity += (0 - mouseVelocity) * 0.06;

      const heroW = heroSection.clientWidth;
      const heroH = heroSection.clientHeight;
      const screenScale = window.innerWidth <= 768 ? 0.45 : (window.innerWidth <= 1024 ? 0.7 : 1.0);

      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      cardStates.forEach((state) => {
        if (!state.emerged) {
          state.el.style.opacity = '0';
          return;
        }

        if (state.emergeProgress < 1.0) {
          state.emergeProgress += 0.018;
          if (state.emergeProgress >= 1.0) {
            state.emergeProgress = 1.0;
            // When emergence completes, bring logo to top z-index (z-index: 4) so it rests 100% visible outside body
            state.el.style.zIndex = '4';
          }
        }

        const p = state.emergeProgress;
        const easeP = 1 - Math.pow(1 - p, 3); // Cubic ease-out

        const baseTargetX = (state.cfg.targetX / 100) * (heroW / 2) * screenScale;
        const baseTargetY = (state.cfg.targetY / 100) * (heroH / 2) * screenScale;

        // Subtle Sine Wave Floating (Keeps opacity at 1.0 permanently)
        const floatY = Math.sin((elapsed / state.cfg.floatPeriod) * Math.PI * 2) * state.cfg.floatAmp;
        const floatX = Math.cos((elapsed / (state.cfg.floatPeriod * 1.3)) * Math.PI * 2) * (state.cfg.floatAmp * 0.5);
        const floatRot = Math.sin((elapsed / (state.cfg.floatPeriod * 1.5)) * Math.PI * 2) * 2.0;

        const parallaxX = curMouseX * state.depth * 280 * (1 + mouseVelocity * 0.2);
        const parallaxY = curMouseY * state.depth * 280 * (1 + mouseVelocity * 0.2);

        const destX = (baseTargetX + floatX + parallaxX) * easeP;
        const destY = (baseTargetY + floatY + parallaxY) * easeP;
        const destRot = (state.cfg.rot + floatRot + (curMouseX * state.depth * 20)) * easeP;
        const destScale = 0.15 + (1.0 - 0.15) * easeP;

        // 100% Opacity in final state
        const destOpacity = easeP; // Smoothly fades in from 0 to 1 during emergence, stays at 1 permanently

        state.el.style.opacity = destOpacity.toFixed(3);
        state.el.style.filter = easeP >= 0.95 ? 'none' : `blur(${(Math.max(0, (1 - easeP) * 8)).toFixed(1)}px)`;
        state.el.style.transform = `translate(calc(-50% + ${destX.toFixed(2)}px), calc(-50% + ${destY.toFixed(2)}px)) rotate(${destRot.toFixed(2)}deg) scale(${destScale.toFixed(3)})`;
      });

      requestAnimationFrame(renderHeroElements);
    }

    requestAnimationFrame(renderHeroElements);
  }

  // Initialize Hero Creative Elements Engine
  initHeroCreativeElements();

  /* ====================================================================
     JAN VISUAL PRODUCTION LOGO CINEMATIC ANIMATION ENGINE
     ==================================================================== */
  function initJanLogoStudioShowcase() {
    const showcase = document.getElementById('janLogoShowcase');
    const logoWrapper = document.getElementById('janLogoWrapper');
    if (!showcase || !logoWrapper) return;

    let targetRotX = 0, targetRotY = 0;
    let curRotX = 0, curRotY = 0;
    let mouseVelX = 0, mouseVelY = 0;
    let lastX = 0, lastY = 0;

    let scrollProgress = 0;
    let targetProgress = 0;

    // Smooth Scroll Progress & Entrance Reveal
    function updateScrollProgress() {
      const rect = showcase.getBoundingClientRect();
      const winH = window.innerHeight;

      if (rect.top < winH && rect.bottom > 0) {
        const rawProgress = (winH - rect.top) / (winH + rect.height * 0.5);
        targetProgress = Math.min(Math.max(rawProgress, 0), 1);
      } else if (rect.top >= winH) {
        targetProgress = 0;
      } else if (rect.bottom <= 0) {
        targetProgress = 1;
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Cursor Parallax & Velocity Tracking
    showcase.addEventListener('mousemove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      targetRotY = normX * 12;
      targetRotX = -normY * 12;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      mouseVelX = Math.min(Math.max(dx * 0.08, -4), 4);
      mouseVelY = Math.min(Math.max(dy * 0.08, -4), 4);

      lastX = e.clientX;
      lastY = e.clientY;
    });

    showcase.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      mouseVelX = 0;
      mouseVelY = 0;
    });

    // Render Motion Engine Loop
    function renderJanLogo() {
      scrollProgress += (targetProgress - scrollProgress) * 0.08;
      curRotX += (targetRotX - curRotX) * 0.08;
      curRotY += (targetRotY - curRotY) * 0.08;

      mouseVelX *= 0.92;
      mouseVelY *= 0.92;

      const easeP = 1 - Math.pow(1 - scrollProgress, 3);
      const scaleVal = 0.85 + 0.15 * easeP;
      const opacityVal = Math.min(easeP * 1.2, 1.0);
      const blurVal = (1 - easeP) * 10;

      const totalRotX = curRotX + mouseVelY * 0.6;
      const totalRotY = curRotY + mouseVelX * 0.6;

      logoWrapper.style.opacity = opacityVal.toFixed(3);
      logoWrapper.style.filter = blurVal <= 0.2 ? 'none' : `blur(${blurVal.toFixed(1)}px)`;
      logoWrapper.style.transform = `perspective(1000px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) scale(${scaleVal.toFixed(3)})`;

      requestAnimationFrame(renderJanLogo);
    }

    requestAnimationFrame(renderJanLogo);
  }

  // Initialize JAN VISUAL PRODUCTION Logo Engine
  initJanLogoStudioShowcase();

  /* ==========================================================================
     CINEMATIC FLUID MOTION BACKGROUND ENGINE (Aerodynamic Ribbons & Light Shaders)
     Inspired by high-performance creative & motorsport motion design
     ========================================================================== */
  function initCinematicMotionBackground() {
    const canvas = document.getElementById('motionBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Interaction states
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let mouseVelocity = 0, targetMouseVelocity = 0;
    let lastRawMouseX = 0, lastRawMouseY = 0;
    let lastMouseMoveTime = 0;

    let scrollY = 0;
    let targetScrollY = 0;

    // Time ticker
    let time = 0;
    let isTabVisible = true;

    // 5 multi-depth aerodynamic ribbons (organic undulating contour layers)
    const ribbons = [
      {
        yBase: 0.22,
        amplitude: 55,
        freq: 0.0016,
        speed: 0.00065,
        depth: 0.45,
        thickness: 90,
        fillGradient: [
          [0.0, 'rgba(28, 30, 40, 0.35)'],
          [0.6, 'rgba(16, 17, 24, 0.18)'],
          [1.0, 'rgba(8, 9, 12, 0.0)']
        ],
        contourColor: 'rgba(255, 255, 255, 0.08)',
        contourWidth: 1.0,
        hasLimeAccent: false
      },
      {
        yBase: 0.42,
        amplitude: 75,
        freq: 0.0013,
        speed: 0.00085,
        depth: 0.7,
        thickness: 120,
        fillGradient: [
          [0.0, 'rgba(32, 36, 48, 0.4)'],
          [0.5, 'rgba(18, 20, 28, 0.2)'],
          [1.0, 'rgba(6, 7, 10, 0.0)']
        ],
        contourColor: 'rgba(215, 255, 0, 0.16)', // Electric Lime Accent Ribbon
        contourWidth: 1.5,
        glowColor: 'rgba(215, 255, 0, 0.25)',
        glowBlur: 10,
        hasLimeAccent: true
      },
      {
        yBase: 0.60,
        amplitude: 65,
        freq: 0.0018,
        speed: 0.00075,
        depth: 0.55,
        thickness: 110,
        fillGradient: [
          [0.0, 'rgba(22, 24, 34, 0.32)'],
          [0.7, 'rgba(12, 13, 18, 0.14)'],
          [1.0, 'rgba(6, 6, 8, 0.0)']
        ],
        contourColor: 'rgba(200, 210, 230, 0.10)',
        contourWidth: 1.0,
        hasLimeAccent: false
      },
      {
        yBase: 0.78,
        amplitude: 85,
        freq: 0.0011,
        speed: 0.00095,
        depth: 0.9,
        thickness: 140,
        fillGradient: [
          [0.0, 'rgba(36, 40, 52, 0.42)'],
          [0.5, 'rgba(20, 22, 30, 0.22)'],
          [1.0, 'rgba(6, 7, 9, 0.0)']
        ],
        contourColor: 'rgba(215, 255, 0, 0.20)', // Second subtle Electric Lime accent
        contourWidth: 1.2,
        glowColor: 'rgba(215, 255, 0, 0.22)',
        glowBlur: 8,
        hasLimeAccent: true
      },
      {
        yBase: 0.92,
        amplitude: 50,
        freq: 0.0022,
        speed: 0.0006,
        depth: 0.35,
        thickness: 80,
        fillGradient: [
          [0.0, 'rgba(20, 22, 28, 0.28)'],
          [1.0, 'rgba(4, 5, 6, 0.0)']
        ],
        contourColor: 'rgba(255, 255, 255, 0.06)',
        contourWidth: 0.8,
        hasLimeAccent: false
      }
    ];

    // Ambient floating light blooms
    const lightBlooms = [
      { xNorm: 0.25, yNorm: 0.35, rad: 520, color: 'rgba(215, 255, 0, 0.032)', speedX: 0.0003, speedY: 0.00025, phase: 0 },
      { xNorm: 0.78, yNorm: 0.65, rad: 620, color: 'rgba(70, 95, 140, 0.038)', speedX: -0.00022, speedY: 0.00035, phase: 2.1 },
      { xNorm: 0.50, yNorm: 0.85, rad: 480, color: 'rgba(215, 255, 0, 0.024)', speedX: 0.00028, speedY: -0.0002, phase: 4.2 }
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Mouse movement listener (parallax & velocity)
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      const dt = Math.max(now - lastMouseMoveTime, 16);

      const rawX = e.clientX;
      const rawY = e.clientY;

      const dist = Math.hypot(rawX - lastRawMouseX, rawY - lastRawMouseY);
      const instantVel = Math.min(dist / dt, 3.5);

      targetMouseVelocity = instantVel;
      targetMouseX = ((rawX / width) - 0.5) * 2;
      targetMouseY = ((rawY / height) - 0.5) * 2;

      lastRawMouseX = rawX;
      lastRawMouseY = rawY;
      lastMouseMoveTime = now;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
      targetMouseVelocity = 0;
    });

    // Scroll listener
    function onScroll() {
      targetScrollY = window.scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Tab visibility handling
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !prefersReducedMotion) {
        lastMouseMoveTime = performance.now();
        render();
      }
    });

    // Main render loop
    function render() {
      if (!isTabVisible) return;

      time += 1.0;

      // Smooth interpolation for mouse and scroll
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;
      mouseVelocity += (targetMouseVelocity - mouseVelocity) * 0.08;
      targetMouseVelocity *= 0.94;

      scrollY += (targetScrollY - scrollY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw diffused floating ambient light blooms
      lightBlooms.forEach((bloom) => {
        const driftX = Math.sin(time * bloom.speedX + bloom.phase) * (width * 0.12);
        const driftY = Math.cos(time * bloom.speedY + bloom.phase) * (height * 0.10);

        const centerX = bloom.xNorm * width + driftX + mouseX * 25;
        const centerY = bloom.yNorm * height + driftY + mouseY * 20;

        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, bloom.rad);
        grad.addColorStop(0, bloom.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bloom.rad, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dynamic wave excitement from cursor velocity
      const velocityBoost = 1.0 + Math.min(mouseVelocity * 0.15, 0.25);

      // 2. Draw organic aerodynamic ribbons and glowing contour lines
      ribbons.forEach((ribbon, rIdx) => {
        const depth = ribbon.depth;
        const parallaxX = mouseX * (45 * depth);
        const parallaxY = mouseY * (35 * depth);

        // Smooth scroll parallax progression
        const scrollOffset = (scrollY * 0.09 * depth);
        const baseCenterY = ribbon.yBase * height + parallaxY - (scrollOffset % (height * 0.6));

        // Generate points across canvas
        const step = width < 768 ? 48 : 36;
        const points = [];
        const t = time * ribbon.speed;

        for (let x = -50; x <= width + 50; x += step) {
          const xPhase = (x + parallaxX) * ribbon.freq;
          const scrollPhase = scrollY * 0.00035 * depth;

          // Multi-frequency harmonic wave formula
          const wave1 = Math.sin(xPhase + t + scrollPhase) * (ribbon.amplitude * velocityBoost);
          const wave2 = Math.cos(xPhase * 1.6 - t * 0.85 + rIdx) * (ribbon.amplitude * 0.35 * velocityBoost);
          const wave3 = Math.sin(xPhase * 0.6 + t * 0.5) * (ribbon.amplitude * 0.2);

          const yTop = baseCenterY + wave1 + wave2 + wave3;
          const localThickness = ribbon.thickness * (0.8 + 0.3 * Math.sin(xPhase * 0.8 + t * 0.4));
          const yBottom = yTop + localThickness;

          points.push({ x, yTop, yBottom });
        }

        if (points.length < 2) return;

        // Draw translucent ribbon body
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].yTop);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].yTop + points[i + 1].yTop) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].yTop, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].yTop);

        // Draw bottom curve in reverse
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].yBottom);
        for (let i = points.length - 1; i > 0; i--) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].yBottom + points[i - 1].yBottom) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].yBottom, xc, yc);
        }
        ctx.closePath();

        // Create vertical gradient for ribbon fill
        const fillGrad = ctx.createLinearGradient(0, baseCenterY - ribbon.amplitude, 0, baseCenterY + ribbon.thickness + ribbon.amplitude);
        ribbon.fillGradient.forEach(([stop, col]) => fillGrad.addColorStop(stop, col));
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Draw elegant glowing contour line along ribbon top crest
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].yTop);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].yTop + points[i + 1].yTop) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].yTop, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].yTop);

        ctx.strokeStyle = ribbon.contourColor;
        ctx.lineWidth = ribbon.contourWidth;

        if (ribbon.glowColor) {
          ctx.shadowColor = ribbon.glowColor;
          ctx.shadowBlur = ribbon.glowBlur;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(render);
      }
    }

    render();
  }

  // Initialize Cinematic Motion Background Engine
  initCinematicMotionBackground();

});

