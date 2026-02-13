
import React from 'react';

interface MenuProps {
  onStart: () => void;
  highScore: number;
}

const Menu: React.FC<MenuProps> = ({ onStart, highScore }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background with Cinematic Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598818384697-62330d600309?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center animate-[pulse_10s_infinite]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950 via-orange-900/40 to-black/60"></div>
      
      {/* Decorative Border */}
      <div className="absolute inset-8 border-2 border-yellow-600/30 pointer-events-none"></div>
      <div className="absolute inset-12 border border-yellow-600/10 pointer-events-none"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="mb-4 inline-block px-4 py-1 border border-orange-500/50 rounded-full bg-orange-500/10 backdrop-blur-sm text-orange-200 text-xs tracking-[0.5em] font-bold uppercase">
          An Ancient Epic Reimagined
        </div>
        
        <h1 className="text-7xl md:text-9xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-orange-400 to-red-700 mb-4 drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
          HANUMAN
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-12">
           <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-yellow-600"></div>
           <h2 className="text-xl md:text-2xl font-cinzel text-yellow-500 tracking-[0.4em] font-bold">
              QUEST FOR SANJEEVANI
           </h2>
           <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-yellow-600"></div>
        </div>
        
        <div className="flex flex-col gap-6 items-center">
          <button 
            onClick={onStart}
            className="group relative px-16 py-5 bg-gradient-to-b from-orange-500 to-red-700 text-white rounded-full font-black text-2xl transition-all shadow-[0_10px_30px_rgba(255,69,0,0.4)] hover:shadow-[0_15px_50px_rgba(255,69,0,0.6)] hover:scale-110 overflow-hidden border-b-4 border-red-900 active:translate-y-1"
          >
            <span className="relative z-10 tracking-widest">START THE ASCENT</span>
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
          
          <div className="mt-12 group cursor-default">
            <span className="text-orange-300/40 uppercase tracking-[0.6em] text-[10px] mb-2 block group-hover:text-yellow-400/60 transition-colors">Legendary Record</span>
            <div className="flex items-center gap-4">
               <span className="text-5xl font-cinzel font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                  {highScore.toLocaleString()}
               </span>
            </div>
          </div>
        </div>

        <div className="mt-20 text-orange-200/40 text-sm italic font-serif leading-relaxed">
          "With Rama in his heart and the wind at his back,<br/>
          The Son of Vayu leaps where others only dream."
        </div>
      </div>
      
      {/* Corner Ornaments */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-yellow-600/40 rounded-tl-3xl m-8"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-yellow-600/40 rounded-tr-3xl m-8"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-yellow-600/40 rounded-bl-3xl m-8"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-yellow-600/40 rounded-br-3xl m-8"></div>
    </div>
  );
};

export default Menu;
