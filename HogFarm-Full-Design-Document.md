```markdown
# HogFarm — Full Design Document

Version: 1.0  
Author: arnielmontero (with AI design assistant)  
Date: 2025-11-13

Purpose
- Consolidate all previous planning, game-economy design, frontend plan, sprint plan, breeding mechanics, lifespan rules, NPC/market rules, and practice resources into a single reference document for development.
- This is the single source-of-truth to begin design, frontend implementation, tuning, and later backend integration.

Table of contents
1. Executive summary
2. Product vision & goals
3. Core architecture & major components
4. Game concept & player flows
5. Hog lifecycle, lifespan & aging rules
6. Breeding & sperm-cell system
7. Economy & token (coins) design
8. Marketplace & NPC market mechanics
9. Structures, water, repairs, consumables
10. Anti-abuse, fraud & safety controls
11. Backend data model & ledger rules (high-level)
12. Cron jobs & worker responsibilities
13. Frontend design summary (2D / PIXI/Phaser)
14. Frontend sprint plan (10 sprints)
15. PIXI practice plan & starter scaffold
16. Assets & art guidance
17. API contract summary (starter)
18. QA, testing & monitoring
19. Legal, compliance & rollout guidance
20. Next steps & deliverables checklist
21. Contacts & references

---

1. Executive summary
- HogFarm is a play-to-earn social farming game where players raise digital hogs, maintain structures (barns, wells), manage water/food/meds, breed (natural or using sperm-cell items), and trade hogs/items in a P2P marketplace. The platform earns via marketplace fees, consumable purchases, breeding/extraction fees, subscriptions, ads, and optional NPC spread. MVP uses an internal coin currency (no external payouts) to simplify legal risk.

2. Product vision & goals
- Player goals: raise healthy, productive hogs; breed rare offspring; trade and profit; socialize with gifting and leaderboards.
- Platform goals: sustainable revenue, controllable in-game inflation, high retention, secure ledger & anti-fraud, smooth onboarding for new players.
- Launch approach: invite-only beta → public release after tuning economy and anti-fraud.

3. Core architecture & major components
- Frontend: 2D interactive Farm scene (Phaser recommended or PIXI.js) + DOM overlays for UI (shop, marketplace, modals).
- Backend: CodeIgniter (PHP) serving API endpoints, auth, payments; Node.js optional microservices for heavy async work.
- DB & ledger: MySQL with append-only ledger_entries for all coin movements.
- Workers/Cron: hourly tick worker, birth processor, daily reconciliations.
- Hosting: VPS for workers; Hostinger for CodeIgniter UI OK for early MVP but secrets & keys require secure VPS for production.
- Optional: Redis for locks, caching; Sentry for errors; analytics (GA/Plausible).

4. Game concept & player flows
- Basic loop: Acquire hog → feed & water → hog produces coins each tick → spend coins on items, repairs, breeding or list/sell hogs → repeat.
- Player journeys:
  - New user onboarding (starter hog, short tutorial)
  - Active gardener (care for multiple hogs)
  - Trader/breeder (use marketplace & sperm items)
  - Event participant (contests & tournaments)
- Social: gifting, leaderboards, referrals.

5. Hog lifecycle, lifespan & aging rules
- Time mapping: default 1 real hour = 1 game day (configurable).
- Stages: Juvenile → Adult → Senescent → Dead.
- Per-rarity default lifespan values:
  - Common: maturity 7d / senescence 70d / max_life 100d
  - Uncommon: 6 / 90 / 130
  - Rare: 5 / 120 / 180
  - Epic: 4 / 160 / 250
  - Legendary: 3 / 220 / 350
- Aging effects:
  - Juvenile production = 50% adult
  - Adult = baseline
  - Senescent production declines linearly up to configurable max (default drop 60%)
- Death triggers: age >= max_lifespan, health <= 0, untreated severe sickness or catastrophic events.
- Revival: optional revival within a short window at high cost (admin-configurable).

6. Breeding & sperm-cell system
- Breeding methods:
  - Natural: male + female (both adult & healthy). Male stamina & cooldown apply.
  - Sperm-cell: single-use item extracted from a male; tradable on marketplace.
- Gestation defaults (per rarity): Common 3d, Uncommon 3d, Rare 4d, Epic 5d, Legendary 6d.
- Litter size rules:
  - Max 15 babies per litter.
  - Common mothers: uniform 4–10.
  - Rare mothers: bimodal — 75% small (1–3), 20% medium (4–10), 5% huge (11–15).
  - Uncommon/Epic/Legendary: tuned distributions (see design admin knobs).
- Inheritance: parent rarities weighted (mother heavier), small mutation chance.
- Pregnancy flow: create pregnancy record → success roll (base 95% ± modifiers) → birth job processes litter → per-baby stillbirth checks → newborn creation with resale cooldown.
- Anti-abuse: female cooldown after birth, male extraction cooldown, per-account breeding caps, newborn resale cooldown (24–72h).

7. Economy & token (coins) design
- Currency: internal coin (integer smallest unit).
- Sources:
  - Hog production (primary)
  - Event rewards, quests
  - NPC sales (when players buy from NPC)
- Sinks:
  - Consumables (food, water, meds)
  - Repair costs & structure upkeep
  - Listing fees & marketplace commission
  - Breeding/extraction fees
  - Burn % on trades (1–3%)
- Inflation control: monitor daily_minted vs daily_sunk; target small positive growth over 30 days (+0.5% to +5%). Auto-adjust rules to tweak consumable prices or burns if inflation out of range.

8. Marketplace & NPC market mechanics
- P2P marketplace: listing fee (small), commission (default 10%), filters, cooldowns.
- NPC market: provides instant liquidity but must be conservative:
  - Pricing: base = EMA(last N P2P sales)
  - buy = base * (1 - buy_margin - inv_adj)
  - sell = base * (1 + sell_margin + inv_adj)
  - inv_adj adjusts based on NPC/platform inventory
- Safety: per-account caps, global caps, cooldowns to prevent flip-arbitrage; admin monitors NPC PnL.

9. Structures, water, repairs, consumables
- Structures: barns, wells, pens, medical stall — each gives bonuses (production, capacity, water generation) and have durability that decays.
- Water & food:
  - Hogs consume water (units/day). Running out increases sickness risk.
  - Water packs & food packs purchasable; wells produce water but require repairs.
- Repairs: durability decay triggers repair costs; repair kits available.
- Consumables priced to be meaningful sinks.

10. Anti-abuse, fraud & safety controls
- Sign-up verification (email; phone for withdrawals later)
- CAPTCHA, rate-limits, device checks
- Wash-trade detection heuristics
- Cooldowns, newborn resale lock, per-account caps
- Append-only ledger for full audit trail
- Manual review flows & admin freeze tools

11. Backend data model & ledger rules (high-level)
- Key tables:
  - users, balances, ledger_entries (append-only), hogs/assets, items, inventory, structures, listings, pregnancies, sperm_items, purchases, admin_logs
- Ledger rules:
  - Every coin movement recorded as a ledger_entry (user_id, amount, type, ref_id, timestamp).
  - Balance updates created via DB transactions: insert ledger entry + update balances atomically.
  - Daily reconciliation job to verify ledger sums == balances.

12. Cron jobs & worker responsibilities
- Hourly tickworker:
  - Update hog age/stage
  - Compute production and create ledger entries
  - Decrement hunger/hydration, check sickness/death
  - Process due pregnancies (births)
  - Update NPC EMA/pricing
- Daily jobs:
  - KPI aggregation, ledger reconciliation, backups, fraud batch checks
- Async queue:
  - Heavy tasks (mass notifications, large settlements, manual payouts later)

13. Frontend design summary (2D / PIXI or Phaser)
- Recommended engine: Phaser 3 (faster to develop) or PIXI.js (lower-level control).
- Canvas for Farm scene; DOM overlays for HUD and forms.
- Key UI screens: Landing, Auth, Dashboard, Farm Scene, Hog modal, Shop, Inventory, Marketplace, Breeding dialog, Admin.
- Farm scene details: grid layout, layered rendering, camera pan/zoom, hog animations, visual cues for health/hunger/pregnancy.
- Mobile-first responsive design; scale canvas while preserving aspect ratio.
- Use texture atlases for performance; lazy-load large skins.

14. Frontend sprint plan (10 sprints)
- See detailed Sprint Plan (separate file): 10 one-week sprints from scaffolding and wireframes to polish and E2E tests.
- Deliverable highlights: Phaser scaffold, Shop & Inventory UIs, Breeding UI, Marketplace, NPC flows, Admin knobs, E2E tests, API contract for backend handoff.

15. PIXI practice plan & starter scaffold
- If you prefer PIXI: 2-week practice plan covering setup, sprites, animations, interaction, viewport (pixi-viewport), particles, atlases, and a mini-project (farm tile + hog).
- Starter scaffold provided (small Vite + pixi sample) — use to practice before starting sprint.

16. Assets & art guidance
- Style: cartoony, friendly, bright color palette.
- Tile size: 64×64 px; hog base sprite: 128×128 source, scaled in-game.
- Use TexturePacker to produce atlas (PNG + JSON).
- File organization: sprites/hogs/*, sprites/structures/*, ui/icons/*, audio/*
- Asset budget: keep initial bundle < 5–8 MB; lazy-load skins/large assets.

17. API contract summary (starter)
- All actions are server-authoritative.
- Suggested endpoints (versioned):
  - GET /api/v1/user
  - GET /api/v1/farm
  - POST /api/v1/action/feed {hog_id, item_id}
  - POST /api/v1/action/repair {structure_id, item_id}
  - POST /api/v1/breed {mother_id, father_id|sperm_item_id}
  - GET /api/v1/pregnancies
  - POST /api/v1/marketplace/list
  - GET /api/v1/marketplace
  - POST /api/v1/marketplace/buy
  - POST /api/v1/npc/sell
- WebSocket/SSE events:
  - birth_event, listing_sold, balance_update, admin_broadcast
- Provide precise request/response JSON examples during frontend/backend handoff.

18. QA, testing & monitoring
- Unit tests for core JS logic (optional)
- E2E tests (Cypress) for core flows
- Load testing for hourly cron & marketplace with projected DAU
- Monitoring & alerts: high inflation spike, NPC PnL losses, surge in deaths, fraud signals
- Reconciliation: daily ledger vs balances

19. Legal, compliance & rollout guidance
- MVP internal coins avoid early legal complications.
- If enabling payouts or tokenization: consult counsel for money-transmission, securities, and AML/KYC rules.
- Prepare terms of service, privacy policy, risk disclosures.
- For payouts: implement robust KYC, limit withdrawals, maintain reserve and audits.

20. Next steps & deliverables checklist
Immediate (before dev):
- Finalize art style and get placeholder assets.
- Choose engine (Phaser or PIXI) and confirm tick mapping.
- Create GitHub repo (recommended name: `hogfarm` or `hogfarm-frontend`).
- Prepare dev environment and node + bundler.
- Create admin knobs list and initial parameter values (production rates, prices, fees).

Frontend initial deliverables:
- Project scaffold (Phaser or PIXI)
- Wireframes for all main screens
- Asset manifest with placeholder sprites
- Mock server with endpoints for core flows
- Sprint tracker & tasks (10-sprint plan)

Backend handoff deliverables (when frontend ready):
- Full API contract (OpenAPI or JSON doc)
- WebSocket event spec
- DB schema & ledger rules (migration SQL)
- Admin knobs endpoints & documentation
- Staging environment instructions

21. Contacts & references
- Project owner: arnielmontero
- Design notes & conversation context: stored in project docs (this document consolidates all key points)
- Useful references:
  - Phaser 3 docs: https://phaser.io
  - Pixi.js docs: https://pixijs.com
  - TexturePacker: https://www.codeandweb.com/texturepacker

---

Appendix A — Key default parameters (copyable)
- Tick: 1 real hour = 1 game day
- Starter hog production: 10 coins/hour (juvenile 5 coins/hour)
- Food pack: 50 coins (boost +20% for 12 ticks)
- Water pack: 20 coins (covers 10 hog-days for one hog)
- Med: 200 coins (treat severe sickness)
- Barn lvl1: cost 500 coins; +10% production; durability -2/day
- Marketplace listing fee: 5 coins; commission: 10%
- NPC buy margin: 8% discount; NPC sell margin: 12% markup
- Burn: 1% on P2P sales
- Breeding fee: 100 coins (configurable)
- Female cooldown after birth: 7 days; male cooldown: 2 days
- Newborn resale cooldown: 24–72 hours
- Pregnancy gestation: Common 3d, Rare 4d, Epic 5d, Legendary 6d
- Max litter: 15

Appendix B — Suggested admin knobs (minimal)
- production_base_by_rarity
- consumable_prices (food, water, med)
- breeding_fee, extraction_cost
- gestation_days_by_rarity
- litter_distributions_by_rarity
- newborn_resale_cooldown_hours
- npc_buy_margin, npc_sell_margin, npc_daily_cap, npc_inventory_target
- marketplace_fee_pct, listing_fee
- subscription tiers & bonuses
- sickness/death probability settings

---

If you want, I can now:
- Produce a single-file API contract (OpenAPI / Swagger) for the endpoints above.
- Generate the Phaser scaffold project files (package.json, Vite config, FarmScene sample).
- Generate SQL migration files for the core DB tables (users, hogs, ledger, pregnancies, sperm_items).
- Produce the Google Sheet sprint tracker for the 10 sprints.

Which of these would you like me to generate next? If you want code files or migrations, tell me "Generate X" (e.g., "Generate Phaser scaffold" or "Generate DB migrations") and I will produce the files.
```