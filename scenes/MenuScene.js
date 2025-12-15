// scenes/MenuScene.js
//
// Demo pause menu.
// DEL toggles back to overworld.
// WorldScene transition removed.

import Scene from "../engine/Scene.js";

export default class MenuScene extends Scene {
  update(dt, input) {
    if (input.isJustPressed("Delete")) {
      this.manager.change("overworld");
    }
  }

  draw(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED (Demo Menu)", ctx.canvas.width / 2, ctx.canvas.height / 2 - 20);

    ctx.font = "14px sans-serif";
    ctx.fillText(
      "Press DEL to return to overworld",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 + 20
    );
  }
}
