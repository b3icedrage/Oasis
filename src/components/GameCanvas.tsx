/**
 * GameCanvas — Main game component
 *
 * Manages:
 *  - Canvas lifecycle (mount/unmount)
 *  - Game engine initialization
 *  - React state bridge for HUD and inventory
 *  - Keyboard shortcuts (I = inventory, P = potion)
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine, type GameState } from '../game/core/GameEngine';
import { HUD } from './HUD';
import { InventoryPanel } from './InventoryPanel';
import type { PlayerEntity } from '../game/core/types';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [player, setPlayer] = useState<PlayerEntity | null>(null);
  const [score, setScore] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [, forceUpdate] = useState(0);

  const triggerUpdate = useCallback(() => forceUpdate((n) => n + 1), []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onStateChange: (state: GameState) => {
        // Throttle React state updates to every 5 frames (~80ms)
        setPlayer({ ...state.player });
        setScore(state.score);
        setEnemiesDefeated(state.enemiesDefeated);
        setGameTime(state.gameTime);
      },
      onGameOver: () => {
        setGameOver(true);
      },
      onEnemyDefeated: (name) => {
        console.log(`[UI] ${name} was defeated!`);
      },
      onItemPickup: (name) => {
        console.log(`[UI] Picked up ${name}!`);
      },
    });

    engineRef.current = engine;
    engine.start();

    // Handle window resize
    const handleResize = () => engine.resizeCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'i') {
        setShowInventory((v) => !v);
      }
      if (e.key.toLowerCase() === 'p') {
        engineRef.current?.quickUsePotion();
        triggerUpdate();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [triggerUpdate]);

  const handlePotion = useCallback(() => {
    engineRef.current?.quickUsePotion();
    triggerUpdate();
  }, [triggerUpdate]);

  const handleInventoryToggle = useCallback(() => {
    setShowInventory((v) => !v);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="block touch-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* HUD overlay */}
      {player && !gameOver && (
        <HUD
          player={player}
          score={score}
          enemiesDefeated={enemiesDefeated}
          gameTime={gameTime}
          onPotion={handlePotion}
          onInventory={handleInventoryToggle}
        />
      )}

      {/* Inventory panel */}
      {showInventory && player && (
        <InventoryPanel
          player={player}
          onClose={() => setShowInventory(false)}
          onUpdate={triggerUpdate}
        />
      )}

      {/* Game title overlay (fades after 3 seconds) */}
      {!gameOver && gameTime < 3 && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{ opacity: Math.max(0, 1 - gameTime / 3) }}
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-2xl"
                style={{ textShadow: '0 0 30px rgba(255,170,0,0.5)' }}>
              ⚔️ Realm of Shadows
            </h1>
            <p className="text-gray-300 text-lg">Defeat enemies. Collect loot. Survive.</p>
            <p className="text-gray-500 text-sm mt-2">
              WASD/Joystick to move · Click/Joystick to attack · I = Inventory · P = Potion
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
