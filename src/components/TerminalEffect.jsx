import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TerminalEffect = ({ lines, onFinished }) => {
  const [currentLines, setCurrentLines] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const animationFrameId = useRef(null);
  const lastUpdateTime = useRef(0);
  const lineIndex = useRef(0);
  const charIndex = useRef(0);
  const waitingForDelay = useRef(false);

  useEffect(() => {
    setCurrentLines(lines.map(line => ({ ...line, text: '' })));
    lineIndex.current = 0;
    charIndex.current = 0;
    lastUpdateTime.current = 0;
    waitingForDelay.current = false;
    setIsFinished(false);

    const type = (timestamp) => {
      if (lineIndex.current >= lines.length) {
        if (!isFinished) {
          setIsFinished(true);
          if (onFinished) onFinished();
        }
        return;
      }

      const currentLineConfig = lines[lineIndex.current];
      const elapsed = timestamp - lastUpdateTime.current;

      if (waitingForDelay.current) {
        if (elapsed > (currentLineConfig.delayAfter || 400)) {
          lineIndex.current++;
          charIndex.current = 0;
          waitingForDelay.current = false;
          lastUpdateTime.current = timestamp;
        }
      } else if (elapsed > (currentLineConfig.speed || 30)) {
        lastUpdateTime.current = timestamp;

        if (charIndex.current < currentLineConfig.text.length) {
          setCurrentLines(prev => {
            const newLines = [...prev];
            if (newLines[lineIndex.current]) {
              newLines[lineIndex.current].text = currentLineConfig.text.substring(0, charIndex.current + 1);
            }
            return newLines;
          });
          charIndex.current++;
        } else {
          waitingForDelay.current = true;
        }
      }
      
      animationFrameId.current = requestAnimationFrame(type);
    };

    animationFrameId.current = requestAnimationFrame(type);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [lines, onFinished, isFinished]);

  return (
    <motion.div
      className="font-mono text-left text-sm md:text-base p-4 md:p-6 bg-black/80 border border-primary/20 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.15)] w-full max-w-3xl overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4 opacity-50 border-b border-white/10 pb-2">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
        <div className="ml-auto text-[10px] text-muted-foreground">bash --login</div>
      </div>
      
      <div className="whitespace-pre-wrap font-mono leading-relaxed min-h-[300px]">
        {currentLines.map((line, i) => (
          <div key={i} className={`${line.className || 'text-gray-300'} min-h-[1.5em] break-words`}>
            {(line.showPrompt !== false) && <span className="text-primary/50 mr-2 select-none">$</span>}
            <span>{line.text}</span>
          </div>
        ))}
        {!isFinished && <span className="bg-primary h-5 w-2.5 inline-block animate-pulse ml-1 align-middle shadow-[0_0_10px_hsl(var(--primary))]"></span>}
      </div>
    </motion.div>
  );
};

export default TerminalEffect;