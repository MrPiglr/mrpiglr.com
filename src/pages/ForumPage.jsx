import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Loader2, MessageSquare, PlusCircle } from 'lucide-react';
    import AnimatedPage from '@/components/AnimatedPage';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const ForumPage = () => {
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();
      const { profile } = useAuth();
      const isAdmin = profile && ['admin', 'site_owner', 'oversee'].includes(profile.role);

      const baseUrl = "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/forum`;
      const pageImage = `${baseUrl}/og-forum.jpg`; // Generic image for forum page
      const pageDescription = "Join the community discussion on the MrPiglr forum. Connect, share, and discuss with fellow members about all things related to MrPiglr's work.";

      useEffect(() => {
        const fetchForumData = async () => {
          setLoading(true);
          try {
            const { data, error } = await supabase.rpc('get_forum_stats');
            if (error) throw error;
            setCategories(data);
          } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to load forum categories: ${error.message}` });
          } finally {
            setLoading(false);
          }
        };
        fetchForumData();
      }, [toast]);

      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen bg-background">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <AnimatedPage>
          <Helmet>
            <title>Forum - MrPiglr</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content="Forum - MrPiglr" />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:site_name" content="MrPiglr Forum" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content="Forum - MrPiglr" />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />
          </Helmet>
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
              <div className="text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-6xl font-bold text-glow mb-4"
                >
                  Community Forum
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl text-muted-foreground"
                >
                  Connect, share, and discuss with the MrPiglr community.
                </motion.p>
              </div>
            </div>

            <div className="space-y-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.category_id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <Link to={`/forum/category/${category.category_id}`} className="hover:text-primary transition-colors">
                        <CardTitle className="text-2xl">{category.category_name}</CardTitle>
                      </Link>
                      <CardDescription>{category.category_description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      {category.latest_posts && category.latest_posts.length > 0 ? (
                        <ul className="space-y-3">
                          {category.latest_posts.map(post => (
                            <li key={post.post_id} className="flex justify-between items-center text-sm">
                              <Link to={`/forum/post/${post.post_id}`} className="hover:underline text-foreground">
                                {post.post_title}
                              </Link>
                              <span className="text-muted-foreground text-xs hidden sm:block">
                                by {post.author_username}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-sm">No posts in this category yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedPage>
      );
    };

    export default ForumPage;