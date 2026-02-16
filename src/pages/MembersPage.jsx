import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Hexagon, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GridBackground from '@/components/GridBackground';

const MembersPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      <Helmet>
        <title>The Architects - MrPiglr</title>
        <meta name="description" content="View the unified Architects roster on the AeThex Developer Hub." />
      </Helmet>

      {/* Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <GridBackground />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl p-8 md:p-12 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)] text-center"
      >
        {/* Header Icon */}
        <div className="mb-8 flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="p-6 rounded-full bg-background border border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.4)] relative"
          >
            <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20"></div>
            <Users className="w-12 h-12 text-primary" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight text-glow">
          The Architects
        </h1>
        
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-lg mx-auto">
          The member directory has evolved. Join the elite roster of developers, creators, and innovators on the unified AeThex network.
        </p>

        {/* Primary Action */}
        <div className="flex flex-col items-center gap-6">
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[200px] h-14 text-base font-semibold purple-glow relative overflow-hidden group">
            <a href="https://aethex.dev/architects" target="_blank" rel="noopener noreferrer">
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Roster <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </Button>
          
          <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
            Hosted on AeThex Developer Hub
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border/30">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/40 border border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Network className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-semibold text-foreground">Global Network</h3>
                    <p className="text-xs text-muted-foreground">Connect across the ecosystem</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/40 border border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Hexagon className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-semibold text-foreground">Unified Profile</h3>
                    <p className="text-xs text-muted-foreground">One identity, infinite possibilities</p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MembersPage;