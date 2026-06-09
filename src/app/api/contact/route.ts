import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.resendApiKey);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const safeName = escapeHtml(String(name));
    const safeCompany = company ? escapeHtml(String(company)) : "—";
    const safeProjectType = projectType ? escapeHtml(String(projectType)) : "General";
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, "<br/>");

    // Validate reply-to is a well-formed email before using it
    const replyTo = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? email
      : undefined;

    await resend.emails.send({
      from: env.contactFromEmail,
      to: env.contactRecipientEmail,
      ...(replyTo ? { replyTo } : {}),
      subject: `New inquiry: ${safeProjectType} — ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${safeName}</p>
        <p><b>Company:</b> ${safeCompany}</p>
        <p><b>Email:</b> ${escapeHtml(String(email))}</p>
        <p><b>Project Type:</b> ${safeProjectType}</p>
        <hr/>
        <p><b>Message:</b></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
