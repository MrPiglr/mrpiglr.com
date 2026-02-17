import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment to auto-hide: setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const getBannerClasses = () => {
    if (theme === 'cyberpunk') {
      return 'bg-[#FF006E]/10 border-b-2 border-[#FF006E]';
    } else if (theme === 'matrix') {
      return 'bg-[#00FF00]/10 border-b-2 border-[#00FF00]';
    }
    return 'bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border-b border-purple-500/30';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${getBannerClasses()} backdrop-blur-md sticky top-16 z-40`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 md:py-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Zap className={`w-5 h-5 ${theme === 'cyberpunk' ? 'text-[#FF006E]' : theme === 'matrix' ? 'text-[#00FF00]' : 'text-gold-500'} animate-pulse`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm md:text-base font-semibold text-white truncate">
                    🎉 <span className="text-white">New Community Features Available!</span>
                  </p>
                  <p className={`text-xs md:text-sm hidden sm:block ${theme === 'cyberpunk' ? 'text-[#00FFD7]' : theme === 'matrix' ? 'text-[#39FF14]' : 'text-purple-200'}`}>
                    Explore Forums, Fan Art Gallery & Inspirations Map
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <a
                  href="/forum"
                  className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap hidden sm:block ${
                    theme === 'cyberpunk'
                      ? 'bg-[#FF006E] hover:bg-[#FF0080] text-white border border-[#FF006E]'
                      : theme === 'matrix'
                      ? 'bg-[#00FF00] hover:bg-[#39FF14] text-[#001a00] border border-[#00FF00]'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Explore →
                </a>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200 flex-shrink-0"
                  aria-label="Close announcement"
                >
                  <X className="w-5 h-5 text-gray-300 hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
