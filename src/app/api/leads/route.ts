import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      service_type,
      videos_count,
      budget_per_video,
      requirement_brief,
      phone,
      city,
      company_name,
      website,
    } = body;

    const full_name = body.full_name?.trim();
    const email = body.email?.trim();

    if (!full_name || !email) {
      return NextResponse.json(
        { ok: false, error: "Name and Email are required fields." },
        { status: 400 }
      );
    }

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
        { ok: false, error: "Failed to save lead: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[API Leads] Uncaught handler error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
