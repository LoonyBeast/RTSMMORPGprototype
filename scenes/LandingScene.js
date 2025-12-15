import Scene from "../engine/Scene.js";

export default class LandingScene extends Scene {
  constructor(manager) {
    super(manager);
    this.sceneName = "landing";

    // Menu model (expand later)
    this.options = [
      { id: "demo", label: "Demo", enabled: true },
      { id: "login", label: "Login", enabled: false }
    ];
    this.selected = 0;

    // Tooltip cycle: show 3s (fade in last 1s), repeat every 10s
    this.tipCycle = 0; // seconds, wraps at 10
    this.tipPeriod = 10;
    this.tipVisible = 3;

    // Short feedback message (e.g., Login not available)
    this.toast = null; // { text, t }
  }

  getDescriptor() {
    return {
      mode: "menu",
      viewport: { width: 800, height: 600, scaleMode: "responsive" }
    };
  }

  _justPressedMenuNav(input, codeA, codeB) {
    return input.isJustPressed(codeA) || input.isJustPressed(codeB);
  }

  update(dt, input) {
    // Menu navigation: WASD + Arrow keys (menus only)
    if (this._justPressedMenuNav(input, "KeyW", "ArrowUp"))
      this.selected = (this.selected - 1 + this.options.length) % this.options.length;
    if (this._justPressedMenuNav(input, "KeyS", "ArrowDown"))
      this.selected = (this.selected + 1) % this.options.length;

    // Optional horizontal aliases
    if (this._justPressedMenuNav(input, "KeyA", "ArrowLeft"))
      this.selected = (this.selected - 1 + this.options.length) % this.options.length;
    if (this._justPressedMenuNav(input, "KeyD", "ArrowRight"))
      this.selected = (this.selected + 1) % this.options.length;

    // Select
    const enter = input.isJustPressed("Enter") || input.isJustPressed("NumpadEnter");
    if (enter) {
      const opt = this.options[this.selected];
      if (opt.id === "demo") {
        this.manager.change("overworld");
        return;
      }
      // Login placeholder
      this.toast = { text: "Login: coming soon", t: 2.2 };
    }

    // Tooltip cycle timer
    this.tipCycle += dt;
    if (this.tipCycle >= this.tipPeriod) this.tipCycle -= this.tipPeriod;

    // Toast timer
    if (this.toast) {
      this.toast.t -= dt;
      if (this.toast.t <= 0) this.toast = null;
    }
  }

  _tooltipAlpha() {
    // Visible for first 3s of cycle; fade out during last 1s
    if (this.tipCycle > this.tipVisible) return 0;
    const t = this.tipCycle;
    if (t <= 2) return 1;
    // t in (2..3): fade 1 -> 0
    return Math.max(0, 1 - (t - 2) / 1);
  }

  draw(ctx) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    // Background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("RTS MMORPG", w / 2, h * 0.30);

    // Menu box
    const boxW = 360;
    const boxH = 150;
    const bx = w / 2 - boxW / 2;
    const by = h * 0.38;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(bx, by, boxW, boxH);

    // Options
    ctx.font = "20px sans-serif";
    for (let i = 0; i < this.options.length; i++) {
      const opt = this.options[i];
      const y = by + 45 + i * 45;

      // highlight selected
      if (i === this.selected) {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(bx + 18, y - 26, boxW - 36, 34);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx + 18, y - 26, boxW - 36, 34);
        ctx.lineWidth = 1;
      }

      ctx.fillStyle = opt.enabled ? "#fff" : "rgba(255,255,255,0.45)";
      ctx.fillText(opt.label, w / 2, y);
    }

    // Tooltip (cycles every 10s)
    const a = this._tooltipAlpha();
    if (a > 0.01) {
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(0,0,0,0.60)";
      ctx.fillRect(w/2 - 260, h - 110, 520, 46);
      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.fillText("Menu keys: WASD / Arrow Keys   |   Select: Enter", w / 2, h - 80);
      ctx.globalAlpha = 1;
    }

    // Toast feedback
    if (this.toast) {
      ctx.fillStyle = "rgba(0,0,0,0.60)";
      ctx.fillRect(w/2 - 160, h - 160, 320, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.fillText(this.toast.text, w / 2, h - 132);
    }

    // Debug: scene name (kept as requested)
    ctx.fillStyle = "#fff";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Scene: ${this.sceneName}`, 12, h - 12);
    ctx.textAlign = "center";
  }
}