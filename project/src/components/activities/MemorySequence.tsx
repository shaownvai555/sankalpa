import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Brain, RotateCcw, Play } from 'lucide-react';

interface MemorySequenceProps {
  onComplete: () => void;
}

const colors = [
  { name: 'লাল', color: '#EF4444', bgColor: 'bg-red-500' },
  { name: 'নীল', color: '#3B82F6', bgColor: 'bg-blue-500' },
  { name: 'সবুজ', color: '#10B981', bgColor: 'bg-green-500' },
  { name: 'হলুদ', color: '#F59E0B', bgColor: 'bg-yellow-500' },
  { name: 'বেগুনি', color: '#8B5CF6', bgColor: 'bg-purple-500' },
  { name: 'গোলাপি', color: '#EC4899', bgColor: 'bg-pink-500' }
];

const MemorySequence: React.FC<MemorySequenceProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'input' | 'correct' | 'wrong' | 'completed'>('waiting');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [score, setScore] = useState(0);

  const generateSequence = (length: number) => {
    const newSequence = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * colors.length));
    }
    return newSequence;
  };

  const startGame = () => {
    const newSequence = generateSequence(currentLevel + 2); // Start with 3 colors
    setSequence(newSequence);
    setUserSequence([]);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedIndex(-1);
    }
    
    setShowingSequence(false);
    setGameState('input');
  };

  const handleColorClick = (colorIndex: number) => {
    if (gameState !== 'input') return;

    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);

    // Check if the current input is correct
    if (sequence[newUserSequence.length - 1] !== colorIndex) {
      setGameState('wrong');
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      setGameState('correct');
      setScore(prev => prev + currentLevel);
      
      if (currentLevel >= 5) {
        // Game completed after 5 levels
        setTimeout(() => {
          setGameState('completed');
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 1000);
      } else {
        // Next level
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          setGameState('waiting');
        }, 1500);
      }
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setSequence([]);
    setUserSequence([]);
    setGameState('waiting');
    setHighlightedIndex(-1);
  };

  if (gameState === 'completed') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">স্মৃতি পরীক্ষা সম্পন্ন!</h4>
            <p className="text-gray-600 text-sm mb-4">
              চমৎকার! আপনি ৫টি লেভেল সম্পন্ন করেছেন। স্কোর: {score} পয়েন্ট
            </p>
            <p className="text-gray-600 text-sm mb-4">+6 কয়েন অর্জিত!</p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 text-xs">
                এই ব্যায়াম আপনার স্মৃতিশক্তি এবং মনোযোগ বৃদ্ধি করেছে।
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">স্মৃতি পরীক্ষা</h3>
            <p className="text-gray-600 text-sm">রঙের ক্রম মনে রাখুন</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-indigo-600">Level {currentLevel}</div>
          <div className="text-xs text-gray-500">Score: {score}</div>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 text-center">
        <div className="bg-indigo-50 rounded-xl p-4">
          {gameState === 'waiting' && (
            <div>
              <p className="text-indigo-800 font-medium mb-2">Level {currentLevel} শুরু করুন</p>
              <p className="text-indigo-600 text-sm">{currentLevel + 2}টি রঙের ক্রম মনে রাখতে হবে</p>
            </div>
          )}
          {gameState === 'showing' && (
            <div>
              <p className="text-indigo-800 font-medium mb-2">মনোযোগ দিয়ে দেখুন</p>
              <p className="text-indigo-600 text-sm">রঙের ক্রম মনে রাখুন</p>
            </div>
          )}
          {gameState === 'input' && (
            <div>
              <p className="text-indigo-800 font-medium mb-2">এখন ক্লিক করুন</p>
              <p className="text-indigo-600 text-sm">
                {userSequence.length + 1}/{sequence.length} - সঠিক ক্রমে রঙে ক্লিক করুন
              </p>
            </div>
          )}
          {gameState === 'correct' && (
            <div>
              <p className="text-green-800 font-medium mb-2">✅ সঠিক!</p>
              <p className="text-green-600 text-sm">পরবর্তী লেভেলে যাচ্ছেন...</p>
            </div>
          )}
          {gameState === 'wrong' && (
            <div>
              <p className="text-red-800 font-medium mb-2">❌ ভুল!</p>
              <p className="text-red-600 text-sm">আবার চেষ্টা করুন</p>
            </div>
          )}
        </div>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: gameState === 'input' ? 1.05 : 1 }}
            whileTap={{ scale: gameState === 'input' ? 0.95 : 1 }}
            onClick={() => handleColorClick(index)}
            disabled={gameState !== 'input'}
            className={`
              aspect-square rounded-xl font-medium text-white text-sm transition-all duration-300
              ${color.bgColor}
              ${highlightedIndex === index ? 'ring-4 ring-white ring-opacity-50 scale-110' : ''}
              ${gameState === 'input' ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}
              ${gameState !== 'input' ? 'opacity-70' : ''}
            `}
          >
            {color.name}
          </motion.button>
        ))}
      </div>

      {/* User Progress */}
      {gameState === 'input' && userSequence.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">আপনার ক্রম:</p>
          <div className="flex space-x-2">
            {userSequence.map((colorIndex, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg ${colors[colorIndex].bgColor}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {gameState === 'waiting' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>শুরু করুন</span>
          </motion.button>
        )}
        
        {gameState === 'wrong' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              আবার চেষ্টা
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-indigo-50 rounded-lg p-3">
        <p className="text-indigo-800 text-xs text-center">
          💡 রঙের ক্রম মনে রাখুন এবং একই ক্রমে ক্লিক করুন। প্রতি লেভেলে একটি করে রঙ বাড়বে।
        </p>
      </div>
    </div>
  );
};

export default MemorySequence;