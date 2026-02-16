import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PlusCircle, Edit, Trash2, Award } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BadgeSection = ({ badgeType, siteId }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingBadge, setEditingBadge] = useState(null);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const isSiteBadge = badgeType === 'site';
    const badgeTableName = isSiteBadge ? 'mrpiglr_site_badges' : 'aethex_badges';
    const userBadgeTableName = isSiteBadge ? 'user_mrpiglr_site_badges' : 'user_aethex_badges';

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let badgeQuery = supabase.from(badgeTableName).select('*');
            
            if (isSiteBadge) {
              badgeQuery = badgeQuery.order('category').order('tier');
            } else {
              badgeQuery = badgeQuery.order('name');
            }
            
            const {data: usersData, error: usersError} = await supabase.rpc('get_all_users_for_site', { p_site_id: siteId });
            if(usersError) throw usersError;

            const userIds = usersData.map(u => u.id);

            const [badgesRes, userBadgesRes] = await Promise.all([
                badgeQuery,
                supabase.from(userBadgeTableName).select('user_id, badge_id').in('user_id', userIds)
            ]);

            if (badgesRes.error) throw badgesRes.error;
            if (userBadgesRes.error) throw userBadgesRes.error;
            
            const usersWithBadges = usersData.map(user => ({
                ...user,
                user_badges: userBadgesRes.data.filter(ub => ub.user_id === user.id)
            }));

            setBadges(badgesRes.data);
            setUsers(usersWithBadges);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to fetch data: ${error.message}` });
        } finally {
            setLoading(false);
        }
    }, [toast, badgeTableName, userBadgeTableName, siteId, isSiteBadge]);

    useEffect(() => {
        if (!siteId) {
            setLoading(false);
            return;
        }
        fetchData();
    }, [fetchData, siteId]);
    
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const baseBadgeData = { 
            name: formData.get('name'), 
            description: formData.get('description'), 
            icon: formData.get('icon'), 
            color: formData.get('color'),
        };

        const badgeData = isSiteBadge ? {
            ...baseBadgeData,
            category: formData.get('category'),
            tier: Number(formData.get('tier')),
            required_value: Number(formData.get('required_value')),
        } : baseBadgeData;


        try {
            let error;
            if (editingBadge.id) {
                ({ error } = await supabase.from(badgeTableName).update(badgeData).eq('id', editingBadge.id));
            } else {
                ({ error } = await supabase.from(badgeTableName).insert(badgeData).select());
            }
            if (error) throw error;
            toast({ title: 'Success', description: `Badge ${editingBadge.id ? 'updated' : 'created'}` });
            await fetchData();
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            setEditingBadge(null);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleDelete = async (badgeId) => {
        if (!window.confirm('Are you sure you want to delete this badge? This will also remove it from all users.')) return;
        try {
            await supabase.from(userBadgeTableName).delete().eq('badge_id', badgeId);
            const { error } = await supabase.from(badgeTableName).delete().eq('id', badgeId);
            if (error) throw error;
            toast({ title: 'Success', description: 'Badge deleted.' });
            await fetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleToggle = async (userId, badgeId, hasBadge) => {
        try {
            let error;
            if (hasBadge) {
                ({ error } = await supabase.from(userBadgeTableName).delete().match({ user_id: userId, badge_id: badgeId }));
            } else {
                ({ error } = await supabase.from(userBadgeTableName).insert({ user_id: userId, badge_id: badgeId }));
            }
            if (error) throw error;
            toast({ title: 'Success', description: `Badge ${hasBadge ? 'revoked' : 'granted'}.` });
            await fetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };
    
    const groupedBadges = badges.reduce((acc, badge) => {
        const category = isSiteBadge ? (badge.category || 'Uncategorized') : 'AeThex Network';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(badge);
        return acc;
    }, {});


    const BadgeForm = ({ badge = {}, onSubmit, onCancel }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            {badge.id && <input type="hidden" name="id" value={badge.id} />}
            <div><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={badge.name || ''} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={badge.description || ''} /></div>
            <div><Label htmlFor="icon">Icon (Lucide Name)</Label><Input id="icon" name="icon" placeholder="e.g., Star" defaultValue={badge.icon || ''} /></div>
            <div><Label htmlFor="color">Color</Label><Input id="color" name="color" type="color" defaultValue={badge.color || '#ffffff'} /></div>
            {isSiteBadge && (
                <>
                     <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" placeholder="e.g., Progression" defaultValue={badge.category || ''} />
                    </div>
                    <div><Label htmlFor="tier">Tier</Label><Input id="tier" name="tier" type="number" defaultValue={badge.tier || 0} /></div>
                    <div><Label htmlFor="required_value">Required Value</Label><Input id="required_value" name="required_value" type="number" placeholder="e.g., Level or Days" defaultValue={badge.required_value || 0} /></div>
                </>
            )}
            <DialogFooter>
                <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
        </form>
    );

    if (loading) return <div className="flex justify-center items-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (!siteId) return <div className="text-center text-muted-foreground py-8"><p>Site context could not be loaded.</p></div>

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Badge Definitions</CardTitle>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingBadge({}); setCreateDialogOpen(true); }}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create Badge
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Create New Badge</DialogTitle></DialogHeader>
                                <BadgeForm onSubmit={handleSave} onCancel={() => setCreateDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(groupedBadges).map(([category, badgeList]) => (
                            <div key={category}>
                                <h3 className="text-lg font-semibold mb-2 text-primary">{category}</h3>
                                <div className="space-y-2 border-l-2 border-border pl-4">
                                {badgeList.map(badge => (
                                    <div key={badge.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5" style={{ color: badge.color }} />
                                            <div>
                                                <p className="font-semibold">{badge.name}{isSiteBadge && ` (Tier ${badge.tier})`}</p>
                                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                                                {isSiteBadge && badge.required_value > 0 && <p className="text-xs text-blue-400">Requires: {badge.required_value}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Dialog open={editingBadge?.id === badge.id && isEditDialogOpen} onOpenChange={(isOpen) => { if(!isOpen) setEditingBadge(null); setEditDialogOpen(isOpen); }}>
                                                <DialogTrigger asChild><Button variant="ghost" size="icon" onClick={() => { setEditingBadge(badge); setEditDialogOpen(true); }}><Edit className="w-4 h-4" /></Button></DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Edit Badge</DialogTitle></DialogHeader>
                                                    <BadgeForm badge={badge} onSubmit={handleSave} onCancel={() => setEditDialogOpen(false)} />
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(badge.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Manage User Badges</CardTitle><CardDescription>Assign or revoke badges for each user.</CardDescription></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {users.map(user => {
                            const userBadgeIds = user.user_badges.map(ub => ub.badge_id) || [];
                            return (
                                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                    <p className="font-semibold">{user.username}</p>
                                    <Dialog><DialogTrigger asChild><Button variant="outline">Manage Badges ({userBadgeIds.length})</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Manage Badges for {user.username}</DialogTitle></DialogHeader>
                                            <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
                                                {badges.map(badge => {
                                                    const hasBadge = userBadgeIds.includes(badge.id);
                                                    return (
                                                        <div key={badge.id} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2"><Award className="w-5 h-5" style={{ color: badge.color }} /><span>{badge.name}</span></div>
                                                            <Button variant={hasBadge ? 'secondary' : 'outline'} size="sm" onClick={() => handleToggle(user.id, badge.id, hasBadge)}>
                                                                {hasBadge ? 'Revoke' : 'Grant'}
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <DialogFooter><DialogClose asChild><Button>Close</Button></DialogClose></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


const BadgeManager = () => {
    const { siteId, loading: siteLoading } = useSite();

    if (siteLoading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <Tabs defaultValue="site_badges" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="site_badges">MrPiglr Site Badges</TabsTrigger>
                <TabsTrigger value="aethex_badges">AeThex Network Badges</TabsTrigger>
            </TabsList>
            <TabsContent value="site_badges" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>MrPiglr Site Badges</CardTitle>
                        <CardDescription>Exclusive badges for your personal site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BadgeSection badgeType="site" siteId={siteId} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="aethex_badges" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>AeThex Network Badges</CardTitle>
                        <CardDescription>Global badges from the AeThex ecosystem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BadgeSection badgeType="aethex" siteId={siteId} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default BadgeManager;