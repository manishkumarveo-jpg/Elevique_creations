import { createServerClient } from "@/lib/supabase/server";
import { Table, Thead, Tbody, Th, Tr } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { Mail, Phone, Calendar, MapPin, Video, DollarSign, Globe, Building, MessageSquare, Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const supabase = await createServerClient();
  let leads: any[] = [];
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 0" }}>
        <div className="p-warn-box">
          <h2 className="p-warn-box-title">Migration Required</h2>
          <p className="p-warn-box-sub">
            The social leads table (`social_leads`) does not exist or has not been configured in your database yet.
            Please apply the SQL migration in your Supabase SQL Editor:
          </p>
          <pre
            style={{
              background: "rgba(0,0,0,0.3)",
              padding: "1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              fontSize: "0.8rem",
              overflowX: "auto",
              color: "#ff6b35",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            supabase/migrations/20260612_20_social_leads.sql
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem", padding: "1rem" }}>
      <div>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Social Campaign Leads</h1>
        <p style={{ color: "var(--p-t3)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
          View and manage leads captured from your social media marketing campaigns.
        </p>
      </div>

      {leads.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 2rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "16px",
            textAlign: "center",
            gap: "1rem",
          }}
        >
          <Briefcase size={40} style={{ opacity: 0.3, color: "var(--p-t3)" }} />
          <div>
            <h3 style={{ color: "var(--p-t1)", fontWeight: 600, fontSize: "1rem" }}>No Leads Yet</h3>
            <p style={{ color: "var(--p-t3)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Submissions from the `/leads` landing page will appear here.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Lead / Contact</Th>
              <Th>Service / Videos</Th>
              <Th>Budget</Th>
              <Th>Brief & Requirement</Th>
              <Th>Location & Company</Th>
              <Th>Date</Th>
            </tr>
          </Thead>
          <Tbody>
            {leads.map((lead) => (
              <Tr key={lead.id}>
                {/* Lead / Contact */}
                <td style={{ verticalAlign: "top", padding: "1rem 0.875rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <Avatar name={lead.full_name} size="sm" />
                      <span className="p-table-name" style={{ fontWeight: 600 }}>
                        {lead.full_name}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.75rem", paddingLeft: "2.1rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t2)" }}>
                        <Mail size={12} style={{ opacity: 0.7 }} />
                        <a href={`mailto:${lead.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {lead.email}
                        </a>
                      </span>
                      {lead.phone && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t2)" }}>
                          <Phone size={12} style={{ opacity: 0.7 }} />
                          <a href={`tel:${lead.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                            {lead.phone}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Service / Videos */}
                <td style={{ verticalAlign: "top", padding: "1rem 0.875rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.78rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t1)", fontWeight: 500 }}>
                      <Briefcase size={12} style={{ color: "rgb(20, 184, 166)", opacity: 0.8 }} />
                      {lead.service_type || "Unspecified Service"}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t2)" }}>
                      <Video size={12} style={{ opacity: 0.7 }} />
                      {lead.videos_count || "Unspecified Qty"}
                    </span>
                  </div>
                </td>

                {/* Budget */}
                <td style={{ verticalAlign: "top", padding: "1rem 0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", color: "var(--p-t1)", fontWeight: 600 }}>
                    <DollarSign size={13} style={{ color: "rgb(20, 184, 166)" }} />
                    <span>{lead.budget_per_video || "N/A"}</span>
                  </div>
                </td>

                {/* Brief & Requirement */}
                <td style={{ verticalAlign: "top", maxWidth: "300px", padding: "1rem 0.875rem" }}>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      lineHeight: "1.5",
                      color: "var(--p-t2)",
                      whiteSpace: "pre-wrap",
                      margin: 0,
                    }}
                  >
                    {lead.requirement_brief || (
                      <span style={{ color: "var(--p-t3)", fontStyle: "italic" }}>No brief provided</span>
                    )}
                  </p>
                </td>

                {/* Location & Company */}
                <td style={{ verticalAlign: "top", padding: "1rem 0.875rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.78rem" }}>
                    {lead.city && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t2)" }}>
                        <MapPin size={12} style={{ opacity: 0.7 }} />
                        {lead.city}
                      </span>
                    )}
                    {lead.company_name && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t2)" }}>
                        <Building size={12} style={{ opacity: 0.7 }} />
                        {lead.company_name}
                      </span>
                    )}
                    {lead.website && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--p-t2)" }}>
                        <Globe size={12} style={{ opacity: 0.7 }} />
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                          Website
                        </a>
                      </span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td style={{ verticalAlign: "top", whiteSpace: "nowrap", padding: "1rem 0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--p-t3)" }}>
                    <Calendar size={12} style={{ opacity: 0.7 }} />
                    {new Date(lead.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
