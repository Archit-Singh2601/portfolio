/* ==========================================================================
   APP.JS — INTERACTIVE LOGIC & SHOWCASE ENGINE
   Unclutter AI Pipeline Simulator, Dual-Nature Poetry & Photography,
   Cyber-Terminal Emulator, Web Audio Feedback, and Accessible Navigation.
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     Web Audio Sound FX (Low-Gravity Ambient & Tactile Feedback)
     ========================================================================== */
  const audioContext = window.AudioContext || window.webkitAudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
  let soundEnabled = true;

  function playTone(freq, type = 'sine', duration = 0.15, vol = 0.08) {
    if (!audioContext || !soundEnabled) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      gain.gain.setValueAtTime(vol, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playGravityChime(isZeroG) {
    if (!soundEnabled) return;
    if (isZeroG) {
      // Ascending ethereal chime
      playTone(280, 'sine', 0.2, 0.05);
      setTimeout(() => playTone(440, 'sine', 0.3, 0.06), 90);
      setTimeout(() => playTone(660, 'triangle', 0.4, 0.04), 180);
    } else {
      // Descending solid dock sound
      playTone(520, 'triangle', 0.15, 0.06);
      setTimeout(() => playTone(330, 'sine', 0.25, 0.07), 80);
      setTimeout(() => playTone(165, 'sine', 0.35, 0.09), 160);
    }
  }

  /* ==========================================================================
     Gravity Switch Widget Handler
     ========================================================================== */
  function setupGravitySwitch() {
    const switchWidget = document.getElementById('gravity-switch-toggle');
    if (!switchWidget) return;

    switchWidget.addEventListener('click', function () {
      if (window.AntiGravityPhysics) {
        window.AntiGravityPhysics.toggleGravity();
        const currentMode = window.AntiGravityPhysics.getState().isZeroG;
        playGravityChime(currentMode);
      }
    });

    // Keyboard shortcut 'G' to toggle gravity
    window.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        if (window.AntiGravityPhysics) {
          window.AntiGravityPhysics.toggleGravity();
          playGravityChime(window.AntiGravityPhysics.getState().isZeroG);
        }
      }
    });
  }

  /* ==========================================================================
     Accessible Top Navigation Snap & Scroll
     ========================================================================== */
  function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-item a, .hero-cta-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        // When navigating, automatically dock cards into Grid Dock Mode for seamless reading
        if (window.AntiGravityPhysics) {
          window.AntiGravityPhysics.setMode(false);
          playTone(420, 'sine', 0.15, 0.05);
        }

        // Smooth scroll to target
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
      });
    });

    // Mobile nav toggle
    const mobileBtn = document.querySelector('.mobile-nav-btn');
    const navLinksList = document.querySelector('.nav-links');
    if (mobileBtn && navLinksList) {
      mobileBtn.addEventListener('click', () => {
        navLinksList.classList.toggle('open');
      });
    }
  }

  /* ==========================================================================
     "Unclutter" Innovation Hub — AI Back-Office Interactive Simulator
     ========================================================================== */
  const UNCLUTTER_PRESETS = [
    {
      id: 'whatsapp-order',
      label: 'WhatsApp Bulk Order',
      rawText: 'Bhaiya urgent send 50 bags Ultratech Cement and 200m 12mm TMT steel bars to Sector 18 construction site by 4pm today. Bill to Sharma Constructions GSTIN 07AAAAA0000A1Z5. Adv payment transferred.',
      parsed: {
        customer: 'Sharma Constructions',
        gstin: '07AAAAA0000A1Z5',
        deliveryAddress: 'Sector 18 Construction Site',
        urgency: 'HIGH (Deliver by 16:00)',
        items: [
          { name: 'Ultratech Cement (50kg bag)', qty: 50, rate: 380, total: 19000 },
          { name: '12mm TMT Steel Bars', qty: 200, unit: 'm', rate: 85, total: 17000 }
        ],
        subtotal: 36000,
        gst18: 6480,
        grandTotal: 42480,
        status: 'VERIFIED & INVOICED'
      }
    },
    {
      id: 'messy-audio',
      label: 'Messy Voice Note',
      rawText: 'Hey Archit, please deliver 15 boxes Alphonso mangoes, 10 crates organic apples, and 2 sacks raw California almonds. Payment via UPI on delivery to Patel Gourmet Mart, Bandra West.',
      parsed: {
        customer: 'Patel Gourmet Mart',
        gstin: '27AABCP1234F1Z9',
        deliveryAddress: 'Bandra West, Mumbai',
        urgency: 'Standard Delivery',
        items: [
          { name: 'Alphonso Mangoes (Grade A)', qty: 15, rate: 1200, total: 18000 },
          { name: 'Organic Apples (Crater)', qty: 10, rate: 950, total: 9500 },
          { name: 'California Almonds (25kg sack)', qty: 2, rate: 14000, total: 28000 }
        ],
        subtotal: 55500,
        gst5: 2775,
        grandTotal: 58275,
        status: 'VERIFIED & INVOICED'
      }
    },
    {
      id: 'service-memo',
      label: 'B2B Cloud Dispatch',
      rawText: 'Urgent service ticket #9041: Deploy 4 GPU compute instances for AI inference fine-tuning cluster. PO number PO-2026-IND-88. Client: NeuralScale Labs. Delivery SLA 2 hours.',
      parsed: {
        customer: 'NeuralScale Labs',
        gstin: '29AABCN5566K1Z2',
        deliveryAddress: 'Bengaluru DC-1 Cluster',
        urgency: 'CRITICAL (2hr SLA)',
        items: [
          { name: 'NVIDIA H100 80GB Cloud Node (Hourly)', qty: 4, rate: 2800, total: 11200 },
          { name: 'VPC Interconnect & Storage 10TB', qty: 1, rate: 4500, total: 4500 }
        ],
        subtotal: 15700,
        gst18: 2826,
        grandTotal: 18526,
        status: 'VERIFIED & INVOICED'
      }
    }
  ];

  let currentPresetIndex = 0;
  let isSimRunning = false;

  function setupUnclutterSim() {
    const inputBox = document.getElementById('unclutter-input');
    const outputBox = document.getElementById('unclutter-output');
    const runBtn = document.getElementById('unclutter-run-btn');
    const invoiceBtn = document.getElementById('unclutter-view-invoice');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const steps = document.querySelectorAll('.pipeline-step');

    if (!inputBox || !outputBox || !runBtn) return;

    // Load initial preset
    inputBox.value = UNCLUTTER_PRESETS[0].rawText;
    outputBox.textContent = `// Ready to run pipeline.\n// Select a preset or type unstructured text above.\n// Click "Execute AI Pipeline" to stream live tokens.`;

    presetButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (isSimRunning) return;
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPresetIndex = idx;
        inputBox.value = UNCLUTTER_PRESETS[idx].rawText;
        outputBox.textContent = `// Loaded preset: ${UNCLUTTER_PRESETS[idx].label}\n// Click "Execute AI Pipeline" to process.`;
        playTone(350, 'sine', 0.1, 0.04);
      });
    });

    runBtn.addEventListener('click', () => {
      if (isSimRunning) return;
      runPipelineSimulation(steps, outputBox, invoiceBtn);
    });

    if (invoiceBtn) {
      invoiceBtn.addEventListener('click', () => {
        openInvoiceModal(UNCLUTTER_PRESETS[currentPresetIndex].parsed);
      });
    }
  }

  function runPipelineSimulation(steps, outputBox, invoiceBtn) {
    isSimRunning = true;
    const preset = UNCLUTTER_PRESETS[currentPresetIndex];
    if (invoiceBtn) invoiceBtn.style.display = 'none';

    // Step 1: Raw Ingestion
    setStep(steps, 0);
    playTone(320, 'sine', 0.12, 0.05);
    outputBox.textContent = `[STAGE 1/4] Ingesting raw message stream...\nStream size: ${preset.rawText.length} bytes\nTokenizer: Llama-3 BPE • Latency: 18ms\nParsing syntax & natural language boundaries...`;

    // Step 2: Neural Extraction
    setTimeout(() => {
      setStep(steps, 1);
      playTone(480, 'sine', 0.15, 0.06);
      outputBox.textContent = `[STAGE 2/4] Neural Entity Extraction in progress...\nFound Entities:\n - Customer: "${preset.parsed.customer}"\n - GSTIN: "${preset.parsed.gstin}"\n - Items extracted: ${preset.parsed.items.length}\n - Priority: ${preset.parsed.urgency}\nConfidence Score: 99.4%`;
    }, 850);

    // Step 3: Inventory Validation
    setTimeout(() => {
      setStep(steps, 2);
      playTone(620, 'triangle', 0.15, 0.06);
      outputBox.textContent = `[STAGE 3/4] Inventory & Tax Validation Rule Engine...\n✓ Stock Verified in local warehouse ledger\n✓ GSTIN Active on Government Portal\n✓ Price calculation verified against contract master\n✓ Subtotal: ₹${preset.parsed.subtotal.toLocaleString('en-IN')}`;
    }, 1700);

    // Step 4: Invoice Output & ERP Webhook
    setTimeout(() => {
      setStep(steps, 3);
      playTone(880, 'sine', 0.35, 0.08);
      outputBox.textContent = JSON.stringify(preset.parsed, null, 2);
      if (invoiceBtn) {
        invoiceBtn.style.display = 'inline-flex';
      }
      isSimRunning = false;
      if (window.AntiGravityPhysics) {
        window.AntiGravityPhysics.createImpact(window.innerWidth / 2, window.innerHeight / 2, '#00ff88');
      }
    }, 2600);
  }

  function setStep(steps, activeIndex) {
    steps.forEach((step, idx) => {
      step.classList.remove('active');
      if (idx <= activeIndex) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
      if (idx === activeIndex) {
        step.classList.add('active');
      }
    });
  }

  /* Invoice Modal Display */
  function openInvoiceModal(data) {
    const modal = document.getElementById('invoice-modal');
    const content = document.getElementById('invoice-modal-content');
    if (!modal || !content) return;

    let itemsHtml = '';
    data.items.forEach(item => {
      itemsHtml += `
        <div class="invoice-row">
          <span>${item.name} (x${item.qty})</span>
          <span>₹${item.total.toLocaleString('en-IN')}</span>
        </div>
      `;
    });

    content.innerHTML = `
      <div class="invoice-row">
        <strong>BILL TO:</strong>
        <span>${data.customer}</span>
      </div>
      <div class="invoice-row">
        <strong>GSTIN:</strong>
        <span>${data.gstin}</span>
      </div>
      <div class="invoice-row">
        <strong>DELIVERY:</strong>
        <span>${data.deliveryAddress}</span>
      </div>
      <div class="invoice-divider"></div>
      ${itemsHtml}
      <div class="invoice-divider"></div>
      <div class="invoice-row">
        <span>Subtotal:</span>
        <span>₹${data.subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div class="invoice-row">
        <span>Taxes (GST):</span>
        <span>₹${(data.gst18 || data.gst5 || 0).toLocaleString('en-IN')}</span>
      </div>
      <div class="invoice-divider"></div>
      <div class="invoice-row invoice-total">
        <span>TOTAL AMOUNT DUE:</span>
        <span>₹${data.grandTotal.toLocaleString('en-IN')}</span>
      </div>
    `;

    modal.classList.add('open');
    playTone(550, 'sine', 0.2, 0.06);
  }

  function setupModals() {
    const modal = document.getElementById('invoice-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal) modal.classList.remove('open');
    });
  }

  /* ==========================================================================
     Dual-Nature Canvas: Hindi-Urdu Poetry & Photography Switcher
     ========================================================================== */
  const POETRY_DATA = [
    {
      author: 'Archit Singh — Original',
      hindi: 'सन्नाटे में जब अल्गोरिदम सांस लेते हैं,\nहम कोड के ज़रिए कायनात तराशते हैं।',
      roman: 'Sannaate mein jab algorithm saans lete hain,\nHum code ke zariye qaaynaat taraashte hain.',
      translation: 'When algorithms breathe in the silence of the night,\nThrough lines of code, we sculpt the cosmos.'
    },
    {
      author: 'Faiz Ahmad Faiz',
      hindi: 'बोल कि लब आज़ाद हैं तेरे,\nबोल ज़बाँ अब तक तेरी है।',
      roman: 'Bol ke lab aazaad hain tere,\nBol zabaan ab tak teri hai.',
      translation: 'Speak, for your lips are yet free;\nSpeak, for your tongue is still your own.'
    },
    {
      author: 'Mirza Ghalib',
      hindi: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले,\nबहुत निकले मिरे अरमान लेकिन फिर भी कम निकले।',
      roman: 'Hazaaron khwaahishein aisi ke har khwaahish pe dam nikle,\nBahut nikle mere armaan lekin phir bhi kam nikle.',
      translation: 'Thousands of yearnings, each one worth dying for;\nSo many desires fulfilled, yet how unfulfilled I remain.'
    }
  ];

  const PHOTO_DATA = [
    {
      title: 'Monochrome Stillness',
      specs: '35mm • f/1.8 • 1/320s • ISO 200',
      svgPattern: 'url(#sumi-ink-pattern)'
    },
    {
      title: 'Cyber-Urban Solitude (2 AM)',
      specs: '50mm • f/1.4 • 1/125s • ISO 800',
      svgPattern: 'url(#cyber-rain-pattern)'
    },
    {
      title: 'Himalayan Ridge & Cloudbreak',
      specs: '24mm • f/8.0 • 1/1000s • ISO 100',
      svgPattern: 'url(#mountain-haze-pattern)'
    }
  ];

  function setupDualNature() {
    const tabs = document.querySelectorAll('.poetry-tab-btn');
    const poemHindi = document.querySelector('.poem-hindi');
    const poemRoman = document.querySelector('.poem-roman');
    const poemTrans = document.querySelector('.poem-translation');
    const photoFrame = document.querySelector('.photo-frame');
    const photoTitle = document.querySelector('.photo-title');
    const photoSpecs = document.querySelector('.photo-specs');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update Poem
        const p = POETRY_DATA[index];
        if (poemHindi) poemHindi.innerHTML = p.hindi.replace(/\n/g, '<br/>');
        if (poemRoman) poemRoman.innerHTML = p.roman.replace(/\n/g, '<br/>');
        if (poemTrans) poemTrans.textContent = `"${p.translation}"`;

        // Update Photo specs
        const photo = PHOTO_DATA[index];
        if (photoTitle) photoTitle.textContent = photo.title;
        if (photoSpecs) photoSpecs.textContent = photo.specs;

        // Change photo visual filter/canvas
        const svgRect = document.getElementById('photo-svg-rect');
        if (svgRect) {
          svgRect.setAttribute('fill', photo.svgPattern);
        }

        playTone(450, 'sine', 0.15, 0.04);
      });
    });
  }

  /* ==========================================================================
     Contact Dock Terminal Emulator
     ========================================================================== */
  function setupTerminal() {
    const termScreen = document.getElementById('terminal-screen');
    const termInput = document.getElementById('terminal-input');
    const shortcutPills = document.querySelectorAll('.cmd-pill');

    if (!termScreen || !termInput) return;

    function appendOutput(cmd, response) {
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `
        <div><span class="term-prompt">archit@antigravity:~$</span> <span style="color:#fff">${cmd}</span></div>
        <div class="term-output">${response}</div>
      `;
      termScreen.appendChild(line);
      termScreen.scrollTop = termScreen.scrollHeight;
      playTone(600, 'sine', 0.08, 0.04);
    }

    function processCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      switch (cmd) {
        case 'help':
          appendOutput(rawCmd, `Available commands:
  • <span style="color:var(--neon-green)">about</span>        : Who is Archit Singh?
  • <span style="color:var(--neon-green)">skills</span>       : Core technical arsenal & mastery
  • <span style="color:var(--neon-green)">unclutter</span>    : Launch Unclutter AI Pipeline
  • <span style="color:var(--neon-green)">poetry</span>       : Recite philosophical Urdu verse
  • <span style="color:var(--neon-green)">gravity</span>      : Toggle Zero-G floating mode
  • <span style="color:var(--neon-green)">email</span>        : Direct mail link
  • <span style="color:var(--neon-green)">socials</span>      : GitHub, LinkedIn, X profiles
  • <span style="color:var(--neon-green)">clear</span>        : Clear terminal output`);
          break;

        case 'about':
          appendOutput(rawCmd, `Archit Singh — Computer Science student specializing in AI, Software Development, and Entrepreneurship. Passionate about building back-office intelligence (Unclutter), algorithmic systems, and bridging deep technical rigor with real-world business utility.`);
          break;

        case 'skills':
          appendOutput(rawCmd, `Core Stack:
  [AI / ML]     : PyTorch, LangChain, RAG Architecture, LLM Fine-Tuning
  [Languages]   : Python, C, JavaScript (ESNext), TypeScript, SQL
  [Web & Infra] : React.js, TailwindCSS, Node.js, REST APIs, Docker, Linux, Git
  [DSA]         : 350+ Problems Solved (Graph Theory, Dynamic Programming, Trees)`);
          break;

        case 'unclutter':
          appendOutput(rawCmd, `Navigating to Unclutter AI Pipeline simulator...`);
          const unclutterCard = document.getElementById('card-unclutter');
          if (unclutterCard) {
            if (window.AntiGravityPhysics) window.AntiGravityPhysics.setMode(false);
            unclutterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          break;

        case 'poetry':
          const randPoem = POETRY_DATA[Math.floor(Math.random() * POETRY_DATA.length)];
          appendOutput(rawCmd, `<em>"${randPoem.hindi.replace(/\n/g, ' / ')}"</em><br/><span style="color:var(--neon-green)">— ${randPoem.author}</span>`);
          break;

        case 'gravity':
          if (window.AntiGravityPhysics) {
            window.AntiGravityPhysics.toggleGravity();
            const isZ = window.AntiGravityPhysics.getState().isZeroG;
            appendOutput(rawCmd, `Gravity state shifted. Active mode: <strong>${isZ ? 'Zero-G Playground' : 'Bento Grid Dock'}</strong>`);
          }
          break;

        case 'email':
          appendOutput(rawCmd, `Opening mailto link: <a href="mailto:archit@example.com" style="color:var(--neon-green)">archit.singh@gmail.com</a>`);
          window.location.href = 'mailto:archit.singh@gmail.com';
          break;

        case 'socials':
          appendOutput(rawCmd, `Profiles:
  • GitHub   : <a href="https://github.com" target="_blank" style="color:var(--neon-green)">github.com/archit-singh</a>
  • LinkedIn : <a href="https://linkedin.com" target="_blank" style="color:var(--neon-green)">linkedin.com/in/archit-singh</a>
  • X        : <a href="https://x.com" target="_blank" style="color:var(--neon-green)">@architsingh</a>`);
          break;

        case 'clear':
          termScreen.innerHTML = '';
          break;

        case 'sudo hire archit':
          appendOutput(rawCmd, `<span style="color:var(--neon-green);font-weight:700">[OFFER ACCEPTED]</span> Archit Singh has joined your team! Preparing high-impact engineering roadmap... Emailing confirmation.`);
          break;

        default:
          appendOutput(rawCmd, `Command not found: '${rawCmd}'. Type <span style="color:var(--neon-green)">help</span> for available commands.`);
          break;
      }
    }

    termInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const val = this.value;
        this.value = '';
        processCommand(val);
      }
    });

    shortcutPills.forEach(pill => {
      pill.addEventListener('click', function () {
        const cmd = this.getAttribute('data-cmd') || this.textContent.trim();
        processCommand(cmd);
      });
    });

    // Keyboard 'T' to focus terminal
    window.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        termInput.focus();
        termInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ==========================================================================
     Tech Arsenal Pill Interactions (Bouncing & Fling effects)
     ========================================================================== */
  function setupArsenalPills() {
    const pills = document.querySelectorAll('.tech-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', function () {
        playTone(650, 'sine', 0.1, 0.05);
        this.style.transform = 'scale(1.2) rotate(' + (Math.random() * 14 - 7) + 'deg)';
        setTimeout(() => {
          this.style.transform = '';
        }, 220);

        if (window.AntiGravityPhysics) {
          const rect = this.getBoundingClientRect();
          window.AntiGravityPhysics.createImpact(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00ff88');
        }
      });
    });
  }

  /* ==========================================================================
     Telemetry Real-time Clocks & Ping Tracker
     ========================================================================== */
  function updateTelemetry() {
    const pingEl = document.getElementById('telemetry-ping');
    if (pingEl) {
      // Realistic micro-jitter between 21ms and 28ms
      setInterval(() => {
        const ping = Math.floor(Math.random() * 7) + 21;
        pingEl.textContent = `${ping}ms`;
      }, 3500);
    }
  }

  /* ==========================================================================
     Init Lifecycle
     ========================================================================== */
  function init() {
    setupGravitySwitch();
    setupNavLinks();
    setupUnclutterSim();
    setupModals();
    setupDualNature();
    setupTerminal();
    setupArsenalPills();
    updateTelemetry();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
