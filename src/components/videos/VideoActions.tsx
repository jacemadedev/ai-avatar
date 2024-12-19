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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Check if video is liked
      const { data: like } = await supabase
        .from('likes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .single();

      // Check if video is saved
      const { data: save } = await supabase
        .from('saves')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .single();

      setIsLiked(!!like);
      setIsSaved(!!save);
    }

    checkInteractions();
  }, [videoId, supabase]);

  const toggleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;

    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('likes')
        .insert({ video_id: videoId, user_id: userId });
    }

    setIsLiked(!isLiked);
  };

  const toggleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;

    if (isSaved) {
      await supabase
        .from('saves')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('saves')
        .insert({ video_id: videoId, user_id: userId });
    }

    setIsSaved(!isSaved);
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