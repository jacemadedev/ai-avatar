import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: 'Daisy-inskirt-20220818',
              avatar_style: 'normal'
            },
            voice: {
              type: 'text',
              input_text: text,
              voice_id: '2d5b0e6cf36f460aa7fc47e3eee4ba54'
            },
            background: {
              type: 'color',
              value: '#008000'
            }
          }
        ],
        dimension: {
          width: 1280,
          height: 720
        },
        aspect_ratio: '16:9',
        test: true
      }),
    });

    const data = await response.json();
    console.log('Generate Video API Response:', data);
    
    if (!data.data?.video_id) {
      console.error('API Response Error:', data);
      throw new Error(data.error || 'Failed to get video_id');
    }

    const responseData = { video_id: data.data.video_id };
    console.log('Sending response:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in generate-video route:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
} 