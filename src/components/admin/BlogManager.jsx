import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import BlogPostForm from '@/components/admin/BlogPostForm';

const BlogManager = () => {
  const { data, loading, deleteData } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const posts = data.blog_posts || [];

  const handleAddNew = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteData('blog_posts', id);
        toast({ title: 'Success', description: 'Blog post deleted successfully.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: `Failed to delete blog post. ${error.message}` });
      }
    }
  };

  const renderPostList = () => {
    if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (posts.length === 0) return <p className="text-muted-foreground text-center p-8">No blog posts yet.</p>;

    return (
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm text-muted-foreground">Status: <span className={post.status === 'published' ? 'text-green-400' : 'text-yellow-400'}>{post.status}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Post</Button>
      {renderPostList()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the details for this blog post.' : 'Fill out the form to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          <BlogPostForm
            post={editingPost}
            onSave={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;