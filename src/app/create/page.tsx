'use client';
import { useState } from 'react';
import { AVATARS, VOICES, BACKGROUNDS } from '@/types';

interface VideoConfig {
  text: string;
  avatar: {
    id: string;
    style: 'normal' | 'happy' | 'sad' | 'angry';
  };
  voice: {
    id: string;
    name: string;
  };
  background: {
    type: 'color' | 'image' | 'video';
    value: string;
  };
}

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
    background: {
      type: 'color',
      value: BACKGROUNDS[1].value // Green screen default
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
          {/* Script Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Script
            </label>
            <textarea
              value={config.text}
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              placeholder="Enter your video script here..."
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avatar
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setConfig({
                    ...config,
                    avatar: { ...config.avatar, id: avatar.id },
                    voice: avatar.hasDefaultVoice 
                      ? { id: '', name: `${avatar.name} (Default)` }
                      : { ...VOICES.find(v => v.name.includes(avatar.name)) || config.voice },
                    ...(avatar.hasDefaultBackground ? {} : {
                      background: config.background
                    })
                  })}
                  className={`p-4 rounded-lg border ${
                    config.avatar.id === avatar.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="text-3xl block mb-2">{avatar.preview}</span>
                  <span className="text-sm">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Voice
            </label>
            <select
              value={config.voice.id}
              onChange={(e) => {
                const voice = VOICES.find(v => v.id === e.target.value);
                if (voice) {
                  setConfig({
                    ...config,
                    voice: { id: voice.id, name: voice.name }
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              {VOICES.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          {/* Background Selection - Only show if current avatar doesn't have default background */}
          {!AVATARS.find(a => a.id === config.avatar.id)?.hasDefaultBackground && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background
              </label>
              <div className="grid grid-cols-3 gap-4">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => setConfig({
                      ...config,
                      background: { type: 'color', value: bg.value }
                    })}
                    className={`p-4 rounded-lg border ${
                      config.background.value === bg.value
                        ? 'border-blue-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{ backgroundColor: bg.value }}
                  >
                    <span className="text-sm" style={{ 
                      color: bg.value === '#FFFFFF' ? '#000000' : '#FFFFFF'
                    }}>
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateVideo}
            disabled={loading || !config.text.trim()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Video'}
          </button>

          {/* Status and Error Messages */}
          {status && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p>Status: {status}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Video Preview */}
          {videoUrl && (
            <div className="mt-8">
              <video 
                controls 
                className="max-h-[70vh] w-auto mx-auto rounded-lg"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 