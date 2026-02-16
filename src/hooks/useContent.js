import React, { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { PlayCircle, BookOpen, Gamepad2, ShoppingBag } from 'lucide-react';

const iconMap = {
  Music: PlayCircle,
  Book: BookOpen,
  Creation: Gamepad2,
  Product: ShoppingBag,
};

export const useContent = () => {
  const { data, loading } = useAppContext();

  const allContent = useMemo(() => {
    if (loading || !data) return [];

    const musicContent = (data.music || []).map(track => ({
      ...track,
      id: track.id || `music-${track.youtube_id}`,
      type: 'Music',
      description: `A track by ${track.artist}.`,
      category: 'Music',
      tags: ['music', track.artist.toLowerCase(), track.title.toLowerCase().split(' ').join('-')],
      path: '/music',
      icon: iconMap.Music,
      image: `A music visualizer for ${track.title}`,
    }));

    const creationsContent = (data.creations || []).map(item => ({
      ...item,
      type: 'Creation',
      icon: iconMap.Creation,
      path: '/creations',
    }));

    const booksContent = (data.books || []).map(item => ({
      ...item,
      type: 'Book',
      icon: iconMap.Book,
      path: '/books',
    }));

    const productsContent = (data.products || []).map(item => ({
      ...item,
      type: 'Product',
      icon: iconMap.Product,
      path: '/products',
    }));

    return [...musicContent, ...creationsContent, ...booksContent, ...productsContent];
  }, [data, loading]);

  return { content: allContent, loading };
};