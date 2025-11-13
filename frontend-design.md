```markdown
# HogFarm — Frontend Design Document

Version: 1.0  
Author: arnielmontero (with AI design assistant)  
Date: 2025-11-13

Purpose
- Provide a clear, actionable frontend design that developers and designers can use to implement the HogFarm 2D web game UI.
- Aligns with backend (CodeIgniter) and with a Phaser 3-based Farm scene (recommended).
- Covers UX flows, layout, technical stack, assets, APIs, performance, testing, and a prioritized implementation plan.

Audience
- Frontend developers (JS/Phaser/HTML/CSS)
- Backend developers (CodeIgniter) integrating APIs
- Artists and sound designers
- QA and product managers

High-level approach
- Use Phaser 3 for the interactive 2D Farm scene (canvas). Keep CodeIgniter for backend API and page templates.
- Render the game canvas inside CodeIgniter views. Use REST APIs for authoritative state and WebSocket/SSE for realtime events.
- Use DOM overlays for menus, shop, marketplace, modals and accessibility-friendly UI.

Tech stack
- Core: Phaser 3 (game engine) + HTML5 Canvas
- UI: Vanilla JS + small UI library (Alpine.js or lightweight React) for overlays, or plain jQuery if you prefer minimal tooling
- Styling: CSS with a small utility layer (Tailwind or custom variables) — keep CSS assets separate
- Bundler: npm + Vite (or webpack)
- Backend: CodeIgniter for server pages & REST endpoints
- Realtime: WebSocket (socket.io or native ws) or Server-Sent Events for notifications/market events
- Build / deploy: assets bundled via npm, served from CDN in production; CodeIgniter serves API and UI entry point

Design principles
- Mobile-first, responsive (target mobile then tablet/desktop)
- Low friction actions: single-tap controls on mobile
- Authoritative server: client sends intents; server validates and returns canonical state
- Performance-conscious: texture atlases, lazy-loading, capped particle effects
- Clear feedback for transactions (cost, fees, confirmation)

Target devices & resolution
- Target devices: modern mobile browsers and desktop
- Base internal resolution for canvas: 1280 × 720 (16:9). Scale to fit device viewport while maintaining aspect ratio.
- Tile size: 64 × 64 px (in-game coordinate). Hog base sprite: 128 × 128 px source then scaled to tile size for crispness.
- Use devicePixelRatio scaling for crisp rendering on high-DPI screens.

Primary screens & components
1. Landing / Marketing Page (outside game canvas)
   - CTA: Sign up / Play now
   - Feature highlights (how to play, earn, buy)
2. Auth (Sign Up / Login / Password / 2FA)
3. Dashboard
   - Topbar: Coins, Notifications, Profile
   - Quick stats: hog count, structures health, active pregnancies
   - Buttons: Farm, Shop, Marketplace, Inventory, Leaderboards
4. Farm Scene (main game; Phaser canvas)
   - Camera & pan/zoom, farm grid, structures, roamable hogs
   - HUD overlay: topbar (coins & notifications), left quick-actions, bottom detail panel
   - Context menus + drag & drop interactions
5. Hog detail modal
   - Stats, actions (feed, medicate, breed), pregnancy status, lineage
6. Shop / Store
   - Cards for consumption items, seeds, sperm-items, subscription
   - Stripe integration for fiat payments; in-game coin purchases show cost breakdown
7. Marketplace (P2P)
   - Filters (rarity, price), listing detail, buy/list flows
8. Breeding dialog & pregnancy card
   - Confirm breeding; show success chance and expected litter range; pregnancy countdown card
9. Inventory
   - Item management and drag-to-use interactions
10. Notifications / Activity feed
11. Admin views (separate auth)
   - Knobs: production rates, NPC config, fees, logs & fraud dashboard

Farm scene layout & interactions
- Grid-based farm layout (rows/columns). Structures snap to grid tiles. Hogs roam within pen bounds.
- Layers:
  1. Ground/tiles
  2. Props / background objects
  3. Structures (barns/wells)
  4. Hogs (sprites)
  5. Foreground props & overlay UI
- Camera:
  - Pan: drag (desktop) or swipe (mobile)
  - Zoom: mouse wheel or pinch (mobile) with capped zoom range
- Hog interactions:
  - Tap/click hog → open hog card
  - Drag item from inventory onto hog → feed/med
  - Long-press/secondary menu → quick actions (breed, list, inspect)
- Batch actions:
  - Multi-select button to perform batch feeding/repairs (important for power users)
- Visual cues:
  - Health/hunger/hydration bars on hover or as icons above hogs
  - Pregnancy icon & countdown badge over mother hog
  - Sick hogs have visual tint/effect; dead hogs show grave icon

Art & assets specification
- Art style: cartoony / cute; consistent palette and readable shapes.
- Sprite sizes and sheets:
  - Hog sprite sheet: 128 × 128 px base cell; frames for idle/walk/eat/sick/pregnant; use atlas (PNG + JSON)
  - Tile sprites: 64 × 64 px
  - Structure sprites: size multiple of tile (e.g., barn 3×2 tiles)
  - UI icons: SVG preferred for crispness (fallback PNG at 2x)
- Sample spritesheet layout:
  - sprites/hogs/common.png (atlas JSON)
  - sprites/structures/barn_lvl1.png
  - sprites/ui/icons/*.svg
- Audio:
  - SFX: feed (0.2s), birth chime (0.5s), sell/purchase click (0.15s)
  - Background loop (optional, toggleable)
- Asset optimization:
  - Texture atlases via TexturePacker
  - Compress PNGs, use webp where supported
  - Lazy-load high-res skins on demand

Animation & visual polish
- Use Phaser's animation system; keep smooth looped animations for idle/walk.
- Particle effects for feed, birth confetti, and rare events.
- Transitions & microinteractions: button presses, confirmation modals, toasts.
- Performance LOD: disable particle effects when frame rate drops; limit concurrent animated hogs on small devices.

UI/UX details & microcopy
- Clear action confirmations before spending coins
- Show cost breakdown (item cost, listing fee, commission)
- Informative tooltips for breeding success chance and newborn cooldown
- Onboarding tutorial (interactive):
  1. Claim starter hog
  2. Feed once (consume food)
  3. Wait first tick to earn coins
  4. Open shop and buy water pack
  5. List a hog or open marketplace
- Accessibility:
  - Keyboard navigation (desktop)
  - Sufficient contrast on text and HUD
  - Screen-reader friendly markup for overlays & dialogs

APIs & integration points (contract-level)
- All actions are authoritative on server. Client calls intent endpoints; server returns new canonical state.
- Suggested REST endpoints (examples)
  - GET /api/v1/user — profile, balances
  - GET /api/v1/farm — layout, hogs, structures, inventory
  - POST /api/v1/action/feed { hog_id, item_id } → { success, updated_hog, ledger_entry }
  - POST /api/v1/action/repair { structure_id, item_id }
  - POST /api/v1/breed { mother_id, father_id | sperm_item_id } → { pregnancy_id, due_time, cost_cents }
  - GET /api/v1/pregnancies
  - POST /api/v1/marketplace/list { asset_id, price_cents }
  - GET /api/v1/marketplace?filters...
  - POST /api/v1/marketplace/buy { listing_id } → { success, updated_inventory, ledger_entry }
  - POST /api/v1/npc/sell { asset_id } → { price_paid }
- Realtime:
  - WebSocket / SSE channel to broadcast: birth events, listing sold, big marketplace price changes, admin messages
- Client must handle optimistic UI but reconcile based on server responses.

State management & caching
- Keep minimal authoritative local state: cache last API responses; poll or subscribe via WebSocket for updates.
- Use small in-memory store in the client (simple JS object) for session state; persist minimal preferences in localStorage.
- Reconcile: if server returns state different from optimistic update, show gentle correction animation and toast.

Performance considerations
- Single canvas for game rendering, DOM overlays for UI.
- Use texture atlases and batch draw calls.
- Limit active hog count rendered on mobile (cull off-screen sprites).
- requestAnimationFrame for main loop; pause update loops when browser tab hidden.
- Lazy-load marketplace thumbnails and create a small image CDN.

Analytics & telemetry
- Track these events: onboarding_complete, purchase_item, breed_action, birth_event, sale_listing, npc_sale, ad_reward_watched
- Integrate with Google Analytics, Plausible, or self-hosted event collector; log critical events to backend for revenue KPIs.

Security & validation
- All UI actions must be validated on server; do not trust client-reported coin balances.
- Use CSRF tokens (for forms) and JWT/session for API auth.
- Prevent client-side stock manipulation; always fetch canonical balances after purchases.

Testing & QA
- Unit tests for UI components (where applicable)
- E2E tests for flows: signup → starter hog → feed → first harvest → buy item → list asset → buy asset
- Performance testing on mobile devices (lowest-end target)
- Accessibility checks: color contrast, focus order, screen reader sanity
- Visual regression tests for key screens if using CI

Admin panel & runtime knobs
- Separate admin UI (web pages) allowing toggling:
  - economy knobs (production rates, prices, fees)
  - NPC config (margins, caps)
  - breeder settings (gestation days, litter rules)
  - user management (freeze accounts, adjust balances)
  - logs & fraud flags
- Admin changes should be applied immediately and logged with reason & actor.

Folder & file structure (frontend)
- frontend/
  - package.json
  - vite.config.js
  - src/
    - index.html (CodeIgniter view wraps this)
    - main.js (boot, initialize Phaser + UI)
    - phaser/
      - scenes/
        - FarmScene.js
        - UILayer.js
      - sprites/
      - atlases/
    - ui/
      - components/
        - TopBar.js
        - BottomPanel.js
        - Modal.js
      - styles/
        - vars.css
        - main.css
    - api/
      - apiClient.js
    - assets/
      - sprites/
      - audio/
  - public/ (compiled assets)
  - tests/
    - e2e/
    - unit/

Design tokens & color palette (starter)
- Primary: #6aa84f (farm green)
- Accent: #fbbc05 (gold)
- UI background: #f3f5f2 (light)
- Text primary: #1f2933 (dark)
- Danger / sick: #d9534f (red)
- Use tiny palette and maintain consistent border radii and spacing (8px grid).

Accessibility & localization
- Prepare i18n keys for all user-facing text (JSON)
- Right-to-left support planned (if needed later)
- Use large touch targets (≥44px) for mobile buttons

Development & release plan (prioritized)
Phase 1 — Core UI & Farm prototype (2 weeks)
- Set up project scaffold (Phaser + CodeIgniter view integration)
- Implement FarmScene with placeholder sprites, camera, pan/zoom
- TopBar, Dashboard skeleton, Hog modal open on click
Phase 2 — Game interactions (2–3 weeks)
- Implement server API hooks for feed, harvest, buy seeds (mock server optional)
- Implement inventory drag-to-hog & feed action
- Implement pregnancy UI (initiate breeding and show countdown)
Phase 3 — Marketplace & Shop (2–3 weeks)
- Marketplace browsing & listing flow, Stripe integration for fiat purchases (server)
- NPC quick-sell UI
Phase 4 — Polish, Ads, Analytics & Admin (2–4 weeks)
- Animations, SFX, particle effects, rewarded ads, admin knobs
- Mobile UX polish and performance optimization

Deliverables & artifacts I can produce next
- Phaser starter scaffold (single-page farm scene + basic hog sprite + camera) and CodeIgniter view wrapper
- Static HTML/CSS mockups for Dashboard, Shop, Hog Modal
- Sprite & asset spec (sheet layout, frame sizes) and a sample placeholder spriteset
- API contract doc (complete endpoints + request/response examples)
- Wireframes for breeding dialog + marketplace listing flow

Open questions for you
1. Do you want Phaser 3 (recommended) or a lighter rendering library (PIXI.js / canvas) for the Farm scene?
2. Which image style do you prefer (pixel-art, vector-flat, or hand-drawn cartoony)?
3. Confirm base tick mapping (1 real hour = 1 game day) so production UI shows expected countdowns.
4. Which deliverable should I produce next? (Pick from the Deliverables list above.)

Notes
- Keep critical gameplay calculations on server; UI only visualizes and sends intents.
- Start with internal-only currency and Stripe for fiat purchases; add payouts and blockchain later only after compliance review.

---

If you want, I’ll now generate a runnable Phaser starter scaffold (files: package.json, a minimal FarmScene.js, CodeIgniter view, and README) you can run locally and connect to your API. Say: "Create Phaser scaffold" and I’ll produce the files.
```