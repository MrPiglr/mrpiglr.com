import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from './AppContext';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const { data: appData, loading } = useAppContext();
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const originalTracks = useRef([]);
  const isReady = useRef(false);

  useEffect(() => {
    if (!loading && appData?.music) {
      const musicTracks = appData.music || [];
      originalTracks.current = musicTracks;
      setTracks(musicTracks);
      if (musicTracks.length > 0 && currentTrackIndex === null) {
        setCurrentTrackIndex(0);
      } else if (musicTracks.length === 0) {
        setCurrentTrackIndex(null);
      }
    }
  }, [appData, loading, currentTrackIndex]);

  const currentTrack = currentTrackIndex !== null && tracks.length > 0 ? tracks[currentTrackIndex] : null;

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.getDuration === 'function') {
        const currentTime = await playerRef.current.getCurrentTime();
        const durationValue = await playerRef.current.getDuration();
        if (durationValue > 0) {
          setProgress(currentTime);
          setDuration(durationValue);
        }
      }
    }, 1000);
  }, []);

  const handlePlayerReady = useCallback((event) => {
    playerRef.current = event.target;
    isReady.current = true;
    if (isPlaying) {
      playerRef.current.playVideo();
      startTimer();
    }
  }, [isPlaying, startTimer]);

  const handlePlayerStateChange = useCallback((event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startTimer();
    } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    }
  }, [startTimer]);

  const playPause = () => {
    if (!isReady.current || !playerRef.current || !currentTrack) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
      setProgress(0);
      setIsPlaying(true);
    }
  };
  
  const nextTrack = useCallback(() => {
    if (tracks.length === 0 || currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
  }, [currentTrackIndex, tracks.length]);

  const prevTrack = () => {
    if (tracks.length === 0 || currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
  };

  const onEnded = () => {
    if (isRepeat) {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      nextTrack();
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => {
      const newState = !prev;
      if (newState) {
        const shuffled = [...originalTracks.current].sort(() => Math.random() - 0.5);
        const currentPlayingTrack = tracks[currentTrackIndex];
        const newShuffled = currentPlayingTrack ? shuffled.filter(t => t.id !== currentPlayingTrack.id) : shuffled;
        const finalPlaylist = currentPlayingTrack ? [currentPlayingTrack, ...newShuffled] : newShuffled;
        setTracks(finalPlaylist);
        setCurrentTrackIndex(0);
      } else {
        setTracks(originalTracks.current);
        const originalIndex = currentTrack ? originalTracks.current.findIndex(t => t.id === currentTrack.id) : 0;
        setCurrentTrackIndex(originalIndex > -1 ? originalIndex : 0);
      }
      return newState;
    });
  };

  const toggleRepeat = () => setIsRepeat(prev => !prev);
  
  const seek = (value) => {
    if (playerRef.current && currentTrack) {
      playerRef.current.seekTo(value, true);
      setProgress(value);
    }
  };

  const value = {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isShuffle,
    isRepeat,
    progress,
    duration,
    playerRef,
    isReady,
    playPause,
    playTrack,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    seek,
    handlePlayerReady,
    handlePlayerStateChange,
    onEnded,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};