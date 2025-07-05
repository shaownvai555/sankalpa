import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, Type } from 'lucide-react';

interface ReverseSpellingProps {
  onComplete: () => void;
}

const words = [
  { word: 'SUCCESS', meaning: 'সাফল্য' },
  { word: 'STRENGTH', meaning: 'শক্তি' },
  { word: 'COURAGE', meaning: 'সাহস' },
  { word: 'WISDOM', meaning: 'প্রজ্ঞা' },
  { word: 'PEACE', meaning: 'শান্তি' },
  { word: 'FOCUS', meaning: 'মনোযোগ' },
  { word: 'GROWTH', meaning: 'বৃদ্ধি' }
];

const ReverseSpelling: React.FC<ReverseSpellingProps> = ({ onComplete }) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Select a random word
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  }, []);

  const correctAnswer = currentWord.word.split('').reverse().join('');

  const handleSubmit = () => {
    const isAnswerCorrect = userInput.toUpperCase() === correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setAttempts(prev => prev + 1);

    if (isAnswerCorrect) {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleReset = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setUserInput('');
    setIsCorrect(null);
    setCompleted(false);
    setAttempts(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Type className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">উল্টো বানান</h3>
          <p className="text-gray-600 text-sm">শব্দটি উল্টো করে লিখুন</p>
        </div>
      </div>

      {completed ? (
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
            <p className="text-gray-600 text-sm">সঠিক উত্তর! +3 কয়েন অর্জিত</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Word Display */}
          <div className="text-center bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-700 mb-2 tracking-wider">
              {currentWord.word}
            </div>
            <div className="text-purple-600 text-sm">
              অর্থ: {currentWord.meaning}
            </div>
            <div className="text-xs text-purple-500 mt-2">
              এই শব্দটি উল্টো করে লিখুন
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="উল্টো বানান লিখুন..."
              className={`w-full p-4 text-center text-xl font-mono border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                isCorrect === true ? 'border-green-500 bg-green-50' :
                isCorrect === false ? 'border-red-500 bg-red-50' :
                'border-gray-300'
              }`}
            />

            {/* Feedback */}
            {isCorrect === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-600 text-sm"
              >
                ভুল! সঠিক উত্তর: <span className="font-bold">{correctAnswer}</span>
                <br />
                <span className="text-xs">আবার চেষ্টা করুন</span>
              </motion.div>
            )}

            {/* Hint after 2 attempts */}
            {attempts >= 2 && isCorrect !== true && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
              >
                <p className="text-yellow-800 text-sm text-center">
                  💡 সাহায্য: প্রতিটি অক্ষর উল্টো ক্রমে সাজান
                  <br />
                  <span className="font-mono text-xs">
                    {currentWord.word.split('').map((letter, index) => (
                      <span key={index} className="mx-1 p-1 bg-yellow-100 rounded">
                        {letter}
                      </span>
                    ))}
                  </span>
                </p>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="text-center text-xs text-gray-500">
            চেষ্টা: {attempts} | সময়সীমা: ৬০ সেকেন্ড
          </div>
        </div>
      )}
    </div>
  );
};

export default ReverseSpelling;