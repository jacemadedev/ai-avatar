import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if we already have the video in storage
    const { data: video } = await supabase
      .from('videos')
      .select('video_url, status')
      .eq('id', videoId)
      .single();

    // If video is already completed, return early
    if (video?.status === 'completed' && video?.video_url) {
      return NextResponse.json({
        status: 'completed',
        video_url: video.video_url
      });
    }

    // Get HeyGen video status
    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HeyGen API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.code !== 100) {
      console.error('API Response Error:', data);
      throw new Error(data.message || 'API request failed');
    }

    // If video is completed, save to Supabase Storage
    if (data.data.status === 'completed' && data.data.video_url) {
      try {
        // Download video from HeyGen
        const videoResponse = await fetch(data.data.video_url);
        if (!videoResponse.ok) {
          throw new Error('Failed to download video from HeyGen');
        }
        
        const videoBlob = await videoResponse.blob();

        // Upload to Supabase Storage
        const fileName = `${videoId}.mp4`;
        const { error: uploadError } = await supabase
          .storage
          .from('videos')
          .upload(fileName, videoBlob, {
            contentType: 'video/mp4',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('videos')
          .getPublicUrl(fileName);

        // Update video record with storage URL
        const { error: updateError } = await supabase
          .from('videos')
          .update({ 
            video_url: publicUrl,
            status: 'completed'
          })
          .eq('id', videoId);

        if (updateError) throw updateError;

        // Return the Supabase URL instead of HeyGen URL
        return NextResponse.json({
          status: 'completed',
          video_url: publicUrl
        });
      } catch (err) {
        console.error('Error saving video to storage:', err);
        // Fall through to return HeyGen URL as fallback
      }
    }

    return NextResponse.json({
      status: data.data.status,
      video_url: data.data.video_url,
      error: data.data.error
    });
  } catch (error) {
    console.error('Error in video-status route:', error);
    return NextResponse.json(
      { error: 'Failed to check video status' }, 
      { status: 500 }
    );
  }
} 