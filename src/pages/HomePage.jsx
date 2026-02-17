import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Cpu, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConsoleHero from '@/components/ConsoleHero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { generateOrganizationSchema, generatePersonSchema } from '@/lib/jsonLdSchemas';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Simulate data fetching to demonstrate layout stability
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  // Skeleton Component to prevent layout shifts
  const HomeSkeleton = () => (
    <div className="w-full space-y-16 pb-20">
      {/* Hero Skeleton - Matches ConsoleHero height */}
      <div className="w-full h-[600px] bg-secondary/20 animate-pulse" />
      
      {/* Features Skeleton */}
      <div className="container mx-auto px-4 min-h-[300px]"> {/* Added min-height here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-secondary/20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <>
      <Helmet>
        <title>MrPiglr - Computer Cowboy & Architect</title>
        <meta name="description" content="MRPIGLR SYSTEM :: Architect. Creator. Visionary. Building AeThex and digital experiences at the intersection of creativity and code." />
        
        <script type="application/ld+json">
          {JSON.stringify(generateOrganizationSchema("https://www.mrpiglr.com"))}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(generatePersonSchema("https://www.mrpiglr.com"))}
        </script>
      </Helmet>
      <div className="min-h-screen w-full overflow-x-hidden bg-background">
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-16 pb-20"
          >
            {/* Hero Section - Fixed Height maintained in component */}
            <ConsoleHero />

            {/* Featured Sections - Added min-h-[300px] to reserve space */}
            <section className="container mx-auto px-4 min-h-[300px]"> 
              <h2 className="sr-only">Navigate the System</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard 
                  icon="🏗️"
                  title="ARCHITECT"
                  description="Scalable infrastructure & digital foundations. Building systems that work."
                  link="/portfolio"
                  color="green"
                />
                <FeatureCard 
                  icon="🎨"
                  title="CREATOR"
                  description="Audio-visual experiences. Retro aesthetics meet modern design."
                  link="/music"
                  color="purple"
                />
                <FeatureCard 
                  icon="🌐"
                  title="VISIONARY"
                  description="AeThex ecosystem. Identity layer for the decentralized web."
                  link="/about"
                  color="blue"
                />
              </div>
            </section>

            {/* About/Bio Teaser - Fixed min-height to prevent collapse */}
            <section className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 md:p-12 min-h-[300px] flex flex-col justify-center transition-all duration-300 hover:glow-purple-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tighter mb-4 text-purple-300">SYSTEM INITIALIZED</h2>
                  <p className="text-muted-foreground text-lg mb-6 font-mono">
                    {'>'} Computer cowboy. Architect. Creator. I build digital infrastructure that pushes boundaries—from web applications to game engines to the AeThex ecosystem. <br/><br/>
                    {'>'} The intersection of creativity & code is where I live.
                  </p>
                  <Button asChild size="lg" className="group bg-purple-600 hover:bg-purple-700">
                    <Link to="/about">
                      [ACCESS FULL BIO] 
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </>
  );
};

// Sub-component to keep main file clean
const FeatureCard = ({ icon, title, description, link }) => (
  <Card className="group hover:border-primary/50 transition-all duration-300 hover:glow-purple-lg">
    <CardContent className="p-6">
      {icon}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 min-h-[3rem]">{description}</p>
      <Button variant="ghost" className="p-0 h-auto font-semibold group-hover:text-primary" asChild>
        <Link to={link} className="flex items-center">
          Explore <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default HomePage;