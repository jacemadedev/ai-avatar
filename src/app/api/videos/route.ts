import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { session } } = await supabase.auth.getSession();

    let query = supabase
      .from('videos')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

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

    return NextResponse.json(videos || []);

  } catch (error) {
    console.error('Error in videos route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete video from storage first
    const { error: storageError } = await supabase
      .storage
      .from('videos')
      .remove([`${videoId}.mp4`]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete video record from database
    const { error: dbError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
      .eq('user_id', session.user.id); // Ensure user can only delete their own videos

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in delete video route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add type for plan names
type PlanName = 'Free' | 'Founder' | 'Pro';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_name, status')
      .eq('user_id', session.user.id)
      .single();

    const planLimits: Record<PlanName, number> = {
      'Free': 5,
      'Founder': 15,
      'Pro': 40
    };

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('monthly_video_count')
      .eq('id', session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const currentPlan = (subscription?.status === 'active' ? subscription.plan_name : 'Free') as PlanName;
    const videoLimit = planLimits[currentPlan];

    if (user.monthly_video_count >= videoLimit) {
      return NextResponse.json(
        { error: `You have reached your monthly limit of ${videoLimit} videos. Please upgrade your plan to create more videos.` },
        { status: 403 }
      );
    }

    // Increment the video count
    const { error: updateError } = await supabase
      .from('users')
      .update({ monthly_video_count: user.monthly_video_count + 1 })
      .eq('id', session.user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update video count' }, { status: 500 });
    }

    // Continue with video creation...
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in create video route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 