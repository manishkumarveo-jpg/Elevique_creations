export interface ReelVideo {
  id: number;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  techStack: string[];
  colorFrom: string;
  colorTo: string;
  videoSrc: string;
}

export const REEL_VIDEOS: ReelVideo[] = [
  {
    id: 1,
    title: "Elevique Creation",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1780998674/Forbes_properties_-_Real_estate_odzs1p.mov",
  },
  {
    id: 2,
    title: "Fashion Film",
    category: "Editorial",
    year: "2023",
    role: "Cinematography & Edit",
    description: "Haute couture meets surrealism in a dreamlike sequence of fabric, motion, and identity.",
    techStack: ["AI Cinematics", "Editorial", "Sound Design"],
    colorFrom: "#e879f9",
    colorTo: "#7c3aed",
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1781001716/Aar_Kay_Vox_UK_-_Legacy_story_lvcljy.mov",
  },
  {
    id: 3,
    title: "Automotive Launch",
    category: "Product Film",
    year: "2024",
    role: "Interactive Frontend",
    description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
    techStack: ["3D Render", "AI Upscale", "Particle FX"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1781089842/Animated_movie_-_Malibhai_compressed_avswba.mp4",
  },
  {
    id: 4,
    title: "Luxury Perfume",
    category: "Brand Film",
    year: "2024",
    role: "Packaging & Brand System",
    description: "Sensory storytelling distilled into 60 seconds of atmospheric brand cinema.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics"],
    colorFrom: "#f59e0b",
    colorTo: "#ec4899",
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1781090224/Its_me_music_video_compressed_ug7wwp.mp4",
  },
];
