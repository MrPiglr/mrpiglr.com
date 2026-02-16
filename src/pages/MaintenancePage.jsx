import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import { getIcon } from '@/lib/iconMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import TerminalEffect from '@/components/TerminalEffect';

const MaintenancePage = () => {
  const { data } = useAppContext();
  const socialLinks = data.social_links || [];
  const [terminalFinished, setTerminalFinished] = useState(false);

  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/maintenance`;
  const pageDescription = "The MrPiglr website is currently under maintenance for scheduled upgrades. We'll be back online shortly. Follow on social media for real-time updates.";

  const terminalLines = [
    { text: 'Booting system kernel...', speed: 20 },
    { text: 'Initializing core modules... [OK]', speed: 20 },
    { text: 'Connecting to mainframe... [OK]', speed: 20 },
    { text: 'Running diagnostics...', speed: 20, delayAfter: 1000 },
    { text: '  > Network... [PASS]', speed: 10, className: 'text-green-400' },
    { text: '  > Database... [PASS]', speed: 10, className: 'text-green-400' },
    { text: '  > Security... [PASS]', speed: 10, className: 'text-green-400', delayAfter: 1000 },
    { text: 'System integrity verified.', speed: 20 },
    { text: 'Engaging maintenance protocols...', speed: 20, delayAfter: 500 },
    { text: 'SYSTEM STATUS: MAINTENANCE MODE', speed: 50, className: 'text-yellow-400 font-bold' },
    { text: 'Scheduled upgrades are in progress. Stand by.', speed: 30, className: 'text-cyan-400' },
  ];

  return (
    <>
      <Helmet>
        <title>Under Maintenance - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background text-foreground relative overflow-hidden">
        <div className="grid-background opacity-20"></div>
        
        <main className="z-10 flex flex-col items-center w-full max-w-4xl">
          <div className="w-full bg-black/50 p-4 rounded-lg border border-primary/20 shadow-lg purple-glow">
            <TerminalEffect lines={terminalLines} onFinished={() => setTerminalFinished(true)} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: terminalFinished ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-8"
          >
            <p className="text-muted-foreground max-w-md mx-auto mb-8 px-4">
              The digital frontier is being reshaped. For real-time updates, connect with us on our social channels.
            </p>
            <div className="flex justify-center items-center gap-6">
              {socialLinks.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.name}
                    whileHover={{ scale: 1.2, y: -2, transition: { duration: 0.2 } }}
                  >
                    {Icon && <Icon className="w-6 h-6" />}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </main>

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
                  Authenticate to bypass the maintenance page and access the live site.
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

export default MaintenancePage;