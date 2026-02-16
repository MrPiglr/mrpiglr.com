
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/components/ui/use-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { siteId } = useSite();
  const { toast } = useToast();

  const fetchUserProjects = useCallback(async () => {
    if (!siteId) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load projects. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [siteId, toast]);

  useEffect(() => {
    fetchUserProjects();
  }, [fetchUserProjects]);

  const createProject = async (projectData) => {
    if (!siteId) return { error: 'Site ID not found' };

    // Generate slug from title
    const slug = projectData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProject = {
      ...projectData,
      site_id: siteId,
      slug: slug || `project-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
      return { data, error: null };
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create project.",
      });
      return { data: null, error: err };
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
      return { data, error: null };
    } catch (err) {
      console.error('Error updating project:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update project.",
      });
      return { data: null, error: err };
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
      return { error: null };
    } catch (err) {
      console.error('Error deleting project:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete project.",
      });
      return { error: err };
    }
  };

  return {
    projects,
    loading,
    error,
    fetchUserProjects,
    createProject,
    updateProject,
    deleteProject
  };
};
