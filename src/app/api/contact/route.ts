import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.resendApiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Elevique Contact <onboarding@resend.dev>",
      to: "manishkumar.veo@gmail.com",
      replyTo: email,
      subject: `New inquiry: ${projectType || "General"} — ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Company:</b> ${company || "—"}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Project Type:</b> ${projectType || "—"}</p>
        <hr/>
        <p><b>Message:</b></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
