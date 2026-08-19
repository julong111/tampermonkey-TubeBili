[中文](README.md) | [English](#)

# 🚀 TubeBili Enhancer | Youtube Bilibili Video Player Enhancer Tools

TubeBili is a powerful userscript designed specifically for Tampermonkey users, aiming to significantly improve your viewing experience on **YouTube** and **Bilibili**. Through automation and personalized settings, it helps you eliminate repetitive operations and focus more on enjoying video content. TubeBili provides the following enhancements for YouTube and Bilibili video players:
- 🚀 Auto playback speed setting
- 🎯 Customizable speed list
- ⌨️ Keyboard shortcut speed adjustment (comma to decrease, period to increase)
- ⚡ **One-Key Turbo Playback** (hold custom key >500ms to trigger speed, release to restore. Ideal for quickly skipping ads, intros/outros, boring segments, etc.)
- 🖥️ **Auto Display Mode** (Bilibili: Web Fullscreen / Wide Mode - choose one)
- 🎨 Beautiful settings panel
- 🔧 Optional removal of player buttons


**⭐Youtube Settings Panel⭐**
![EN-Settings-Youtube](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/EN-Settings-Youtube.png)
![CN-UI-1-Youtube](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-1-Youtube.png)
![CN-UI-2-Youtube](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-2-Youtube.png)


**⭐Bilibili Settings Panel⭐**
![EN-Settings-Bilibili](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/EN-Settings-Bilibili.png)
![CN-UI-1-Bilibili](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-1-Bilibili.png)
![CN-UI-2-Bilibili](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/CN-UI-2-Bilibili.png)


## 🛠 Developers: Local Build

> Since v2.1.1, the project has been fully migrated to the Bun toolchain: source code and tests are TypeScript (strict), built with Bun.build, and tested with bun:test.

**Prerequisites:** [Bun](https://bun.sh) >= 1.3

```bash
# Install dependencies
bun install

# Build
bun run build

# Run tests
bun test

# Type checking
bun run typecheck

# Output files:
#   dist/latest/TubeBili.user.js        - Tampermonkey standard version (latest)
#   dist/latest/TubeBili.userscripts.js - Safari Userscripts universal version (latest)
```

**Source structure:**

```
src/
├── entry.ts              # Build entry (beforeunload cleanup + main() auto-run)
├── main.ts               # Main flow (routing orchestration, depends only on PlatformAdapter interface)
├── core/
│   ├── gm-api.ts         # GM API adapter layer (branches on __TARGET__)
│   ├── element-getter.ts # Element wait utilities (waitElement / getVideoElement)
│   ├── i18n.ts           # i18n functions (t / detectLanguage)
│   └── i18n-constants.ts # i18n dictionary (constants)
├── settings/
│   ├── speed-list.ts     # Speed list validation (pure functions)
│   ├── speed-list-constants.ts # Speed list keys and defaults (constants)
│   ├── catalog.ts        # Platform settings catalog (pure data)
│   └── store.ts          # Single global state store
├── ui/
│   ├── settings-panel.ts # Settings panel (DOM)
│   ├── speed-buttons.ts  # Speed button UI
│   ├── speed-indicator.ts # Speed indicator UI
│   ├── floating-button.ts # Floating button UI
│   └── styles.ts         # CSS styles
├── features/
│   ├── rate.ts           # Auto playback speed action
│   ├── shortcut.ts       # Keyboard shortcuts
│   ├── auto-close-login-window.ts # Login dialog auto-close guard
│   └── removal/
│       ├── config.ts     # Enabled item filtering
│       ├── remove-once.ts # YouTube one-shot removal strategy
│       └── remove-loop.ts # Bilibili polling removal strategy
├── platforms/
│   ├── adapter.ts        # PlatformAdapter contract (definePlatformAdapter)
│   ├── router.ts         # URL detection pure functions
│   ├── youtube.ts        # YouTube adapter (logic)
│   ├── youtube-constants.ts # YouTube selectors/removal items/intervals (constants)
│   ├── bilibili.ts       # Bilibili adapter (logic)
│   └── bilibili-constants.ts # Bilibili selectors/removal items/intervals (constants)
└── __tests__/            # bun:test tests (behavior mocks, no real DOM)
```

---

## 📦 Quick Start

This project provides two versions. Please choose according to your userscript manager:

### 1️⃣ **TubeBili.user.js** - Standard Tampermonkey Version
**Applicable Scenarios:**
- ✅ Tampermonkey (Chrome/Firefox/Edge/Safari)
- ✅ Violentmonkey
- ✅ Greasemonkey
- ✅ ScriptCat

**Installation Method:**
1. Install userscript manager extension (e.g., Tampermonkey)
2. Install script here: [TubeBili.user.js](https://greasyfork.org/zh-CN/scripts/546313-youtube-bilibili-video-player-enhancer-tools)
3. After confirming installation, click the script settings menu button to open the settings panel for configuration.

---

### 2️⃣ **TubeBili.userscripts.js** - Safari Userscripts Dedicated Version ⭐
**Applicable Scenarios:**
- ✅ Safari + Userscripts plugin (Mac App Store)
- ✅ Other lightweight userscript managers that don't support GM API

Download and install the script here: [TubeBili.userscripts.js](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/dist/latest/TubeBili.userscripts.js)

---

## 📝 Changelog

All notable changes to this project will be documented in this file. We truly appreciate every user's support and suggestions!

#### [2.3] (2026-08-20) [New Feature]
* **New Bilibili Auto Wide Mode**: Automatically enters wide mode on video load, mutually exclusive with "Auto Web Fullscreen"
  - Settings panel adds "Auto Display Mode" with radio options: ✅ Enable, then choose "Web Fullscreen" or "Wide Mode"
  - Disabled by default, requires user to enable
  - Wide mode and web fullscreen are mutually exclusive; radio ensures only one active at a time

#### [2.2.2] (2026-08-19) [New Feature]
* **New One-Key Turbo Playback**: Hold a custom key (default Shift) for >500ms to trigger turbo playback (default 3.0x, customizable), release to instantly restore original speed
  - Settings panel adds "Enable Turbo Playback" toggle, trigger key (click input then press any key to capture), turbo speed selector
  - Turbo speed list automatically filters out 1.0x and below
  - Speed indicator stays visible during turbo playback, hides on release
  - Works on both YouTube and Bilibili with shared global settings

#### [2.2] (2026-08-14) [New Feature]
* **New Auto Skip Ad on YouTube**: Automatically detects and clicks the "Skip Ad" button while an ad is playing; if the button is not visible, fast-forwards the video to skip the ad directly
* **Auto Restore 1x Speed During Ads**: Playback speed is restored to 1.0x while an ad plays to avoid triggering Google's detector warning from over-speeding ads, and restores the user's configured speed automatically after the ad ends

#### [2.1.1] (2026-08-05) [UI Optimization]
* **Improved YouTube Speed Button Background**: Shortcut button background changed to a dark translucent effect `rgba(15, 15, 15, 0.8)` for better visual harmony in the YouTube player
* **Widened Settings Panel Speed Select**: The speed select control width in the settings panel has been doubled to prevent option content from being cut off

#### [2.1] (2026-08-02) [Option Adjustments]
* **Removed Some Bilibili Removal Options**: Removed the "Quality, Episode List, Wide Screen, Settings, Web Fullscreen" button removal options. Only PiP, Original Speed, and Comments Input Area removal are retained

#### [2.0.2] (2026-05-26) [Bug Fixes & Feature Extension]
* **Added Bilibili Bangumi Page Support**: Added support for `https://www.bilibili.com/bangumi/play` playback page
* **Fixed YouTube Navigation Listener Error**: Fixed `yt-navigate-finish` event handler function call error
* **Fixed Bilibili Auto Speed Issue**: Added video element loading detection with retry mechanism
* **Added Fullscreen Button Removal**: Both YouTube and Bilibili can now remove fullscreen buttons
* **Optimized English Panel Width**: Settings panel automatically expands to 600px in English to prevent text truncation

#### [2.0] [**Major Version Update**]
* **⭐Important⭐ Settings Reset**: After updating to version 2.0, **settings from version 1.x will NOT carry over. Please reopen the settings panel and reconfigure!**
* **Brand New Settings Panel**: Completely redesigned settings interface with bilingual Chinese/English display
* **Dual Speed List System**: Independent configuration for shortcut and button speed lists
* **First Run Wizard**: Automatically displays settings panel on first run after script installation
* **Frosted Glass Effect**: Player speed button list optimized with translucent frosted glass styling
* **System Performance Optimization**: Implemented mutex lock mechanism to prevent duplicate processing
* **YouTube Feature Enhancements**:
  * New domain exclusion: `accounts.youtube.com`
  * Fixed YouTube ad warnings, optimized ad detection to 200ms interval
  * Auto-reset to 1x speed during ads, restore user settings after ads end
  * Removed MiniPlayer button setting, added autoplay, subtitles, and settings button options
* **Bilibili Feature Enhancements**:
  * New button removal options: Quality, Episode List, PiP, Wide Screen, etc.
  * Optimized dynamic button removal (e.g., danmaku input area)
  * Speed settings button position optimized to bottom center of player

#### [1.3] [Feature Enhancement & Optimization]
* **New Live Stream Detection**: Automatically sets playback speed to 1.0x during YouTube live streams
* **Enhanced Speed Indicator**: Shows current playback speed in fullscreen mode
* **Improved Shortcut Support**: Optimized comma and period key speed adjustment logic
* **UI Improvements**: Added highlighting to active speed buttons
* **Stability Improvements**: Fixed timer cleanup issues during page transitions

#### [1.2] [Optimization]
* **Max Shortcut Speed Increased to 4x**: Expanded shortcut speed range up to 4.0x
* **Optimized Speed Algorithm**: Smoother speed adjustment experience

#### [1.0.8] [Optimization]
* **New 2.5x Playback Speed Option**: Provides finer-grained control between 2x and 3x speeds
* **UI Improvements**: Optimized speed button color coding system and settings panel interface

#### [1.0.0] [Initial Release]
* Basic speed control functionality (0.5x, 1.0x, 1.5x, 2.0x, 3.0x)
* Dual-platform support for YouTube and Bilibili
* Visual settings panel
* Multi-language interface support (Chinese/English)
* Keyboard shortcut speed control

---

## ✨ Key Features Highlights

### 1. Advanced Playback Speed Control
* **Extended Speed Options**: Interface adds more speed buttons (0.5x, 1.0x, 1.5x, 2.0x, 2.5x, 3.0x)
* **Smart Keyboard Shortcuts**: Use comma`,` key to decrease speed, period`.` key for quick one-key speed adjustment
* **Speed Indicator**: Shows current speed when adjusting in fullscreen/web fullscreen mode
* **Auto Playback Speed**: Supports custom default speed (e.g., 2x), automatically applied when video starts
* **Dual Speed List System**: 
  - **Shortcut Speed List**: Customize playback speed values used when adjusting speed with keyboard shortcuts (comma/period keys)
  - **Button Speed List**: Customize playback speed buttons displayed on the player interface
  - Two lists are configured independently, providing more flexible speed control experience
* **One-Key Turbo Playback**: Hold a custom key (default Shift) for >500ms to trigger turbo playback, release to instantly restore original speed
  - Customizable trigger key (click input field then press any key to capture, supports Shift/Ctrl/Alt/Meta/Space/Enter/Esc/Tab, etc.)
  - Customizable turbo speed (default 3.0x, only shows >1.0x speed options)
  - Speed indicator stays visible during turbo playback, auto-hides on release
  - **Solves**: Videos often contain ads, intros/outros, or irrelevant segments. Manually seeking is tedious and imprecise. This feature lets you hold a key to fast-forward through unwanted parts, then release to instantly resume normal playback—no need to touch the progress bar or remember your original speed
  - Ideal for quickly skipping ads, intros/outros, boring segments, etc.

### 2. Smart Live Stream Detection (YouTube Exclusive)
* **Live Stream Recognition**: Automatically detects YouTube live streams
* **Intelligent Speed Adjustment**: Sets playback speed to 1.0x during live streams for optimal viewing experience
* **State Switching**: Restores user-set speed after live stream ends

### 3. Interface Simplification & Optimization
* **Frosted Glass Effect**: Player speed button list optimized with translucent frosted glass styling for better visual integration
* **Button Highlighting**: Current speed button has prominent border indication
* **Remove Redundant Buttons**: Option to remove less commonly used player buttons (e.g., Subtitles, Settings, Theater Mode, Fullscreen, PiP, Original Speed, Comments Input Area) for a more focused viewing environment
* **Dynamic Button Removal**: Optimized removal of dynamically loaded buttons (e.g., comment input area that appears only in fullscreen mode)
* **Hide Comments Section**: Automatically removes comment input area for cleaner interface

### 4. Platform-Specific Enhancements

#### YouTube
* **Ad Handling Optimization**: 
  * Optimized ad detection method, reducing the detection interval to 200ms
  * Automatically restores to 1x speed during ad playback to avoid Google detector warnings caused by speeding through ads
  * Automatically restores user's preferred speed after ads end
* **Auto Skip Ad**: Automatically detects and clicks the "Skip Ad" button while an ad plays; if the button is not visible, fast-forwards the video to skip the ad directly (toggleable)
* **Domain Exclusion**: Added `accounts.youtube.com` subdomain exclusion to optimize matching logic
* **Customizable Controls**: Added settings for autoplay toggle, subtitle button, settings button, theater mode, and fullscreen button

#### Bilibili
* **Auto Display Mode**: Automatically enters selected mode after video loads — **Web Fullscreen** or **Wide Mode** (choose one, disabled by default)
* **Auto Close Login Window**: Periodically detects the login prompt dialog shown when not logged in, automatically closes it and resumes playback, blocking annoying login pop-ups when not logged in
* **Enhanced Button Management**: Options to remove Picture-in-Picture, Original Speed, and Comments Input Area buttons
* **Speed Settings Button Position Optimization**: Speed settings buttons are now added to the center bottom of the player control bar

### 5. User-Friendly & Customization
* **Brand New Settings Panel**: Completely redesigned settings interface with bilingual Chinese/English display
* **First Run Wizard**: Automatically displays settings panel on first run after script installation
* **Multi-Language Support**: Automatically detects browser language, supports Chinese and English interfaces
* **Configuration Persistence**: All settings are automatically saved, no need to reconfigure on next visit
* **System Performance Optimization**: Implemented mutex lock mechanism to prevent duplicate processing

---

## 📋 Feature Comparison Table

| Feature | YouTube | Bilibili |
|---------|---------|----------|
| Extended Speed Buttons | ✅ | ✅ |
| Keyboard Shortcut Speed Control | ✅ | ✅ |
| Speed Indicator | ✅ | ✅ |
| Auto Playback Speed | ✅ | ✅ |
| Live Stream Detection | ✅ | ❌ |
| Auto Skip Ad | ✅ | ❌ |
| Auto Display Mode | ✅ | ✅ |
| Remove Redundant Buttons | ✅ | ✅ |
| Hide Comments Section | ❌ | ✅ |
| Auto Close Login Window and Resume Playback | ❌ | ✅ |

---

## 🌍 Multi-Language Support

The script automatically switches interface language based on browser language:
- 🇨🇳 Chinese (zh-CN)
- 🇺🇸 English (other languages default to English)

---

## ⚙️ Detailed Configuration Options

### YouTube Settings:
- Auto Display Mode (Web Fullscreen)
- Auto Playback Speed (customizable default speed)
- Auto Skip Ad
- Auto Theater Mode
- Auto Remove Autoplay Toggle
- Auto Remove Subtitles Button
- Auto Remove Settings Button
- Auto Remove Theater Mode Button
- Auto Remove FullScreen Button

### Bilibili Settings:
- Auto Display Mode (radio: Web Fullscreen / Wide Mode)
- Auto Playback Speed (customizable default speed)
- Auto Remove Picture-in-Picture Button
- Auto Remove Original Speed Button
- Auto Remove Comments Input Area
- Auto close login dialog and resume playback when not logged in

---

## 💖 Donate

If you find this script helpful, feel free to use WeChat to donate and support the author's continuous development and updates of this project. Thank you for your support!

![WeChat Reward Code](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/resources/Pay.png)

## 📧 Contact Me
**julong**  
📧 Feedback Email: julong[at]111.com  
🏠 Script Homepage: https://github.com/julong111/tampermonkey-TubeBili  
🐛 Issue Feedback: https://github.com/julong111/tampermonkey-TubeBili/issues

---

## 🎯 Why Choose This Script?

* **Dual-Platform Compatibility**: One script handles both YouTube and Bilibili, eliminating the need for multiple single-purpose scripts
* **Efficient & Convenient**: Automation saves time on repetitive operations, making viewing process smoother
* **Clean Interface**: Removes unnecessary elements for a cleaner video page
* **Smart & Thoughtful**: Live stream detection, speed indicators, ad handling, and other thoughtful optimizations
* **Continual Updates**: The script is maintained by the author for long-term personal use. If any functionality fails, it will be updated immediately. Ensures long-term availability

Install "TubeBili Enhancer" now to begin your enhanced video viewing journey!