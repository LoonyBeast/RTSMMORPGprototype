// engine/WorldGenerator.js
//
// World generation with logical flags.
// The tile at (0,0) starts with the 'active' flag (spawn / focus tile).

const ROW_MIN_Y = -22;
const ROW_MAX_Y = 22;
const SPINE_X = 0;

const START_WIDTH_OPTIONS = [2, 3, 4];
const DELTA_MIN = -2;
const DELTA_MAX = 2;

function randomInt(min, max, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function tempZoneForY(y) {
  const ay = Math.abs(y);
  if (ay <= 3) return "extreme-heat";
  if (ay <= 7) return "hot";
  if (ay <= 11) return "warm";
  if (ay <= 15) return "temperate";
  if (ay <= 19) return "fresh";
  return "cold";
}

function tempColorForZone(zone) {
  switch (zone) {
    case "extreme-heat": return "#ff5a36";
    case "hot": return "#ffd34a";
    case "warm": return "#a4ff6a";
    case "temperate": return "#4caf50";
    case "fresh": return "#37c9c9";
    case "cold": return "#4a7dff";
    default: return "#888";
  }
}

function generateRowRanges(rng = Math.random) {
  const rows = new Map();

  const startWidth =
    START_WIDTH_OPTIONS[randomInt(0, START_WIDTH_OPTIONS.length - 1, rng)];
  const half = Math.floor((startWidth - 1) / 2);
  let startX0 = SPINE_X - half;
  let endX0 = startX0 + startWidth - 1;
  rows.set(0, { startX: startX0, endX: endX0 });

  function makeNextRow(prevRange) {
    let startX = prevRange.startX;
    let endX = prevRange.endX;

    startX += randomInt(DELTA_MIN, DELTA_MAX, rng);
    endX += randomInt(DELTA_MIN, DELTA_MAX, rng);

    if (SPINE_X < startX) startX = SPINE_X;
    if (SPINE_X > endX) endX = SPINE_X;
    if (endX < startX) endX = startX;

    return { startX, endX };
  }

  for (let y = 1; y <= ROW_MAX_Y; y++) {
    rows.set(y, makeNextRow(rows.get(y - 1)));
  }
  for (let y = -1; y >= ROW_MIN_Y; y--) {
    rows.set(y, makeNextRow(rows.get(y + 1)));
  }

  return rows;
}

export function generateWorld(rng = Math.random) {
  const rows = generateRowRanges(rng);
  const tiles = [];
  const tileMap = new Map();

  for (let y = ROW_MIN_Y; y <= ROW_MAX_Y; y++) {
    const range = rows.get(y);
    if (!range) continue;

    for (let x = range.startX; x <= range.endX; x++) {
      const tile = {
        x,
        y,
        tempZone: tempZoneForY(y),
        color: tempColorForZone(tempZoneForY(y)),
        flags: new Set()
      };

      // Initial active tile (spawn)
      if (x === 0 && y === 0) {
        tile.flags.add("active");
      }

      tiles.push(tile);
      tileMap.set(`${x},${y}`, tile);
    }
  }

  return { tiles, tileMap, rows };
}
