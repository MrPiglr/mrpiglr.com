import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, PlusCircle, Edit, Trash2, ShieldCheck, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const RoleManager = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingRole, setEditingRole] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes, usersRes] = await Promise.all([
                supabase.from('roles').select('*, role_permissions(permission_id)'),
                supabase.from('permissions').select('*').order('name'),
                supabase.from('profiles').select('id, username, user_roles(role_id)')
            ]);

            if (rolesRes.error) throw rolesRes.error;
            if (permsRes.error) throw permsRes.error;
            if (usersRes.error) throw usersRes.error;

            setRoles(rolesRes.data.map(r => ({ ...r, permissions: r.role_permissions.map(p => p.permission_id) })));
            setPermissions(permsRes.data);
            setUsers(usersRes.data.map(u => ({...u, roles: u.user_roles.map(ur => ur.role_id)})));

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to fetch data: ${error.message}` });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleSaveRole = async (e, role) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const description = formData.get('description');
        const assignedPermissions = permissions.filter(p => formData.has(p.id)).map(p => p.id);

        try {
            let roleId = role.id;
            // Upsert role
            if (role.id) {
                const { error } = await supabase.from('roles').update({ name, description }).eq('id', role.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('roles').insert({ name, description }).select().single();
                if (error) throw error;
                roleId = data.id;
            }

            // Sync permissions
            await supabase.from('role_permissions').delete().eq('role_id', roleId);
            if (assignedPermissions.length > 0) {
                const { error: permError } = await supabase.from('role_permissions').insert(
                    assignedPermissions.map(permission_id => ({ role_id: roleId, permission_id }))
                );
                if (permError) throw permError;
            }

            toast({ title: 'Success', description: 'Role saved successfully.' });
            await fetchData();
            setEditingRole(null);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };
    
    const handleDeleteRole = async (roleId) => {
        if (!window.confirm('Are you sure? This will remove the role from all users.')) return;
        try {
            await supabase.from('user_roles').delete().eq('role_id', roleId);
            await supabase.from('role_permissions').delete().eq('role_id', roleId);
            await supabase.from('roles').delete().eq('id', roleId);
            toast({ title: 'Success', description: 'Role deleted.' });
            await fetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleUserRoleChange = async (userId, newRoleIds) => {
        try {
            await supabase.from('user_roles').delete().eq('user_id', userId);
            if (newRoleIds.length > 0) {
                const { error } = await supabase.from('user_roles').insert(
                    newRoleIds.map(role_id => ({ user_id: userId, role_id }))
                );
                if (error) throw error;
            }
            toast({ title: 'Success', description: 'User roles updated.' });
            await fetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to update user roles: ${error.message}` });
        }
    };

    if (loading) return <div className="flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Role Management</CardTitle>
                        <Dialog open={editingRole !== null} onOpenChange={(open) => !open && setEditingRole(null)}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setEditingRole({})}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create Role
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{editingRole?.id ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                                </DialogHeader>
                                {editingRole && (
                                    <form onSubmit={(e) => handleSaveRole(e, editingRole)} className="space-y-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="name">Role Name</Label>
                                            <Input id="name" name="name" defaultValue={editingRole.name} required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea id="description" name="description" defaultValue={editingRole.description} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Permissions</Label>
                                            <div className="max-h-60 overflow-y-auto space-y-2 rounded-md border p-4">
                                                {permissions.map(p => (
                                                    <div key={p.id} className="flex items-center space-x-2">
                                                        <Checkbox id={p.id} name={p.id} defaultChecked={editingRole.permissions?.includes(p.id)} />
                                                        <label htmlFor={p.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {p.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setEditingRole(null)}>Cancel</Button>
                                            <Button type="submit">Save Role</Button>
                                        </DialogFooter>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                    <CardDescription>Define roles and assign permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell>{role.permissions?.length || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingRole(role)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User Roles</CardTitle>
                    <CardDescription>Assign roles to individual users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Roles</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>
                                        <Select
                                            onValueChange={(value) => handleUserRoleChange(user.id, [value])}
                                            defaultValue={user.roles.length > 0 ? user.roles[0] : ""}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map(role => (
                                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleManager;