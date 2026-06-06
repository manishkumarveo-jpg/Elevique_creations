-- Additional indexes (some already created inline with tables; these are supplementary)

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE is_active = TRUE;

-- milestones status
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
