[中文](README.md) | [English](#)

### 🚀 Quick Start

Install as a userscript here: [here](https://greasyfork.org/zh-CN/scripts/546313-youtube-bilibili-video-player-enhancer-tools)

You will need a userscript manager like [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Greasemonkey](https://addons.mozilla.org/nl/firefox/addon/greasemonkey/)

### TODO
* **Bilibili Unlimited 1080P Trial Without Logging In**: Automatically hijacks the trial mechanism, allowing users to endlessly try 1080P HD quality without logging in. Blocks annoying login pop-ups when not logged in, enabling a high-definition experience without the need to log in.

### Changelog
All notable changes to this project will be documented in this file.  

#### [2.0] [**Major Version Update**]
* **⭐Important⭐ Settings Reset**: After updating to version 2.0, **settings from version 1.x will NOT carry over. Please reopen the settings panel and reconfigure!**
* **System Performance Optimization**: Implemented mutex lock mechanism to prevent the Handler from being processed twice under certain race conditions.
* **YouTube Feature Enhancements**:
  * **New Domain Exclusion**: Added `accounts.youtube.com` subdomain exclusion to optimize YouTube matching logic
  * **Fixed YouTube Ad Warnings**
  * **Optimized ad detection method**, reducing the detection interval to 200ms
  * Automatically restores to 1x speed during ad playback to avoid Google detector warnings caused by speeding through ads
  * Automatically restores user's preferred speed after ads end
  * Removed YouTube MiniPlayer button settings
  * Added settings for YouTube autoplay toggle, subtitle button, and settings button
* **Bilibili Feature Enhancements**:
  * **New and Updated Button Removal Options**: Quality, Episode List, Picture-in-Picture, Wide Screen, Original Speed, Settings, Web Fullscreen buttons
  * **Dynamic Button Removal**: Optimized removal of dynamically loaded buttons (e.g., comment input area that appears only in fullscreen mode)
  * **Speed Settings Button Position Optimization**: Speed settings buttons are now added to the center of the player control bar

#### [1.3] [Feature Enhancement & Optimization]
* **New Live Stream Detection**: Automatically sets playback speed to 1.0x during YouTube live streams
* **Enhanced Speed Indicator**: Shows current playback speed in fullscreen mode
* **Improved Shortcut Support**: Optimized comma`,` and period`.` key speed adjustment logic
* **UI Improvements**: Added highlighting to active speed buttons for better user experience
* **Stability Improvements**: Fixed timer cleanup issues during page transitions

#### [1.2] Significantly increased maximum shortcut playback speed to **4x**
* Expanded shortcut speed range up to 4.0x
* Optimized shortcut speed adjustment algorithm for smoother experience
* Allows users to browse or review content much faster and more efficiently

#### [1.0.8] New **2.5x** playback speed option
* Provides finer-grained control between 2x and 3x speeds for a smoother experience
* Optimized speed button color coding system
* Improved user interface for settings panel

#### [1.0.0] Initial Release
* Basic speed control functionality (0.5x, 1.0x, 1.5x, 2.0x, 3.0x)
* Dual-platform support for YouTube and Bilibili
* Visual settings panel
* Multi-language interface support (Chinese/English)
* Keyboard shortcut speed control

We truly appreciate every user's support and suggestions!  
Stay tuned for more performance enhancements, new features, and a better experience in upcoming releases.

### Donate 👍
This project is maintained by an individual. If you find the script helpful, please scan the QR code on WeChat to donate. Thank you for your support!
![微信赞赏码](微信赞赏码.png)

### Contact Me
julong[at]111.com


# Youtube Bilibili Video Player Enhancer Tools
## Core Features Overview:
"Youtube Bilibili Video Player Enhancer Tools" is a powerful video enhancement userscript designed to significantly improve your viewing experience on both YouTube and Bilibili. By automating and personalizing settings, it helps you eliminate repetitive tasks and focus more on enjoying the video content.

## 🎯 Key Features Highlights:

### 1. Advanced Playback Speed Control
* **Extended Speed Options**: Interface adds more speed buttons (0.5x, 1.0x, 1.5x, 2.0x, 2.5x, 3.0x)
* **Smart Keyboard Shortcuts**: Use comma`,` key to decrease speed, period`.` key to increase speed, supports up to 4x speed (shortcut keys)
* **Speed Indicator**: Shows current speed when adjusting in fullscreen/web fullscreen mode
* **Auto Playback Speed**: Supports custom default speed (e.g., 2x), automatically applied when video starts

### 2. Smart Live Stream Detection (YouTube Exclusive)
* **Live Stream Recognition**: Automatically detects YouTube live streams
* **Intelligent Speed Adjustment**: Sets playback speed to 1.0x during live streams for optimal viewing experience
* **State Switching**: Restores user-set speed after live stream ends

### 3. Interface Simplification & Optimization

#### Feature Settings:
* **Button Highlighting**: Current speed button has prominent border indication
* **Remove Less Common Player Buttons**: Provides more focused viewing environment
* **Auto Web Fullscreen**: Automatically enters web fullscreen mode after video loads
* **Remove Redundant Buttons**: Option to remove less commonly used Picture-in-Picture, Wide Screen, original speed, settings buttons
* **Hide Comments Section**: Automatically removes comment input area for cleaner interface

### 4. User-Friendly & Customization
* **Visual Settings Panel**: All features can be easily enabled/disabled with checkboxes
* **Multi-Language Support**: Automatically detects browser language, supports Chinese and English interfaces
* **Configuration Persistence**: All settings are automatically saved, no need to reconfigure on next visit

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
| Unlimited 1080P Trial (No Login) | ❌ | ✅ |

## ⚙️ Detailed Configuration Options

### YouTube Settings:
- [ ] Auto Playback Speed (customizable default speed)
- [ ] Auto Remove Autoplay Toggle
- [ ] Auto Remove Subtitles Button
- [ ] Auto Remove Settings Button

### Bilibili Settings:
- [ ] Auto Web Fullscreen
- [ ] Auto Playback Speed (customizable default speed)
- [ ] Unlimited 1080P Trial (No Login)
- [ ] Auto Remove Quality Button
- [ ] Auto Remove Episode List Button
- [ ] Auto Remove Picture-in-Picture Button
- [ ] Auto Remove Wide Screen Button
- [ ] Auto Remove Original Speed Button
- [ ] Auto Remove Comments Input Area
- [ ] Auto Remove Settings Button
- [ ] Auto Remove Web Fullscreen Button

## 🚀 Why Choose This Script?
* **Dual-Platform Compatibility**: One script handles both YouTube and Bilibili, eliminating the need for multiple single-purpose scripts
* **Efficient & Convenient**: Automation saves time on repetitive operations, making viewing process smoother
* **Clean Interface**: Removes unnecessary elements for a cleaner video page
* **Smart & Thoughtful**: Live stream detection, speed indicators, and other thoughtful optimizations
* **Continual Updates**: The script is maintained by the author for long-term personal use. If any functionality fails, it will be updated immediately. Ensures long-term availability

Install "Youtube Bilibili Video Player Enhancer Tools" now to begin your enhanced video viewing journey!

![UI0](UI0.png)
![UI1](UI1.png)
![Setting0](Setting0.png)
![Setting1](Setting1.png)
![Setting2](Setting2.png)