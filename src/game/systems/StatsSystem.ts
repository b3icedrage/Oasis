/**
 * StatsSystem — Equivalent to Unity's CharacterStats ScriptableObject + Component
 *
 * Manages health, damage, healing, and alive-checking for both player and enemies.
 * Attach to any entity to give it a full stat block.
 */
import type { CharacterStatsData } from '../core/types';

/** Creates a new CharacterStatsData block (equivalent to ScriptableObject.CreateInstance) */
export function createCharacterStats(overrides: Partial<CharacterStatsData> & { name: string }): CharacterStatsData {
  return {
    maxHealth: 100,
    currentHealth: 100,
    attackPower: 10,
    defense: 0,
    movementSpeed: 120,
    ...overrides,
  };
}

/** Apply damage to a character, accounting for defense. Returns actual damage dealt. */
export function takeDamage(stats: CharacterStatsData, rawDamage: number): number {
  const mitigated = Math.max(1, rawDamage - stats.defense);
  stats.currentHealth = Math.max(0, stats.currentHealth - mitigated);
  console.log(
    `[StatsSystem] ${stats.name} took ${mitigated} damage (${rawDamage} raw - ${stats.defense} def). HP: ${stats.currentHealth}/${stats.maxHealth}`
  );
  return mitigated;
}

/** Heal a character. Returns actual amount healed. */
export function heal(stats: CharacterStatsData, amount: number): number {
  const before = stats.currentHealth;
  stats.currentHealth = Math.min(stats.maxHealth, stats.currentHealth + amount);
  const healed = stats.currentHealth - before;
  console.log(`[StatsSystem] ${stats.name} healed ${healed} HP. HP: ${stats.currentHealth}/${stats.maxHealth}`);
  return healed;
}

/** Check if the character is alive */
export function isAlive(stats: CharacterStatsData): boolean {
  return stats.currentHealth > 0;
}

/** Get health as a 0–1 ratio */
export function healthRatio(stats: CharacterStatsData): number {
  return stats.currentHealth / stats.maxHealth;
}

/** Respawn / reset stats to full */
export function respawn(stats: CharacterStatsData): void {
  stats.currentHealth = stats.maxHealth;
  console.log(`[StatsSystem] ${stats.name} respawned with full HP.`);
}
