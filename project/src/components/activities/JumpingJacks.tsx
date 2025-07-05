import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Activity, Play, Pause } from 'lucide-react';

interface JumpingJacksProps {
  onComplete: () => void;
}

const JumpingJacks: React.FC<JumpingJacksProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [completed, setCompleted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'up' | 'down'>('down');

  const targetCount = 15;

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
        setAnimationPhase(prev => prev === 'up' ? 'down' : 'up');
      }, 1000); // Change every second

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
            <h4 className="text-lg font-bold text-gray-800 mb-2">জাম্পিং জ্যাকস সম্পন্ন!</h4>
            <p className="text-gray-600 text-sm mb-4">
              আপনি {count}/{targetCount} জাম্পিং জ্যাকস সম্পন্ন করেছেন। +4 কয়েন অর্জিত!
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
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">জাম্পিং জ্যাকস</h3>
            <p className="text-gray-600 text-sm">{targetCount}টি জাম্পিং জ্যাকস করুন</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{timeLeft}s</div>
          <div className="text-xs text-gray-500">বাকি সময়</div>
        </div>
      </div>

      {/* Animation Demo */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8">
          <motion.div
            className="text-8xl mb-4"
            animate={{
              y: animationPhase === 'up' ? -10 : 0,
              scale: animationPhase === 'up' ? 1.1 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            🤸‍♂️
          </motion.div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-800">জাম্পিং জ্যাকস</h4>
            <p className="text-green-700 text-sm leading-relaxed">
              পা একসাথে রেখে দাঁড়ান। লাফ দিয়ে পা ছড়িয়ে দিন এবং হাত মাথার উপর তুলুন। 
              আবার লাফ দিয়ে প্রথম অবস্থানে ফিরে আসুন।
            </p>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="mb-6 text-center">
        <div className="bg-white border-2 border-green-200 rounded-xl p-6">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {count} / {targetCount}
          </div>
          <p className="text-gray-600 text-sm mb-4">সম্পন্ন জাম্পিং জ্যাকস</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCountClick}
            disabled={count >= targetCount}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
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
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'বিরতি' : 'শুরু করুন'}</span>
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="bg-green-50 rounded-lg p-4">
        <h5 className="font-medium text-green-800 mb-2">কীভাবে করবেন:</h5>
        <ol className="text-green-700 text-sm space-y-1">
          <li>1. পা একসাথে রেখে সোজা দাঁড়ান</li>
          <li>2. লাফ দিয়ে পা ছড়িয়ে দিন এবং হাত মাথার উপর তুলুন</li>
          <li>3. আবার লাফ দিয়ে প্রথম অবস্থানে ফিরে আসুন</li>
          <li>4. প্রতিটি সম্পূর্ণ চক্রের জন্য "+1" বাটনে ক্লিক করুন</li>
        </ol>
      </div>
    </div>
  );
};

export default JumpingJacks;