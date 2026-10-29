# Archit Singh — Anti-Gravity Portfolio

An interactive, zero-gravity personal portfolio web application built with vanilla **HTML5**, **CSS3**, and high-performance **2D Canvas Physics**.

---

## 🌌 Visual Theme & Concept
- **Atmosphere**: Deep ink-wash / Sumi-e fluid backdrop fused with cybernetic zero-gravity physics.
- **Palette**: Deep Ink Black (`#090a0f`), Traditional Crimson Seal Red (`#e63946`), and Luminous Neon Green (`#00ff88`).
- **Core Experience**: A dual-mode interactive canvas where matter cards and tech stack pills drift in zero-G with drag-and-fling mechanics, or spring-snap into a clean Bento Grid layout via the floating **Gravity Switch**.

---

## 🚀 How to Run Locally

Because the application is built entirely with clean, vanilla web standards (no Node build step, no npm packages, no heavy React/Next.js setup required), you can run it immediately:

### Option 1: Direct File Open
Simply double-click `index.html` or open it directly in any modern browser (Chrome, Safari, Firefox, Edge, Arc):
```bash
open index.html
```

### Option 2: Local HTTP Server (Optional)
If you prefer running through a local server:
```bash
# Python 3
python3 -m http.server 3000

# or Node / npx
npx serve .
```
Then visit `http://localhost:3000`.

---

## 🎮 Key Interactive Controls
- **Gravity Switch**: Click the floating pill in the bottom-right corner (or press <kbd>G</kbd>) to toggle between **Zero-G Mode** (cards drift and fling) and **Grid Dock Mode** (structured Bento Grid).
- **Drag & Fling**: In Zero-G mode, click/touch any card or pill and fling it across the viewport. Cards bounce off screen edges with neon shockwave ripples.
- **Mouse Repulsion**: Floating cards and background ink droplets gently drift away from your cursor.
- **Scroll Buoyancy**: Scrolling imparts momentum to drifting elements.
- **"Unclutter" AI Simulator**: Click sample scenarios (WhatsApp bulk order, voice note, B2B dispatch) and run the 4-stage neural pipeline to generate verified GST invoices.
- **Terminal Emulator**: Press <kbd>T</kbd> to focus the terminal, or run commands like `about`, `skills`, `unclutter`, `poetry`, `gravity`, `socials`, `email`, or `sudo hire archit`.
- **Dual-Nature Canvas**: Toggle Hindi-Urdu poetry excerpts (Archit original, Faiz, Ghalib) and view cinematic photography frames with camera telemetry.
- **Accessible Top Navigation**: Clicking any section automatically engages Grid Dock mode and smoothly navigates to that card.

---

## 📂 File Architecture
- `index.html`: Semantic markup containing all 7 Bento cards, navigation, terminal, modal, and canvas.
- `style.css`: Responsive CSS grid, Sumi-e gradients, neon glows, glassmorphism, and responsive breakpoints.
- `physics.js`: 60fps 2D physics engine (zero-G drift, drag & fling, wall bounce, spring docking, particle dust).
- `app.js`: Interactive feature logic (Unclutter simulator, audio feedback, poetry switcher, terminal CLI).
