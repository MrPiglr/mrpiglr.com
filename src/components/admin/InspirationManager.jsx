import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { PlusCircle, Edit, Trash2, Loader2, Search } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';

    const InspirationForm = ({ item, onSave, onCancel }) => {
        const [formData, setFormData] = useState(item || { title: '', description: '', location_name: '', latitude: '', longitude: '', image_url: '', category: '' });
        const [address, setAddress] = useState('');
        const [isGeocoding, setIsGeocoding] = useState(false);
        const { toast } = useToast();

        useEffect(() => { 
            setFormData(item || { title: '', description: '', location_name: '', latitude: '', longitude: '', image_url: '', category: '' }); 
            setAddress(item?.location_name || '');
        }, [item]);

        const handleGeocode = async () => {
            if (!address) {
                toast({ variant: 'destructive', title: 'Error', description: 'Please enter an address or place name.' });
                return;
            }
            setIsGeocoding(true);
            try {
                const { data, error } = await supabase.functions.invoke('geocode-address', {
                    body: JSON.stringify({ address }),
                });

                if (error) throw error;
                if (data.error) throw new Error(data.error);

                setFormData(prev => ({
                    ...prev,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    location_name: data.location_name
                }));
                toast({ title: 'Location Found!', description: `Coordinates set for ${data.location_name}` });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Geocoding Error', description: error.message });
            } finally {
                setIsGeocoding(false);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!formData.latitude || !formData.longitude) {
                toast({ variant: 'destructive', title: 'Error', description: 'Please find coordinates for an address before saving.' });
                return;
            }
            try {
                let error;
                const dataToSave = { 
                    ...formData, 
                    latitude: parseFloat(formData.latitude), 
                    longitude: parseFloat(formData.longitude),
                };
                
                delete dataToSave.id;
                delete dataToSave.created_at;

                if (item?.id) {
                    ({ error } = await supabase.from('inspirations').update(dataToSave).eq('id', item.id));
                } else {
                    ({ error } = await supabase.from('inspirations').insert(dataToSave));
                }
                if (error) throw error;
                toast({ title: 'Success', description: 'Inspiration saved.' });
                onSave();
            } catch (error) { toast({ variant: 'destructive', title: 'Error', description: error.message }); }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="title" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <Textarea name="description" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex gap-2">
                        <Input placeholder="Address or Place Name" value={address} onChange={e => setAddress(e.target.value)} />
                        <Button type="button" onClick={handleGeocode} disabled={isGeocoding}>
                            {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>
                    {formData.location_name && <p className="text-xs text-muted-foreground">Found: {formData.location_name}</p>}
                </div>

                <Input name="image_url" placeholder="Image URL" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                <Input name="category" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        );
    };

    const InspirationManager = () => {
        const [inspirations, setInspirations] = useState([]);
        const [loading, setLoading] = useState(true);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [editingItem, setEditingItem] = useState(null);
        const { toast } = useToast();

        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('inspirations').select('*');
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else setInspirations(data);
            setLoading(false);
        };

        useEffect(() => { fetchData(); }, [toast]);

        const handleAddNew = () => { setEditingItem(null); setIsDialogOpen(true); };
        const handleEdit = (item) => { setEditingItem(item); setIsDialogOpen(true); };

        const handleDelete = async (id) => {
            if (window.confirm('Are you sure?')) {
                const { error } = await supabase.from('inspirations').delete().eq('id', id);
                if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
                else { toast({ title: 'Success', description: 'Inspiration deleted.' }); fetchData(); }
            }
        };

        return (
            <div>
                <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Inspiration</Button>
                {loading ? <Loader2 className="animate-spin" /> : (
                    <div className="space-y-4">
                        {inspirations.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                                <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.location_name}</p></div>
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
                        <DialogHeader><DialogTitle>{editingItem ? 'Edit Inspiration' : 'Add New Inspiration'}</DialogTitle></DialogHeader>
                        <InspirationForm item={editingItem} onSave={() => { setIsDialogOpen(false); fetchData(); }} onCancel={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    };

    export default InspirationManager;