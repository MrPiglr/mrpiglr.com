import React, { useState, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import AccessGrantedOverlay from '@/components/AccessGrantedOverlay';

const DashboardGate = ({ children }) => {
  // State to control the visibility of the overlay
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <>
      {/* Full-screen overlay that plays on mount */}
      <AnimatePresence>
        {showOverlay && (
          <AccessGrantedOverlay onComplete={() => setShowOverlay(false)} />
        )}
      </AnimatePresence>

      {/* 
         The dashboard content is rendered hidden while the animation plays.
         This allows data fetching to potentially start in the background (if not suspended),
         or at least prepares the component tree.
         We wrap it in a local Suspense boundary to prevent the main App suspense 
         from replacing the Overlay with a generic loader.
      */}
      <div className={showOverlay ? "hidden" : "animate-in fade-in zoom-in-95 duration-1000"}>
         <Suspense fallback={
             <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                 <Loader2 className="w-12 h-12 animate-spin text-primary" />
             </div>
         }>
            {children}
         </Suspense>
      </div>
    </>
  );
};

export default DashboardGate;