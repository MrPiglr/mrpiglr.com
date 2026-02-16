import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';

const EventForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', start_time: '', end_time: '', event_type: '', stream_url: '', image_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const formatForInput = (dateStr) => {
            if (!dateStr) return '';
            try {
                // Handles both ISO strings and existing datetime-local values
                return format(parseISO(dateStr), "yyyy-MM-dd'T'HH:mm");
            } catch (error) {
                return dateStr; // If already in correct format
            }
        };

        setFormData(item ? {
            ...item,
            start_time: formatForInput(item.start_time),
            end_time: formatForInput(item.end_time),
        } : {
            title: '', description: '', start_time: '', end_time: '', event_type: '', stream_url: '', image_url: ''
        });
    }, [item]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let error;
            const dataToSave = { 
                ...formData, 
                start_time: new Date(formData.start_time).toISOString(),
                end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
            };

            if (item?.id) {
                ({ error } = await supabase.from('mrpiglr_events').update(dataToSave).eq('id', item.id));
            } else {
                ({ error } = await supabase.from('mrpiglr_events').insert(dataToSave));
            }

            if (error) throw error;
            toast({ title: 'Success', description: 'Event saved.' });
            onSave();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            <Input name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} required />
            <Input name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} />
            <Input name="event_type" placeholder="Event Type (e.g., Live Stream)" value={formData.event_type} onChange={handleChange} />
            <Input name="stream_url" placeholder="Stream URL" value={formData.stream_url} onChange={handleChange} />
            <Input name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} />
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
            </DialogFooter>
        </form>
    );
};

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { toast } = useToast();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('mrpiglr_events').select('*').order('start_time', { ascending: false });
        if (error) toast({ variant: 'destructive', title: 'Error fetching events', description: error.message });
        else setEvents(data);
        setLoading(false);
    },[toast]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleAddNew = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            const { error } = await supabase.from('mrpiglr_events').delete().eq('id', id);
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else {
                toast({ title: 'Success', description: 'Event deleted.' });
                fetchEvents();
            }
        }
    };

    return (
        <div>
            <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Event</Button>
            {loading ? <Loader2 className="animate-spin" /> : (
                <div className="space-y-4">
                    {events.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                            <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-muted-foreground">{format(new Date(item.start_time), 'PPpp')}</p></div>
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
                    <DialogHeader><DialogTitle>{editingItem ? 'Edit Event' : 'Add New Event'}</DialogTitle></DialogHeader>
                    <EventForm item={editingItem} onSave={() => { setIsDialogOpen(false); fetchEvents(); }} onCancel={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EventManager;