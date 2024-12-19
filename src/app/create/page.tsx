'use client';
import { useState } from 'react';
import { AVATARS, VOICES, type VideoConfig } from '@/types';
import { ScriptInput } from '@/components/create/ScriptInput';
import { AvatarSelector } from '@/components/create/AvatarSelector';
import { VoiceSelector } from '@/components/create/VoiceSelector';
import { SubtitleConfig } from '@/components/create/SubtitleConfig';
import { VideoPreview } from '@/components/create/VideoPreview';

export default function CreateVideo() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Video</h2>
        
        <div className="space-y-6">
          <ScriptInput 
            value={config.text}
            onChange={(text) => setConfig({ ...config, text })}
          />

          <AvatarSelector
            selectedAvatarId={config.avatar.id}
            onSelect={(avatar) => setConfig({
              ...config,
              avatar: { ...config.avatar, id: avatar.id },
              voice: VOICES.find(v => v.name.includes(avatar.name)) || config.voice
            })}
          />

          <VoiceSelector
            selectedVoiceId={config.voice.id}
            onSelect={(voice) => setConfig({
              ...config,
              voice: { id: voice.id, name: voice.name }
            })}
          />

          <SubtitleConfig
            config={config.subtitles}
            onChange={(subtitles) => setConfig({ ...config, subtitles })}
          />

          <button
            onClick={generateVideo}
            disabled={loading || !config.text.trim()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Video'}
          </button>

          <VideoPreview
            url={videoUrl}
            status={status}
            error={error}
          />
        </div>
      </div>
    </div>
  );
} 