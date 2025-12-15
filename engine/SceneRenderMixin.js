import RenderAtlas from "./RenderAtlas.js";
import { UpdateKind } from "./RenderUpdates.js";

export function attachRenderAtlas(scene) {
  if (!scene.renderAtlas) scene.renderAtlas = new RenderAtlas();

  // Apply updates coming from Translator. Scenes MUST NOT compute truth here.
  scene.applyUpdates = function(updates) {
    if (!updates || updates.length === 0) return;

    for (const u of updates) {
      switch (u.kind) {
        case UpdateKind.TILE_UPSERT: {
          const t = u.payload;
          this.renderAtlas.tiles.set(t.id, t);
          break;
        }
        case UpdateKind.TILE_REMOVE: {
          this.renderAtlas.tiles.delete(u.payload.id);
          break;
        }
        case UpdateKind.ENTITY_UPSERT: {
          const e = u.payload;
          this.renderAtlas.entities.set(e.id, e);
          break;
        }
        case UpdateKind.ENTITY_REMOVE: {
          this.renderAtlas.entities.delete(u.payload.id);
          break;
        }
        case UpdateKind.CURSOR_SET: {
          this.renderAtlas.cursor = u.payload;
          break;
        }
        case UpdateKind.HUD_SET: {
          this.renderAtlas.hud = u.payload;
          break;
        }
      }
    }
  };

  return scene;
}