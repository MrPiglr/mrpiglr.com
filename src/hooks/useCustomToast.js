import React from 'react';
import { useToast } from '@/components/ui/use-toast';

const notImplementedMessages = [
  {
    title: '🚧 Under Construction 🚧',
    description: "MrPiglr said he'd finish this 'soon'. We'll see about that.",
  },
  {
    title: '🤔 Feature Not Found',
    description: "Looks like this button leads to nowhere. Classic MrPiglr move.",
  },
  {
    title: '🚨 System Anomaly Detected',
    description: "AeThex might be... borrowing this feature's bandwidth. Don't tell anyone.",
  },
  {
    title: '😴 Still Napping',
    description: "This feature is taking a little nap. Try not to wake it. Or do, whatever.",
  },
  {
    title: '💥 Error 404: Ambition Not Found',
    description: "MrPiglr's ambition for this feature couldn't be located. Try again later... or never.",
  },
];

export const useCustomToast = () => {
  const { toast } = useToast();

  const toastNotImplemented = () => {
    const randomMessage = notImplementedMessages[Math.floor(Math.random() * notImplementedMessages.length)];
    toast(randomMessage);
  };

  return { toastNotImplemented };
};