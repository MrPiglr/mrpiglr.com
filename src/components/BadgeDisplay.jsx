import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const BadgeDisplay = ({ badge, size = 'md' }) => {
  const sizeClasses = {
    sm: { container: 'w-10 h-10', icon: 'w-5 h-5' },
    md: { container: 'w-16 h-16', icon: 'w-8 h-8' },
    lg: { container: 'w-24 h-24', icon: 'w-12 h-12' },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`relative flex items-center justify-center rounded-full cursor-pointer group ${selectedSize.container}`}
            style={{ backgroundColor: `${badge.color}20` }}
            whileHover={{ scale: 1.1, boxShadow: `0 0 15px ${badge.color}` }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Award className={selectedSize.icon} style={{ color: badge.color }} />
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-current" style={{ color: badge.color }}></div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="bg-card border-primary text-foreground">
          <div className="flex flex-col items-center text-center p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" style={{ color: badge.color }} />
              <p className="font-bold text-lg">{badge.name}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
            <Badge variant={badge.source === 'MrPiglr' ? 'default' : 'secondary'}>{badge.source}</Badge>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeDisplay;