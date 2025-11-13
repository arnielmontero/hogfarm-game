import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

// create app
const app = new PIXI.Application({
  width: 1024,
  height: 576,
  backgroundColor: 0xe9f5e9,
  resolution: window.devicePixelRatio || 1,
  resizeTo: window
});
document.getElementById('app').appendChild(app.view);

// viewport (camera)
const viewport = new Viewport({
  screenWidth: app.view.width,
  screenHeight: app.view.height,
  worldWidth: 2000,
  worldHeight: 2000,
  interaction: app.renderer.plugins.interaction
});
app.stage.addChild(viewport);
viewport.drag().pinch().wheel().decelerate();

// simple background grid
const grid = new PIXI.Graphics();
grid.lineStyle(1, 0xcfe6cf);
for (let x = 0; x < 2000; x += 64) grid.moveTo(x,0).lineTo(x,2000);
for (let y = 0; y < 2000; y += 64) grid.moveTo(0,y).lineTo(2000,y);
viewport.addChild(grid);

// load a placeholder texture (you can replace with your art)
PIXI.Assets.add('hog', 'https://pixijs.io/examples/examples/assets/bunny.png');

async function start() {
  await PIXI.Assets.load('hog');
  const texture = PIXI.Texture.from('hog');

  // create container for hogs
  const hogLayer = new PIXI.Container();
  viewport.addChild(hogLayer);

  // spawn function
  function spawnHog(x = Math.random()*800, y = Math.random()*600) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(0.8 + Math.random()*0.4);
    sprite.interactive = true;
    sprite.buttonMode = true;

    // simple drag
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

    // hover status
    sprite.on('pointerover', () => document.getElementById('status').textContent = 'Hog hovered');
    sprite.on('pointerout', () => document.getElementById('status').textContent = '');

    hogLayer.addChild(sprite);
    return sprite;
  }

  // spawn a few
  for (let i=0;i<3;i++) spawnHog(300 + i*80, 200 + i*40);

  document.getElementById('spawn').addEventListener('click', () => spawnHog(viewport.worldScreenLeft + 200, viewport.worldScreenTop + 200));
}

start();