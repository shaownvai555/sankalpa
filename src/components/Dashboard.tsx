import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useUserContext } from '../contexts/UserContext';
import { 
  BookOpen, 
  Shield, 
  Users, 
  Gift,
  Save,
  Sparkles,
  Award,
  Coins,
  TrendingUp,
  RotateCcw,
  X,
  AlertTriangle,
  TreePine
} from 'lucide-react';
import MentalWorkout from './MentalWorkout';
import GratitudeDiary from './GratitudeDiary';
import WeeklyChallenge from './WeeklyChallenge';
import FocusMusicPlayer from './FocusMusicPlayer';
import MindGarden from './MindGarden';
import Header from './Header';
import BottomNav from './BottomNav';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { getBadgeForStreak, calculateStreakDays, updateUserBadge, badges } from '../utils/badgeSystem';

interface LiveStreakCounterProps {
  streakStartDate: any;
  onRestart: () => void;
}

const LiveStreakCounter: React.FC<LiveStreakCounterProps> = ({ streakStartDate, onRestart }) => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      if (!streakStartDate) return;

      const startDate = streakStartDate.toDate ? streakStartDate.toDate() : new Date(streakStartDate);
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [streakStartDate]);

  return (
    <div className="relative">
      <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-purple-900/20 to-transparent"></div>
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8">
          <motion.div
            key={timeElapsed.days}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4"
          >
            <div className="text-7xl font-bold mb-2 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              {timeElapsed.days}
            </div>
            <div className="text-lg font-medium text-gray-300">
              {timeElapsed.days === 1 ? 'Day' : 'Days'} Strong
            </div>
          </motion.div>

          <div className="flex space-x-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-300">{timeElapsed.hours}</div>
              <div className="text-xs text-gray-400">Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-300">{timeElapsed.minutes}</div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-300">{timeElapsed.seconds}</div>
              <div className="text-xs text-gray-400">Seconds</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-3"
        >
          <RotateCcw className="w-6 h-6" />
          <span>নতুন যাত্রা শুরু করুন</span>
        </motion.button>
      </div>
    </div>
  );
};

interface RestartConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const RestartConfirmationModal: React.FC<RestartConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">নতুন করে শুরু?</h2>
          <p className="text-gray-600 text-sm">
            আপনি কি নিশ্চিত যে আপনি নতুন করে শুরু করতে চান?
          </p>
          <p className="text-red-600 text-xs mt-2">
            এটি আপনার বর্তমান স্ট্রিক রিসেট করে দেবে এবং যদি কোনো সাপ্তাহিক চ্যালেঞ্জ চালু থাকে তাহলে সেটিও বাতিল হয়ে যাবে। আপনার ব্যাজও প্রাথমিক অবস্থায় ফিরে যাবে।
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            বাতিল
          </button>
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'রিসেট করা হচ্ছে...' : 'হ্যাঁ, নতুন করে শুরু করুন'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { userData, updateUserData, currentUser } = useAuth();
  const { activeTheme, unlockedItems } = useUserContext();
  const [showMentalWorkout, setShowMentalWorkout] = useState(false);
  const [showGratitudeDiary, setShowGratitudeDiary] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [savingGratitude, setSavingGratitude] = useState(false);
  const [encouragingQuote, setEncouragingQuote] = useState('');

  const encouragingQuotes = [
    "পরাজয় মানে শেষ নয়, এটি একটি নতুন শুরুর সুযোগ।",
    "প্রতিটি নতুন দিন একটি নতুন সুযোগ নিয়ে আসে।",
    "শক্তি ব্যর্থতা থেকে নয়, আবার উঠে দাঁড়ানো থেকে আসে।",
    "আপনার সবচেয়ে বড় শত্রু আপনার নিজের সন্দেহ।",
    "সাফল্য হলো একবার পড়ে গিয়ে আবার উঠে দাঁড়ানো।"
  ];

  useEffect(() => {
    if (userData?.streakStartDate && currentUser) {
      const streakDays = calculateStreakDays(userData.streakStartDate);
      updateUserBadge(userData.streakStartDate, userData.currentBadge, updateUserData);
    }
  }, [userData?.streakStartDate, userData?.currentBadge, currentUser, updateUserData]);

  const handleRestart = async () => {
    if (!currentUser || !userData) return;

    setRestartLoading(true);
    try {
      const updateData: any = {
        streakStartDate: serverTimestamp(),
        streak: 0,
        currentBadge: 'clown'
      };

      if (userData.active_stake?.isActive) {
        updateData.active_stake = {
          ...userData.active_stake,
          isActive: false
        };
        toast.error('সাপ্তাহিক চ্যালেঞ্জ বাতিল হয়ে গেছে।', { duration: 4000 });
      }

      await updateUserData(updateData);
      
      const randomQuote = encouragingQuotes[Math.floor(Math.random() * encouragingQuotes.length)];
      setEncouragingQuote(randomQuote);
      
      setShowRestartModal(false);
      toast.success('নতুন যাত্রা শুরু হয়েছে! আপনি পারবেন! 💪', { duration: 5000 });
    } catch (error) {
      console.error('Error restarting streak:', error);
      toast.error('রিসেট করতে সমস্যা হয়েছে');
    } finally {
      setRestartLoading(false);
    }
  };

  const handleDailyCheckIn = async () => {
    if (!userData) return;
    
    const today = new Date().toDateString();
    const lastCheckIn = userData.lastCheckIn ? new Date(userData.lastCheckIn).toDateString() : '';
    
    if (today !== lastCheckIn) {
      const newXp = userData.xp + 10;
      const newCoins = userData.coins + 5;
      let newStreak = userData.streak + 1;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      let bonusCoins = 0;
      if (newStreak % 7 === 0) {
        bonusCoins = 25;
        toast.success('🎉 Weekly streak bonus! +25 coins!', { duration: 4000 });
      }
      
      await updateUserData({
        xp: newXp,
        coins: newCoins + bonusCoins,
        streak: newStreak,
        level: newLevel,
        lastCheckIn: new Date().toISOString(),
      });
      
      toast.success(`Daily check-in complete! +10 XP, +${5 + bonusCoins} coins`);
    } else {
      toast.success('Already checked in today!');
    }
  };

  const handleSaveGratitude = async () => {
    if (!gratitudeText.trim() || !currentUser) return;

    setSavingGratitude(true);
    try {
      await addDoc(collection(db, 'diaryEntries'), {
        content: gratitudeText.trim(),
        date: new Date().toDateString(),
        userId: currentUser.uid,
        createdAt: new Date(),
      });

      setGratitudeText('');
      toast.success('Gratitude saved! +2 coins');
      
      if (userData) {
        const newXp = userData.xp + 5;
        const newCoins = userData.coins + 2;
        const newLevel = Math.floor(newXp / 100) + 1;
        await updateUserData({
          xp: newXp,
          coins: newCoins,
          level: newLevel,
        });
      }
    } catch (error) {
      console.error('Error saving gratitude:', error);
      toast.error('Failed to save gratitude');
    } finally {
      setSavingGratitude(false);
    }
  };

  const handleMentalWorkoutComplete = async () => {
    if (!userData) return;
    
    const newCoins = userData.coins + 10;
    await updateUserData({
      coins: newCoins,
    });
    
    toast.success('Mental workout completed! +10 coins');
  };

  const quickActions = [
    {
      icon: BookOpen,
      label: 'ডায়েরি',
      englishLabel: 'Diary',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: () => setShowGratitudeDiary(true),
    },
    {
      icon: Shield,
      label: 'জরুরি সাহায্য',
      englishLabel: 'Urge Helper',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      action: () => window.location.href = '/urge-helper',
    },
    {
      icon: Users,
      label: 'কমিউনিটি',
      englishLabel: 'Community',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => window.location.href = '/community',
    },
    {
      icon: TreePine,
      label: 'কমিউনিটি বন',
      englishLabel: 'Community Forest',
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      action: () => window.location.href = '/community-forest',
    },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const xpProgress = (userData.xp % 100);
  const nextLevelXp = 100;
  const streakDays = calculateStreakDays(userData.streakStartDate);

  const getThemeStyles = () => {
    switch (activeTheme) {
      case 'ocean-theme':
        return {
          background: 'bg-gradient-to-br from-blue-50 to-cyan-100',
          cardBg: 'bg-gradient-to-br from-blue-100 to-cyan-50',
          accent: 'from-blue-500 to-cyan-600'
        };
      default:
        return {
          background: 'bg-slate-50',
          cardBg: 'bg-white',
          accent: 'from-indigo-500 to-purple-600'
        };
    }
  };

  const themeStyles = getThemeStyles();
  const totalUnlockedItems = Object.values(unlockedItems).reduce((total, items) => total + items.length, 0);

  return (
    <div className={`min-h-screen ${themeStyles.background} pb-20 relative`}>
      {/* Header */}
      <Header 
        title="সঙ্কল্প" 
        subtitle="Your Journey Dashboard"
        showUserInfo={true}
      />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Live Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <LiveStreakCounter 
            streakStartDate={userData.streakStartDate}
            onRestart={() => setShowRestartModal(true)}
          />
          
          <AnimatePresence>
            {encouragingQuote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <p className="text-green-800 font-medium text-center">{encouragingQuote}</p>
                <button
                  onClick={() => setEncouragingQuote('')}
                  className="mt-2 text-green-600 hover:text-green-800 text-sm"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mind Garden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MindGarden embedded />
        </motion.div>

        {/* Coins & Level Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${themeStyles.cardBg} rounded-xl shadow-lg p-6`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-800">{userData.coins}</span>
              </div>
              <p className="text-gray-600 text-sm">Coins</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-bold text-gray-800">{userData.level}</span>
              </div>
              <p className="text-gray-600 text-sm">Level</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDailyCheckIn}
            className={`w-full mt-4 bg-gradient-to-r ${themeStyles.accent} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2 justify-center`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Daily Check-in</span>
          </motion.button>
        </motion.div>

        {/* Weekly Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeeklyChallenge embedded />
        </motion.div>

        {/* Quick Access Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${themeStyles.cardBg} rounded-xl shadow-lg p-6`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center group"
              >
                <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors group-hover:scale-110 transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">{action.label}</div>
                <div className="text-xs text-gray-500">{action.englishLabel}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Today's Gratitude Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${themeStyles.cardBg} rounded-xl shadow-lg p-6`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">আজকের কৃতজ্ঞতা</h2>
          <p className="text-gray-600 text-sm mb-4">What are you thankful for today?</p>
          
          <div className="space-y-4">
            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="I'm grateful for..."
              className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveGratitude}
              disabled={!gratitudeText.trim() || savingGratitude}
              className={`w-full bg-gradient-to-r ${themeStyles.accent} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <Save className="w-4 h-4" />
              <span>{savingGratitude ? 'Saving...' : 'Save Gratitude'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <FocusMusicPlayer />

      <RestartConfirmationModal
        isOpen={showRestartModal}
        onConfirm={handleRestart}
        onCancel={() => setShowRestartModal(false)}
        loading={restartLoading}
      />

      {showMentalWorkout && (
        <MentalWorkout 
          onClose={() => setShowMentalWorkout(false)} 
          onComplete={handleMentalWorkoutComplete}
        />
      )}
      
      {showGratitudeDiary && (
        <GratitudeDiary onClose={() => setShowGratitudeDiary(false)} />
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;