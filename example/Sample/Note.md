How to run this scaffold

Install & run:
npm install
npm run dev
Open localhost (Vite default URL) and you’ll see a simple grid and interactive sprites. This is your playground.
Progression exercises (with time estimates)

1 hour: Run scaffold, spawn hog, drag to move.
2–3 hours: Load a sprite sheet, animate AnimatedSprite (idle/walk).
4–6 hours: Implement simple roam AI inside a rectangular pen.
4–8 hours: Add pixi-viewport and camera pan/zoom (already in scaffold).
4–8 hours: Implement drag item from DOM into canvas (feed interaction).
6–10 hours: Implement AnimatedSprite using atlas, and create particle emitter for feed/birth.
6–12 hours: Build a mini scene with HUD overlay + pregnancy timer mock.
Debugging & tips

Use browser devtools and watch console for Pixi errors (texture size issues).
Use small images while developing to avoid long load times and memory pressure.
Destroy textures you no longer need: texture.destroy(true) — avoid leaks.
For mobile, test on a real device and enable devicePixelRatio scaling carefully.
Profile with Chrome DevTools -> Performance and Memory panels; watch draw calls and JS time.
If you need tilemaps, start with simple Graphics rectangles before optimizing with a tilemap plugin.
Learning resources

PIXI docs & examples: https://pixijs.com and https://pixijs.io/examples/
pixi-viewport: https://github.com/davidfig/pixi-viewport
PIXI AnimatedSprite guide: docs and example galleries
Phaser docs (if you choose Phaser): https://phaser.io
TexturePacker: https://www.codeandweb.com/texturepacker (create atlases)
Tutorials & videos: search "Pixi.js tutorial" and "Phaser 3 tutorial" on YouTube for many step-by-step guides
Next steps — pick one

I can create a Phaser scaffold instead (if you prefer Phaser); say "Create Phaser scaffold".
I can expand the PIXI scaffold into a small starter project with a sample hog spritesheet, animated states and feed interaction; say "Expand PIXI starter".
I can produce a short checklist PDF or Google Sheet practice tracker for the 2-week learning plan; say "Create practice tracker". Which would you like me to prepare next?