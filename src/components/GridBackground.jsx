import React from 'react';

const GridBackground = () => {
  return (
    <div 
      className="absolute inset-0 z-0 opacity-10" 
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23a855f7' stroke-dasharray='5 3'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        transform: 'rotateX(35deg) rotateZ(45deg)',
        backgroundSize: '40px 40px',
        animation: 'pan-grid 60s linear infinite',
        perspective: '1000px',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%'
      }}
    />
  );
};

export default GridBackground;