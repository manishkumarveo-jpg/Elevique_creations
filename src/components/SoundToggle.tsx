"use client";

import { useState, useCallback } from "react";

export default function SoundToggle() {
  const [muted, setMuted] = useState(true);

  // The video element is controlled by HeroSection; we broadcast a custom event
  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      window.dispatchEvent(new CustomEvent("hero:toggleMute", { detail: { muted: next } }));
      return next;
    });
  }, []);

  return (
    <button
      id="sound-toggle"
      className="sound-toggle"
      onClick={toggle}
      aria-label={muted ? "Unmute video" : "Mute video"}
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        /* Muted icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Sound on icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
