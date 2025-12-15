import {
  tileUpsert, tileRemove,
  entityRemove,
  cursorSet, hudSet
} from "./RenderUpdates.js";

/**
 * Translator v0.3.10
 * - Pulls truth from World + Entities
 * - Emits render updates for ONLY the visible overworld window (5x5)
 * - Minimap remains 20x20 derived from active overworld tile
 */
export default class Translator {
  constructor(player, world) {
    this.player = player;
    this.world = world;
    this._cache = new Map(); // sceneName -> { tiles:Set, entities:Set, hudKey:string }
  }

  onOverworldMove(dx, dy) {
    const ow = this.player.location.overworld;
    const nx = ow.x + dx;
    const ny = ow.y + dy;

    const next = this.world?.getTile(nx, ny);
    if (!next) return;

    const cur = this.world.getTile(ow.x, ow.y);
    if (cur) cur.flags.delete("active");
    next.flags.add("active");

    ow.x = nx;
    ow.y = ny;
  }

  onMinimapMove(dx, dy) {
    const mm = this.player.location.minimap;
    if (!mm) return;

    let nx = mm.x + dx;
    let ny = mm.y + dy;

    const TILE = 20;

    if (nx < 0) { this.onOverworldMove(-1, 0); nx = TILE - 1; }
    if (nx >= TILE) { this.onOverworldMove(1, 0); nx = 0; }
    if (ny < 0) { this.onOverworldMove(0, -1); ny = TILE - 1; }
    if (ny >= TILE) { this.onOverworldMove(0, 1); ny = 0; }

    mm.x = nx;
    mm.y = ny;
  }

  emitUpdatesForScene(scene) {
    const name = scene.sceneName || scene.constructor?.name || "scene";
    const prev = this._cache.get(name) || { tiles: new Set(), entities: new Set(), hudKey: "" };

    const spec = scene.getRenderSpec ? scene.getRenderSpec() : null;
    const canvas = scene.manager?.canvas;

    const updates = [];
    const curTiles = new Set();
    const curEntities = new Set();

    if (!spec || !canvas) {
      for (const id of prev.tiles) updates.push(tileRemove(id));
      for (const id of prev.entities) updates.push(entityRemove(id));
      prev.tiles = curTiles;
      prev.entities = curEntities;
      prev.hudKey = "";
      this._cache.set(name, prev);
      return updates;
    }

    if (spec.mode === "overworld") {
      const tileSize = spec.tileSize;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const p = this.player.location.overworld;

      // 640x640 with 128px tiles => 5x5 window
      const R = 2;

      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const tx = p.x + dx;
          const ty = p.y + dy;
          const tile = this.world?.getTile(tx, ty);
          if (!tile) continue;

          const id = `${tx},${ty}`;
          curTiles.add(id);

          const sx = centerX + dx * tileSize;
          const sy = centerY + dy * tileSize;

          updates.push(tileUpsert({
            id,
            x: sx,
            y: sy,
            size: tileSize,
            color: tile.color,
            flags: Array.from(tile.flags || []),
          }));
        }
      }

      updates.push(cursorSet({ x: centerX, y: centerY, size: tileSize }));

      const mm = this.player.location.minimap;
      const active = this.world?.getTile(p.x, p.y);
      const hud = {
        O: { x: p.x, y: p.y },
        M: mm ? { x: mm.x, y: mm.y } : { x: null, y: null },
        temperatureZone: active?.temperatureZone ?? null
      };

      const hudKey = JSON.stringify(hud);
      if (hudKey !== prev.hudKey) {
        updates.push(hudSet(hud));
        prev.hudKey = hudKey;
      }

    } else if (spec.mode === "minimap") {
      const tileSize = spec.tileSize;
      const grid = 20;

      const ow = this.player.location.overworld;
      const activeTile = this.world?.getTile(ow.x, ow.y);
      const baseColor = activeTile ? activeTile.color : "#000";

      for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
          const id = `mm:${x},${y}`;
          curTiles.add(id);

          const sx = x * tileSize + tileSize / 2;
          const sy = y * tileSize + tileSize / 2;

          updates.push(tileUpsert({
            id,
            x: sx,
            y: sy,
            size: tileSize,
            color: baseColor,
            flags: []
          }));
        }
      }

      const mm = this.player.location.minimap;
      if (mm) {
        const cx = mm.x * tileSize + tileSize / 2;
        const cy = mm.y * tileSize + tileSize / 2;
        updates.push(cursorSet({ x: cx, y: cy, size: tileSize }));
      }

      const hud = {
        O: { x: ow.x, y: ow.y },
        M: mm ? { x: mm.x, y: mm.y } : { x: null, y: null }
      };
      const hudKey = JSON.stringify(hud);
      if (hudKey !== prev.hudKey) {
        updates.push(hudSet(hud));
        prev.hudKey = hudKey;
      }
    }

    for (const id of prev.tiles) if (!curTiles.has(id)) updates.push(tileRemove(id));
    for (const id of prev.entities) if (!curEntities.has(id)) updates.push(entityRemove(id));

    prev.tiles = curTiles;
    prev.entities = curEntities;
    this._cache.set(name, prev);
    return updates;
  }
}