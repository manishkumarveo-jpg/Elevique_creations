import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/shared/lib/supabase/admin";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().nullable(),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parsed.data;
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
        { ok: false, error: "Something went wrong. Please try again." },
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
