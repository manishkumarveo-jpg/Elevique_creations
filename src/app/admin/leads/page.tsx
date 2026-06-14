import { createServerClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { Mail, Phone, Calendar, MapPin, Video, DollarSign, Globe, Building, Briefcase } from "lucide-react";

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
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Lead / Contact</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Brief</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Avatar name={lead.full_name} size="sm" />
                        <span className="p-table-name">{lead.full_name}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", paddingLeft: "2rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }} className="mono">
                          <Mail size={11} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                          <a href={`mailto:${lead.email}`} style={{ color: "var(--ds-text-3)", textDecoration: "none" }}>
                            {lead.email}
                          </a>
                        </span>
                        {lead.phone && (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }} className="mono">
                            <Phone size={11} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                            <a href={`tel:${lead.phone}`} style={{ color: "var(--ds-text-3)", textDecoration: "none" }}>
                              {lead.phone}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "13px", color: "var(--ds-text)", fontWeight: 500 }}>
                        <Briefcase size={12} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                        {lead.service_type || "—"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px" }} className="mono">
                        <Video size={11} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                        <span style={{ color: "var(--ds-text-3)" }}>{lead.videos_count || "—"}</span>
                      </span>
                    </div>
                  </td>

                  <td style={{ verticalAlign: "top" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 600 }} className="mono">
                      <DollarSign size={13} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                      {lead.budget_per_video || "—"}
                    </span>
                  </td>

                  <td style={{ verticalAlign: "top", maxWidth: 280 }}>
                    <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--ds-text-2)", margin: 0, whiteSpace: "pre-wrap" }}>
                      {lead.requirement_brief || <span style={{ color: "var(--ds-text-3)", fontStyle: "italic" }}>No brief provided</span>}
                    </p>
                  </td>

                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {lead.city && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "13px", color: "var(--ds-text-2)" }}>
                          <MapPin size={12} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                          {lead.city}
                        </span>
                      )}
                      {lead.company_name && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "13px", color: "var(--ds-text-2)" }}>
                          <Building size={12} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                          {lead.company_name}
                        </span>
                      )}
                      {lead.website && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "13px", color: "var(--ds-text-2)" }}>
                          <Globe size={12} style={{ color: "var(--ds-text-3)", flexShrink: 0 }} />
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ds-text-2)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            Website
                          </a>
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ verticalAlign: "top", whiteSpace: "nowrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "12px", color: "var(--ds-text-3)" }} className="mono">
                      <Calendar size={11} style={{ flexShrink: 0 }} />
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
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
