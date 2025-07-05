export interface Activity {
  id: string;
  type: 'mental' | 'physical' | 'creative' | 'game';
  title: string;
  description: string;
  componentName: string;
  duration?: number; // in seconds
  coins: number; // reward coins
}

export const ALL_ACTIVITIES: Activity[] = [
  // Existing Activities
  { 
    id: 'breathing', 
    type: 'mental', 
    title: 'শ্বাস-প্রশ্বাসের ব্যায়াম', 
    description: '২ মিনিটের শান্তিদায়ক শ্বাস-প্রশ্বাসের ব্যায়াম', 
    componentName: 'BreathingExercise',
    duration: 120,
    coins: 5
  },
  { 
    id: 'squats', 
    type: 'physical', 
    title: 'শারীরিক কার্যকলাপ', 
    description: '১০ বার স্কোয়াট করুন', 
    componentName: 'PhysicalActivity',
    duration: 60,
    coins: 5
  },
  
  // New Mental Exercises
  { 
    id: 'reverse_spelling', 
    type: 'mental', 
    title: 'উল্টো বানান', 
    description: '"SUCCESS" শব্দটি উল্টো করে লিখুন', 
    componentName: 'ReverseSpelling',
    duration: 60,
    coins: 3
  },
  { 
    id: 'grounding', 
    type: 'mental', 
    title: 'গ্রাউন্ডিং টেকনিক', 
    description: '৫-৪-৩-২-১ পদ্ধতি অনুসরণ করুন', 
    componentName: 'GroundingTechnique',
    duration: 180,
    coins: 7
  },
  { 
    id: 'counting_backwards', 
    type: 'mental', 
    title: 'উল্টো গণনা', 
    description: '১০০ থেকে ৭ বিয়োগ করে গণনা করুন', 
    componentName: 'CountingBackwards',
    duration: 90,
    coins: 4
  },
  { 
    id: 'memory_sequence', 
    type: 'mental', 
    title: 'স্মৃতি পরীক্ষা', 
    description: 'রঙের ক্রম মনে রাখুন এবং পুনরাবৃত্তি করুন', 
    componentName: 'MemorySequence',
    duration: 120,
    coins: 6
  },

  // New Creative Tasks
  { 
    id: 'doodle_pad', 
    type: 'creative', 
    title: 'সৃজনশীল আঁকা', 
    description: '১ মিনিটের জন্য যা ইচ্ছা আঁকুন', 
    componentName: 'DoodlePad',
    duration: 60,
    coins: 4
  },
  { 
    id: 'word_association', 
    type: 'creative', 
    title: 'শব্দ সংযোগ', 
    description: 'দেওয়া শব্দের সাথে সম্পর্কিত ৫টি শব্দ লিখুন', 
    componentName: 'WordAssociation',
    duration: 90,
    coins: 5
  },

  // New Games
  { 
    id: 'bubble_pop', 
    type: 'game', 
    title: 'বুদবুদ ফাটানো', 
    description: '৩০ সেকেন্ডের জন্য বুদবুদ ফাটান', 
    componentName: 'BubblePopGame',
    duration: 30,
    coins: 3
  },
  { 
    id: 'color_match', 
    type: 'game', 
    title: 'রঙ মিলানো', 
    description: 'সঠিক রঙের নাম ক্লিক করুন', 
    componentName: 'ColorMatchGame',
    duration: 45,
    coins: 4
  },
  { 
    id: 'reaction_test', 
    type: 'game', 
    title: 'প্রতিক্রিয়া পরীক্ষা', 
    description: 'সবুজ হলেই ক্লিক করুন', 
    componentName: 'ReactionTest',
    duration: 60,
    coins: 5
  },

  // Additional Physical Activities
  { 
    id: 'jumping_jacks', 
    type: 'physical', 
    title: 'জাম্পিং জ্যাকস', 
    description: '১৫ বার জাম্পিং জ্যাকস করুন', 
    componentName: 'JumpingJacks',
    duration: 45,
    coins: 4
  },
  { 
    id: 'wall_pushups', 
    type: 'physical', 
    title: 'দেয়াল পুশআপ', 
    description: '১০ বার দেয়ালে পুশআপ করুন', 
    componentName: 'WallPushups',
    duration: 60,
    coins: 5
  }
];

// Utility function to get random activities
export const getRandomActivities = (count: number = 4): Activity[] => {
  const shuffled = [...ALL_ACTIVITIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get activities by type
export const getActivitiesByType = (type: Activity['type']): Activity[] => {
  return ALL_ACTIVITIES.filter(activity => activity.type === type);
};