import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Tag, Calendar, Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import AnimatedPage from '@/components/AnimatedPage';
import { generatePortfolioProjectSchema } from '@/lib/jsonLdSchemas';

const ContentRenderer = ({ content }) => {
  if (!content || !content.blocks) return <p>No detailed content available.</p>;

  return (
    <div className="prose prose-invert max-w-none text-lg leading-relaxed prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4 prose-p:mb-6">
      {content.blocks.map((block, index) => {
        switch (block.type) {
          case 'header':
            const Tag = `h${block.data.level}`;
            return <Tag key={index}>{block.data.text}</Tag>;
          case 'paragraph':
            return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="list-disc pl-8 space-y-2">
                {block.data.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ListTag>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const PortfolioDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const baseUrl = "https://www.mrpiglr.com";

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        setProject(data);
      } catch (err) {
        setError('Failed to load project details. It may not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-destructive mb-4">{error || 'Project not found'}</h2>
        <Button asChild>
          <Link to="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
      </div>
    );
  }

  const pageUrl = `${baseUrl}/portfolio/${project.slug}`;
  const pageImage = project.cover_image_url || `${baseUrl}/og-portfolio.jpg`;
  const pageDescription = project.subtitle || "A detailed case study from MrPiglr's portfolio.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>{project.title} | MrPiglr Portfolio</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={`${project.title} | MrPiglr Portfolio`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={`${project.title} | MrPiglr Portfolio`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        <script type="application/ld+json">
          {JSON.stringify(generatePortfolioProjectSchema(project, baseUrl))}
        </script>
      </Helmet>
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>
          <article>
            <header className="mb-12">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-3 text-glow">{project.title}</h1>
              <p className="text-2xl text-muted-foreground">{project.subtitle}</p>
            </header>

            <div className="mb-12 rounded-xl overflow-hidden shadow-2xl purple-glow">
              <img
                src={project.cover_image_url || 'https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=2070'}
                alt={project.title}
                className="w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <main className="lg:col-span-2">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardContent className="p-0">
                    <ContentRenderer content={project.content} />
                  </CardContent>
                </Card>
              </main>
              <aside>
                <div className="sticky top-24">
                  <Card className="bg-card/60 border-border/50">
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.project_date && <div className="flex items-center"><Calendar className="mr-3 h-5 w-5 text-primary flex-shrink-0" /><span>{format(new Date(project.project_date), 'MMMM yyyy')}</span></div>}
                      {project.tags && (
                        <div className="flex items-start">
                          <Tag className="mr-3 mt-1 h-5 w-5 text-primary flex-shrink-0" />
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col space-y-3 pt-4">
                          {project.live_url && project.live_url !== '#' && <Button asChild><a href={project.live_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4"/>View Live Project</a></Button>}
                          {project.github_url && <Button asChild variant="outline"><a href={project.github_url} target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-4 w-4"/>Source Code</a></Button>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </article>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default PortfolioDetailPage;