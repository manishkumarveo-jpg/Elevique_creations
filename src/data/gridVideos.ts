// `title` is derived automatically from the video file name in `videoSrc`.

import { expandWithMeta } from "@/lib/utils";

export interface GridProject {
  id: number;
  title: string;
  category?: string;
  colorFrom?: string;
  colorTo?: string;
  videoSrc?: string;
}

interface RawGridProject {
  id: number;
  videoSrc?: string;
}

function gridGroup(category: string, items: RawGridProject[]): GridProject[] {
  return expandWithMeta({ category }, items);
}

// ── 1. Beauty, Wellness & Personal Care ───────────────────────
export const AI_VISUALS: GridProject[] = [
  ...gridGroup(
    "Beauty, Wellness & Personal Care",
    [
      { id: 1, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Amanzi%20air%20freshner%20(1).mp4" },
      { id: 2, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Aura%20concept.mov" },
    ]
  ),
  ...gridGroup(
    "Beauty, Wellness & Personal Care",
    [
      { id: 3, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Lipstick%20showreel%20(1).mp4" },
      { id: 4, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-2_W9t1Rfpi.mp4" },
      { id: 5, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-3_sEU6FwG4.mp4" },
      { id: 6, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-4_x5GOdpeM.mp4" },
      { id: 7, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-5_L1zn11cX.mp4" },
      { id: 8, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(6)_compressed.mp4" },
      { id: 9, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(7)_compressed.mp4" },
      { id: 10, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(8)_compressed.mp4" },
      { id: 11, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(9)_compressed.mp4" },
      { id: 12, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(9).mp4" },
      { id: 13, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Health%20-%20Multivitamin%20caps.mp4" },
      { id: 14, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Its%20me%20valentine's%20concept.compressed.mp4" },
      { id: 15, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20Music%20Video.mp4" },
      { id: 16, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4" },
      { id: 17, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4" },
      { id: 18, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4" },
      { id: 19, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4" },
      { id: 20, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Lifestyle%20-%20Retro%20concept%20Blush.compressed.mp4" },
      { id: 21, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Facewash.compressed.mp4" },
      { id: 22, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Serum.compressed.mp4" },
      { id: 23, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Shampoo.compressed.mp4" },
    ]
  ),
];

// ── 2. Fashion & Lifestyle ───────────────────────────────────
export const EDITORIAL: GridProject[] = [
  ...gridGroup(
    "Fashion & Lifestyle",
    [{ id: 24, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Auserio%20-%20Formal%20shoes.compressed.mp4" }]
  ),
  ...gridGroup(
    "Fashion & Lifestyle",
    [{ id: 25, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mp4" }]
  ),
  ...gridGroup(
    "Fashion & Lifestyle",
    [
      { id: 26, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20Shoes%20showcase.compressed.mp4" },
      { id: 27, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20shoes%20lifestyle.compressed.mp4" },
      { id: 28, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4" },
      { id: 29, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.compressed.mp4" },
      { id: 30, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1)%20(1).compressed.mp4" },
      { id: 31, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).compressed.mp4" },
      { id: 32, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).compressed.mp4" },
      { id: 33, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).compressed.mp4" },
      { id: 34, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).compressed.mp4" },
      { id: 35, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.compressed.mp4" },
      { id: 36, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Eyewear%20premium.compressed.mp4" },
      { id: 37, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.compressed.mp4" },
      { id: 38, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).compressed.mp4" },
      { id: 39, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(2).compressed.mp4" },
      { id: 40, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20Motions.compressed.mp4" },
      { id: 41, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Mezvo%20Tote%20bags.compressed.mp4" },
      { id: 42, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Modern%20Jewellery.compressed.mp4" },
      { id: 43, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/NAFT%20academy.compressed.mp4" },
      { id: 44, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/North%20east%20Cultural.compressed.mp4" },
      { id: 45, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Sapphire%20Bloom.compressed.mp4" },
      { id: 46, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Shobha%20Sarees.compressed.mp4" },
    ]
  ),
];

// ── 3. Food & Beverages ──────────────────────────────────────
export const PRODUCT_FILM: GridProject[] = gridGroup(
  "Food & Beverages",
  [
    { id: 47, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop%20(1).mp4" },
    { id: 48, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.compressed.mp4" },
    { id: 49, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.compressed.mp4" },
    { id: 50, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mp4" },
    { id: 51, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.compressed.mp4" },
    { id: 52, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Sardar%20cattlefeed.compressed.mp4" },
    { id: 53, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20Experience.compressed.mp4" },
    { id: 54, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20machine%20short%20(1).compressed.mp4" },
    { id: 55, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20machine%20short.compressed.mp4" },
    { id: 56, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20reel%20(1).compressed.mp4" },
    { id: 57, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20reel.compressed.mp4" },
    { id: 58, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20sachets.compressed.mp4" }
  ]
);

// ── 4. Personal Branding & Creators ──────────────────────────
export const BRAND_FILM: GridProject[] = [
  ...gridGroup(
    "Personal Branding & Creators",
    [{ id: 59, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar%20(1).mp4" }]
  ),
  ...gridGroup(
    "Personal Branding & Creators",
    [
      { id: 60, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/Ekincare%20Health%20app.mp4" },
      { id: 61, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.mp4" },
      { id: 62, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC%20review%20Avatar.mp4" },
    ]
  ),
];

// ── 5. Real Estate & Spaces ──────────────────────────────────
export const TECH_UI: GridProject[] = [
  ...gridGroup(
    "Real Estate & Spaces",
    [{ id: 63, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20News%20Hook.compressed.mp4" }]
  ),
  ...gridGroup(
    "Real Estate & Spaces",
    [{ id: 64, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.compressed.mp4" }]
  ),
  ...gridGroup(
    "Real Estate & Spaces",
    [
      { id: 65, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20scenario%20buildup%20(1).compressed.mp4" },
      { id: 66, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mp4" },
      { id: 67, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20New%20Year.compressed.mp4" },
      { id: 68, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).compressed.mp4" },
      { id: 69, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(2).compressed.mp4" },
      { id: 70, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20-%20concept.compressed.mp4" },
      { id: 71, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate.compressed.mp4" },
      { id: 72, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.compressed.mp4" },
      { id: 73, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4" },
      { id: 74, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4" },
      { id: 75, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4" },
      { id: 76, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4" },
      { id: 77, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.compressed.mp4" },
      { id: 78, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4" }
    ]
  ),
];

// ── 6. Tech, auto & Industrial ───────────────────────────────
export const EXPERIMENTAL: GridProject[] = gridGroup(
  "Tech, auto & Industrial",
  [
    { id: 79, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.compressed.mp4" },
    { id: 80, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.compressed.mp4" },
    { id: 81, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Bigxera%20-%20Tiles%20mixture.compressed.mp4" },
    { id: 82, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mp4" },
    { id: 83, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.compressed.mp4" },
    { id: 84, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.compressed.mp4" },
    { id: 85, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/FieldMarshal%20Trucks.compressed.mp4" },
    { id: 86, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Hyginest%20-%20Brand%20video.compressed.mp4" },
    { id: 87, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Mahindra%20XEV%20car%20(1).compressed.mp4" },
    { id: 88, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Petromaxx%20LPG.compressed.mp4" },
  ]
);

// ── Combined (used by FeaturedShowcase category rows) ─────────
export const GRID_PROJECTS: GridProject[] = [
  ...AI_VISUALS,
  ...EDITORIAL,
  ...PRODUCT_FILM,
  ...BRAND_FILM,
  ...TECH_UI,
  ...EXPERIMENTAL,
];
