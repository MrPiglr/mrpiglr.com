import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

const FanArtSubmissionForm = ({ setOpen, onSubmissionSuccess }) => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image under 5MB.' });
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
                toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please select a JPG, PNG, or GIF image.' });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !profile) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to submit.' });
            return;
        }
        if (!file) {
            toast({ variant: 'destructive', title: 'No file selected', description: 'Please select an image to upload.' });
            return;
        }
        if (!title) {
            toast({ variant: 'destructive', title: 'Title is required' });
            return;
        }

        setLoading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('fan-art')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('fan-art').getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from('fan_art')
                .insert({
                    title,
                    description,
                    image_url: publicUrl,
                    user_id: user.id,
                    username: profile.username,
                    is_approved: false
                });

            if (insertError) throw insertError;

            toast({ title: 'Success!', description: 'Your fan art has been submitted for review.' });
            if (onSubmissionSuccess) {
                onSubmissionSuccess();
            }
            setOpen(false);

        } catch (error) {
            toast({ variant: 'destructive', title: 'Submission Failed', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Creation" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A little about your artwork..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="file-upload">Artwork Image</Label>
                <div 
                    className="relative flex justify-center items-center h-40 w-full rounded-md border-2 border-dashed border-input bg-transparent cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current.click()}
                >
                    <Input id="file-upload" ref={fileInputRef} type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                    {!file ? (
                        <div className="text-center text-muted-foreground">
                            <UploadCloud className="mx-auto h-8 w-8 mb-2" />
                            <p>Click to browse or drag & drop</p>
                            <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    ) : (
                         <div className="text-center text-green-500">
                             <CheckCircle className="mx-auto h-8 w-8 mb-2" />
                             <p className="font-semibold">{file.name}</p>
                             <p className="text-xs">Ready to upload!</p>
                         </div>
                    )}
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit for Review
                </Button>
            </DialogFooter>
        </form>
    );
};

export default FanArtSubmissionForm;