"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { InfiniteSlider } from '@/website/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/website/components/ui/progressive-blur'
import { ELVIQUE_LOGOS } from '@/website/data/elviqueLogos'

function LogoImage({ src, alt, fill, unoptimized, className, sizes }: any) {
  const [hasWhiteBg, setHasWhiteBg] = useState(true);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 10, 10);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        const alpha = pixel[3];
        if (alpha < 50) {
          setHasWhiteBg(false);
        } else {
          const r = pixel[0], g = pixel[1], b = pixel[2];
          if (r > 240 && g > 240 && b > 240) {
            setHasWhiteBg(true);
          } else {
            setHasWhiteBg(false);
          }
        }
      } catch (e) {
        setHasWhiteBg(true);
      }
    };
  }, [src]);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      unoptimized={unoptimized}
      draggable={false}
      className={className}
      sizes={sizes}
      style={{
        filter: hasWhiteBg 
          ? 'url(#remove-white-bg) brightness(0) invert(1)' 
          : 'brightness(0) invert(1)',
        imageRendering: '-webkit-optimize-contrast',
      }}
    />
  );
}

export function Demo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden pt-28 pb-6 md:pt-36 md:pb-8"
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
                -1.5 -1.5 -1.5 4.5 0
              "
            />
          </filter>
        </defs>
      </svg>

      {/* Brands Heading */}
      <div className="svc-header mb-16 md:mb-20">
        <span className="svc-eyebrow">
          <span className="svc-eyebrow-line" />
          Trusted Partnerships
        </span>
        <h2 className="svc-heading">
          Brands We Worked With
        </h2>
      </div>

      {/* Ambient decorative glow behind the glass strip */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[300px] pointer-events-none opacity-20 filter blur-[120px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 75%)"
        }}
      />

      {/* glass strip (now full-width edge-to-edge banner) */}
      <div
        className="relative w-full border-t border-b overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.012)",
          borderColor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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

        <div className="relative py-14 md:py-20 px-0">
          <InfiniteSlider
            duration={150}
            gap={110}
            className="flex items-center"
          >
            {ELVIQUE_LOGOS.map((logoPath, idx) => {
              return (
                <div
                  key={logoPath}
                  className="h-22 w-52 md:h-26 md:w-64 shrink-0 transition-all duration-500 flex items-center justify-center select-none relative"
                  style={{ opacity: 0.85 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <LogoImage
                    src={logoPath}
                    alt={`Partner Logo ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-contain pointer-events-none transition-all duration-300"
                    sizes="(max-width: 768px) 208px, 256px"
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
