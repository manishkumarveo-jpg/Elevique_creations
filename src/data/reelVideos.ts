// Reel videos shown in the PortfolioReels carousel (src/components/PortfolioReels.tsx).
// Sourced from Cloudflare R2. `videoSrc: undefined` means no clip is uploaded yet —
// the UI falls back to a poster/placeholder for that entry.
//
// `title` is derived automatically from the video file name in `videoSrc` —
// don't hand-write titles here. To add a clip, just add `{ id, videoSrc }` to
// the right accent group below.

import { expandWithMeta } from "@/lib/utils";

export interface ReelVideo {
  id: number;
  title: string;
  colorFrom: string;
  colorTo: string;
  videoSrc: string | undefined;
}

interface RawReel {
  id: number;
  videoSrc: string | undefined;
}

function reelGroup(colorFrom: string, colorTo: string, items: RawReel[]): ReelVideo[] {
  return expandWithMeta({ colorFrom, colorTo }, items);
}

export const REEL_VIDEOS: ReelVideo[] = [
  // ── Fashion & Lifestyle ── accent: pink → amber
  ...reelGroup("#ec4899", "#f59e0b", [
    { id: 1, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20Shoes%20showcase.mp4" },
    { id: 4, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/feature_sectoin/Forbes%20properties%20-%20Real%20estate%20-%20concept.MP4" },
    { id: 16, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(1).mp4" },
    { id: 18, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20shoes%20lifestyle.mp4" },
    { id: 22, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20shoes%20lifestyle.mp4" },
    { id: 24, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.mp4" },
    { id: 25, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Lifestyle%20-%20Retro%20concept%20Blush.mp4" },
    { id: 27, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Aura%20concept.mp4" },
    { id: 28, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.mp4" }, // not uploaded yet
  ]),

  // ── Real Estate ── accent: cyan → emerald
  ...reelGroup("#06b6d4", "#10b981", [
    { id: 2, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(8).mp4" },
    { id: 14, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Its%20me%20valentine_s%20concept.mp4" },
    { id: 17, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Eyewear%20premium.mp4" },
    { id: 23, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women_s%20Dress%20(1).mp4" },
  ]),

  // ── Beauty & Wellness ── accent: amber → pink
  ...reelGroup("#f59e0b", "#ec4899", [
    { id: 3, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC%20review%20Avatar.mp4" },
    { id: 5, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(5).mp4" },
    { id: 7, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(1).mp4" },
    { id: 9, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20scenario%20buildup%20(1).mp4" },
    { id: 11, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1).mp4" },
    { id: 12, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).mp4" },
    { id: 21, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Premium%20(3).mp4" },
    { id: 26, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(6).mp4" },
  ]),

  // ── FMCG ── accent: orange → yellow
  ...reelGroup("#f97316", "#eab308", [
    { id: 6, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).mp4" },
    { id: 20, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.mp4" }, // not uploaded yet
  ]),
];
