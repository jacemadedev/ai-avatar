'use client';
import { useState, useEffect } from 'react';
import { HeartIcon, BookmarkIcon } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface VideoActionsProps {
  videoId: string;
}

export function VideoActions({ videoId }: VideoActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkInteractions() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        // Check if video is liked - Modified query
        const { data: likes, error: likeError } = await supabase
          .from('likes')
          .select('*')
          .eq('video_id', videoId)
          .eq('user_id', userId);

        if (likeError) {
          console.error('Error checking like status:', likeError);
        }

        // Check if video is saved - Modified query
        const { data: saves, error: saveError } = await supabase
          .from('saves')
          .select('*')
          .eq('video_id', videoId)
          .eq('user_id', userId);

        if (saveError) {
          console.error('Error checking save status:', saveError);
        }

        // Handle null cases explicitly
        setIsLiked(!!likes?.length);
        setIsSaved(!!saves?.length);
      } catch (err) {
        console.error('Error checking interactions:', err);
      }
    }

    checkInteractions();
  }, [videoId, supabase]);

  const toggleLike = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ video_id: videoId, user_id: userId });

        if (error) throw error;
      }

      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const toggleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      if (isSaved) {
        const { error } = await supabase
          .from('saves')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saves')
          .insert({ video_id: videoId, user_id: userId });

        if (error) throw error;
      }

      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleLike}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <HeartIcon className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
      </button>
      <button
        onClick={toggleSave}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          isSaved ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <BookmarkIcon className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
} 