import Scene from "../engine/Scene.js";

export default class DebugToolsScene extends Scene {
  constructor(manager) {
    super(manager);
    this.debug = manager.debug;
    this.items = [
      { key: "showHUD", label: "Detailed HUD" },
      { key: "showInTileCoords", label: "In-tile coords overlay" }
    ];
    this.index = 0;
  }

  update(dt, input) {
    if (input.isJustPressed("F1")) {
      this.manager.closeOverlay();
      return;
    }

    if (input.isJustPressed("KeyW")) {
      this.index = (this.index - 1 + this.items.length) % this.items.length;
    }
    if (input.isJustPressed("KeyS")) {
      this.index = (this.index + 1) % this.items.length;
    }
    if (input.isJustPressed("Enter")) {
      const item = this.items[this.index];
      this.debug[item.key] = !this.debug[item.key];
    }
  }

  draw(ctx) {
    // translucent overlay
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;

    ctx.fillStyle = "#fff";
    ctx.font = "18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("DEBUG TOOLS (F1)", cx, cy - 80);

    ctx.font = "14px monospace";
    ctx.fillText("W/S navigate · Enter toggle · F1 close", cx, cy - 50);

    let y = cy;
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      ctx.fillStyle = i === this.index ? "#ffd700" : "#ccc";
      ctx.fillText(
        `${i === this.index ? ">" : " "} ${it.label}: ${this.debug[it.key] ? "ON" : "OFF"}`,
        cx, y
      );
      y += 30;
    }
    ctx.textAlign = "start";
  }
}