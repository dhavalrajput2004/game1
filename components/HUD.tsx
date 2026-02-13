
import React from 'react';

interface HUDProps {
  score: number;
  levelName: string;
}

const HUD: React.FC<HUDProps> = ({ score, levelName }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-10 pointer-events-none flex justify-between items-start z-50">
      {/* Realm Name with Scroll Decor */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-orange-900/20 blur-xl group-hover:bg-orange-600/20 transition-all duration-500"></div>
        <div className="relative flex flex-col">
          <span className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.5em] mb-1">Divine Realm</span>
          <div className="flex items-center gap-3">
             <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
             <span className="text-4xl font-cinzel font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest">
                {levelName.toUpperCase()}
             </span>
          </div>
        </div>
      </div>

      {/* Divine Score with Glow */}
      <div className="relative flex flex-col items-end">
        <div className="absolute -inset-4 bg-yellow-900/10 blur-xl"></div>
        <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-1">Karmic Favor</span>
        <span className="text-6xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-500 drop-shadow-[0_5px_15px_rgba(255,215,0,0.4)] tabular-nums">
          {score.toLocaleString().padStart(7, '0')}
        </span>
      </div>
      
      {/* Mythical Background Seal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] font-cinzel text-[20rem] -z-10 select-none pointer-events-none">
        RAM
      </div>
    </div>
  );
};

export default HUD;
