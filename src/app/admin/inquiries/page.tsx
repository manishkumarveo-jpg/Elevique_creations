import { createServerClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { Mail, Phone, Calendar, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  created_at: string;
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
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Contact</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Avatar name={sub.name} size="sm" />
                      <span className="p-table-name">{sub.name}</span>
                    </div>
                  </td>
                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }} className="mono">
                        <Mail size={11} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                        <a href={`mailto:${sub.email}`} style={{ color: "var(--ds-text-3)", textDecoration: "none" }}>
                          {sub.email}
                        </a>
                      </span>
                      {sub.phone && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }} className="mono">
                          <Phone size={11} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                          <a href={`tel:${sub.phone}`} style={{ color: "var(--ds-text-3)", textDecoration: "none" }}>
                            {sub.phone}
                          </a>
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ verticalAlign: "top", maxWidth: 400 }}>
                    <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--ds-text-2)", whiteSpace: "pre-wrap", margin: 0 }}>
                      {sub.message}
                    </p>
                  </td>
                  <td style={{ verticalAlign: "top", whiteSpace: "nowrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px", color: "var(--ds-text-3)" }} className="mono">
                      <Calendar size={11} style={{ flexShrink: 0 }} />
                      {new Date(sub.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
