
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Level } from './types';
import { LEVELS } from './constants';
import Menu from './components/Menu';
import GameView from './components/GameView';
import StoryScreen from './components/StoryScreen';
import HUD from './components/HUD';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('hanuman_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const handleWin = useCallback(() => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setGameState(GameState.STORY);
    } else {
      setGameState(GameState.WIN);
    }
  }, [currentLevelIndex]);

  const handleGameOver = useCallback(() => {
    setGameState(GameState.GAMEOVER);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('hanuman_highscore', score.toString());
    }
  }, [score, highScore]);

  const startNewGame = () => {
    setScore(0);
    setCurrentLevelIndex(0);
    setGameState(GameState.STORY);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {gameState === GameState.MENU && (
        <Menu onStart={startNewGame} highScore={highScore} />
      )}
      
      {gameState === GameState.STORY && (
        <StoryScreen 
          level={LEVELS[currentLevelIndex]} 
          onContinue={() => setGameState(GameState.PLAYING)} 
        />
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
        <div className="relative w-full h-full">
          <GameView 
            level={LEVELS[currentLevelIndex]}
            onWin={handleWin}
            onGameOver={handleGameOver}
            onScoreChange={(s) => setScore(prev => prev + s)}
            isPaused={gameState === GameState.PAUSED}
            onTogglePause={() => setGameState(prev => prev === GameState.PAUSED ? GameState.PLAYING : GameState.PAUSED)}
          />
          <HUD score={score} levelName={LEVELS[currentLevelIndex].name} />
        </div>
      )}

      {gameState === GameState.GAMEOVER && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white p-8 text-center">
          <h2 className="text-6xl font-cinzel text-red-500 mb-4">MORTAL WOUND</h2>
          <p className="text-xl mb-8">Even the mightiest can fall. Return and try again, O Hanuman.</p>
          <button 
            onClick={() => setGameState(GameState.MENU)}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-full font-bold transition-all transform hover:scale-105"
          >
            MAIN MENU
          </button>
        </div>
      )}

      {gameState === GameState.WIN && (
        <div className="absolute inset-0 bg-orange-950/90 flex flex-col items-center justify-center z-50 text-white p-8 text-center">
          <h2 className="text-6xl font-cinzel text-yellow-400 mb-4">VICTORY</h2>
          <p className="text-2xl mb-8">The Sanjeevani is retrieved! Lakshmana is saved, and the divine path is clear.</p>
          <div className="mb-8">
             <span className="text-xl block opacity-70">FINAL SCORE</span>
             <span className="text-5xl font-bold">{score}</span>
          </div>
          <button 
            onClick={() => setGameState(GameState.MENU)}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold transition-all transform hover:scale-105"
          >
            GLORY TO THE LORD
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
