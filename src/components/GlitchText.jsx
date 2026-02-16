import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GlitchText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    let iteration = 0;
    
    // Clear any previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text); // Ensure final state is clean
      }

      iteration += 1 / 3; // Control speed of resolve
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      style={{ fontFamily: `'Share Tech Mono', monospace` }}
    >
      {displayText}
    </motion.span>
  );
};

export default GlitchText;