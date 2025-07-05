import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Palette, RotateCcw } from 'lucide-react';

interface ColorMatchGameProps {
  onComplete: () => void;
}

const colors = [
  { name: 'লাল', color: '#EF4444', textColor: '#DC2626' },
  { name: 'নীল', color: '#3B82F6', textColor: '#2563EB' },
  { name: 'সবুজ', color: '#10B981', textColor: '#059669' },
  { name: 'হলুদ', color: '#F59E0B', textColor: '#D97706' },
  { name: 'বেগুনি', color: '#8B5CF6', textColor: '#7C3AED' },
  { name: 'গোলাপি', color: '#EC4899', textColor: '#DB2777' },
  { name: 'কমলা', color: '#F97316', textColor: '#EA580C' },
  { name: 'আকাশি', color: '#06B6D4', textColor: '#0891B2' }
];

const ColorMatchGame: React.FC<ColorMatchGameProps> = ({ onComplete }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordColor, setCurrentWordColor] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [round, setRound] = useState(1);

  const generateRound = () => {
    // Pick a random color for the word
    const wordColor = colors[Math.floor(Math.random() * colors.length)];
    // Pick a random color for the text color (might be different from word meaning)
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    
    setCurrentWord(wordColor.name);
    setCurrentWordColor(textColor.textColor);
    
    // Generate 4 options including the correct answer (text color)
    const correctAnswer = textColor.name;
    const wrongOptions = colors
      .filter(c => c.name !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(c => c.name);
    
    const allOptions = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setFeedback(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [timeLeft, completed, onComplete]);

  const handleOptionClick = (selectedOption: string) => {
    const correctColor = colors.find(c => c.textColor === currentWordColor);
    const isCorrect = selectedOption === correctColor?.name;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (round >= 15 || timeLeft <= 0) {
        setCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setRound(prev => prev + 1);
        generateRound();
      }
    }, 1000);
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
            <p className="text-gray-600 text-sm mb-4">
              আপনার স্কোর: {score}/{round - 1} সঠিক উত্তর
            </p>
            <p className="text-gray-600 text-sm mb-4">+4 কয়েন অর্জিত!</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 text-xs">
                {score >= 10 ? '🎉 চমৎকার মনোযোগ!' : 
                 score >= 5 ? '👍 ভালো করেছেন!' : 
                 '💪 আরও অনুশীলন করুন!'}
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
          <div className="w-10 h-10 bg-rainbow-100 rounded-full flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">রঙ মিলানো</h3>
            <p className="text-gray-600 text-sm">সঠিক রঙের নাম ক্লিক করুন</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-purple-600">{timeLeft}s</div>
          <div className="text-xs text-gray-500">Score: {score}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800 text-sm text-center font-medium">
          ⚠️ সাবধান! শব্দের অর্থ নয়, শব্দের রঙ দেখে উত্তর দিন!
        </p>
      </div>

      {/* Current Word Display */}
      <div className="mb-8 text-center">
        <div className="bg-gray-100 rounded-xl p-8">
          <p className="text-gray-600 text-sm mb-4">এই শব্দটি কোন রঙে লেখা?</p>
          <div 
            className="text-6xl font-bold mb-4"
            style={{ color: currentWordColor }}
          >
            {currentWord}
          </div>
          <p className="text-gray-500 text-xs">
            শব্দের অর্থ নয়, শব্দের রঙ দেখুন!
          </p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-4 p-3 rounded-xl text-center ${
            feedback === 'correct' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {feedback === 'correct' ? '✅ সঠিক!' : '❌ ভুল!'}
        </motion.div>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: feedback ? 1 : 1.02 }}
            whileTap={{ scale: feedback ? 1 : 0.98 }}
            onClick={() => !feedback && handleOptionClick(option)}
            disabled={feedback !== null}
            className={`p-4 rounded-xl font-medium transition-all ${
              feedback === null
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Round {round}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(round / 15) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-purple-50 rounded-lg p-3">
        <p className="text-purple-800 text-xs text-center">
          💡 এটি একটি স্ট্রুপ টেস্ট - আপনার মস্তিষ্কের মনোযোগ পরীক্ষা করে!
        </p>
      </div>
    </div>
  );
};

export default ColorMatchGame;