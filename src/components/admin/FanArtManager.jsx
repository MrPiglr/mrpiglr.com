import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, XCircle, Loader2, Star, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FanArtManager = () => {
    const { toast } = useToast();
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mutatingId, setMutatingId] = useState(null);

    const fetchFanArtSubmissions = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('fan_art').select('*').order('created_at', { ascending: false });
        if (error) {
            toast({ variant: 'destructive', title: 'Error fetching submissions', description: error.message });
            setSubmissions([]);
        } else {
            setSubmissions(data);
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchFanArtSubmissions();
    }, [fetchFanArtSubmissions]);

    const handleMutation = async (id, mutationFn, successMessage) => {
        setMutatingId(id);
        try {
            const { error } = await mutationFn();
            if (error) throw error;
            toast({ title: 'Success', description: successMessage });
            fetchFanArtSubmissions();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setMutatingId(null);
        }
    };

    const updateSubmissionStatus = (id, is_approved) => {
        handleMutation(
            id,
            () => supabase.functions.invoke('approve-fan-art', {
                body: { submission_id: id, is_approved },
            }),
            'Submission status updated.'
        );
    };

    const featureSubmission = (id) => {
        handleMutation(id, async () => {
            const { error: unfeatureError } = await supabase.from('fan_art').update({ is_featured: false }).eq('is_featured', true);
            if (unfeatureError) throw new Error(`Failed to unfeature previous art: ${unfeatureError.message}`);
            
            const { error: featureError } = await supabase.from('fan_art').update({ is_featured: true, is_approved: true }).eq('id', id);
            if (featureError) throw new Error(`Failed to feature art: ${featureError.message}`);
            
            return {};
        }, 'Artwork has been featured.');
    };

    const deleteSubmission = (id, imageUrl) => {
        handleMutation(id, async () => {
            const { error: deleteError } = await supabase.from('fan_art').delete().eq('id', id);
            if (deleteError) throw new Error(`DB delete failed: ${deleteError.message}`);
            
            try {
                const fileName = imageUrl.split('/').pop();
                if(fileName) {
                    const { error: storageError } = await supabase.storage.from('fan-art').remove([fileName]);
                    if (storageError) console.warn(`Could not delete from storage, but DB record was removed: ${storageError.message}`);
                }
            } catch(e) {
                console.warn('Could not parse image URL to delete from storage.');
            }
             return {};
        }, 'Submission deleted.');
    };

    const getStatus = (item) => {
        if (item.is_featured) return { text: 'Featured', color: 'text-primary' };
        if (item.is_approved) return { text: 'Approved', color: 'text-green-500' };
        return { text: 'Pending', color: 'text-yellow-500' };
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fan Art Submissions</CardTitle>
                <CardDescription>Review, approve, and feature community artwork.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {submissions?.map(item => {
                            const status = getStatus(item);
                            const isItemMutating = mutatingId === item.id;
                            return (
                                <Card key={item.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="aspect-video bg-secondary rounded-md overflow-hidden">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">by {item.username || 'Anonymous'}</p>
                                        <p className="mt-2 text-sm">{item.description}</p>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-start gap-4">
                                        <span className={`font-bold ${status.color}`}>{status.text}</span>
                                        <div className="flex flex-wrap gap-2 w-full">
                                            {isItemMutating ? (
                                                <Button size="sm" disabled className="w-full">
                                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                                </Button>
                                            ) : (
                                                <>
                                                    {!item.is_featured && (
                                                        <Button size="sm" onClick={() => featureSubmission(item.id)} className="bg-primary/20 text-primary hover:bg-primary/30">
                                                            <Star className="h-4 w-4 mr-2" />Feature
                                                        </Button>
                                                    )}
                                                    {item.is_approved === false && <Button size="sm" onClick={() => updateSubmissionStatus(item.id, true)} variant="outline"><CheckCircle2 className="h-4 w-4 mr-2" />Approve</Button>}
                                                    {item.is_approved === true && !item.is_featured && <Button size="sm" onClick={() => updateSubmissionStatus(item.id, false)} variant="secondary"><XCircle className="h-4 w-4 mr-2" />Unapprove</Button>}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="destructive" className="ml-auto">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete the submission and its image file. This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => deleteSubmission(item.id, item.image_url)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
                 {!isLoading && submissions?.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        No submissions to review at this time.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FanArtManager;