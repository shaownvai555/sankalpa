import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Award, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface CertificateProps {
  onClose: () => void;
  milestone: string;
  achievementDate: string;
}

const Certificate: React.FC<CertificateProps> = ({ onClose, milestone, achievementDate }) => {
  const { userData } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `sankalpa-certificate-${userData?.displayName || 'user'}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">সঙ্কল্পপত্র (Resolution Certificate)</h2>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={downloading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download PNG'}</span>
            </motion.button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="p-8">
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 p-12 rounded-2xl border-8 border-gradient-to-r from-gold-400 to-yellow-500 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
              border: '8px solid',
              borderImage: 'linear-gradient(45deg, #fbbf24, #f59e0b) 1'
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-16 h-16 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            <div className="absolute top-4 right-4 w-16 h-16 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            <div className="absolute bottom-4 left-4 w-12 h-12 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/logo.png" 
                  alt="Sankalpa Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-12 h-12 text-white flex items-center justify-center text-2xl">
                  🛡️
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">সঙ্কল্পপত্র</h1>
              <h2 className="text-2xl font-semibold text-indigo-600">Resolution Certificate</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-4"></div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-6">
              <div>
                <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
                <div className="bg-white bg-opacity-50 rounded-lg p-4 border-2 border-dashed border-indigo-300">
                  <h3 className="text-3xl font-bold text-indigo-800">{userData?.displayName || 'User'}</h3>
                </div>
              </div>

              <div>
                <p className="text-lg text-gray-700 mb-4">has successfully achieved</p>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 border border-green-300">
                  <h4 className="text-2xl font-bold text-green-800 mb-2">{milestone}</h4>
                  <p className="text-green-700">in their journey of self-control and personal growth</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-8 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Date: {achievementDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Level: {userData?.level || 1}</span>
                </div>
              </div>

              {/* Seal */}
              <div className="flex justify-center mt-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-yellow-300">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-bold">
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  Issued by <span className="font-semibold">Sankalpa - সঙ্কল্প</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  A companion for your journey of self-control and personal growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Certificate;