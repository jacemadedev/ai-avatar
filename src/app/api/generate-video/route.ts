import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, avatar, voice, subtitles } = await request.json();

    const requestBody = {
      video_inputs: [
        {
          character: {
            type: 'avatar',
            avatar_id: avatar.id,
            avatar_style: avatar.style
          },
          voice: {
            type: 'text',
            input_text: text,
            voice_id: voice.id
          }
        }
      ],
      dimension: {
        width: 720,
        height: 1280
      },
      aspect_ratio: '9:16',
      enable_subtitle: subtitles.enabled,
      subtitle_style: subtitles.style || 'bold',
      subtitle_position: subtitles.position || 'bottom'
    };

    console.log('Making request to HeyGen API with:', requestBody);

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('HeyGen API Error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save video record to Supabase
    const { error: insertError } = await supabase
      .from('videos')
      .insert({
        id: data.data.video_id, // Use HeyGen's video ID
        user_id: session.user.id,
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''), // First 50 chars as title
        status: 'processing'
      });

    if (insertError) {
      console.error('Error saving video record:', insertError);
      throw insertError;
    }

    return NextResponse.json({
      video_id: data.data.video_id
    });
  } catch (error) {
    console.error('Error in generate-video route:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 