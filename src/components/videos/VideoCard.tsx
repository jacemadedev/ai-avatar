import { formatDistanceToNow } from 'date-fns';
import { VideoActions } from './VideoActions';
import { Loader2, Trash2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/contexts/ToastContext';

interface Video {
  id: string;
  title: string;
  status: string;
  video_url: string | null;
  created_at: string;
  user_id: string;
}

interface VideoCardProps {
  video: Video;
  onDelete: (id: string) => void;
}

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const supabase = createClientComponentClient();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (error) throw error;
      onDelete(video.id);

      setIsVisible(false);
      
      showToast('Video deleted successfully');
      
      setTimeout(() => {
        // router.refresh();
      }, 300);

    } catch (error) {
      console.error('Error deleting video:', error);
      showToast('Failed to delete video', 'error');
      setIsDeleting(false);
    }
  };

  // Check if current user is the video owner
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsOwner(session?.user?.id === video.user_id);
    };
    checkOwnership();
  }, [video.user_id, supabase.auth]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow"
        >
          <div className="relative pt-[177.77%]">
            {video.video_url ? (
              <video 
                src={video.video_url} 
                className="absolute inset-0 w-full h-full object-contain bg-gray-100 dark:bg-gray-700"
                controls
                playsInline
                preload="metadata"
                onError={(e) => {
                  console.error('Video loading error:', e);
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-400">Processing...</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {video.title || 'Untitled Video'}
              </h3>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete video"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="capitalize">{video.status}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
              </div>
              <VideoActions videoId={video.id} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 