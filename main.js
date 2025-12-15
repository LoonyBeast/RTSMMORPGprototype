
import SceneManager from "./engine/SceneManager.js";
import InputManager from "./engine/InputManager.js";
import Translator from "./engine/Translator.js";
import Player from "./engine/Player.js";
import World from "./engine/World.js";

import LandingScene from "./scenes/LandingScene.js";
import OverworldScene from "./scenes/OverworldScene.js";
import MinimapScene from "./scenes/MinimapScene.js";

const canvas = document.getElementById("gameCanvas");

const sceneManager = new SceneManager(canvas);
const input = new InputManager();

const world = new World();
const player = new Player();

// Sync player spawn with world spawn
player.location.overworld.x = world.origin.x;
player.location.overworld.y = world.origin.y;

const translator = new Translator(player, world);

sceneManager.player = player;
sceneManager.translator = translator;
sceneManager.world = world;

sceneManager.register("landing", LandingScene);
sceneManager.register("overworld", OverworldScene);
sceneManager.register("minimap", MinimapScene);

sceneManager.change("landing");

let last = 0;
function loop(ts) {
  const dt = (ts - last) / 1000;
  last = ts;

  sceneManager.update(dt, input);
  sceneManager.draw();
  input.endFrame();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
