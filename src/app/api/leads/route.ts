import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/shared/lib/supabase/admin";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable();

const LeadSchema = z.object({
  full_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  service_type: optionalText(100),
  videos_count: optionalText(50),
  budget_per_video: optionalText(50),
  requirement_brief: optionalText(5000),
  phone: optionalText(30),
  city: optionalText(100),
  company_name: optionalText(200),
  website: optionalText(300),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const {
      full_name, email, service_type, videos_count, budget_per_video,
      requirement_brief, phone, city, company_name, website,
    } = parsed.data;

    const adminClient = createAdminClient();

    // Insert data into social_leads table
    const { error } = await adminClient.from("social_leads").insert({
      service_type: service_type || null,
      videos_count: videos_count || null,
      budget_per_video: budget_per_video || null,
      requirement_brief: requirement_brief || null,
      full_name,
      email,
      phone: phone || null,
      city: city || null,
      company_name: company_name || null,
      website: website || null,
    });

    if (error) {
      console.error("[API Leads] Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[API Leads] Uncaught handler error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
