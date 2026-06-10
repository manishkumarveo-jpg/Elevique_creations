import { createServerClient } from "@/lib/supabase/server";
import { Table, Thead, Tbody, Th, Tr } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { Mail, Phone, Calendar, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const supabase = await createServerClient();
  let submissions: any[] = [];
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
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 0" }}>
        <div className="p-warn-box">
          <h2 className="p-warn-box-title">Migration Required</h2>
          <p className="p-warn-box-sub">
            The contact submissions table does not exist or has not been configured yet.
            Please apply the SQL migration in your Supabase SQL Editor first:
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
            supabase/migrations/20260610_19_contact_submissions.sql
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Contact Inquiries</h1>
        <p style={{ color: "var(--p-t3)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
          View inquiries and requests submitted through the public contact form.
        </p>
      </div>

      {submissions.length === 0 ? (
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
          <MessageSquare size={40} style={{ opacity: 0.3, color: "var(--p-t3)" }} />
          <div>
            <h3 style={{ color: "var(--p-t1)", fontWeight: 600, fontSize: "1rem" }}>No Inquiries Yet</h3>
            <p style={{ color: "var(--p-t3)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Submissions from the public contact form will appear here.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Sender</Th>
              <Th>Contact Information</Th>
              <Th>Message</Th>
              <Th>Date</Th>
            </tr>
          </Thead>
          <Tbody>
            {submissions.map((sub) => (
              <Tr key={sub.id}>
                <td style={{ verticalAlign: "top", padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Avatar name={sub.name} size="sm" />
                    <span className="p-table-name" style={{ fontWeight: 600 }}>{sub.name}</span>
                  </div>
                </td>
                <td style={{ verticalAlign: "top", padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.78rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--p-t2)" }}>
                      <Mail size={12} style={{ opacity: 0.7 }} />
                      <a href={`mailto:${sub.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {sub.email}
                      </a>
                    </span>
                    {sub.phone ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--p-t2)" }}>
                        <Phone size={12} style={{ opacity: 0.7 }} />
                        <a href={`tel:${sub.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {sub.phone}
                        </a>
                      </span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--p-t3)", fontStyle: "italic" }}>
                        <Phone size={12} style={{ opacity: 0.4 }} />
                        No phone number
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ verticalAlign: "top", maxWidth: "400px", padding: "0.875rem 1rem" }}>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      lineHeight: "1.5",
                      color: "var(--p-t2)",
                      whiteSpace: "pre-wrap",
                      margin: 0,
                    }}
                  >
                    {sub.message}
                  </p>
                </td>
                <td style={{ verticalAlign: "top", whiteSpace: "nowrap", padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--p-t3)" }}>
                    <Calendar size={12} style={{ opacity: 0.7 }} />
                    {new Date(sub.created_at).toLocaleString("en-US", {
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
