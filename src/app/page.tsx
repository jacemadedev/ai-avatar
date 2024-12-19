'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';
import { VideoCard } from '@/components/videos/VideoCard';
import { Loader2 } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  status: string;
  video_url: string | null;
  created_at: string;
  user_id: string;
}

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('authRequired') === 'true') {
      setShowAuthModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : videos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No videos generated yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
