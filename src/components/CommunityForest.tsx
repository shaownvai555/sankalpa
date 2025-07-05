import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TreePine, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import BottomNav from './BottomNav';

interface Tree {
  id: string;
  planterUsername: string;
  plantedAt: any;
  treeType: string;
}

const CommunityForest: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [hoveredTree, setHoveredTree] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const setupListener = async () => {
      try {
        await currentUser.getIdToken(true);
        
        const q = query(
          collection(db, 'communityForest'),
          orderBy('plantedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const treesData: Tree[] = [];
          querySnapshot.forEach((doc) => {
            treesData.push({ id: doc.id, ...doc.data() } as Tree);
          });
          setTrees(treesData);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up forest listener:', error);
        return () => {};
      }
    };

    let unsubscribe: (() => void) | undefined;
    
    setupListener().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const getTreeSVG = (treeType: string, index: number) => {
    const colors = [
      { trunk: '#8B4513', leaves: '#228B22' },
      { trunk: '#A0522D', leaves: '#32CD32' },
      { trunk: '#654321', leaves: '#90EE90' },
      { trunk: '#8B4513', leaves: '#006400' },
      { trunk: '#A0522D', leaves: '#228B22' }
    ];
    
    const colorSet = colors[index % colors.length];
    const height = 60 + (index % 3) * 10; // Varying heights
    
    return (
      <svg width="40" height={height} viewBox={`0 0 40 ${height}`}>
        {/* Trunk */}
        <rect
          x="16"
          y={height - 20}
          width="8"
          height="20"
          fill={colorSet.trunk}
          rx="2"
        />
        
        {/* Leaves - Multiple layers for depth */}
        <ellipse
          cx="20"
          cy={height - 35}
          rx="15"
          ry="12"
          fill={colorSet.leaves}
          opacity="0.8"
        />
        <ellipse
          cx="20"
          cy={height - 30}
          rx="12"
          ry="10"
          fill={colorSet.leaves}
        />
        <ellipse
          cx="20"
          cy={height - 25}
          rx="8"
          ry="8"
          fill={colorSet.leaves}
          opacity="0.9"
        />
        
        {/* Fruits/Flowers for some trees */}
        {index % 4 === 0 && (
          <>
            <circle cx="15" cy={height - 30} r="2" fill="#FF6B6B" />
            <circle cx="25" cy={height - 32} r="2" fill="#FF6B6B" />
            <circle cx="18" cy={height - 25} r="2" fill="#FF6B6B" />
          </>
        )}
      </svg>
    );
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 pb-20">
      {/* Header */}
      <Header 
        title="কমিউনিটি বন" 
        subtitle="Community Forest"
        showUserInfo={true}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <TreePine className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{trees.length}</div>
              <div className="text-sm text-gray-500">Trees Planted</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {new Set(trees.map(t => t.planterUsername)).size}
              </div>
              <div className="text-sm text-gray-500">Contributors</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {trees.length > 0 ? Math.ceil((Date.now() - trees[trees.length - 1].plantedAt?.toDate?.()?.getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-gray-500">Days Growing</div>
            </div>
          </div>
        </motion.div>

        {/* Forest Landscape */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-b from-sky-200 to-green-200 rounded-xl shadow-lg p-8 min-h-[400px] relative overflow-hidden"
        >
          {/* Sky and Clouds */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200 to-transparent">
            <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full opacity-70"></div>
            <div className="absolute top-6 left-12 w-12 h-6 bg-white rounded-full opacity-50"></div>
            <div className="absolute top-8 right-16 w-20 h-10 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-4 right-20 w-14 h-7 bg-white rounded-full opacity-40"></div>
          </div>

          {/* Sun */}
          <div className="absolute top-8 right-8 w-12 h-12 bg-yellow-300 rounded-full shadow-lg">
            <div className="absolute inset-1 bg-yellow-200 rounded-full"></div>
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-green-400 to-transparent"></div>

          {/* Trees */}
          {trees.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <TreePine className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No trees planted yet</h3>
                <p className="text-gray-600">Be the first to plant a tree in our community forest!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-4 items-end h-full pt-16">
              {trees.map((tree, index) => (
                <motion.div
                  key={tree.id}
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  className="relative cursor-pointer transform hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredTree(tree.id)}
                  onMouseLeave={() => setHoveredTree(null)}
                >
                  {getTreeSVG(tree.treeType, index)}
                  
                  {/* Tooltip */}
                  {hoveredTree === tree.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black bg-opacity-80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10"
                    >
                      <div className="font-medium">{tree.planterUsername}</div>
                      <div className="text-gray-300">{formatDate(tree.plantedAt)}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-opacity-80"></div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Decorative Elements */}
          <div className="absolute bottom-8 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-16 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
        </motion.div>

        {/* Recent Plantings */}
        {trees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 mt-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Tree Plantings</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {trees.slice(0, 10).map((tree, index) => (
                <motion.div
                  key={tree.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TreePine className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{tree.planterUsername}</div>
                    <div className="text-sm text-gray-600">planted a tree</div>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(tree.plantedAt)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mt-6 text-white text-center"
        >
          <TreePine className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Plant Your Tree Today!</h3>
          <p className="mb-4 opacity-90">
            Visit the Rewards Store to plant a tree in our community forest and contribute to a greener future.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/rewards')}
            className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Visit Rewards Store
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CommunityForest;