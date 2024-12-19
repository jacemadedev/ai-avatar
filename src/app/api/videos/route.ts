import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    let query = supabase
      .from('videos')
      .select('*')
      .eq('status', 'completed') // Only show completed videos
      .order('created_at', { ascending: false });

    // If user is not authenticated, only show public videos
    if (!session) {
      query = query
        .limit(6)
        .eq('is_public', true);
    }

    const { data: videos, error } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ensure we're always returning a JSON response
    return NextResponse.json(videos || []);

  } catch (error) {
    console.error('Error in videos route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 