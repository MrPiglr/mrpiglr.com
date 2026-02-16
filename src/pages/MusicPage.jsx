import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import AnimatedPage from '@/components/AnimatedPage';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Loader2, ListMusic, Music as MusicIcon } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicPlayerUI = () => {
  const { 
    currentTrack, isPlaying, playPause, nextTrack, prevTrack, 
    isShuffle, toggleShuffle, isRepeat, toggleRepeat, 
    progress, duration, seek 
  } = useMusic();

  if (!currentTrack) {
    return (
      <div className="text-center p-8 bg-card rounded-xl border border-dashed">
        <MusicIcon className="w-12 h-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">NO TRACKS LOADED</h2>
        <p className="text-muted-foreground" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>Add some music in the admin panel to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border purple-glow">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-glow">{currentTrack.title}</h2>
          <p className="text-muted-foreground uppercase text-sm sm:text-md" style={{fontFamily: 'Inter', fontWeight: 400}}>{currentTrack.artist}</p>
        </motion.div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Button onClick={toggleShuffle} variant="ghost" size="icon" className={`rounded-full h-10 w-10 sm:h-12 sm:w-12 ${isShuffle ? 'text-primary' : ''}`}>
            <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button onClick={prevTrack} variant="ghost" size="icon" className="rounded-full h-12 w-12 sm:h-16 sm:w-16">
            <SkipBack className="w-6 h-6 sm:w-8 sm:h-8" />
          </Button>
          <Button onClick={playPause} variant="default" size="icon" className="rounded-full h-16 w-16 sm:h-20 sm:w-20 purple-glow-hard">
            {isPlaying ? <Pause className="w-8 h-8 sm:w-10 sm:h-10" /> : <Play className="w-8 h-8 sm:w-10 sm:h-10" />}
          </Button>
          <Button onClick={nextTrack} variant="ghost" size="icon" className="rounded-full h-12 w-12 sm:h-16 sm:w-16">
            <SkipForward className="w-6 h-6 sm:w-8 sm:h-8" />
          </Button>
           <Button onClick={toggleRepeat} variant="ghost" size="icon" className={`rounded-full h-10 w-10 sm:h-12 sm:w-12 ${isRepeat ? 'text-primary' : ''}`}>
            <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <span className="text-xs text-muted-foreground" style={{fontFamily: 'Inter', fontWeight: 400}}>{formatTime(progress)}</span>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground" style={{fontFamily: 'Inter', fontWeight: 400}}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const Playlist = () => {
    const { tracks, currentTrackIndex, playTrack } = useMusic();

    return (
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border h-full flex flex-col">
            <h3 className="text-xl font-bold p-4 flex items-center gap-2"><ListMusic className="w-5 h-5 text-primary" /> Playlist</h3>
            <div className="overflow-y-auto flex-grow custom-scrollbar pr-2">
                <AnimatePresence>
                {tracks.map((track, index) => (
                    <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => playTrack(index)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-4 ${index === currentTrackIndex ? 'bg-primary/20' : 'hover:bg-secondary'}`}
                    >
                        <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center relative shrink-0">
                           <img src={track.image_url} className="w-full h-full object-cover rounded-md" alt={`Album art for ${track.title}`} />
                           {index === currentTrackIndex && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <MusicIcon className="w-6 h-6 text-primary animate-pulse" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold truncate">{track.title}</p>
                            <p className="text-sm text-muted-foreground truncate" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>{track.artist}</p>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
        </div>
    );
};


const MusicPage = () => {
    const { loading: appLoading } = useAppContext();
    const { currentTrack, handlePlayerReady, handlePlayerStateChange, onEnded } = useMusic();
    
    const baseUrl = "https://www.mrpiglr.com";
    const pageUrl = `${baseUrl}/music`;
    const pageImage = `${baseUrl}/og-music.jpg`; 
    const pageDescription = "Listen to the latest music releases and explore the discography of MrPiglr. Features an interactive player with official music videos.";

    const playerOpts = {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        fs: 0,
        disablekb: 1,
      },
    };
    
    return (
        <AnimatedPage>
            <Helmet>
                <title>Music - MrPiglr</title>
                <link rel="canonical" href={pageUrl} />
                <meta name="description" content={pageDescription} />
                
                <meta property="og:type" content="music.playlist" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content="Music - MrPiglr" />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={pageUrl} />
                <meta name="twitter:title" content="Music - MrPiglr" />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={pageImage} />
            </Helmet>
            <section id="music" className="py-16 sm:py-24 px-4 md:px-6 min-h-screen relative">
                <div className="grid-background opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-glow">My Music</h1>
                    <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-center text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
                        An interactive experience for my music videos. Choose a track from the playlist or use the controls to navigate.
                    </p>

                    {appLoading ? (
                         <div className="flex justify-center items-center h-96">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3 aspect-video lg:aspect-auto lg:h-[70vh] rounded-2xl overflow-hidden purple-glow-hard">
                                {currentTrack && currentTrack.youtube_id && (
                                    <YouTube 
                                        videoId={currentTrack.youtube_id}
                                        opts={playerOpts}
                                        onReady={handlePlayerReady}
                                        onStateChange={handlePlayerStateChange}
                                        onEnd={onEnded}
                                        className="w-full h-full"
                                    />
                                )}
                                {(!currentTrack || !currentTrack.youtube_id) && (
                                     <div className="w-full h-full bg-card flex items-center justify-center text-center p-4">
                                        <div>
                                          <MusicIcon className="w-24 h-24 text-primary/30 mx-auto" />
                                          <p className="mt-4 text-muted-foreground">Select a track to play</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="lg:col-span-2 lg:h-[70vh]">
                                 <Playlist />
                            </div>
                            <div className="lg:col-span-5">
                                <MusicPlayerUI />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </AnimatedPage>
    );
};

export default MusicPage;