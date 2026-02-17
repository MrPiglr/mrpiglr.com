import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Link, useParams } from 'react-router-dom';
    import { Loader2, MessageSquare, Eye, ThumbsUp } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { formatDistanceToNow } from 'date-fns';
    
    const ForumCategoryPage = () => {
      const { categoryId } = useParams();
      const [category, setCategory] = useState(null);
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const baseUrl = import.meta.env.VITE_APP_URL || "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/forum/category/${categoryId}`;
      const pageImage = `${baseUrl}/og-forum-category.jpg`; // Generic image for forum category
      const pageDescription = category ? `Browse discussions and posts in the "${category.name}" category of the MrPiglr forum.` : "Browse discussions and posts in a forum category of the MrPiglr community forum.";
    
      useEffect(() => {
        const fetchCategoryData = async () => {
          try {
            setLoading(true);
            const { data: categoryData, error: categoryError } = await supabase
              .from('forum_categories')
              .select('*')
              .eq('id', categoryId)
              .single();
    
            if (categoryError) throw categoryError;
            setCategory(categoryData);
    
            const { data: postsData, error: postsError } = await supabase
              .from('forum_posts')
              .select(`*, user:profiles(username, avatar_url), likes:forum_likes(count), comments:forum_comments(count)`)
              .eq('category_id', categoryId)
              .order('created_at', { ascending: false });
    
            if (postsError) throw postsError;
            setPosts(postsData);
    
          } catch (err) {
            setError('Failed to load category data. Please try again later.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCategoryData();
      }, [categoryId]);
    
      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        );
      }
    
      if (error) {
        return <div className="text-center py-20 text-destructive">{error}</div>;
      }
    
      return (
        <>
          <Helmet>
            <title>{category?.name || 'Forum Category'} | MrPiglr Forum</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={`${category?.name || 'Forum Category'} | MrPiglr Forum`} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:site_name" content="MrPiglr Forum" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={`${category?.name || 'Forum Category'} | MrPiglr Forum`} />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">{category?.name}</h1>
            <p className="text-lg text-muted-foreground mb-8">{category?.description}</p>
            
            <div className="space-y-6">
              {posts.length > 0 ? posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:border-primary/50 transition-colors duration-300 bg-card">
                    <CardHeader>
                      <Link to={`/forum/post/${post.id}`}>
                        <CardTitle className="text-2xl font-bold hover:text-primary transition-colors">{post.title}</CardTitle>
                      </Link>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.user?.avatar_url} alt={post.user?.username} />
                          <AvatarFallback>{post.user?.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{post.user?.username}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {post.likes[0]?.count || 0}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {post.comments[0]?.count || 0}</span>
                        <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {post.views_count || 0}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )) : (
                <p className="text-center text-muted-foreground py-10">No posts in this category yet. Be the first to start a discussion!</p>
              )}
            </div>
          </motion.div>
        </>
      );
    };
    
    export default ForumCategoryPage;