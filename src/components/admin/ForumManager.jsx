import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';

    const CategoryForm = ({ item, onSave, onCancel }) => {
        const [formData, setFormData] = useState(item || { name: '', description: '', display_order: 0 });
        const { toast } = useToast();

        useEffect(() => { setFormData(item || { name: '', description: '', display_order: 0 }); }, [item]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                let error;
                const dataToSave = { ...formData, display_order: Number(formData.display_order) };
                if (item?.id) {
                    ({ error } = await supabase.from('forum_categories').update(dataToSave).eq('id', item.id));
                } else {
                    ({ error } = await supabase.from('forum_categories').insert(dataToSave));
                }
                if (error) throw error;
                toast({ title: 'Success', description: 'Category saved.' });
                onSave();
            } catch (error) { toast({ variant: 'destructive', title: 'Error', description: error.message }); }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                <Textarea name="description" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <Input name="display_order" type="number" placeholder="Display Order" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: e.target.value })} />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        );
    };

    const ForumManager = () => {
        const [categories, setCategories] = useState([]);
        const [loading, setLoading] = useState(true);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const { toast } = useToast();

        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('forum_categories').select('*').order('display_order');
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else setCategories(data);
            setLoading(false);
        };

        useEffect(() => { fetchData(); }, []);

        const handleAddNew = () => { setEditingItem(null); setIsDialogOpen(true); };
        const handleEdit = (item) => { setEditingItem(item); setIsDialogOpen(true); };

        const handleDelete = async (id) => {
            if (window.confirm('Are you sure? Deleting a category will also delete all its posts.')) {
                const { error } = await supabase.from('forum_categories').delete().eq('id', id);
                if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
                else { toast({ title: 'Success', description: 'Category deleted.' }); fetchData(); }
            }
        };

        return (
            <div>
                <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Category</Button>
                {loading ? <Loader2 className="animate-spin" /> : (
                    <div className="space-y-4">
                        {categories.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                                <div><h3 className="font-bold">{item.name}</h3><p className="text-sm text-muted-foreground">{item.description}</p></div>
                                <div>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editingItem ? 'Edit Category' : 'Add New Category'}</DialogTitle></DialogHeader>
                        <CategoryForm item={editingItem} onSave={() => { setIsDialogOpen(false); fetchData(); }} onCancel={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    };

    export default ForumManager;