Great — practicing the rendering/game library before the sprint is the smart move. Below I’ll give you a compact, practical learning plan for PIXI.js (and an alternative if you prefer Phaser), plus a lightweight dev scaffold and progressive exercises so you build confidence quickly.

Quick decision help — PIXI vs Phaser

PIXI.js
What it is: a fast 2D WebGL renderer (lower-level). Great if you want full control over rendering and are comfortable implementing your own scene/logic systems.
Use it if: you want a custom engine, need tiny runtime, or want to handle rendering separately from game logic.
Phaser 3
What it is: a complete 2D game framework built on top of PIXI (v3 used Pixi previously; Phaser 3 uses its own renderer now). Includes scenes, input, animation helpers, physics, camera, asset loader, and plugins.
Use it if: you want faster game development, built‑in features (tweens, state management), and examples for common game patterns. Recommendation: if your goal is to finish productively, pick Phaser. If you want to learn lower-level rendering and make custom effects, start with PIXI. I’ll give PIXI practice steps below and note Phaser alternatives when useful.
How to practice — learning plan (2 weeks / flexible) Week 1 — basics and rendering fundamentals Day 1 — Setup & Hello world

Install Node, npm, and a bundler (Vite recommended).
Run the minimal PIXI scaffold below.
Goal: render a sprite to the canvas.
Day 2 — Asset loading & sprites

Learn PIXI.Loader to load images and spritesheets.
Practice creating PIXI.Sprite and positioning/scaling it.
Day 3 — Animations

Use PIXI.AnimatedSprite with frames or a spritesheet.
Create basic idle and walk animations.
Day 4 — Input & interaction

Add pointer events (pointerdown, pointerup, pointermove).
Implement dragging a sprite.
Day 5 — Simple scene & camera (use pixi-viewport)

Learn pixi-viewport for pan/zoom camera behavior.
Create a grid background and allow camera pan/zoom.
Weekend mini-project: Farm tile + one hog

Build a small scene with a tile grid, one hog wandering, and click-to-open modal.
Week 2 — systems & polish Day 6 — Particles & effects

Use a particle plugin (pixi-particles or custom emitter) for feed sparkles and birth confetti.
Day 7 — Spritesheet atlases & optimization

Pack images into an atlas, load atlas JSON, and use textures by name.
Learn how to reduce draw calls using a single atlas.
Day 8 — UI overlay & HUD

Build a DOM overlay for TopBar (coins), HUD buttons — combine PIXI canvas + regular HTML UI.
Day 9 — Performance & mobile

Test on a mobile device, enable devicePixelRatio scaling, implement LOD (reduce particles, lower FPS).
Day 10 — Small integration & mock API

Implement optimistic UI + mock server (msw or local JSON) for feed action and pregnancy creation.
Practice reconciling state with server responses.
Practice projects (increasing complexity)

Hello Pixi (render + move sprite)
Animated hog with idle/walk sprites
Drag-feed interaction (drag food icon to hog)
Roaming AI: hog wanders inside a pen
Pregnancy countdown card with mocked server
Marketplace UI (outside canvas) + sell to NPC flow
Mini game: click-to-catch-food for enhanced production (simple minigame)
Useful libraries/plugins for PIXI

pixi.js — core renderer
pixi-viewport — panning, zooming, world management
pixi-sound — audio helper
pixi-particles — particle effects (or custom emitter)
pixi-tilemap or use simple tile rendering for grid
texturepacker (tool) — make atlases
Key concepts to understand

Stage, Container, Sprite, Texture, BaseTexture
Renderer vs Application (PIXI.Application)
Textures and atlases (reduce texture binds)
AnimatedSprite for frame animations
Interaction manager (pointer events)
Render loop and requestAnimationFrame
Clipping, layers (container order), z-index patterns
Memory management: destroy textures, remove listeners
Minimal PIXI project — quick scaffold

Create a small project with Vite + pixi.js to try the basics.
Below are minimal example files to get started. Save them as shown and run with npm.