// `title` is derived automatically from the video file name in `videoSrc` —
// don't hand-write titles here. To add a clip, add `{ id, videoSrc }` to the
// matching meta-variant group below (or start a new group if the
// category/role/description/techStack differs).

import { expandWithMeta } from "@/lib/utils";

export interface GridProject {
  id: number;
  title: string;
  category?: string;
  year?: string;
  role?: string;
  description?: string;
  techStack?: string[];
  colorFrom?: string;
  colorTo?: string;
  videoSrc?: string;
}

interface RawGridProject {
  id: number;
  videoSrc?: string;
}

interface GridMeta {
  category: string;
  year: string;
  role: string;
  description: string;
  techStack: string[];
}

function gridGroup(meta: GridMeta, items: RawGridProject[]): GridProject[] {
  return expandWithMeta(meta, items);
}

// ── 1. Beauty, Wellness & Personal Care ───────────────────────
export const AI_VISUALS: GridProject[] = [
  ...gridGroup(
    {
      category: "Beauty, Wellness & Personal Care",
      year: "2024",
      role: "Creative Direction",
      description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
      techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    },
    [
      { id: 1, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Amanzi%20air%20freshner.mp4" },
      { id: 2, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Aura%20concept.mp4" },
    ]
  ),
  ...gridGroup(
    {
      category: "Beauty, Wellness & Personal Care",
      year: "2024",
      role: "Creative Director & AI Stylist",
      description: "A virtual runway where AI-generated fashion meets avant-garde aesthetics.",
      techStack: ["AI Fashion", "Virtual Runway", "Motion Capture", "VFX"],
    },
    [
      { id: 3, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Lipstick%20showreel.mp4" },
      { id: 4, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(1).mp4" },
      { id: 5, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(2).mp4" },
      { id: 6, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(3).mp4" },
      { id: 7, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(4).mp4" },
      { id: 8, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(5).mp4" },
      { id: 9, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(6).mp4" },
      { id: 10, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(7).mp4" },
      { id: 11, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(8).mp4" },
      { id: 12, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Cosmetics%20-%20Premium%20(9).mp4" },
      { id: 13, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Health%20-%20Multivitamin%20caps.mov" },
      { id: 14, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Its%20me%20valentine_s%20concept.mp4" },
      { id: 15, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Itsme%20-%20concept%20reel.mp4" },
      { id: 16, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(1).mp4" },
      { id: 17, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(2).mp4" },
      { id: 18, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(3).mp4" },
      { id: 19, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/KM%20Hospital%20-%20Scenario%20stories%20(4).mp4" },
      { id: 20, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Lifestyle%20-%20Retro%20concept%20Blush.mp4" },
      { id: 21, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Purelab%20Facewash.mp4" },
      { id: 22, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Purelab%20Serum.mp4" },
      { id: 23, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/grid_videos/Beauty%2C%20Wellness%20%26%20Personal%20Care/Purelab%20Shampoo.mp4" },
    ]
  ),
];

// ── 2. Fashion & Lifestyle ───────────────────────────────────
export const EDITORIAL: GridProject[] = [
  ...gridGroup(
    {
      category: "Fashion & Lifestyle",
      year: "2023",
      role: "Cinematography & Edit",
      description: "Haute couture meets surrealism in a dreamlike sequence of fabric, motion, and identity.",
      techStack: ["AI Cinematics", "Editorial", "Sound Design", "Compositing"],
    },
    [{ id: 24, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Auserio%20-%20Formal%20shoes.mp4" }]
  ),
  ...gridGroup(
    {
      category: "Fashion & Lifestyle",
      year: "2024",
      role: "Creative WebGL Engineer",
      description: "An architectural meditation on the cities we're building and the ones we dream.",
      techStack: ["Drone AI", "Photogrammetry", "WebGL", "GLSL"],
    },
    [{ id: 25, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Bulgari%20premium%20concept.mov" }]
  ),
  ...gridGroup(
    {
      category: "Fashion & Lifestyle",
      year: "2023",
      role: "Director & Editor",
      description: "A long-form editorial piece tracing the arc of craft, memory, and belonging.",
      techStack: ["AI Cinematics", "Editorial", "Colour Science", "Compositing"],
    },
    [
      { id: 26, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20Shoes%20showcase.mp4" },
      { id: 27, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Cult%20shoes%20lifestyle.mp4" },
      { id: 28, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Eyewear%20Ad.mov" },
      { id: 29, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Dual%20models.mp4" },
      { id: 30, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Escale%20Dubai.mp4" },
      { id: 31, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(1).mp4" },
      { id: 32, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(2).mp4" },
      { id: 33, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(3).mp4" },
      { id: 34, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Sweetfeel%20(4).mp4" },
      { id: 35, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women_s%20Dress%20(1).mp4" },
      { id: 36, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Western%20blazer.mp4" },
      { id: 37, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Fashion%20%26%20Lifestyle%20-%20Women_s%20Dress%20(2).mp4" },
      { id: 38, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(1).mp4" },
      { id: 39, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(2).mp4" },
      { id: 40, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(3).mp4" },
      { id: 41, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(4).mp4" },
      { id: 42, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar%20(5).mp4" },
      { id: 43, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Influencer%20avatar.mp4" },
      { id: 44, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Itsme%20red%20carpet.mp4" },
      { id: 45, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Eyewear%20premium.mp4" },
      { id: 46, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20Travel.mp4" },
      { id: 47, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Lifestyle%20-%20travel%20(1).mp4" },
    ]
  ),
];

// ── 3. Food & Beverages ──────────────────────────────────────
export const PRODUCT_FILM: GridProject[] = gridGroup(
  {
    category: "Food & Beverages",
    year: "2024",
    role: "Interactive Frontend",
    description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
    techStack: ["3D Render", "AI Upscale", "Particle FX", "WebGL"],
  },
  [
    { id: 48, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20Kingston%20crop.mov" },
    { id: 49, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Agriculture%20-%20growupmytree.mp4" },
    { id: 50, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/GNPL%20snacks%20manufacturing.mp4" },
    { id: 51, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Gujarati%20-%20Groundnut%20oil.mp4" },
    { id: 52, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Harman%20tea%20concept.mp4" },
    { id: 53, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Kitchenware%20-%20Seiken%20knife.mov" },
    { id: 54, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Sardar%20cattlefeed.mp4" },
  ]
);

// ── 4. Personal Branding & Creators ──────────────────────────
export const BRAND_FILM: GridProject[] = [
  ...gridGroup(
    {
      category: "Personal Branding & Creators",
      year: "2024",
      role: "Packaging & Brand System",
      description: "Sensory storytelling distilled into 60 seconds of atmospheric brand cinema.",
      techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    },
    [{ id: 55, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/AI%20avatar%20-%20UGC%20testimonial.mp4" }]
  ),
  ...gridGroup(
    {
      category: "Personal Branding & Creators",
      year: "2024",
      role: "Interactive Frontend",
      description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
      techStack: ["3D Render", "AI Upscale", "Particle FX", "WebGL"],
    },
    [
      { id: 56, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/Ekincare%20Health%20app.mp4" },
      { id: 57, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/Supernova.Ai%20app%20-%20Avatar.mp4" },
      { id: 58, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Personal%20Branding/UGC%20review%20Avatar.mp4" },
    ]
  ),
];

// ── 5. Real Estate & Spaces ──────────────────────────────────
export const TECH_UI: GridProject[] = [
  ...gridGroup(
    {
      category: "Real Estate & Spaces",
      year: "2024",
      role: "UI Motion Designer",
      description: "Kinetic UI animation built around airflow dynamics and thermal intelligence.",
      techStack: ["UI Animation", "After Effects", "Lottie", "WebGL"],
    },
    [{ id: 59, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20News%20Hook.mp4" }]
  ),
  ...gridGroup(
    {
      category: "Real Estate & Spaces",
      year: "2024",
      role: "WebGL Developer",
      description: "An interactive property platform where architecture meets data visualisation.",
      techStack: ["WebGL", "Three.js", "GLSL", "React"],
    },
    [{ id: 60, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20music%20concept.mp4" }]
  ),
  ...gridGroup(
    {
      category: "Real Estate & Spaces",
      year: "2024",
      role: "Interactive Frontend",
      description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
      techStack: ["3D Render", "AI Upscale", "Particle FX", "WebGL"],
    },
    [
      { id: 61, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20-%20scenario%20buildup%20(1).mp4" },
      { id: 62, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Christmas%20concept.mp4" },
      { id: 63, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Legacy%20story.mov" },
      { id: 64, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20Luxury.mov" },
      { id: 65, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Aar%20Kay%20Vox%20UK%20-%20New%20Year.mp4" },
      { id: 66, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(1).mp4" },
      { id: 67, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20(2).mp4" },
      { id: 68, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate%20-%20concept.MP4" },
      { id: 69, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Forbes%20properties%20-%20Real%20estate.mp4" },
      { id: 70, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(1).mp4" },
      { id: 71, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/KM%20Hospital%20-%20Scenario%20stories%20(2).mp4" },
      { id: 72, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/real%20Estate/Luxury%20reel%20version.mp4" },
    ]
  ),
];

// ── 6. Tech, auto & Industrial ───────────────────────────────
export const EXPERIMENTAL: GridProject[] = gridGroup(
  {
    category: "Tech, auto & Industrial",
    year: "2024",
    role: "Visual Alchemist",
    description: "Abstract product imagery where science and surrealism blur into visual poetry.",
    techStack: ["Macro Photography", "AI Enhancement", "Color Grading", "VFX"],
  },
  [
    { id: 73, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Almonds.AI%20concept.mp4" },
    { id: 74, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Beta24%20Delivery.mp4 " },
    { id: 75, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Bigxera%20-%20Tiles%20mixture.mp4" },
    { id: 76, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Car%20mantra%20-%20mechanical.mov" },
    { id: 77, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Chemtiver%20chemicals.mp4" },
    { id: 78, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Cooler%20Ad.mp4" },
    { id: 79, videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Tech%20auto%2CIndustry/Electronics%20-%20Fan%20Ad.mp4" },
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
