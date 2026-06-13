import { FileText } from 'lucide-react'

export default function AdminDocumentsPage() {
  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Documents</h1>
        <p className="p-page-sub">Centralized document storage and management.</p>
      </div>

      <div className="p-empty">
        <div className="p-empty-icon-wrap">
          <FileText size={20} />
        </div>
        <p className="p-empty-title">Documents coming soon</p>
        <p className="p-empty-sub">
          File management and document sharing will be available in a future update.
        </p>
      </div>
    </div>
  )
}
