import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Loader2, MessageSquare, PlusCircle, Activity, Users, TrendingUp, Zap, ChevronRight } from 'lucide-react';
    import AnimatedPage from '@/components/AnimatedPage';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useTheme } from '@/contexts/ThemeContext';

    const ForumPage = () => {
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [stats, setStats] = useState({ totalPosts: 0, activeUsers: 0, totalMembers: 0 });
      const { toast } = useToast();
      const { profile } = useAuth();
      const { theme } = useTheme();
      const isAdmin = profile && ['admin', 'site_owner', 'oversee'].includes(profile.role);

      const baseUrl = import.meta.env.VITE_APP_URL || "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/forum`;
      const pageImage = `${baseUrl}/og-forum.jpg`;
      const pageDescription = "Join the MrPiglr community forum. Connect with members, share ideas, and discuss everything related to MrPiglr's work across Game Development, AeThex, Music, and more.";

      const getHeaderColor = () => {
        if (theme === 'cyberpunk') return 'text-[#FF006E]';
        if (theme === 'matrix') return 'text--[#00FF00]';
        return 'text-purple-300';
      };

      const getHotTopicsColor = () => {
        if (theme === 'cyberpunk') return 'text-[#00FFD7]';
        if (theme === 'matrix') return 'text-[#39FF14]';
        return 'text-cyan-300';
      };

      const getCtaButtonClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#00FFD7] hover:bg-[#00FFD7]/80 text-black';
        if (theme === 'matrix') return 'bg-[#00FF00] hover:bg-[#39FF14] text-[#001a00]';
        return 'bg-cyan-600 hover:bg-cyan-700';
      };

      const getCategoryColors = (index) => {
        if (theme === 'cyberpunk') {
          const colors = ['border-[#FF006E]/30 hover:border-[#FF006E]/50 text-[#FF006E]', 'border-[#00FFD7]/30 hover:border-[#00FFD7]/50 text-[#00FFD7]', 'border-[#00FF00]/30 hover:border-[#00FF00]/50 text-[#00FF00]', 'border-[#FF0080]/30 hover:border-[#FF0080]/50 text-[#FF0080]'];
          return colors[index % colors.length];
        } else if (theme === 'matrix') {
          return 'border-[#00FF00]/30 hover:border-[#00FF00]/50 text-[#00FF00]';
        }
        const colors = ['border-purple-500/30 hover:border-purple-500/50 text-purple-300', 'border-blue-500/30 hover:border-blue-500/50 text-blue-300', 'border-green-500/30 hover:border-green-500/50 text-green-300', 'border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300', 'border-pink-500/30 hover:border-pink-500/50 text-pink-300'];
        return colors[index % colors.length];
      };


      useEffect(() => {
        const fetchForumData = async () => {
          setLoading(true);
          try {
            // Fetch categories with stats
            const { data: categoryData, error: categoryError } = await supabase
              .from('forum_categories')
              .select('*, forum_posts(count), forum_comments(count)');
            
            if (categoryError) throw categoryError;
            
            // Fetch overall stats
            const { data: postsData } = await supabase.from('forum_posts').select('id', { count: 'exact' });
            const { data: usersData } = await supabase.from('profiles').select('id', { count: 'exact' });
            
            setCategories(categoryData || []);
            setStats({
              totalPosts: postsData?.length || 0,
              activeUsers: 0, // Placeholder - would need specific query
              totalMembers: usersData?.length || 0
            });
          } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to load forum: ${error.message}` });
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
            {/* Header with Terminal Style */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className={`text-5xl md:text-6xl font-bold ${getHeaderColor()} font-mono mb-2`}>
                  SYSTEM.FORUM()
                </h1>
                <p className="text-xl text-muted-foreground font-mono mb-2">
                  {'>'} Community nexus. Connect with builders, creators, and dreamers.
                </p>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30 hover:border-purple-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-mono">Total Posts</p>
                        <p className="text-3xl font-bold text-purple-300">{stats.totalPosts}</p>
                      </div>
                      <MessageSquare className="text-purple-500/50 w-12 h-12" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-mono">Community Members</p>
                        <p className="text-3xl font-bold text-blue-300">{stats.totalMembers}</p>
                      </div>
                      <Users className="text-blue-500/50 w-12 h-12" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-mono">Categories</p>
                        <p className="text-3xl font-bold text-green-300">{categories.length}</p>
                      </div>
                      <TrendingUp className="text-green-500/50 w-12 h-12" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Featured Section */}
            {!loading && categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-12"
              >
                <h2 className={`text-2xl font-mono font-bold mb-4 ${getHotTopicsColor()}`}>{'›'} Hot Topics</h2>
                <Card className="overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                  <CardHeader className="bg-muted/50 flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">Start Here</CardTitle>
                      <CardDescription>Check out popular discussions</CardDescription>
                    </div>
                    <Activity className="text-cyan-500/50 w-8 h-8" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">Browse our forum categories below to find discussions that interest you. Ask questions, share ideas, and connect with the community!</p>
                    <Button asChild className={getCtaButtonClass()}>
                      <Link to={`/forum/category/${categories[0]?.id}`}>
                        View Latest Discussions
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Categories Section */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className={`text-2xl font-mono font-bold ${getHeaderColor()}`}>{'›'} Categories</h2>
                  <Button asChild className={getCtaButtonClass()}>
                    <Link to="/forum/new">
                      <PlusCircle className="mr-2 w-4 h-4" />
                      New Post
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-6">
                  {categories.map((category, index) => {
                    const categoryColors = ['purple', 'blue', 'green', 'cyan', 'pink'];
                    const colorClass = categoryColors[index % categoryColors.length];
                    const colorMap = {
                      purple: { border: 'border-purple-500/30', hover: 'hover:border-purple-500/50', glow: 'glow-purple' },
                      blue: { border: 'border-blue-500/30', hover: 'hover:border-blue-500/50', glow: 'glow-blue-lg' },
                      green: { border: 'border-green-500/30', hover: 'hover:border-green-500/50', glow: 'glow-green-lg' },
                      cyan: { border: 'border-cyan-500/30', hover: 'hover:border-cyan-500/50', glow: 'glow-cyan-lg' },
                      pink: { border: 'border-pink-500/30', hover: 'hover:border-pink-500/50', glow: 'glow-pink-lg' },
                    };
                    const colors = colorMap[colorClass] || colorMap.purple;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                      >
                        <Card className={`overflow-hidden transition-all duration-300 ${colors.border} ${colors.hover}`}>
                          <Link to={`/forum/category/${category.id}`}>
                            <CardHeader className="bg-muted/30 pb-3 border-b cursor-pointer">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-2xl text-foreground hover:text-primary transition-colors">
                                    {category.name}
                                  </CardTitle>
                                  <CardDescription className="mt-2">{category.description}</CardDescription>
                                </div>
                                <Activity className={`w-8 h-8 text-${colorClass}-500/50 flex-shrink-0 ml-4`} />
                              </div>
                            </CardHeader>
                          </Link>
                          <CardContent className="p-4 md:p-6">
                            {category.forum_posts && category.forum_posts.length > 0 ? (
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground font-mono">{`[${category.forum_posts.length} posts]`}</p>
                                {/* Show quick stats */}
                                <div className="grid grid-cols-3 gap-4 py-2 border-y border-muted">
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Posts</p>
                                    <p className="text-lg font-bold">{category.forum_posts.length}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Comments</p>
                                    <p className="text-lg font-bold">{category.forum_comments?.length || 0}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Activity</p>
                                    <p className="text-lg font-bold text-green-300">•</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No posts yet. <span className="text-primary cursor-pointer">Be the first!</span></p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </AnimatedPage>
      );
    };

    export default ForumPage;