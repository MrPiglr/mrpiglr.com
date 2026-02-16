import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import TerminalEffect from '@/components/TerminalEffect';
import { User, Fingerprint, Cpu } from 'lucide-react';

const BioPage = () => {
  const [isFinished, setIsFinished] = useState(false);

  const terminalLines = [
    { text: 'INIT_SYSTEM_CHECK...', className: 'text-gray-500', speed: 20, delayAfter: 200 },
    { text: 'LOADING_BIOMETRICS...', className: 'text-gray-500', speed: 20, delayAfter: 300 },
    { text: 'IDENTITY VERIFIED.', className: 'text-green-500 font-bold', speed: 10, showPrompt: true },
    { text: '', className: '', speed: 0, showPrompt: false },
    { text: '>> TARGET: MrPiglr', className: 'text-primary text-xl font-bold tracking-widest', speed: 40, showPrompt: false },
    { text: '================================', className: 'text-gray-600', speed: 5, showPrompt: false },
    { text: 'CLASS: Computer Cowboy', className: 'text-white', speed: 20 },
    { text: 'ROLE: Architect // Founder', className: 'text-white', speed: 20 },
    { text: 'FACTION: AeThex Ecosystem', className: 'text-purple-400', speed: 20 },
    { text: 'LOCATION: [REDACTED]', className: 'text-red-400/70', speed: 20 },
    { text: '', className: '', speed: 0, showPrompt: false },
    { text: '>> SKILL_DATABASE_V2.0', className: 'text-primary font-bold', speed: 20, showPrompt: false },
    { text: ' > Frontend: React, Vite, Tailwind, Framer Motion', className: 'text-green-300', speed: 10, showPrompt: false },
    { text: ' > Backend: Node.js, Supabase, PostgreSQL', className: 'text-green-300', speed: 10, showPrompt: false },
    { text: ' > Engines: Unity, Unreal Engine 5', className: 'text-green-300', speed: 10, showPrompt: false },
    { text: ' > Audio: Ableton Live, Max/MSP', className: 'text-green-300', speed: 10, showPrompt: false },
    { text: '', className: '', speed: 0, showPrompt: false },
    { text: '>> NARRATIVE_LOG', className: 'text-primary font-bold', speed: 20, showPrompt: false },
    { text: 'Digital craftsman obsessed with the fusion of retro-futurism and modern utility.', className: 'text-gray-300 leading-relaxed', speed: 20, showPrompt: false },
    { text: 'Building the infrastructure for the next generation of creators.', className: 'text-gray-300 leading-relaxed', speed: 20, showPrompt: false },
    { text: 'Believes in open protocols, decentralized identity, and neon lights.', className: 'text-gray-300 leading-relaxed', speed: 20, showPrompt: false },
    { text: '', className: '', speed: 0, showPrompt: false },
    { text: 'SESSION_ACTIVE. WAITING FOR INPUT...', className: 'text-blue-400 animate-pulse', speed: 30, showPrompt: true },
  ];

  return (
    <AnimatedPage>
      <Helmet>
        <title>Bio - MrPiglr</title>
        <meta name="description" content="System bio and stats for MrPiglr." />
      </Helmet>

      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-20 px-4 overflow-hidden bg-background">
         {/* Cyberpunk Background Grid */}
        <div className="grid-background opacity-20 absolute inset-0 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/40 border border-primary/50 mb-6 shadow-[0_0_25px_hsl(var(--primary)/0.3)] backdrop-blur-md">
               <Fingerprint className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 text-glow uppercase">
              Data Profile
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs font-mono text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM ONLINE
            </div>
          </motion.div>

          <div className="w-full flex justify-center px-2">
            <TerminalEffect lines={terminalLines} onFinished={() => setIsFinished(true)} />
          </div>

          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              <div className="px-4 py-2 rounded bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-wider">
                Access Level: Admin
              </div>
               <div className="px-4 py-2 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-wider">
                Encrypted
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default BioPage;