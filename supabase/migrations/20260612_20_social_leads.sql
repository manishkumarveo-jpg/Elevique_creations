-- Create social leads table
CREATE TABLE IF NOT EXISTS social_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT,
  videos_count TEXT,
  budget_per_video TEXT,
  requirement_brief TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  company_name TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE social_leads ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts
CREATE POLICY "Allow public insert to social_leads"
  ON social_leads FOR INSERT
  WITH CHECK (true);

-- Allow administrators to access all actions
CREATE POLICY "Allow admin select/all access to social_leads"
  ON social_leads FOR ALL
  USING (is_admin());
