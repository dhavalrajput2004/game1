
import { Level } from './types';

export const GRAVITY = 0.5;
export const FRICTION = 0.8;
export const JUMP_FORCE = -12;
export const MOVE_SPEED = 5;
export const FLY_DRAIN = 0.5;
export const FLY_GAIN = 0.2;
export const MAX_FLY_ENERGY = 100;

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 600;

export const LEVELS: Level[] = [
  {
    id: 'l1',
    name: 'Kishkindha',
    description: 'The lush monkey kingdom. Watch out for forest demons!',
    theme: 'kishkindha',
    width: 5000,
    height: 600,
  },
  {
    id: 'l2',
    name: 'Vindhya Mountains',
    description: 'A rocky path across the treacherous cliffs.',
    theme: 'vindhya',
    width: 6000,
    height: 600,
  },
  {
    id: 'l3',
    name: 'Lanka',
    description: 'The Golden City. Face the might of Ravana\'s army.',
    theme: 'lanka',
    width: 8000,
    height: 600,
  }
];

export const THEME_COLORS = {
  kishkindha: {
    sky: '#87CEEB',
    ground: '#228B22',
    accent: '#FFD700',
  },
  vindhya: {
    sky: '#4682B4',
    ground: '#8B4513',
    accent: '#F4A460',
  },
  lanka: {
    sky: '#191970',
    ground: '#FFD700',
    accent: '#FF4500',
  }
};
