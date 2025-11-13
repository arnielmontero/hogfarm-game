```markdown
# HogFarm — Frontend Practice README

Purpose
- A compact, practical set of docs and practice tasks so you can learn the rendering library (PIXI.js or Phaser) and prepare before starting the frontend sprints.
- Use this to spin up a local practice project, complete exercises, and produce small demo features that will later be moved into the real project.

What you will learn
- Setting up a local dev environment (Vite + npm)
- Basic rendering: sprites, textures, atlases
- Animation: AnimatedSprite / frame animations
- Interaction: pointer events, drag/drop, tap/long-press
- Camera: pan & zoom (pixi-viewport or Phaser camera)
- Scene management and layering
- Particles & simple effects
- Basic asset optimization and sprite atlas usage
- Integrating canvas with DOM overlays (HUD)
- Mocking API calls and optimistic UI reconciliation

Pick your stack
- PIXI.js — lower-level, excellent if you want full control. Recommended if you want to implement custom rendering systems.
- Phaser 3 — higher-level game framework with built-in helpers (scenes, tweens, asset loader). Recommended if you want to move faster and use built-in game features.

Recommended schedule (10–14 days)
- Days 1–3: Setup + Hello World + Sprites & Animation
- Days 4–6: Input + Drag & Drop + Camera panning/zooming
- Days 7–9: Particles, atlas usage, simple AI (roaming), DOM overlay HUD
- Days 10–12: Mini project (farm tile + 1 hog + feed interaction + mock API)
- Day 13–14: Polish, perf testing on mobile, document learnings

Dev environment quick setup (example using PIXI + Vite)
1. Create folder and init:
   - `mkdir pixi-practice && cd pixi-practice`
   - `npm init -y`
2. Install dependencies:
   - `npm install pixi.js pixi-viewport`
   - `npm install -D vite`
3. Add scripts to package.json:
   - `"dev": "vite", "build": "vite build", "preview": "vite preview"`
4. Create `index.html` and `src/main.js` (use the sample scaffold you practiced)

Useful references
- PIXI docs & examples: https://pixijs.com
- pixi-viewport: https://github.com/davidfig/pixi-viewport
- Phaser 3 docs: https://phaser.io
- TexturePacker: https://www.codeandweb.com/texturepacker

What to deliver at the end of practice
- A small running demo: farm grid, one animated hog, click-to-open hog info modal, drag-to-feed interaction with visual effect.
- A short note (1 page) describing what you learned and three open questions you want to resolve before Sprint 2.

If you want, I can generate the scaffold files (index.html, src/main.js, package.json) now for PIXI or Phaser. Say "Generate PIXI scaffold" or "Generate Phaser scaffold".
```