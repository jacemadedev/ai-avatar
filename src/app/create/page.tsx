'use client';
import { useState, useEffect } from 'react';
import { AVATARS, VOICES, type VideoConfig } from '@/types';
import { VideoCreationWizard } from '@/components/create/VideoCreationWizard';
import { VideoPreview } from '@/components/create/VideoPreview';
import { GenerationModal } from '@/components/create/GenerationModal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthModal } from '@/components/auth/AuthModal';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function CreateVideo() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClientComponentClient();

  const [config, setConfig] = useState<VideoConfig>({
    text: '',
    avatar: {
      id: AVATARS[0].id,
      style: 'normal'
    },
    voice: {
      id: VOICES[0].id,
      name: VOICES[0].name
    },
    subtitles: {
      enabled: true,
      style: 'bold',
      position: 'bottom'
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowAuthModal(true);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setIsAuthenticated(!!session);
      if (session) {
        setShowAuthModal(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const generateVideo = async () => {
    if (!config.text.trim()) {
      setError('Please enter a script');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.video_id) {
        throw new Error('No video ID received');
      }

      checkVideoStatus(data.video_id);
    } catch (error) {
      console.error('Error generating video:', error);
      setError(error instanceof Error ? error.message : 'Error generating video');
      setLoading(false);
    }
  };

  const checkVideoStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/video-status?videoId=${id}`);
      const data = await response.json();
      console.log('Status check response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setStatus(data.status || 'unknown');
      
      switch (data.status) {
        case 'completed':
          setVideoUrl(data.video_url);
          setLoading(false);
          break;
        case 'failed':
          setError(data.error?.message || 'Video generation failed');
          setLoading(false);
          break;
        case 'processing':
        case 'pending':
        case 'waiting':
          setTimeout(() => checkVideoStatus(id), 5000);
          break;
        default:
          console.warn('Unknown status:', data.status);
          setError(`Unknown status received: ${data.status}`);
          setLoading(false);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setError(error instanceof Error ? error.message : 'Error checking status');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {isAuthenticated ? (
        <>
          <VideoCreationWizard
            config={config}
            onConfigChange={setConfig}
            onGenerate={generateVideo}
            isGenerating={loading}
            error={error}
          />

          <GenerationModal 
            isOpen={loading} 
            status={status} 
          />

          {videoUrl && (
            <div className="max-w-4xl mx-auto">
              <VideoPreview
                url={videoUrl}
                status={status}
                error={error}
              />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
} 