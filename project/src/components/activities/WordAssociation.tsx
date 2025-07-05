import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Plus, X } from 'lucide-react';

interface WordAssociationProps {
  onComplete: () => void;
}

const prompts = [
  { word: 'সাফল্য', meaning: 'Success' },
  { word: 'শান্তি', meaning: 'Peace' },
  { word: 'সাহস', meaning: 'Courage' },
  { word: 'স্বপ্ন', meaning: 'Dream' },
  { word: 'শক্তি', meaning: 'Strength' },
  { word: 'আনন্দ', meaning: 'Joy' },
  { word: 'প্রকৃতি', meaning: 'Nature' },
  { word: 'বন্ধুত্ব', meaning: 'Friendship' }
];

const WordAssociation: React.FC<WordAssociationProps> = ({ onComplete }) => {
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    // Select random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || userWords.length >= 5) {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [timeLeft, completed, userWords.length, onComplete]);

  const addWord = () => {
    if (currentInput.trim() && userWords.length < 5) {
      setUserWords(prev => [...prev, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeWord = (index: number) => {
    setUserWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      addWord();
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">সৃজনশীল চিন্তা সম্পন্ন!</h4>
            <p className="text-gray-600 text-sm mb-4">
              আপনি {userWords.length}টি সম্পর্কিত শব্দ খুঁজে পেয়েছেন। +5 কয়েন অর্জিত!
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 text-xs">
                এই ব্যায়াম আপনার সৃজনশীল চিন্তাভাবনা এবং শব্দভান্ডার বৃদ্ধি করেছে।
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
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">শব্দ সংযোগ</h3>
            <p className="text-gray-600 text-sm">সম্পর্কিত শব্দ খুঁজুন</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-teal-600">{timeLeft}s</div>
          <div className="text-xs text-gray-500">বাকি সময়</div>
        </div>
      </div>

      {/* Prompt Word */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl p-6">
          <div className="text-3xl font-bold text-teal-700 mb-2">
            {currentPrompt.word}
          </div>
          <div className="text-teal-600 text-sm mb-3">
            ({currentPrompt.meaning})
          </div>
          <p className="text-teal-700 text-sm">
            এই শব্দের সাথে সম্পর্কিত ৫টি শব্দ লিখুন
          </p>
        </div>
      </div>

      {/* User Words Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">
            আপনার শব্দগুলো ({userWords.length}/5):
          </p>
          <div className="text-xs text-gray-500">
            {5 - userWords.length} টি বাকি
          </div>
        </div>
        
        <div className="min-h-[80px] bg-gray-50 rounded-xl p-4">
          {userWords.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">এখানে আপনার শব্দগুলো দেখাবে</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userWords.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-teal-100 text-teal-800 px-3 py-2 rounded-lg flex items-center space-x-2 group"
                >
                  <span className="font-medium">{word}</span>
                  <button
                    onClick={() => removeWord(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-teal-600 hover:text-teal-800" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Field */}
      {userWords.length < 5 && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="একটি সম্পর্কিত শব্দ লিখুন..."
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addWord}
              disabled={!currentInput.trim()}
              className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Suggestions */}
          <div className="bg-teal-50 rounded-lg p-3">
            <p className="text-teal-800 text-xs mb-2 font-medium">💡 উদাহরণ ধারণা:</p>
            <p className="text-teal-700 text-xs">
              {currentPrompt.word === 'সাফল্য' && 'লক্ষ্য, পরিশ্রম, অর্জন, গর্ব, খুশি'}
              {currentPrompt.word === 'শান্তি' && 'নিরবতা, প্রকৃতি, মেডিটেশন, স্বস্তি, সুখ'}
              {currentPrompt.word === 'সাহস' && 'বীরত্ব, দৃঢ়তা, সংগ্রাম, শক্তি, আত্মবিশ্বাস'}
              {currentPrompt.word === 'স্বপ্ন' && 'আশা, ভবিষ্যৎ, কল্পনা, লক্ষ্য, ইচ্ছা'}
              {currentPrompt.word === 'শক্তি' && 'ক্ষমতা, সামর্থ্য, দৃঢ়তা, উৎসাহ, প্রেরণা'}
              {currentPrompt.word === 'আনন্দ' && 'খুশি, হাসি, উৎসব, সুখ, উল্লাস'}
              {currentPrompt.word === 'প্রকৃতি' && 'গাছ, ফুল, পাখি, নদী, পাহাড়'}
              {currentPrompt.word === 'বন্ধুত্ব' && 'ভালোবাসা, বিশ্বাস, সাহায্য, সঙ্গ, আনুগত্য'}
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(userWords.length / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>শুরু</span>
          <span>সম্পন্ন</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-teal-50 rounded-lg p-3">
        <p className="text-teal-800 text-xs text-center">
          💭 মূল শব্দের সাথে যেকোনো ভাবে সম্পর্কিত শব্দ লিখুন - কোনো ভুল উত্তর নেই!
        </p>
      </div>
    </div>
  );
};

export default WordAssociation;