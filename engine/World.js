
/**
 * World v0.3.11
 * Spawn logic updated:
 * - Spawn tile selected from Temperate or Fresh zones
 * - Active flag applied to spawn tile
 * - World origin set to spawn tile
 */
export default class World {
  constructor() {
    this.minY = -22;
    this.maxY =  22;

    this.origin = { x: 0, y: 0 };
    this.tileMap = new Map();

    this._generateOverworld();
  }

  hasTile(x, y) { return this.tileMap.has(`${x},${y}`); }
  getTile(x, y) { return this.tileMap.get(`${x},${y}`) || null; }

  _generateOverworld() {
    const eqWidth = this._randInt(2, 4);
    const spineIndex = this._randInt(0, eqWidth - 1);

    const shift = -spineIndex;
    let left = 0 + shift;
    let right = (eqWidth - 1) + shift;

    this._emitRow(0, left, right);

    {
      let l = left;
      let r = right;
      for (let y = 1; y <= this.maxY; y++) {
        const edges = this._nextRowEdges(l, r);
        l = edges.left;
        r = edges.right;
        this._emitRow(y, l, r);
      }
    }

    {
      let l = left;
      let r = right;
      for (let y = -1; y >= this.minY; y--) {
        const edges = this._nextRowEdges(l, r);
        l = edges.left;
        r = edges.right;
        this._emitRow(y, l, r);
      }
    }

    const spawn = this._selectSpawnTile();
    this.origin.x = spawn.x;
    this.origin.y = spawn.y;
    spawn.flags.add("active");
  }

  _selectSpawnTile() {
    const validZones = new Set(["Temperate", "Fresh"]);
    const candidates = [];

    for (const tile of this.tileMap.values()) {
      if (validZones.has(tile.temperatureZone)) {
        candidates.push(tile);
      }
    }

    if (!candidates.length) {
      throw new Error("No valid spawn tiles found");
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  _nextRowEdges(prevLeft, prevRight) {
    while (true) {
      const dl = this._randInt(-2, 2);
      const dr = this._randInt(-2, 2);
      const left = prevLeft + dl;
      const right = prevRight + dr;

      if (right < left) continue;
      if (!(left <= 0 && 0 <= right)) continue;

      return { left, right };
    }
  }

  _emitRow(y, startX, endX) {
    const zone = this._tempZoneFromY(y);
    const color = this._colorFromZone(zone);

    for (let x = startX; x <= endX; x++) {
      const key = `${x},${y}`;
      this.tileMap.set(key, {
        id: key,
        x, y,
        world: { x, y },
        temperatureZone: zone,
        color,
        flags: new Set()
      });
    }
  }

  _tempZoneFromY(y) {
    const a = Math.abs(y);
    if (a <= 3) return "Extreme Heat";
    if (a <= 7) return "Hot";
    if (a <= 11) return "Warm";
    if (a <= 15) return "Temperate";
    if (a <= 19) return "Fresh";
    return "Cold";
  }

  _colorFromZone(zone) {
    switch (zone) {
      case "Extreme Heat": return "#e74c3c";
      case "Hot": return "#f39c12";
      case "Warm": return "#f1c40f";
      case "Temperate": return "#2ecc71";
      case "Fresh": return "#3498db";
      case "Cold": return "#9b59b6";
      default: return "#7f8c8d";
    }
  }

  _randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
