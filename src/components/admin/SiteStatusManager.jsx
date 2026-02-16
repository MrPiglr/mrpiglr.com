import React from 'react';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, Wrench, Clock, Loader2 } from 'lucide-react';

const SiteStatusManager = () => {
  const { siteStatus, loading, updatePersonalSiteStatus } = useSite();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus) => {
    try {
      await updatePersonalSiteStatus(newStatus);
      toast({
        title: "Site Status Updated",
        description: `Site is now set to "${newStatus.replace('_', ' ')}".`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update site status.",
      });
    }
  };

  const statusOptions = [
    { value: 'live', label: 'Live', icon: Globe, description: 'Your site is fully accessible to visitors.' },
    { value: 'maintenance', label: 'Maintenance Mode', icon: Wrench, description: 'Visitors will see a maintenance page.' },
    { value: 'coming_soon', label: 'Coming Soon', icon: Clock, description: 'Visitors will see a coming soon page.' },
  ];

  if (loading) {
    return (
       <div className="bg-card p-6 rounded-lg border border-border flex items-center justify-center h-[280px]">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
       </div>
    )
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-xl font-bold mb-4">Site Status</h3>
      <RadioGroup
        value={siteStatus}
        onValueChange={handleStatusChange}
        className="space-y-4"
      >
        {statusOptions.map(option => (
          <div key={option.value} className="flex items-start gap-4 p-4 border border-border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
            <RadioGroupItem value={option.value} id={`status-${option.value}`} className="mt-1"/>
            <Label htmlFor={`status-${option.value}`} className="flex-grow cursor-pointer">
              <div className="flex items-center gap-2 font-bold text-foreground text-base uppercase tracking-normal">
                <option.icon className="h-5 w-5" />
                <span>{option.label}</span>
              </div>
              <p className="text-sm text-muted-foreground font-normal normal-case mt-1" style={{fontFamily: 'Inter', fontWeight: 400}}>{option.description}</p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SiteStatusManager;