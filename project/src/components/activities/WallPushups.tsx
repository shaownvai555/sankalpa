import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Activity, Play, Pause } from 'lucide-react';

interface WallPushupsProps {
  onComplete: () => void;
}

const WallPushups: React.FC<WallPushupsProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [completed, setCompleted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'push' | 'pull'>('pull');

  const targetCount = 10;

  useEffect(() => {
    if (isActive && timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || count >= targetCount) {
      setCompleted(true);
      setIsActive(false);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [timeLeft, isActive, completed, count, targetCount, onComplete]);

  // Animation cycle
  useEffect(() => {
    if (isActive && !completed) {
      const animationTimer = setInterval(() => {
        setAnimationPhase(prev => prev === 'push' ? 'pull' : 'push');
      }, 1500); // Change every 1.5 seconds

      return () => clearInterval(animationTimer);
    }
  }, [isActive, completed]);

  const handleCountClick = () => {
    if (count < targetCount) {
      setCount(prev => prev + 1);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">দেয়াল পুশআপ সম্পন্ন!</h4>
            <p className="text-gray-600 text-sm mb-4">
              আপনি {count}/{targetCount} দেয়াল পুশআপ সম্পন্ন করেছেন। +5 কয়েন অর্জিত!
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 text-xs">
                {count >= targetCount ? '🎉 লক্ষ্য অর্জিত!' : '💪 ভালো চেষ্টা!'}
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
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">দেয়াল পুশআপ</h3>
            <p className="text-gray-600 text-sm">{targetCount}টি দেয়াল পুশআপ করুন</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
          <div className="text-xs text-gray-500">বাকি সময়</div>
        </div>
      </div>

      {/* Animation Demo */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 relative">
          {/* Wall representation */}
          <div className="absolute right-4 top-4 bottom-4 w-2 bg-gray-400 rounded"></div>
          
          <motion.div
            className="text-6xl mb-4"
            animate={{
              x: animationPhase === 'push' ? 10 : 0,
              scale: animationPhase === 'push' ? 0.95 : 1,
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            🧍‍♂️
          </motion.div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-800">দেয়াল পুশআপ</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              দেয়াল থেকে এক হাত দূরত্বে দাঁড়ান। হাত দেয়ালে রেখে শরীর দেয়ালের দিকে ঝুঁকান, 
              তারপর আবার পিছনে ঠেলে দিন।
            </p>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="mb-6 text-center">
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {count} / {targetCount}
          </div>
          <p className="text-gray-600 text-sm mb-4">সম্পন্ন পুশআপ</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCountClick}
            disabled={count >= targetCount}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            একটি সম্পন্ন (+1)
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>অগ্রগতি</span>
          <span>{Math.round((count / targetCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(count / targetCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer Control */}
      <div className="mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTimer}
          className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
            isActive 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'বিরতি' : 'শুরু করুন'}</span>
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 mb-2">কীভাবে করবেন:</h5>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. দেয়াল থেকে এক হাত দূরত্বে দাঁড়ান</li>
          <li>2. হাতের তালু দেয়ালে কাঁধের সমান উচ্চতায় রাখুন</li>
          <li>3. শরীর দেয়ালের দিকে ঝুঁকান</li>
          <li>4. হাত দিয়ে ঠেলে আবার প্রথম অবস্থানে ফিরে আসুন</li>
          <li>5. প্রতিটি সম্পূর্ণ পুশআপের জন্য "+1" বাটনে ক্লিক করুন</li>
        </ol>
      </div>
    </div>
  );
};

export default WallPushups;