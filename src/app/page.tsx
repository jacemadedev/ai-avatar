'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';
import { VideoCard } from '@/components/videos/VideoCard';
import { Loader2, PlaySquare } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Video {
  id: string;
  title: string;
  status: string;
  video_url: string | null;
  created_at: string;
  user_id: string;
}

function HomeContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (searchParams.get('authRequired') === 'true') {
      setShowAuthModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkAuthAndLoadVideos = async () => {
      try {
        setLoading(true);
        
        // Check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);

        // Always fetch videos, whether authenticated or not
        const response = await fetch('/api/videos');
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`API request failed: ${response.status}`);
        }

        if (!contentType?.includes('application/json')) {
          console.error('Invalid content type:', contentType);
          throw new Error('Invalid response format');
        }

        const data = await response.json();
        setVideos(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadVideos();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      checkAuthAndLoadVideos();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleVideoDelete = (deletedVideoId: string) => {
    setVideos(videos.filter(video => video.id !== deletedVideoId));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isAuthenticated ? 'Your Videos' : 'Featured Videos'}
            </h2>
            {!isAuthenticated && (
              <div className="text-sm text-gray-500">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-blue-500 hover:underline"
                >
                  Sign in to create your own
                </button>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <PlaySquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {isAuthenticated ? 'No videos yet' : 'No videos available'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isAuthenticated 
                  ? 'Start creating your first AI-powered video'
                  : 'Check back soon for featured videos'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onDelete={() => handleVideoDelete(video.id)}
                />
              ))}
            </div>
          )}

          {!isAuthenticated && videos.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Sign Up to Create Your Own Videos
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
