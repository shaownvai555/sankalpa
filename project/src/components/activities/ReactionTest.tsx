import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, RotateCcw } from 'lucide-react';

interface ReactionTestProps {
  onComplete: () => void;
}

const ReactionTest: React.FC<ReactionTestProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'clicked' | 'completed'>('waiting');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [tooEarly, setTooEarly] = useState(false);

  const totalRounds = 5;

  const startRound = () => {
    setGameState('ready');
    setTooEarly(false);
    
    // Random delay between 2-6 seconds
    const delay = Math.random() * 4000 + 2000;
    
    const timeout = setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, delay);
    
    setTimeoutId(timeout);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      // Clicked too early
      setTooEarly(true);
      setGameState('waiting');
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      return;
    }
    
    if (gameState === 'go') {
      const reactionTime = Date.now() - startTime;
      setReactionTimes(prev => [...prev, reactionTime]);
      setGameState('clicked');
      
      setTimeout(() => {
        if (currentRound >= totalRounds) {
          setGameState('completed');
          setTimeout(() => {
            onComplete();
          }, 3000);
        } else {
          setCurrentRound(prev => prev + 1);
          setGameState('waiting');
        }
      }, 1500);
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setReactionTimes([]);
    setCurrentRound(1);
    setTooEarly(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const averageTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const getPerformanceMessage = (avgTime: number) => {
    if (avgTime < 200) return { text: '⚡ অসাধারণ দ্রুত!', color: 'text-green-600' };
    if (avgTime < 300) return { text: '🚀 খুব ভালো!', color: 'text-blue-600' };
    if (avgTime < 400) return { text: '👍 ভালো!', color: 'text-yellow-600' };
    return { text: '💪 আরও অনুশীলন করুন!', color: 'text-orange-600' };
  };

  if (gameState === 'completed') {
    const performance = getPerformanceMessage(averageTime);
    
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">প্রতিক্রিয়া পরীক্ষা সম্পন্ন!</h4>
            <div className="space-y-2 mb-4">
              <p className="text-2xl font-bold text-indigo-600">{averageTime}ms</p>
              <p className="text-gray-600 text-sm">গড় প্রতিক্রিয়ার সময়</p>
              <p className={`text-sm font-medium ${performance.color}`}>
                {performance.text}
              </p>
            </div>
            <p className="text-gray-600 text-sm mb-4">+5 কয়েন অর্জিত!</p>
            
            {/* Individual Times */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700 text-xs mb-2 font-medium">প্রতিটি রাউন্ডের সময়:</p>
              <div className="flex justify-center space-x-2">
                {reactionTimes.map((time, index) => (
                  <span key={index} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {time}ms
                  </span>
                ))}
              </div>
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
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">প্রতিক্রিয়া পরীক্ষা</h3>
            <p className="text-gray-600 text-sm">সবুজ হলেই ক্লিক করুন</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-yellow-600">
            {currentRound}/{totalRounds}
          </div>
          <div className="text-xs text-gray-500">রাউন্ড</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="mb-6">
        <motion.div
          className={`w-full h-48 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
            gameState === 'waiting' ? 'bg-gray-200' :
            gameState === 'ready' ? 'bg-red-500' :
            gameState === 'go' ? 'bg-green-500' :
            gameState === 'clicked' ? 'bg-blue-500' :
            'bg-gray-200'
          }`}
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-center text-white">
            {gameState === 'waiting' && (
              <div>
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-lg font-bold text-gray-600">শুরু করতে ক্লিক করুন</p>
                <p className="text-sm text-gray-500">রাউন্ড {currentRound}</p>
              </div>
            )}
            {gameState === 'ready' && (
              <div>
                <div className="text-4xl mb-4">🔴</div>
                <p className="text-lg font-bold">অপেক্ষা করুন...</p>
                <p className="text-sm">সবুজ হওয়ার জন্য অপেক্ষা করুন</p>
              </div>
            )}
            {gameState === 'go' && (
              <div>
                <div className="text-4xl mb-4">🟢</div>
                <p className="text-lg font-bold">এখনই ক্লিক করুন!</p>
              </div>
            )}
            {gameState === 'clicked' && (
              <div>
                <div className="text-4xl mb-4">⚡</div>
                <p className="text-lg font-bold">
                  {reactionTimes[reactionTimes.length - 1]}ms
                </p>
                <p className="text-sm">প্রতিক্রিয়ার সময়</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Too Early Warning */}
        {tooEarly && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-100 border border-red-200 rounded-xl p-3"
          >
            <p className="text-red-800 text-sm text-center font-medium">
              ⚠️ খুব তাড়াতাড়ি! সবুজ হওয়ার জন্য অপেক্ষা করুন
            </p>
          </motion.div>
        )}
      </div>

      {/* Progress and Stats */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>অগ্রগতি</span>
            <span>{reactionTimes.length}/{totalRounds} সম্পন্ন</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(reactionTimes.length / totalRounds) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current Stats */}
        {reactionTimes.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-yellow-700">
                  {Math.min(...reactionTimes)}ms
                </div>
                <div className="text-xs text-yellow-600">সবচেয়ে দ্রুত</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-700">
                  {averageTime}ms
                </div>
                <div className="text-xs text-yellow-600">গড়</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-700">
                  {Math.max(...reactionTimes)}ms
                </div>
                <div className="text-xs text-yellow-600">সবচেয়ে ধীর</div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {gameState === 'waiting' && reactionTimes.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>নতুন করে শুরু</span>
          </motion.button>
        )}

        {/* Start Button */}
        {gameState === 'waiting' && reactionTimes.length < totalRounds && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startRound}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-medium hover:from-yellow-700 hover:to-orange-700 transition-all"
          >
            {reactionTimes.length === 0 ? 'পরীক্ষা শুরু করুন' : 'পরবর্তী রাউন্ড'}
          </motion.button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-yellow-50 rounded-lg p-3">
        <p className="text-yellow-800 text-xs text-center">
          💡 লাল দেখলে অপেক্ষা করুন, সবুজ দেখলেই যত দ্রুত সম্ভব ক্লিক করুন!
        </p>
      </div>
    </div>
  );
};

export default ReactionTest;