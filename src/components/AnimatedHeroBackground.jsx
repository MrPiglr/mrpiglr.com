import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedHeroBackground = () => {
  const { theme } = useTheme();

  const getColors = () => {
    if (theme === 'cyberpunk') {
      return {
        gradient: 'from-[#FF006E]/10 via-black to-[#00FFD7]/10',
        blob1: 'bg-[#FF006E]/20',
        blob2: 'bg-[#00FFD7]/20',
        blob3: 'bg-[#FF006E]/10',
        particle: 'bg-[#FF006E]',
      };
    } else if (theme === 'matrix') {
      return {
        gradient: 'from-[#00FF00]/10 via-black to-[#39FF14]/10',
        blob1: 'bg-[#00FF00]/20',
        blob2: 'bg-[#39FF14]/20',
        blob3: 'bg-[#00FF00]/10',
        particle: 'bg-[#00FF00]',
      };
    }
    return {
      gradient: 'from-purple-900/20 via-black to-cyan-900/20',
      blob1: 'bg-purple-600/20',
      blob2: 'bg-cyan-600/20',
      blob3: 'bg-purple-500/10',
      particle: 'bg-purple-400',
    };
  };

  const colors = getColors();

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Main gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} animate-gradient-shift`} />

      {/* Animated blobs - Responsive sizes */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 ${colors.blob1} rounded-full blur-3xl`}
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className={`absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 ${colors.blob2} rounded-full blur-3xl`}
      />

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className={`absolute top-1/2 right-1/3 w-40 md:w-80 h-40 md:h-80 ${colors.blob3} rounded-full blur-3xl`}
      />

      {/* Particle effect - Bounded to container */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const startX = Math.random() * 100;
          const delay = Math.random() * 5;
          
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${colors.particle} rounded-full pointer-events-none`}
              initial={{
                left: `${startX}%`,
                top: '100%',
                opacity: 0.3,
              }}
              animate={{
                top: '-10%',
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 8 + 12,
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
              }}
            />
          );
        })}
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
    </div>
  );
};

export default AnimatedHeroBackground;
