-- Add AI summary/classification columns for admin triage
ALTER TABLE social_leads
  ADD COLUMN ai_summary TEXT,
  ADD COLUMN ai_priority TEXT CHECK (ai_priority IN ('hot', 'warm', 'cold')),
  ADD COLUMN ai_category TEXT,
  ADD COLUMN ai_processed_at TIMESTAMPTZ;

ALTER TABLE contact_submissions
  ADD COLUMN ai_summary TEXT,
  ADD COLUMN ai_priority TEXT CHECK (ai_priority IN ('hot', 'warm', 'cold')),
  ADD COLUMN ai_category TEXT,
  ADD COLUMN ai_processed_at TIMESTAMPTZ;
