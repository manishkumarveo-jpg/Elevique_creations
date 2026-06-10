-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit the contact form (anonymous inserts)
CREATE POLICY "Allow public insert to contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Allow authenticated administrators to read all inquiries
CREATE POLICY "Allow admin select/all access to contact_submissions"
  ON contact_submissions FOR ALL
  USING (is_admin());
