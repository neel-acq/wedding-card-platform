-- Add venue_map_embed_link column to invitations table
ALTER TABLE public.invitations 
ADD COLUMN venue_map_embed_link text;