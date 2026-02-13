
export enum GameState {
  MENU,
  STORY,
  PLAYING,
  GAMEOVER,
  WIN,
  PAUSED
}

export enum PowerUpType {
  PANCHAMUKHI,
  SUNDARA_KANDA,
  FLIGHT
}

export interface Vector {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector;
  vel: Vector;
  width: number;
  height: number;
  type: 'player' | 'enemy' | 'platform' | 'powerup' | 'projectile' | 'goal';
}

export interface Player extends Entity {
  health: number;
  maxHealth: number;
  isJumping: boolean;
  canDoubleJump: boolean;
  isFlying: boolean;
  flyEnergy: number;
  powerUp: PowerUpType | null;
  powerUpTimer: number;
  direction: 1 | -1;
  isAttacking: boolean;
  attackTimer: number;
  invincible: boolean;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  theme: 'kishkindha' | 'vindhya' | 'lanka';
  width: number;
  height: number;
}

export interface GameContextType {
  state: GameState;
  setState: (s: GameState) => void;
  score: number;
  setScore: (n: number) => void;
  currentLevelIndex: number;
  setLevelIndex: (n: number) => void;
}
