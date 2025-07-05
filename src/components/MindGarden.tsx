import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { calculateStreakDays, getBadgeById } from '../utils/badgeSystem';
import { Sparkles, Award, Calendar, TrendingUp } from 'lucide-react';

interface MindGardenProps {
  embedded?: boolean;
}

const MindGarden: React.FC<MindGardenProps> = ({ embedded = false }) => {
  const { userData } = useAuth();
  const [gardenStage, setGardenStage] = useState(1);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    if (userData?.streakStartDate) {
      const days = calculateStreakDays(userData.streakStartDate);
      setStreakDays(days);
      
      // Determine garden stage based on streak days
      if (days <= 3) setGardenStage(1); // Seeds
      else if (days <= 7) setGardenStage(2); // Sprouts
      else if (days <= 15) setGardenStage(3); // Young plants
      else if (days <= 30) setGardenStage(4); // Flowering garden
      else if (days <= 60) setGardenStage(5); // Lush garden
      else setGardenStage(6); // Paradise garden
    }
  }, [userData?.streakStartDate]);

  const getGardenElements = () => {
    const elements = [];
    
    // Base garden bed
    elements.push(
      <div key="garden-bed" className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-green-400 to-green-300 rounded-b-2xl"></div>
    );

    // Stage-based elements
    switch (gardenStage) {
      case 1: // Seeds
        for (let i = 0; i < 3; i++) {
          elements.push(
            <motion.div
              key={`seed-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="absolute bottom-8 bg-amber-600 rounded-full"
              style={{
                left: `${20 + i * 25}%`,
                width: '8px',
                height: '8px'
              }}
            />
          );
        }
        break;

      case 2: // Sprouts
        for (let i = 0; i < 4; i++) {
          elements.push(
            <motion.div
              key={`sprout-${i}`}
              initial={{ height: 0 }}
              animate={{ height: '20px' }}
              transition={{ delay: i * 0.3, type: "spring" }}
              className="absolute bottom-8 bg-green-500 rounded-t-full"
              style={{
                left: `${15 + i * 20}%`,
                width: '4px'
              }}
            />
          );
        }
        break;

      case 3: // Young plants
        for (let i = 0; i < 5; i++) {
          elements.push(
            <motion.div
              key={`plant-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2, type: "spring" }}
              className="absolute bottom-8"
              style={{ left: `${10 + i * 18}%` }}
            >
              <div className="w-2 h-8 bg-green-600 rounded-t-full"></div>
              <div className="absolute top-0 -left-2 w-6 h-4 bg-green-400 rounded-full opacity-80"></div>
            </motion.div>
          );
        }
        break;

      case 4: // Flowering garden
        for (let i = 0; i < 6; i++) {
          elements.push(
            <motion.div
              key={`flower-${i}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.2, type: "spring" }}
              className="absolute bottom-8"
              style={{ left: `${8 + i * 15}%` }}
            >
              <div className="w-3 h-12 bg-green-600 rounded-t-full"></div>
              <div className="absolute top-0 -left-2 w-7 h-5 bg-green-400 rounded-full"></div>
              <div className="absolute -top-2 left-0 w-3 h-3 bg-pink-400 rounded-full"></div>
            </motion.div>
          );
        }
        break;

      case 5: // Lush garden
        for (let i = 0; i < 8; i++) {
          const colors = ['bg-pink-400', 'bg-purple-400', 'bg-yellow-400', 'bg-red-400'];
          elements.push(
            <motion.div
              key={`lush-${i}`}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: "spring" }}
              className="absolute bottom-8"
              style={{ left: `${5 + i * 12}%` }}
            >
              <div className="w-3 h-16 bg-green-700 rounded-t-full"></div>
              <div className="absolute top-2 -left-3 w-9 h-6 bg-green-500 rounded-full"></div>
              <div className={`absolute -top-2 left-0 w-4 h-4 ${colors[i % colors.length]} rounded-full`}></div>
              <div className="absolute top-0 -left-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
            </motion.div>
          );
        }
        break;

      case 6: // Paradise garden
        // Trees
        for (let i = 0; i < 3; i++) {
          elements.push(
            <motion.div
              key={`tree-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.3, type: "spring" }}
              className="absolute bottom-8"
              style={{ left: `${15 + i * 30}%` }}
            >
              <div className="w-4 h-20 bg-amber-700 rounded-t-lg"></div>
              <div className="absolute top-0 -left-6 w-16 h-12 bg-green-600 rounded-full"></div>
              <div className="absolute -top-2 -left-4 w-12 h-8 bg-green-500 rounded-full"></div>
            </motion.div>
          );
        }
        
        // Flowers
        for (let i = 0; i < 10; i++) {
          const colors = ['bg-pink-400', 'bg-purple-400', 'bg-yellow-400', 'bg-red-400', 'bg-blue-400'];
          elements.push(
            <motion.div
              key={`paradise-flower-${i}`}
              initial={{ scale: 0, rotate: Math.random() * 360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1 + i * 0.1, type: "spring" }}
              className="absolute bottom-8"
              style={{ left: `${5 + i * 9}%` }}
            >
              <div className="w-2 h-8 bg-green-600 rounded-t-full"></div>
              <div className={`absolute -top-1 -left-1 w-4 h-4 ${colors[i % colors.length]} rounded-full`}></div>
            </motion.div>
          );
        }
        break;
    }

    return elements;
  };

  const getGardenTitle = () => {
    switch (gardenStage) {
      case 1: return 'বীজ বপন (Seed Planting)';
      case 2: return 'অঙ্কুরোদগম (Sprouting)';
      case 3: return 'তরুণ উদ্যান (Young Garden)';
      case 4: return 'ফুলের বাগান (Flowering Garden)';
      case 5: return 'সমৃদ্ধ উদ্যান (Lush Garden)';
      case 6: return 'স্বর্গীয় উদ্যান (Paradise Garden)';
      default: return 'মন বাগান (Mind Garden)';
    }
  };

  const getGardenDescription = () => {
    switch (gardenStage) {
      case 1: return 'আপনার সঙ্কল্পের বীজ রোপণ করা হয়েছে';
      case 2: return 'আপনার দৃঢ়তার অঙ্কুর বের হচ্ছে';
      case 3: return 'আপনার মানসিক শক্তি বৃদ্ধি পাচ্ছে';
      case 4: return 'আপনার চরিত্রে ফুল ফুটছে';
      case 5: return 'আপনার ব্যক্তিত্ব সমৃদ্ধ হয়েছে';
      case 6: return 'আপনি একটি আদর্শ ব্যক্তিত্বে পরিণত হয়েছেন';
      default: return 'আপনার মানসিক যাত্রা';
    }
  };

  const currentBadge = getBadgeById(userData?.currentBadge || 'clown');

  return (
    <div className={`${embedded ? '' : 'min-h-screen bg-slate-50 pb-20'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">মন বাগান</h2>
              <p className="text-gray-600 text-sm">Mind Garden</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{streakDays}</div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
        </div>

        {/* Garden Visualization */}
        <div className="relative h-64 bg-gradient-to-b from-sky-200 via-sky-100 to-green-200 rounded-xl overflow-hidden mb-6">
          {/* Sky elements */}
          <div className="absolute top-4 right-8 w-12 h-12 bg-yellow-300 rounded-full shadow-lg">
            <div className="absolute inset-1 bg-yellow-200 rounded-full"></div>
          </div>
          
          {/* Clouds */}
          <div className="absolute top-6 left-8 w-16 h-8 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-8 left-12 w-12 h-6 bg-white rounded-full opacity-50"></div>
          
          {/* Garden elements */}
          <AnimatePresence>
            {getGardenElements()}
          </AnimatePresence>

          {/* Floating particles for advanced stages */}
          {gardenStage >= 4 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 40}%`,
                  }}
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Garden Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{getGardenTitle()}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{getGardenDescription()}</p>
        </div>

        {/* Current Badge Display */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={currentBadge.imageUrl} 
                alt={currentBadge.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center text-white text-2xl">
                🏆
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{currentBadge.name}</h4>
              <p className="text-gray-600 text-sm">{currentBadge.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Current Achievement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-800">{streakDays}</div>
            <div className="text-xs text-gray-500">Days Strong</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-800">{userData?.level || 1}</div>
            <div className="text-xs text-gray-500">Current Level</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-800">{gardenStage}</div>
            <div className="text-xs text-gray-500">Garden Stage</div>
          </div>
        </div>

        {/* Next Stage Preview */}
        {gardenStage < 6 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Next Garden Stage</h5>
            <p className="text-yellow-700 text-sm">
              {gardenStage === 1 && 'Continue for 4 more days to see sprouts emerge!'}
              {gardenStage === 2 && 'Keep going for 6 more days to grow young plants!'}
              {gardenStage === 3 && 'Maintain for 8 more days to see flowers bloom!'}
              {gardenStage === 4 && 'Stay strong for 15 more days for a lush garden!'}
              {gardenStage === 5 && 'Persist for 30 more days to create paradise!'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MindGarden;