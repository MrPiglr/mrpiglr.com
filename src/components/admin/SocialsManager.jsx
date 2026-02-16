import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { PlusCircle, Edit, Trash2, Loader2, Link as LinkIcon } from 'lucide-react';
import SocialLinkForm from '@/components/admin/SocialLinkForm';
import { getIcon } from '@/lib/iconMap';

const SocialsManager = () => {
  const { data, loading, deleteData } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      try {
        await deleteData('socials', id);
        toast({ title: 'Success', description: 'Social link deleted.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete social link.' });
      }
    }
  };

  const renderSocialsList = () => {
    const socialLinks = data.social_links || [];
    if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (socialLinks.length === 0) return <p className="text-muted-foreground text-center p-8">No social links yet.</p>;

    return (
      <div className="space-y-4">
        {socialLinks.map(link => {
          const Icon = getIcon(link.icon);
          return (
            <div key={link.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-4">
                {Icon ? <Icon className="h-6 w-6 text-primary" /> : <LinkIcon className="h-6 w-6 text-primary" />}
                <div>
                  <h3 className="font-bold">{link.name}</h3>
                  <p className="text-sm text-muted-foreground">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(link)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Social Link</Button>
      {renderSocialsList()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Social Link' : 'Add New Social Link'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details for this social link.' : 'Fill out the form to add a new social link.'}
            </DialogDescription>
          </DialogHeader>
          <SocialLinkForm
            item={editingItem}
            onSave={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialsManager;