-- Step 8: Files Table
-- No file storage — files are external links (Google Drive, Dropbox, etc.)
CREATE TABLE files (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id    UUID        NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by  UUID        NOT NULL REFERENCES profiles(id),
  file_name    TEXT        NOT NULL,
  file_type    TEXT,
  file_size    TEXT,                    -- optional, human-readable e.g. "24 MB"
  file_url     TEXT        NOT NULL,   -- external link (Google Drive, Dropbox, etc.)
  notes        TEXT,
  is_deleted   BOOLEAN     NOT NULL DEFAULT FALSE,
  deleted_by   UUID        REFERENCES profiles(id),
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_files_folder  ON files(folder_id)  WHERE is_deleted = FALSE;
CREATE INDEX idx_files_project ON files(project_id) WHERE is_deleted = FALSE;
