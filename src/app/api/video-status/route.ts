import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY!,
        },
      }
    );

    const data = await response.json();
    console.log('Video Status API Response:', data);
    
    if (data.code !== 100) {
      console.error('API Response Error:', data);
      throw new Error(data.message || 'API request failed');
    }

    const responseData = {
      status: data.data.status,
      video_url: data.data.video_url,
      error: data.data.error
    };
    
    console.log('Sending response:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in video-status route:', error);
    return NextResponse.json({ error: 'Failed to check video status' }, { status: 500 });
  }
} 