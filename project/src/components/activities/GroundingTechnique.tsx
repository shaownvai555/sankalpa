import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Eye, Ear, Hand, DoorClosed as Nose, Zap } from 'lucide-react';

interface GroundingTechniqueProps {
  onComplete: () => void;
}

const steps = [
  {
    number: 5,
    icon: Eye,
    title: '৫টি জিনিস দেখুন',
    instruction: 'আপনার চারপাশে ৫টি জিনিস খুঁজে বের করুন এবং মনে মনে নাম বলুন',
    examples: ['দেয়াল', 'টেবিল', 'বই', 'ফোন', 'হাত'],
    color: 'blue'
  },
  {
    number: 4,
    icon: Hand,
    title: '৪টি জিনিস স্পর্শ করুন',
    instruction: 'আপনার চারপাশের ৪টি জিনিস স্পর্শ করুন এবং অনুভব করুন',
    examples: ['টেবিলের পৃষ্ঠ', 'কাপড়ের টেক্সচার', 'ফোনের পৃষ্ঠ', 'চুল'],
    color: 'green'
  },
  {
    number: 3,
    icon: Ear,
    title: '৩টি শব্দ শুনুন',
    instruction: 'মনোযোগ দিয়ে ৩টি আলাদা শব্দ শোনার চেষ্টা করুন',
    examples: ['পাখির ডাক', 'গাড়ির শব্দ', 'ফ্যানের শব্দ', 'নিজের শ্বাস'],
    color: 'purple'
  },
  {
    number: 2,
    icon: Nose,
    title: '২টি গন্ধ নিন',
    instruction: 'আপনার চারপাশের ২টি গন্ধ শোঁকার চেষ্টা করুন',
    examples: ['বাতাসের গন্ধ', 'খাবারের গন্ধ', 'সাবানের গন্ধ', 'প্রাকৃতিক গন্ধ'],
    color: 'orange'
  },
  {
    number: 1,
    icon: Zap,
    title: '১টি স্বাদ নিন',
    instruction: 'মুখের ভিতরের স্বাদ অনুভব করুন বা কিছু খান/পান করুন',
    examples: ['পানি', 'চা', 'মুখের প্রাকৃতিক স্বাদ', 'মিন্ট'],
    color: 'red'
  }
];

const GroundingTechnique: React.FC<GroundingTechniqueProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stepProgress, setStepProgress] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setInterval(() => {
        setStepProgress(prev => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 2; // 50 seconds per step (100/2)
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setUserInputs(prev => [...prev, currentInput]);
      setCurrentInput('');
      setCurrentStep(prev => prev + 1);
      setStepProgress(0);
    } else {
      setUserInputs(prev => [...prev, currentInput]);
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  const handleSkipStep = () => {
    handleNextStep();
  };

  const currentStepData = steps[currentStep];
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-600 bg-blue-100 text-blue-600',
      green: 'from-green-500 to-emerald-600 bg-green-100 text-green-600',
      purple: 'from-purple-500 to-indigo-600 bg-purple-100 text-purple-600',
      orange: 'from-orange-500 to-red-600 bg-orange-100 text-orange-600',
      red: 'from-red-500 to-pink-600 bg-red-100 text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">গ্রাউন্ডিং সম্পন্ন!</h4>
            <p className="text-gray-600 text-sm mb-4">
              আপনি সফলভাবে ৫-৪-৩-২-১ টেকনিক সম্পন্ন করেছেন। +7 কয়েন অর্জিত!
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 text-xs">
                এই টেকনিক আপনাকে বর্তমান মুহূর্তে ফিরিয়ে এনেছে এবং মানসিক চাপ কমিয়েছে।
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(currentStepData.color).split(' ')[2]} ${getColorClasses(currentStepData.color).split(' ')[3]}`}>
          <currentStepData.icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">গ্রাউন্ডিং টেকনিক</h3>
          <p className="text-gray-600 text-sm">৫-৪-৩-২-১ পদ্ধতি</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">ধাপ {currentStep + 1} / {steps.length}</span>
          <span className="text-sm text-gray-600">{Math.round(stepProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className={`bg-gradient-to-r ${getColorClasses(currentStepData.color).split(' ')[0]} ${getColorClasses(currentStepData.color).split(' ')[1]} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${stepProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Step Content */}
          <div className={`bg-gradient-to-br ${getColorClasses(currentStepData.color).split(' ')[2]} rounded-xl p-6 text-center`}>
            <div className="text-6xl font-bold text-gray-800 mb-2">
              {currentStepData.number}
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">
              {currentStepData.title}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {currentStepData.instruction}
            </p>
          </div>

          {/* Examples */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm mb-3 font-medium">উদাহরণ:</p>
            <div className="grid grid-cols-2 gap-2">
              {currentStepData.examples.map((example, index) => (
                <div key={index} className="bg-white rounded-lg p-2 text-center text-sm text-gray-700">
                  {example}
                </div>
              ))}
            </div>
          </div>

          {/* User Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              আপনি কী খুঁজে পেলেন? (ঐচ্ছিক)
            </label>
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={`${currentStepData.number}টি জিনিসের নাম লিখুন...`}
              className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextStep}
              className={`flex-1 bg-gradient-to-r ${getColorClasses(currentStepData.color).split(' ')[0]} ${getColorClasses(currentStepData.color).split(' ')[1]} text-white py-3 rounded-xl font-medium transition-all`}
            >
              {currentStep === steps.length - 1 ? 'সম্পন্ন করুন' : 'পরবর্তী ধাপ'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkipStep}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm"
            >
              এড়িয়ে যান
            </motion.button>
          </div>

          {/* Timer Info */}
          <div className="text-center text-xs text-gray-500">
            প্রতিটি ধাপের জন্য সময় নিন • মোট সময়: ৩ মিনিট
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GroundingTechnique;