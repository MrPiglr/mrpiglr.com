import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { generateBlogPostSchema } from '@/lib/jsonLdSchemas';
import { Loader2, Calendar, User, ArrowLeft, Heart, MessageSquare, BookOpen, Send, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import NotFoundPage from './NotFoundPage';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = "https://www.mrpiglr.com";

  const fetchPostData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`*, author:profiles!blog_posts_author_id_fkey(id, username, avatar_url, bio)`)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (postError) {
        if (postError.code === 'PGRST116') {
          setError('Post not found');
        } else {
          throw postError;
        }
        return;
      }

      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select(`*, user:profiles(id, username, avatar_url)`)
        .eq('post_id', postData.id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      
      const { count: likesCount, error: likesError } = await supabase
        .from('blog_post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postData.id);

      if (likesError) throw likesError;

      setPost(postData);
      setComments(commentsData || []);
      setLikes(likesCount || 0);

      if (user) {
        const { data: userLike, error: userLikeError } = await supabase
          .from('blog_post_likes')
          .select('*')
          .eq('post_id', postData.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (userLikeError) throw userLikeError;
        setUserHasLiked(!!userLike);
      }

    } catch (err) {
        setError(err.message);
        console.error("Error fetching post data:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);
  
  const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const textLength = new DOMParser().parseFromString(content, 'text/html').body.textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(textLength / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const handleLike = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Required', description: 'You must be logged in to like a post.' });
      navigate('/admin-login');
      return;
    }

    if (userHasLiked) {
      const { error } = await supabase.from('blog_post_likes').delete().match({ post_id: post.id, user_id: user.id });
      if (!error) {
        setLikes(prev => prev - 1);
        setUserHasLiked(false);
      }
    } else {
      const { error } = await supabase.from('blog_post_likes').insert({ post_id: post.id, user_id: user.id });
      if (!error) {
        setLikes(prev => prev + 1);
        setUserHasLiked(true);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Required', description: 'You must be logged in to comment.' });
      navigate('/admin-login');
      return;
    }
    if (newComment.trim() === '') return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({ post_id: post.id, user_id: user.id, content: newComment })
      .select('*, user:profiles(id, username, avatar_url)')
      .single();

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to post comment.' });
    } else {
      setComments(prev => [...prev, data]);
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
     if (!window.confirm("Are you sure you want to delete this comment?")) return;

    const { error } = await supabase.from('blog_comments').delete().eq('id', commentId);
    if(error){
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete comment.' });
    } else {
      setComments(comments.filter(c => c.id !== commentId));
      toast({ title: 'Success', description: 'Comment deleted.' });
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return <NotFoundPage />;
  }

  const pageUrl = `${baseUrl}/blog/${post.slug}`;
  const pageImage = post.image_url || `${baseUrl}/og-blog.jpg`; // Fallback to generic blog image
  const pageDescription = post.content?.substring(0, 160) || 'Discover insights, tutorials, and updates from MrPiglr on the latest in development, music, and creative projects.';


  return (
    <>
      <Helmet>
        <title>{post.title} - MrPiglr Blog</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="article:published_time" content={post.published_at} />
        {post.author?.username && (
          <meta property="article:author" content={`https://www.mrpiglr.com/profile/${post.author.username}`} />
        )}
        {post.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        <script type="application/ld+json">
          {JSON.stringify(generateBlogPostSchema(post, baseUrl))}
        </script>
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 py-16 md:py-24"
      >
        {post.image_url && (
          <div className="w-full h-[30vh] md:h-[50vh] relative mb-12 rounded-lg overflow-hidden">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-background/80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-xl border border-border">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm uppercase tracking-wider font-bold">
              <ArrowLeft className="w-4 h-4" />
              All Posts
            </Link>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-glow uppercase tracking-wider">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author?.username || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{calculateReadingTime(post.content)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{tag}</Badge>
              ))}
            </div>

            <article
              className="prose prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-primary prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-wider prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-glow"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <hr className="my-12 border-border/50" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleLike} className={`flex items-center gap-2 ${userHasLiked ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Heart className={`w-5 h-5 ${userHasLiked ? 'fill-current' : ''}`} /> {likes}
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                   <MessageSquare className="w-5 h-5" /> {comments.length}
                </div>
              </div>
            </div>

            {post.author && (
              <div className="mt-12 bg-card/50 p-6 rounded-lg flex items-start gap-6 border border-border/20">
                <img src={post.author.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author.id}`} alt={post.author.username} className="w-16 h-16 rounded-full" />
                <div>
                  <p className="text-sm uppercase text-muted-foreground">Written by</p>
                  <h3 className="text-xl font-bold text-foreground mb-1">{post.author.username}</h3>
                  <p className="text-muted-foreground text-sm">{post.author.bio || 'An explorer of digital frontiers.'}</p>
                </div>
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-glow mb-6">Comments ({comments.length})</h2>
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Join the discussion..."
                    className="mb-2"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || newComment.trim() === ''}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Post Comment
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center p-4 border border-dashed border-border rounded-lg text-muted-foreground">
                  <p>
                    <Link to="/admin-login" className="text-primary hover:underline">Log in</Link> to post a comment.
                  </p>
                </div>
              )}
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-4">
                    <img src={comment.user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.user_id}`} alt={comment.user?.username} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 bg-card/30 p-4 rounded-lg border border-border/20">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-foreground">{comment.user?.username || 'Anonymous'}</p>
                        {user?.id === comment.user_id && (
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteComment(comment.id)}>
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                      <p className="text-foreground/90">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BlogPostPage;