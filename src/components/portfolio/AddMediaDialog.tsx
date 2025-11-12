import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    type: 'gdrive' | 'youtube' | 'local';
    src?: string;
    driveId?: string;
    title: string;
    description: string;
    x: number;
    y: number;
    width: number;
  }) => void;
}

export const AddMediaDialog = ({ isOpen, onClose, onAdd }: AddMediaDialogProps) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const processUrl = (inputUrl: string) => {
    // Google Drive
    const driveMatch = inputUrl.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (driveMatch) {
      return { type: 'gdrive' as const, driveId: driveMatch[1] };
    }

    // YouTube
    const youtubeMatch = inputUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return { type: 'youtube' as const, src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
    }

    // Vimeo
    const vimeoMatch = inputUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return { type: 'local' as const, src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
    }

    // Direct URL
    return { type: 'local' as const, src: inputUrl };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !title || !description) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const processed = processUrl(url);
    onAdd({
      ...processed,
      title,
      description,
      x: 2500,
      y: 2500,
      width: 300,
    });

    // Reset form
    setUrl('');
    setTitle('');
    setDescription('');
    onClose();

    toast({
      title: 'Media Added',
      description: 'New media item has been added to the canvas',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Media</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Media URL</Label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Google Drive, YouTube, Vimeo, or direct URL"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports Google Drive, YouTube, Vimeo, or direct image/video URLs
            </p>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Media title"
              maxLength={100}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Media description"
              maxLength={500}
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
