/**
 * Player Controller — Equivalent to Unity's CharacterController + PlayerMovement
 *
 * Handles:
 *  - Mobile dual-joystick movement
 *  - Animation state tracking (isMoving, facing direction)
 *  - Attack with cooldown
 *  - Invincibility frames after taking damage
 *  - Collision with world tiles
 */
import type { PlayerEntity, Vec2, DamageNumber, Particle } from '../core/types';
import { TILE_SIZE, WORLD_COLS, WORLD_ROWS, ItemRarity } from '../core/types';
import type { InputState } from '../core/Input';
import { getMovementDirection, getAttackDirection } from '../core/Input';
import { createCharacterStats, takeDamage, isAlive } from '../systems/StatsSystem';
import type { ConsumableItem } from '../core/types';
import { WEAPONS } from '../systems/InventorySystem';
import { addToInventory } from '../systems/InventorySystem';
import { worldTiles } from '../world/World';

let playerNextId = 0;

/** Create a new player entity at the given spawn position */
export function createPlayer(spawnX: number, spawnY: number): PlayerEntity {
  const player: PlayerEntity = {
    id: `player_${playerNextId++}`,
    type: 'player',
    position: { x: spawnX, y: spawnY },
    size: 28,
    stats: createCharacterStats({
      name: 'Hero',
      maxHealth: 100,
      currentHealth: 100,
      attackPower: 8,
      defense: 2,
      movementSpeed: 140,
    }),
    inventory: [],
    equippedWeapon: null,
    facing: { x: 0, y: 1 }, // facing down initially
    isMoving: false,
    attackCooldown: 0,
    invincibleTimer: 0,
  };

  // Give the player a starting weapon and potions
  addToInventory(player, WEAPONS[0]); // Wooden Sword
  addToInventory(player, {
    id: 'potion_small',
    name: 'Health Potion',
    icon: '🧪',
    rarity: ItemRarity.Common,
    description: 'Restores 30 HP.',
    type: 'consumable',
    healAmount: 30,
  });
  addToInventory(player, {
    id: 'potion_small_2',
    name: 'Health Potion',
    icon: '🧪',
    rarity: ItemRarity.Common,
    description: 'Restores 30 HP.',
    type: 'consumable',
    healAmount: 30,
  });

  console.log('[Player] Hero spawned at', spawnX, spawnY);
  return player;
}

/** Check if a world tile is walkable */
function isWalkable(worldX: number, worldY: number): boolean {
  const col = Math.floor(worldX / TILE_SIZE);
  const row = Math.floor(worldY / TILE_SIZE);
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return false;
  const tile = worldTiles[row]?.[col];
  // Water (2) and walls (3) are not walkable
  return tile !== 2 && tile !== 3;
}

/** Update player position, facing, and animation state */
export function updatePlayer(
  player: PlayerEntity,
  input: InputState,
  dt: number,
  _damageNumbers: DamageNumber[],
  particles: Particle[]
): { wantsAttack: boolean; attackDir: Vec2 } {
  if (!isAlive(player.stats)) return { wantsAttack: false, attackDir: { x: 0, y: 0 } };

  // Update cooldowns
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.invincibleTimer = Math.max(0, player.invincibleTimer - dt);

  // Movement
  const moveDir = getMovementDirection(input);
  const speed = player.stats.movementSpeed;
  let newX = player.position.x + moveDir.x * speed * dt;
  let newY = player.position.y + moveDir.y * speed * dt;

  // Collision — check corners of bounding box
  const halfSize = player.size / 2;
  const canMoveX = isWalkable(newX - halfSize, player.position.y - halfSize) &&
                   isWalkable(newX + halfSize, player.position.y - halfSize) &&
                   isWalkable(newX - halfSize, player.position.y + halfSize) &&
                   isWalkable(newX + halfSize, player.position.y + halfSize);
  const canMoveY = isWalkable(player.position.x - halfSize, newY - halfSize) &&
                   isWalkable(player.position.x + halfSize, newY - halfSize) &&
                   isWalkable(player.position.x - halfSize, newY + halfSize) &&
                   isWalkable(player.position.x + halfSize, newY + halfSize);

  if (canMoveX) player.position.x = newX;
  if (canMoveY) player.position.y = newY;

  // Clamp to world bounds
  player.position.x = Math.max(halfSize, Math.min(WORLD_COLS * TILE_SIZE - halfSize, player.position.x));
  player.position.y = Math.max(halfSize, Math.min(WORLD_ROWS * TILE_SIZE - halfSize, player.position.y));

  // Animation state
  const isMoving = Math.abs(moveDir.x) > 0.1 || Math.abs(moveDir.y) > 0.1;
  player.isMoving = isMoving;

  // Update facing direction (only when moving)
  if (isMoving) {
    player.facing = { x: moveDir.x, y: moveDir.y };
  }

  // Attack intent
  const attackDir = getAttackDirection(input);
  const wantsAttack = input.attackPressed && player.attackCooldown <= 0;

  if (wantsAttack) {
    player.attackCooldown = 0.4; // 400ms cooldown
    console.log('[Player] Attack!');
  }

  // Movement particles (dust)
  if (isMoving && Math.random() < 0.3) {
    particles.push({
      position: { x: player.position.x + (Math.random() - 0.5) * 10, y: player.position.y + player.size / 2 },
      velocity: { x: (Math.random() - 0.5) * 20, y: -Math.random() * 30 },
      color: '#8B7355',
      size: 3 + Math.random() * 3,
      life: 0.4,
      maxLife: 0.4,
    });
  }

  return { wantsAttack, attackDir };
}

/** Handle the player taking damage (with invincibility frames) */
export function damagePlayer(
  player: PlayerEntity,
  rawDamage: number,
  damageNumbers: DamageNumber[],
  particles: Particle[]
): boolean {
  if (player.invincibleTimer > 0) return false;

  const actual = takeDamage(player.stats, rawDamage);
  player.invincibleTimer = 0.8; // 800ms invincibility

  // Floating damage number
  damageNumbers.push({
    position: { x: player.position.x, y: player.position.y - 20 },
    text: `-${actual}`,
    color: '#ff4444',
    timer: 1.2,
    maxTimer: 1.2,
  });

  // Hit particles
  for (let i = 0; i < 5; i++) {
    particles.push({
      position: { ...player.position },
      velocity: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 },
      color: '#ff6666',
      size: 2 + Math.random() * 4,
      life: 0.3 + Math.random() * 0.3,
      maxLife: 0.6,
    });
  }

  return true;
}

/** Use a consumable from inventory */
export function usePotion(player: PlayerEntity): boolean {
  const potion = player.inventory.find((i) => i.type === 'consumable') as ConsumableItem | undefined;
  if (!potion) {
    console.log('[Player] No potions in inventory!');
    return false;
  }
  if (player.stats.currentHealth >= player.stats.maxHealth) {
    console.log('[Player] Already at full health!');
    return false;
  }

  const healed = Math.min(potion.healAmount, player.stats.maxHealth - player.stats.currentHealth);
  player.stats.currentHealth += healed;
  // Remove the specific potion instance
  const idx = player.inventory.indexOf(potion);
  if (idx !== -1) player.inventory.splice(idx, 1);

  console.log(`[Player] Used ${potion.name}: healed ${healed} HP.`);

  return true;
}
