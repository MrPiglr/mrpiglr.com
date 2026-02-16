import React from 'react';
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Twitch,
  Link,
  Music,
  Book,
  Gamepad2,
  ShoppingBag,
  Code,
  Mic,
  Film,
  Heart,
  Star,
  AtSign,
} from 'lucide-react';
import {
  FaTiktok,
  FaSnapchat,
  FaKickstarterK,
  FaSpotify,
  FaPatreon,
  FaDiscord,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import { SiAmazon, SiBandcamp, SiItchdotio, SiSoundcloud, SiBluesky } from "react-icons/si";

const iconComponents = {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Twitch,
  Link,
  Music,
  Book,
  Gamepad2,
  ShoppingBag,
  Code,
  Mic,
  Film,
  Heart,
  Star,
  AtSign,
  Tiktok: FaTiktok,
  Snapchat: FaSnapchat,
  Kick: FaKickstarterK,
  Spotify: FaSpotify,
  Patreon: FaPatreon,
  Discord: FaDiscord,
  Github: FaGithub,
  Linkedin: FaLinkedin,
  Bluesky: SiBluesky,
  Amazon: SiAmazon,
  Bandcamp: SiBandcamp,
  Itchdotio: SiItchdotio,
  Soundcloud: SiSoundcloud,
};

export const getIcon = (iconName) => {
  return iconComponents[iconName] || Link;
};

export const iconList = Object.keys(iconComponents).sort();