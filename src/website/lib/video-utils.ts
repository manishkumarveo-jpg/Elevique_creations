export function titleFromVideoSrc(videoSrc: string | undefined): string {
  if (!videoSrc) return "Untitled"
  const fileName = decodeURIComponent(videoSrc).split("/").pop() ?? videoSrc
  return fileName.replace(/\.[^/.]+$/, "")
}

/**
 * Derives a poster image URL from a video URL by swapping the extension to
 * .jpg, keeping the same path. Upload a same-named .jpg next to each video
 * in the bucket (see video-thumbnails-checklist.txt) for this to resolve.
 */
export function posterFromVideoSrc(videoSrc: string | undefined): string | undefined {
  if (!videoSrc) return undefined
  return videoSrc.replace(/\.[^/.?#]+(\?.*)?$/, ".jpg$1")
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
