import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const requestBody = {
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
        width: 720,
        height: 1280
      },
      aspect_ratio: '9:16'
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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
} 