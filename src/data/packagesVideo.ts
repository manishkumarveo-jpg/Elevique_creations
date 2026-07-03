// `title` is pre-filled from the video file name — edit it freely per entry.
// To add a clip, add `{ id, title, videoSrc, thumbnail }` to the matching
// color-variant group below (or start a new group if the accent differs).

import { expandWithMeta } from "@/lib/utils";

export interface PackageProject {
  id: number;
  title: string;
  colorFrom: string;
  colorTo: string;
  videoSrc?: string;
  /** Poster image URL — fill in manually; falls back to a black card until set. */
  thumbnail?: string;
}

interface RawPackageProject {
  id: number;
  title?: string;
  videoSrc?: string;
  thumbnail?: string;
}

function pkgGroup(colorFrom: string, colorTo: string, items: RawPackageProject[]): PackageProject[] {
  return expandWithMeta({ colorFrom, colorTo }, items);
}

// ── 1. Signature Category Group ────────────────────────────────
export const PKG_AI_VISUALS: PackageProject[] = [
  ...pkgGroup("#ff6b35", "#ff1a1a", [
    { id: 101, title: "Aar Kay Vox UK - Luxury", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mp4", thumbnail: "" },

  ]),
  ...pkgGroup("#ec4899", "#f59e0b", [
    { id: 103, title: "Bulgari premium concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mp4", thumbnail: "" },
  ]),
];

export const PKG_EDITORIAL: PackageProject[] = [
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 201, title: "Chemtiver chemicals.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.compressed.mp4", thumbnail: "" },
  ]),
  ...pkgGroup("#06b6d4", "#10b981", [
    { id: 202, title: "Cosmetics - Premium (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(1).compressed.mp4", thumbnail: "" },
  ]),
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 203, title: "cosmetics-premium-2_W9t1Rfpi", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-2_W9t1Rfpi.mp4", thumbnail: "" },
    { id: 204, title: "cosmetics-premium-3_sEU6FwG4", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-3_sEU6FwG4.mp4", thumbnail: "" },
    { id: 205, title: "cosmetics-premium-4_x5GOdpeM", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-4_x5GOdpeM.mp4", thumbnail: "" },
    { id: 206, title: "cosmetics-premium-5_L1zn11cX", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-5_L1zn11cX.mp4", thumbnail: "" },
    { id: 207, title: "Cosmetics - Premium (6)_compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(6)_compressed.mp4", thumbnail: "" },
    { id: 208, title: "Cosmetics - Premium (7)_compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(7)_compressed.mp4", thumbnail: "" },
    { id: 209, title: "Cosmetics - Premium (8)_compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(8)_compressed.mp4", thumbnail: "" },
    { id: 210, title: "Cosmetics - Premium (9)_compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(9)_compressed.mp4", thumbnail: "" },
    { id: 211, title: "Electronics - Fan Ad.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.compressed.mp4", thumbnail: "" },
    { id: 212, title: "Electronics - Cooler Ad (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Electronics%20-%20Cooler%20Ad%20(1).mp4", thumbnail: "" },
    { id: 213, title: "Hyginest - Brand video.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Hyginest%20-%20Brand%20video.compressed.mp4", thumbnail: "" },
    { id: 214, title: "KM Hospital - Scenario stories (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4", thumbnail: "" },
    { id: 215, title: "KM Hospital - Scenario stories (2).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4", thumbnail: "" },
    { id: 216, title: "KM Hospital - Scenario stories (3).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4", thumbnail: "" },
    { id: 217, title: "KM Hospital - Scenario stories (4).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4", thumbnail: "" },
    { id: 218, title: "KM Hospital - scenario stories (5).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20scenario%20stories%20(5).compressed.mp4", thumbnail: "" },
    { id: 219, title: "Eyewear Ad (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4", thumbnail: "" },
    { id: 220, title: "Lifestyle - Retro concept Blush.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Lifestyle%20-%20Retro%20concept%20Blush.compressed.mp4", thumbnail: "" },
    { id: 221, title: "Luxury reel version.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.compressed.mp4", thumbnail: "" },
    { id: 222, title: "Purelab Facewash.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Facewash.compressed.mp4", thumbnail: "" },
    { id: 223, title: "Purelab Serum.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Serum.compressed.mp4", thumbnail: "" },
    { id: 224, title: "Purelab Shampoo.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Shampoo.compressed.mp4", thumbnail: "" },
    { id: 225, title: "Untitled", videoSrc: "", thumbnail: "" },
  ]),
];

// ── 2. Impact Category Group ──────────────────────────────────
export const PKG_PRODUCT_FILM: PackageProject[] = [
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 301, title: "Aar Kay Vox - music concept.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.compressed.mp4", thumbnail: "" },
  ]),
  ...pkgGroup("#f97316", "#eab308", [
    { id: 302, title: "Agriculture - growupmytree.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.compressed.mp4", thumbnail: "" },
  ]),
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 303, title: "Agriculture - Kingston crop (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop%20(1).mp4", thumbnail: "" },
    { id: 304, title: "AI avatar - UGC testimonial.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.compressed.mp4", thumbnail: "" },
    { id: 305, title: "UGC", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC.mp4", thumbnail: "" },
    { id: 306, title: "Almonds.AI concept.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.compressed.mp4", thumbnail: "" },
    { id: 307, title: "Beta24 Delivery.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.compressed.mp4", thumbnail: "" },
    { id: 308, title: "Car mantra - mechanical", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mp4", thumbnail: "" },
    { id: 309, title: "Eyewear Ad (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4", thumbnail: "" },
    { id: 310, title: "Fashion & Lifestyle - Escale Dubai.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.compressed.mp4", thumbnail: "" },
    { id: 311, title: "Fashion & Lifestyle - Sweetfeel (1) (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1)%20(1).compressed.mp4", thumbnail: "" },
    { id: 312, title: "Fashion & Lifestyle - Sweetfeel (2).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).compressed.mp4", thumbnail: "" },
    { id: 313, title: "Fashion & Lifestyle - Sweetfeel (3).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).compressed.mp4", thumbnail: "" },
    { id: 314, title: "Fashion & Lifestyle - Sweetfeel (4).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).compressed.mp4", thumbnail: "" },
    { id: 315, title: "Fashion & Lifestyle - Women's Dress (2).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).compressed.mp4", thumbnail: "" },
    { id: 316, title: "Forbes real estate reel.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.compressed.mp4", thumbnail: "" },
    { id: 317, title: "Gujarati - Groundnut oil.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.compressed.mp4", thumbnail: "" },
    { id: 318, title: "Harman tea concept.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.compressed.mp4", thumbnail: "" },
    { id: 319, title: "Health - Multivitamin caps", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Health%20-%20Multivitamin%20caps.mp4", thumbnail: "" },
    { id: 320, title: "Influencer avatar.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.compressed.mp4", thumbnail: "" },
    { id: 321, title: "Influencer avatar (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(1).compressed.mp4", thumbnail: "" },
    { id: 322, title: "Influencer avatar (2).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(2).compressed.mp4", thumbnail: "" },
    { id: 323, title: "Influencer avatar (3).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(3).compressed.mp4", thumbnail: "" },
    { id: 324, title: "Influencer avatar (4).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(4).compressed.mp4", thumbnail: "" },
    { id: 325, title: "Influencer avatar (5).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(5).compressed.mp4", thumbnail: "" },
    { id: 326, title: "Influencer avatar.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar.compressed.mp4", thumbnail: "" },
    { id: 327, title: "Kitchenware - Seiken knife", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mp4", thumbnail: "" },
    { id: 328, title: "Malibhai concept.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4", thumbnail: "" },
    { id: 329, title: "Mezvo Tote bags.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Mezvo%20Tote%20bags.compressed.mp4", thumbnail: "" },
    { id: 330, title: "Modern Jewellery.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Modern%20Jewellery.compressed.mp4", thumbnail: "" },
    { id: 331, title: "NAFT academy.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/NAFT%20academy.compressed.mp4", thumbnail: "" },
    { id: 332, title: "Petromaxx LPG.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Petromaxx%20LPG.compressed.mp4", thumbnail: "" },
    { id: 333, title: "Sardar cattlefeed.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Sardar%20cattlefeed.compressed.mp4", thumbnail: "" },
    { id: 334, title: "Selectric EV Scooters", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Selectric%20EV%20Scooters.mp4", thumbnail: "" },
    { id: 335, title: "Shobha Sarees.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Shobha%20Sarees.compressed.mp4", thumbnail: "" },
    { id: 336, title: "Supernova.Ai app - Avatar (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.mp4", thumbnail: "" },
    { id: 337, title: "UGC trending Avatar.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar.compressed.mp4", thumbnail: "" }
  ]),
];

export const PKG_BRAND_FILM: PackageProject[] = pkgGroup("#f59e0b", "#ec4899", [
  { id: 401, title: "UGC trending Avatar (1) (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar%20(1)%20(1).compressed.mp4", thumbnail: "" },
  { id: 402, title: "Untitled", videoSrc: "", thumbnail: "" },
]);

// ── 3. Custom Category Group ──────────────────────────────────
export const PKG_TECH_UI: PackageProject[] = pkgGroup("#10b981", "#3b82f6", [
  { id: 501, title: "Malibhai concept.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4", thumbnail: "" },
  { id: 502, title: "Cosmetics - Aura concept.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Aura%20concept.compressed.mp4", thumbnail: "" },
  { id: 503, title: "Cosmetics - Lipstick showreel (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Lipstick%20showreel%20(1).mp4", thumbnail: "" },
  { id: 504, title: "Forbes properties - Real estate (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).compressed.mp4", thumbnail: "" },
  { id: 505, title: "Itsme Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20Music%20Video.mp4", thumbnail: "" },
  { id: 506, title: "Lifestyle - travel (1).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).compressed.mp4", thumbnail: "" },
  { id: 507, title: "Lifestyle - travel (2).compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(2).compressed.mp4", thumbnail: "" },
  { id: 508, title: "Lifestyle - Travel.compressed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.compressed.mp4", thumbnail: "" },
  { id: 509, title: "Gauddly Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Gauddly%20Music%20Video.mp4", thumbnail: "" }
]);

export const PKG_EXPERIMENTAL: PackageProject[] = [];
