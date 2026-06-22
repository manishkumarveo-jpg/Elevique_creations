import { createServerClient } from "@/lib/supabase/server";
import { Briefcase } from "lucide-react";
import { LeadsTable } from "./LeadsTable";

export const dynamic = "force-dynamic";

type SocialLead = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  service_type?: string | null;
  videos_count?: string | null;
  budget_per_video?: string | null;
  requirement_brief?: string | null;
  city?: string | null;
  company_name?: string | null;
  website?: string | null;
  created_at: string;
  ai_summary?: string | null;
  ai_priority?: string | null;
  ai_category?: string | null;
  ai_processed_at?: string | null;
};

export default async function AdminLeadsPage() {
  const supabase = await createServerClient();
  let leads: SocialLead[] = [];
  let dbError = false;

  try {
    const { data, error } = await supabase
      .from("social_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin Leads] Database error:", error);
      dbError = true;
    } else {
      leads = data || [];
    }
  } catch (err) {
    console.error("[Admin Leads] Uncaught query error:", err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="p-content-wrap">
        <div className="p-warn-box">
          <h2 className="p-warn-box-title">Migration Required</h2>
          <p className="p-warn-box-sub">
            The <code>social_leads</code> table does not exist yet. Apply the migration:
          </p>
          <pre>supabase/migrations/20260612_20_social_leads.sql</pre>
          <p className="p-warn-box-hint">After running it, refresh this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: "1.75rem" }}>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Social Leads</h1>
        <p className="p-page-sub">
          {leads.length} lead{leads.length !== 1 ? "s" : ""} captured from your campaigns.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <Briefcase size={20} />
          </div>
          <p className="p-empty-title">No leads yet</p>
          <p className="p-empty-sub">Submissions from the lead landing page will appear here.</p>
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
