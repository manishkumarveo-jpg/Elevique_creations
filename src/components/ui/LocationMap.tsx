"use client";

import type React from "react";
import { useState, useRef, useEffect, startTransition } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface LocationMapProps {
  location?: string;
  coordinates?: string;
  className?: string;
  mapUrl?: string;
}

export function LocationMap({
  location = "San Francisco, CA",
  coordinates = "37.7749° N, 122.4194° W",
  className = "",
  mapUrl = "https://www.google.com/maps/search/?api=1&query=San+Francisco,+CA",
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => setViewportWidth(window.innerWidth));
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8]);
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="loc-map-wrapper-outer">
      <div className="loc-map-eyebrow">Current Location</div>
      <motion.div
        ref={containerRef}
        className={`loc-map-container ${className}`}
        style={{
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <motion.div
          className="loc-map-card"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            width: isExpanded
              ? Math.min(400, viewportWidth - 48)
              : Math.min(320, viewportWidth - 48),
            height: isExpanded ? 280 : 140,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="loc-map-gradient" />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="loc-map-expanded-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="loc-map-bg-muted" />

                <svg className="loc-map-roads-svg" preserveAspectRatio="none">
                  {/* Main roads */}
                  <motion.line
                    x1="0%"
                    y1="35%"
                    x2="100%"
                    y2="35%"
                    className="loc-map-road-primary"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                  <motion.line
                    x1="0%"
                    y1="65%"
                    x2="100%"
                    y2="65%"
                    className="loc-map-road-primary"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />

                  {/* Vertical main roads */}
                  <motion.line
                    x1="30%"
                    y1="0%"
                    x2="30%"
                    y2="100%"
                    className="loc-map-road-secondary"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />
                  <motion.line
                    x1="70%"
                    y1="0%"
                    x2="70%"
                    y2="100%"
                    className="loc-map-road-secondary"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />

                  {/* Secondary streets */}
                  {[20, 50, 80].map((y, i) => (
                    <motion.line
                      key={`h-${i}`}
                      x1="0%"
                      y1={`${y}%`}
                      x2="100%"
                      y2={`${y}%`}
                      className="loc-map-road-tertiary"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    />
                  ))}
                  {[15, 45, 55, 85].map((x, i) => (
                    <motion.line
                      key={`v-${i}`}
                      x1={`${x}%`}
                      y1="0%"
                      x2={`${x}%`}
                      y2="100%"
                      className="loc-map-road-tertiary"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    />
                  ))}
                </svg>

                {/* Buildings */}
                <motion.div
                  className="loc-map-building"
                  style={{ top: "40%", left: "10%", width: "15%", height: "20%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
                <motion.div
                  className="loc-map-building"
                  style={{ top: "15%", left: "35%", width: "12%", height: "15%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                />
                <motion.div
                  className="loc-map-building"
                  style={{ top: "70%", left: "75%", width: "18%", height: "18%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                />
                <motion.div
                  className="loc-map-building"
                  style={{ top: "20%", right: "10%", width: "10%", height: "25%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                />
                <motion.div
                  className="loc-map-building"
                  style={{ top: "55%", left: "5%", width: "8%", height: "12%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.65 }}
                />
                <motion.div
                  className="loc-map-building"
                  style={{ top: "8%", left: "75%", width: "14%", height: "10%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.75 }}
                />

                {/* Marker pin */}
                <motion.div
                  className="loc-map-pin-container"
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="loc-map-pin-svg"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#00e699" />
                    <circle cx="12" cy="9" r="2.5" className="loc-map-pin-circle" />
                  </svg>
                </motion.div>

                <div className="loc-map-bottom-fade" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid pattern - only show when collapsed */}
          <motion.div
            className="loc-map-grid-pattern"
            animate={{ opacity: isExpanded ? 0 : 0.12 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="100%" height="100%" className="loc-map-grid-pattern-svg">
              <defs>
                <pattern id="grid-loc" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" className="loc-map-grid-line" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-loc)" />
            </svg>
          </motion.div>

          {/* Content */}
          <div className="loc-map-content">
            {/* Top section */}
            <div className="loc-map-header">
              <div>
                <motion.div
                  animate={{
                    opacity: isExpanded ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Map Icon SVG */}
                  <motion.svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00e699"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="loc-map-icon"
                    animate={{
                      filter: isHovered
                        ? "drop-shadow(0 0 6px rgba(0, 230, 153, 0.6))"
                        : "drop-shadow(0 0 2px rgba(0, 230, 153, 0.3))",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" x2="9" y1="3" y2="18" />
                    <line x1="15" x2="15" y1="6" y2="21" />
                  </motion.svg>
                </motion.div>
              </div>

              {/* Status indicator */}
              <div className="loc-map-live-badge">
                <div className="loc-map-live-dot" />
                <span className="loc-map-live-text">Live</span>
              </div>
            </div>

            {/* Bottom section */}
            <div className="loc-map-info">
              <motion.h3
                className="loc-map-title"
                animate={{
                  x: isHovered ? 4 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {location}
              </motion.h3>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="loc-map-expanded-content"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="loc-map-coords">
                      {coordinates}
                    </p>
                    {mapUrl && (
                      <motion.a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="loc-map-link"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <span>Open in Maps</span>
                        <ExternalLink size={12} className="loc-map-link-icon" />
                      </motion.a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated underline */}
              <motion.div
                className="loc-map-underline"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{
                  scaleX: isHovered || isExpanded ? 1 : 0.3,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Click hint */}
        <motion.p
          className="loc-map-hint"
          style={{ x: "-50%" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered && !isExpanded ? 1 : 0,
            y: isHovered ? 0 : 4,
          }}
          transition={{ duration: 0.2 }}
        >
          Click to expand
        </motion.p>
      </motion.div>
    </div>
  );
}
