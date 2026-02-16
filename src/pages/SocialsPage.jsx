import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/AnimatedPage';
import { useAppContext } from '@/contexts/AppContext';
import { getIcon } from '@/lib/iconMap';

const SocialsPage = () => {
    const { data } = useAppContext();
    const socialLinks = data.social_links || [];
    
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    
    const baseUrl = "https://www.mrpiglr.com";
    const pageUrl = `${baseUrl}/socials`;
    const pageImage = `${baseUrl}/og-socials.jpg`; 
    const pageDescription = "Connect with MrPiglr across all social media platforms.";

    return (
        <AnimatedPage>
            <Helmet>
                <title>Socials - MrPiglr</title>
                <link rel="canonical" href={pageUrl} />
                <meta name="description" content={pageDescription} />
                
                <meta property="og:type" content="website" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content="Socials - MrPiglr" />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={pageUrl} />
                <meta name="twitter:title" content="Socials - MrPiglr" />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={pageImage} />
            </Helmet>
            <motion.section id="socials" className="py-24 px-6 min-h-screen relative" variants={sectionVariants} initial="hidden" animate="visible">
                <div className="grid-background opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl font-bold text-center mb-4 text-glow">Connect & Follow</h1>
                    <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Stay connected across all platforms for the latest updates, content, and behind-the-scenes access.
                    </p>
                    <div className="space-y-6">
                        {socialLinks.map((link) => {
                            const Icon = getIcon(link.icon);
                            return (
                                <motion.div 
                                    key={link.id} 
                                    className="bg-card p-6 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                                    variants={itemVariants}
                                >
                                    <div className="flex items-center gap-4">
                                        {Icon && <Icon className="w-8 h-8 text-primary flex-shrink-0" />}
                                        <div>
                                            <p className="font-bold text-lg">{link.name}</p>
                                            <p className="text-sm text-muted-foreground break-all">{link.url}</p>
                                        </div>
                                    </div>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="mt-4 sm:mt-0 w-full sm:w-auto flex-shrink-0">
                                        <Button className="w-full">
                                            Follow
                                        </Button>
                                    </a>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>
        </AnimatedPage>
    );
};

export default SocialsPage;