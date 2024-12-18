'use client';
import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateVideo = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Welcome to my HeyGen demo!',
        }),
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">HeyGen API Demo</h1>
      
      <button
        onClick={generateVideo}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate Video'}
      </button>

      {status && (
        <div className="mt-4 text-center">
          <p>Status: {status}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      {videoUrl && (
        <div className="mt-8">
          <video controls className="max-w-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
