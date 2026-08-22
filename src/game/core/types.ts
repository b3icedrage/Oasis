/**
 * RPG Game — Shared Type Definitions
 * Mirrors Unity-style enums and interfaces for a web-based RPG.
 *
 * Uses `as const` objects instead of `enum` for erasableSyntaxOnly compatibility.
 */

// ─── Item Rarity (equivalent to Unity enum) ────────────────────────────────
export const ItemRarity = {
  Common: 'Common',
  Rare: 'Rare',
  Epic: 'Epic',
} as const;
export type ItemRarity = (typeof ItemRarity)[keyof typeof ItemRarity];

// ─── Item Rarity Colors ─────────────────────────────────────────────────────
export const RARITY_COLORS: Record<ItemRarity, string> = {
  [ItemRarity.Common]: '#b0b0b0',
  [ItemRarity.Rare]: '#4a9eff',
  [ItemRarity.Epic]: '#c84dff',
};

// ─── Enemy State Machine (equivalent to Unity enum-based state machine) ─────
export const EnemyState = {
  Idle: 'Idle',
  Chase: 'Chase',
  Attack: 'Attack',
} as const;
export type EnemyState = (typeof EnemyState)[keyof typeof EnemyState];

// ─── RPGItem ScriptableObject equivalent ────────────────────────────────────
export interface RPGItem {
  id: string;
  name: string;
  icon: string;           // Emoji icon used as sprite
  rarity: ItemRarity;
  description: string;
}

// ─── WeaponItem (derives from RPGItem, adds AttackBonus) ────────────────────
export interface WeaponItem extends RPGItem {
  type: 'weapon';
  attackBonus: number;
}

// ─── ArmorItem (derives from RPGItem) ───────────────────────────────────────
export interface ArmorItem extends RPGItem {
  type: 'armor';
  defenseBonus: number;
}

// ─── ConsumableItem (derives from RPGItem) ──────────────────────────────────
export interface ConsumableItem extends RPGItem {
  type: 'consumable';
  healAmount: number;
}

export type GameItem = WeaponItem | ArmorItem | ConsumableItem;

// ─── CharacterStats ScriptableObject equivalent ─────────────────────────────
export interface CharacterStatsData {
  name: string;
  maxHealth: number;
  currentHealth: number;
  attackPower: number;
  defense: number;
  movementSpeed: number;
}

// ─── 2D Vector ──────────────────────────────────────────────────────────────
export interface Vec2 {
  x: number;
  y: number;
}

// ─── World Tile Types ───────────────────────────────────────────────────────
export const TileType = {
  Grass: 0,
  Dirt: 1,
  Water: 2,
  Wall: 3,
  Tree: 4,
  House: 5,
  Path: 6,
  Flower: 7,
} as const;
export type TileType = (typeof TileType)[keyof typeof TileType];

// ─── Entity Base ────────────────────────────────────────────────────────────
export interface Entity {
  id: string;
  position: Vec2;
  size: number;
}

// ─── Player Entity ──────────────────────────────────────────────────────────
export interface PlayerEntity extends Entity {
  type: 'player';
  stats: CharacterStatsData;
  inventory: GameItem[];
  equippedWeapon: WeaponItem | null;
  facing: Vec2;
  isMoving: boolean;
  attackCooldown: number;
  invincibleTimer: number;
}

// ─── Enemy Entity ───────────────────────────────────────────────────────────
export interface EnemyEntity extends Entity {
  type: 'enemy';
  stats: CharacterStatsData;
  state: EnemyState;
  spawnPosition: Vec2;
  detectionRadius: number;
  attackRadius: number;
  attackCooldown: number;
  stateTimer: number;
  color: string;
  name: string;
  loot: GameItem[];
}

// ─── Damage Number (floating text) ──────────────────────────────────────────
export interface DamageNumber {
  position: Vec2;
  text: string;
  color: string;
  timer: number;
  maxTimer: number;
}

// ─── Particle ───────────────────────────────────────────────────────────────
export interface Particle {
  position: Vec2;
  velocity: Vec2;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

// ─── Game World Config ──────────────────────────────────────────────────────
export const TILE_SIZE = 40;
export const WORLD_COLS = 50;
export const WORLD_ROWS = 40;
export const WORLD_WIDTH = WORLD_COLS * TILE_SIZE;
export const WORLD_HEIGHT = WORLD_ROWS * TILE_SIZE;
