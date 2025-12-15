export default class RenderAtlas {
  constructor() {
    this.tiles = new Map();     // id -> {id, x, y, size, color, flags}
    this.entities = new Map();  // id -> {id, type, x, y, size, color, flags}
    this.cursor = null;         // {x, y, size}
    this.hud = null;            // {O:{x,y}, M:{x,y}, G:{x,y}?, temperature?}
  }
}