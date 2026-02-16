import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Terminal, Scan } from 'lucide-react';
import GlitchText from '@/components/GlitchText';
import GridBackground from '@/components/GridBackground';

const AccessGrantedOverlay = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Step 0: Initial Delay
      await new Promise(r => setTimeout(r, 500));
      setStep(1); // Authenticating
      
      await new Promise(r => setTimeout(r, 2000));
      setStep(2); // Identity Verified
      
      await new Promise(r => setTimeout(r, 1200));
      setStep(3); // Access Granted
      
      await new Promise(r => setTimeout(r, 2000));
      onComplete && onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden font-mono text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <GridBackground />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] pointer-events-none" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-50" />
      
      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-lg px-4">
        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div
                    key="auth"
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <Lock className="w-20 h-20 text-primary relative z-10 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-[0.2em] text-primary text-glow">
                            <GlitchText text="AUTHENTICATING..." />
                        </h2>
                        <div className="h-1 w-48 bg-gray-800 rounded-full overflow-hidden mx-auto">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.8, ease: "linear" }}
                            />
                        </div>
                        <p className="text-xs text-primary/60 tracking-widest mt-2">DECRYPTING SECURE KEYS</p>
                    </div>
                </motion.div>
            )}
            
            {step === 2 && (
                 <motion.div
                    key="verified"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                         <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                         <Scan className="w-20 h-20 text-green-500 relative z-10" />
                    </div>
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-[0.2em] text-green-500 text-glow">
                             IDENTITY VERIFIED
                        </h2>
                         <p className="text-xs text-green-500/60 tracking-widest mt-2">BIOMETRICS MATCHED: 99.9%</p>
                    </div>
                </motion.div>
            )}

            {step === 3 && (
                 <motion.div
                    key="access"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center"
                >
                    <div className="p-8 border-2 border-green-500/50 rounded-2xl bg-black/80 backdrop-blur-md shadow-[0_0_60px_rgba(34,197,94,0.3)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                             <ShieldCheck className="w-24 h-24 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                             <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-400 tracking-tighter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                                ACCESS<br/>GRANTED
                            </h1>
                        </div>
                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500" />
                    </div>
                     <p className="text-sm text-green-500 mt-6 tracking-[0.5em] font-bold animate-pulse">WELCOME ARCHITECT</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      
      {/* Footer Tech Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            AeThex Secure Gateway v4.0.2 // Connection Secure
        </p>
      </div>
    </motion.div>
  );
};

export default AccessGrantedOverlay;