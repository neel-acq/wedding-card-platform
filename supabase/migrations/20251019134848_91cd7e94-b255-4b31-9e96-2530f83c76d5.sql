-- Add ceremonies column to invitations table
ALTER TABLE public.invitations 
ADD COLUMN ceremonies JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.invitations.ceremonies IS 'Array of ceremony objects with title, date, time, venue_name, venue_address, map_link, and image_url';