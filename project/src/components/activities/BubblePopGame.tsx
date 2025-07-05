import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

interface BubblePopGameProps {
  onComplete: () => void;
}

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const BubblePopGame: React.FC<BubblePopGameProps> = ({ onComplete }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completed, setCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: 100, // Start from bottom
      size: Math.random() * 30 + 20, // 20px to 50px
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 1 // 1 to 3 seconds to reach top
    };
    return newBubble;
  }, []);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [timeLeft, completed, gameStarted, onComplete]);

  // Bubble generation
  useEffect(() => {
    if (!gameStarted || completed) return;

    const bubbleInterval = setInterval(() => {
      setBubbles(prev => [...prev, createBubble()]);
    }, 800); // Create new bubble every 800ms

    return () => clearInterval(bubbleInterval);
  }, [gameStarted, completed, createBubble]);

  // Bubble movement and cleanup
  useEffect(() => {
    if (!gameStarted || completed) return;

    const moveInterval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({ ...bubble, y: bubble.y - bubble.speed }))
          .filter(bubble => bubble.y > -10) // Remove bubbles that went off screen
      );
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(moveInterval);
  }, [gameStarted, completed]);

  const popBubble = (bubbleId: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    setScore(prev => prev + 1);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setBubbles([]);
  };

  if (completed) {
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">গেম শেষ!</h4>
            <p className="text-gray-600 text-sm mb-2">
              আপনি {score}টি বুদবুদ ফাটিয়েছেন! +3 কয়েন অর্জিত
            </p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 text-xs">
                {score >= 20 ? '🎉 চমৎকার স্কোর!' : 
                 score >= 10 ? '👍 ভালো খেলেছেন!' : 
                 '💪 আরও ভালো করতে পারবেন!'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">বুদবুদ ফাটানো</h3>
            <p className="text-gray-600 text-sm">৩০ সেকেন্ডে যত বেশি পারেন</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-4xl mb-4">🫧</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">কীভাবে খেলবেন</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              উপর থেকে নিচে আসা বুদবুদগুলোতে ক্লিক করুন। 
              যত বেশি বুদবুদ ফাটাবেন, তত বেশি পয়েন্ট পাবেন!
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            গেম শুরু করুন
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">বুদবুদ ফাটানো</h3>
            <p className="text-gray-600 text-sm">স্কোর: {score}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">{timeLeft}s</div>
          <div className="text-xs text-gray-500">বাকি সময়</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative bg-gradient-to-b from-sky-100 to-blue-200 rounded-xl h-64 overflow-hidden">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                backgroundColor: bubble.color,
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: 'inset -5px -5px 10px rgba(255,255,255,0.5), inset 5px 5px 10px rgba(0,0,0,0.1)',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
              onClick={() => popBubble(bubble.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          ))}
        </AnimatePresence>

        {/* Instructions overlay */}
        {bubbles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-blue-700">
              <div className="text-2xl mb-2">🫧</div>
              <p className="text-sm">বুদবুদ আসছে...</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-lg px-4 py-2">
          <span className="text-blue-600 font-bold text-lg">{score}</span>
          <span className="text-blue-600 text-sm">বুদবুদ ফাটানো হয়েছে</span>
        </div>
      </div>
    </div>
  );
};

export default BubblePopGame;