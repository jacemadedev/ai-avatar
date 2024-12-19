'use client';
import { useEffect, useState } from 'react';
import { VideoCard } from '@/components/videos/VideoCard';
import { Loader2, VideoIcon, BookmarkIcon, HeartIcon } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Video {
  id: string;
  title: string;
  status: string;
  video_url: string | null;
  created_at: string;
  user_id: string;
}

interface Stats {
  created: number;
  saved: number;
  liked: number;
}

function DashboardCard({ title, value, Icon }: {
  title: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
}

export default function History() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<Stats>({ created: 0, saved: 0, liked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        // Fetch videos
        const { data: videos, error: videosError } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (videosError) throw videosError;

        // Fetch likes count
        const { count: likesCount, error: likesError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (likesError) throw likesError;

        // Fetch saves count
        const { count: savesCount, error: savesError } = await supabase
          .from('saves')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (savesError) throw savesError;

        setVideos(videos || []);
        setStats({
          created: videos?.filter(v => v.user_id === userId).length || 0,
          saved: savesCount || 0,
          liked: likesCount || 0
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Created"
          value={stats.created.toString()}
          Icon={VideoIcon}
        />
        <DashboardCard
          title="Saved"
          value={stats.saved.toString()}
          Icon={BookmarkIcon}
        />
        <DashboardCard
          title="Liked"
          value={stats.liked.toString()}
          Icon={HeartIcon}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Video History</h2>
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
  );
} 