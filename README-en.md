[中文](README.md) | [English](#)

# 🚀 TubeBili Enhancer | Youtube Bilibili Video Player Enhancer Tools

TubeBili is a powerful userscript designed specifically for Tampermonkey users, aiming to significantly improve your viewing experience on **YouTube** and **Bilibili**. Through automation and personalized settings, it helps you eliminate repetitive operations and focus more on enjoying video content. TubeBili provides the following enhancements for YouTube and Bilibili video players:
- 🚀 Auto playback speed setting
- 🎯 Customizable speed list
- ⌨️ Keyboard shortcut speed adjustment (comma to decrease, period to increase)
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

Download and install the script here: [TubeBili.userscripts.js](https://raw.githubusercontent.com/julong111/tampermonkey-TubeBili/refs/heads/main/TubeBili.userscripts.js)

---

## 📝 Changelog

All notable changes to this project will be documented in this file. We truly appreciate every user's support and suggestions!

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

### 2. Smart Live Stream Detection (YouTube Exclusive)
* **Live Stream Recognition**: Automatically detects YouTube live streams
* **Intelligent Speed Adjustment**: Sets playback speed to 1.0x during live streams for optimal viewing experience
* **State Switching**: Restores user-set speed after live stream ends

### 3. Interface Simplification & Optimization
* **Frosted Glass Effect**: Player speed button list optimized with translucent frosted glass styling for better visual integration
* **Button Highlighting**: Current speed button has prominent border indication
* **Remove Redundant Buttons**: Option to remove less commonly used Picture-in-Picture, Wide Screen, original speed, settings buttons for a more focused viewing environment
* **Dynamic Button Removal**: Optimized removal of dynamically loaded buttons (e.g., comment input area that appears only in fullscreen mode)
* **Hide Comments Section**: Automatically removes comment input area for cleaner interface

### 4. Platform-Specific Enhancements

#### YouTube
* **Ad Handling Optimization**: 
  * Optimized ad detection method, reducing the detection interval to 200ms
  * Automatically restores to 1x speed during ad playback to avoid Google detector warnings caused by speeding through ads
  * Automatically restores user's preferred speed after ads end
* **Domain Exclusion**: Added `accounts.youtube.com` subdomain exclusion to optimize matching logic
* **Customizable Controls**: Added settings for autoplay toggle, subtitle button, and settings button

#### Bilibili
* **Auto Close Login Window**: Periodically detects the login prompt dialog shown when not logged in, automatically closes it and resumes playback, blocking annoying login pop-ups when not logged in
* **Auto Web Fullscreen**: Automatically enters web fullscreen mode after video loads
* **Enhanced Button Management**: Options to remove Quality, Episode List, Picture-in-Picture, Wide Screen, Original Speed, Settings, and Web Fullscreen buttons
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
| Auto Web Fullscreen | ❌ | ✅ |
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
- [ ] Auto Playback Speed (customizable default speed)
- [ ] Auto Remove Autoplay Toggle
- [ ] Auto Remove Subtitles Button
- [ ] Auto Remove Settings Button

### Bilibili Settings:
- [ ] Auto Web Fullscreen
- [ ] Auto Playback Speed (customizable default speed)
- [ ] Auto Remove Quality Button
- [ ] Auto Remove Episode List Button
- [ ] Auto Remove Picture-in-Picture Button
- [ ] Auto Remove Wide Screen Button
- [ ] Auto Remove Original Speed Button
- [ ] Auto Remove Comments Input Area
- [ ] Auto Remove Settings Button
- [ ] Auto Remove Web Fullscreen Button
- [x] Auto close login dialog and resume playback when not logged in

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