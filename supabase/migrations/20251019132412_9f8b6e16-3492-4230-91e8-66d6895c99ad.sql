-- Add RLS policies for authenticated users (admins) to manage invitations
CREATE POLICY "Authenticated users can insert invitations"
  ON public.invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update invitations"
  ON public.invitations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete invitations"
  ON public.invitations
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all invitations"
  ON public.invitations
  FOR SELECT
  TO authenticated
  USING (true);

-- Add storage policies for authenticated users to upload images
CREATE POLICY "Authenticated users can upload wedding images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'wedding-images');

CREATE POLICY "Authenticated users can update wedding images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'wedding-images');

CREATE POLICY "Authenticated users can delete wedding images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'wedding-images');