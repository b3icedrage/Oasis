/**
 * Camera — Follows the player with smooth lerp and clamps to world bounds.
 */
import type { Vec2 } from './types';
import { WORLD_COLS, WORLD_ROWS, TILE_SIZE } from './types';

export interface Camera {
  position: Vec2;
  screenWidth: number;
  screenHeight: number;
  zoom: number;
}

/** Create a camera centered on the given position */
export function createCamera(screenWidth: number, screenHeight: number): Camera {
  return {
    position: { x: 0, y: 0 },
    screenWidth,
    screenHeight,
    zoom: 1,
  };
}

/** Update camera to follow target with smooth interpolation */
export function updateCamera(camera: Camera, target: Vec2, dt: number): void {
  const lerpSpeed = 5; // Higher = snappier follow
  const targetX = target.x - camera.screenWidth / 2;
  const targetY = target.y - camera.screenHeight / 2;

  camera.position.x += (targetX - camera.position.x) * lerpSpeed * dt;
  camera.position.y += (targetY - camera.position.y) * lerpSpeed * dt;

  // Clamp to world bounds
  const maxX = WORLD_COLS * TILE_SIZE - camera.screenWidth;
  const maxY = WORLD_ROWS * TILE_SIZE - camera.screenHeight;
  camera.position.x = Math.max(0, Math.min(maxX, camera.position.x));
  camera.position.y = Math.max(0, Math.min(maxY, camera.position.y));
}

/** Convert world coordinates to screen coordinates */
export function worldToScreen(camera: Camera, worldPos: Vec2): Vec2 {
  return {
    x: (worldPos.x - camera.position.x) * camera.zoom,
    y: (worldPos.y - camera.position.y) * camera.zoom,
  };
}

/** Check if a world position is visible on screen */
export function isVisible(camera: Camera, worldPos: Vec2, margin: number = 50): boolean {
  const screen = worldToScreen(camera, worldPos);
  return (
    screen.x > -margin &&
    screen.x < camera.screenWidth + margin &&
    screen.y > -margin &&
    screen.y < camera.screenHeight + margin
  );
}
