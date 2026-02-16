import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PortfolioForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item || {
        title: '', slug: '', subtitle: '', description: '', content: { blocks: [] }, tags: [], project_date: '', live_url: '', github_url: '', cover_image_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const defaultState = {
            title: '', slug: '', subtitle: '', description: '', content: { blocks: [] }, tags: [], project_date: '', live_url: '', github_url: '', cover_image_url: ''
        };
        setFormData(item ? { ...defaultState, ...item } : defaultState);
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setFormData(prev => ({ ...prev, title: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
        } else if (name === 'content') {
            try {
                const parsedContent = JSON.parse(value);
                setFormData(prev => ({ ...prev, content: parsedContent }));
            } catch (e) {
                // Handle invalid JSON, maybe show a warning
                console.warn("Invalid JSON in content field");
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTagsChange = (e) => {
        setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let error;
            const dataToSave = { ...formData, tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(t => t.trim()) };

            if (item?.id) {
                ({ error } = await supabase.from('portfolio_projects').update(dataToSave).eq('id', item.id));
            } else {
                ({ error } = await supabase.from('portfolio_projects').insert(dataToSave));
            }
            if (error) throw error;
            toast({ title: 'Success', description: 'Project saved.' });
            onSave();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <Input name="slug" placeholder="URL Slug" value={formData.slug} onChange={handleChange} required />
            <Input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} />
            <Textarea name="description" placeholder="Short Description (for list view)" value={formData.description} onChange={handleChange} />
            <Textarea name="content" placeholder="Content (JSON format)" value={typeof formData.content === 'object' ? JSON.stringify(formData.content, null, 2) : formData.content} onChange={handleChange} rows={10} />
            <Input name="tags" placeholder="Tags (comma-separated)" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagsChange} />
            <Input name="project_date" type="date" value={formData.project_date} onChange={handleChange} />
            <Input name="live_url" placeholder="Live URL" value={formData.live_url} onChange={handleChange} />
            <Input name="github_url" placeholder="GitHub URL" value={formData.github_url} onChange={handleChange} />
            <Input name="cover_image_url" placeholder="Cover Image URL" value={formData.cover_image_url} onChange={handleChange} />
            <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
            </DialogFooter>
        </form>
    );
};

const PortfolioManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { toast } = useToast();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
        if (error) toast({ variant: 'destructive', title: 'Error fetching projects', description: error.message });
        else setProjects(data);
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

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
            const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else {
                toast({ title: 'Success', description: 'Project deleted.' });
                fetchProjects();
            }
        }
    };

    return (
        <div>
            <Button onClick={handleAddNew} className="mb-4"><PlusCircle className="mr-2 h-4 w-4" /> Add New Project</Button>
            {loading ? <Loader2 className="animate-spin" /> : (
                <div className="space-y-4">
                    {projects.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                            <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.subtitle}</p></div>
                            <div>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                    <DialogHeader><DialogTitle>{editingItem ? 'Edit Project' : 'Add New Project'}</DialogTitle></DialogHeader>
                    <PortfolioForm item={editingItem} onSave={() => { setIsDialogOpen(false); fetchProjects(); }} onCancel={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PortfolioManager;