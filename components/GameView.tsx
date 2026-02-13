
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Level, Player, Entity, PowerUpType } from '../types';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  GRAVITY, 
  FRICTION, 
  JUMP_FORCE, 
  MOVE_SPEED, 
  MAX_FLY_ENERGY,
  THEME_COLORS
} from '../constants';

interface GameViewProps {
  level: Level;
  onWin: () => void;
  onGameOver: () => void;
  onScoreChange: (score: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

const GameView: React.FC<GameViewProps> = ({ 
  level, onWin, onGameOver, onScoreChange, isPaused, onTogglePause 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraX, setCameraX] = useState(0);
  const frameCountRef = useRef(0);

  // Game state held in refs for the loop performance
  const playerRef = useRef<Player>({
    id: 'p1',
    pos: { x: 100, y: 300 },
    vel: { x: 0, y: 0 },
    width: 45,
    height: 65,
    type: 'player',
    health: 100,
    maxHealth: 100,
    isJumping: false,
    canDoubleJump: true,
    isFlying: false,
    flyEnergy: MAX_FLY_ENERGY,
    powerUp: null,
    powerUpTimer: 0,
    direction: 1,
    isAttacking: false,
    attackTimer: 0,
    invincible: false
  });

  const entitiesRef = useRef<Entity[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const ents: Entity[] = [];
    ents.push({
      id: 'ground',
      pos: { x: 0, y: CANVAS_HEIGHT - 40 },
      vel: { x: 0, y: 0 },
      width: level.width,
      height: 40,
      type: 'platform'
    });

    for (let i = 500; i < level.width - 600; i += 700) {
      const platY = 350 - Math.random() * 200;
      ents.push({
        id: `plat-${i}`,
        pos: { x: i, y: platY },
        vel: { x: 0, y: 0 },
        width: 250,
        height: 25,
        type: 'platform'
      });

      ents.push({
        id: `enemy-${i}`,
        pos: { x: i + 100, y: platY - 60 },
        vel: { x: (Math.random() > 0.5 ? 1 : -1) * 2, y: 0 },
        width: 50,
        height: 60,
        type: 'enemy'
      });
      
      if (Math.random() > 0.6) {
        ents.push({
          id: `pu-${i}`,
          pos: { x: i + 125, y: platY - 150 },
          vel: { x: 0, y: 0 },
          width: 35,
          height: 35,
          type: 'powerup'
        });
      }
    }

    ents.push({
      id: 'goal',
      pos: { x: level.width - 300, y: CANVAS_HEIGHT - 450 },
      vel: { x: 0, y: 0 },
      width: 150,
      height: 410,
      type: 'goal'
    });

    entitiesRef.current = ents;
  }, [level]);

  const update = useCallback(() => {
    if (isPaused) return;

    const player = playerRef.current;
    const keys = keysRef.current;

    if (keys['ArrowRight'] || keys['d']) {
      player.vel.x = MOVE_SPEED;
      player.direction = 1;
    } else if (keys['ArrowLeft'] || keys['a']) {
      player.vel.x = -MOVE_SPEED;
      player.direction = -1;
    } else {
      player.vel.x *= FRICTION;
    }

    if (keys[' '] && !player.isAttacking) {
      player.isAttacking = true;
      player.attackTimer = 12; 
    }
    if (player.isAttacking) {
      player.attackTimer--;
      if (player.attackTimer <= 0) player.isAttacking = false;
    }

    if ((keys['ArrowUp'] || keys['w']) && !player.isJumping) {
      player.vel.y = JUMP_FORCE;
      player.isJumping = true;
    }

    if (keys['Shift'] && player.flyEnergy > 0) {
      player.isFlying = true;
      player.vel.y = -5;
      player.flyEnergy -= 0.8;
    } else {
      player.isFlying = false;
      if (player.flyEnergy < MAX_FLY_ENERGY) player.flyEnergy += 0.3;
    }

    if (!player.isFlying) {
      player.vel.y += GRAVITY;
    }
    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;

    entitiesRef.current.forEach(entity => {
      const collides = (
        player.pos.x < entity.pos.x + entity.width &&
        player.pos.x + player.width > entity.pos.x &&
        player.pos.y < entity.pos.y + entity.height &&
        player.pos.y + player.height > entity.pos.y
      );

      if (collides) {
        if (entity.type === 'platform') {
          if (player.vel.y > 0 && player.pos.y + player.height - player.vel.y <= entity.pos.y + 10) {
            player.pos.y = entity.pos.y - player.height;
            player.vel.y = 0;
            player.isJumping = false;
          }
        } else if (entity.type === 'enemy') {
          if (player.isAttacking) {
            entitiesRef.current = entitiesRef.current.filter(e => e.id !== entity.id);
            onScoreChange(150);
          } else if (!player.invincible) {
            player.health -= 0.5;
            player.pos.x -= player.direction * 15;
          }
        } else if (entity.type === 'powerup') {
          player.invincible = true;
          player.powerUpTimer = 400;
          entitiesRef.current = entitiesRef.current.filter(e => e.id !== entity.id);
          onScoreChange(1000);
        } else if (entity.type === 'goal') {
          onWin();
        }
      }

      if (entity.type === 'enemy') {
        entity.pos.x += entity.vel.x;
        // Basic patrol logic
        if (entity.pos.x < 0 || entity.pos.x > level.width) entity.vel.x *= -1;
      }
    });

    if (player.pos.y > CANVAS_HEIGHT + 100) onGameOver();
    if (player.health <= 0) onGameOver();

    if (player.powerUpTimer > 0) {
      player.powerUpTimer--;
      if (player.powerUpTimer <= 0) player.invincible = false;
    }

    const targetCamX = Math.max(0, Math.min(level.width - CANVAS_WIDTH, player.pos.x - CANVAS_WIDTH / 2));
    setCameraX(prev => prev + (targetCamX - prev) * 0.1);
    frameCountRef.current++;
  }, [isPaused, level, onWin, onGameOver, onScoreChange]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const player = playerRef.current;
    const theme = THEME_COLORS[level.theme];
    const frame = frameCountRef.current;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // --- Sky Background ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    skyGrad.addColorStop(0, theme.sky);
    skyGrad.addColorStop(1, '#fff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // --- Far Parallax (Mountains) ---
    ctx.save();
    ctx.translate(-cameraX * 0.2, 0);
    ctx.fillStyle = theme.ground + '33';
    for (let i = 0; i < 5; i++) {
       ctx.beginPath();
       ctx.moveTo(i * 800, CANVAS_HEIGHT);
       ctx.lineTo(i * 800 + 400, 200);
       ctx.lineTo(i * 800 + 800, CANVAS_HEIGHT);
       ctx.fill();
    }
    ctx.restore();

    // --- Level Objects ---
    ctx.save();
    ctx.translate(-cameraX, 0);

    entitiesRef.current.forEach(e => {
      if (e.type === 'platform') {
        const platGrad = ctx.createLinearGradient(e.pos.x, e.pos.y, e.pos.x, e.pos.y + e.height);
        platGrad.addColorStop(0, theme.ground);
        platGrad.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = platGrad;
        ctx.roundRect ? ctx.roundRect(e.pos.x, e.pos.y, e.width, e.height, 5) : ctx.fillRect(e.pos.x, e.pos.y, e.width, e.height);
        ctx.fill();
        
        // Vines
        ctx.strokeStyle = '#2d5a27';
        ctx.lineWidth = 2;
        for (let vx = e.pos.x + 20; vx < e.pos.x + e.width; vx += 50) {
           ctx.beginPath();
           ctx.moveTo(vx, e.pos.y + e.height);
           ctx.lineTo(vx + Math.sin(frame * 0.05 + vx) * 10, e.pos.y + e.height + 40);
           ctx.stroke();
        }
      } else if (e.type === 'enemy') {
        // Rakshasa
        const bounce = Math.sin(frame * 0.1) * 5;
        ctx.fillStyle = '#300';
        ctx.fillRect(e.pos.x, e.pos.y + bounce, e.width, e.height);
        // Horns
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(e.pos.x, e.pos.y + bounce);
        ctx.lineTo(e.pos.x - 10, e.pos.y + bounce - 20);
        ctx.lineTo(e.pos.x + 10, e.pos.y + bounce);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.pos.x + e.width, e.pos.y + bounce);
        ctx.lineTo(e.pos.x + e.width + 10, e.pos.y + bounce - 20);
        ctx.lineTo(e.pos.x + e.width - 10, e.pos.y + bounce);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(e.pos.x + 15, e.pos.y + 20 + bounce, 4, 0, Math.PI * 2);
        ctx.arc(e.pos.x + 35, e.pos.y + 20 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'powerup') {
        // Divine Chakra
        const pulse = Math.sin(frame * 0.1) * 5;
        ctx.save();
        ctx.translate(e.pos.x + e.width/2, e.pos.y + e.height/2 + pulse);
        ctx.rotate(frame * 0.05);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          ctx.rotate(Math.PI / 4);
          ctx.moveTo(0, 0);
          ctx.lineTo(20, 0);
        }
        ctx.stroke();
        ctx.restore();
      } else if (e.type === 'goal') {
        // Dronagiri Mountain
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.moveTo(e.pos.x, e.pos.y + e.height);
        ctx.lineTo(e.pos.x + e.width / 2, e.pos.y);
        ctx.lineTo(e.pos.x + e.width, e.pos.y + e.height);
        ctx.fill();
        // Glowing Herb
        const glow = Math.abs(Math.sin(frame * 0.05)) * 20;
        ctx.shadowBlur = glow;
        ctx.shadowColor = '#0f0';
        ctx.fillStyle = '#0f0';
        ctx.beginPath();
        ctx.arc(e.pos.x + e.width/2, e.pos.y + 50, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
    ctx.restore();

    // --- Player: Hanuman ---
    const drawX = player.pos.x - cameraX;
    const drawY = player.pos.y;
    const isRight = player.direction === 1;

    // Divine Glow
    if (player.invincible || player.isFlying) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = player.invincible ? '#ffd700' : '#87ceeb';
    }

    // Body
    ctx.fillStyle = '#ff8c00';
    ctx.fillRect(drawX, drawY + 15, player.width, player.height - 15);
    
    // Dhoti (lower garment)
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(drawX, drawY + 45, player.width, 20);

    // Head & Crown
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(drawX + 5, drawY - 10, 35, 30);
    ctx.fillStyle = '#ffd700'; // Mukut
    ctx.beginPath();
    ctx.moveTo(drawX + 5, drawY - 10);
    ctx.lineTo(drawX + 22, drawY - 25);
    ctx.lineTo(drawX + 40, drawY - 10);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(drawX + (isRight ? 25 : 5), drawY + 2, 6, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(drawX + (isRight ? 28 : 5), drawY + 3, 3, 3);

    // Tail (Physics-y)
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const tailBaseX = isRight ? drawX : drawX + player.width;
    ctx.moveTo(tailBaseX, drawY + player.height - 10);
    ctx.quadraticCurveTo(
      tailBaseX - 40 * player.direction + Math.sin(frame * 0.1) * 10, 
      drawY + 20, 
      tailBaseX - 30 * player.direction, 
      drawY - 20 + Math.cos(frame * 0.1) * 5
    );
    ctx.stroke();

    // Gada (Mace)
    ctx.save();
    const attackOffset = player.isAttacking ? (isRight ? 40 : -40) : 0;
    const gadaRotation = player.isAttacking ? (isRight ? Math.PI/4 : -Math.PI/4) : 0;
    ctx.translate(drawX + (isRight ? player.width : 0) + attackOffset, drawY + 30);
    ctx.rotate(gadaRotation);
    
    // Handle
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke();
    // Mace Head
    const maceGrad = ctx.createRadialGradient(0, -10, 2, 0, -10, 15);
    maceGrad.addColorStop(0, '#fff');
    maceGrad.addColorStop(1, '#c0c0c0');
    ctx.fillStyle = maceGrad;
    ctx.beginPath(); ctx.arc(0, -10, 15, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.shadowBlur = 0;

  }, [cameraX, level.theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    const loop = () => {
      update();
      draw(ctx);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [update, draw]);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="block mx-auto border-8 border-orange-950 rounded-2xl shadow-[0_0_50px_rgba(255,140,0,0.3)]"
      />
      
      {/* Flight Energy Bar - Stylized */}
      <div className="absolute top-28 left-12 w-72">
        <div className="text-orange-200 text-[10px] uppercase tracking-[0.4em] mb-1 font-bold">Prana Energy (SHIFT)</div>
        <div className="h-4 bg-orange-950/80 rounded-full border-2 border-yellow-600/50 p-0.5 overflow-hidden backdrop-blur-md">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-300 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,191,255,0.5)]" 
            style={{ width: `${(playerRef.current.flyEnergy / MAX_FLY_ENERGY) * 100}%` }}
          />
        </div>
      </div>

      {/* Health Bar */}
      <div className="absolute top-28 right-12 w-72 flex flex-col items-end">
        <div className="text-red-200 text-[10px] uppercase tracking-[0.4em] mb-1 font-bold">Divine Essence</div>
        <div className="h-4 w-full bg-orange-950/80 rounded-full border-2 border-red-600/50 p-0.5 overflow-hidden backdrop-blur-md">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-orange-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,0,0,0.5)]" 
            style={{ width: `${playerRef.current.health}%` }}
          />
        </div>
      </div>

      {isPaused && (
        <div className="absolute inset-0 bg-orange-950/70 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="text-center p-12 border-4 border-yellow-500 rounded-3xl bg-black/50 shadow-2xl">
            <h2 className="text-6xl font-cinzel text-yellow-400 mb-8 animate-pulse">DHYANA</h2>
            <p className="text-orange-200 mb-12 italic">"Focus your spirit, O Mighty Hanuman."</p>
            <button 
              onClick={onTogglePause}
              className="px-12 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:scale-105"
            >
              RETURN TO QUEST
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;
