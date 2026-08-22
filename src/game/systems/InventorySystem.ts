/**
 * InventorySystem — Equivalent to Unity's ScriptableObject-based item system
 *
 * RPGItem (base class) → WeaponItem, ArmorItem, ConsumableItem (derived classes)
 * Item rarity: Common, Rare, Epic
 */
import type { GameItem, WeaponItem, ArmorItem, ConsumableItem, PlayerEntity } from '../core/types';
import { ItemRarity } from '../core/types';

// ═════════════════════════════════════════════════════════════════════════════
// ITEM DEFINITIONS (equivalent to ScriptableObject assets in Unity)
// ═════════════════════════════════════════════════════════════════════════════

/** Weapon items — RPGItem base + AttackBonus field */
export const WEAPONS: WeaponItem[] = [
  {
    id: 'sword_wooden',
    name: 'Wooden Sword',
    icon: '🗡️',
    rarity: ItemRarity.Common,
    description: 'A simple wooden sword. Better than fists.',
    type: 'weapon',
    attackBonus: 3,
  },
  {
    id: 'sword_iron',
    name: 'Iron Sword',
    icon: '⚔️',
    rarity: ItemRarity.Common,
    description: 'A sturdy iron blade.',
    type: 'weapon',
    attackBonus: 6,
  },
  {
    id: 'axe_war',
    name: 'War Axe',
    icon: '🪓',
    rarity: ItemRarity.Rare,
    description: 'A heavy axe that cleaves through armor.',
    type: 'weapon',
    attackBonus: 10,
  },
  {
    id: 'staff_flame',
    name: 'Flame Staff',
    icon: '🔥',
    rarity: ItemRarity.Rare,
    description: 'A staff crackling with inner fire.',
    type: 'weapon',
    attackBonus: 12,
  },
  {
    id: 'sword_legendary',
    name: 'Excalibur',
    icon: '✨',
    rarity: ItemRarity.Epic,
    description: 'The legendary blade of kings. +20 ATK.',
    type: 'weapon',
    attackBonus: 20,
  },
];

/** Armor items — RPGItem base + DefenseBonus field */
export const ARMORS: ArmorItem[] = [
  {
    id: 'shield_wooden',
    name: 'Wooden Shield',
    icon: '🛡️',
    rarity: ItemRarity.Common,
    description: 'A basic shield. Blocks a little.',
    type: 'armor',
    defenseBonus: 2,
  },
  {
    id: 'armor_chain',
    name: 'Chain Mail',
    icon: '🦺',
    rarity: ItemRarity.Rare,
    description: 'Linked rings of iron. Solid protection.',
    type: 'armor',
    defenseBonus: 6,
  },
  {
    id: 'armor_plate',
    name: 'Dragon Plate',
    icon: '🐉',
    rarity: ItemRarity.Epic,
    description: 'Forged from dragon scales. +15 DEF.',
    type: 'armor',
    defenseBonus: 15,
  },
];

/** Consumable items — RPGItem base + HealAmount field */
export const CONSUMABLES: ConsumableItem[] = [
  {
    id: 'potion_small',
    name: 'Health Potion',
    icon: '🧪',
    rarity: ItemRarity.Common,
    description: 'Restores 30 HP.',
    type: 'consumable',
    healAmount: 30,
  },
  {
    id: 'potion_large',
    name: 'Greater Potion',
    icon: '⚗️',
    rarity: ItemRarity.Rare,
    description: 'Restores 60 HP.',
    type: 'consumable',
    healAmount: 60,
  },
  {
    id: 'elixir',
    name: 'Life Elixir',
    icon: '💜',
    rarity: ItemRarity.Epic,
    description: 'Fully restores HP.',
    type: 'consumable',
    healAmount: 999,
  },
];

/** All available items */
export const ALL_ITEMS: GameItem[] = [...WEAPONS, ...ARMORS, ...CONSUMABLES];

// ═════════════════════════════════════════════════════════════════════════════
// INVENTORY MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

/** Max inventory size */
export const MAX_INVENTORY = 12;

/** Add an item to player inventory. Returns true if successful. */
export function addToInventory(player: PlayerEntity, item: GameItem): boolean {
  if (player.inventory.length >= MAX_INVENTORY) {
    console.log(`[Inventory] Inventory full! Cannot add ${item.name}.`);
    return false;
  }
  player.inventory.push(item);
  console.log(`[Inventory] Added ${item.rarity} item: ${item.name} ${item.icon}`);
  return true;
}

/** Remove an item from inventory by id. Returns the removed item or null. */
export function removeFromInventory(player: PlayerEntity, itemId: string): GameItem | null {
  const idx = player.inventory.findIndex((i) => i.id === itemId);
  if (idx === -1) return null;
  const [removed] = player.inventory.splice(idx, 1);
  console.log(`[Inventory] Removed ${removed.name}.`);
  return removed;
}

/** Equip a weapon. Unequips current weapon back to inventory. */
export function equipWeapon(player: PlayerEntity, weapon: WeaponItem): void {
  if (player.equippedWeapon) {
    player.inventory.push(player.equippedWeapon);
    console.log(`[Inventory] Unequipped ${player.equippedWeapon.name}.`);
  }
  player.equippedWeapon = weapon;
  removeFromInventory(player, weapon.id);
  console.log(`[Inventory] Equipped ${weapon.name} (+${weapon.attackBonus} ATK).`);
}

/** Use a consumable item on the player */
export function useConsumable(player: PlayerEntity, item: ConsumableItem): boolean {
  if (player.stats.currentHealth >= player.stats.maxHealth) {
    console.log(`[Inventory] ${player.stats.name} is already at full HP!`);
    return false;
  }
  const healed = Math.min(item.healAmount, player.stats.maxHealth - player.stats.currentHealth);
  player.stats.currentHealth += healed;
  removeFromInventory(player, item.id);
  console.log(`[Inventory] Used ${item.name}: healed ${healed} HP. HP: ${player.stats.currentHealth}/${player.stats.maxHealth}`);
  return true;
}

/** Get effective attack power (base + weapon bonus) */
export function getEffectiveAttackPower(player: PlayerEntity): number {
  return player.stats.attackPower + (player.equippedWeapon?.attackBonus ?? 0);
}

/** Get effective defense (base + armor bonus) */
export function getEffectiveDefense(player: PlayerEntity): number {
  return player.stats.defense;
}

/** Get a random item of specified rarity from the loot pool */
export function getRandomLoot(rarity?: ItemRarity): GameItem {
  const pool = rarity ? ALL_ITEMS.filter((i) => i.rarity === rarity) : ALL_ITEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}
