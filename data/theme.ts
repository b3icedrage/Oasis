export const Colors = {
  bg: '#07070d',
  surface: '#0e0e18',
  card: '#131320',
  border: '#1e1e30',
  cyan: '#00e5ff',
  magenta: '#ff00aa',
  green: '#00ff88',
  purple: '#a855f7',
  text: '#e0e0f0',
  muted: '#6b6b8a',
  dim: '#3a3a55',
  white: '#ffffff',
  black: '#000000',
} as const;

export const Gradients = {
  cyan: [Colors.cyan, Colors.purple] as const,
  magenta: [Colors.magenta, Colors.cyan] as const,
  neon: [Colors.cyan, Colors.green] as const,
  purple: [Colors.purple, Colors.magenta] as const,
} as const;
