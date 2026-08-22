/**
 * Enemy Controller — Equivalent to Unity's NavMeshAgent + State Machine
 *
 * Implements an enum-based state machine with three states:
 *  - Idle:     Stand at spawn position, wander occasionally
 *  - Chase:    Move toward player when within DetectionRadius
 *  - Attack:   Attack when within AttackRadius
 *
 * Uses simple A* or direct-line pathfinding (NavMeshAgent equivalent for 2D).
 */
import type { EnemyEntity, PlayerEntity, Vec2, DamageNumber, Particle } from '../core/types';
import { TILE_SIZE, WORLD_COLS, WORLD_ROWS, EnemyState } from '../core/types';
import { createCharacterStats, takeDamage, isAlive } from '../systems/StatsSystem';
import { getRandomLoot } from '../systems/InventorySystem';
import { worldTiles } from '../world/World';

let enemyNextId = 0;

/** Distance between two points */
function dist(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Normalize a direction vector */
function normalize(v: Vec2): Vec2 {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  if (mag < 0.01) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

/** Check if a tile is walkable */
function isWalkable(worldX: number, worldY: number): boolean {
  const col = Math.floor(worldX / TILE_SIZE);
  const row = Math.floor(worldY / TILE_SIZE);
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return false;
  const tile = worldTiles[row]?.[col];
  return tile !== 2 && tile !== 3;
}

/** Enemy template definitions */
export interface EnemyTemplate {
  name: string;
  stats: { maxHealth: number; attackPower: number; defense: number; movementSpeed: number };
  detectionRadius: number;
  attackRadius: number;
  color: string;
  size: number;
}

export const ENEMY_TEMPLATES: EnemyTemplate[] = [
  {
    name: 'Slime',
    stats: { maxHealth: 30, attackPower: 5, defense: 0, movementSpeed: 60 },
    detectionRadius: 150,
    attackRadius: 35,
    color: '#44cc44',
    size: 22,
  },
  {
    name: 'Goblin',
    stats: { maxHealth: 50, attackPower: 8, defense: 1, movementSpeed: 100 },
    detectionRadius: 180,
    attackRadius: 38,
    color: '#aa8844',
    size: 24,
  },
  {
    name: 'Skeleton',
    stats: { maxHealth: 70, attackPower: 12, defense: 3, movementSpeed: 80 },
    detectionRadius: 200,
    attackRadius: 40,
    color: '#ddddcc',
    size: 26,
  },
  {
    name: 'Dark Knight',
    stats: { maxHealth: 120, attackPower: 18, defense: 6, movementSpeed: 70 },
    detectionRadius: 220,
    attackRadius: 42,
    color: '#443355',
    size: 30,
  },
];

/** Create an enemy entity from a template at a given position */
export function createEnemy(template: EnemyTemplate, x: number, y: number): EnemyEntity {
  const lootCount = 1 + Math.floor(Math.random() * 2);
  const loot = Array.from({ length: lootCount }, () => getRandomLoot());

  const enemy: EnemyEntity = {
    id: `enemy_${enemyNextId++}`,
    type: 'enemy',
    position: { x, y },
    size: template.size,
    stats: createCharacterStats({
      name: template.name,
      ...template.stats,
    }),
    state: EnemyState.Idle,
    spawnPosition: { x, y },
    detectionRadius: template.detectionRadius,
    attackRadius: template.attackRadius,
    attackCooldown: 0,
    stateTimer: 0,
    color: template.color,
    name: template.name,
    loot,
  };

  console.log(`[Enemy] ${enemy.name} spawned at (${x}, ${y}) — HP: ${enemy.stats.maxHealth}, ATK: ${enemy.stats.attackPower}`);
  return enemy;
}

/** Simple direct movement toward target (NavMeshAgent equivalent) */
function moveToward(entity: { position: Vec2 }, target: Vec2, speed: number, dt: number): void {
  const dir = normalize({ x: target.x - entity.position.x, y: target.y - entity.position.y });
  const newX = entity.position.x + dir.x * speed * dt;
  const newY = entity.position.y + dir.y * speed * dt;

  // Simple collision check
  if (isWalkable(newX, entity.position.y)) entity.position.x = newX;
  if (isWalkable(entity.position.x, newY)) entity.position.y = newY;
}

/** Idle behavior — wander near spawn point */
function updateIdle(enemy: EnemyEntity, player: PlayerEntity, dt: number): void {
  enemy.stateTimer += dt;

  // Every 2-3 seconds, pick a random nearby point to wander to
  if (enemy.stateTimer > 2 + Math.random() * 2) {
    enemy.stateTimer = 0;
    const wanderDist = 40 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    const wanderTarget = {
      x: enemy.spawnPosition.x + Math.cos(angle) * wanderDist,
      y: enemy.spawnPosition.y + Math.sin(angle) * wanderDist,
    };
    moveToward(enemy, wanderTarget, enemy.stats.movementSpeed * 0.3, dt);
  }

  // Check if player is within detection radius → switch to Chase
  const distToPlayer = dist(enemy.position, player.position);
  if (distToPlayer <= enemy.detectionRadius && isAlive(player.stats)) {
    enemy.state = EnemyState.Chase;
    enemy.stateTimer = 0;
    console.log(`[Enemy:${enemy.name}] Player detected! Switching to CHASE. Distance: ${Math.round(distToPlayer)}`);
  }
}

/** Chase behavior — move toward player */
function updateChase(enemy: EnemyEntity, player: PlayerEntity, dt: number): void {
  const distToPlayer = dist(enemy.position, player.position);

  // Switch to Attack if within attack radius
  if (distToPlayer <= enemy.attackRadius) {
    enemy.state = EnemyState.Attack;
    enemy.stateTimer = 0;
    console.log(`[Enemy:${enemy.name}] In attack range! Switching to ATTACK. Distance: ${Math.round(distToPlayer)}`);
    return;
  }

  // Switch back to Idle if player is too far
  if (distToPlayer > enemy.detectionRadius * 1.5) {
    enemy.state = EnemyState.Idle;
    enemy.stateTimer = 0;
    console.log(`[Enemy:${enemy.name}] Player escaped. Back to IDLE.`);
    return;
  }

  // Move toward player
  moveToward(enemy, player.position, enemy.stats.movementSpeed, dt);
}

/** Attack behavior — deal damage on cooldown */
function updateAttack(
  enemy: EnemyEntity,
  player: PlayerEntity,
  dt: number,
  damageNumbers: DamageNumber[],
  particles: Particle[]
): void {
  const distToPlayer = dist(enemy.position, player.position);

  // Switch back to Chase if player moved out of range
  if (distToPlayer > enemy.attackRadius * 1.3) {
    enemy.state = EnemyState.Chase;
    enemy.stateTimer = 0;
    console.log(`[Enemy:${enemy.name}] Player moved out of range. Back to CHASE.`);
    return;
  }

  // Attack on cooldown
  enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
  if (enemy.attackCooldown <= 0) {
    enemy.attackCooldown = 1.0; // 1 second between attacks

    console.log(`[Enemy:${enemy.name}] ATTACKING! Damage: ${enemy.stats.attackPower}`);

    // Deal damage to player
    const actual = takeDamage(player.stats, enemy.stats.attackPower);
    player.invincibleTimer = 0.6;

    // Damage number
    damageNumbers.push({
      position: { x: player.position.x, y: player.position.y - 20 },
      text: `-${actual}`,
      color: '#ff4444',
      timer: 1.2,
      maxTimer: 1.2,
    });

    // Attack particles
    for (let i = 0; i < 4; i++) {
      particles.push({
        position: { ...player.position },
        velocity: { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80 },
        color: enemy.color,
        size: 3 + Math.random() * 3,
        life: 0.3,
        maxLife: 0.3,
      });
    }
  }
}

/**
 * Main enemy update — runs the state machine
 * Called each frame for every enemy entity.
 */
export function updateEnemy(
  enemy: EnemyEntity,
  player: PlayerEntity,
  dt: number,
  damageNumbers: DamageNumber[],
  particles: Particle[]
): void {
  if (!isAlive(enemy.stats)) return;

  switch (enemy.state) {
    case EnemyState.Idle:
      updateIdle(enemy, player, dt);
      break;
    case EnemyState.Chase:
      updateChase(enemy, player, dt);
      break;
    case EnemyState.Attack:
      updateAttack(enemy, player, dt, damageNumbers, particles);
      break;
  }
}

/**
 * Damage an enemy (called when player attacks)
 * Returns true if the enemy was killed.
 */
export function damageEnemy(
  enemy: EnemyEntity,
  rawDamage: number,
  damageNumbers: DamageNumber[],
  particles: Particle[]
): boolean {
  const actual = takeDamage(enemy.stats, rawDamage);

  // Damage number
  damageNumbers.push({
    position: { x: enemy.position.x, y: enemy.position.y - 20 },
    text: `-${actual}`,
    color: '#ffaa00',
    timer: 1.2,
    maxTimer: 1.2,
  });

  // Hit particles
  for (let i = 0; i < 6; i++) {
    particles.push({
      position: { ...enemy.position },
      velocity: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 },
      color: enemy.color,
      size: 3 + Math.random() * 4,
      life: 0.4,
      maxLife: 0.4,
    });
  }

  if (!isAlive(enemy.stats)) {
    console.log(`[Enemy:${enemy.name}] DEFEAT!`);
    // Death particles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      particles.push({
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: { x: Math.cos(angle) * 80, y: Math.sin(angle) * 80 },
        color: enemy.color,
        size: 4 + Math.random() * 4,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0,
      });
    }
    return true;
  }

  // If hit, switch to Chase if currently Idle
  if (enemy.state === EnemyState.Idle) {
    enemy.state = EnemyState.Chase;
    console.log(`[Enemy:${enemy.name}] Provoked! Switching to CHASE.`);
  }

  return false;
}
