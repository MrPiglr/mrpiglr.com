import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';

const ServiceForm = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState(service);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const removeFeature = (index) => {
    if (formData.features.length <= 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const upsertData = { ...formData, features: formData.features.filter(f => f) };
    if (!upsertData.id) {
      delete upsertData.id;
    }

    const { error } = await supabase.from('consultancy_services').upsert(upsertData);

    if (error) {
      toast({ variant: 'destructive', title: 'Error saving service', description: error.message });
    } else {
      toast({ title: 'Service saved successfully' });
      onSave();
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category || ''} onChange={handleChange} placeholder="e.g., Development" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" value={formData.price || ''} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="price_description">Price Description</Label>
          <Input id="price_description" name="price_description" value={formData.price_description || ''} onChange={handleChange} placeholder="e.g., per hour" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Short Description</Label>
        <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} />
      </div>
       <div>
        <Label htmlFor="long_description">Long Description</Label>
        <Textarea id="long_description" name="long_description" value={formData.long_description || ''} onChange={handleChange} rows={5} />
      </div>
      <div>
        <Label>Features</Label>
        {(formData.features || []).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeFeature(index)} disabled={formData.features.length <= 1}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>Add Feature</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="is_featured" name="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))} />
        <Label htmlFor="is_featured">Featured</Label>
      </div>
      <div>
        <Label htmlFor="display_order">Display Order</Label>
        <Input id="display_order" name="display_order" type="number" value={formData.display_order || ''} onChange={handleChange} />
      </div>
      <DialogFooter className="sticky bottom-0 bg-background pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};


const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('consultancy_services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching services', description: error.message });
    } else {
      setServices(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleNewService = () => {
    setCurrentService({
      title: '',
      price: 0,
      price_description: '',
      description: '',
      long_description: '',
      category: '',
      features: [''],
      is_featured: false,
      display_order: services.length + 1,
    });
    setIsDialogOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService({ ...service, features: service.features || [''] });
    setIsDialogOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase.from('consultancy_services').delete().eq('id', serviceId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting service', description: error.message });
    } else {
      toast({ title: 'Service deleted successfully' });
      fetchServices();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Services</CardTitle>
        <Button onClick={handleNewService}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {services.map(service => (
              <Card key={service.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{service.title} {service.is_featured && <span className="text-xs text-primary font-normal">(Featured)</span>}</p>
                  <p className="text-sm text-muted-foreground">${service.price} / {service.price_description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditService(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteService(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentService?.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            {currentService && (
              <ServiceForm
                service={currentService}
                onSave={() => {
                  setIsDialogOpen(false);
                  setCurrentService(null);
                  fetchServices();
                }}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setCurrentService(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
    </Card>
  );
};

export default ServicesManager;