import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, BookOpen, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema } from '@/lib/jsonLdSchemas';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/blog`;
  const pageImage = `${baseUrl}/og-blog.jpg`; // Generic image for blog page
  const pageDescription = "Thoughts, tutorials, and updates from the digital frontier. Explore the latest posts from MrPiglr.";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_post_likes(count),
            blog_comments(count)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const textLength = new DOMParser().parseFromString(content, 'text/html').body.textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(textLength / wordsPerMinute);
    return `${readingTime} min read`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-65px)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-65px)] text-red-500">
        <p>Error loading blog posts: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="blog" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Blog - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Blog - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { label: "Home", url: "/" },
            { label: "Blog", url: "/blog" }
          ], baseUrl))}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider text-glow">
            The Digital Logbook
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Thoughts, tutorials, and updates from the digital frontier.
          </p>
          <div className="mt-8">
            <a href="https://mrpiglr.store/pages/blog" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                Access Premium Logs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </motion.div>

        {posts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="h-full flex flex-col bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 rounded-xl group overflow-hidden">
                    {post.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest mb-3">
                        <span>{getTimeAgo(post.published_at)}</span>
                        <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> {calculateReadingTime(post.content)}</span>
                      </div>
                      <h2 className="text-xl font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors mb-3 flex-grow">{post.title}</h2>
                      <div className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                       <div className="mt-auto flex justify-between items-center text-sm">
                          <p className="uppercase text-primary font-bold tracking-widest text-xs group-hover:text-glow transition-all">Continue Reading</p>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {post.blog_post_likes[0]?.count || 0}</span>
                            <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {post.blog_comments[0]?.count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">No Posts Yet</h2>
            <p className="text-muted-foreground">The logbook is empty for now. Check back soon for new entries!</p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default BlogPage;