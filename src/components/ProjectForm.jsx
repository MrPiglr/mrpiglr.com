
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Game Development',
  'Mobile App',
  'UI/UX Design',
  'Data Science',
  'Other'
];

const ProjectForm = ({ isOpen, onClose, onSubmit, initialData = null, isEditing = false }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image_url: '',
    live_url: '',
    github_url: '',
    category: 'Web Development'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        cover_image_url: initialData.cover_image_url || '',
        live_url: initialData.live_url || '',
        github_url: initialData.github_url || '',
        category: initialData.tags?.[0] || 'Web Development'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cover_image_url: '',
        live_url: '',
        github_url: '',
        category: 'Web Development'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert category to tags array
    const submissionData = {
      ...formData,
      tags: [formData.category]
    };
    // Remove category field as it's not in DB
    delete submissionData.category;

    try {
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Project Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. E-Commerce Platform"
              required
              className="bg-black/50 border-gray-700 text-white focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-black/50 border-gray-700 text-white focus:ring-purple-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="focus:bg-purple-900/50 focus:text-white cursor-pointer">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="live_url" className="text-gray-300">Live URL</Label>
              <Input
                id="live_url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                placeholder="https://..."
                className="bg-black/50 border-gray-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="bg-black/50 border-gray-700 text-white focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url" className="text-gray-300">Image URL</Label>
            <Input
              id="cover_image_url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="bg-black/50 border-gray-700 text-white focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the project..."
              className="bg-black/50 border-gray-700 text-white focus:border-purple-500 min-h-[100px]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
