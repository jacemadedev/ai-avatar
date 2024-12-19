-- Add is_public column to videos table
ALTER TABLE videos
ADD COLUMN is_public BOOLEAN DEFAULT false;

-- Update RLS policies
CREATE POLICY "Public videos are viewable by everyone" ON videos
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own videos" ON videos
  FOR SELECT USING (auth.uid() = user_id); 