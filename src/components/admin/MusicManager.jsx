import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { PlusCircle, Edit, Trash2, Loader2, Music } from 'lucide-react';
import MusicForm from '@/components/admin/MusicForm';

const MusicManager = () => {
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
    if (window.confirm('Are you sure you want to delete this track?')) {
      try {
        await deleteData('music', id);
        toast({ title: 'Success', description: 'Music track deleted successfully.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete music track.' });
      }
    }
  };

  const renderTrackList = () => {
    if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    const tracks = data.music || [];
    if (tracks.length === 0) return <p className="text-muted-foreground text-center p-8">No music tracks yet.</p>;

    return (
      <div className="space-y-4">
        {tracks.map(track => (
          <div key={track.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <Music className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-bold">{track.title}</h3>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(track)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(track.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Track</Button>
      {renderTrackList()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Track' : 'Add New Track'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details for this music track.' : 'Fill out the form to add a new music track.'}
            </DialogDescription>
          </DialogHeader>
          <MusicForm
            item={editingItem}
            onSave={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MusicManager;