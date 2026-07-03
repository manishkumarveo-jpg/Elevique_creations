// `title` is pre-filled from the video file name — edit it freely per entry.

import { expandWithMeta } from "@/lib/utils";

export interface GridProject {
  id: number;
  title: string;
  category?: string;
  colorFrom?: string;
  colorTo?: string;
  videoSrc?: string;
  /** Poster image URL — fill in manually; falls back to a black card until set. */
  thumbnail?: string;
}

interface RawGridProject {
  id: number;
  title?: string;
  videoSrc?: string;
  thumbnail?: string;
}

function gridGroup(category: string, items: RawGridProject[]): GridProject[] {
  return expandWithMeta({ category }, items);
}

// ── 1. Beauty, Wellness & Personal Care ───────────────────────
export const AI_VISUALS: GridProject[] = [
  ...gridGroup(
    "Beauty, Wellness & Personal Care",
    [
      { id: 1, title: "Amanzi air freshner ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Amanzi%20air%20freshner%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/.%20Amanzi%20air%20freshner%20(1).png" },
      { id: 2, title: "Cosmetics - Aura concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Aura%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Aura%20concept.png" },
    ]
  ),
  ...gridGroup(
    "Beauty, Wellness & Personal Care",
    [
      { id: 3, title: "Cosmetics - Lipstick showreel", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Lipstick%20showreel%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Lipstick%20showreel%20(1).png" },
      { id: 4, title: "cosmetics-premium-2", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-2_W9t1Rfpi.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-2_W9t1Rfpi.png" },
      { id: 5, title: "cosmetics-premium-3", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-3_sEU6FwG4.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-3_sEU6FwG4.png" },
      { id: 6, title: "cosmetics-premium-4", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-4_x5GOdpeM.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-4_x5GOdpeM.png" },
      { id: 7, title: "cosmetics-premium-5", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/cosmetics-premium-5_L1zn11cX.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cosmetics-premium-5_L1zn11cX.png" },
      { id: 8, title: "Cosmetics - Premium (6)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(6)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(6)_compressed.png" },
      { id: 9, title: "Cosmetics - Premium (7)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(7)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(7)_compressed.png" },
      { id: 10, title: "Cosmetics - Premium (8)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(8)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(8)_compressed.png" },
      { id: 11, title: "Cosmetics - Premium (9)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(9)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(9).png" },
      { id: 12, title: "Cosmetics - Premium (9)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Cosmetics%20-%20Premium%20(9)_compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cosmetics%20-%20Premium%20(9)_compressed.png" },
      { id: 13, title: "Health - Multivitamin caps", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Health%20-%20Multivitamin%20caps.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Health%20-%20Multivitamin%20caps.png" },
      { id: 14, title: "Its me valentine's concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Its%20me%20valentine's%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Its%20me%20valentine's%20concept.compressed.png" },
      { id: 15, title: "Itsme Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20Music%20Video.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Itsme%20Music%20Video.png" },
      { id: 16, title: "KM Hospital - Scenario stories (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.png" },
      { id: 17, title: "KM Hospital - Scenario stories (2)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.png" },
      { id: 18, title: "KM Hospital - Scenario stories (3)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.png" },
      { id: 19, title: "KM Hospital - Scenario stories (4)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.png" },
      { id: 20, title: "Lifestyle - Retro concept Blush", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Lifestyle%20-%20Retro%20concept%20Blush.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/retro.png" },
      { id: 21, title: "Purelab Facewash", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Facewash.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Purelab%20Facewash.compressed.png" },
      { id: 22, title: "Purelab Serum", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Serum.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Purelab%20Serum.compressed.png" },
      { id: 23, title: "Purelab Shampoo", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Purelab%20Shampoo.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Purelab%20Shampoo.compressed.png" },
    ]
  ),
];

// ── 2. Fashion & Lifestyle ───────────────────────────────────
export const EDITORIAL: GridProject[] = [
  ...gridGroup(
    "Fashion & Lifestyle",
    [{ id: 24, title: "Auserio - Formal shoes", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Auserio%20-%20Formal%20shoes.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Auserio%20-%20Formal%20shoes.png" }]
  ),
  ...gridGroup(
    "Fashion & Lifestyle",
    [{ id: 25, title: "Bulgari premium concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Bulgari%20premium%20concept.png" }]
  ),
  ...gridGroup(
    "Fashion & Lifestyle",
    [
      { id: 26, title: "Cult Shoes showcase", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20Shoes%20showcase.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cult%20.png" },
      { id: 27, title: "Cult shoes lifestyle", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20shoes%20lifestyle.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Cult%20shoes%20lifestyle.png" },
      { id: 28, title: "Eyewear Ad (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Eyewear%20Ad.png" },
      { id: 29, title: "Fashion & Lifestyle - Escale Dubai", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.png" },
      { id: 30, title: "Fashion & Lifestyle - Sweetfeel (1) ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1)%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/sweetflee1.png" },
      { id: 31, title: "Fashion & Lifestyle - Sweetfeel (2)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).png" },
      { id: 32, title: "Fashion & Lifestyle - Sweetfeel (3)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/sweetflee3.png" },
      { id: 33, title: "Fashion & Lifestyle - Sweetfeel (4)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).png" },
      { id: 34, title: "Fashion & Lifestyle - Women's Dress (2)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Fashion%20%26%20Lifestyle%20-%20Women's%20Dress%20(2).png" },
      { id: 35, title: "Influencer avatar", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Influencer%20avatar.compressed.png" },
      { id: 36, title: "Lifestyle - Eyewear premium", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Eyewear%20premium.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20Eyewear%20premium.png" },
      { id: 37, title: "Lifestyle - Travel", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20Trave.png" },
      { id: 38, title: "Lifestyle - travel (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20travel%20(1).png" },
      { id: 39, title: "Lifestyle - travel (2)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20-%20travel%20(2).png" },
      { id: 40, title: "Lifestyle Motions", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20Motions.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Lifestyle%20Motions.png" },
      { id: 41, title: "Mezvo Tote bags", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Mezvo%20Tote%20bags.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Mezvo%20Tote%20bags.png" },
      { id: 42, title: "Modern Jewellery", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Modern%20Jewellery.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Modern%20Jewellery.png" },
      { id: 43, title: "NAFT academy", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/NAFT%20academy.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/NAFT%20academy.compressed.png" },
      { id: 44, title: "North east Cultural", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/North%20east%20Cultural.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/North%20east%20Cultural.png" },
      { id: 45, title: "Sapphire Bloom", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Sapphire%20Bloom.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Sapphire%20Bloom.png" },
      { id: 46, title: "Shobha Sarees", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Shobha%20Sarees.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Shobha%20Sarees.png" },
      { id: 47, title: "Itsme red carpet", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20red%20carpet.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Itsme%20red%20carpet.png" }
    ]
  ),
];

// ── 3. Food & Beverages ──────────────────────────────────────
export const PRODUCT_FILM: GridProject[] = gridGroup(
  "Food & Beverages",
  [
    { id: 47, title: "Agriculture - Kingston crop (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Agriculture%20-%20Kingston%20crop%20(1).png" },
    { id: 48, title: "Agriculture - growupmytree.", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Agriculture%20-%20growupmytree.png" },
    { id: 49, title: "Gujarati - Groundnut oil.", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Gujarati%20-%20Groundnut%20oi.png" },
    { id: 50, title: "Kitchenware - Seiken knife", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Kitchenware%20-%20Seiken%20knife.png" },
    { id: 51, title: "Harman tea concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Harman%20tea%20concep.png" },
    { id: 52, title: "Sardar cattlefeed", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Sardar%20cattlefeed.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Sardar%20cattlefeed.png" },
    { id: 53, title: "Tweak Tea Experience", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20Experience.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Tweak%20Tea%20Experience.png" },
    { id: 54, title: "Tweak Tea machine short (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20machine%20short%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Tweak%20Tea%20machine%20short%20(1)..png" },
    { id: 55, title: "Tweak Tea machine short", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20machine%20short.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Tweak%20Tea%20machine%20short.png" },
    { id: 56, title: "Tweak Tea reel (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20reel%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Tweak%20Tea%20reel%20(1).png" },
    { id: 58, title: "Tweak Tea sachets", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20sachets.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Tweak%20Tea%20sachets.png" }
  ]
);

// ── 4. Personal Branding & Creators ──────────────────────────
export const BRAND_FILM: GridProject[] = [
  ...gridGroup(
    "Personal Branding & Creators",
    [{ id: 59, title: "UGC trending Avatar (1) ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/UGC%20trending%20Avatar%20(1)%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/ugc%20avatar.png" }]
  ),
  ...gridGroup(
    "Personal Branding & Creators",
    [
      { id: 60, title: "Ekincare Health app", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/Ekincare%20Health%20app.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/ekincare.png" },
      { id: 61, title: "Supernova.Ai app - Avatar (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Supernova.Ai%20app%20-%20Avatar%20(1).compressed.png" },

    ]
  ),
];

// ── 5. Real Estate & Spaces ──────────────────────────────────
export const TECH_UI: GridProject[] = [
  ...gridGroup(
    "Real Estate & Spaces",
    [{ id: 63, title: "Aar Kay Vox - News Hook", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20News%20Hook.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Aar%20Kay%20Vox%20-%20News%20Hook.png" }]
  ),
  ...gridGroup(
    "Real Estate & Spaces",
    [{ id: 64, title: "Aar Kay Vox - music concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Aar%20Kay%20Vox%20-%20music%20concept.png" }]
  ),
  ...gridGroup(
    "Real Estate & Spaces",
    [
      { id: 65, title: "Aar Kay Vox - scenario buildup (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20scenario%20buildup%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Aar%20Kay%20Vox%20-%20scenario%20buildup%20(1).png" },
      { id: 66, title: "Aar Kay Vox UK - Luxury", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Aar%20Kay%20Vox%20UK%20-%20Luxury.png" },
      { id: 68, title: "Forbes properties - Real estate (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20properties%20-%20Real%20estate%20(1).png" },
      { id: 69, title: "Forbes properties - Real estate (2)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20properties%20-%20Real%20estate%20(2).png" },
      { id: 70, title: "Forbes properties - Real estate - concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20-%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20properties%20-%20Real%20estate%20-%20concept.png" },
      { id: 71, title: "Forbes properties - Real estate", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20properties%20-%20Real%20estate.png" },
      { id: 72, title: "Forbes real estate reel", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20real%20estate%20reel.compressed.png" },
      { id: 73, title: "KM Hospital - Scenario stories (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(1).compressed.png" },
      { id: 74, title: "KM Hospital - Scenario stories (2)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(2).compressed.png" },
      { id: 75, title: "KM Hospital - Scenario stories (3)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(3).compressed.png" },
      { id: 76, title: "KM Hospital - Scenario stories (4)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/KM%20Hospital%20-%20Scenario%20stories%20(4).compressed.png" },
      { id: 77, title: "Luxury reel version", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/luxury.png" },
      { id: 78, title: "Malibhai concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Malibhai%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Malibhai%20concept.compressed.png" }
    ]
  ),
];

// ── 6. Tech, auto & Industrial ───────────────────────────────
export const EXPERIMENTAL: GridProject[] = gridGroup(
  "Tech, auto & Industrial",
  [
    { id: 79, title: "Almonds.AI concept", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Almonds.AI%20concept.compressed.png" },
    { id: 80, title: "Beta24 Delivery", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Beta24%20Delivery.compressed.png" },
    { id: 81, title: "Bigxera - Tiles mixture", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Bigxera%20-%20Tiles%20mixture.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Bigxera%20-%20Tiles%20mixture.compressed.png" },
    { id: 82, title: "Car mantra - mechanical", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Car%20mantra%20-%20mechanical.png" },
    { id: 83, title: "Chemtiver chemicals", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Chemtiver%20chemicals.compressed.png" },
    { id: 84, title: "Electronics - Fan Ad", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Electronics%20-%20Fan%20Ad.compressed.png" },
    { id: 85, title: "FieldMarshal Trucks", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/FieldMarshal%20Trucks.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/FieldMarshal%20Trucks.compressed.png" },
    { id: 86, title: "Hyginest - Brand video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Hyginest%20-%20Brand%20video.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Hyginest%20-%20Brand%20video.compressed.png" },
    { id: 87, title: "Mahindra XEV car (1)", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Mahindra%20XEV%20car%20(1).compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Mahindra%20XEV%20car%20(1).compressed.png" },
    { id: 88, title: "Petromaxx LPG", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Petromaxx%20LPG.compressed.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Petromaxx%20LPG.compressed.png" },
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
