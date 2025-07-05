import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Coins, Award } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showUserInfo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showUserInfo = true }) => {
  const { userData } = useAuth();

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-8 left-8 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-4 right-12 w-20 h-20 bg-white/10 rounded-full"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            >
              <img 
                src="/logo.png" 
                alt="Sankalpa Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to shield icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-8 h-8 text-white flex items-center justify-center">
                🛡️
              </div>
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white"
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>

          {/* User Info */}
          {showUserInfo && userData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="text-right">
                <div className="flex items-center space-x-1 text-white">
                  <Coins className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold">{userData.coins}</span>
                </div>
                <div className="flex items-center space-x-1 text-white/80">
                  <Award className="w-3 h-3" />
                  <span className="text-xs">Level {userData.level}</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-sm">
                  {userData.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Header;