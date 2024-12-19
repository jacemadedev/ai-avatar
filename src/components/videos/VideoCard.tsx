import { formatDistanceToNow } from 'date-fns';
import { VideoActions } from './VideoActions';
import { Loader2 } from 'lucide-react';

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
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
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
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
          {video.title || 'Untitled Video'}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="capitalize">{video.status}</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
          </div>
          <VideoActions videoId={video.id} />
        </div>
      </div>
    </div>
  );
} 