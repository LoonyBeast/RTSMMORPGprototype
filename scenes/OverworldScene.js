import Scene from "../engine/Scene.js";
import { attachRenderAtlas } from "../engine/SceneRenderMixin.js";

const TILE_SIZE = 128;

export default class OverworldScene extends Scene {
  constructor(manager) {
    super(manager);
    this.sceneName = "overworld";
    attachRenderAtlas(this);

    if (!this.manager.player.location.minimap) {
      this.manager.player.location.minimap = { x: 0, y: 0 };
    }
  }

  getDescriptor() {
    return {
      viewport: { width: 640, height: 640, scaleMode: "fixed" },
      tile: { size: TILE_SIZE }
    };
  }

  getRenderSpec() {
    return { mode: "overworld", tileSize: TILE_SIZE };
  }

  update(dt, input) {
    if (input.isJustPressed("KeyE")) {
      this.manager.change("minimap");
      return;
    }

    if (input.isJustPressed("KeyW")) this.manager.translator.onOverworldMove(0, -1);
    if (input.isJustPressed("KeyS")) this.manager.translator.onOverworldMove(0, 1);
    if (input.isJustPressed("KeyA")) this.manager.translator.onOverworldMove(-1, 0);
    if (input.isJustPressed("KeyD")) this.manager.translator.onOverworldMove(1, 0);

    const updates = this.manager.translator.emitUpdatesForScene(this);
    this.applyUpdates(updates);
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const t of this.renderAtlas.tiles.values()) {
      ctx.fillStyle = t.color || "#000";
      ctx.fillRect(t.x - t.size/2, t.y - t.size/2, t.size, t.size);

      if (t.flags?.includes("active")) {
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 3;
        ctx.strokeRect(t.x - t.size/2 + 4, t.y - t.size/2 + 4, t.size - 8, t.size - 8);
        ctx.lineWidth = 1;
      }
    }

    if (this.renderAtlas.cursor) {
      const c = this.renderAtlas.cursor;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.strokeRect(c.x - c.size/2 + 2, c.y - c.size/2 + 2, c.size - 4, c.size - 4);
      ctx.lineWidth = 1;
    }

    if (this.renderAtlas.hud) {
      const h = this.renderAtlas.hud;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(10, 10, 310, 70);
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText(`O: ${h.O.x},${h.O.y}`, 20, 30);
      ctx.fillText(`M: ${h.M.x},${h.M.y}`, 20, 48);
      if (h.temperatureZone) ctx.fillText(`Temp: ${h.temperatureZone}`, 20, 66);
    }
  }
}