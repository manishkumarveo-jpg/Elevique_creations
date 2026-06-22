import { createServerClient } from "@/lib/supabase/server";
import { MessageCircle } from "lucide-react";
import { InquiriesTable } from "./InquiriesTable";

export const dynamic = "force-dynamic";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  created_at: string;
  ai_summary?: string | null;
  ai_priority?: string | null;
  ai_category?: string | null;
  ai_processed_at?: string | null;
};

export default async function AdminInquiriesPage() {
  const supabase = await createServerClient();
  let submissions: ContactSubmission[] = [];
  let dbError = false;

  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Inquiries] Database error:", error);
      dbError = true;
    } else {
      submissions = data || [];
    }
  } catch (err) {
    console.error("[Inquiries] Uncaught query error:", err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="p-content-wrap">
        <div className="p-warn-box">
          <h2 className="p-warn-box-title">Migration Required</h2>
          <p className="p-warn-box-sub">
            The <code>contact_submissions</code> table does not exist yet. Apply the migration:
          </p>
          <pre>supabase/migrations/20260610_19_contact_submissions.sql</pre>
          <p className="p-warn-box-hint">After running it, refresh this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: "1.75rem" }}>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Inquiries</h1>
        <p className="p-page-sub">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""} from the public contact form.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <MessageCircle size={20} />
          </div>
          <p className="p-empty-title">No inquiries yet</p>
          <p className="p-empty-sub">Submissions from the public contact form will appear here.</p>
        </div>
      ) : (
        <InquiriesTable submissions={submissions} />
      )}
    </div>
  );
}
