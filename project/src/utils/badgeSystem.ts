export interface Badge {
  id: string;
  name: string;
  nameEn: string;
  nameBn: string;
  imageUrl: string;
  minDays: number;
  color: string;
  description: string;
}

export const badges: Badge[] = [
  {
    id: 'clown',
    name: 'Clown',
    nameEn: 'Clown',
    nameBn: 'ক্লাউন',
    imageUrl: '/1.png',
    minDays: 0,
    color: 'bg-red-500',
    description: 'Starting your journey'
  },
  {
    id: 'noob',
    name: 'Noob',
    nameEn: 'Noob',
    nameBn: 'নুব',
    imageUrl: '/2.png',
    minDays: 1,
    color: 'bg-orange-500',
    description: 'First step taken'
  },
  {
    id: 'novice',
    name: 'Novice',
    nameEn: 'Novice',
    nameBn: 'নবিশ',
    imageUrl: '/3.png',
    minDays: 3,
    color: 'bg-yellow-500',
    description: 'Building momentum'
  },
  {
    id: 'average',
    name: 'Average',
    nameEn: 'Average',
    nameBn: 'গড়পড়তা',
    imageUrl: '/4.png',
    minDays: 7,
    color: 'bg-blue-500',
    description: 'One week strong'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    nameEn: 'Advanced',
    nameBn: 'উন্নত',
    imageUrl: '/5.png',
    minDays: 15,
    color: 'bg-purple-500',
    description: 'Two weeks of dedication'
  },
  {
    id: 'sigma',
    name: 'Sigma',
    nameEn: 'Sigma',
    nameBn: 'সিগমা',
    imageUrl: '/6.png',
    minDays: 30,
    color: 'bg-green-500',
    description: 'One month champion'
  },
  {
    id: 'chad',
    name: 'Chad',
    nameEn: 'Chad',
    nameBn: 'চ্যাড',
    imageUrl: '/7.png',
    minDays: 45,
    color: 'bg-indigo-500',
    description: 'Elite performer'
  },
  {
    id: 'absolute_chad',
    name: 'Absolute Chad',
    nameEn: 'Absolute Chad',
    nameBn: 'পরম চ্যাড',
    imageUrl: '/8.png',
    minDays: 60,
    color: 'bg-pink-500',
    description: 'Two months of excellence'
  },
  {
    id: 'giga_chad',
    name: 'Giga Chad',
    nameEn: 'Giga Chad',
    nameBn: 'গিগা চ্যাড',
    imageUrl: '/9.png',
    minDays: 120,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    description: 'Legendary status achieved'
  }
];

export const getBadgeForStreak = (streakInDays: number): Badge => {
  // Find the highest badge the user qualifies for
  const qualifiedBadges = badges.filter(badge => streakInDays >= badge.minDays);
  return qualifiedBadges[qualifiedBadges.length - 1] || badges[0];
};

export const calculateStreakDays = (streakStartDate: any): number => {
  if (!streakStartDate) return 0;
  
  const startDate = streakStartDate.toDate ? streakStartDate.toDate() : new Date(streakStartDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const updateUserBadge = async (
  streakStartDate: any,
  currentBadge: string | undefined,
  updateUserData: (data: any) => Promise<void>
): Promise<void> => {
  const streakDays = calculateStreakDays(streakStartDate);
  const newBadge = getBadgeForStreak(streakDays);
  
  if (currentBadge !== newBadge.id) {
    await updateUserData({ currentBadge: newBadge.id });
  }
};

// Helper function to get badge by ID
export const getBadgeById = (badgeId: string): Badge => {
  return badges.find(badge => badge.id === badgeId) || badges[0];
};

// Image preloading utility to ensure images are cached
export const preloadBadgeImages = (): void => {
  badges.forEach(badge => {
    const img = new Image();
    img.src = badge.imageUrl;
    // Store in browser cache
    img.onload = () => {
      console.log(`Badge image loaded: ${badge.imageUrl}`);
    };
    img.onerror = () => {
      console.warn(`Failed to load badge image: ${badge.imageUrl}`);
    };
  });
};