import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mrpiglr-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
    setMounted(true);
  }, []);

  const toggleTheme = (newTheme) => {
    if (['light', 'dark', 'cyberpunk', 'matrix'].includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('mrpiglr-theme', newTheme);
      document.documentElement.className = newTheme;
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isCyberpunk: theme === 'cyberpunk',
    isMatrix: theme === 'matrix',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
