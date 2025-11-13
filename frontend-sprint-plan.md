```markdown
# HogFarm — Frontend Sprint Plan & Implementation Document

Version: 1.0  
Author: arnielmontero (with AI design assistant)  
Date: 2025-11-13

Purpose
- Provide a clear, step-by-step sprint plan to design and implement the full HogFarm frontend (2D game + UI overlays) until 100% complete and ready to hand off to backend development.
- This document is the single source of truth for frontend scope, tools, sprint tasks, deliverables, acceptance criteria, QA, and handoff items.

Assumptions
- Solo developer with experience in CodeIgniter + JS.
- Frontend must be finished (polish, assets, UI, flows, tests) before backend integration begins.
- Game tick mapping (default): 1 real hour = 1 game day (used throughout UI for timers).
- Phaser 3 is the recommended game engine for the Farm scene.

High-level goals
- Build a polished, mobile-first 2D Farm scene (Phaser) integrated into CodeIgniter views.
- Implement all UI: Dashboard, Shop, Inventory, Marketplace, Breeding, Pregnancy, NPC flows, Admin knobs.
- Provide an API contract & mock server so backend work can start after frontend completion.
- Deliver tests, documentation, and production-ready static assets.

Tools & libraries
- Phaser 3 (game engine)
- Vanilla JS + small UI library (Alpine.js recommended) or lightweight React
- Vite (build) or webpack
- CSS: TailwindCSS or modular CSS variables
- Texture atlases (TexturePacker) for spritesheets
- Audio: small OGG/MP3 SFX
- Mock server: msw or JSON server
- Testing: Cypress (E2E), optional Jest for unit tests
- Version control: Git + GitHub
- CI (optional): GitHub Actions
- Analytics: Google Analytics / Plausible (event logging to backend later)
- Payments: Stripe (client-side integration stubbed during frontend development)

Delivery cadence
- 10 sprints, each 1 week long (recommended). Can be compressed/expanded as needed.

Pre-sprint: Setup tasks
- Create repo: `hogfarm-frontend` (or chosen name)
- Prepare README with dev setup
- Install Node, Vite, Phaser, UI lib
- Prepare asset list & placeholder sprites

Sprint 0 — Prep & Design (2–3 days)
Goal: finalize design decisions and prepare environment + wireframes
Tasks
- Finalize tech stack (Phaser + Alpine + Vite + CodeIgniter wrapper).
- Create repository scaffold and README.
- Create wireframes for Landing, Dashboard, Farm, Hog modal, Shop, Marketplace, Breeding dialog, Inventory.
- Create asset spec to give to artist or to build placeholder sprites.
Deliverables
- Repo scaffold, wireframes, asset spec.
Acceptance criteria
- Project builds locally (`npm run dev`), wireframes and asset list ready.

Sprint 1 — Basic UI & Pages (Core shell)
Goal: Implement top-level pages and responsive layout
Tasks
- Create CodeIgniter view(s) that load the frontend bundle.
- Implement TopBar, SideMenu, Dashboard skeleton.
- Implement Login/Signup static templates (UI only).
- Implement mobile-first responsive CSS.
Deliverables
- Dashboard and Landing page UI; responsive layout.
Acceptance criteria
- Pages render correctly on desktop and mobile; topbar shows placeholder values.

Sprint 2 — Phaser Scaffold & Farm Scene Prototype
Goal: Create Phaser canvas and basic farm scene with camera controls
Tasks
- Integrate Phaser into the frontend scaffold.
- Create FarmScene with virtual resolution (1280×720) and scaling rules.
- Implement camera pan (drag/swipe) and zoom (wheel/pinch).
- Add placeholder tilemap and one animated hog sprite.
- Open hog modal on click.
Deliverables
- Farm scene with pan/zoom and clickable hog.
Acceptance criteria
- Farm scene loads, camera works on desktop & mobile, hog modal opens.

Sprint 3 — Asset Pipeline & Animations; Hog Interactions
Goal: Implement spritesheets, animations, simple AI for hogs
Tasks
- Add texture atlas loader and structured assets folder.
- Implement hog animations (idle/walk/eat/sick).
- Add simple roam AI constrained to pens.
- Add health/hunger/hydration icons and feed particle effect.
Deliverables
- Animated hogs, roam behavior, status icons.
Acceptance criteria
- Hog animates, roam/wander works, feed visual effect plays.

Sprint 4 — Inventory, Shop UI & Purchase Flow (Mocked)
Goal: Build Shop and Inventory UIs and mock purchase flow
Tasks
- Inventory page with item lists and quantities.
- Shop UI with cards for seeds, food, water, meds, sperm-items.
- Integrate Stripe Checkout stub (mock) and "use coins" flow.
- Hook buying to mock server to update inventory.
Deliverables
- Shop and Inventory with working mock purchases.
Acceptance criteria
- Buying items updates inventory and shows confirmation.

Sprint 5 — Feed/Repair Actions & Batch Actions
Goal: Implement item usage and batch operations
Tasks
- Drag-and-drop or tap-to-use interactions from inventory onto hog.
- Implement bottom action panel for selected hog (feed, water, medicate).
- Implement batch feed/repair for multi-select of hogs.
- Reconcile optimistic UI with mock API responses.
Deliverables
- Feed/water/med actions and batch modes.
Acceptance criteria
- Single and multi-select feed works and updates UI correctly.

Sprint 6 — Breeding UI & Pregnancy Card
Goal: Create breeding dialog and pregnancy UI with timer
Tasks
- Breeding dialog with mother selection, male/sperm selection, cost, success chance, expected litter range.
- Pregnancy card component (countdown, boosters link).
- Hook breeding action to mock server and show pregnancy icon/animation.
Deliverables
- Breeding dialog, pregnancy card, countdown, and mock backend integration.
Acceptance criteria
- Breeding validated, pregnancy created, countdown visible, boosters (mock) purchasable.

Sprint 7 — Marketplace UI (P2P) + Listing & Buy Flow
Goal: Implement marketplace browsing, listing creation and purchase flow
Tasks
- Listing grid with filters (rarity, price).
- Listing creation modal (set price + show listing fee).
- Buy flow with fee breakdown and mock ledger update.
- Enforce / display newborn resale cooldown.
Deliverables
- Marketplace browsing, listing, and buying flows.
Acceptance criteria
- Users can create listings and buy items (mock) with correct UI flows.

Sprint 8 — NPC UI, Admin Knobs & Local Economy Controls
Goal: NPC buy/sell flows and developer admin controls for tuning
Tasks
- NPC instant-buy/sell UI with mock EMA pricing.
- Sell-to-NPC confirm dialog and cooldown display.
- Admin panel (dev-only route) to change knobs: production rate, consumable prices, NPC margins, newborn cooldown.
- Analytics event stubs.
Deliverables
- NPC flows and admin tuning panel.
Acceptance criteria
- Admin knobs change client behavior; NPC transactions update inventory.

Sprint 9 — Mobile Polish, Performance Optimization & Audio
Goal: Ensure smooth mobile performance and add audio
Tasks
- Optimize assets and lazy-load skins.
- Implement low-LOD mode to lower visual cost on weak devices.
- Add SFX for feed, birth, sale and audio controls.
- Pause rendering when tab hidden; handle memory cleanup.
Deliverables
- Mobile-optimized build, audio & LOD mode.
Acceptance criteria
- Game runs smoothly on mid-tier mobile; audio toggles work.

Sprint 10 — E2E Tests, Final Polish, Docs & Backend Handoff
Goal: Full QA, tests, API contract and handoff package for backend
Tasks
- Write E2E tests (Cypress) for core flows: signup → starter hog → feed → harvest → buy → list → buy.
- Prepare API contract (endpoints + request/response examples).
- Create frontend handoff package: asset manifest, admin knobs list, mock server data, websocket event spec.
- Final bug fixes and visual polish.
Deliverables
- E2E test suite, API contract doc, README, production build, handoff package.
Acceptance criteria
- All E2E tests pass against mock; API contract documented; build artifacts ready.

Estimates (rough)
- Per sprint: 20–36 hours (varies by sprint).
- Total estimate: ~280–360 hours (approx. 8–12 weeks full-time).
- You can shorten timeline by using placeholder art, fewer animations, or parallelizing tasks.

Quality & acceptance criteria (global)
- Core flows work against mock backend and show correct, reconciled UI state.
- Mobile-first, responsive UI with acceptable performance on mid-range devices.
- Authoritative state always validated server-side later; frontend must not trust local balances.
- All key UI components have visual polish and clear microcopy.

Testing & QA checklist
- Unit tests for reusable logic (optional)
- E2E tests for onboarding, purchase, breeding, marketplace flows
- Manual QA on multiple devices (iPhone/Android/desktop)
- Network throttling tests (offline, slow 3G)
- Accessibility checks (contrast, touch target sizes)
- Performance (Lighthouse baseline & FPS target)

Handoff package for backend (what frontend will deliver)
- API contract: list of endpoints with request/response samples (JSON), auth scheme, error codes.
- WebSocket/SSE event spec (birth events, sale notifications, admin messages).
- Data model examples (hog object, item object, listing object, pregnancy object, ledger entry).
- Asset manifest (list of sprite atlas files + versions).
- Admin knobs list and endpoints to get/set them.
- E2E test scripts and mock server data for staging.
- Deployment notes & production build artifacts.

Risks & mitigations
- Large initial asset bundle → Use atlases & lazy loading; keep initial bundle < 5–8 MB for mobile.
- Performance on low-end devices → Implement LOD mode, cap animations and particle effects.
- Feature creep → Stick to MVP scope per sprint; add extras in future sprints.
- Backend dependency → Use a mock server (msw or JSON server) and finalise API contract early.

Optional extras (post-frontend)
- Realtime "see other farms" feature
- Internationalization
- On-device caching & offline play for limited actions
- CI/CD automation for deploys & asset publishing

Next actionable choices (pick one)
- "Create Phaser scaffold" — produce a runnable starter project (package.json, vite config, minimal Phaser scene, CodeIgniter view).
- "Create API contract" — produce a detailed REST API spec (endpoints, inputs, outputs).
- "Create sprint tracker" — produce a Google Sheet or Markdown checklist for tracking the 10 sprints.

Pick one action and I will produce the requested artifact next.
```