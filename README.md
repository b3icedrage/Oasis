# ⚔️ Realm of Shadows — RPG

A complete top-down 2D RPG game built with **React + TypeScript + Canvas**, playable in browser and packaged as an **Android APK**.

## 🎮 Features

- **Player Controller** — WASD/Touch dual-joystick movement with collision detection
- **Stats System** — Health, attack power, defense, healing
- **Inventory System** — Weapons, armor, consumables with rarity tiers (Common/Rare/Epic)
- **Enemy AI** — State machine (Idle → Chase → Attack) with 4 enemy types
- **World** — Procedural tile map with grass, trees, water, buildings, paths
- **Combat** — Real-time attack with damage numbers and particle effects
- **HUD** — Health bar, score, minimap, potion/inventory buttons

## 🚀 Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:5173` in your browser.

## 📱 Build APK

### Option 1: GitHub Actions (Automatic)
Push to `main` — the workflow builds the APK automatically.
Download the APK from **Actions → Build Android APK → Artifacts**.

### Option 2: Local Build
```bash
bun run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🎮 Controls

| Input | Action |
|-------|--------|
| WASD / Left Joystick | Move |
| Click / Right Joystick | Attack |
| I | Toggle Inventory |
| P | Use Potion |

## 🏗️ Architecture

```
src/game/
├── core/           — Engine, input, camera, types
├── systems/        — Stats, inventory (ScriptableObject pattern)
├── entities/       — Player controller, Enemy AI state machine
├── world/          — Tile map, Canvas renderer
└── components/     — React HUD, inventory panel
```

## 📦 Tech Stack

- React 19 + TypeScript
- Vite 8 (build tool)
- Tailwind CSS 4
- HTML5 Canvas (game rendering)
- Capacitor 8 (Android packaging)
- GitHub Actions (CI/CD)
