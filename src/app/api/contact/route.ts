import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // TODO: plug in your email provider here (Resend, SendGrid, Nodemailer, etc.)
    // Example with Resend:
    // await resend.emails.send({
    //   from: "Elevique Contact <noreply@elevique.studio>",
    //   to: "hello@elevique.studio",
    //   subject: `New inquiry: ${projectType || "General"} — ${name}`,
    //   html: `<p><b>Name:</b> ${name}</p><p><b>Company:</b> ${company}</p><p><b>Email:</b> ${email}</p><p><b>Project Type:</b> ${projectType}</p><p><b>Message:</b> ${message}</p>`,
    // });

    console.log("[contact] New inquiry:", { name, company, email, projectType, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
