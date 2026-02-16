import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Loader2, Music, Book, Code, Gamepad2, Brush, Film } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Link } from 'react-router-dom';
    
    const iconMap = {
      Music: Music,
      Books: Book,
      Creations: Code,
      Portfolio: Gamepad2,
      'Fan Art': Brush,
      Blog: Film,
    };
    
    const BrowseAllPage = () => {
      const [counts, setCounts] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const baseUrl = "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/browse`;
      const pageImage = `${baseUrl}/og-browse.jpg`; // Generic image for browse page
      const pageDescription = "Explore all categories of content by MrPiglr, including music, books, creations, fan art, blog posts, and portfolio projects.";
    
      useEffect(() => {
        const fetchCounts = async () => {
          try {
            setLoading(true);
            const [
              { count: musicCount },
              { count: booksCount },
              { count: creationsCount },
              { count: portfolioCount },
              { count: fanArtCount },
              { count: blogCount },
            ] = await Promise.all([
              supabase.from('music').select('*', { count: 'exact', head: true }),
              supabase.from('books').select('*', { count: 'exact', head: true }),
              supabase.from('creations').select('*', { count: 'exact', head: true }),
              supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
              supabase.from('fan_art').select('*', { count: 'exact', head: true }).eq('is_approved', true),
              supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
            ]);
    
            setCounts({
              Music: musicCount,
              Books: booksCount,
              Creations: creationsCount,
              Portfolio: portfolioCount,
              'Fan Art': fanArtCount,
              Blog: blogCount,
            });
          } catch (err) {
            setError('Failed to load content. Please try again later.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCounts();
      }, []);
    
      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen bg-background">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        );
      }
    
      if (error) {
        return <div className="text-center py-20 text-destructive">{error}</div>;
      }
    
      const categories = [
        { name: 'Music', path: '/music' },
        { name: 'Books', path: '/books' },
        { name: 'Creations', path: '/creations' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Fan Art', path: '/fan-art' },
        { name: 'Blog', path: '/blog' },
      ];
    
      return (
        <>
          <Helmet>
            <title>Browse All | MrPiglr</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content="Browse All | MrPiglr" />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content="Browse All | MrPiglr" />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground">Browse All Content</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = iconMap[category.name];
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link to={category.path}>
                      <Card className="h-full hover:border-primary transition-colors duration-300 group bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-2xl font-bold">{category.name}</CardTitle>
                          <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-extrabold text-primary">
                            {counts[category.name]}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total {category.name.toLowerCase()} available
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      );
    };
    
    export default BrowseAllPage;