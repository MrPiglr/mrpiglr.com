import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Upload, Image as ImageIcon, Star } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import FanArtSubmissionForm from '@/components/FanArtSubmissionForm';

const FanArtCard = ({ art, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="h-full"
  >
    <Card className="overflow-hidden group h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="p-0 relative aspect-video">
        <img
          alt={art.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={art.image_url} />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1">{art.title}</CardTitle>
        <p className="text-sm text-muted-foreground">by {art.username || 'Anonymous'}</p>
        <p className="text-sm mt-2">{art.description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const FanArtPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isSubmitOpen, setSubmitOpen] = useState(false);
  const [allArt, setAllArt] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getHeaderColor = () => {
    if (theme === 'cyberpunk') return 'text-[#00FFD7]';
    if (theme === 'matrix') return 'text-[#39FF14]';
    return 'text-cyan-300';
  };

  const getStatCardClass = (colorName) => {
    if (theme === 'cyberpunk') {
      const colorMap = {
        cyan: 'from-[#00FFD7]/10 border-[#00FFD7]/30 hover:border-[#00FFD7]/50',
        magenta: 'from-[#FF006E]/10 border-[#FF006E]/30 hover:border-[#FF006E]/50'
      };
      return colorMap[colorName] || colorMap.cyan;
    } else if (theme === 'matrix') {
      return 'from-[#00FF00]/10 border-[#00FF00]/30 hover:border-[#00FF00]/50';
    }
    const colorMap = {
      cyan: 'from-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50',
      magenta: 'from-pink-500/10 border-pink-500/30 hover:border-pink-500/50'
    };
    return colorMap[colorName] || colorMap.cyan;
  };

  const baseUrl = import.meta.env.VITE_APP_URL || "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/fan-art`;
  const pageImage = `${baseUrl}/og-fanart.jpg`; // Generic image for fan art page
  const pageDescription = "A gallery showcasing incredible fan art from the MrPiglr community. See amazing creations inspired by MrPiglr's work.";

  const fetchFanArt = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('fan_art')
      .select('*')
      .eq('is_approved', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed to load fan art: ${error.message}` });
      setAllArt([]);
    } else {
      setAllArt(data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchFanArt();
  }, [fetchFanArt]);

  const featuredArt = allArt?.find(art => art.is_featured);
  const regularArt = allArt?.filter(art => !art.is_featured);

  return (
    <AnimatedPage>
      <Helmet>
        <title>Fan Art Gallery - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Fan Art Gallery - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="MrPiglr" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Fan Art Gallery - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className={`text-5xl md:text-6xl font-bold ${getHeaderColor()} font-mono mb-2`}>
            SYSTEM.GALLERY()
          </h1>
          <p className="text-xl text-muted-foreground font-mono">
            {'>'} Community artwork. Creativity. Inspiration.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className={`bg-gradient-to-br to-transparent ${getStatCardClass('cyan')} transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">Total Artworks</p>
                    <p className={`text-3xl font-bold ${getHeaderColor()}`}>{allArt.length}</p>
                  </div>
                  <ImageIcon className="text-cyan-500/50 w-12 h-12" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className={`bg-gradient-to-br to-transparent ${getStatCardClass('magenta')} transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">Featured</p>
                    <p className={`text-3xl font-bold ${getHeaderColor()}`}>{featuredArt ? '1' : '0'}</p>
                  </div>
                  <Star className="text-purple-500/50 w-12 h-12" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-muted-foreground font-mono">
            [{allArt.length > 0 ? 'LOADED' : 'EMPTY'}]
          </div>
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Dialog open={isSubmitOpen} onOpenChange={setSubmitOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="purple-glow">
                    <Upload className="mr-2 h-5 w-5" />
                    Submit Your Art
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Submit Your Fan Art</DialogTitle>
                    <CardDescription>Share your creation with the community! Submissions will be reviewed before appearing in the gallery.</CardDescription>
                  </DialogHeader>
                  <FanArtSubmissionForm setOpen={setSubmitOpen} onSubmissionSuccess={fetchFanArt} />
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {featuredArt && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mb-16"
              >
                <h2 className="text-2xl font-mono font-bold mb-6 text-cyan-300">{'›'} Featured Artwork</h2>
                <Card className="grid md:grid-cols-2 overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                   <div className="p-8 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold mb-2">{featuredArt.title}</h3>
                      <p className="text-muted-foreground text-lg mb-4">by {featuredArt.username || 'Anonymous'}</p>
                      <p>{featuredArt.description}</p>
                   </div>
                   <div className="min-h-[300px] md:h-full">
                     <img src={featuredArt.image_url} alt={featuredArt.title} className="w-full h-full object-cover" />
                   </div>
                </Card>
              </motion.section>
            )}

            {regularArt && regularArt.length > 0 ? (
              <div>
                <h2 className="text-2xl font-mono font-bold mb-6 text-cyan-300">{'›'} Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regularArt.map((art, index) => (
                    <FanArtCard key={art.id} art={art} index={index} />
                  ))}
                </div>
              </div>
            ) : !featuredArt && (
              <div className="text-center py-16">
                <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">The Gallery is Quiet</h3>
                <p className="text-muted-foreground">No fan art has been submitted yet. Be the first to contribute!</p>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default FanArtPage;