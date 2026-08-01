[中文](#) | [English](README-en.md)

# 🚀 TubeBili Enhancer | 油管 哔哩哔哩(B站)视频播放器增强工具

TubeBili是一款专为油猴用户设计的强大视频增强脚本，旨在显著提升您在 **Youtube** 和 **Bilibili** 上的观看体验。通过自动化、个性化的设置，帮助您摆脱重复操作，让您更专注于享受视频内容。 TubeBili 为 YouTube 和 Bilibili 视频播放器提供以下增强功能:
- 🚀 自动设置播放倍速
- 🎯 自定义倍速列表
- ⌨️ 快捷键调速 (逗号减速,句号加速)
- 🎨 美观的设置面板
- 🔧 可选移除播放器按钮


**⭐Youtube设置面板⭐**
![CN-Settings-Youtube](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-Settings-Youtube.png)
![CN-UI-1-Youtube](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-1-Youtube.png)
![CN-UI-2-Youtube](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-2-Youtube.png)


**⭐Bilibili设置面板⭐**
![CN-Settings-Bilibili](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-Settings-Bilibili.png)
![CN-UI-1-Bilibili](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-1-Bilibili.png)
![CN-UI-2-Bilibili](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-2-Bilibili.png)


## 🛠 开发者：本地构建

> 从 v2.0.2 开始，源代码采用模块化结构，通过 Rollup 构建产出最终脚本。

**前置要求：** Node.js >= 18

```bash
# 安装依赖
npm install

# 构建两个版本（输出到 dist/）
npm run build

# 输出文件：
#   dist/TubeBili.user.js        - Tampermonkey 标准版
#   dist/TubeBili.userscripts.js - Safari Userscripts 通用版
```

**源代码结构：**

```
src/
├── core/
│   ├── gm-api.js           # GM API 适配层（按平台条件编译）
│   ├── element-getter.js   # Element 等待工具（waitElement / getVideoElement）
│   ├── i18n.js             # 国际化函数（t / detectLanguage）
│   └── i18n-constants.js   # 国际化字典（常量）
├── main.js                 # 入口（路由编排，只依赖 PlatformAdapter 接口）
├── settings/
│   ├── speed-list.js       # 倍速列表校验函数（纯函数）
│   ├── speed-list-constants.js # 倍速列表键名与默认值（常量）
│   ├── catalog.js          # 平台设置项目录（纯数据）
│   └── store.js            # 全局状态唯一 store
├── ui/
│   ├── settings-panel.js   # 设置面板（DOM）
│   ├── speed-buttons.js    # 倍速按钮 UI
│   ├── speed-indicator.js  # 倍速悬浮提示 UI
│   └── styles.js           # CSS 样式
├── features/
│   ├── rate.js             # 自动倍速动作
│   ├── shortcut.js         # 快捷键
│   └── removal/
│       ├── config.js       # 启用项过滤
│       ├── remove-once.js  # YouTube 一次性移除策略
│       └── remove-loop.js  # Bilibili 轮询移除策略
└── platforms/
    ├── adapter.js          # PlatformAdapter 契约（definePlatformAdapter）
    ├── router.js           # URL 检测纯函数
    ├── youtube.js          # YouTube 适配器（逻辑）
    ├── youtube-constants.js # YouTube 选择器/移除项/间隔（常量）
    ├── bilibili.js         # Bilibili 适配器（逻辑）
    └── bilibili-constants.js # Bilibili 选择器/移除项/间隔（常量）
```

---

## 📦 快速开始

本项目提供两个版本,请根据您的脚本管理器选择:

### 1️⃣ **TubeBili.user.js** - 标准油猴版本
**适用场景:**
- ✅ Tampermonkey (Chrome/Firefox/Edge/Safari)
- ✅ Violentmonkey
- ✅ Greasemonkey
- ✅ ScriptCat

**安装方法:**
1. 安装油猴管理器扩展 (如 Tampermonkey)
2. 在此处安装脚本 [TubeBili.user.js](https://greasyfork.org/zh-CN/scripts/546313-youtube-bilibili-video-player-enhancer-tools)
3. 确认安装后点击脚本设置菜单按钮打开设置面板，进行配置。

---

### 2️⃣ **TubeBili.userscripts.js** - Safari Userscripts 专用版本 ⭐
**适用场景:**
- ✅ Safari + Userscripts 插件 (Mac App Store)
- ✅ 其他不支持 GM API 的轻量级用户脚本管理器

在此处下载并安装脚本 [TubeBili.userscripts.js](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/TubeBili.userscripts.js)

---

## 📝 更新日志

本项目的所有显著变更都将记录在此文件中。感谢每一位用户的支持和建议！
#### [2.0.2] (2026-05-26) [Bug修复与功能扩展]
* **新增 Bilibili 番剧页面支持**: 添加对 `https://www.bilibili.com/bangumi/play` 播放页的支持
* **修复 YouTube 导航监听错误**: 修复 `yt-navigate-finish` 事件处理函数调用错误
* **修复 Bilibili 自动倍速失效**: 增加视频元素加载检测与重试机制
* **新增全屏按钮移除选项**: YouTube 和 Bilibili 均可选择移除全屏按钮
* **优化英文版面板宽度**: 英文语言下设置面板自动加宽至 600px，避免文本截断

#### [2.0] [**大版本更新**]
* **⭐重要⭐设置重置**: 2.0版本更新后，**旧版1.x设置将无法沿用，请重新打开设置面板配置一次！**
* **首次运行引导**: 脚本安装后首次运行时自动弹出设置面板
* **全新设置面板**: 完全重构设置界面，支持中文/英文双语显示
* **双列表倍速系统**: 快捷按键和按钮倍速列表独立配置
* **透明玻璃效果**: 播放器倍速按钮列表优化为毛玻璃透明效果
* **系统性能优化**: 新增并发锁机制，防止重复处理
* **YouTube 功能增强**: 
  * 新增域名排除: `accounts.youtube.com`
  * 修复YouTube广告警告，优化广告检测至200ms间隔
  * 广告时自动恢复1倍速，结束后恢复用户设置
  * 移除MiniPlayer按钮设置项，新增自动播放、字幕、设置按钮选项
* **Bilibili 功能增强**:
  * 新增多个按钮移除选项：分辨率、选集、画中画、宽屏等
  * 优化动态按钮移除（如弹幕输入区）
  * 倍速设置按钮位置优化至播放器底部中间

#### [1.3] [功能增强与优化]
* **新增直播检测功能**: YouTube直播时自动将播放速度设为1.0倍速
* **增强速度指示器**: 全屏模式下显示当前播放速度
* **改进快捷键支持**: 优化逗号和句号键的调速逻辑
* **界面优化**: 倍速按钮添加高亮显示
* **稳定性改进**: 修复页面切换时的定时器清理问题

#### [1.2] [功能优化]
* **最大快捷播放速度提升至4倍**: 扩展快捷键支持的倍速范围至4.0倍
* **优化调速算法**: 提供更流畅的调速体验

#### [1.0.8] [功能优化]
* **新增2.5倍播放速度选项**: 在2倍和3倍速度之间提供更精细的控制
* **优化UI**: 倍速按钮颜色编码系统和设置面板界面改进

#### [1.0.0] [初始发布]
* 基础倍速控制功能（0.5x, 1.0x, 1.5x, 2.0x, 3.0x）
* YouTube和Bilibili双平台支持
* 可视化设置面板
* 多语言界面支持（中文/英文）
* 快捷键调速功能

---

## ✨ 核心功能亮点

### 1. 高级倍速控制
* **扩展倍速选项**: 界面添加更多倍速按钮（0.5x, 1.0x, 1.5x, 2.0x, 2.5x, 3.0x）
* **智能快捷键**: 使用逗号`,`键减速，句号`.`键快速一键调速
* **速度指示器**: 调速时在全屏/网页全屏模式下显示当前速度
* **自动倍速播放**: 支持自定义默认倍速（如2倍速），视频开始时自动设置
* **双列表倍速系统**: 
  - **快捷按键倍速列表**: 自定义快捷键（逗号/句号）调整倍速时使用的倍速值序列
  - **按钮倍速列表**: 自定义播放器界面上显示的倍速按钮
  - 两个列表独立配置，互不影响，提供更灵活的倍速控制体验

### 2. 智能直播检测 (YouTube专属)
* **直播识别**: 自动检测YouTube直播流
* **智能调速**: 直播时自动将播放速度设为1.0倍速，确保正常观看体验
* **状态切换**: 直播结束后恢复用户设置的倍速

### 3. 界面精简与优化
* **透明玻璃效果**: 播放器倍速按钮列表优化为毛玻璃透明效果，与原生界面更协调
* **按钮高亮显示**: 当前选中的倍速按钮有醒目边框提示
* **移除冗余按钮**: 可选择移除不常用的画中画、宽屏、原始倍速、设置等按钮，提供更专注的观看环境
* **动态按钮移除**: 优化动态加载按钮的移除（如全屏后才出现的弹幕输入区）
* **隐藏评论区**: 自动移除评论输入区，提供更简洁界面

### 4. 平台专属增强

#### YouTube
* **广告处理优化**: 
  * 优化广告检测方式，缩小检测间隔至200ms
  * 广告播放时自动恢复至1倍速，避免因超速播放广告导致Google检测器警告
  * 广告结束后自动恢复用户设置的倍速
* **域名排除**: 添加 `accounts.youtube.com` 子域名排除，优化匹配逻辑
* **可定制控件**: 新增自动播放开关、字幕按钮、设置按钮的设置项目

#### Bilibili
* **自动网页全屏**: 视频加载后自动进入网页全屏模式
* **增强按钮管理**: 分辨率、选集、画中画、宽屏、原始倍速、设置、网页全屏按钮的移除选项
* **倍速设置按钮位置优化**: 倍速设置按钮现在添加到播放器底部中间区域
* **自动关闭登录弹窗**: 定时检测未登录时弹出的登录提示弹窗，检测到后自动点击关闭并恢复播放，屏蔽未登录时烦人的登录弹窗

### 5. 用户友好与个性化
* **全新设置面板**: 完全重构设置界面，支持中文/英文双语显示
* **首次运行引导**: 脚本安装后首次运行时自动弹出设置面板，方便用户快速配置
* **多语言支持**: 自动识别浏览器语言，支持中文和英文界面
* **配置保存**: 所有设置自动保存，下次访问无需重新配置
* **系统性能优化**: 新增并发锁机制，防止在某些竞态条件下Handler处理了2次

---

## 📋 功能对比表

| 功能 | YouTube | Bilibili |
|------|---------|----------|
| 扩展倍速按钮 | ✅ | ✅ |
| 快捷键调速 | ✅ | ✅ |
| 速度指示器 | ✅ | ✅ |
| 自动倍速播放 | ✅ | ✅ |
| 直播检测 | ✅ | ❌ |
| 自动网页全屏 | ❌ | ✅ |
| 移除冗余按钮 | ✅ | ✅ |
| 隐藏评论区 | ❌ | ✅ |
| 自动关闭登录弹窗并恢复播放 | ❌ | ✅ |

---

## 🌍 多语言支持

脚本会根据浏览器语言自动切换界面语言:
- 🇨🇳 中文 (zh-CN)
- 🇺🇸 English (其他语言默认使用英文)

---

## ⚙️ 详细配置选项

### YouTube 设置:
- [ ] 自动倍速播放（可自定义默认速度）
- [ ] 自动播放开关
- [ ] 自动移除字幕按钮
- [ ] 自动移除设置按钮

### Bilibili 设置:
- [ ] 自动网页全屏
- [ ] 自动倍速播放（可自定义默认速度）
- [ ] 自动移除分辨率按钮
- [ ] 自动移除选集按钮
- [ ] 自动移除画中画按钮
- [ ] 自动移除宽屏按钮
- [ ] 自动移除原始倍速按钮
- [ ] 自动移除评论输入区
- [ ] 自动移除设置按钮
- [ ] 自动移除网页全屏按钮
- [x] 自动关闭登录弹窗并恢复播放

---

## 💖 打赏支持

如果您觉得脚本对您有帮助，欢迎使用微信进行打赏以支持作者对本项目的持续更新开发。感谢您的支持！

![微信打赏码](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/Pay.png)

## 📧 联系我
**julong**  
📧 反馈邮箱: julong[at]111.com  
🏠 脚本主页: https://github.com/julong111/tampermonkey-TubeBili  
🐛 问题反馈: https://github.com/julong111/tampermonkey-TubeBili/issues

---

## 🎯 为什么选择此脚本？

* **双平台兼容**: 一款脚本同时搞定 YouTube 和 Bilibili，无需安装多个单功能脚本
* **高效便捷**: 自动化功能节省重复操作时间，观看流程更流畅
* **界面清爽**: 移除不必要元素，视频页面干净整洁
* **智能贴心**: 直播检测、速度提示、广告处理等细节优化
* **持续更新**: 脚本为维护者长期自用，如有失效会第一时间更新，具备长期可用性

立即安装「TubeBili 油管哔哩哔哩视频播放器增强工具」，开启您的全新视频观看旅程！