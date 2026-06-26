// `title` is derived automatically from the video file name in `videoSrc` —
// don't hand-write titles here. To add a clip, add `{ id, videoSrc }` to the
// matching color-variant group below (or start a new group if the accent differs).

import { expandWithMeta } from "@/lib/utils";

export interface PackageProject {
  id: number;
  title: string;
  colorFrom: string;
  colorTo: string;
  videoSrc?: string;
}

interface RawPackageProject {
  id: number;
  videoSrc?: string;
}

function pkgGroup(colorFrom: string, colorTo: string, items: RawPackageProject[]): PackageProject[] {
  return expandWithMeta({ colorFrom, colorTo }, items);
}

// ── 1. Signature Category Group ────────────────────────────────
export const PKG_AI_VISUALS: PackageProject[] = [
  ...pkgGroup("#ff6b35", "#ff1a1a", [
    { id: 101, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Christmas%20concept.mp4" },
    { id: 102, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Legacy%20story.mov" },
  ]),
  ...pkgGroup("#ec4899", "#f59e0b", [
    { id: 103, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mov" },
  ]),
];

export const PKG_EDITORIAL: PackageProject[] = [
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 201, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20New%20Year.mp4" },
  ]),
  ...pkgGroup("#06b6d4", "#10b981", [
    { id: 202, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mov" },
  ]),
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 203, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.mp4" },
    { id: 204, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(1).mp4" },
    { id: 205, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(2).mp4" },
    { id: 206, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(3).mp4	" },
    { id: 207, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(4).mp4" },
    { id: 208, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(5).mp4" },
    { id: 209, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(6).mp4" },
    { id: 210, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(7).mp4" },
    { id: 211, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(9).mp4" },
    { id: 212, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Cooler%20Ad.mp4" },
    { id: 213, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.mp4" },
    { id: 214, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).mp4" },
    { id: 215, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(2).mp4" },
    { id: 216, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate.mp4" },
    { id: 217, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(1).mp4" },
    { id: 218, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(2).mp4" },
    { id: 219, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(3).mp4" },
    { id: 220, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(4).mp4" },
    { id: 221, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Eyewear%20premium.mp4" },
    { id: 222, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Lifestyle%20-%20Retro%20concept%20Blush.mp4" },
    { id: 223, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.mp4" },
    { id: 224, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Purelab%20Facewash.mp4" },
    { id: 225, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Purelab%20Serum.mp4" },
  ]),
];

// ── 2. Impact Category Group ──────────────────────────────────
export const PKG_PRODUCT_FILM: PackageProject[] = [
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 301, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.mp4" },
  ]),
  ...pkgGroup("#f97316", "#eab308", [
    { id: 302, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.mp4" },
  ]),
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 303, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop.mov" },
    { id: 304, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.mp4" },
    { id: 305, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.mp4" },
    { id: 306, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.mp4 " },
    { id: 307, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mov" },
    { id: 308, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/Ekincare%20Health%20app.mp4" },
    { id: 309, videoSrc: "" },
    { id: 310, videoSrc: "" },
    { id: 311, videoSrc: "" },
    { id: 312, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad.mov" },
    { id: 313, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Dual%20models.mp4" },
    { id: 314, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.mp4" },
    { id: 315, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1).mp4" },
    { id: 316, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).mp4" },
    { id: 317, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).mp4" },
    { id: 318, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1).mp4" },
    { id: 319, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).mp4" },
    { id: 320, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Western%20blazer.mp4" },
    { id: 321, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women_s%20Dress%20(2).mp4" },
    { id: 322, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.MP4" },
    { id: 323, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.mp4" },
    { id: 324, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.mp4" },
    { id: 325, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Health%20-%20Multivitamin%20caps.mov" },
    { id: 326, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(1).mp4" },
    { id: 327, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(2).mp4" },
    { id: 328, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(3).mp4" },
    { id: 329, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(4).mp4" },
    { id: 330, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(5).mp4" },
    { id: 331, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.mp4" },
    { id: 332, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(4).mp4" },
    { id: 333, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Its%20me%20valentine_s%20concept.mp4" },
    { id: 334, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mov" },
    { id: 335, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/Supernova.Ai%20app%20-%20Avatar.mp4" },
    { id: 336, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC%20review%20Avatar.mp4" },
  ]),
];

export const PKG_BRAND_FILM: PackageProject[] = pkgGroup("#f59e0b", "#ec4899", [
  { id: 401, videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Car%20mantra%20-%20mechanical.mov" },
  { id: 402, videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Ladakh%20Bike%20tours%20-%20Avatar.mp4" },
]);

// ── 3. Custom Category Group ──────────────────────────────────
export const PKG_TECH_UI: PackageProject[] = pkgGroup("#10b981", "#3b82f6", [
  { id: 501, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Aura%20concept.mp4" },
  { id: 502, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Lipstick%20showreel.mp4" },
  { id: 503, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate.mp4" },
  { id: 504, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.mp4" },
  { id: 505, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).mp4" },
  { id: 506, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/feature_sectoin/Gauddly%20Music%20Video.mp4" },
]);

export const PKG_EXPERIMENTAL: PackageProject[] = [];
