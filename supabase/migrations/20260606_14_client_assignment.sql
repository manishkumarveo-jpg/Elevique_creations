-- Add assigned_team_member_id to profiles (clients only — nullable)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS assigned_team_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Index for fast lookup: "which clients is this team member managing?"
CREATE INDEX IF NOT EXISTS idx_profiles_assigned_team_member
  ON profiles(assigned_team_member_id)
  WHERE assigned_team_member_id IS NOT NULL;
