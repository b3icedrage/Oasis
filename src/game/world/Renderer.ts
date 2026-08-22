/**
 * Renderer — Canvas 2D drawing engine
 *
 * Draws the game world using a stylized low-poly aesthetic:
 *  - Flat-colored tiles with geometric detail
 *  - Player and enemies as stylized characters
 *  - Floating damage numbers
 *  - Particle effects
 *  - Health bars
 *  - Joystick overlays
 */
import type { Camera } from '../core/Camera';
import { worldToScreen, isVisible } from '../core/Camera';
import type { PlayerEntity, EnemyEntity, DamageNumber, Particle } from '../core/types';
import { TileType, TILE_SIZE, WORLD_COLS, WORLD_ROWS, EnemyState } from '../core/types';
import type { InputState } from '../core/Input';
import { isAlive } from '../systems/StatsSystem';
import { worldTiles } from './World';

// ─── Tile color palette ─────────────────────────────────────────────────────
const TILE_COLORS: Record<number, string> = {
  [TileType.Grass]: '#4a8c3f',
  [TileType.Dirt]: '#9e8562',
  [TileType.Water]: '#3388bb',
  [TileType.Wall]: '#777777',
  [TileType.Tree]: '#2d6b24',
  [TileType.House]: '#8b6b4a',
  [TileType.Path]: '#b8a07a',
  [TileType.Flower]: '#4a8c3f',
};

const TILE_ACCENT: Record<number, string> = {
  [TileType.Grass]: '#56a049',
  [TileType.Dirt]: '#b89e74',
  [TileType.Water]: '#44aadd',
  [TileType.Wall]: '#999999',
  [TileType.Tree]: '#1f5a18',
  [TileType.House]: '#a07850',
  [TileType.Path]: '#c8b48e',
  [TileType.Flower]: '#e86090',
};

/** Draw the visible portion of the tile world */
function drawWorld(ctx: CanvasRenderingContext2D, camera: Camera): void {
  const startCol = Math.max(0, Math.floor(camera.position.x / TILE_SIZE));
  const endCol = Math.min(WORLD_COLS, Math.ceil((camera.position.x + camera.screenWidth) / TILE_SIZE) + 1);
  const startRow = Math.max(0, Math.floor(camera.position.y / TILE_SIZE));
  const endRow = Math.min(WORLD_ROWS, Math.ceil((camera.position.y + camera.screenHeight) / TILE_SIZE) + 1);

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const tile = worldTiles[row]?.[col] ?? TileType.Wall;
      const worldX = col * TILE_SIZE;
      const worldY = row * TILE_SIZE;
      const screen = worldToScreen(camera, { x: worldX, y: worldY });

      // Base tile
      ctx.fillStyle = TILE_COLORS[tile] ?? '#4a8c3f';
      ctx.fillRect(screen.x, screen.y, TILE_SIZE + 1, TILE_SIZE + 1);

      // Detail elements
      switch (tile) {
        case TileType.Grass: {
          // Grass blades
          ctx.fillStyle = TILE_ACCENT[tile];
          const seed = (row * WORLD_COLS + col) * 7;
          for (let i = 0; i < 3; i++) {
            const gx = screen.x + ((seed + i * 13) % TILE_SIZE);
            const gy = screen.y + ((seed + i * 17) % (TILE_SIZE - 4));
            ctx.fillRect(gx, gy, 2, 5);
          }
          break;
        }
        case TileType.Flower: {
          // Draw a small flower
          ctx.fillStyle = '#4a8c3f';
          ctx.fillRect(screen.x, screen.y, TILE_SIZE + 1, TILE_SIZE + 1);
          const seed = (row * WORLD_COLS + col) * 11;
          const colors = ['#ff6b8a', '#ffaa44', '#ff66ff', '#ffdd44', '#ff8866'];
          ctx.fillStyle = colors[seed % colors.length];
          const fx = screen.x + TILE_SIZE / 2;
          const fy = screen.y + TILE_SIZE / 2;
          ctx.beginPath();
          ctx.arc(fx, fy, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffff44';
          ctx.beginPath();
          ctx.arc(fx, fy, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case TileType.Tree: {
          // Tree trunk + canopy
          ctx.fillStyle = '#2d6b24';
          ctx.fillRect(screen.x, screen.y, TILE_SIZE + 1, TILE_SIZE + 1);
          // Trunk
          ctx.fillStyle = '#6b4226';
          ctx.fillRect(screen.x + 16, screen.y + 24, 8, 16);
          // Canopy (triangle)
          ctx.fillStyle = '#1a5212';
          ctx.beginPath();
          ctx.moveTo(screen.x + 20, screen.y + 4);
          ctx.lineTo(screen.x + 6, screen.y + 28);
          ctx.lineTo(screen.x + 34, screen.y + 28);
          ctx.closePath();
          ctx.fill();
          // Canopy highlight
          ctx.fillStyle = '#2a7a22';
          ctx.beginPath();
          ctx.moveTo(screen.x + 20, screen.y + 8);
          ctx.lineTo(screen.x + 12, screen.y + 24);
          ctx.lineTo(screen.x + 28, screen.y + 24);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case TileType.Water: {
          // Water ripples
          ctx.fillStyle = TILE_ACCENT[tile] ?? '#44aadd';
          const phase = ((row + col) % 3) * 0.3;
          const ry = screen.y + 12 + Math.sin(phase + Date.now() * 0.002) * 3;
          ctx.beginPath();
          ctx.ellipse(screen.x + 20, ry, 14, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case TileType.Wall: {
          // Rock detail
          ctx.fillStyle = TILE_ACCENT[tile] ?? '#999999';
          ctx.fillRect(screen.x + 2, screen.y + 2, 12, 10);
          ctx.fillRect(screen.x + 20, screen.y + 16, 14, 10);
          break;
        }
        case TileType.House: {
          // House detail — roof triangle
          const isTop = row > 0 && worldTiles[row - 1]?.[col] !== TileType.House;
          if (isTop) {
            ctx.fillStyle = '#cc4444';
            ctx.beginPath();
            ctx.moveTo(screen.x + TILE_SIZE / 2, screen.y - 4);
            ctx.lineTo(screen.x - 2, screen.y + 12);
            ctx.lineTo(screen.x + TILE_SIZE + 2, screen.y + 12);
            ctx.closePath();
            ctx.fill();
          }
          // Window
          ctx.fillStyle = '#ffee88';
          ctx.fillRect(screen.x + 14, screen.y + 16, 8, 8);
          break;
        }
        case TileType.Path: {
          // Path texture
          const seed = (row * WORLD_COLS + col) * 3;
          ctx.fillStyle = '#c8b48e';
          for (let i = 0; i < 2; i++) {
            const px = screen.x + ((seed + i * 19) % (TILE_SIZE - 4)) + 2;
            const py = screen.y + ((seed + i * 23) % (TILE_SIZE - 4)) + 2;
            ctx.fillRect(px, py, 3, 3);
          }
          break;
        }
        case TileType.Dirt: {
          ctx.fillStyle = TILE_ACCENT[tile] ?? '#b89e74';
          ctx.fillRect(screen.x + 8, screen.y + 6, 4, 3);
          ctx.fillRect(screen.x + 24, screen.y + 22, 5, 3);
          break;
        }
      }
    }
  }
}

/** Draw the player character */
function drawPlayer(ctx: CanvasRenderingContext2D, camera: Camera, player: PlayerEntity): void {
  if (!isAlive(player.stats)) return;

  const screen = worldToScreen(camera, player.position);

  // Invincibility flash
  if (player.invincibleTimer > 0 && Math.floor(player.invincibleTimer * 10) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(screen.x, screen.y + player.size / 2 + 2, player.size / 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (low-poly character)
  const bodyColor = '#3377cc';
  ctx.fillStyle = bodyColor;

  // Legs
  const legOffset = player.isMoving ? Math.sin(Date.now() * 0.01) * 4 : 0;
  ctx.fillStyle = '#2255aa';
  ctx.fillRect(screen.x - 6 + legOffset, screen.y + 4, 5, 10);
  ctx.fillRect(screen.x + 1 - legOffset, screen.y + 4, 5, 10);

  // Torso
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(screen.x, screen.y - 12);
  ctx.lineTo(screen.x - 10, screen.y + 6);
  ctx.lineTo(screen.x + 10, screen.y + 6);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.arc(screen.x, screen.y - 16, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#333';
  const eyeDirX = player.facing.x * 2;
  const eyeDirY = player.facing.y * 1;
  ctx.fillRect(screen.x - 3 + eyeDirX, screen.y - 18 + eyeDirY, 2, 3);
  ctx.fillRect(screen.x + 1 + eyeDirX, screen.y - 18 + eyeDirY, 2, 3);

  // Hair
  ctx.fillStyle = '#663311';
  ctx.beginPath();
  ctx.arc(screen.x, screen.y - 20, 7, Math.PI, Math.PI * 2);
  ctx.fill();

  // Weapon indicator
  if (player.equippedWeapon) {
    ctx.fillStyle = '#cccccc';
    const weaponX = screen.x + player.facing.x * 14;
    const weaponY = screen.y + player.facing.y * 14 - 6;
    ctx.fillRect(weaponX - 1, weaponY, 3, 14);
    // Blade
    ctx.fillStyle = '#eeeeff';
    ctx.fillRect(weaponX - 3, weaponY - 6, 7, 8);
  }

  // Health bar above player
  drawHealthBar(ctx, screen.x, screen.y - 28, player.stats.currentHealth, player.stats.maxHealth, '#44cc44');

  ctx.globalAlpha = 1;
}

/** Draw an enemy entity */
function drawEnemy(ctx: CanvasRenderingContext2D, camera: Camera, enemy: EnemyEntity): void {
  if (!isAlive(enemy.stats)) return;
  if (!isVisible(camera, enemy.position, 60)) return;

  const screen = worldToScreen(camera, enemy.position);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(screen.x, screen.y + enemy.size / 2 + 2, enemy.size / 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // State-based color tint
  let bodyColor = enemy.color;
  if (enemy.state === EnemyState.Chase) bodyColor = '#ff8844';
  if (enemy.state === EnemyState.Attack) bodyColor = '#ff4444';

  // Body shape (different per enemy type)
  ctx.fillStyle = bodyColor;

  if (enemy.name === 'Slime') {
    // Blob shape
    const squish = Math.sin(Date.now() * 0.005) * 3;
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y, enemy.size / 2 + squish, enemy.size / 2 - squish / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(screen.x - 4, screen.y - 3, 3, 0, Math.PI * 2);
    ctx.arc(screen.x + 4, screen.y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(screen.x - 4, screen.y - 3, 1.5, 0, Math.PI * 2);
    ctx.arc(screen.x + 4, screen.y - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (enemy.name === 'Goblin') {
    // Triangular body
    ctx.beginPath();
    ctx.moveTo(screen.x, screen.y - enemy.size / 2);
    ctx.lineTo(screen.x - enemy.size / 2, screen.y + enemy.size / 2);
    ctx.lineTo(screen.x + enemy.size / 2, screen.y + enemy.size / 2);
    ctx.closePath();
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#ff0';
    ctx.fillRect(screen.x - 5, screen.y - 3, 3, 3);
    ctx.fillRect(screen.x + 2, screen.y - 3, 3, 3);
  } else if (enemy.name === 'Skeleton') {
    // Tall thin body
    ctx.fillRect(screen.x - 5, screen.y - 14, 10, 28);
    // Skull
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y - 14, 7, 0, Math.PI * 2);
    ctx.fill();
    // Eye sockets
    ctx.fillStyle = '#333';
    ctx.fillRect(screen.x - 4, screen.y - 16, 3, 3);
    ctx.fillRect(screen.x + 1, screen.y - 16, 3, 3);
    // Smile
    ctx.fillRect(screen.x - 3, screen.y - 11, 6, 1);
  } else {
    // Dark Knight — armored rectangle
    ctx.fillRect(screen.x - enemy.size / 2, screen.y - enemy.size / 2, enemy.size, enemy.size);
    // Helmet visor
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(screen.x - 6, screen.y - 8, 12, 4);
  }

  // Health bar
  drawHealthBar(ctx, screen.x, screen.y - enemy.size / 2 - 10, enemy.stats.currentHealth, enemy.stats.maxHealth, '#cc4444');

  // State indicator
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  const stateText = enemy.state === EnemyState.Idle ? '💤' : enemy.state === EnemyState.Chase ? '❗' : '⚔️';
  ctx.fillText(stateText, screen.x, screen.y - enemy.size / 2 - 20);
}

/** Draw a health bar */
function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  current: number,
  max: number,
  color: string
): void {
  const width = 30;
  const height = 4;
  const ratio = Math.max(0, current / max);

  // Background
  ctx.fillStyle = '#333';
  ctx.fillRect(x - width / 2, y, width, height);

  // Fill
  ctx.fillStyle = ratio > 0.5 ? color : ratio > 0.25 ? '#ccaa44' : '#cc4444';
  ctx.fillRect(x - width / 2, y, width * ratio, height);

  // Border
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x - width / 2, y, width, height);
}

/** Draw floating damage numbers */
function drawDamageNumbers(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  numbers: DamageNumber[]
): void {
  for (const num of numbers) {
    if (!isVisible(camera, num.position)) continue;
    const screen = worldToScreen(camera, num.position);
    const alpha = num.timer / num.maxTimer;
    const floatY = (1 - alpha) * -30;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = num.color;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(num.text, screen.x, screen.y + floatY);
    ctx.fillText(num.text, screen.x, screen.y + floatY);
    ctx.globalAlpha = 1;
  }
}

/** Draw particles */
function drawParticles(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  particles: Particle[]
): void {
  for (const p of particles) {
    const screen = worldToScreen(camera, p.position);
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Draw the joystick overlays */
function drawJoysticks(ctx: CanvasRenderingContext2D, input: InputState): void {
  const sw = ctx.canvas.width / (window.devicePixelRatio || 1);
  const sh = ctx.canvas.height / (window.devicePixelRatio || 1);
  const radius = 55;

  // Move joystick (left side)
  const mc = input.moveJoystick.active ? input.moveJoystick.center : { x: 100, y: sh - 100 };
  ctx.globalAlpha = input.moveJoystick.active ? 0.5 : 0.25;
  ctx.fillStyle = '#4488ff';
  ctx.beginPath();
  ctx.arc(mc.x, mc.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Knob
  if (input.moveJoystick.active && input.moveJoystick.touchPoint) {
    const knobX = mc.x + input.moveJoystick.direction.x * radius;
    const knobY = mc.y + input.moveJoystick.direction.y * radius;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(knobX, knobY, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Attack joystick (right side)
  const ac = input.attackJoystick.active ? input.attackJoystick.center : { x: sw - 100, y: sh - 100 };
  ctx.fillStyle = '#ff4444';
  ctx.globalAlpha = input.attackJoystick.active ? 0.5 : 0.25;
  ctx.beginPath();
  ctx.arc(ac.x, ac.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Knob
  if (input.attackJoystick.active && input.attackJoystick.touchPoint) {
    const knobX = ac.x + input.attackJoystick.direction.x * radius;
    const knobY = ac.y + input.attackJoystick.direction.y * radius;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(knobX, knobY, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Labels
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#fff';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MOVE', mc.x, mc.y + radius + 18);
  ctx.fillText('ATTACK', ac.x, ac.y + radius + 18);
  ctx.globalAlpha = 1;
}

/** Draw the minimap */
function drawMinimap(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  player: PlayerEntity,
  enemies: EnemyEntity[]
): void {
  const mapW = 120;
  const mapH = 96;
  const sw = ctx.canvas.width / (window.devicePixelRatio || 1);
  const mx = sw - mapW - 10;
  const my = 10;
  const scaleX = mapW / (WORLD_COLS * TILE_SIZE);
  const scaleY = mapH / (WORLD_ROWS * TILE_SIZE);

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(mx - 2, my - 2, mapW + 4, mapH + 4);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.strokeRect(mx - 2, my - 2, mapW + 4, mapH + 4);

  // Terrain (simplified)
  for (let row = 0; row < WORLD_ROWS; row += 2) {
    for (let col = 0; col < WORLD_COLS; col += 2) {
      const tile = worldTiles[row]?.[col] ?? TileType.Wall;
      switch (tile) {
        case TileType.Water: ctx.fillStyle = '#3388bb'; break;
        case TileType.Tree: ctx.fillStyle = '#2d6b24'; break;
        case TileType.Wall: ctx.fillStyle = '#666'; break;
        case TileType.House: ctx.fillStyle = '#8b6b4a'; break;
        case TileType.Path: ctx.fillStyle = '#b8a07a'; break;
        default: ctx.fillStyle = '#3a6c30'; break;
      }
      ctx.fillRect(mx + col * scaleX * TILE_SIZE, my + row * scaleY * TILE_SIZE, 3, 3);
    }
  }

  // Enemies
  for (const e of enemies) {
    if (!isAlive(e.stats)) continue;
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(mx + e.position.x * scaleX - 1, my + e.position.y * scaleY - 1, 3, 3);
  }

  // Player
  ctx.fillStyle = '#44aaff';
  ctx.fillRect(mx + player.position.x * scaleX - 2, my + player.position.y * scaleY - 2, 4, 4);

  // Camera viewport box
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(
    mx + camera.position.x * scaleX,
    my + camera.position.y * scaleY,
    camera.screenWidth * scaleX,
    camera.screenHeight * scaleY
  );
}

/** Main render function — draws everything */
export function render(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  player: PlayerEntity,
  enemies: EnemyEntity[],
  damageNumbers: DamageNumber[],
  particles: Particle[],
  input: InputState
): void {
  // Clear
  ctx.fillStyle = '#1a2a14';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw world
  drawWorld(ctx, camera);

  // Draw enemies (sorted by Y for depth)
  const sortedEnemies = [...enemies].sort((a, b) => a.position.y - b.position.y);
  for (const enemy of sortedEnemies) {
    drawEnemy(ctx, camera, enemy);
  }

  // Draw player
  drawPlayer(ctx, camera, player);

  // Draw particles (on top)
  drawParticles(ctx, camera, particles);

  // Draw damage numbers (on top of everything)
  drawDamageNumbers(ctx, camera, damageNumbers);

  // Draw UI overlays
  drawJoysticks(ctx, input);
  drawMinimap(ctx, camera, player, enemies);
}
