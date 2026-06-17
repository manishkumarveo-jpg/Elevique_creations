"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ELVIQUE_LOGOS } from '@/data/elviqueLogos'

export function Demo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden py-20 md:py-28"
      style={{ background: "#000000" }}
    >
      {/* SVG filter to key out white background while preserving original logo colors */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="remove-white-bg" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                -1.3 -1.3 -1.3 4 0
              "
            />
          </filter>
        </defs>
      </svg>

      {/* Brands Heading */}
      <div className="flex flex-col items-center justify-center text-center mt-12 mb-16 px-4">
        {/* Glowing eyebrow */}
        <span 
          className="text-[9px] font-bold tracking-[0.42em] uppercase mb-2 text-[#14B8A6]"
          style={{ textShadow: "0 0 12px rgba(20, 184, 166, 0.4)" }}
        >
          Trusted Partnerships
        </span>
        
        {/* Main premium heading */}
        <h2 
          className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-[0.25em] uppercase"
          style={{
            background: "linear-gradient(to bottom, #ffffff 30%, #a3a3a3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Brands We Worked With
        </h2>
        
        {/* Accent indicator line */}
        <div className="flex items-center gap-2 mt-4">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#14B8A6]/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
          <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#14B8A6]/40" />
        </div>
      </div>

      {/* Ambient decorative glow behind the glass strip */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[220px] pointer-events-none opacity-25 filter blur-[100px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, transparent 70%)"
        }}
      />

      {/* glass strip */}
      <div
        className="relative mx-6 md:mx-12 lg:mx-20 rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.015)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* SVG Grid Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" aria-hidden="true">
          <defs>
            <pattern id="demo-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#demo-grid)" />
        </svg>

        <div className="relative py-12 md:py-16 px-0">
          <InfiniteSlider
            duration={150}
            gap={72}
            className="flex items-center"
          >
            {ELVIQUE_LOGOS.map((logoPath, idx) => {
              return (
                <div
                  key={logoPath}
                  className="h-18 w-44 md:h-22 md:w-56 shrink-0 transition-all duration-500 flex items-center justify-center select-none relative"
                  style={{ opacity: 0.75 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = "0.75";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Image
                    src={logoPath}
                    alt={`Partner Logo ${idx + 1}`}
                    fill
                    draggable={false}
                    className="object-contain pointer-events-none transition-all duration-300"
                    sizes="(max-width: 768px) 176px, 224px"
                    style={{
                      filter: 'url(#remove-white-bg)'
                    }}
                  />
                </div>
              );
            })}
          </InfiniteSlider>

          {/* left progressive blur */}
          <ProgressiveBlur
            direction="left"
            blurIntensity={0.6}
            blurLayers={8}
            className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10"
          />
          {/* right progressive blur */}
          <ProgressiveBlur
            direction="right"
            blurIntensity={0.6}
            blurLayers={8}
            className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10"
          />
        </div>
      </div>
    </motion.div>
  )
}
