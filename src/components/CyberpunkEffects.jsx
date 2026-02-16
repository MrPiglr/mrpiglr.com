import React from 'react';
import { cn } from '@/lib/utils';

export const Scanline = ({ className }) => (
  <div className={cn("pointer-events-none absolute inset-0 z-50 h-full w-full overflow-hidden select-none", className)}>
    {/* Static grain/scanlines */}
    <div className="absolute inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
    {/* Moving scanline bar */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-1/2 animate-scanline pointer-events-none z-50" />
  </div>
);

export const GlitchText = ({ text, className, as: Component = "span" }) => {
  return (
    <Component className={cn("relative inline-block group", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 animate-glitch-1 select-none" aria-hidden="true">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 animate-glitch-2 select-none" aria-hidden="true">{text}</span>
    </Component>
  );
};

export const HexagonCard = ({ children, className, onClick }) => {
  return (
    <div className={cn("hex-wrapper transition-transform duration-300 hover:scale-105", className)} onClick={onClick}>
      <div className="hex-mask relative bg-card border-0 overflow-hidden w-[260px] h-[300px] md:w-[300px] md:h-[346px] flex flex-col">
        {/* Border effect via inner container padding/background tricks or SVG overlay is simpler. 
            Here we just use background color and content. */}
        <div className="absolute inset-0 bg-card/90 backdrop-blur-sm z-0" />
        <div className="relative z-10 w-full h-full">
            {children}
        </div>
        
        {/* Hex Border Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
      </div>
    </div>
  );
};