import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, KeyRound } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import GlitchText from '@/components/GlitchText';
import { useAppContext } from '@/contexts/AppContext';
import { getIcon } from '@/lib/iconMap';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import AdminLogin from '@/components/admin/AdminLogin';

const CountdownTimer = ({ targetDate }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const timeItems = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8 my-8">
      {timeItems.map(({ value, label }, index) => (
        <motion.div 
          key={label} 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
        >
          <span className="text-4xl md:text-6xl font-bold text-primary tracking-tighter tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-xs md:text-sm text-foreground/70 uppercase tracking-widest">{label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Whoops!",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('mrpiglr_waitlist')
      .insert({ email });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "You're already on the list!",
          description: "We've already got your email down. Thanks for being so enthusiastic!",
        });
        setSubmitted(true);
      } else {
        toast({
          title: "Uh oh!",
          description: `Something went wrong: ${error.message}`,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success!",
        description: "You've been added to the waitlist. We'll be in touch!",
      });
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center text-center p-4 rounded-lg bg-green-500/20 text-green-300 w-full max-w-md">
        <CheckCircle className="w-8 h-8 mr-4" />
        <p className="text-lg">Thank you for signing up! We'll notify you at launch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="email"
          placeholder="your.email@example.com"
          className="pl-10 h-12 text-lg w-full bg-background/50 border-primary/50 focus:border-primary focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button type="submit" size="lg" className="h-12 purple-glow w-full sm:w-auto" disabled={loading}>
        {loading ? 'Joining...' : 'Join Waitlist'}
      </Button>
    </form>
  );
};

const SocialLinks = () => {
    const { data } = useAppContext();
    const { toastNotImplemented } = useCustomToast();
    const socialLinks = data?.social_links || [];
  
    const handleNotImplemented = (e) => {
      e.preventDefault();
      toastNotImplemented();
    };

    return (
        <div className="flex items-center justify-center flex-wrap gap-6 mt-8">
            {socialLinks.map((link, index) => {
            const Icon = getIcon(link.icon);
            return (
                <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={link.url === '#' ? handleNotImplemented : undefined}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                {Icon ? <Icon className="w-6 h-6" /> : <span>{link.name}</span>}
                </motion.a>
            );
            })}
        </div>
    )
}

const ComingSoonPage = () => {
  const launchDate = new Date('2025-10-01T00:00:00');

  return (
    <>
      <Helmet>
        <title>Coming Soon - MrPiglr</title>
        <meta name="description" content="Something awesome is coming soon. Stay tuned for the official launch of MrPiglr's new website." />
      </Helmet>
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-background">
        <div className="grid-background opacity-20"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center text-foreground w-full max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="mb-4"
          >
            <img src="/favicon.svg" alt="MrPiglr Logo" className="w-20 h-20" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
             <GlitchText text="A New Chapter Begins" className="text-glow" />
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl px-4">
            We are crafting a brand new experience from the ground up. The next evolution of this digital space is on its way.
          </p>

          <CountdownTimer targetDate={launchDate} />

          <h2 className="text-2xl font-semibold mb-4">Be the First to Know</h2>
          <p className="text-foreground/80 mb-6 px-4">Join the waitlist to get exclusive updates and be notified the moment we go live.</p>
          
          <WaitlistForm />
          
          <SocialLinks />
        </motion.div>
         <div className="absolute top-4 right-4 z-20">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-transparent">
                <KeyRound className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Admin Bypass</DialogTitle>
                <DialogDescription>
                  Authenticate to bypass the coming soon page and access the live site.
                </DialogDescription>
              </DialogHeader>
              <AdminLogin />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;