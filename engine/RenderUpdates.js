export const UpdateKind = Object.freeze({
  TILE_UPSERT: "tile:upsert",
  TILE_REMOVE: "tile:remove",
  ENTITY_UPSERT: "entity:upsert",
  ENTITY_REMOVE: "entity:remove",
  CURSOR_SET: "cursor:set",
  HUD_SET: "hud:set"
});

export function tileUpsert(payload) { return { kind: UpdateKind.TILE_UPSERT, payload }; }
export function tileRemove(id) { return { kind: UpdateKind.TILE_REMOVE, payload: { id } }; }

export function entityUpsert(payload) { return { kind: UpdateKind.ENTITY_UPSERT, payload }; }
export function entityRemove(id) { return { kind: UpdateKind.ENTITY_REMOVE, payload: { id } }; }

export function cursorSet(payload) { return { kind: UpdateKind.CURSOR_SET, payload }; }
export function hudSet(payload) { return { kind: UpdateKind.HUD_SET, payload }; }