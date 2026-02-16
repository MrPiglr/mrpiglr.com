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
        <title>MrPiglr - Creative Technologist & Developer</title>
        <meta name="description" content="Official website of MrPiglr, a creative technologist specializing in web development, game development, and open source contributions." />
        
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
              <h2 className="sr-only">Featured Services and Creations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard 
                  icon={<Terminal className="w-8 h-8 mb-4 text-primary" />}
                  title="Digital Experiences"
                  description="Immersive web applications and virtual environments built with cutting-edge tech."
                  link="/portfolio"
                />
                <FeatureCard 
                  icon={<Cpu className="w-8 h-8 mb-4 text-primary" />}
                  title="Game Development"
                  description="Exploring new worlds through interactive storytelling and game mechanics."
                  link="/creations"
                />
                <FeatureCard 
                  icon={<Code2 className="w-8 h-8 mb-4 text-primary" />}
                  title="Open Source"
                  description="Contributing to the developer community with tools, libraries, and resources."
                  link="/dev-exchange"
                />
              </div>
            </section>

            {/* About/Bio Teaser - Fixed min-height to prevent collapse */}
            <section className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tighter mb-4">Building the Future, One Bit at a Time</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    I'm a full-stack developer and digital artist obsessed with the intersection of creativity and code. 
                    From React applications to game engines, I build things that live on the internet.
                  </p>
                  <Button asChild size="lg" className="group">
                    <Link to="/about">
                      Read Full Bio 
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
  <Card className="group hover:border-primary/50 transition-colors duration-300">
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