export default class InputManager {
  constructor() {
    this.keysDown = new Set();
    this.justPressed = new Set();

    window.addEventListener("keydown", e => {
      // HOTFIX: prevent browser-reserved keys
      if (e.code === "F1") {
        e.preventDefault();
      }

      if (!this.keysDown.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener("keyup", e => {
      this.keysDown.delete(e.code);
    });
  }

  isDown(code) {
    return this.keysDown.has(code);
  }

  isJustPressed(code) {
    return this.justPressed.has(code);
  }

  endFrame() {
    this.justPressed.clear();
  }
}