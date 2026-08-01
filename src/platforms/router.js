export function isYoutubePage(url) {
  return url.includes("youtube.com/");
}

export function isYoutubeWatchPage(url) {
  return url.includes("youtube.com/watch");
}

export function isBilibiliVideoPage(url) {
  return url.includes("bilibili.com/video") || url.includes("bilibili.com/bangumi/play");
}

export function detectPlatform(url) {
  if (isYoutubePage(url)) return "youtube";
  if (isBilibiliVideoPage(url)) return "bilibili";
  return null;
}
