import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const MusicForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    item || {
      title: '',
      artist: '',
      duration: '',
      youtube_id: '',
      description: '',
      image_prompt: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { addData, updateData } = useAppContext();
  const { toast } = useToast();
  const fetchTimeoutRef = useRef(null);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleFetchInfo = useCallback(async (videoId) => {
    if (!videoId) return;
    setIsFetching(true);
    try {
      const { data: videoDetails, error } = await supabase.functions.invoke('get-youtube-video-details', {
        body: { videoId },
      });

      if (error) throw new Error(error.message || 'Function invocation failed.');
      
      if(videoDetails.error) throw new Error(videoDetails.error);

      setFormData(prev => ({
        ...prev,
        title: videoDetails.title || '',
        artist: videoDetails.artist || '',
        description: videoDetails.description || '',
        duration: videoDetails.duration || '',
      }));
      toast({ title: 'Success', description: 'Track information fetched successfully.' });

    } catch (error) {
      console.error("Failed to fetch YouTube info:", error);
      toast({ variant: 'destructive', title: 'Fetch Error', description: `Could not fetch video details: ${error.message}` });
    } finally {
      setIsFetching(false);
    }
  }, [toast]);


  const handleYoutubeIdChange = (e) => {
    const { value } = e.target;
    const videoId = value.trim();

    setFormData(prev => ({
      ...prev,
      youtube_id: videoId,
      // Clear other fields when ID changes to avoid stale data
      title: '',
      artist: '',
      duration: '',
      description: ''
    }));

    if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
    }

    if (videoId && videoId.length >= 11 && !item) {
        fetchTimeoutRef.current = setTimeout(() => {
            handleFetchInfo(videoId);
        }, 500); // Debounce for 500ms
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSave = {
        title: formData.title,
        artist: formData.artist,
        duration: formData.duration,
        youtube_id: formData.youtube_id,
        description: formData.description,
        image_prompt: formData.image_prompt || `A vibrant music visualizer for the song ${formData.title} by ${formData.artist}`,
        // Set default values for fields not in the form
        album: formData.album || '',
        year: formData.year || new Date().getFullYear().toString(),
        genre: formData.genre || 'Electronic',
        links: formData.links || [],
      };

      if (item) {
        await updateData('music', { ...dataToSave, id: item.id });
        toast({ title: 'Success', description: 'Music track updated.' });
      } else {
        await addData('music', dataToSave);
        toast({ title: 'Success', description: 'Music track added.' });
      }
      onSave();
    } catch (error) {
      console.error("Failed to save music track:", error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to save music track.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="youtube_id">YouTube Video ID</Label>
        <Input 
          id="youtube_id" 
          name="youtube_id" 
          value={formData.youtube_id} 
          onChange={handleYoutubeIdChange} 
          placeholder="Paste the YouTube Video ID here" 
          required 
          className="mt-1"
        />
        {isFetching && <p className="text-sm text-muted-foreground mt-2 flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" />Fetching track details...</p>}
      </div>
      
      {formData.title && (
        <div className="space-y-4 rounded-md border p-4 bg-muted/50">
           <div>
            <Label htmlFor="title">Title</Label>
            <p id="title" className="text-lg font-semibold">{formData.title}</p>
          </div>
           <div>
            <Label htmlFor="artist">Artist</Label>
            <p id="artist" className="text-sm">{formData.artist}</p>
          </div>
           <div>
            <Label htmlFor="duration">Duration</Label>
            <p id="duration" className="text-sm">{formData.duration}</p>
          </div>
        </div>
      )}

      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading || isFetching || !formData.title}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MusicForm;