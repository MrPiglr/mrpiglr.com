import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSite } from '@/contexts/SiteContext';
import AnimatedPage from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const DevExchangePage = () => {
  const { user } = useAuth();
  const { siteId, loadingSite } = useSite();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!siteId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch projects.',
        });
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    if (!loadingSite) {
      fetchProjects();
    }
  }, [siteId, loadingSite, toast]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !user || !siteId) return;

    const { data, error } = await supabase
      .from('projects')
      .insert([{ title: newProjectTitle, user_id: user.id, site_id: siteId, owner_id: user.id }])
      .select();

    if (error) {
      console.error('Error adding project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add project.',
      });
    } else if (data) {
      setProjects([data[0], ...projects]);
      setNewProjectTitle('');
      toast({
        title: 'Success',
        description: 'Project added!',
      });
    }
  };

  if (loading || loadingSite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading Dev Exchange...</p>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <Helmet>
        <title>Dev Exchange - MrPiglr</title>
        <meta name="description" content="Connect and collaborate on projects in the Dev Exchange." />
      </Helmet>
      <div className="container mx-auto py-24 px-6 min-h-screen">
        <motion.h1
          className="text-5xl font-bold mb-8 text-glow text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dev Exchange Projects
        </motion.h1>

        {user ? (
          <motion.form
            onSubmit={handleAddProject}
            className="mb-8 flex gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              type="text"
              placeholder="New project title..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Add Project</Button>
          </motion.form>
        ) : (
          <p className="text-center text-muted-foreground mb-8">Please sign in to add projects.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-secondary p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-muted-foreground">
                Created at: {new Date(project.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DevExchangePage;