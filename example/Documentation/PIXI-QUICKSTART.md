```markdown
# PIXI Quickstart — Minimal Project Scaffold & Steps

This file gives you a minimal runnable PIXI + pixi-viewport scaffold and the exact files to create. Use it to practice quickly.

Project structure (minimal)
- package.json
- index.html
- src/
  - main.js
  - assets/ (put test images here)

package.json (example)
```json
{
  "name": "pixi-practice",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pixi.js": "^7.2.0",
    "pixi-viewport": "^4.40.0"
  },
  "devDependencies": {
    "vite": "^4.0.0"
  }
}
```

index.html (minimal)
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Pixi Practice</title>
    <style>
      html,body,#app { width:100%; height:100%; margin:0; padding:0; background:#e9f5e9; }
      #ui { position:absolute; top:10px; left:10px; z-index:10; font-family:sans-serif; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <div id="ui">
      <button id="spawn">Spawn Hog</button>
      <span id="status"></span>
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

src/main.js (minimal interactive example)
```javascript
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

const app = new PIXI.Application({
  width: 1024,
  height: 576,
  backgroundColor: 0xe9f5e9,
  resolution: window.devicePixelRatio || 1,
  resizeTo: window
});
document.getElementById('app').appendChild(app.view);

const viewport = new Viewport({
  screenWidth: app.view.width,
  screenHeight: app.view.height,
  worldWidth: 2000,
  worldHeight: 2000,
  interaction: app.renderer.plugins.interaction
});
app.stage.addChild(viewport);
viewport.drag().pinch().wheel().decelerate();

const grid = new PIXI.Graphics();
grid.lineStyle(1, 0xcfe6cf);
for (let x = 0; x < 2000; x += 64) grid.moveTo(x,0).lineTo(x,2000);
for (let y = 0; y < 2000; y += 64) grid.moveTo(0,y).lineTo(2000,y);
viewport.addChild(grid);

PIXI.Assets.add('hog', 'https://pixijs.io/examples/examples/assets/bunny.png');

async function start() {
  await PIXI.Assets.load('hog');
  const texture = PIXI.Texture.from('hog');

  const hogLayer = new PIXI.Container();
  viewport.addChild(hogLayer);

  function spawnHog(x = Math.random()*800, y = Math.random()*600) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(0.8 + Math.random()*0.4);
    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite.on('pointerdown', (e) => {
      sprite.data = e.data;
      sprite.dragging = true;
      sprite.alpha = 0.9;
    });
    sprite.on('pointerup', () => {
      sprite.dragging = false;
      sprite.data = null;
      sprite.alpha = 1;
    });
    sprite.on('pointermove', () => {
      if (sprite.dragging) {
        const newPos = sprite.data.getLocalPosition(hogLayer);
        sprite.x = newPos.x;
        sprite.y = newPos.y;
      }
    });

    sprite.on('pointerover', () => document.getElementById('status').textContent = 'Hog hovered');
    sprite.on('pointerout', () => document.getElementById('status').textContent = '');

    hogLayer.addChild(sprite);
    return sprite;
  }

  for (let i=0;i<3;i++) spawnHog(300 + i*80, 200 + i*40);

  document.getElementById('spawn').addEventListener('click', () => spawnHog(viewport.worldScreenLeft + 200, viewport.worldScreenTop + 200));
}

start();
```

Run dev
- `npm install`
- `npm run dev`
- Open the local dev URL printed by Vite in your browser.

Next steps from this scaffold
- Replace placeholder image with your hog spritesheet
- Create an AnimatedSprite using frames from an atlas
- Add a HUD DOM overlay and wire feed button to spawn a particle effect
- Add a simple "roam" behavior so hogs wander inside a bounded rectangle
```