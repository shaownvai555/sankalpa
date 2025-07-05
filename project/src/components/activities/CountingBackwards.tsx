import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calculator, RotateCcw } from 'lucide-react';

interface CountingBackwardsProps {
  onComplete: () => void;
}

const CountingBackwards: React.FC<CountingBackwardsProps> = ({ onComplete }) => {
  const [currentNumber, setCurrentNumber] = useState(100);
  const [userInput, setUserInput] = useState('');
  const [sequence, setSequence] = useState<number[]>([100]);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const targetSequence = [100, 93, 86, 79, 72, 65, 58, 51, 44, 37, 30, 23, 16, 9, 2];

  const handleSubmit = () => {
    const inputNumber = parseInt(userInput);
    const expectedNumber = currentNumber - 7;
    
    if (inputNumber === expectedNumber) {
      const newSequence = [...sequence, inputNumber];
      setSequence(newSequence);
      setCurrentNumber(inputNumber);
      setUserInput('');
      setAttempts(0);
      setShowHint(false);

      // Check if completed (reached single digit)
      if (inputNumber <= 9) {
        setCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentNumber(100);
    setUserInput('');
    setSequence([100]);
    setCompleted(false);
    setAttempts(0);
    setShowHint(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleSubmit();
    }
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">চমৎকার!</h4>
            <p className="text-gray-600 text-sm mb-4">
              আপনি সফলভাবে ১০০ থেকে ৭ বিয়োগ করে গণনা সম্পন্ন করেছেন। +4 কয়েন অর্জিত!
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 text-xs">
                এই ব্যায়াম আপনার মনোযোগ এবং গাণিতিক দক্ষতা বৃদ্ধি করেছে।
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <Calculator className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">উল্টো গণনা</h3>
          <p className="text-gray-600 text-sm">১০০ থেকে ৭ বিয়োগ করে গণনা করুন</p>
        </div>
      </div>

      {/* Current Sequence Display */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">আপনার ক্রম:</p>
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex flex-wrap gap-2">
            {sequence.map((num, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-orange-200 text-orange-800 px-3 py-1 rounded-lg font-bold text-sm"
              >
                {num}
              </motion.div>
            ))}
            {!completed && (
              <div className="bg-gray-200 text-gray-500 px-3 py-1 rounded-lg font-bold text-sm border-2 border-dashed border-gray-400">
                ?
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Number Display */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6">
          <p className="text-orange-700 text-sm mb-2">বর্তমান সংখ্যা:</p>
          <div className="text-4xl font-bold text-orange-800 mb-2">{currentNumber}</div>
          <p className="text-orange-600 text-sm">এখান থেকে ৭ বিয়োগ করুন</p>
        </div>
      </div>

      {/* Input Field */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            পরবর্তী সংখ্যা লিখুন:
          </label>
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`${currentNumber} - 7 = ?`}
            className="w-full p-4 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Hint */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
          >
            <p className="text-yellow-800 text-sm text-center">
              💡 সাহায্য: {currentNumber} - 7 = <span className="font-bold">{currentNumber - 7}</span>
            </p>
          </motion.div>
        )}

        {/* Wrong Answer Feedback */}
        {attempts > 0 && !showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-600 text-sm"
          >
            ভুল উত্তর! আবার চেষ্টা করুন।
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!userInput.trim()}
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-medium hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          জমা দিন
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress */}
      <div className="mt-4 text-center text-xs text-gray-500">
        অগ্রগতি: {sequence.length - 1} / 14 ধাপ সম্পন্ন
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-orange-50 rounded-lg p-3">
        <p className="text-orange-800 text-xs text-center">
          💡 প্রতিবার ৭ বিয়োগ করুন যতক্ষণ না একক সংখ্যায় পৌঁছান
        </p>
      </div>
    </div>
  );
};

export default CountingBackwards;