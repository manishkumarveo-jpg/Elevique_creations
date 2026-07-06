import type { Metadata } from "next";
import LeadsLandingClient from "./LeadsLandingClient";

export const metadata: Metadata = {
  title: "Start a Project | Elevique",
  description:
    "Get premium, ROI-driven AI generated visuals for your brand without expensive shoots. Tell Elevique about your project and get a response within 24 hours.",
};

export default function LeadsPage() {
  return <LeadsLandingClient />;
}
