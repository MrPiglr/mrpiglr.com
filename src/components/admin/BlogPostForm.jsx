import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const BlogPostForm = ({ post, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    tags: [],
    status: 'draft',
    image_url: '',
    published_at: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addData, updateData } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        status: post.status || 'draft',
        image_url: post.image_url || '',
        published_at: post.published_at ? post.published_at.substring(0, 16) : null,
        author_id: post.author_id,
        id: post.id,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        content: '',
        tags: [],
        status: 'draft',
        image_url: '',
        published_at: null,
      });
    }
  }, [post]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = { ...formData };
    if (!postData.author_id) {
        postData.author_id = user.id;
    }
    
    if (postData.status === 'published' && !postData.published_at) {
        postData.published_at = new Date().toISOString();
    } else if (postData.status === 'draft') {
        postData.published_at = null;
    }


    try {
      if (post) {
        await updateData('blog_posts', postData);
        toast({ title: 'Success', description: 'Blog post updated successfully.' });
      } else {
        await addData('blog_posts', postData);
        toast({ title: 'Success', description: 'Blog post created successfully.' });
      }
      onSave();
    } catch (error) {
      console.error(`Failed to save blog post:`, error)
      toast({ variant: 'destructive', title: 'Error', description: `Failed to save post. ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="content">Content (HTML allowed)</Label>
        <Textarea id="content" name="content" value={formData.content || ''} onChange={handleChange} rows={15} />
      </div>
       <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={handleStatusChange} value={formData.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" name="image_url" value={formData.image_url || ''} onChange={handleChange} placeholder="https://example.com/image.png" />
      </div>

      <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BlogPostForm;