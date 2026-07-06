import { NextResponse } from "next/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, Email, and Message are required fields." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Insert data into contact_submissions table
    const { error } = await adminClient.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      message,
    });

    if (error) {
      console.error("[API Contact] Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to save submission: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[API Contact] Uncaught handler error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
