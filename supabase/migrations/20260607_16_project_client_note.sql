-- Add client_note to projects
-- Stores a client's in-progress revision request / concern.
-- NULL means no active concern. Admin clears it once addressed.

ALTER TABLE projects
  ADD COLUMN client_note TEXT;
