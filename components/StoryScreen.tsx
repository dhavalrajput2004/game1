
import React, { useEffect, useState } from 'react';
import { Level } from '../types';
import { getDivineEncouragement } from '../services/geminiService';

interface StoryScreenProps {
  level: Level;
  onContinue: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ level, onContinue }) => {
  const [narration, setNarration] = useState("Loading divine guidance...");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const fetchNarration = async () => {
      const text = await getDivineEncouragement(level.name, 'start');
      setNarration(text || level.description);
    };
    fetchNarration();
  }, [level]);

  return (
    <div className={`absolute inset-0 bg-black flex items-center justify-center p-8 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-2xl text-center">
        <h3 className="text-orange-500 font-cinzel text-xl mb-2">CHAPTER {level.id.slice(1)}</h3>
        <h2 className="text-5xl font-cinzel text-white mb-8 tracking-wider">{level.name.toUpperCase()}</h2>
        
        <div className="relative mb-12">
           <div className="absolute -inset-4 border border-orange-500/30 rounded-lg animate-pulse"></div>
           <p className="text-2xl text-orange-100 font-serif italic leading-relaxed">
             "{narration}"
           </p>
        </div>

        <button 
          onClick={onContinue}
          className="px-12 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded transition-all font-bold tracking-widest"
        >
          COMMENCE THE LEAP
        </button>
      </div>
    </div>
  );
};

export default StoryScreen;
