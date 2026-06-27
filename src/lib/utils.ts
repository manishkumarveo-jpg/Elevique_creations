import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function titleFromVideoSrc(videoSrc: string | undefined): string {
  if (!videoSrc) return "Untitled"
  const fileName = decodeURIComponent(videoSrc).split("/").pop() ?? videoSrc
  return fileName.replace(/\.[^/.]+$/, "")
}

/**
 * Expands a list of bare { id, videoSrc } entries into full items by merging
 * in shared group metadata (category, colors, etc.) and deriving `title`
 * from the video file name. Lets data files declare repeated fields once per
 * group instead of on every single entry.
 */
export function expandWithMeta<
  TMeta extends object,
  TItem extends { id: number; videoSrc?: string; title?: string },
>(meta: TMeta, items: TItem[]): (TItem & TMeta & { title: string })[] {
  return items.map((item) => ({
    ...meta,
    ...item,
    title: item.title ?? titleFromVideoSrc(item.videoSrc),
  }))
}
