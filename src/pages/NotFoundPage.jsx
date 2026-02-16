import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Compass } from 'lucide-react';
import GlitchText from '@/components/GlitchText';

const NotFoundPage = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  const handleMouseMove = (event) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPos = clientX - (left + width / 2);
    const yPos = clientY - (top + height / 2);
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <Helmet>
        <title>404: Not Found - MrPiglr</title>
        <meta name="description" content="The page you were looking for could not be found." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div 
        className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background text-foreground relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid-background opacity-10"></div>
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative z-10 p-10 border border-border/50 rounded-2xl bg-card/30 backdrop-blur-sm"
        >
          <motion.div
            className="absolute -inset-2 rounded-2xl bg-primary/20 blur-xl -z-10"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <h1 className="text-8xl md:text-9xl font-extrabold text-primary mb-2 text-glow">
            <GlitchText text="404" />
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <GlitchText text="PAGE NOT FOUND" />
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>
            You've wandered into the digital void. The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/creations">
                <Compass className="mr-2 h-4 w-4" /> Explore Creations
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;