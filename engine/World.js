/**
 * World v0.3.10
 * Overworld generation rules (design spec):
 * - Fixed height: 45 rows (y = -22..+22), equator at y=0
 * - Start at equator with contiguous width 2..4
 * - Choose a spine tile in equator -> becomes x=0 (world center)
 * - Every row must include spine x=0
 * - Each adjacent row expands/contracts organically:
 *     leftEdgeDelta  in [-2..+2]
 *     rightEdgeDelta in [-2..+2]
 *   ensuring width >= 1 and spine remains included.
 * - Temperature is deterministic from |y| bands only.
 *
 * NOTE: RNG is currently Math.random(); seed support will be added later.
 */
export default class World {
  constructor() {
    this.minY = -22;
    this.maxY =  22;

    // world "origin" (spine key)
    this.origin = { x: 0, y: 0 };

    // Authoritative overworld atlas storage
    this.tileMap = new Map(); // key "x,y" -> tile object

    this._generateOverworld();
  }

  // --------- Public helpers ----------
  hasTile(x, y) { return this.tileMap.has(`${x},${y}`); }
  getTile(x, y) { return this.tileMap.get(`${x},${y}`) || null; }

  // --------- Generation ----------
  _generateOverworld() {
    // 1) Equator row (y=0) width 2..4 contiguous
    const eqWidth = this._randInt(2, 4);
    const spineIndex = this._randInt(0, eqWidth - 1);

    // Equator row before shifting is x = 0..eqWidth-1
    // Shift so chosen spine becomes x=0
    const shift = -spineIndex;
    let left = 0 + shift;
    let right = (eqWidth - 1) + shift;

    // Build equator tiles
    this._emitRow(0, left, right);

    // 2) Generate north (y=+1..+22) from equator edges
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

    // 3) Generate south (y=-1..-22) from equator edges (independent organic shape)
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

    // Mark active tile at origin
    const active = this.getTile(this.origin.x, this.origin.y);
    if (active) active.flags.add("active");
  }

  _nextRowEdges(prevLeft, prevRight) {
    while (true) {
      const dl = this._randInt(-2, 2);
      const dr = this._randInt(-2, 2);
      const left = prevLeft + dl;
      const right = prevRight + dr;

      if (right < left) continue;
      const width = right - left + 1;
      if (width < 1) continue;
      if (!(left <= 0 && 0 <= right)) continue; // spine must exist

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
        world: { x, y },              // explicit world coords (NOT array coords)
        temperatureZone: zone,        // deterministic
        color,
        flags: new Set()
      });
    }
  }

  // --------- Temperature ----------
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
      case "Hot":          return "#f39c12";
      case "Warm":         return "#f1c40f";
      case "Temperate":    return "#2ecc71";
      case "Fresh":        return "#3498db";
      case "Cold":         return "#9b59b6";
      default:             return "#7f8c8d";
    }
  }

  // --------- RNG helpers ----------
  _randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}