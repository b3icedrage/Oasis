/**
 * HUD — Heads-Up Display overlay
 *
 * Shows:
 *  - Player health bar
 *  - Attack power + defense stats
 *  - Score and enemies defeated
 *  - Quick-use potion button
 *  - Inventory toggle button
 */
import { isAlive } from '../game/systems/StatsSystem';
import type { PlayerEntity } from '../game/core/types';

interface HUDProps {
  player: PlayerEntity;
  score: number;
  enemiesDefeated: number;
  gameTime: number;
  onPotion: () => void;
  onInventory: () => void;
}

export function HUD({ player, score, enemiesDefeated, gameTime, onPotion, onInventory }: HUDProps) {
  const hp = player.stats.currentHealth;
  const maxHp = player.stats.maxHealth;
  const hpRatio = maxHp > 0 ? hp / maxHp : 0;
  const atk = player.stats.attackPower + (player.equippedWeapon?.attackBonus ?? 0);
  const def = player.stats.defense;
  const potionCount = player.inventory.filter((i) => i.type === 'consumable').length;
  const alive = isAlive(player.stats);
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="flex items-start justify-between p-3 pointer-events-auto">
        {/* Player stats */}
        <div className="bg-black/60 rounded-lg p-3 backdrop-blur-sm min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🛡️</span>
            <span className="text-white font-bold text-sm">{player.stats.name}</span>
          </div>

          {/* Health bar */}
          <div className="relative h-5 bg-gray-800 rounded-full overflow-hidden border border-gray-600 mb-2">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${hpRatio * 100}%`,
                background: hpRatio > 0.5
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : hpRatio > 0.25
                  ? 'linear-gradient(90deg, #eab308, #facc15)'
                  : 'linear-gradient(90deg, #dc2626, #ef4444)',
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white font-bold drop-shadow-lg">
              {hp}/{maxHp}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-xs">
            <span className="text-yellow-400">⚔️ ATK {atk}</span>
            <span className="text-blue-400">🛡️ DEF {def}</span>
            {player.equippedWeapon && (
              <span className="text-purple-400">{player.equippedWeapon.icon}</span>
            )}
          </div>
        </div>

        {/* Score & time */}
        <div className="bg-black/60 rounded-lg p-3 backdrop-blur-sm text-right">
          <div className="text-yellow-400 font-bold text-lg">{score}</div>
          <div className="text-gray-400 text-xs">SCORE</div>
          <div className="text-gray-300 text-xs mt-1">{formatTime(gameTime)}</div>
          <div className="text-gray-400 text-xs">☠️ {enemiesDefeated}</div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto">
        {/* Potion button */}
        <button
          onClick={onPotion}
          disabled={!alive || potionCount === 0}
          className="w-14 h-14 rounded-full bg-black/60 border-2 border-green-500/50 
                     flex items-center justify-center text-2xl hover:bg-green-900/60 
                     active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                     backdrop-blur-sm"
          title="Use Potion (P)"
        >
          🧪
          {potionCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {potionCount}
            </span>
          )}
        </button>

        {/* Inventory button */}
        <button
          onClick={onInventory}
          disabled={!alive}
          className="w-14 h-14 rounded-full bg-black/60 border-2 border-blue-500/50
                     flex items-center justify-center text-2xl hover:bg-blue-900/60
                     active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                     backdrop-blur-sm"
          title="Inventory (I)"
        >
          🎒
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {player.inventory.length}
          </span>
        </button>
      </div>
    </div>
  );
}
