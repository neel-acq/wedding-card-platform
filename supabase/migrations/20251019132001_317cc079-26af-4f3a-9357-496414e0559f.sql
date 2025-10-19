-- Create invitations table
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  groom_name text NOT NULL,
  bride_name text NOT NULL,
  wedding_date timestamptz NOT NULL,
  wedding_time text NOT NULL,
  venue_name text NOT NULL,
  venue_address text NOT NULL,
  venue_map_link text,
  cover_image_url text,
  love_story text,
  love_story_images text[],
  groom_family jsonb DEFAULT '[]'::jsonb,
  bride_family jsonb DEFAULT '[]'::jsonb,
  gallery_images text[],
  video_url text,
  thank_you_message text,
  template_type text DEFAULT 'royal',
  theme_color text DEFAULT 'rose-gold',
  background_music_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published invitations
CREATE POLICY "Anyone can view published invitations"
  ON public.invitations
  FOR SELECT
  USING (is_published = true);

-- Create storage bucket for wedding images
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-images', 'wedding-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for wedding images
CREATE POLICY "Public can view wedding images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'wedding-images');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to invitations table
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();