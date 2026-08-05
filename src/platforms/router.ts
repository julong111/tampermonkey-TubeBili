export function isYoutubePage(url: string): boolean {
  return url.includes("youtube.com/");
}

export function isYoutubeWatchPage(url: string): boolean {
  return url.includes("youtube.com/watch");
}

export function isBilibiliVideoPage(url: string): boolean {
  return url.includes("bilibili.com/video") || url.includes("bilibili.com/bangumi/play");
}

export function detectPlatform(url: string): 'youtube' | 'bilibili' | null {
  if (isYoutubePage(url)) return "youtube";
  if (isBilibiliVideoPage(url)) return "bilibili";
  return null;
}
