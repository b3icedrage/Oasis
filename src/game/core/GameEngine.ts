/**
 * GameEngine — Main game loop and entity management
 *
 * Ties together:
 *  - Player controller
 *  - Enemy AI state machine
 *  - Stats system
 *  - Inventory system
 *  - Camera
 *  - Renderer
 *  - Input
 *  - World generation
 *
 * Runs at requestAnimationFrame with delta-time smoothing.
 */
import type { PlayerEntity, EnemyEntity, DamageNumber, Particle } from '../core/types';
import { TILE_SIZE } from '../core/types';
import { createInputState, setupInputListeners, updateInput } from './Input';
import { createCamera, updateCamera } from './Camera';
import type { Camera } from './Camera';
import { createPlayer, updatePlayer, usePotion } from '../entities/Player';
import { createEnemy, updateEnemy, damageEnemy, ENEMY_TEMPLATES } from '../entities/Enemy';
import { generateWorld, getEnemySpawnPositions } from '../world/World';
import { render } from '../world/Renderer';
import { addToInventory, equipWeapon } from '../systems/InventorySystem';
import type { WeaponItem } from '../core/types';

export interface GameState {
  player: PlayerEntity;
  enemies: EnemyEntity[];
  damageNumbers: DamageNumber[];
  particles: Particle[];
  camera: Camera;
  isRunning: boolean;
  gameTime: number;
  score: number;
  enemiesDefeated: number;
}

export interface GameCallbacks {
  onStateChange?: (state: GameState) => void;
  onPlayerDamaged?: (hp: number, maxHp: number) => void;
  onEnemyDefeated?: (name: string) => void;
  onItemPickup?: (itemName: string) => void;
  onGameOver?: () => void;
}

let gameInstance: GameEngine | null = null;

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input = createInputState();
  private cleanupInput: (() => void) | null = null;
  private state: GameState;
  private callbacks: GameCallbacks;
  private lastTime = 0;
  private animFrameId = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;

    // Size canvas to fill viewport
    this.resizeCanvas();

    // Generate world
    generateWorld(42);

    // Create player at center of map
    const spawnX = Math.floor(25) * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = Math.floor(20) * TILE_SIZE + TILE_SIZE / 2;
    const player = createPlayer(spawnX, spawnY);

    // Create enemies at valid positions
    const spawnPositions = getEnemySpawnPositions(18, 777);
    const enemies: EnemyEntity[] = spawnPositions.map((pos, i) => {
      const template = ENEMY_TEMPLATES[i % ENEMY_TEMPLATES.length];
      return createEnemy(template, pos.x, pos.y);
    });

    // Create camera
    const camera = createCamera(this.canvas.width, this.canvas.height);

    this.state = {
      player,
      enemies,
      damageNumbers: [],
      particles: [],
      camera,
      isRunning: true,
      gameTime: 0,
      score: 0,
      enemiesDefeated: 0,
    };

    // Setup input
    this.cleanupInput = setupInputListeners(
      this.canvas,
      this.input,
      this.canvas.width,
      this.canvas.height
    );

    console.log('[GameEngine] Initialized —', enemies.length, 'enemies spawned');

    gameInstance = this;
  }

  /** Resize canvas to fill the viewport */
  resizeCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.scale(dpr, dpr);

    if (this.state) {
      this.state.camera.screenWidth = w;
      this.state.camera.screenHeight = h;
    }
  }

  /** Start the game loop */
  start(): void {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  /** Stop the game loop */
  stop(): void {
    this.state.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
    this.cleanupInput?.();
    console.log('[GameEngine] Stopped');
  }

  /** Main game loop */
  private loop = (now: number): void => {
    if (!this.state.isRunning) return;

    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(rawDt, 0.05); // Cap at 50ms to prevent spiral
    this.lastTime = now;
    this.state.gameTime += dt;

    this.update(dt);
    this.draw();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  /** Update all game systems */
  private update(dt: number): void {
    const { player, enemies, damageNumbers, particles, camera } = this.state;

    // Update input
    updateInput(this.input);

    // Inventory toggle
    if (this.input.inventoryPressed) {
      this.input.inventoryPressed = false; // consume the press
    }

    // Update player
    const { wantsAttack, attackDir } = updatePlayer(player, this.input, dt, damageNumbers, particles);

    // Player attack
    if (wantsAttack) {
      const attackRange = 50;
      const atkX = player.position.x + attackDir.x * attackRange;
      const atkY = player.position.y + attackDir.y * attackRange;

      // Attack particles (slash effect)
      const slashAngle = Math.atan2(attackDir.y, attackDir.x);
      for (let i = 0; i < 5; i++) {
        const a = slashAngle + (i - 2) * 0.3;
        particles.push({
          position: { x: atkX, y: atkY },
          velocity: { x: Math.cos(a) * 60, y: Math.sin(a) * 60 },
          color: '#ffdd44',
          size: 3 + Math.random() * 3,
          life: 0.2,
          maxLife: 0.2,
        });
      }

      // Check hits on enemies
      for (const enemy of enemies) {
        const dx = enemy.position.x - atkX;
        const dy = enemy.position.y - atkY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < enemy.size + 10) {
          const baseAtk = player.stats.attackPower + (player.equippedWeapon?.attackBonus ?? 0);
          const dmg = baseAtk + Math.floor(Math.random() * 4);
          const killed = damageEnemy(enemy, dmg, damageNumbers, particles);
          if (killed) {
            this.state.enemiesDefeated++;
            this.state.score += 100;
            console.log(`[GameEngine] ${enemy.name} defeated! Score: ${this.state.score}`);

            // Drop loot
            for (const item of enemy.loot) {
              const added = addToInventory(player, item);
              if (added) {
                this.callbacks.onItemPickup?.(item.name);
                damageNumbers.push({
                  position: { x: enemy.position.x, y: enemy.position.y - 30 },
                  text: `${item.icon} ${item.name}`,
                  color: '#44aaff',
                  timer: 2.0,
                  maxTimer: 2.0,
                });
              }
            }

            this.callbacks.onEnemyDefeated?.(enemy.name);

            // Respawn enemy after delay (3 seconds)
            const respawnTimer = 3.0;
            setTimeout(() => {
              if (this.state.isRunning) {
                const template = ENEMY_TEMPLATES.find((t) => t.name === enemy.name) ?? ENEMY_TEMPLATES[0];
                Object.assign(enemy, createEnemy(template, enemy.spawnPosition.x, enemy.spawnPosition.y));
                console.log(`[GameEngine] ${enemy.name} respawned at spawn.`);
              }
            }, respawnTimer * 1000);
          }
          break; // Only hit one enemy per attack
        }
      }
    }

    // Update enemies
    for (const enemy of enemies) {
      updateEnemy(enemy, player, dt, damageNumbers, particles);
    }

    // Update damage numbers
    for (let i = damageNumbers.length - 1; i >= 0; i--) {
      damageNumbers[i].timer -= dt;
      if (damageNumbers[i].timer <= 0) {
        damageNumbers.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.position.x += p.velocity.x * dt;
      p.position.y += p.velocity.y * dt;
      p.velocity.y += 80 * dt; // gravity
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Update camera
    updateCamera(camera, player.position, dt);

    // Notify React of state changes
    this.callbacks.onStateChange?.(this.state);

    // Check game over
    if (player.stats.currentHealth <= 0) {
      this.callbacks.onGameOver?.();
    }
  }

  /** Draw everything */
  private draw(): void {
    render(
      this.ctx,
      this.state.camera,
      this.state.player,
      this.state.enemies,
      this.state.damageNumbers,
      this.state.particles,
      this.input
    );

    // Game Over overlay
    if (this.state.player.stats.currentHealth <= 0) {
      const w = this.canvas.width / (window.devicePixelRatio || 1);
      const h = this.canvas.height / (window.devicePixelRatio || 1);
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, 0, w, h);
      this.ctx.fillStyle = '#ff4444';
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', w / 2, h / 2 - 30);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText(`Score: ${this.state.score}`, w / 2, h / 2 + 10);
      this.ctx.fillText(`Enemies defeated: ${this.state.enemiesDefeated}`, w / 2, h / 2 + 40);
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#aaa';
      this.ctx.fillText('Refresh to play again', w / 2, h / 2 + 70);
    }
  }

  /** Use a potion (called from UI) */
  quickUsePotion(): boolean {
    return usePotion(this.state.player);
  }

  /** Equip the best weapon in inventory */
  equipBestWeapon(): void {
    const weapons = this.state.player.inventory.filter(
      (i) => i.type === 'weapon'
    ) as WeaponItem[];
    if (weapons.length === 0) return;
    const best = weapons.sort((a, b) => b.attackBonus - a.attackBonus)[0];
    equipWeapon(this.state.player, best);
  }

  /** Get current state (for React UI) */
  getState(): GameState {
    return this.state;
  }
}

/** Get the singleton game engine instance */
export function getGameEngine(): GameEngine | null {
  return gameInstance;
}
