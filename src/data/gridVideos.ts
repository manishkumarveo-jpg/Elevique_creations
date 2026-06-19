export interface GridProject {
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

// ── 1. AI Visuals ─────────────────────────────────────────────
export const AI_VISUALS: GridProject[] = [
  {
    id: 1,
    title: "Elevique Creation",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Malibhai%20concept.mp4",
  },
  {
    id: 2,
    title: "Elevique Creation",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/AI%20avatar%20-%20UGC%20testimonial.mp4",
  },
  {
    id: 3,
    title: "AI Fashion Show",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Director & AI Stylist",
    description: "A virtual runway where AI-generated fashion meets avant-garde aesthetics.",
    techStack: ["AI Fashion", "Virtual Runway", "Motion Capture", "VFX"],
    colorFrom: "#ec4899",
    colorTo: "#f59e0b",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Influencer%20avatar.mp4",
  },
];

// ── 2. Editorial ──────────────────────────────────────────────
export const EDITORIAL: GridProject[] = [
  {
    id: 1,
    title: "Fashion Film",
    category: "Editorial",
    year: "2023",
    role: "Cinematography & Edit",
    description: "Haute couture meets surrealism in a dreamlike sequence of fabric, motion, and identity.",
    techStack: ["AI Cinematics", "Editorial", "Sound Design", "Compositing"],
    colorFrom: "#e879f9",
    colorTo: "#7c3aed",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Fashion%20&%20Lifestyle%20-%20Dual%20models.mp4",
  },
  {
    id: 2,
    title: "Future Cities",
    category: "Editorial",
    year: "2024",
    role: "Creative WebGL Engineer",
    description: "An architectural meditation on the cities we're building and the ones we dream.",
    techStack: ["Drone AI", "Photogrammetry", "WebGL", "GLSL"],
    colorFrom: "#06b6d4",
    colorTo: "#10b981",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Travel%20&%20Holidays%20Co.mov",
  },
  {
    id: 3,
    title: "Legacy Story",
    category: "Editorial",
    year: "2023",
    role: "Director & Editor",
    description: "A long-form editorial piece tracing the arc of craft, memory, and belonging.",
    techStack: ["AI Cinematics", "Editorial", "Colour Science", "Compositing"],
    colorFrom: "#e879f9",
    colorTo: "#7c3aed",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Aar%20Kay%20Vox%20UK%20-%20Legacy%20story.mov",
  },
];

// ── 3. Product Film ───────────────────────────────────────────
export const PRODUCT_FILM: GridProject[] = [
  {
    id: 1,
    title: "Automotive Launch",
    category: "Product Film",
    year: "2024",
    role: "Interactive Frontend",
    description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
    techStack: ["3D Render", "AI Upscale", "Particle FX", "WebGL"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Car%20mantra%20-%20mechanical.mov",
  },
  {
    id: 2,
    title: "Product Render",
    category: "Product Film",
    year: "2023",
    role: "3D Specialist",
    description: "Hyper-real product cinematics that dissolve the line between render and reality.",
    techStack: ["Blender", "AI Texture", "Redshift", "Nuke"],
    colorFrom: "#f97316",
    colorTo: "#eab308",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Petromaxx%20LPG.mp4",
  },
  {
    id: 3,
    title: "Cooler Ad",
    category: "Product Film",
    year: "2023",
    role: "Product Cinematographer",
    description: "Crisp product storytelling that puts function and form centre stage.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Electronics%20-%20Cooler%20Ad.mp4",
  },
  {
    id: 4,
    title: "Cooler Ad",
    category: "Product Film",
    year: "2023",
    role: "Product Cinematographer",
    description: "Crisp product storytelling that puts function and form centre stage.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Kitchenware%20-%20Seiken%20knife.mov",
  },
];

// ── 4. Brand Film ─────────────────────────────────────────────
export const BRAND_FILM: GridProject[] = [
  {
    id: 1,
    title: "Luxury Perfume",
    category: "Brand Film",
    year: "2024",
    role: "Packaging & Brand System",
    description: "Sensory storytelling distilled into 60 seconds of atmospheric brand cinema.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#f59e0b",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Bulgari%20premium%20concept.mov",
  },
  {
    id: 2,
    title: "Luxury Spot",
    category: "Brand Film",
    year: "2024",
    role: "Creative Lead",
    description: "Ultra-premium brand storytelling with a focus on material and mood.",
    techStack: ["Product Viz", "Motion Graphics", "Colour Science", "Grade"],
    colorFrom: "#f59e0b",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Cosmetics%20-%20Premium%20(1).mp4",
  },
];

// ── 5. Tech / UI ──────────────────────────────────────────────
export const TECH_UI: GridProject[] = [
  {
    id: 1,
    title: "Fan Interface",
    category: "Tech / UI",
    year: "2024",
    role: "UI Motion Designer",
    description: "Kinetic UI animation built around airflow dynamics and thermal intelligence.",
    techStack: ["UI Animation", "After Effects", "Lottie", "WebGL"],
    colorFrom: "#10b981",
    colorTo: "#3b82f6",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Electronics%20-%20Fan%20Ad.mp4",
  },
  {
    id: 2,
    title: "Real Estate OS",
    category: "Tech / UI",
    year: "2024",
    role: "WebGL Developer",
    description: "An interactive property platform where architecture meets data visualisation.",
    techStack: ["WebGL", "Three.js", "GLSL", "React"],
    colorFrom: "#10b981",
    colorTo: "#3b82f6",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Forbes%20properties%20-%20Real%20estate.mp4",
  },
];

// ── 6. Experimental ───────────────────────────────────────────
export const EXPERIMENTAL: GridProject[] = [
  {
    id: 1,
    title: "Multivitamin Caps",
    category: "Experimental",
    year: "2024",
    role: "Visual Alchemist",
    description: "Abstract product imagery where science and surrealism blur into visual poetry.",
    techStack: ["Macro Photography", "AI Enhancement", "Color Grading", "VFX"],
    colorFrom: "#8b5cf6",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Health%20-%20Multivitamin%20caps.mov",
  },
  {
    id: 2,
    title: "Multivitamin Caps",
    category: "Experimental",
    year: "2024",
    role: "Visual Alchemist",
    description: "Abstract product imagery where science and surrealism blur into visual poetry.",
    techStack: ["Macro Photography", "AI Enhancement", "Color Grading", "VFX"],
    colorFrom: "#8b5cf6",
    colorTo: "#ec4899",
    videoSrc: "https://gqgzhfsqukqoweceyyhd.supabase.co/storage/v1/object/public/reel-videos/Almonds.AI%20concept.mp4",
  },
];

// ── Combined (used by FeaturedShowcase category rows) ─────────
export const GRID_PROJECTS: GridProject[] = [
  ...AI_VISUALS,
  ...EDITORIAL,
  ...PRODUCT_FILM,
  ...BRAND_FILM,
  ...TECH_UI,
  ...EXPERIMENTAL,
];
