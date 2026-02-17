import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const roleDescriptions = {
  'user': 'Basic member access - view content and participate in community',
  'admin': 'Full administrative access - manage all site content and users',
  'site_owner': 'Owner-level access - complete site control and configuration',
  'oversee': 'Moderator access - manage community content and enforce rules',
  'staff': 'Staff member - assist with site operations and user support',
};

const getRoleBadgeColor = (role) => {
  switch(role) {
    case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'site_owner': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'oversee': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'staff': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const RoleManager = ({ userId, currentRole, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole || 'user');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isOwnRole = user?.id === userId;

  const handleRoleChange = async () => {
    if (selectedRole === currentRole) {
      toast({
        description: 'No role change detected',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Role Updated',
        description: `Role changed to ${selectedRole}${isOwnRole ? ' - you may need to refresh to see changes' : ''}`,
      });

      onRoleChange?.(selectedRole);
    } catch (err) {
      console.error('Error updating role:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update role: ' + err.message,
      });
      setSelectedRole(currentRole);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Role</span>
          <Badge className={`${getRoleBadgeColor(currentRole)} border`}>
            {currentRole || 'user'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage your site access level and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOwnRole && (
          <Alert className="border-amber-500/30 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              Changing your own role will affect your access to the admin panel.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Current Role</label>
          <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="oversee">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="site_owner">Site Owner</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {roleDescriptions[selectedRole] || 'Select a role'}
          </p>
        </div>

        {selectedRole !== currentRole && (
          <div className="space-y-3 pt-4 border-t border-border">
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-200">
                You have unsaved changes
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleRoleChange} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Role Change'
              )}
            </Button>
          </div>
        )}

        <div className="mt-6 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
          <h4 className="text-sm font-semibold mb-2">Role Levels:</h4>
          <div className="space-y-1 text-xs text-gray-400">
            {Object.entries(roleDescriptions).map(([role, desc]) => (
              <div key={role} className="flex gap-2">
                <span className="w-20 font-medium text-gray-300">{role}:</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManager;
