// `title` is pre-filled from the video file name — edit it freely per entry.
// To add a clip, add `{ id, title, videoSrc, thumbnail }` to the matching
// color-variant group below (or start a new group if the accent differs).

import { expandWithMeta } from "@/website/lib/video-utils";

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
    { id: 101, title: "Aar Kay Vox UK - Luxury", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Aar%20Kay%20Vox%20UK%20-%20Luxury.png" },

  ]),
  ...pkgGroup("#ec4899", "#f59e0b", [
    { id: 103, title: "Bulgari premium concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/bulll.png" },
  ]),
];

export const PKG_EDITORIAL: PackageProject[] = [
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 201, title: "Chemtiver chemicals", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Chemtiver%20chemicals.compressed.png" },
  ]),
  ...pkgGroup("#06b6d4", "#10b981", [
    { id: 202, title: "Cosmetics - Premium ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(1).compressed.png" },
  ]),
  ...pkgGroup("#e879f9", "#7c3aed", [
    { id: 203, title: "Cosmetics Concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-2_W9t1Rfpi.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-2_W9t1Rfpi.png" },
    { id: 204, title: "Lipstick Concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-3_sEU6FwG4.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-3_sEU6FwG4.png" },
    { id: 205, title: "Make-Up Spray", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-4_x5GOdpeM.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-4_x5GOdpeM.png" },
    { id: 206, title: "Cosmetics-IG Edit", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-5_L1zn11cX.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-5_L1zn11cX.png" },
    { id: 207, title: "Mascara Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(6)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(6)_compressed.png" },
    { id: 208, title: "Primer Concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(7)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(7)_compressed.png" },
    { id: 209, title: "Cosmetics Blush", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(8)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(8)_compressed.png" },
    { id: 210, title: "Lipstick IG Edit", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(9)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(9).png" },
    { id: 211, title: "Electronics - Fan Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Electronics%20-%20Fan%20Ad.compressed.png" },
    { id: 212, title: "Tech-Electronics", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Electronics%20-%20Cooler%20Ad%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Electronics%20-%20Cooler%20Ad%20(1).png" },
    { id: 213, title: "Hyginest - Brand video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Hyginest%20-%20Brand%20video.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Hyginest%20-%20Brand%20video.compressed.png" },
    { id: 214, title: "KM Hospital Concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.png" },
    { id: 215, title: "Hospital Story Telling", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.png" },
    { id: 216, title: "KM Hospital Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.png" },
    { id: 217, title: "Hospital Scenario Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.png" },
    { id: 218, title: "KM Hospital TVC", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20scenario%20stories%20(5).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20scenario%20stories%20(5).compressed.png" },
    { id: 219, title: "Eyewear Ad ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Eyewear%20Ad.png" },
    { id: 220, title: "Blush Retro", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Lifestyle%20-%20Retro%20concept%20Blush.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/retro.png" },
    { id: 221, title: "Luxury Homes Reel", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/luxury.png" },
    { id: 222, title: "Facewash Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Facewash.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Purelab%20Facewash.compressed.png" },
    { id: 223, title: "Serum E-commerce", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Serum.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Purelab%20Serum.compressed.png" },
    { id: 224, title: "Haircare Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Shampoo.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Purelab%20Shampoo.compressed.png" },

  ]),
];

// ── 2. Impact Category Group ──────────────────────────────────
export const PKG_PRODUCT_FILM: PackageProject[] = [
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 301, title: "Aar Kay Vox - music concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Aar%20Kay%20Vox%20-%20music%20concept.png" },
  ]),
  ...pkgGroup("#f97316", "#eab308", [
    { id: 302, title: "Agriculture Story-telling", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Agriculture%20-%20growupmytree.png" },
  ]),
  ...pkgGroup("#3b82f6", "#06b6d4", [
    { id: 303, title: "Agriculture - Kingston crop", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Agriculture%20-%20Kingston%20crop%20(1).png" },
    { id: 304, title: "AI avatar - UGC testimonial", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/UGC.png" },
    { id: 305, title: " Viral UGC  Reel", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/ugc%20avatar.png" },
    { id: 306, title: "Almonds.AI corporate", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Almonds.AI%20concept.compressed.png" },
    { id: 307, title: "Delivery App Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Beta24%20Delivery.compressed.png" },
    { id: 308, title: "Car Workshop Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Car%20mantra%20-%20mechanical.png" },
    { id: 309, title: "Eyewear Ad ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Eyewear%20Ad.png" },
    { id: 310, title: "Escale Dubai Clothing", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.png" },
    { id: 311, title: "Fashion-Co-Ord Set ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1)%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/sweetflee1.png" },
    { id: 312, title: "Fashion Trending Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/sweetflee2.png" },
    { id: 313, title: "Vibrant Clothing Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/sweetflee3.png" },
    { id: 314, title: "Summer-Wear Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).png" },
    { id: 315, title: "Escale-Dubai Dress", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).png" },
    { id: 316, title: "Real Estate IG Edit", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20real%20estate%20reel.compressed.png" },
    { id: 317, title: "Gujarati - Groundnut oil", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Gujarati%20-%20Groundnut%20oi.png" },
    { id: 318, title: "Harman tea concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Harman%20tea%20concep.png" },
    { id: 319, title: "Multivitamins Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Health%20-%20Multivitamin%20caps.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Health%20-%20Multivitamin%20caps.png" },
    { id: 320, title: "Travel Influencer", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar.compressed.png" },
    { id: 321, title: "UGC Influencer", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar%20(1).compressed.png" },
    { id: 322, title: "Life Style UGC", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar%20(2).compressed.png" },
    { id: 323, title: "Sleepera Mattress", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(3).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar%20(3).compressed.png" },
    { id: 324, title: "Travel UGC Reel", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(4).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar%20(4).compressed.png" },
    { id: 325, title: "Fashion UGC", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar%20(5).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar%20(5).compressed.png" },
    //{ id: 326, title: "Travel Influencer", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Influencer%20avatar.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar.png" },
    { id: 327, title: "Kitchenware - Seiken knife", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Kitchenware%20-%20Seiken%20knife.png" },
    { id: 328, title: "Malibhai concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Malibhai%20concept.compressed.png" },
    { id: 329, title: "Mezvo Tote bags", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Mezvo%20Tote%20bags.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Mezvo%20Tote%20bags.png" },
    { id: 330, title: "Modern Jewellery", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Modern%20Jewellery.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Modern%20Jewellery.png" },
    { id: 331, title: "NAFT academy", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/NAFT%20academy.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/NAFT%20academy.compressed.png" },
    { id: 332, title: "Petromaxx LPG", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Petromaxx%20LPG.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Petromaxx%20LPG.compressed.png" },
    { id: 333, title: "Cattlefeed Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Sardar%20cattlefeed.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Sardar%20cattlefeed.png" },
    { id: 334, title: "Selectric EV Scooters", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Selectric%20EV%20Scooters.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Selectric%20EV%20Scooters.png" },
    { id: 335, title: "Shobha Sarees", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Shobha%20Sarees.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Shobha%20Sarees.png" },
    { id: 336, title: "Supernova app - Avatar ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.png" },
    { id: 337, title: "UGC trending Avatar", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/ugc%20avatar.png" }
  ]),
];






// ── 3. Custom Category Group ──────────────────────────────────
export const PKG_TECH_UI: PackageProject[] = pkgGroup("#10b981", "#3b82f6", [
  { id: 501, title: "Malibhai concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Malibhai%20concept.compressed.png" },
  { id: 502, title: "Cosmetics - Aura concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Aura%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Aura%20concept.png" },
  { id: 503, title: "Product Animation", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Lipstick%20showreel%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Lipstick%20showreel%20(1).png" },
  { id: 504, title: "Fabluxe Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20properties%20-%20Real%20estate%20(1).png" },
  { id: 505, title: "Cosmetics Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20Music%20Video.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Itsme%20Music%20Video.png" },
  { id: 506, title: "Lifestyle UGC ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20travel%20(1).png" },
  { id: 507, title: "Greece Dress Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20travel%20(2).png" },
  { id: 508, title: "Travel UGC", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20Trave.png" },
  { id: 509, title: "Gauddly Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Gauddly%20Music%20Video.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Gauddly%20Music%20Video.png" }
]);

export const PKG_BRAND_FILM: PackageProject[] = [];

export const PKG_EXPERIMENTAL: PackageProject[] = [];
