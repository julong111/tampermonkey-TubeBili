const REQUIRED_KEYS = ['id', 'matches', 'isWatchPage', 'init', 'onPage', 'cleanup'];

// PlatformAdapter 契约：
// {
//   id: string,                       // 平台标识
//   matches(url): boolean,            // 该 URL 是否由本适配器处理（纯函数）
//   isWatchPage(url): boolean,        // 该 URL 是否为播放页（纯函数）
//   init(onPageChange): void,         // 一次性初始化：注册监听器/观察器，onPageChange 用于 SPA 导航重入
//   onPage(): void,                   // 每次进入播放页时执行
//   cleanup(): void,                  // 页面卸载时清理定时器/观察器
// }
export function definePlatformAdapter(adapter) {
  const missing = REQUIRED_KEYS.filter((key) => !(key in adapter));
  if (missing.length > 0) {
    throw new Error(`PlatformAdapter missing keys: ${missing.join(', ')}`);
  }
  return Object.freeze({ ...adapter });
}
