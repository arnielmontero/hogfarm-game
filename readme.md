```markdown
# HogFarm — Design Document (clear & ready for development)

Version: 1.0  
Author: arnielmontero (with AI design assistant)  
Date: 2025-11-13

Purpose
- Provide a concise, implementable game design and system specification for the HogFarm play-to-earn game so development can start with clear rules, DB fields, cron behaviors, APIs, and admin controls.
- MVP focus: internal-only currency (coins), no external payouts. Later tokenization/payouts are possible after legal & security work.

High-level summary
- Players raise digital hogs and maintain structures (barns, wells). Hogs produce coins over time. Players feed, water, medicate, repair, breed (natural or via sperm-cell items), trade in a P2P marketplace, or instantly transact with an NPC market.
- Platform revenue: marketplace commission, consumable sales, breeding/extraction fees, subscriptions, ads, and optional NPC spread. Start conservative: P2P commission + consumables + subscriptions + ads.

Core concepts & entities
- Player (account, profile, subscription)
- Hog (asset): breed, rarity, birth_time, stage, health, hunger, hydration, production_rate, age, status
- Item: seed, food, water_pack, med, vitamin, repair_kit, sperm_cell, cosmetic
- Structure: barn, well, medical stall — durability + bonuses
- Inventory: user-owned items
- Listing: marketplace P2P listing
- Pregnancy: pregnancy records for gestation & birth processing
- Ledger: append-only coin ledger (every coin movement recorded)
- NPC state: EMA pricing, inventory, caps
- Admin logs & flags (fraud, disputes)

Game time & tick
- Chosen mapping (configurable): 1 real hour = 1 game day (default). Cron runs every tick (hour) to:
  - Process production (credit coins)
  - Decrement hunger/hydration/durability
  - Check sickness & death
  - Process gestations due
  - Update NPC EMA and marketplace states

Hog lifecycle & lifespan (stages)
- Stages: Juvenile → Adult → Senescent → Dead
- Fields per hog:
  - birth_time TIMESTAMP
  - maturity_age_days INT
  - senescence_age_days INT
  - max_lifespan_days INT
  - stage ENUM('juvenile','adult','senescent','dead')
  - health INT (0-100)
  - hunger INT (0-100)
  - hydration INT (0-100)
  - production_base INT (coins per tick/hour)
  - last_tick_at TIMESTAMP
  - status metadata JSON
- Default lifespan numbers (editable in admin, per rarity):
  - Common: maturity 7, senescence 70, max_life 100
  - Uncommon: 6, 90, 130
  - Rare: 5, 120, 180
  - Epic: 4, 160, 250
  - Legendary: 3, 220, 350
- Aging effects:
  - Juvenile: 50% of adult production
  - Adult: 100% baseline
  - Senescent: production declines linearly up to a configured max drop (default 60%)
  - Death: when age >= max_lifespan OR health <= 0 OR severe untreated sickness

Breeding design (natural and sperm-cell)
- Two ways to breed:
  - Natural: male + female (both adult, healthy). Male stamina/cooldown decreases; female becomes pregnant.
  - Sperm-cell: single-use item representing male genetics (extracted & sold). Using it impregnates female (if conditions met).
- Gestation:
  - gestation_days per rarity (defaults: Common 3, Uncommon 3, Rare 4, Epic 5, Legendary 6)
- Litter size rules (defaults you requested):
  - Max babies per litter hard cap: 15
  - Common mother: uniform 4–10
  - Uncommon: typical 3–7 (triangular-ish centered)
  - Rare: bimodal:
    - 75% chance small 1–3
    - 20% chance medium 4–10
    - 5% chance huge 11–15 (rare)
  - Epic, Legendary: tuned toward fewer babies but higher-quality offspring (defaults provided later)
- Inheritance:
  - Each baby gets rarity determined probabilistically using parent rarity weights and small mutation chance.
  - Optionally: father rarity slightly biases offspring.
- Pregnancy flow:
  1. Preconditions validated (health, status, not already pregnant, fees paid).
  2. Create pregnancy record with start_time and due_time.
  3. Pregnancy success roll (base 95% minus penalties for poor health/hydration).
  4. On due_time, run birth job: compute litter size, per-baby stillbirth check, create newborn assets, set mother cooldown, create ledger entries.
- Fees & sinks:
  - Breeding fee (coins) paid at mating; extraction fee when creating sperm-cell; newborn resale cooldown and per-birth taxation to act as sinks.

Sperm-cell mechanics
- Sperm-item: item in marketplace with metadata referencing source male and optional traits.
- Extraction:
  - Male cooldown and stamina cost for extraction; extraction may have a fee/cost (coins).
  - Seller lists sperm-item for sale. Buyer uses it to impregnate female (consumes item).
- Anti-abuse:
  - Extraction limits per male per time window, extraction cooldown, track origin male to detect suspicious patterns.

Production, sickness, and death
- Production per tick:
  production = floor( base_rate * (1 + structure_bonus + item_boost + subs_bonus) * health_multiplier )
  - health_multiplier = 1.0 when health >= threshold, declines when hunger/hydration low.
- Sickness:
  - Trigger conditions: low hunger/hydration, random events.
  - Sick hogs: production reduced, require meds to recover. Untreated sickness increases death risk.
- Death handling:
  - At death: set status dead, optional salvage small coin refund, or allow revival window (configurable) at high cost.

Marketplace & NPC (liquidity)
- P2P marketplace:
  - Listings by users, listing fee (small), platform commission on sale (e.g., 10%).
  - Recommend promoting P2P as best-price channel for sellers (UI).
- NPC:
  - Provides instant liquidity but must be conservative.
  - Pricing:
    - base_price = EMA(last N P2P sales)
    - npc_buy = base * (1 - buy_margin - inv_adj)
    - npc_sell = base * (1 + sell_margin + inv_adj)
  - inv_adj = adjusts based on platform inventory (more inventory → wider discount)
  - Rules to avoid loss:
    - per-account caps, cooldowns, global daily caps
    - cooldowns preventing immediate flip from NPC buy to NPC sell
    - monitor NPC PnL and auto-adjust margins
- Anti-arbitrage:
  - newborn resale cooldown (24-72 hours)
  - listing cooldown after NPC buy
  - per-account daily breeding and NPC limits

Economy: sources, sinks & inflation control
- Sources:
  - Hog production (primary)
  - Event rewards/quests/referral bonuses (controlled)
  - NPC when players buy from NPC (platform receives coins)
- Sinks:
  - Consumable purchases (food, water, meds)
  - Structure repairs and durability decay
  - Marketplace fees, listing fees, breeding fees
  - Burns (small % on sales)
  - Subscriptions (fiat revenue)
- Simplified inflation model:
  - daily_minted = active_players * avg_hogs * coins_per_hog_per_day
  - daily_sunk = sum of consumable sales + fees + burns + breeding costs
  - net_daily_change = minted - sunk
  - Admin must target small positive net growth (e.g., +0.5% to +5% over 30 days) — auto-adjust price knobs if outside thresholds.
- Admin auto-adjust example:
  - 7-day inflation > +0.5% → increase consumable prices by 5% or increase burn %
  - 7-day inflation < -0.5% → reduce prices or add small rewards

Monetization & ads
- Primary:
  - Marketplace commission (recommended 10%)
  - Consumable sales (food, water, meds, repair kits)
  - Breeding/extraction fees
  - Subscriptions (Silver/Gold with production bonus and lower fees)
  - Featured listings / promotions
- Ads:
  - Rewarded ads: watch ad → small water pack or 3–5 coins (cap daily)
  - Banner/native ads and sponsor placements (use UX-friendly placements)
  - Ensure ad rewards do not undercut paid purchases

Anti-abuse and fraud controls
- Sign-up verification (email, optional phone for withdrawals later)
- Rate limits and CAPTCHAs
- Wash-trade detection heuristics: accounts transacting repeatedly within short windows
- Limits & cooldowns (breeding per-day cap, NPC caps, listing cooldowns)
- Append-only ledger + daily reconciliation
- Admin flagging & manual review tools

Data & DB guidance (key tables & fields)
- users (id, email, password_hash, display_name, subscription_tier, created_at)
- hogs/assets (id, user_id, breed, rarity, birth_time, maturity_age_days, senescence_age_days, max_lifespan_days, status, health, hunger, hydration, production_base, last_tick_at, metadata JSON)
- items (id, slug, name, type, base_cost_cents, production_rate, boost_percent, duration_hours, metadata)
- inventory (user_id, item_id, quantity)
- listings (id, seller_id, asset_id/item_id, price_cents, status)
- ledger_entries (id, user_id, asset='coin', change_amount, type, ref_id, created_at) — append-only
- pregnancies (id, mother_id, father_id NULLABLE, sperm_item_id NULLABLE, start_time, due_time, gestation_days, status, fee_cents, success_prob, result_count)
- sperm_items (id, owner_id, source_male_id, metadata, price_cents, creation_time, cooldown_until)
- admin_logs, fraud_flags, npc_state

Cron & worker responsibilities (outline)
- Hourly tick job:
  - For each active hog: update age/stage; compute production; create ledger entries; decrement hunger/hydration; update health & sickness.
  - For due pregnancies: run birth processor (litter size calc, stillbirths, newborn creation).
  - Update NPC EMA and adjust prices/inventory.
  - Aggregate metrics for admin dashboard.
- Daily jobs:
  - Reconcile ledger totals, backups, KPI reports, fraud rule batch checks.
- Async worker (queue):
  - Long-running tasks: mass notifications, large marketplace settlement, payout processing (future), heavy simulations.

Breeding & birth pseudocode (cron snippet)
```
for pregnancy in pregnancies.where(status='pregnant' and due_time <= now):
  if pregnancy.success_prob < random():
    mark pregnancy failed; optionally refund partial; notify owner; continue
  litter_size = draw_litter_size(mother.rarity, father.rarity)
  survivors = 0
  for i in 1..litter_size:
    if random() < stillbirth_chance(mother_health, care_level):
      log stillbirth
      continue
    baby = create_hog(owner=mother.owner, birth_time=now, initial_attrs)
    compute_baby_rarity(mother, father)
    survivors += 1
  update pregnancy.status='born', pregnancy.result_count=survivors
  set mother cooldown and update leaderboards/notifications
```

UI flows (essential screens)
- Landing & marketing page
- Signup/login & profile (with subscription)
- Dashboard: quick summary (coins, hogs, structures, market)
- My Hogs: list + individual hog card (age, health, hunger, hydration, stage, production, pregnancy status)
- Shop: buy seeds, food, water, meds, repair kits, sperm-items
- Breeding dialog: select mother, select male or sperm-item, show cost, success chance, expected litter range, confirm
- Marketplace: list item/hog, browse/filter, buy (P2P), instant NPC buy/sell
- Admin panel: economic knobs, KPIs, fraud logs, NPC settings

Balancing & tuning (how to run beta)
- Launch invite-only with small cohort (100–1,000).
- Use default parameters; monitor:
  - daily_minted vs daily_sunk
  - marketplace P2P vs NPC split
  - NPC PnL
  - sick/dead hog rates
  - retention & ARPU
- Adjust consumable prices, breeding fees, and NPC margins accordingly.
- Run simulator (recommended) to test 30/90-day inflation before large-scale release.

MVP roadmap (recommended)
- Phase 0 (design & policy) — now
- Phase 1 (4–6 weeks): auth, user dashboard, buy seeds (Stripe), single hog type, hourly accrual + ledger, simple inventory, P2P marketplace, admin knobs, basic anti-fraud
- Phase 2 (6–12 weeks): breeding (natural + sperm-cell), structures, water/repairs, sickness, subscriptions, NPC market, ads integration, deeper fraud detection
- Phase 3: scale, audits, possible tokenization/payout planning, mobile polish

Testing & safety checklist (before public)
- Unit tests for ledger invariants (sum of ledger per user == balance)
- Simulate 30/90 day economy scenarios (parameter sweeps)
- Staging environment with fake coins
- Load test hourly cron & marketplace under expected DAU
- Security: secrets in env, protect private keys (if used), HTTPS, 2FA for admin

Admin knobs (must be runtime-editable)
- tick_length (hours per game-day)
- production_base per rarity
- consumable prices (food, water, med)
- breeding_fee, extraction_cost
- gestation_days per rarity
- litter distributions per rarity
- newborn_resale_cooldown_hours
- npc_buy_margin, npc_sell_margin, npc_daily_cap, npc_inventory_target
- marketplace_fee_pct, listing_fee
- subscription tiers & bonuses
- death/sickness probabilities & health modifiers

Metrics to monitor
- DAU/MAU, retention D1/D7/D30
- avg_hogs_per_player
- daily_coins_minted, daily_coins_sunk, net_daily_change
- marketplace volume (P2P vs NPC), NPC PnL
- sick/dead hog counts
- fraud signals (wash-trade scores)
- ARPU, conversion rates

Next steps (choose one)
- I can produce a small economic simulator (Google Sheet or PHP script) to test 30/90-day inflation with your preferred input numbers. (Recommended.)
- I can produce the DB migration SQL for pregnancies & sperm_items and a secure CodeIgniter cron pseudocode (no full app code).
- I can design the breeding UI wireframes and copy for UX text and notifications.
- I can generate an admin panel spec with the three main knobs + alerts.

Please pick which artifact to create next:
- "Simulator (Google Sheet)" or "Simulator (PHP)"  
- "DB + Cron pseudocode"  
- "Breeding UI wireframes"  
- "Admin panel spec"

If you want the simulator, give 2–3 sample inputs (active_players, avg_hogs_per_player, production_per_hog_per_day) or I will use defaults.
```