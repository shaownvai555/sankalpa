import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Users, 
  ArrowLeft,
  Shuffle,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import toast from 'react-hot-toast';
import { ALL_ACTIVITIES, getRandomActivities, Activity } from '../utils/activityList';

// Import all activity components
import ReverseSpelling from './activities/ReverseSpelling';
import GroundingTechnique from './activities/GroundingTechnique';
import DoodlePad from './activities/DoodlePad';
import BubblePopGame from './activities/BubblePopGame';
import CountingBackwards from './activities/CountingBackwards';
import MemorySequence from './activities/MemorySequence';
import WordAssociation from './activities/WordAssociation';
import ColorMatchGame from './activities/ColorMatchGame';
import ReactionTest from './activities/ReactionTest';
import JumpingJacks from './activities/JumpingJacks';
import WallPushups from './activities/WallPushups';

// Existing components (simplified versions for the new system)
const BreathingExercise: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCompleted(true);
      setTimeout(() => onComplete(), 1000);
    }
  }, [timeLeft, completed, onComplete]);

  if (completed) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-green-600" />
        </div>
        <h4 className="text-lg font-bold text-gray-800 mb-2">শ্বাস-প্রশ্বাস সম্পন্ন!</h4>
        <p className="text-gray-600 text-sm">+5 কয়েন অর্জিত</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">শ্বাস-প্রশ্বাসের ব্যায়াম</h3>
      <div className="text-center">
        <div className="text-4xl mb-4">🫁</div>
        <div className="text-2xl font-bold text-blue-600 mb-2">{timeLeft}s</div>
        <p className="text-gray-600">{phase === 'inhale' ? 'শ্বাস নিন' : phase === 'hold' ? 'ধরে রাখুন' : 'শ্বাস ছাড়ুন'}</p>
      </div>
    </div>
  );
};

const PhysicalActivity: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => onComplete(), 1000);
  };

  if (completed) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-green-600" />
        </div>
        <h4 className="text-lg font-bold text-gray-800 mb-2">শারীরিক কার্যকলাপ সম্পন্ন!</h4>
        <p className="text-gray-600 text-sm">+5 কয়েন অর্জিত</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">শারীরিক কার্যকলাপ</h3>
      <div className="text-center">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h4 className="text-lg font-bold text-gray-800 mb-2">১০ বার স্কোয়াট করুন</h4>
        <p className="text-gray-600 text-sm mb-4">পা কাঁধের সমান প্রশস্ত করে দাঁড়ান। ধীরে ধীরে বসুন এবং উঠুন।</p>
        <button
          onClick={handleComplete}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          সম্পন্ন করেছি
        </button>
      </div>
    </div>
  );
};

// Component mapping
const componentMap: { [key: string]: React.FC<{ onComplete: () => void }> } = {
  BreathingExercise,
  PhysicalActivity,
  ReverseSpelling,
  GroundingTechnique,
  DoodlePad,
  BubblePopGame,
  CountingBackwards,
  MemorySequence,
  WordAssociation,
  ColorMatchGame,
  ReactionTest,
  JumpingJacks,
  WallPushups,
};

const UrgeHelper: React.FC = () => {
  const { t } = useTranslation();
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessingReward, setIsProcessingReward] = useState(false);

  // Generate random activities on component mount
  useEffect(() => {
    const randomActivities = getRandomActivities(4);
    setSelectedActivities(randomActivities);
  }, []);

  const handleActivityComplete = async (activity: Activity) => {
    // Prevent multiple rewards for the same activity
    if (completedActivities.has(activity.id) || isProcessingReward) {
      return;
    }

    setIsProcessingReward(true);

    try {
      // Mark activity as completed
      setCompletedActivities(prev => new Set([...prev, activity.id]));
      setTotalCoinsEarned(prev => prev + activity.coins);

      // Award coins to user with proper error handling
      if (userData) {
        const newCoins = userData.coins + activity.coins;
        await updateUserData({ coins: newCoins });
        
        toast.success(`${activity.title} সম্পন্ন! +${activity.coins} কয়েন`, { 
          duration: 3000,
          id: `activity-${activity.id}` // Prevent duplicate toasts
        });
      }

      // Check if all activities are completed
      if (completedActivities.size + 1 >= selectedActivities.length) {
        setTimeout(() => {
          setShowSummary(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error awarding coins:', error);
      toast.error('কয়েন যোগ করতে সমস্যা হয়েছে');
      
      // Revert the completion if coin update failed
      setCompletedActivities(prev => {
        const newSet = new Set(prev);
        newSet.delete(activity.id);
        return newSet;
      });
      setTotalCoinsEarned(prev => prev - activity.coins);
    } finally {
      setIsProcessingReward(false);
    }
  };

  const shuffleActivities = () => {
    const newActivities = getRandomActivities(4);
    setSelectedActivities(newActivities);
    setCompletedActivities(new Set());
    setTotalCoinsEarned(0);
    setShowSummary(false);
  };

  const getActivityTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'mental': return '🧠';
      case 'physical': return '💪';
      case 'creative': return '🎨';
      case 'game': return '🎮';
      default: return '⭐';
    }
  };

  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'mental': return 'from-purple-500 to-indigo-600';
      case 'physical': return 'from-green-500 to-emerald-600';
      case 'creative': return 'from-pink-500 to-rose-600';
      case 'game': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-20">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-8">
          <div className="max-w-md mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4"
            >
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">সব কার্যক্রম সম্পন্ন!</h1>
              <p className="text-green-100 text-sm">আপনি সফলভাবে সব চ্যালেঞ্জ সম্পন্ন করেছেন</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">অভিনন্দন!</h2>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold text-green-600 mb-2">+{totalCoinsEarned}</div>
              <p className="text-green-800 text-sm">মোট কয়েন অর্জিত</p>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              আপনি {selectedActivities.length}টি কার্যক্রম সম্পন্ন করে আপনার মানসিক শক্তি বৃদ্ধি করেছেন।
            </p>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shuffleActivities}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2"
              >
                <Shuffle className="w-5 h-5" />
                <span>নতুন কার্যক্রম</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                ড্যাশবোর্ডে ফিরে যান
              </motion.button>
            </div>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-pink-600 px-4 py-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mb-4"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">জরুরি সাহায্য</h1>
              <p className="text-red-100 text-sm">Urge Helper - Red Alert</p>
            </div>
            <button
              onClick={shuffleActivities}
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              title="নতুন কার্যক্রম"
            >
              <Shuffle className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Motivational Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-center text-white shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mb-4"
          >
            <Heart className="w-12 h-12 mx-auto text-white" />
          </motion.div>
          <h2 className="text-lg font-bold mb-2">
            প্রতিটি 'না' বলা আপনাকে আরও শক্তিশালী করে!
          </h2>
          <p className="text-blue-100 text-sm mb-3">
            Every "No" makes you stronger!
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm">
              আজকের কার্যক্রম: {completedActivities.size}/{selectedActivities.length} সম্পন্ন
            </p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">আজকের অগ্রগতি</h3>
            <div className="flex items-center space-x-1 text-yellow-600">
              <Award className="w-4 h-4" />
              <span className="font-bold">+{totalCoinsEarned}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedActivities.size / selectedActivities.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>শুরু</span>
            <span>{Math.round((completedActivities.size / selectedActivities.length) * 100)}%</span>
            <span>সম্পন্ন</span>
          </div>
        </motion.div>

        {/* Dynamic Activities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">আজকের কার্যক্রম</h3>
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>প্রতিদিন নতুন</span>
            </div>
          </div>

          {selectedActivities.map((activity, index) => {
            const isCompleted = completedActivities.has(activity.id);
            const ActivityComponent = componentMap[activity.componentName];

            if (!ActivityComponent) {
              console.warn(`Component ${activity.componentName} not found`);
              return null;
            }

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative ${isCompleted ? 'opacity-75' : ''}`}
              >
                {/* Activity Type Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className={`bg-gradient-to-r ${getActivityTypeColor(activity.type)} text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1`}>
                    <span>{getActivityTypeIcon(activity.type)}</span>
                    <span className="capitalize">{activity.type}</span>
                  </div>
                </div>

                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>+{activity.coins}</span>
                    </div>
                  </div>
                )}

                <div className={`border-2 rounded-2xl overflow-hidden transition-all ${
                  isCompleted 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-transparent'
                }`}>
                  <ActivityComponent 
                    onComplete={() => handleActivityComplete(activity)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Seek Help Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/community')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-6 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center space-x-3 shadow-lg"
          >
            <Users className="w-6 h-6" />
            <span>সাপোর্ট প্রয়োজন? সম্প্রদায়ে সাহায্য চান</span>
          </motion.button>
          <p className="text-center text-gray-600 text-sm mt-2">
            Need Support? Seek Help in the Community
          </p>
        </motion.div>

        {/* Activity Types Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <h4 className="font-bold text-gray-800 mb-3 text-center">কার্যক্রমের ধরন</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'mental' as const, label: 'মানসিক', description: 'মনোযোগ ও চিন্তা' },
              { type: 'physical' as const, label: 'শারীরিক', description: 'ব্যায়াম ও নড়াচড়া' },
              { type: 'creative' as const, label: 'সৃজনশীল', description: 'আঁকা ও লেখা' },
              { type: 'game' as const, label: 'গেম', description: 'মজার খেলা' }
            ].map((item) => (
              <div key={item.type} className="text-center">
                <div className={`w-8 h-8 bg-gradient-to-r ${getActivityTypeColor(item.type)} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white text-sm">{getActivityTypeIcon(item.type)}</span>
                </div>
                <div className="text-xs font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default UrgeHelper;