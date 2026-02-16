import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, Play, Pause } from 'lucide-react';
    import { Input } from '@/components/ui/input';

    const NowPlayingManager = () => {
        const [tracks, setTracks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [newTrack, setNewTrack] = useState({ track_title: '', artist_name: '', album_art_url: '', track_url: '' });
        const { toast } = useToast();

        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('now_playing').select('*').order('created_at', { ascending: false });
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else setTracks(data);
            setLoading(false);
        };

        useEffect(() => { fetchData(); }, []);

        const handleAddTrack = async () => {
            const { data, error } = await supabase.from('now_playing').insert(newTrack).select().single();
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else {
                toast({ title: 'Success', description: 'Track added.' });
                await handleSetActive(data.id);
                setNewTrack({ track_title: '', artist_name: '', album_art_url: '', track_url: '' });
            }
        };

        const handleSetActive = async (trackId) => {
            // Deactivate all others
            const { error: deactivateError } = await supabase.from('now_playing').update({ is_active: false }).neq('id', trackId);
            if (deactivateError) {
                toast({ variant: 'destructive', title: 'Error deactivating tracks', description: deactivateError.message });
            }
            
            // Activate the selected one
            const { error: activateError } = await supabase.from('now_playing').update({ is_active: true }).eq('id', trackId);
            if (activateError) {
                toast({ variant: 'destructive', title: 'Error activating track', description: activateError.message });
            } else {
                toast({ title: 'Success', description: 'Active track updated.' });
                fetchData();
            }
        };
        
         const handleDeactivate = async (trackId) => {
            const { error } = await supabase.from('now_playing').update({ is_active: false }).eq('id', trackId);
            if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
            else {
                toast({ title: 'Success', description: 'Track deactivated.' });
                fetchData();
            }
        };


        return (
            <div>
                 <div className="space-y-2 mb-6 p-4 border rounded-lg">
                    <h3 className="font-bold">Add New Track</h3>
                    <Input placeholder="Track Title" value={newTrack.track_title} onChange={e => setNewTrack({...newTrack, track_title: e.target.value})} />
                    <Input placeholder="Artist Name" value={newTrack.artist_name} onChange={e => setNewTrack({...newTrack, artist_name: e.target.value})} />
                    <Input placeholder="Album Art URL" value={newTrack.album_art_url} onChange={e => setNewTrack({...newTrack, album_art_url: e.target.value})} />
                    <Input placeholder="Track URL" value={newTrack.track_url} onChange={e => setNewTrack({...newTrack, track_url: e.target.value})} />
                    <Button onClick={handleAddTrack}>Add and Set Active</Button>
                </div>
                {loading ? <Loader2 className="animate-spin" /> : (
                    <div className="space-y-4">
                        {tracks.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                                <div className="flex items-center gap-4">
                                  <img src={item.album_art_url} alt={item.track_title} className="w-12 h-12 rounded-md"/>
                                  <div>
                                    <h3 className="font-bold">{item.track_title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.artist_name}</p>
                                  </div>
                                </div>
                                <Button onClick={() => item.is_active ? handleDeactivate(item.id) : handleSetActive(item.id)} variant={item.is_active ? "secondary" : "outline"} size="icon">
                                    {item.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    export default NowPlayingManager;