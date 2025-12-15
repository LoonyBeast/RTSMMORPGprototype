import Scene from "../engine/Scene.js";
import { attachRenderAtlas } from "../engine/SceneRenderMixin.js";

const CELL_SIZE = 32;

export default class MinimapScene extends Scene {
  constructor(manager) {
    super(manager);
    this.sceneName = "minimap";
    attachRenderAtlas(this);

    if (!this.manager.player.location.minimap) {
      this.manager.player.location.minimap = { x: 0, y: 0 };
    }
  }

  getDescriptor() {
    return {
      viewport: {
        width: 640,
        height: 640,
        scaleMode: "fixed"
      },
      grid: { width: 20, height: 20 },
      tile: { size: CELL_SIZE }
    };
  }

  getRenderSpec() {
    return { mode: "minimap", tileSize: CELL_SIZE };
  }

  update(dt, input) {
    if (input.isJustPressed("Escape") || input.isJustPressed("KeyE")) {
      this.manager.change("overworld");
      return;
    }

    if (input.isJustPressed("KeyW")) this.manager.translator.onMinimapMove(0, -1);
    if (input.isJustPressed("KeyS")) this.manager.translator.onMinimapMove(0, 1);
    if (input.isJustPressed("KeyA")) this.manager.translator.onMinimapMove(-1, 0);
    if (input.isJustPressed("KeyD")) this.manager.translator.onMinimapMove(1, 0);

    const updates = this.manager.translator.emitUpdatesForScene(this);
    this.applyUpdates(updates);
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const t of this.renderAtlas.tiles.values()) {
      ctx.fillStyle = t.color || "#000";
      ctx.fillRect(t.x - t.size/2, t.y - t.size/2, t.size, t.size);
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.strokeRect(t.x - t.size/2, t.y - t.size/2, t.size, t.size);
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
      ctx.fillRect(10, 10, 280, 55);
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText(`O: ${h.O.x},${h.O.y}`, 20, 30);
      ctx.fillText(`M: ${h.M.x},${h.M.y}`, 20, 48);
    }
  }
}