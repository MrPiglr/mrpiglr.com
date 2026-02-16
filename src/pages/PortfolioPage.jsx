
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { Loader2, Search, Code2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProjects } from '@/hooks/useProjects';
import PortfolioProject from '@/components/PortfolioProject';
import ProjectForm from '@/components/ProjectForm';
import { generateBreadcrumbSchema } from '@/lib/jsonLdSchemas';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PortfolioPage = () => {
  const { user } = useAuth();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [allTags, setAllTags] = useState(['All']);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/portfolio`;
  const pageDescription = "Explore the digital creations, games, and experiments of MrPiglr.";

  // Assuming user is owner if logged in, since this is a personal portfolio site.
  // In a multi-user app, you'd check if user.id === siteOwnerId.
  const isOwner = !!user;

  useEffect(() => {
    // Extract unique tags for filter
    if (projects.length > 0) {
      const tags = new Set(['All']);
      projects.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    }
  }, [projects]);

  useEffect(() => {
    let result = projects;

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by Tag
    if (selectedTag !== 'All') {
      result = result.filter(p => p.tags && p.tags.includes(selectedTag));
    }

    setFilteredProjects(result);
  }, [searchQuery, selectedTag, projects]);

  const handleCreate = async (data) => {
    await createProject(data);
  };

  const handleUpdate = async (data) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
      setEditingProject(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete);
      setProjectToDelete(null);
      setIsDeleteAlertOpen(false);
    }
  };

  const openCreateModal = () => {
    if (!isOwner) {
      navigate('/login');
      return;
    }
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const openEditModal = (project) => {
    if (!isOwner) return;
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const openDeleteAlert = (id) => {
    if (!isOwner) return;
    setProjectToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <AnimatedPage>
      <Helmet>
        <title>Portfolio - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { label: "Home", url: "/" },
            { label: "Portfolio", url: "/portfolio" }
          ], baseUrl))}
        </script>
      </Helmet>

      <div className="min-h-screen bg-black text-white pb-20">
        {/* Header Section */}
        <div className="relative py-20 bg-gradient-to-b from-purple-900/20 to-black">
          <div className="container mx-auto px-6 text-center z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  PROJECT
                </span>
                _ARCHIVE
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-8">
                Digital experiments, full-stack applications, and game development projects.
              </p>
              
              {isOwner && (
                <Button 
                  onClick={openCreateModal}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-8 shadow-lg shadow-purple-900/30"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Project
                </Button>
              )}
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-20">
          
          {/* Controls Bar */}
          <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-md shadow-2xl mb-12 rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                {/* Search */}
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="pl-10 bg-black/50 border-gray-700 text-white focus:border-purple-500 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Tag Filters */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-2/3">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                        selectedTag === tag 
                          ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' 
                          : 'bg-black/40 border-gray-700 text-gray-400 hover:border-purple-500/50 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
             </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
              <Code2 className="w-16 h-16 mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 text-lg font-mono">NO_PROJECTS_FOUND</p>
              {isOwner ? (
                <Button 
                  variant="link" 
                  onClick={openCreateModal}
                  className="text-purple-400 mt-2"
                >
                  Create your first project
                </Button>
              ) : (
                <Button 
                  variant="link" 
                  onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
                  className="text-purple-400 mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <PortfolioProject 
                    key={project.id} 
                    project={project} 
                    layoutVariants={itemVariants}
                    onEdit={openEditModal}
                    onDelete={openDeleteAlert}
                    isOwner={isOwner}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProjectForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        initialData={editingProject}
        isEditing={!!editingProject}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the project from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AnimatedPage>
  );
};

export default PortfolioPage;
