/**
 * World — Tile-based world map generator
 *
 * Generates a procedural RPG world with:
 *  - Grass plains with scattered flowers
 *  - Dirt paths connecting key locations
 *  - Water features (ponds, rivers)
 *  - Trees (impassable) scattered in forest areas
 *  - Buildings (houses, shops)
 *  - Walls / rocks
 */
import { TileType, WORLD_COLS, WORLD_ROWS, TILE_SIZE } from '../core/types';

/** The world tile grid (exported for collision checks in Player/Enemy) */
export let worldTiles: TileType[][] = [];

// ─── Seeded random number generator ─────────────────────────────────────────
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate the world tile map */
export function generateWorld(seed: number = 42): TileType[][] {
  const rng = mulberry32(seed);
  const cols = WORLD_COLS;
  const rows = WORLD_ROWS;

  // Initialize with grass
  const tiles: TileType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => TileType.Grass)
  );

  // ─── Dirt paths (horizontal and vertical main roads) ──────────────────
  const pathY = Math.floor(rows / 2);
  const pathX = Math.floor(cols / 2);
  for (let x = 2; x < cols - 2; x++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (pathY + dy >= 0 && pathY + dy < rows) tiles[pathY + dy][x] = TileType.Path;
    }
  }
  for (let y = 2; y < rows - 2; y++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (pathX + dx >= 0 && pathX + dx < cols) tiles[y][pathX + dx] = TileType.Path;
    }
  }

  // ─── Water pond (top-right area) ──────────────────────────────────────
  const pondCx = Math.floor(cols * 0.75);
  const pondCy = Math.floor(rows * 0.25);
  const pondR = 5;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = x - pondCx;
      const dy = y - pondCy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < pondR) tiles[y][x] = TileType.Water;
      else if (d < pondR + 0.8 && rng() > 0.5) tiles[y][x] = TileType.Water;
    }
  }

  // ─── River (flows from top to bottom along left third) ────────────────
  const riverX = Math.floor(cols * 0.2);
  for (let y = 0; y < rows; y++) {
    const wobble = Math.floor(Math.sin(y * 0.3) * 2);
    const rx = riverX + wobble;
    if (rx >= 0 && rx < cols) tiles[y][rx] = TileType.Water;
    if (rx + 1 < cols) tiles[y][rx + 1] = TileType.Water;
  }

  // ─── Buildings (houses at key locations) ──────────────────────────────
  const buildings = [
    { x: pathX - 8, y: pathY - 6, w: 4, h: 3 }, // northwest house
    { x: pathX + 4, y: pathY - 6, w: 4, h: 3 }, // northeast house
    { x: pathX - 8, y: pathY + 3, w: 3, h: 4 }, // southwest shop
    { x: pathX + 5, y: pathY + 3, w: 4, h: 3 }, // southeast house
  ];

  for (const b of buildings) {
    for (let dy = 0; dy < b.h; dy++) {
      for (let dx = 0; dx < b.w; dx++) {
        const bx = b.x + dx;
        const by = b.y + dy;
        if (bx >= 0 && bx < cols && by >= 0 && by < rows) {
          tiles[by][bx] = TileType.House;
        }
      }
    }
  }

  // ─── Trees (forest areas) ─────────────────────────────────────────────
  // Forest in the northeast
  for (let y = 2; y < rows * 0.4; y++) {
    for (let x = Math.floor(cols * 0.55); x < cols - 2; x++) {
      if (tiles[y][x] === TileType.Grass && rng() < 0.18) {
        tiles[y][x] = TileType.Tree;
      }
    }
  }

  // Forest in the southwest
  for (let y = Math.floor(rows * 0.6); y < rows - 2; y++) {
    for (let x = 2; x < Math.floor(cols * 0.35); x++) {
      if (tiles[y][x] === TileType.Grass && rng() < 0.15) {
        tiles[y][x] = TileType.Tree;
      }
    }
  }

  // Scattered trees
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (tiles[y][x] === TileType.Grass && rng() < 0.02) {
        tiles[y][x] = TileType.Tree;
      }
    }
  }

  // ─── Flowers ──────────────────────────────────────────────────────────
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (tiles[y][x] === TileType.Grass && rng() < 0.04) {
        tiles[y][x] = TileType.Flower;
      }
    }
  }

  // ─── Border walls ─────────────────────────────────────────────────────
  for (let x = 0; x < cols; x++) {
    tiles[0][x] = TileType.Wall;
    tiles[rows - 1][x] = TileType.Wall;
  }
  for (let y = 0; y < rows; y++) {
    tiles[y][0] = TileType.Wall;
    tiles[y][cols - 1] = TileType.Wall;
  }

  // ─── Scattered rocks (walls) ──────────────────────────────────────────
  for (let i = 0; i < 15; i++) {
    const rx = 3 + Math.floor(rng() * (cols - 6));
    const ry = 3 + Math.floor(rng() * (rows - 6));
    if (tiles[ry][rx] === TileType.Grass) {
      tiles[ry][rx] = TileType.Wall;
    }
  }

  worldTiles = tiles;
  console.log(`[World] Generated ${cols}x${rows} tile map (seed: ${seed})`);
  return tiles;
}

/** Get the tile at a given world position */
export function getTileAt(worldX: number, worldY: number): TileType {
  const col = Math.floor(worldX / TILE_SIZE);
  const row = Math.floor(worldY / TILE_SIZE);
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return TileType.Wall;
  return worldTiles[row][col];
}

/** Get valid spawn positions (on grass tiles) for enemies */
export function getEnemySpawnPositions(count: number, seed: number = 123): { x: number; y: number }[] {
  const rng = mulberry32(seed);
  const positions: { x: number; y: number }[] = [];

  const candidates: { x: number; y: number }[] = [];
  for (let y = 2; y < WORLD_ROWS - 2; y++) {
    for (let x = 2; x < WORLD_COLS - 2; x++) {
      const tile = worldTiles[y][x];
      if (tile === TileType.Grass || tile === TileType.Flower) {
        candidates.push({
          x: x * TILE_SIZE + TILE_SIZE / 2,
          y: y * TILE_SIZE + TILE_SIZE / 2,
        });
      }
    }
  }

  // Shuffle and pick
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Avoid spawning too close to center (player spawn)
  const centerX = (WORLD_COLS / 2) * TILE_SIZE;
  const centerY = (WORLD_ROWS / 2) * TILE_SIZE;
  const minDist = 200;

  for (const pos of candidates) {
    if (positions.length >= count) break;
    const dx = pos.x - centerX;
    const dy = pos.y - centerY;
    if (Math.sqrt(dx * dx + dy * dy) > minDist) {
      positions.push(pos);
    }
  }

  return positions;
}
