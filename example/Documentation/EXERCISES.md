```markdown
# Practice Exercises — Progressive Tasks & Acceptance Criteria

This file lists practical exercises you should complete to gain confidence before starting the frontend sprints. Each exercise builds on the previous one.

Exercise 1 — Hello Pixi (30–60 min)
- Goal: Run the PIXI scaffold and render one sprite.
- Steps:
  - Start the dev server.
  - Confirm the grid and an interactive sprite appear.
  - Make the sprite movable via drag.
- Acceptance:
  - You can spawn and drag a sprite; no console errors.

Exercise 2 — Sprite Animation (1–3 hours)
- Goal: Load an atlas or frame sequence and play an animation (idle → walk).
- Steps:
  - Create a spritesheet (or use sample).
  - Use `PIXI.AnimatedSprite` to play idle loop.
  - On click, switch to walk animation for 2 seconds then return to idle.
- Acceptance:
  - Smooth animation playback, frame transitions do not flash blank frames.

Exercise 3 — Camera & Viewport (1–3 hours)
- Goal: Implement pan & zoom with `pixi-viewport`.
- Steps:
  - Add pan by drag and zoom by wheel (desktop) and pinch (mobile).
  - Clamp camera to farm bounds.
- Acceptance:
  - Camera cannot pan outside farm bounds; zoom limits set.

Exercise 4 — Drag-to-feed (2–4 hours)
- Goal: Implement drag an inventory item (DOM) into canvas to feed a hog.
- Steps:
  - Create a small HTML inventory item (food icon).
  - Drag it and drop on hog sprite; detect collision in PIXI and play feed animation + particle.
  - Trigger a mock API call (fetch to local JSON) and show a toast on response.
- Acceptance:
  - Drag & drop works on desktop & mobile; particle plays and mock API returns success.

Exercise 5 — Roaming AI (3–6 hours)
- Goal: Implement simple wandering inside a pen.
- Steps:
  - Give hog a rectangular pen area.
  - Implement a small FSM: idle → choose target → walk → idle.
  - Use simple linear interpolation for movement; flip sprite horizontally for direction.
- Acceptance:
  - Hog wanders naturally without leaving pen; no pathing collisions required.

Exercise 6 — Pregnancy UI (2–4 hours)
- Goal: Implement breeding dialog and pregnancy countdown with mock backend.
- Steps:
  - Create a modal to select mother & male or sperm-item.
  - Show expected litter range and success chance.
  - Create a pregnancy record in mock server and show countdown on mother card.
- Acceptance:
  - Countdown updates every tick; pregnancy icon visible on mother.

Exercise 7 — Mini demo: Farm card (4–8 hours)
- Goal: Combine above skills into a small demo:
  - Grid background, 3 hogs roaming, inventory with food, drag-to-feed works, breeding dialog works with mock responses, HUD shows coins that increase on production (mock).
- Acceptance:
  - All interactions are present and stable on desktop and mobile.

Testing & validation
- Test on desktop and at least one mobile device.
- Use Chrome DevTools to throttle network and simulate slow connections.
- Validate memory usage: no increasing memory leak when spawning/destroying sprites.

When you finish the exercises
- Write a short 1-page note: what you learned, what felt hard, and 3 things to improve before sprint work starts.
```