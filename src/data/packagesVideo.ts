export interface PackageProject {
  id: number;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  techStack: string[];
  colorFrom: string;
  colorTo: string;
  videoSrc?: string;
}

// ── 1. Signature Category Group ────────────────────────────────
export const PKG_AI_VISUALS: PackageProject[] = [
  {
    id: 101,
    title: "Elevique Creation",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Lifestyle%20-%20Eyewear%20premium.mp4",
  },
  {
    id: 102,
    title: "Elevique Creation",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Fashion%20&%20Lifestyle%20-%20Western%20blazer.mp4",
  },
  {
    id: 103,
    title: "AI Fashion Show",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Director & AI Stylist",
    description: "A virtual runway where AI-generated fashion meets avant-garde aesthetics.",
    techStack: ["AI Fashion", "Virtual Runway", "Motion Capture", "VFX"],
    colorFrom: "#ec4899",
    colorTo: "#f59e0b",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Travel%20&%20Holidays%20Co.mov",
  },
];

export const PKG_EDITORIAL: PackageProject[] = [
  {
    id: 201,
    title: "Fashion Film",
    category: "Editorial",
    year: "2023",
    role: "Cinematography & Edit",
    description: "Haute couture meets surrealism in a dreamlike sequence of fabric, motion, and identity.",
    techStack: ["AI Cinematics", "Editorial", "Sound Design", "Compositing"],
    colorFrom: "#e879f9",
    colorTo: "#7c3aed",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Shringar%20Jewellery%20(2).mp4",
  },
  {
    id: 202,
    title: "Future Cities",
    category: "Editorial",
    year: "2024",
    role: "Creative WebGL Engineer",
    description: "An architectural meditation on the cities we're building and the ones we dream.",
    techStack: ["Drone AI", "Photogrammetry", "WebGL", "GLSL"],
    colorFrom: "#06b6d4",
    colorTo: "#10b981",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Aar%20Kay%20Vox%20-%20music%20concept.mp4",
  },
  {
    id: 203,
    title: "Legacy Story",
    category: "Editorial",
    year: "2023",
    role: "Director & Editor",
    description: "A long-form editorial piece tracing the arc of craft, memory, and belonging.",
    techStack: ["AI Cinematics", "Editorial", "Colour Science", "Compositing"],
    colorFrom: "#e879f9",
    colorTo: "#7c3aed",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Forbes%20properties%20-%20Real%20estate.mp4",
  },
];

// ── 2. Impact Category Group ──────────────────────────────────
export const PKG_PRODUCT_FILM: PackageProject[] = [
  {
    id: 301,
    title: "Automotive Launch",
    category: "Product Film",
    year: "2024",
    role: "Interactive Frontend",
    description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
    techStack: ["3D Render", "AI Upscale", "Particle FX", "WebGL"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Lifestyle%20-%20Retro%20concept%20Blush.mp4",
  },
  {
    id: 302,
    title: "Product Render",
    category: "Product Film",
    year: "2023",
    role: "3D Specialist",
    description: "Hyper-real product cinematics that dissolve the line between render and reality.",
    techStack: ["Blender", "AI Texture", "Redshift", "Nuke"],
    colorFrom: "#f97316",
    colorTo: "#eab308",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Electronics%20-%20Cooler%20Ad.mp4",
  },
  {
    id: 303,
    title: "Cooler Ad",
    category: "Product Film",
    year: "2023",
    role: "Product Cinematographer",
    description: "Crisp product storytelling that puts function and form centre stage.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/KM%20Hospital%20-%20Scenario%20stories%20(3)_compressed.mp4",
  },
  {
    id: 304,
    title: "Cooler Ad",
    category: "Product Film",
    year: "2023",
    role: "Product Cinematographer",
    description: "Crisp product storytelling that puts function and form centre stage.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/UGC%20trending%20Avatar.mp4",
  },
];

export const PKG_BRAND_FILM: PackageProject[] = [
  {
    id: 401,
    title: "Luxury Perfume",
    category: "Brand Film",
    year: "2024",
    role: "Packaging & Brand System",
    description: "Sensory storytelling distilled into 60 seconds of atmospheric brand cinema.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#f59e0b",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Car%20mantra%20-%20mechanical.mov",
  },
  {
    id: 402,
    title: "Luxury Spot",
    category: "Brand Film",
    year: "2024",
    role: "Creative Lead",
    description: "Ultra-premium brand storytelling with a focus on material and mood.",
    techStack: ["Product Viz", "Motion Graphics", "Colour Science", "Grade"],
    colorFrom: "#f59e0b",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Ladakh%20Bike%20tours%20-%20Avatar.mp4",
  },
];

// ── 3. Custom Category Group ──────────────────────────────────
export const PKG_TECH_UI: PackageProject[] = [
  {
    id: 501,
    title: "Fan Interface",
    category: "Tech / UI",
    year: "2024",
    role: "UI Motion Designer",
    description: "Kinetic UI animation built around airflow dynamics and thermal intelligence.",
    techStack: ["UI Animation", "After Effects", "Lottie", "WebGL"],
    colorFrom: "#10b981",
    colorTo: "#3b82f6",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Animated%20movie%20-%20Malibhai.mp4",
  },
  {
    id: 502,
    title: "Real Estate OS",
    category: "Tech / UI",
    year: "2024",
    role: "WebGL Developer",
    description: "An interactive property platform where architecture meets data visualisation.",
    techStack: ["WebGL", "Three.js", "GLSL", "React"],
    colorFrom: "#10b981",
    colorTo: "#3b82f6",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Cosmetics%20-%20Premium%20(5).mp4",
  },
];

export const PKG_EXPERIMENTAL: PackageProject[] = [
  {
    id: 601,
    title: "Multivitamin Caps",
    category: "Experimental",
    year: "2024",
    role: "Visual Alchemist",
    description: "Abstract product imagery where science and surrealism blur into visual poetry.",
    techStack: ["Macro Photography", "AI Enhancement", "Color Grading", "VFX"],
    colorFrom: "#8b5cf6",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Its%20me%20music%20video.mp4",
  },
  {
    id: 602,
    title: "Multivitamin Caps",
    category: "Experimental",
    year: "2024",
    role: "Visual Alchemist",
    description: "Abstract product imagery where science and surrealism blur into visual poetry.",
    techStack: ["Macro Photography", "AI Enhancement", "Color Grading", "VFX"],
    colorFrom: "#8b5cf6",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Mezvo%20Tote%20bags.mp4",
  },
];
