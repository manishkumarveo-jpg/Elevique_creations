// Reel videos shown in the PortfolioReels carousel (src/components/PortfolioReels.tsx).
// Order here is the literal display order in the carousel.
// `videoSrc: undefined` means no clip is uploaded yet — the UI falls back to a poster/placeholder for that entry.

export interface ReelVideo {
  id: number;
  title: string;
  colorFrom: string;
  colorTo: string;
  videoSrc: string | undefined;
}

export const REEL_VIDEOS: ReelVideo[] = [
  { id: 1, title: "Cult Shoes Showcase", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20Shoes%20showcase.mp4" },
  { id: 2, title: "Forbes Properties Real Estate", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate.mp4" },
  { id: 3, title: "Premium Cosmetics", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(1).mp4" },
  { id: 4, title: "Cult Shoes Lifestyle", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20shoes%20lifestyle.mp4" },
  { id: 5, title: "Lipstick Showreel", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Lipstick%20showreel.mp4" },
  { id: 6, title: "Tweak Tea Sachets", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Tweak%20Tea%20Experience.mp4" },
  { id: 7, title: "Lifestyle Retro Concept Blush", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Lifestyle%20-%20Retro%20concept%20Blush.mp4" },
  { id: 8, title: "Kobala", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/feature_sectoin/Kobala.mp4" },
  { id: 9, title: "Aura Cosmetics", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Aura%20concept.mp4" },
  { id: 10, title: "AI Avatar UGC Testimonial", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.mp4" },
  { id: 11, title: "Premium Cosmetics", colorFrom: "#06b6d4", colorTo: "#10b981", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(8).mp4" },
  { id: 12, title: "Its Me - Concept Reel", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Itsme%20-%20concept%20reel.mp4" },
  { id: 13, title: "North East Cultural", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: undefined },
  { id: 14, title: "Aar Kay Vox News Hook", colorFrom: "#06b6d4", colorTo: "#10b981", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20News%20Hook.mp4" },
  { id: 15, title: "Sapphire Bloom", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: undefined },
  { id: 16, title: "Lifestyle Eyewear Premium", colorFrom: "#06b6d4", colorTo: "#10b981", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Eyewear%20premium.mp4" },
  { id: 17, title: "Forbes Real Estate Reel", colorFrom: "#06b6d4", colorTo: "#10b981", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20real%20estate%20reel.MP4" },
  { id: 18, title: "Fashion & Lifestyle Women's Dress", colorFrom: "#06b6d4", colorTo: "#10b981", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women_s%20Dress%20(1).mp4" },
  { id: 19, title: "UGC Review Avatar", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC%20review%20Avatar.mp4" },
  { id: 20, title: "Tweak Tea Reel", colorFrom: "#f97316", colorTo: "#eab308", videoSrc: undefined },
  { id: 21, title: "Premium Cosmetics", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(5).mp4" },
  { id: 22, title: "Influencer Avatar", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(1).mp4" },
  { id: 23, title: "Aar Kay Vox Scenario Buildup", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20scenario%20buildup%20(1).mp4" },
  { id: 24, title: "Fashion & Lifestyle Sweetfeel", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1).mp4" },
  { id: 25, title: "Lifestyle Travel", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).mp4" },
  { id: 26, title: "Premium Cosmetics", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(6).mp4" },
  { id: 27, title: "Fashion & Lifestyle Sweetfeel", colorFrom: "#f97316", colorTo: "#eab308", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).mp4" },
  { id: 28, title: "Mezvo Tote Bags", colorFrom: "#f97316", colorTo: "#eab308", videoSrc: undefined },
  { id: 29, title: "Almonds.AI Concept", colorFrom: "#f97316", colorTo: "#eab308", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.mp4" },

  // ── Not in the requested sequence — appended at the end ──
  { id: 30, title: "Fashion & Lifestyle Premium", colorFrom: "#f59e0b", colorTo: "#ec4899", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Premium%20(3).mp4" },
  { id: 31, title: "Its Me Valentine's Concept", colorFrom: "#06b6d4", colorTo: "#10b981", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Its%20me%20valentine_s%20concept.mp4" },
  { id: 32, title: "Harman Tea Concept", colorFrom: "#ec4899", colorTo: "#f59e0b", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.mp4" },
];
