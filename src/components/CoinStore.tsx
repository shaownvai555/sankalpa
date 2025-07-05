import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Play, 
  ShoppingCart, 
  Heart, 
  Clock,
  Gift,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import Header from './Header';
import BottomNav from './BottomNav';

interface DailyAdStats {
  watchCount: number;
  lastWatched: any;
}

const CoinStore: React.FC = () => {
  const { currentUser, userData, updateUserData } = useAuth();
  const [watchingAd, setWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [dailyAdStats, setDailyAdStats] = useState<DailyAdStats>({
    watchCount: 0,
    lastWatched: null
  });

  // Check and update daily ad stats
  useEffect(() => {
    if (!userData) return;

    const stats = userData.dailyAdStats || { watchCount: 0, lastWatched: null };
    const today = new Date().toDateString();
    const lastWatchedDate = stats.lastWatched?.toDate?.()?.toDateString() || '';

    if (lastWatchedDate !== today) {
      // Reset count for new day
      setDailyAdStats({ watchCount: 0, lastWatched: null });
    } else {
      setDailyAdStats(stats);
    }
  }, [userData]);

  const coinPacks = [
    {
      id: 'pack_1000',
      coins: 1000,
      price: '৳10',
      popular: false,
      bonus: 0
    },
    {
      id: 'pack_5000',
      coins: 5000,
      price: '৳40',
      popular: true,
      bonus: 500
    },
    {
      id: 'pack_10000',
      coins: 10000,
      price: '৳75',
      popular: false,
      bonus: 1500
    }
  ];

  const handleWatchAd = async () => {
    if (!currentUser || !userData) {
      toast.error('Please log in to watch ads');
      return;
    }

    if (dailyAdStats.watchCount >= 5) {
      toast.error('Daily ad limit reached! Come back tomorrow.');
      return;
    }

    setWatchingAd(true);
    setAdProgress(0);

    // Simulate ad watching with progress
    const progressInterval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2; // 50 steps = 2.5 seconds
      });
    }, 50);

    // Simulate 3-second ad
    setTimeout(async () => {
      try {
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await transaction.get(userRef);
          
          if (!userDoc.exists()) {
            throw new Error('User document does not exist');
          }

          const currentStats = userDoc.data().dailyAdStats || { watchCount: 0, lastWatched: null };
          const today = new Date();
          const lastWatchedDate = currentStats.lastWatched?.toDate?.()?.toDateString() || '';
          const todayString = today.toDateString();

          let newWatchCount = currentStats.watchCount;
          
          // Reset count if it's a new day
          if (lastWatchedDate !== todayString) {
            newWatchCount = 0;
          }

          if (newWatchCount >= 5) {
            throw new Error('Daily limit reached');
          }

          // Update coins and ad stats atomically
          transaction.update(userRef, {
            coins: increment(50),
            dailyAdStats: {
              watchCount: newWatchCount + 1,
              lastWatched: serverTimestamp()
            }
          });
        });

        // Update local state
        setDailyAdStats(prev => ({
          watchCount: prev.watchCount + 1,
          lastWatched: new Date()
        }));

        await updateUserData({
          coins: userData.coins + 50
        });

        toast.success('অভিনন্দন! আপনি ৫০ কয়েন জিতেছেন।', { duration: 4000 });
      } catch (error) {
        console.error('Error awarding ad coins:', error);
        toast.error('Failed to award coins. Please try again.');
      } finally {
        setWatchingAd(false);
        setAdProgress(0);
      }
    }, 3000);
  };

  const handleBuyCoins = (pack: typeof coinPacks[0]) => {
    // Placeholder for payment integration
    toast.info(`Payment integration coming soon for ${pack.coins} coins!`);
  };

  const remainingAds = Math.max(0, 5 - dailyAdStats.watchCount);
  const canWatchAd = remainingAds > 0 && !watchingAd;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 pb-20">
      {/* Header */}
      <Header 
        title="সাপোর্ট ও পুরস্কার" 
        subtitle="Support & Rewards"
        showUserInfo={true}
      />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">আপনার বর্তমান কয়েন</h2>
          <div className="text-4xl font-bold text-yellow-600 mb-2">
            {userData?.coins?.toLocaleString() || 0}
          </div>
          <p className="text-gray-500 text-sm">Keep earning to unlock more rewards!</p>
        </motion.div>

        {/* Daily Task: Watch Ads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">দৈনিক টাস্ক: বিজ্ঞাপন দেখুন</h3>
              <p className="text-purple-100 text-sm">Daily Task: Watch Ads</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">প্রতিটি বিজ্ঞাপনের জন্য জিতুন ৫০ কয়েন</span>
              <div className="flex items-center space-x-1">
                <Coins className="w-4 h-4 text-yellow-300" />
                <span className="font-bold">50</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">আজকের জন্য বাকি:</span>
              <span className="font-bold">{remainingAds}/5</span>
            </div>
          </div>

          {/* Progress Bar for Ad Watching */}
          {watchingAd && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Ad Progress</span>
                <span className="text-sm">{Math.round(adProgress)}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <motion.div 
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${adProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: canWatchAd ? 1.02 : 1 }}
            whileTap={{ scale: canWatchAd ? 0.98 : 1 }}
            onClick={handleWatchAd}
            disabled={!canWatchAd}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
              canWatchAd
                ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg'
                : 'bg-white bg-opacity-30 text-white cursor-not-allowed'
            }`}
          >
            {watchingAd ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                <span>বিজ্ঞাপন চলছে...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{canWatchAd ? 'বিজ্ঞাপন দেখুন' : 'দৈনিক সীমা শেষ'}</span>
              </>
            )}
          </motion.button>

          {!canWatchAd && remainingAds === 0 && (
            <p className="text-center text-purple-200 text-sm mt-2">
              কাল আবার আসুন আরও কয়েন জিতার জন্য!
            </p>
          )}
        </motion.div>

        {/* Coin Purchase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            <h3 className="text-xl font-bold text-gray-800">কয়েন প্যাক কিনুন</h3>
            <span className="text-sm text-gray-500">(Buy Coin Packs)</span>
          </div>

          <div className="grid gap-4">
            {coinPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  pack.popular 
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {pack.popular && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Best Value!</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      pack.popular 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    }`}>
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {pack.coins.toLocaleString()}
                        {pack.bonus > 0 && (
                          <span className="text-green-600 text-lg"> +{pack.bonus}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Coins</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{pack.price}</div>
                    {pack.bonus > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        +{pack.bonus} Bonus!
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBuyCoins(pack)}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                    pack.popular
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">আমাদের লক্ষ্য</h3>
              <p className="text-blue-700 text-sm">Our Goal</p>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed">
            আপনার প্রতিটি অবদান, তা কয়েন কেনার মাধ্যমে হোক বা বিজ্ঞাপন দেখার মাধ্যমে, 'সঙ্কল্প' প্ল্যাটফর্মকে দীর্ঘমেয়াদে সচল রাখতে এবং আমাদের বৃক্ষরোপণ কর্মসূচিতে সাহায্য করে। আপনার সমর্থনের জন্য ধন্যবাদ।
          </p>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 text-sm font-medium">
                Every contribution helps us grow and serve the community better!
              </span>
            </div>
          </div>
        </motion.div>

        {/* Daily Rewards Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Daily Earning Opportunities</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Daily Check-in</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Coins className="w-4 h-4" />
                <span className="font-bold">+5</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Watch Ads (5x daily)</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Coins className="w-4 h-4" />
                <span className="font-bold">+250</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Community Activities</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Coins className="w-4 h-4" />
                <span className="font-bold">+50</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
            <p className="text-yellow-800 text-sm text-center font-medium">
              💰 Earn up to 305 coins daily through free activities!
            </p>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CoinStore;