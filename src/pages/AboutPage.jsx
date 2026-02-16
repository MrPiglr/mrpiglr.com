import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import TerminalEffect from '@/components/TerminalEffect';
import GridBackground from '@/components/GridBackground';
import { User, Code, Cpu, Globe } from 'lucide-react';

const AboutPage = () => {
  const [terminalFinished, setTerminalFinished] = useState(false);

  const terminalLines = [
    { text: 'INITIATING BIO_SCAN...', className: 'text-green-500 font-bold', speed: 30, delayAfter: 400 },
    { text: 'LOADING KERNEL MODULES...', className: 'text-green-500', speed: 20, delayAfter: 300 },
    { text: 'ACCESS GRANTED.', className: 'text-primary font-bold', speed: 10, delayAfter: 600, showPrompt: false },
    { text: '', className: '', speed: 0, delayAfter: 200, showPrompt: false },
    { text: 'IDENTITY: MRPIGLR', className: 'text-2xl md:text-3xl text-purple-400 font-bold tracking-wide', speed: 40, delayAfter: 500, showPrompt: false },
    { text: 'ROLE: COMPUTER_COWBOY // ARCHITECT', className: 'text-blue-400', speed: 20, delayAfter: 400, showPrompt: false },
    { text: '', className: '', speed: 0, delayAfter: 300, showPrompt: false },
    { text: 'cat career_timeline.log', className: 'text-yellow-400', speed: 40, delayAfter: 800 },
    { text: '----------------------------------------', className: 'text-gray-600', speed: 5, delayAfter: 100, showPrompt: false },
    { text: '[2020] :: SYSTEM_BOOT', className: 'text-primary font-bold', speed: 10, delayAfter: 200, showPrompt: false },
    { text: '   > Entered the digital frontier. Wrote first line of code.', className: 'text-gray-300', speed: 20, delayAfter: 400, showPrompt: false },
    { text: '', className: '', speed: 0, delayAfter: 100, showPrompt: false },
    { text: '[2021] :: SKILL_UPLOAD', className: 'text-primary font-bold', speed: 10, delayAfter: 200, showPrompt: false },
    { text: '   > Mastered full-stack protocols. React, Node, Supabase.', className: 'text-gray-300', speed: 20, delayAfter: 400, showPrompt: false },
    { text: '', className: '', speed: 0, delayAfter: 100, showPrompt: false },
    { text: '[2022] :: FOUNDATION', className: 'text-primary font-bold', speed: 10, delayAfter: 200, showPrompt: false },
    { text: '   > Established AeThex Ecosystem. Identity layer initialized.', className: 'text-purple-300', speed: 20, delayAfter: 400, showPrompt: false },
    { text: '', className: '', speed: 0, delayAfter: 100, showPrompt: false },
    { text: '[2024] :: CURRENT_OBJECTIVE', className: 'text-green-400 font-bold', speed: 10, delayAfter: 200, showPrompt: false },
    { text: '   > Building the unified Developer Hub. Connecting architects.', className: 'text-gray-300', speed: 20, delayAfter: 400, showPrompt: false },
    { text: '----------------------------------------', className: 'text-gray-600', speed: 5, delayAfter: 200, showPrompt: false },
    { text: 'END OF FILE.', className: 'text-green-500', speed: 20, showPrompt: false },
  ];

  return (
    <AnimatedPage>
      <Helmet>
        <title>About - MrPiglr</title>
        <meta name="description" content="The origin story and timeline of MrPiglr." />
      </Helmet>

      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center py-20 px-4 overflow-hidden bg-background text-foreground font-mono">
        
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <GridBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 border border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500 text-glow">
              SYSTEM BIO
            </h1>
            <p className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">
              :: Authorized Personnel Only ::
            </p>
          </motion.div>

          <TerminalEffect lines={terminalLines} onFinished={() => setTerminalFinished(true)} />

          {terminalFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8 max-w-3xl"
            >
              <div className="p-6 rounded-xl border border-green-500/30 bg-green-950/10 backdrop-blur-sm hover:bg-green-950/20 transition-colors group shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                <Code className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <h3 className="text-lg font-bold text-green-400 mb-2">Architect</h3>
                <p className="text-xs text-green-200/70 leading-relaxed">Building scalable digital infrastructure for the next generation of web applications.</p>
              </div>

              <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-950/10 backdrop-blur-sm hover:bg-purple-950/20 transition-colors group shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                <User className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <h3 className="text-lg font-bold text-purple-400 mb-2">Creator</h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">Crafting audio-visual experiences that blend retro aesthetics with modern design.</p>
              </div>

              <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-950/10 backdrop-blur-sm hover:bg-blue-950/20 transition-colors group shadow-[0_0_20px_rgba(59,130,246,0.05)]">
                <Globe className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <h3 className="text-lg font-bold text-blue-400 mb-2">Visionary</h3>
                <p className="text-xs text-blue-200/70 leading-relaxed">Founded AeThex to provide a unified identity layer for the decentralized web.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AboutPage;