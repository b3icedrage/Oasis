/**
 * Input System — Dual-Joystick mobile layout with keyboard fallback
 *
 * Left joystick:  Movement (WASD / Arrow keys / Touch drag)
 * Right joystick: Attack direction / Action (Space / Touch drag)
 *
 * Designed for mobile-first with responsive touch handling.
 */
import type { Vec2 } from './types';

export interface JoystickState {
  /** Normalized direction vector (magnitude 0–1) */
  direction: Vec2;
  /** Whether the joystick is currently being touched */
  active: boolean;
  /** Raw touch point in screen coords */
  touchPoint: Vec2 | null;
  /** Center of the joystick base in screen coords */
  center: Vec2;
}

export interface InputState {
  moveJoystick: JoystickState;
  attackJoystick: JoystickState;
  /** Keyboard-derived movement (used as fallback or supplement) */
  keyboardMove: Vec2;
  /** Whether space/enter is pressed (attack action) */
  attackPressed: boolean;
  /** Whether E/interact is pressed */
  interactPressed: boolean;
  /** Whether I is pressed (toggle inventory) */
  inventoryPressed: boolean;
}

/** Create a fresh JoystickState */
function createJoystick(centerX: number, centerY: number): JoystickState {
  return {
    direction: { x: 0, y: 0 },
    active: false,
    touchPoint: null,
    center: { x: centerX, y: centerY },
  };
}

/** Create the global input state */
export function createInputState(): InputState {
  return {
    moveJoystick: createJoystick(0, 0),
    attackJoystick: createJoystick(0, 0),
    keyboardMove: { x: 0, y: 0 },
    attackPressed: false,
    interactPressed: false,
    inventoryPressed: false,
  };
}

/** Normalize a vector to unit length (or zero if magnitude is 0) */
function normalize(v: Vec2): Vec2 {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  if (mag < 0.01) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

/** Clamp a joystick direction to a maximum magnitude (deadzone + max radius) */
function clampJoystick(touchPoint: Vec2, center: Vec2, maxRadius: number): Vec2 {
  const dx = touchPoint.x - center.x;
  const dy = touchPoint.y - center.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const deadzone = 10;

  if (dist < deadzone) return { x: 0, y: 0 };

  if (dist > maxRadius) {
    const ratio = maxRadius / dist;
    return { x: (dx * ratio) / maxRadius, y: (dy * ratio) / maxRadius };
  }

  return { x: dx / maxRadius, y: dy / maxRadius };
}

// ═════════════════════════════════════════════════════════════════════════════
// TOUCH EVENT HANDLERS
// ═════════════════════════════════════════════════════════════════════════════

/** Max joystick radius in pixels */
const JOYSTICK_MAX_RADIUS = 60;

/**
 * Set up touch and mouse event listeners on a canvas element.
 * Returns a cleanup function.
 */
export function setupInputListeners(
  canvas: HTMLCanvasElement,
  input: InputState,
  screenW: number,
  screenH: number
): () => void {
  // Position joysticks at bottom-left and bottom-right of the screen
  const moveCenter = { x: 100, y: screenH - 100 };
  const attackCenter = { x: screenW - 100, y: screenH - 100 };
  input.moveJoystick.center = moveCenter;
  input.attackJoystick.center = attackCenter;

  const activeTouches = new Map<number, 'move' | 'attack'>();

  function getTouchType(clientX: number): 'move' | 'attack' {
    return clientX < screenW / 2 ? 'move' : 'attack';
  }

  function handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    for (const touch of Array.from(e.changedTouches)) {
      const type = getTouchType(touch.clientX);
      activeTouches.set(touch.identifier, type);
      const joystick = type === 'move' ? input.moveJoystick : input.attackJoystick;
      joystick.active = true;
      joystick.touchPoint = { x: touch.clientX, y: touch.clientY };
      joystick.center = { ...moveCenter };
      if (type === 'attack') joystick.center = { ...attackCenter };
      joystick.direction = clampJoystick(joystick.touchPoint, joystick.center, JOYSTICK_MAX_RADIUS);
    }
  }

  function handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    for (const touch of Array.from(e.changedTouches)) {
      const type = activeTouches.get(touch.identifier);
      if (!type) continue;
      const joystick = type === 'move' ? input.moveJoystick : input.attackJoystick;
      joystick.touchPoint = { x: touch.clientX, y: touch.clientY };
      joystick.direction = clampJoystick(joystick.touchPoint, joystick.center, JOYSTICK_MAX_RADIUS);
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    for (const touch of Array.from(e.changedTouches)) {
      const type = activeTouches.get(touch.identifier);
      activeTouches.delete(touch.identifier);
      if (!type) continue;
      const joystick = type === 'move' ? input.moveJoystick : input.attackJoystick;
      joystick.active = false;
      joystick.touchPoint = null;
      joystick.direction = { x: 0, y: 0 };
    }
  }

  // Keyboard handling
  const keysDown = new Set<string>();

  function handleKeyDown(e: KeyboardEvent) {
    keysDown.add(e.key.toLowerCase());
    if (e.key === ' ' || e.key === 'Enter') input.attackPressed = true;
    if (e.key.toLowerCase() === 'e') input.interactPressed = true;
    if (e.key.toLowerCase() === 'i') input.inventoryPressed = true;
  }

  function handleKeyUp(e: KeyboardEvent) {
    keysDown.delete(e.key.toLowerCase());
    if (e.key === ' ' || e.key === 'Enter') input.attackPressed = false;
    if (e.key.toLowerCase() === 'e') input.interactPressed = false;
  }

  // Mouse fallback for desktop testing (left/right click on canvas)
  let mouseDown: 'move' | 'attack' | null = null;

  function handleMouseDown(e: MouseEvent) {
    const type = getTouchType(e.clientX);
    mouseDown = type;
    const joystick = type === 'move' ? input.moveJoystick : input.attackJoystick;
    joystick.active = true;
    joystick.touchPoint = { x: e.clientX, y: e.clientY };
    joystick.center = type === 'move' ? { ...moveCenter } : { ...attackCenter };
    joystick.direction = clampJoystick(joystick.touchPoint, joystick.center, JOYSTICK_MAX_RADIUS);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!mouseDown) return;
    const joystick = mouseDown === 'move' ? input.moveJoystick : input.attackJoystick;
    joystick.touchPoint = { x: e.clientX, y: e.clientY };
    joystick.direction = clampJoystick(joystick.touchPoint, joystick.center, JOYSTICK_MAX_RADIUS);
  }

  function handleMouseUp() {
    if (!mouseDown) return;
    const joystick = mouseDown === 'move' ? input.moveJoystick : input.attackJoystick;
    joystick.active = false;
    joystick.touchPoint = null;
    joystick.direction = { x: 0, y: 0 };
    mouseDown = null;
  }

  // Gamepad polling
  let gamepadConnected = false;

  function pollGamepad() {
    const gamepads = navigator.getGamepads();
    for (const gp of gamepads) {
      if (!gp) continue;
      gamepadConnected = true;
      // Left stick → move
      const lx = Math.abs(gp.axes[0]) > 0.15 ? gp.axes[0] : 0;
      const ly = Math.abs(gp.axes[1]) > 0.15 ? gp.axes[1] : 0;
      input.moveJoystick.direction = { x: lx, y: ly };
      input.moveJoystick.active = lx !== 0 || ly !== 0;
      // Right stick → attack
      const rx = Math.abs(gp.axes[2]) > 0.15 ? gp.axes[2] : 0;
      const ry = Math.abs(gp.axes[3]) > 0.15 ? gp.axes[3] : 0;
      input.attackJoystick.direction = { x: rx, y: ry };
      input.attackJoystick.active = rx !== 0 || ry !== 0;
      // Buttons
      input.attackPressed = gp.buttons[7]?.pressed || gp.buttons[5]?.pressed || false;
    }
  }

  // Keyboard update (called each frame)
  function updateKeyboard() {
    if (gamepadConnected) pollGamepad();

    const kx = (keysDown.has('a') || keysDown.has('arrowleft') ? -1 : 0) +
               (keysDown.has('d') || keysDown.has('arrowright') ? 1 : 0);
    const ky = (keysDown.has('w') || keysDown.has('arrowup') ? -1 : 0) +
               (keysDown.has('s') || keysDown.has('arrowdown') ? 1 : 0);

    if (!input.moveJoystick.active) {
      input.keyboardMove = normalize({ x: kx, y: ky });
    } else {
      input.keyboardMove = { x: 0, y: 0 };
    }
  }

  // Attach events
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseleave', handleMouseUp);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('gamepadconnected', () => { gamepadConnected = true; });

  // Attach the keyboard update to the input state
  (input as any)._updateKeyboard = updateKeyboard;
  (input as any)._moveCenter = moveCenter;
  (input as any)._attackCenter = attackCenter;

  // Cleanup function
  return () => {
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchcancel', handleTouchEnd);
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mouseleave', handleMouseUp);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}

/** Get the combined movement direction (joystick takes priority over keyboard) */
export function getMovementDirection(input: InputState): Vec2 {
  if (input.moveJoystick.active) {
    return { ...input.moveJoystick.direction };
  }
  return { ...input.keyboardMove };
}

/** Get the combined attack direction (joystick or keyboard) */
export function getAttackDirection(input: InputState): Vec2 {
  if (input.attackJoystick.active) {
    return { ...input.attackJoystick.direction };
  }
  // Default attack in facing direction
  return input.moveJoystick.active
    ? { ...input.moveJoystick.direction }
    : { ...input.keyboardMove };
}

/** Update the keyboard state each frame */
export function updateInput(input: InputState): void {
  const update = (input as any)._updateKeyboard as (() => void) | undefined;
  if (update) update();
}
