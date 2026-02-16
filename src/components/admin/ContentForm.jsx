import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';

const ContentForm = ({ item, onSave, onCancel, dataType }) => {
  const [formData, setFormData] = useState(
    item || {
      title: '',
      description: '',
      category: '',
      tags: [],
      image_prompt: '',
      long_description: '',
      content: '',
      purchase_links: '[]',
      release_date: '',
      is_free: false,
      rating: 0,
      price: 0,
      stock: 0,
      links: '[]'
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { addData, updateData } = useAppContext();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const contentData = { ...formData };
    
    // Convert tags from string to array
    if (typeof contentData.tags === 'string') {
      contentData.tags = contentData.tags.split(',').map(tag => tag.trim());
    }

    // Convert links from string to JSON
    if (typeof contentData.links === 'string') {
      try {
        contentData.links = JSON.parse(contentData.links);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Links field has invalid JSON format.' });
        setIsLoading(false);
        return;
      }
    }

    // Convert purchase_links from string to JSON for books
    if (dataType === 'books' && typeof contentData.purchase_links === 'string') {
       try {
        contentData.purchase_links = JSON.parse(contentData.purchase_links);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Purchase Links field has invalid JSON format.' });
        setIsLoading(false);
        return;
      }
    }
    
    // Convert numeric fields from string
    if (contentData.rating) contentData.rating = parseFloat(contentData.rating);
    if (contentData.price) contentData.price = parseFloat(contentData.price);
    if (contentData.stock) contentData.stock = parseInt(contentData.stock, 10);
    

    try {
      if (item) {
        await updateData(dataType, contentData);
        toast({ title: 'Success', description: 'Content updated successfully.' });
      } else {
        await addData(dataType, contentData);
        toast({ title: 'Success', description: 'Content added successfully.' });
      }
      onSave();
    } catch (error) {
      console.error(`Failed to save ${dataType}:`, error)
      toast({ variant: 'destructive', title: 'Error', description: `Failed to save content. ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Short Description (for cards)</Label>
        <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required />
      </div>
       <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="image_prompt">Image Prompt (for AI generation)</Label>
        <Input id="image_prompt" name="image_prompt" value={formData.image_prompt || ''} onChange={handleChange} placeholder="e.g., A neon-lit abstract puzzle room" />
      </div>

      {dataType === 'creations' && (
        <div>
          <Label htmlFor="links">Links (JSON format)</Label>
          <Textarea id="links" name="links" value={typeof formData.links === 'object' ? JSON.stringify(formData.links, null, 2) : (formData.links || '[]')} onChange={handleChange} />
        </div>
      )}

      {dataType === 'books' && (
        <>
          <div>
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea id="long_description" name="long_description" value={formData.long_description || ''} onChange={handleChange} rows={5} />
          </div>
          <div>
            <Label htmlFor="content">Book Content (HTML allowed)</Label>
            <Textarea id="content" name="content" value={formData.content || ''} onChange={handleChange} rows={15} />
          </div>
          <div>
            <Label htmlFor="purchase_links">Purchase Links (JSON format)</Label>
            <Textarea id="purchase_links" name="purchase_links" value={typeof formData.purchase_links === 'object' ? JSON.stringify(formData.purchase_links, null, 2) : (formData.purchase_links || '[]')} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="release_date">Release Date</Label>
            <Input type="date" id="release_date" name="release_date" value={formData.release_date || ''} onChange={handleChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Input type="checkbox" id="is_free" name="is_free" checked={formData.is_free || false} onChange={handleChange} className="h-4 w-4" />
            <Label htmlFor="is_free">Is Free</Label>
          </div>
           <div>
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input type="number" step="0.1" id="rating" name="rating" value={formData.rating || 0} onChange={handleChange} />
          </div>
        </>
      )}

      {dataType === 'products' && (
        <>
           <div>
            <Label htmlFor="price">Price</Label>
            <Input type="number" step="0.01" id="price" name="price" value={formData.price || 0} onChange={handleChange} />
          </div>
           <div>
            <Label htmlFor="stock">Stock</Label>
            <Input type="number" id="stock" name="stock" value={formData.stock || 0} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input type="number" step="0.1" id="rating" name="rating" value={formData.rating || 0} onChange={handleChange} />
          </div>
        </>
      )}

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

export default ContentForm;