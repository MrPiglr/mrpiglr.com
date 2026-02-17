import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import AnimatedHeroBackground from '@/components/AnimatedHeroBackground';

const ConsoleHero = () => {
  const [text, setText] = useState('');
  // Changed the typing animation text as requested
  const fullText = "Initializing system... > Welcome to mrpiglr.com";
  
  // Typing effect logic
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden border-b bg-background">
      <AnimatedHeroBackground />
      {/* Background Grid - Absolute to prevent layout shift */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Content Container - Z-index ensures it sits above background */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Version Badge */}
            <div className="inline-block px-3 py-1 rounded-full border bg-secondary/50 backdrop-blur-sm text-xs font-mono text-muted-foreground mb-4">
              v2.0.0 System Online
            </div>

            {/* Main Title - Fixed min-height prevents jump if font loads late */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 min-h-[1.2em]">
               MrPiglr
            </h1>

            {/* Typing Effect Container - Constrained width to prevent overflow */}
            <div className="h-8 md:h-10 flex items-center justify-center text-base sm:text-lg md:text-xl text-muted-foreground font-mono overflow-hidden whitespace-nowrap">
              <span className="mr-2 text-primary">$</span>
              <span className="truncate">{text}</span>
              <span className="animate-pulse ml-1 inline-block w-2 h-5 bg-primary align-middle flex-shrink-0" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" className="w-full sm:w-auto sm:min-w-[160px]" asChild>
                <Link to="/portfolio">
                  View Work
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto sm:min-w-[160px] group" asChild>
                <Link to="/contact">
                  Contact Me
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements - Absolute positioned */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
};

export default ConsoleHero;