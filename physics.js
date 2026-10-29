/* ==========================================================================
   ANTI-GRAVITY PHYSICS ENGINE & SUMI-E INK CANVAS
   Zero-G Floating Dynamics, Drag-and-Fling, Boundary Collisions,
   Spring-based Bento Grid Docking, and Mouse Repulsion.
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const state = {
    isZeroG: true, // Start in Zero-G mode as per prompt
    cards: [],
    canvas: null,
    ctx: null,
    width: window.innerWidth,
    height: window.innerHeight,
    pointer: { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, down: false },
    particles: [],
    impactRipples: [],
    lastScrollY: window.scrollY,
    scrollVelocity: 0,
    animationFrameId: null,
    container: null,
  };

  // Configuration Constants
  const CONFIG = {
    PARTICLE_COUNT: 45,
    ZERO_G_DAMPING: 0.988,
    ANGULAR_DAMPING: 0.96,
    RESTITUTION: 0.68, // Bounciness against walls
    GRAVITY: 0.035, // Micro-buoyancy / gentle downward/upward drift
    SPRING_STIFFNESS: 0.08,
    SPRING_DAMPING: 0.82,
    REPULSION_RADIUS: 180,
    REPULSION_FORCE: 0.35,
  };

  /* ==========================================================================
     Canvas & Particle System (Ink-Wash & Collision Dust)
     ========================================================================== */
  function initCanvas() {
    state.canvas = document.getElementById('ink-canvas');
    if (!state.canvas) return;
    state.ctx = state.canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Populate ambient Sumi-e ink droplets
    state.particles = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      state.particles.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.8 + 1,
        color: Math.random() > 0.3 ? 'rgba(0, 255, 136, ' + (Math.random() * 0.35 + 0.1) + ')' : 'rgba(230, 57, 70, ' + (Math.random() * 0.35 + 0.1) + ')',
        baseAlpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function resizeCanvas() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    if (state.canvas) {
      state.canvas.width = state.width;
      state.canvas.height = state.height;
    }
  }

  // Trigger collision ink dispersion shockwave
  function createCollisionEffect(x, y, color = '#00ff88') {
    state.impactRipples.push({
      x: x,
      y: y,
      radius: 4,
      maxRadius: Math.random() * 40 + 35,
      alpha: 0.85,
      color: color,
    });

    // Spawn 6-10 spark dust particles
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      state.impactRipples.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        isSpark: true,
        color: color,
      });
    }
  }

  function renderCanvas() {
    const ctx = state.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, state.width, state.height);

    // 1. Draw ambient floating ink particles
    for (let i = 0; i < state.particles.length; i++) {
      const p = state.particles[i];

      // Motion
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges smoothly
      if (p.x < -10) p.x = state.width + 10;
      if (p.x > state.width + 10) p.x = -10;
      if (p.y < -10) p.y = state.height + 10;
      if (p.y > state.height + 10) p.y = -10;

      // Mouse repulsion for ambient particles
      const dx = p.x - state.pointer.x;
      const dy = p.y - state.pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140 && dist > 0) {
        const force = (140 - dist) / 140;
        p.x += (dx / dist) * force * 3;
        p.y += (dy / dist) * force * 3;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Subtle proximity telemetry links
      for (let j = i + 1; j < state.particles.length; j++) {
        const p2 = state.particles[j];
        const pDistX = p.x - p2.x;
        const pDistY = p.y - p2.y;
        const pDist = Math.sqrt(pDistX * pDistX + pDistY * pDistY);
        if (pDist < 85) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${(1 - pDist / 85) * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // 2. Render shockwave ripples and collision sparks
    for (let i = state.impactRipples.length - 1; i >= 0; i--) {
      const r = state.impactRipples[i];
      if (r.isSpark) {
        r.x += r.vx;
        r.y += r.vy;
        r.vx *= 0.94;
        r.vy *= 0.94;
        r.alpha -= 0.025;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fillStyle = r.color === '#00ff88' ? `rgba(0, 255, 136, ${r.alpha})` : `rgba(230, 57, 70, ${r.alpha})`;
        ctx.fill();
      } else {
        r.radius += 1.8;
        r.alpha -= 0.035;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color === '#00ff88' ? `rgba(0, 255, 136, ${r.alpha})` : `rgba(230, 57, 70, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (r.alpha <= 0) {
        state.impactRipples.splice(i, 1);
      }
    }
  }

  /* ==========================================================================
     Matter Card Entity Physics Engine
     ========================================================================== */
  function CardEntity(element, index) {
    this.el = element;
    this.index = index;
    this.x = 0;
    this.y = 0;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.angle = 0;
    this.vAngle = (Math.random() - 0.5) * 0.4;
    this.w = element.offsetWidth || 340;
    this.h = element.offsetHeight || 280;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.history = []; // Position tracking for velocity flings
    this.gridX = 0;
    this.gridY = 0;

    this.initEvents();
  }

  CardEntity.prototype.initEvents = function () {
    const self = this;

    const onPointerDown = function (e) {
      if (!state.isZeroG) return;
      // Do not fling if clicking inside buttons, links, inputs, or textareas
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'button' || tag === 'a' || tag === 'input' || tag === 'textarea' || e.target.closest('.sim-workbench') || e.target.closest('.terminal-window')) {
        return;
      }

      self.isDragging = true;
      self.el.style.zIndex = '50';
      self.el.classList.add('is-dragged');

      const rect = self.el.getBoundingClientRect();
      const contRect = state.container.getBoundingClientRect();

      self.dragOffsetX = e.clientX - rect.left;
      self.dragOffsetY = e.clientY - rect.top;

      self.history = [{ x: e.clientX, y: e.clientY, time: performance.now() }];
      self.vx = 0;
      self.vy = 0;
      self.vAngle = 0;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    const onPointerMove = function (e) {
      if (!self.isDragging || !state.isZeroG) return;

      const contRect = state.container.getBoundingClientRect();
      self.x = e.clientX - contRect.left - self.dragOffsetX;
      self.y = e.clientY - contRect.top - self.dragOffsetY;

      const now = performance.now();
      self.history.push({ x: e.clientX, y: e.clientY, time: now });
      if (self.history.length > 6) self.history.shift();
    };

    const onPointerUp = function (e) {
      if (!self.isDragging) return;
      self.isDragging = false;
      self.el.style.zIndex = '15';
      self.el.classList.remove('is-dragged');

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // Calculate fling launch velocity from recent pointer history
      if (self.history.length >= 2) {
        const first = self.history[0];
        const last = self.history[self.history.length - 1];
        const dt = (last.time - first.time) || 16;
        const dx = last.x - first.x;
        const dy = last.y - first.y;

        // Scale throw velocity sensibly
        self.vx = Math.max(-18, Math.min(18, (dx / dt) * 16));
        self.vy = Math.max(-18, Math.min(18, (dy / dt) * 16));
        self.vAngle = Math.max(-3, Math.min(3, (self.vx * 0.2)));

        // Create launch particle effect
        const contRect = state.container.getBoundingClientRect();
        createCollisionEffect(e.clientX, e.clientY, '#00ff88');
      }
    };

    this.el.addEventListener('pointerdown', onPointerDown);
  };

  CardEntity.prototype.update = function (contWidth, contHeight) {
    if (this.isDragging) {
      this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg) scale(1.025)`;
      return;
    }

    if (state.isZeroG) {
      // 1. Mouse repulsion in Zero-G
      const contRect = state.container.getBoundingClientRect();
      const cardCenterX = this.x + this.w * 0.5 + contRect.left;
      const cardCenterY = this.y + this.h * 0.5 + contRect.top;
      const mdx = cardCenterX - state.pointer.x;
      const mdy = cardCenterY - state.pointer.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < CONFIG.REPULSION_RADIUS && mDist > 0) {
        const force = (CONFIG.REPULSION_RADIUS - mDist) / CONFIG.REPULSION_RADIUS;
        this.vx += (mdx / mDist) * force * CONFIG.REPULSION_FORCE;
        this.vy += (mdy / mDist) * force * CONFIG.REPULSION_FORCE;
        this.vAngle += (Math.random() - 0.5) * force * 0.25;
      }

      // 2. Buoyancy on scroll velocity
      if (Math.abs(state.scrollVelocity) > 0.1) {
        this.vy -= state.scrollVelocity * 0.035;
        this.vAngle += (this.index % 2 === 0 ? 1 : -1) * state.scrollVelocity * 0.015;
      }

      // 3. Gentle oscillatory micro-drift
      this.vy += Math.sin(Date.now() * 0.0015 + this.index) * 0.04;
      this.vx += Math.cos(Date.now() * 0.0012 + this.index) * 0.03;

      // 4. Inertia integration
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.vAngle;

      this.vx *= CONFIG.ZERO_G_DAMPING;
      this.vy *= CONFIG.ZERO_G_DAMPING;
      this.vAngle *= CONFIG.ANGULAR_DAMPING;

      // Damp angle back toward subtle tilt range (-12 to 12 deg)
      this.angle = Math.max(-16, Math.min(16, this.angle));

      // 5. Boundary wall bounce & collision rings
      const minX = 0;
      const maxX = contWidth - this.w;
      const minY = 0;
      const maxY = Math.max(contHeight - this.h, 700);

      const contLeft = contRect.left;
      const contTop = contRect.top;

      if (this.x < minX) {
        this.x = minX;
        this.vx = -this.vx * CONFIG.RESTITUTION;
        this.vAngle = (Math.random() - 0.5) * 1.5;
        createCollisionEffect(contLeft + this.x, contTop + this.y + this.h * 0.5, '#00ff88');
      } else if (this.x > maxX) {
        this.x = maxX;
        this.vx = -this.vx * CONFIG.RESTITUTION;
        this.vAngle = (Math.random() - 0.5) * 1.5;
        createCollisionEffect(contLeft + this.x + this.w, contTop + this.y + this.h * 0.5, '#e63946');
      }

      if (this.y < minY) {
        this.y = minY;
        this.vy = -this.vy * CONFIG.RESTITUTION;
        createCollisionEffect(contLeft + this.x + this.w * 0.5, contTop + this.y, '#00ff88');
      } else if (this.y > maxY) {
        this.y = maxY;
        this.vy = -this.vy * CONFIG.RESTITUTION;
        createCollisionEffect(contLeft + this.x + this.w * 0.5, contTop + this.y + this.h, '#e63946');
      }

      this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0) rotate(${this.angle.toFixed(2)}deg)`;
    } else {
      // GRID DOCK MODE: Spring smoothly to (0, 0, 0deg) relative to grid slot
      if (this.isDocked) {
        return;
      }

      const dX = -this.dockOffsetX;
      const dY = -this.dockOffsetY;
      const dAngle = -this.angle;

      this.vx = (this.vx + dX * CONFIG.SPRING_STIFFNESS) * CONFIG.SPRING_DAMPING;
      this.vy = (this.vy + dY * CONFIG.SPRING_STIFFNESS) * CONFIG.SPRING_DAMPING;
      this.vAngle = (this.vAngle + dAngle * CONFIG.SPRING_STIFFNESS) * CONFIG.SPRING_DAMPING;

      this.dockOffsetX += this.vx;
      this.dockOffsetY += this.vy;
      this.angle += this.vAngle;

      if (Math.abs(this.dockOffsetX) < 0.6 && Math.abs(this.dockOffsetY) < 0.6 && Math.abs(this.vx) < 0.2 && Math.abs(this.vy) < 0.2 && Math.abs(this.angle) < 0.2) {
        this.dockOffsetX = 0;
        this.dockOffsetY = 0;
        this.angle = 0;
        this.isDocked = true;
        this.el.style.transform = '';
      } else {
        this.el.style.transform = `translate3d(${this.dockOffsetX.toFixed(1)}px, ${this.dockOffsetY.toFixed(1)}px, 0) rotate(${this.angle.toFixed(2)}deg)`;
      }
    }
  };

  /* ==========================================================================
     Physics Controller & Mode Management
     ========================================================================== */
  function initPhysics() {
    state.container = document.querySelector('.bento-container');
    if (!state.container) return;

    initCanvas();

    const cardElements = document.querySelectorAll('.matter-card');
    state.cards = [];

    // Measure cards and initialize positions
    cardElements.forEach((el, index) => {
      const card = new CardEntity(el, index);
      card.dockOffsetX = 0;
      card.dockOffsetY = 0;
      card.isDocked = false;
      state.cards.push(card);
    });

    // Set initial layout mode
    if (state.isZeroG) {
      applyZeroGInitialPositions();
    } else {
      applyGridDockMode();
    }

    // Pointer tracking
    window.addEventListener('pointermove', function (e) {
      state.pointer.vx = e.clientX - state.pointer.lastX;
      state.pointer.vy = e.clientY - state.pointer.lastY;
      state.pointer.lastX = e.clientX;
      state.pointer.lastY = e.clientY;
      state.pointer.x = e.clientX;
      state.pointer.y = e.clientY;
    });

    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;
      state.scrollVelocity = currentScrollY - state.lastScrollY;
      state.lastScrollY = currentScrollY;
    });

    window.addEventListener('resize', function () {
      if (!state.isZeroG) {
        applyGridDockMode();
      }
    });

    // Start 60fps main loop
    loop();
  }

  // Calculate scattered, aesthetic Zero-G drift coordinates
  function applyZeroGInitialPositions() {
    document.body.classList.add('zero-g-active');
    document.body.classList.remove('grid-dock-active');

    const contWidth = state.container.offsetWidth || window.innerWidth;

    // Arrange cards with gentle natural offsets in zero-G
    state.cards.forEach((card, i) => {
      card.w = card.el.offsetWidth || 340;
      card.h = card.el.offsetHeight || 280;

      // Staggered zero-gravity coordinates across the space
      let targetX = (i % 2 === 0 ? 30 : contWidth - card.w - 30) + (Math.random() - 0.5) * 40;
      let targetY = 30 + i * (card.h * 0.7) + (Math.random() - 0.5) * 30;

      // Hero stays near the top center
      if (i === 0) {
        targetX = Math.max(20, (contWidth - card.w) / 2);
        targetY = 20;
      }

      card.x = Math.max(10, Math.min(contWidth - card.w - 10, targetX));
      card.y = Math.max(10, targetY);
      card.vx = (Math.random() - 0.5) * 0.8;
      card.vy = (Math.random() - 0.5) * 0.6;
      card.angle = (Math.random() - 0.5) * 6;
      card.vAngle = (Math.random() - 0.5) * 0.15;
      card.isDocked = false;
    });
  }

  function applyGridDockMode() {
    document.body.classList.add('grid-dock-active');
    document.body.classList.remove('zero-g-active');

    // For each card, calculate offset from its current floating position to its grid slot
    state.cards.forEach(card => {
      const currentX = card.x;
      const currentY = card.y;
      
      // Temporarily clear transform to read natural layout offset
      card.el.style.transform = '';
      const gridSlotX = card.el.offsetLeft;
      const gridSlotY = card.el.offsetTop;

      card.dockOffsetX = currentX - gridSlotX;
      card.dockOffsetY = currentY - gridSlotY;
      card.isDocked = false;
      card.vx = (Math.random() - 0.5) * 2;
      card.vy = (Math.random() - 0.5) * 2;

      // Retain visual position before spring kicks in
      card.el.style.transform = `translate3d(${card.dockOffsetX.toFixed(1)}px, ${card.dockOffsetY.toFixed(1)}px, 0) rotate(${card.angle.toFixed(2)}deg)`;
    });
  }

  function applyZeroGMode() {
    const contRect = state.container.getBoundingClientRect();

    // Read current positions
    state.cards.forEach(card => {
      const rect = card.el.getBoundingClientRect();
      card.x = rect.left - contRect.left;
      card.y = rect.top - contRect.top;
      card.w = card.el.offsetWidth;
      card.h = card.el.offsetHeight;
      card.angle = 0;
      card.vx = (Math.random() - 0.5) * 1.5;
      card.vy = -Math.random() * 2.2 - 0.6; // Gentle upward lift off grid
      card.vAngle = (Math.random() - 0.5) * 0.4;
      card.isDocked = false;
    });

    document.body.classList.add('zero-g-active');
    document.body.classList.remove('grid-dock-active');

    state.cards.forEach(card => {
      card.el.style.transform = `translate3d(${card.x.toFixed(1)}px, ${card.y.toFixed(1)}px, 0) rotate(0deg)`;
    });
  }

  // Toggle between Zero-G & Grid Dock
  function setMode(zeroG) {
    state.isZeroG = zeroG;
    if (state.isZeroG) {
      applyZeroGMode();
      updateSwitchUI('ZERO-G PLAYGROUND', 'Free Float Active');
    } else {
      applyGridDockMode();
      updateSwitchUI('GRID DOCK MODE', 'Bento Alignment Locked');
    }
  }

  function toggleGravity() {
    setMode(!state.isZeroG);
  }

  function updateSwitchUI(mainText, subText) {
    const mainLabel = document.querySelector('.switch-status-label');
    const subLabel = document.querySelector('.switch-sub-label');
    if (mainLabel) mainLabel.textContent = mainText;
    if (subLabel) subLabel.textContent = subText;
  }

  // Main 60fps Loop
  function loop() {
    renderCanvas();

    if (state.container) {
      const contWidth = state.container.offsetWidth || window.innerWidth;
      const contHeight = Math.max(state.container.offsetHeight, 1300);

      for (let i = 0; i < state.cards.length; i++) {
        state.cards[i].update(contWidth, contHeight);
      }
    }

    // Scroll decay
    state.scrollVelocity *= 0.9;

    state.animationFrameId = requestAnimationFrame(loop);
  }

  // Expose API on window for app.js and buttons
  window.AntiGravityPhysics = {
    init: initPhysics,
    setMode: setMode,
    toggleGravity: toggleGravity,
    getState: () => state,
    createImpact: createCollisionEffect,
    recordGridSlots: recordGridSlots,
  };

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhysics);
  } else {
    initPhysics();
  }
})();
