import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { PlusCircle, Edit, Trash2, Loader2, BookOpen, Gamepad2, ShoppingBag } from 'lucide-react';
import ContentForm from '@/components/admin/ContentForm';

const ContentManager = ({ type, title }) => {
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
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteData(type, id);
        toast({ title: 'Success', description: `${title} item deleted successfully.` });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: `Failed to delete ${title} item.` });
      }
    }
  };

  const renderContentList = () => {
    const items = data[type] || [];
    if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (items.length === 0) return <p className="text-muted-foreground text-center p-8">No {title.toLowerCase()} yet.</p>;

    return (
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New {title}</Button>
      {renderContentList()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details for this item.' : `Fill out the form to add a new ${title.toLowerCase()} to your portfolio.`}
            </DialogDescription>
          </DialogHeader>
          <ContentForm
            item={editingItem}
            onSave={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
            dataType={type}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManager;