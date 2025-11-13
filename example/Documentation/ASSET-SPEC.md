```markdown
# HogFarm — Asset & Sprite Specification (starter)

Purpose
- Provide clear, consistent asset guidelines for sprites, atlases, naming, and optimization. Share this with artists or use it to produce placeholder art.

General guidelines
- Style: cartoony, rounded shapes, high contrast against background.
- Color palette: farm greens, warm browns, soft pastel accents.
- Export format: PNG or WebP for sprites; SVG for icons.
- Atlas: pack related sprites into texture atlases using TexturePacker. Aim for fewer atlas files to reduce HTTP requests.

Tile & grid
- Tile size (game grid): 64 × 64 px
- Farm scene base resolution: 1280 × 720 (design reference)
- Tile assets: ground tiles, grass, water tile, trough tile, 3–4 variations per tile for visual variety.

Hog sprites (per rarity)
- Source cell size: 128 × 128 px (artist works at 2× or 3×, export scaled)
- Animations (per hog):
  - idle — 4 frames
  - walk — 6–8 frames
  - eat — 4 frames
  - sick — idle tinted / cough frame
  - pregnant overlay — small belly pulse or icon (separate sprite)
  - birth / celebration — particle sprites (confetti)
- States: include a separate frame or small icon for pregnant/sick/dead.
- Variants: common, uncommon, rare, epic, legendary — color/badge differences and slightly different sprites.

Structure sprites
- Barn: 3 × 2 tiles (192 × 128 px)
- Well: 1 × 1 tile
- Trough: 1 × 1 tile
- Medical stall: 2 × 1 tiles
- Provide at least two animation frames for small actions (e.g., water pumping).

UI icons
- Icons as SVG for HUD: feed, water, med, breed, list, buy, sell, coins, settings.
- Sizes: 24px, 32px, 48px variants; use icon font or inline SVG.

Particle & effect assets
- Feed sparkle: 8–12 particle PNGs or simple circle shapes generated via PIXI.
- Birth confetti: 6 small colored ribbon sprites.

Naming conventions
- sprites/hogs/{rarity}/{hog_name}_idle_{01}.png
- sprites/hogs/{rarity}/{hog_name}_walk_{01}.png
- sprites/structures/barn_lvl1.png
- sprites/ui/icon_feed.svg
- atlases/hogs_common.json (and .png)
- audio/feed.ogg, audio/birth.ogg, audio/click.ogg

Atlas & packing tips
- Use a single atlas for all hog variants initially to reduce texture swaps.
- Maintain a manifest JSON that maps logical names → atlas frame names.
- Avoid extremely large atlases; keep each atlas under ~4k x 4k if possible.

Optimization
- Compress PNGs (pngquant) or use WebP where browser support allows.
- Trim empty transparent pixels (TexturePacker does this).
- Use lower frame counts for low-tier devices; consider providing LOD sprite sets.

Deliverable checklist (artist handoff)
- [ ] Atlases (PNG + JSON)
- [ ] Individual PNGs for icons (SVG + PNG fallback)
- [ ] Audio files (OGG preferred)
- [ ] Particle sprites (small)
- [ ] Asset manifest (frame names)
- [ ] Example render tests (PNG previews)

If you want, I can produce a sample atlas manifest and a tiny placeholder spritesheet you can use for dev.
```