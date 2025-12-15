export default class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scenes = new Map();
    this.current = null;

    this.player = null;
    this.translator = null;
    this._sharedWorld = null;
  }

  register(name, SceneClass) {
    this.scenes.set(name, SceneClass);
  }

  change(name) {
    const SceneClass = this.scenes.get(name);
    if (!SceneClass) throw new Error(`Scene not registered: ${name}`);

    this.current = new SceneClass(this);
    this.applySceneDescriptor(this.current);
  }

  applySceneDescriptor(scene) {
    if (!scene.getDescriptor) return;
    const desc = scene.getDescriptor();
    if (!desc || !desc.viewport) return;

    const { width, height } = desc.viewport;
    if (width && height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  update(dt, input) {
    if (this.current && this.current.update) {
      this.current.update(dt, input);
    }
  }

  draw() {
    if (this.current && this.current.draw) {
      this.current.draw(this.ctx);
    }
  }
}