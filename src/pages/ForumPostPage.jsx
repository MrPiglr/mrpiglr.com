import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useParams, Link } from 'react-router-dom';
    import { Loader2, ThumbsUp, MessageSquare } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { format, formatDistanceToNow } from 'date-fns';
    
    const ForumPostPage = () => {
      const { postId } = useParams();
      const { user } = useAuth();
      const [post, setPost] = useState(null);
      const [comments, setComments] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [newComment, setNewComment] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);

      const baseUrl = "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/forum/post/${postId}`;
      const pageImage = `${baseUrl}/og-forum-post.jpg`; // Generic image for forum post
      const pageDescription = post ? `${post.title}: ${post.content?.substring(0, 150)}...` : "Read and participate in a discussion on the MrPiglr community forum.";
    
      const fetchPostAndComments = async () => {
        try {
          setLoading(true);
          const { data: postData, error: postError } = await supabase
            .from('forum_posts')
            .select(`*, user:profiles(username, avatar_url)`)
            .eq('id', postId)
            .single();
    
          if (postError) throw postError;
          setPost(postData);
    
          const { data: commentsData, error: commentsError } = await supabase
            .from('forum_comments')
            .select(`*, user:profiles(username, avatar_url)`)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
    
          if (commentsError) throw commentsError;
          setComments(commentsData);
    
          await supabase.rpc('increment_post_view', { p_post_id: postId });
    
        } catch (err) {
          setError('Failed to load post. It may have been deleted or does not exist.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        if (postId) {
          fetchPostAndComments();
        }
      }, [postId]);
    
      const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
    
        setIsSubmitting(true);
        try {
          const { error } = await supabase
            .from('forum_comments')
            .insert([{ post_id: postId, user_id: user.id, content: newComment }]);
          
          if (error) throw error;
          
          setNewComment('');
          fetchPostAndComments();
        } catch (err) {
          console.error('Error submitting comment:', err);
        } finally {
          setIsSubmitting(false);
        }
      };
    
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
            <title>{post?.title || 'Forum Post'} | MrPiglr Forum</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            
            <meta property="og:type" content="article" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={`${post?.title || 'Forum Post'} | MrPiglr Forum`} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:site_name" content="MrPiglr Forum" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={`${post?.title || 'Forum Post'} | MrPiglr Forum`} />
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
            {post && (
              <Card className="mb-8 bg-card">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold">{post.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.user?.avatar_url} alt={post.user?.username} />
                      <AvatarFallback>{post.user?.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{post.user?.username}</span>
                    <span>•</span>
                    <span>{format(new Date(post.created_at), 'PPP')}</span>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none text-lg text-muted-foreground/90">
                  <p>{post.content}</p>
                </CardContent>
              </Card>
            )}
    
            <h2 className="text-3xl font-bold mb-6">Comments ({comments.length})</h2>
            
            <div className="space-y-6 mb-8">
              {comments.map(comment => (
                <Card key={comment.id} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.username} />
                        <AvatarFallback>{comment.user?.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-card-foreground">{comment.user?.username}</span>
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="mt-2 text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
    
            {user ? (
              <form onSubmit={handleCommentSubmit}>
                <Card className="bg-card">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Join the discussion</h3>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="mb-4"
                      rows={4}
                    />
                    <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Post Comment
                    </Button>
                  </CardContent>
                </Card>
              </form>
            ) : (
              <div className="text-center text-muted-foreground bg-card/50 p-8 rounded-lg">
                <p className="mb-4">Want to join the conversation?</p>
                <Button asChild>
                  <Link to="/login">Login to Comment</Link>
                </Button>
              </div>
            )}
    
          </motion.div>
        </>
      );
    };
    
    export default ForumPostPage;