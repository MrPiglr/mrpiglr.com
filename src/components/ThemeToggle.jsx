import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Zap, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes = [
    { name: 'light', label: 'Light', icon: Sun },
    { name: 'dark', label: 'Dark', icon: Moon },
    { name: 'cyberpunk', label: 'Cyber', icon: Zap },
    { name: 'matrix', label: 'Matrix', icon: Cpu },
  ];

  const getThemeColor = (themeName) => {
    switch (themeName) {
      case 'light':
        return 'text-yellow-400';
      case 'cyberpunk':
        return 'text-cyan-400';
      case 'matrix':
        return 'text-green-400';
      default:
        return 'text-purple-400';
    }
  };

  const currentThemeObj = themes.find(t => t.name === theme);
  const CurrentIcon = currentThemeObj?.icon || Moon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${
          theme === 'cyberpunk'
            ? 'bg-[#00FFD7]/10 border-2 border-[#00FFD7] hover:bg-[#00FFD7]/20 hover:shadow-[0_0_15px_rgba(0,255,215,0.4)]'
            : theme === 'matrix'
            ? 'bg-[#00FF00]/10 border-2 border-[#00FF00] hover:bg-[#00FF00]/20 hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]'
            : theme === 'light'
            ? 'bg-yellow-500/10 border border-yellow-500 hover:bg-yellow-500/20'
            : 'bg-purple-500/10 border border-purple-500 hover:bg-purple-500/20'
        }`}
        aria-label="Toggle theme"
      >
        <CurrentIcon className={`w-5 h-5 ${getThemeColor(theme)}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-40 rounded-lg border shadow-xl z-50 ${
              theme === 'cyberpunk'
                ? 'bg-[#0a0a15] border-[#00FFD7] shadow-[0_0_20px_rgba(0,255,215,0.3)]'
                : theme === 'matrix'
                ? 'bg-[#000a00] border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.3)]'
                : theme === 'light'
                ? 'bg-white border-yellow-500 shadow-yellow-500/20'
                : 'bg-slate-900 border-purple-500 shadow-purple-500/20'
            }`}
          >
            <div className="p-2 space-y-1">
              {themes.map((t) => {
                const IconComponent = t.icon;
                const isActive = theme === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      toggleTheme(t.name);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? theme === 'cyberpunk'
                          ? 'bg-[#FF006E]/20 text-[#FF006E] border-2 border-[#FF006E]'
                          : theme === 'matrix'
                          ? 'bg-[#00FF00]/20 text-[#00FF00] border-2 border-[#00FF00]'
                          : theme === 'light'
                          ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500'
                        : theme === 'cyberpunk'
                        ? 'text-[#00FFD7] hover:bg-[#00FFD7]/10'
                        : theme === 'matrix'
                        ? 'text-[#00FF00] hover:bg-[#00FF00]/10'
                        : theme === 'light'
                        ? 'text-gray-600 hover:bg-yellow-100'
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{t.label}</span>
                    {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-current" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
