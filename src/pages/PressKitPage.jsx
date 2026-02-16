import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AnimatedPage from '@/components/AnimatedPage';
import { Download, Copy, Palette, Type, Image as ImageIcon, Info, Loader2 } from 'lucide-react';

const brandAssets = {
  logos: [
    { name: 'Primary Logo', file: 'logo-primary.png', description: 'MrPiglr primary logo in full color', url: '/favicon.svg' },
    { name: 'Monochrome Logo (Light)', file: 'logo-mono-light.png', description: 'MrPiglr monochrome logo for dark backgrounds', url: '/favicon.svg' },
    { name: 'Monochrome Logo (Dark)', file: 'logo-mono-dark.png', description: 'MrPiglr monochrome logo for light backgrounds', url: '/favicon.svg' },
    { name: 'Icon Only', file: 'logo-icon.png', description: 'MrPiglr icon', url: '/favicon.svg' },
  ],
  colors: [
    { name: 'Primary', hex: '#9a47ff', variable: 'hsl(var(--primary))' },
    { name: 'Background', hex: '#000000', variable: 'hsl(var(--background))' },
    { name: 'Foreground', hex: '#FFFFFF', variable: 'hsl(var(--foreground))' },
    { name: 'Card', hex: '#0a0a0a', variable: 'hsl(var(--card))' },
    { name: 'Border', hex: '#262626', variable: 'hsl(var(--border))' },
  ],
  typography: [
    { name: 'Headings', font: 'Electrolize', style: 'Uppercase, Bold' },
    { name: 'Body', font: 'Inter', style: 'Normal case, Regular' },
  ],
  images: [
    { name: 'Portrait 1', file: 'portrait-1.jpg', description: 'MrPiglr, the Computer Cowboy, pointing into the distance with an axe over his shoulder.', url: 'https://horizons-cdn.hostinger.com/940b0b0b-48d0-439d-bfb7-f479f69a4948/575bb33462d33d91b58aaaa45e839e38.jpg' },
    { name: 'Portrait 2', file: 'portrait-2.jpg', description: 'Close-up shot of MrPiglr in a futuristic setting.', url: 'https://horizons-cdn.hostinger.com/940b0b0b-48d0-439d-bfb7-f479f69a4948/575bb33462d33d91b58aaaa45e839e38.jpg' },
    { name: 'Studio Shot', file: 'studio-shot.jpg', description: 'MrPiglr working in a studio with multiple monitors.', url: 'https://horizons-cdn.hostinger.com/940b0b0b-48d0-439d-bfb7-f479f69a4948/575bb33462d33d91b58aaaa45e839e38.jpg' },
    { name: 'Abstract Background', file: 'abstract-bg.jpg', description: 'Abstract purple and black background for branding.', url: 'https://horizons-cdn.hostinger.com/940b0b0b-48d0-439d-bfb7-f479f69a4948/575bb33462d33d91b58aaaa45e839e38.jpg' },
  ],
};

const PressKitPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/press-kit`;
  const pageDescription = "Access the official MrPiglr press and brand kit. Download logos, color palettes, fonts, and official imagery for media use.";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard!',
      description: `${text} has been copied.`,
    });
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    toast({
      title: 'Preparing Download...',
      description: 'Your assets are being zipped up. Please wait.',
    });

    try {
      const zip = new JSZip();
      const assetsFolder = zip.folder('MrPiglr_Press_Kit');
      const logosFolder = assetsFolder.folder('logos');
      const imagesFolder = assetsFolder.folder('images');
      
      const readmeContent = `
MrPiglr Press & Brand Kit
=========================

Thank you for your interest in featuring MrPiglr.

Inside this kit, you will find:
- Official Logos
- Brand Guidelines (Colors & Typography)
- Approved Imagery

Please adhere to the brand guidelines when using these assets. For any questions, please reach out via the contact form at ${baseUrl}/contact.

Last Updated: ${new Date().toLocaleDateString()}
      `;
      assetsFolder.file('README.txt', readmeContent);

      const assetDownloads = [
        ...brandAssets.logos.map(logo => ({ folder: logosFolder, asset: logo })),
        ...brandAssets.images.map(image => ({ folder: imagesFolder, asset: image }))
      ];

      const downloadPromises = assetDownloads.map(async ({ folder, asset }) => {
        try {
          const response = await fetch(asset.url);
          if (!response.ok) throw new Error(`Failed to fetch ${asset.file}`);
          const blob = await response.blob();
          folder.file(asset.file, blob);
        } catch (e) {
          console.warn(`Could not download ${asset.file}, creating placeholder. Error: ${e.message}`);
          folder.file(asset.file, `Could not download: ${asset.description}`);
        }
      });
      
      await Promise.all(downloadPromises);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'MrPiglr_Press_Kit.zip');
      
      toast({
        title: '✅ Download Started!',
        description: 'Your press kit is on its way.',
      });
    } catch (error) {
      console.error("Failed to create zip file:", error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'There was an error preparing your download. Please try again.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <AnimatedPage>
      <Helmet>
        <title>Press & Brand Kit - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content="Press & Brand Kit - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
      </Helmet>
      <div className="py-24 px-6 min-h-screen relative">
        <div className="grid-background opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-4 text-glow">Press & Brand Kit</h1>
            <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-muted-foreground max-w-3xl mx-auto">
              Everything you need to feature MrPiglr. For all media inquiries, please use the contact form.
            </p>
            <Button size="lg" className="mt-8 purple-glow" onClick={handleDownloadAll} disabled={isDownloading}>
              {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isDownloading ? 'Zipping Assets...' : 'Download Full Press Kit (.zip)'}
            </Button>
          </div>

          <div className="space-y-20">
            <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Info className="text-primary" /> Bio</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground" style={{ fontFamily: 'Inter', textTransform: 'none', fontWeight: 400 }}>
                <p>MrPiglr, a "Computer Cowboy" and Game Developer, is dedicated to crafting innovative experiences. As the founder of AeThex, his mission is to bring engaging ideas to life across various interactive media, from VR games to web platforms. With a background in engines like Unity and Unreal, and a passion for emerging tech, he continues to merge creativity and interactivity to push the boundaries of digital entertainment.</p>
              </div>
            </motion.section>

            <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><ImageIcon className="text-primary" /> Logos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {brandAssets.logos.map(logo => (
                  <div key={logo.name} className="bg-card border border-border rounded-lg p-6 text-center flex flex-col items-center justify-center h-40">
                    <img src={logo.url} alt={logo.description} className="h-16 w-16" />
                    <p className="font-semibold text-sm mt-4">{logo.name}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Palette className="text-primary" /> Color Palette</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {brandAssets.colors.map(color => (
                  <div key={color.name} className="text-center">
                    <div className="w-full aspect-square rounded-lg mb-3 border border-border" style={{ backgroundColor: color.hex }}></div>
                    <p className="font-bold">{color.name}</p>
                    <button onClick={() => copyToClipboard(color.hex)} className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1 w-full">
                      {color.hex} <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Type className="text-primary" /> Typography</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {brandAssets.typography.map(type => (
                  <div key={type.name} className="bg-card border border-border rounded-lg p-6">
                    <p className="text-sm text-muted-foreground">{type.name}</p>
                    <p className={`text-4xl font-bold mt-2`} style={{ fontFamily: type.font }}>{type.font}</p>
                    <p className="text-sm text-muted-foreground mt-2">{type.style}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><ImageIcon className="text-primary" /> Approved Imagery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {brandAssets.images.map(image => (
                  <div key={image.name} className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="aspect-video">
                        <img src={image.url} alt={image.description} className="w-full h-full object-cover" />
                    </div>
                    <p className="p-4 text-sm font-semibold">{image.name}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PressKitPage;