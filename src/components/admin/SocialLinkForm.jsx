import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';
import { getIcon, iconList } from '@/lib/iconMap';

const SocialLinkForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    item || {
      name: '',
      url: '',
      icon: 'Link',
      display_order: 0,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { addData, updateData } = useAppContext();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSave = {
        name: formData.name,
        url: formData.url,
        icon: formData.icon,
        display_order: Number(formData.display_order) || 0,
        ...(item && item.id && { id: item.id })
      };

      if (item && item.id) {
        await updateData('socials', dataToSave);
        toast({ title: 'Success', description: 'Social link updated.' });
      } else {
        await addData('socials', dataToSave);
        toast({ title: 'Success', description: 'Social link added.' });
      }
      onSave();
    } catch (error) {
      console.error("Error saving social link:", error);
      toast({ variant: 'destructive', title: 'Error', description: `Failed to save social link. ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input id="url" name="url" value={formData.url} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Select name="icon" value={formData.icon} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {iconList.map(iconName => {
              const IconComponent = getIcon(iconName);
              return (
                <SelectItem key={iconName} value={iconName}>
                  <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
       <div>
        <Label htmlFor="display_order">Display Order</Label>
        <Input id="display_order" name="display_order" type="number" value={formData.display_order} onChange={handleChange} />
      </div>
      <DialogFooter className="pt-4">
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

export default SocialLinkForm;