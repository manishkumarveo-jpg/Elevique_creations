"use client";

import { useState, useCallback, useEffect } from "react";

export default function SoundToggle() {
  const [muted, setMuted] = useState(true);

  // Initialize from localStorage on mount and listen to changes from elsewhere (e.g. reels toggle)
  useEffect(() => {
    const stored = localStorage.getItem("global-video-muted");
    const isMuted = stored === null ? true : stored === "true";
    setMuted(isMuted);

    const handleMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      setMuted(customEvent.detail.muted);
    };

    window.addEventListener("global-video-muted-change", handleMuteChange);
    return () => {
      window.removeEventListener("global-video-muted-change", handleMuteChange);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem("global-video-muted", String(next));
    window.dispatchEvent(new CustomEvent("global-video-muted-change", { detail: { muted: next } }));
  }, [muted]);

  return (
    <button
      type="button"
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
