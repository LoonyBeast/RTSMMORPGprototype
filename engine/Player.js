export default class Player {
  constructor() {
    this.id = "player";

    // Entity state must be valid immediately at construction
    this.location = {
      overworld: { x: 0, y: 0 },
      minimap: { x: 0, y: 0 },
      ingame: null
    };

    this.type = "player";
  }
}