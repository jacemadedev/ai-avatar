'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { VideoCard } from '@/components/videos/VideoCard';
import { Loader2, PlaySquare } from 'lucide-react';
import type { Video } from '@/types';

export default function History() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Only fetch videos created by the current user
        const { data: videos, error } = await supabase
          .from('videos')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(videos || []);

      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [supabase]);

  const handleVideoDelete = (videoId: string) => {
    setVideos(videos.filter(v => v.id !== videoId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Video History</h2>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <PlaySquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No videos yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your created videos will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video}
                onDelete={handleVideoDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 