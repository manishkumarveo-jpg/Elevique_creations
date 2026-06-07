-- Add revision_note to deliverables
-- Stores the client's free-text feedback when requesting a revision.
-- NULL means no pending revision request on this deliverable.

ALTER TABLE deliverables
  ADD COLUMN revision_note TEXT;

-- Replace the old RLS policy that only allowed status = 'approved'.
-- The new policy also allows the client to set status = 'shared' when requesting a revision.

DROP POLICY IF EXISTS "deliverables: client approve own" ON deliverables;

CREATE POLICY "deliverables: client update own"
  ON deliverables FOR UPDATE
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
  )
  WITH CHECK (
    get_user_role() = 'client'
    AND is_project_client(project_id)
    AND (
      (status = 'approved' AND approved_by = auth.uid())
      OR
      (status = 'shared' AND revision_note IS NOT NULL)
    )
  );
