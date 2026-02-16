import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useAppContext } from '@/contexts/AppContext';
import { getIcon } from '@/lib/iconMap';
import { supabase } from '@/lib/customSupabaseClient';
import { useSite } from '@/contexts/SiteContext';

const NowPlaying = () => {
  const { siteId } = useSite();
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const fetchTrack = async () => {
      if (!siteId) return;
      const { data, error } = await supabase
        .from('now_playing')
        .select('*')
        .eq('site_id', siteId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching now playing track:", error.message);
      } else {
        setTrack(data);
      }
    };
    fetchTrack();
  }, [siteId]);

  if (!track) return null;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 flex items-center gap-3 max-w-xs w-full">
      <img src={track.album_art_url} alt={`${track.track_title} album art`} className="w-12 h-12 rounded-md object-cover" />
      <div className="overflow-hidden">
        <p className="text-xs text-muted-foreground">NOW PLAYING</p>
        <a href={track.track_url} target="_blank" rel="noopener noreferrer" className="font-bold text-sm truncate block hover:text-primary">{track.track_title}</a>
        <p className="text-xs text-muted-foreground truncate">{track.artist_name}</p>
      </div>
    </div>
  );
};

const Footer = () => {
  const { toastNotImplemented } = useCustomToast();
  const { data } = useAppContext();
  const socialLinks = data?.social_links || [];

  const handleNotImplemented = (e) => {
    e.preventDefault();
    toastNotImplemented();
  };

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Music', path: '/music' },
    { name: 'Books', path: '/books' },
    { name: 'Blog', path: '/blog' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Press Kit', path: '/press-kit' },
  ];

  return (
    <footer className="bg-background text-foreground mt-auto">
      <div className="h-1 bg-primary"></div>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-6 mb-8">
          {socialLinks.map((link) => {
            const Icon = getIcon(link.icon);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={link.url === '#' ? handleNotImplemented : undefined}
                className="text-foreground hover:text-primary transition-colors"
                aria-label={link.name}
              >
                {Icon ? <Icon className="w-6 h-6" /> : <span>{link.name}</span>}
              </a>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-4 mb-8 text-sm font-bold uppercase tracking-wider">
          {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
          ))}
        </div>
        <div className="border-t border-border/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left text-xs text-muted-foreground uppercase tracking-wider">
              <p>&copy; {new Date().getFullYear()} MRPIGLR. ALL RIGHTS RESERVED.</p>
            </div>
            <div className="w-full md:w-auto flex justify-center">
              <NowPlaying />
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-6 gap-y-2 text-xs text-muted-foreground uppercase">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;