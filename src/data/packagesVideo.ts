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
    { id: 101, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mp4" },

  ]),
  ...pkgGroup("#ec4899", "#f59e0b", [
    { id: 103, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mp4" },
  ]),
];

export const PKG_EDITORIAL: PackageProject[] = [
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 201, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.compressed.mp4" },
  ]),
  ...pkgGroup("#06b6d4", "#10b981", [
    { id: 202, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(1).compressed.mp4" },
  ]),
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 203, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-2_W9t1Rfpi.mp4" },
    { id: 204, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-3_sEU6FwG4.mp4" },
    { id: 205, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-4_x5GOdpeM.mp4" },
    { id: 206, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-5_L1zn11cX.mp4" },
    { id: 207, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(6)_compressed.mp4" },
    { id: 208, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(7)_compressed.mp4" },
    { id: 209, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(8)_compressed.mp4" },
    { id: 210, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(9)_compressed.mp4" },
    { id: 211, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.compressed.mp4" },
    { id: 212, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Electronics%20-%20Cooler%20Ad%20(1).mp4" },
    { id: 213, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Hyginest%20-%20Brand%20video.compressed.mp4" },
    { id: 214, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4" },
    { id: 215, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4" },
    { id: 216, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4" },
    { id: 217, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4" },
    { id: 218, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20scenario%20stories%20(5).compressed.mp4" },
    { id: 219, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4" },
    { id: 220, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Lifestyle%20-%20Retro%20concept%20Blush.compressed.mp4" },
    { id: 221, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.compressed.mp4" },
    { id: 222, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Facewash.compressed.mp4" },
    { id: 223, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Serum.compressed.mp4" },
    { id: 224, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Shampoo.compressed.mp4" },
    { id: 225, videoSrc: "" },
  ]),
];

// ── 2. Impact Category Group ──────────────────────────────────
export const PKG_PRODUCT_FILM: PackageProject[] = [
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 301, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.compressed.mp4" },
  ]),
  ...pkgGroup("#f97316", "#eab308", [
    { id: 302, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.compressed.mp4" },
  ]),
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 303, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop%20(1).mp4" },
    { id: 304, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.compressed.mp4" },
    { id: 305, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC.mp4" },
    { id: 306, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.compressed.mp4" },
    { id: 307, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.compressed.mp4" },
    { id: 308, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mp4" },
    { id: 309, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4" },
    { id: 310, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.compressed.mp4" },
    { id: 311, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1)%20(1).compressed.mp4" },
    { id: 312, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).compressed.mp4" },
    { id: 313, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).compressed.mp4" },
    { id: 314, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).compressed.mp4" },
    { id: 315, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).compressed.mp4" },
    { id: 316, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.compressed.mp4" },
    { id: 317, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.compressed.mp4" },
    { id: 318, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.compressed.mp4" },
    { id: 319, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Health%20-%20Multivitamin%20caps.mp4" },
    { id: 320, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.compressed.mp4" },
    { id: 321, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(1).compressed.mp4" },
    { id: 322, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(2).compressed.mp4" },
    { id: 323, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(3).compressed.mp4" },
    { id: 324, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(4).compressed.mp4" },
    { id: 325, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(5).compressed.mp4" },
    { id: 326, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar.compressed.mp4" },
    { id: 327, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mp4" },
    { id: 328, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4" },
    { id: 329, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Mezvo%20Tote%20bags.compressed.mp4" },
    { id: 330, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Modern%20Jewellery.compressed.mp4" },
    { id: 331, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/NAFT%20academy.compressed.mp4" },
    { id: 332, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Petromaxx%20LPG.compressed.mp4" },
    { id: 333, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Sardar%20cattlefeed.compressed.mp4" },
    { id: 334, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Selectric%20EV%20Scooters.mp4" },
    { id: 335, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Shobha%20Sarees.compressed.mp4" },
    { id: 336, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.mp4" },
    { id: 337, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar.compressed.mp4" }
  ]),
];

export const PKG_BRAND_FILM: PackageProject[] = pkgGroup("#f59e0b", "#ec4899", [
  { id: 401, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar%20(1).mp4" },
  { id: 402, videoSrc: "" },
]);

// ── 3. Custom Category Group ──────────────────────────────────
export const PKG_TECH_UI: PackageProject[] = pkgGroup("#10b981", "#3b82f6", [
  { id: 501, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4" },
  { id: 502, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Aura%20concept.mov" },
  { id: 503, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Lipstick%20showreel%20(1).mp4" },
  { id: 504, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).compressed.mp4" },
  { id: 505, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20Music%20Video.mp4" },
  { id: 506, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).compressed.mp4" },
  { id: 507, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(2).compressed.mp4" },
  { id: 508, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.compressed.mp4" },
  { id: 509, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Gauddly%20Music%20Video.mp4" }
]);

export const PKG_EXPERIMENTAL: PackageProject[] = [];
