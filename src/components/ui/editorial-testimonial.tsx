"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import "@/styles/testimonial.css";

// ── Client SVG Logos ───────────────────────────────────────────

const DumaneraLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 25V10C5 7.24 7.24 5 10 5H18C20.76 5 23 7.24 23 10V25M23 25C23 27.76 20.76 30 18 30H10C7.24 30 5 27.76 5 25Z" stroke="var(--gold)" strokeWidth="1.8"/>
    <path d="M12 12H16M12 18H16M12 24H16" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.15em">DUMANERA</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="600" letterSpacing="0.3em">SHOES</text>
  </svg>
);

const FitvittleLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="17" r="9" stroke="var(--gold)" strokeWidth="1.8" strokeDasharray="3 3"/>
    <path d="M11 17L13 19L17 15" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.12em">FITVITTLE</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.2em">HEALTH & LABS</text>
  </svg>
);

const TitanBrosLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8H20M14 8V26M10 26H18" stroke="var(--gold)" strokeWidth="2.2" strokeLinecap="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.15em">TITAN BROS</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="600" letterSpacing="0.4em">USA</text>
  </svg>
);

const GauddlyLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 13C22 8.58 18.42 5 14 5C9.58 5 6 8.58 6 13C6 17.42 9.58 21 14 21C18.42 21 22 17.42 22 13ZM22 13H14M14 21V28" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.18em">GAUDDLY</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.3em">FASHION</text>
  </svg>
);

const ElCasaLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 25L14 8L23 25H5Z" stroke="var(--gold)" strokeWidth="1.8" strokeLinejoin="round"/>
    <line x1="9" y1="17" x2="19" y2="17" stroke="var(--gold)" strokeWidth="1.5"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.12em">EL&apos;CASA</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.25em">LIVING SPACES</text>
  </svg>
);

const ShreeBuildconLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 27H22M9 27V12L14 8L19 12V27M14 12V27" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="9" fontWeight="700" letterSpacing="0.08em">SHREE BUILDCON</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.3em">REALTY</text>
  </svg>
);

const SkinRitualLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="17" r="9" stroke="var(--gold)" strokeWidth="1.8"/>
    <path d="M14 11C14 11 16.5 14 16.5 17C16.5 20 14 23 14 23" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="32" y="20" fill="var(--white)" fontSize="9.5" fontWeight="700" letterSpacing="0.1em">THE SKIN RITUAL</text>
    <text x="32" y="27" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.4em">CO.</text>
  </svg>
);

const ItsmeLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10C6 10 10 6 14 10C18 14 18 20 14 24C10 28 6 24 6 24" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="22" y2="17" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.15em">ITSME</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.3em">COSMETICS</text>
  </svg>
);

const SweetThrillsLogo = () => (
  <svg className="h-7 opacity-75 hover:opacity-100 transition-opacity" viewBox="0 0 160 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 14C10 10 12 22 16 18C20 14 22 26 26 22" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/>
    <text x="32" y="21" fill="var(--white)" fontSize="11" fontWeight="700" letterSpacing="0.12em">SWEET THRILLS</text>
    <text x="32" y="28" fill="var(--gold)" fontSize="6" fontWeight="500" letterSpacing="0.25em">SWEETS & DECOR</text>
  </svg>
);

// ── Testimonials Database ─────────────────────────────────────

const testimonials = [
  {
    id: 1,
    quote: "I was in a dilemma at the beginning of whether to go for AI videos for running Meta ads for my brands or not. But trust me, Elevique has just mastered this AI content creation with exceptional storytelling. People are now actually clicking on our ads!",
    author: "Rahul Singh",
    role: "Creative Director",
    company: "Dumanera Shoes",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60",
    Logo: DumaneraLogo,
  },
  {
    id: 2,
    quote: "I was very skeptical about AI videos after trying a few freelancers, where the videos had lip-sync issues and looked completely fake or AI-generated. But with Elevique, I don't see any of these issues. A professional process, excellent scripting, and world-class output from a trusted partner is what I'll always choose.",
    author: "Prashant Sharma",
    role: "Head of Design",
    company: "FITVITTLE",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=60",
    Logo: FitvittleLogo,
  },
  {
    id: 3,
    quote: "Thanks, Elevique. I am actually able to see the difference in the quality and conversion rates that we are now driving through the AI content made by you guys. Considering the brand is based in India, I was a bit doubtful at first, but after seeing the world-class creativity, I would recommend Elevique to everyone.",
    author: "David Holder",
    role: "Art Director",
    company: "Titan Bros USA",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: TitanBrosLogo,
  },
  {
    id: 4,
    quote: "I used to pay a lot for studios, editors, models, and videographers very frequently, but Elevique has helped me create much better model shots through AI. This has not only saved my production costs but also saved me time and effort on shoots. I'd recommend Elevique to everyone as they are experts in fashion visuals.",
    author: "Sharad Patel",
    role: "Art Director",
    company: "Gauddly Fashion",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: GauddlyLogo,
  },
  {
    id: 5,
    quote: "We were spending heavily on shoots every month. Elevique completely changed that. The visuals they created matched our brand tone so well that we actually reduced production costs while improving ad performance. Our creatives started converting better without increasing our budget.",
    author: "Sneha Kapoor",
    role: "Co-founder",
    company: "EL'CASA LIVING SPACES",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: ElCasaLogo,
  },
  {
    id: 6,
    quote: "In real estate, perception is everything. Elevique helped us present projects in a way that felt aspirational yet real. The visuals added that premium feel which actually helped us in lead generation campaigns. We started getting much better quality inquiries.",
    author: "Mehul Shah",
    role: "Director",
    company: "Shree Buildcon Realty",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: ShreeBuildconLogo,
  },
  {
    id: 7,
    quote: "Our biggest problem was maintaining a consistent brand aesthetic. Elevique didn't just create visuals, they truly understood our brand. Our page now looks cohesive, premium, and much more polished—which reflects directly in how our customers perceive us.",
    author: "Isha Malhotra",
    role: "Founder",
    company: "The Skin Ritual Co.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: SkinRitualLogo,
  },
  {
    id: 8,
    quote: "Really amazed by the realism their AI content offers! These guys have actually changed the game. Earlier our content looked average, but now everything feels like a proper high-end campaign. People actually started noticing our ads instead of scrolling past them.",
    author: "Vilis Oza",
    role: "Founder",
    company: "ITSME COSMETICS",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: ItsmeLogo,
  },
  {
    id: 9,
    quote: "Elevique helped us scale content volume without compromising on quality. We didn't need to plan multiple physical shoots anymore. It saved time, reduced efforts, and still gave us better-looking content than before. Automating content has been our biggest success.",
    author: "Priyanka Jain",
    role: "Co-founder",
    company: "Sweet Thrills",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    Logo: SweetThrillsLogo,
  },
];

// ── Magnetic Button Component ─────────────────────────────────

const MagneticButton = ({
  children,
  onClick,
  ariaLabel,
  className,
  direction,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  className: string;
  direction: "left" | "right";
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 12, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 12, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mX = e.clientX - rect.left - rect.width / 2;
    const mY = e.clientY - rect.top - rect.height / 2;
    x.set(mX * 0.4);
    y.set(mY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${className} te-arrow-magnetic`}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        className="inline-block"
        transition={{ type: "spring" as const, stiffness: 200, damping: 10 }}
        variants={{
          hover: { x: direction === "left" ? -4 : 4 },
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

// ── Animation Configurations & Scope Constants ────────────────

const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };

const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 7, filter: "blur(1.5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 18,
      stiffness: 160,
    },
  },
};

const avatarRingVariants = {
  initial: { rotate: 0, scale: 0.9, opacity: 0 },
  hover: {
    rotate: 360,
    scale: 1.08,
    opacity: 1,
    transition: {
      rotate: { repeat: Infinity, duration: 4, ease: "linear" as const },
      scale: { type: "spring" as const, stiffness: 350, damping: 15 },
      opacity: { duration: 0.25 },
    },
  },
};

// ── Main Testimonials Component ────────────────────────────────

export default function TestimonialsEditorial() {
  const [active, setActive] = useState(0);
  const isTransitioning = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3.5, -3.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3.5, 3.5]), springConfig);

  // Spotlight Follower Values (Percentage inside the card)
  const spotlightX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const spotlightY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);
  const spotlightOpacity = useSpring(0, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mX = event.clientX - rect.left - width / 2;
    const mY = event.clientY - rect.top - height / 2;
    mouseX.set(mX / width);
    mouseY.set(mY / height);
    spotlightOpacity.set(1);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    spotlightOpacity.set(0);
    setIsHovered(false);
  };

  const handleChange = (index: number) => {
    if (index === active || isTransitioning.current) return;
    isTransitioning.current = true;
    setProgress(0); // Reset timer
    setActive(index);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 300);
  };

  const handlePrev = () =>
    handleChange(active === 0 ? testimonials.length - 1 : active - 1);

  const handleNext = () =>
    handleChange(active === testimonials.length - 1 ? 0 : active + 1);

  // Swipe gesture support
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 60;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  // Autoplay Logic
  useEffect(() => {
    if (isTransitioning.current || isHovered) return;

    const duration = 6500; // 6.5 seconds per testimonial
    const intervalTime = 16; // ~60 FPS
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [active, isHovered]);

  const current = testimonials[active];
  const words = current.quote.split(" ");

  // Border and Spotlight style mapping
  const spotlightStyle = {
    background: useTransform(
      [spotlightX, spotlightY, spotlightOpacity],
      ([sx, sy, op]) =>
        `radial-gradient(500px circle at ${sx}% ${sy}%, rgba(20, 184, 166, 0.1) 0%, transparent 80%)`
    ),
    opacity: spotlightOpacity,
  };

  const borderSpotlightStyle = {
    background: useTransform(
      [spotlightX, spotlightY, spotlightOpacity],
      ([sx, sy, op]) =>
        `radial-gradient(280px circle at ${sx}% ${sy}%, rgba(20, 184, 166, 0.38) 0%, transparent 100%)`
    ),
    opacity: spotlightOpacity,
  };

  const CurrentLogo = current.Logo;

  return (
    <div className="te-wrap">
      {/* Ambient background blur backing */}
      <div className={`te-ambient-backlight ${isHovered ? "te-ambient-backlight--active" : ""}`} />

      {/* ── 3D Card Container ──────────────────────────────────── */}
      <motion.div
        ref={cardRef}
        className="te-card-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {/* Border Spotlight */}
        <motion.div className="te-card-border-glow" style={borderSpotlightStyle} />

        {/* Card Inner Glass Panel */}
        <div className="te-card-inner" style={{ transform: "translateZ(20px)" }}>
          {/* Inner Mouse Light */}
          <motion.div className="te-card-spotlight" style={spotlightStyle} />

          {/* Watermarked Quote SVG Mark */}
          <svg className="te-quote-watermark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M25 35 C25 22, 33 15, 42 15 C45 15, 48 17, 48 20 C48 23, 44 26, 40 26 C33 26, 31 30, 31 35 C31 38, 33 39, 36 39 C41 39, 45 43, 45 49 C45 55, 40 59, 34 59 C27 59, 25 53, 25 35 Z M55 35 C55 22, 63 15, 72 15 C75 15, 78 17, 78 20 C78 23, 74 26, 70 26 C63 26, 61 30, 61 35 C61 38, 63 39, 66 39 C71 39, 75 43, 75 49 C75 55, 70 59, 64 59 C57 59, 55 53, 55 35 Z" fill="rgba(20, 184, 166, 0.05)" />
          </svg>

          {/* Quote row layout */}
          <div className="te-quote-row">
            {/* Ghost number */}
            <span
              className="te-number"
              style={{ fontFeatureSettings: '"tnum"', transform: "translateZ(10px)" }}
              aria-hidden="true"
            >
              {String(active + 1).padStart(2, "0")}
            </span>

            {/* Content box */}
            <div className="te-right" style={{ transform: "translateZ(25px)" }}>
              {/* Word-by-word reveal quote */}
              <motion.blockquote
                key={`q-${active}`}
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                className="te-quote"
              >
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants}
                    className="te-word"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.blockquote>

              {/* Author and Brand details */}
              <motion.div
                key={`a-${active}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring" as const, stiffness: 150, damping: 25, delay: 0.18 }}
                className="te-author-row"
              >
                {/* Author Information */}
                <motion.div 
                  className="te-author"
                  whileHover="hover"
                  initial="initial"
                >
                  {/* Spinning Ring + Avatar Wrapper */}
                  <div className="te-avatar-container">
                    <motion.div 
                      className="te-avatar-ring"
                      variants={avatarRingVariants}
                    />
                    <div className="te-avatar">
                      <Image
                        src={current.image}
                        alt={current.author}
                        fill
                        sizes="52px"
                        className="te-avatar-img object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="te-name">{current.author}</p>
                    <p className="te-role">
                      {current.role}
                      <span className="te-slash"> / </span>
                      {current.company}
                    </p>
                  </div>
                </motion.div>

                {/* Company Logo Badge */}
                <div className="te-logo-wrapper">
                  <CurrentLogo />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Autoplay loading indicator bar */}
          <div className="te-progress-container" aria-hidden="true">
            <div 
              className="te-progress-bar" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </motion.div>

      {/* ── Nav bar ────────────────────────────────────── */}
      <div className="te-nav">
        {/* Dash indicators + counter */}
        <div className="te-nav-left">
          {testimonials.map((t, index) => (
            <motion.button
              type="button"
              key={index}
              onClick={() => handleChange(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`Testimonial ${index + 1}`}
              aria-current={index === active}
              className="te-dash-btn"
              whileHover="hover"
              initial="initial"
            >
              <motion.span
                layout
                className="te-dash"
                animate={{
                  width: index === active ? 48 : 32,
                  backgroundColor: index === active ? "var(--white)" : "rgba(248, 250, 252, 0.18)",
                }}
                variants={{
                  hover: {
                    width: index === active ? 48 : 40,
                    backgroundColor: index === active ? "var(--white)" : "rgba(248, 250, 252, 0.38)",
                  }
                }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              />

              {/* Floating Name Hover Tooltip */}
              <AnimatePresence>
                {hoveredIndex === index && index !== active && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -2, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="te-tooltip-hover"
                  >
                    <span className="te-tooltip-name">{t.author.split(" ")[0]}</span>
                    <span className="te-tooltip-company">{t.company}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
          <span className="te-counter">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        {/* Magnetic Arrows */}
        <div className="te-arrows">
          <MagneticButton
            onClick={handlePrev}
            className="te-arrow"
            ariaLabel="Previous"
            direction="left"
          >
            <ChevronLeft size={18} />
          </MagneticButton>
          <MagneticButton
            onClick={handleNext}
            className="te-arrow"
            ariaLabel="Next"
            direction="right"
          >
            <ChevronRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
