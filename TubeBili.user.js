// ==UserScript==
// @author           julong@111.com
// @namespace        com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @name             油管哔哩哔哩视频播放器增强工具
// @description      油管哔哩哔哩视频播放器下添加更多倍速播放按钮及更多配置。
// @name:en          Youtube Bilibili Video Player Enhancer Tools
// @description:en   Adds more speed buttons and more settings to YouTube and Bilibili video players.
// @version          1.4
// @license          MIT
// @icon             https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage         https://github.com/julong111/tampermonkey-TubeBili
// @supportURL       https://github.com/julong111/tampermonkey-TubeBili/issues
// @match            https://*.youtube.com*
// @match            https://*.bilibili.com*
// @include          https://*.youtube.com*
// @include          https://*.bilibili.com*
// @require           https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @grant             GM_addStyle
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";
  const i18nConfig = {
    zh: {
      Menu_Settings: "设置面板",
      Menu_Save: "保存",
      Menu_Close: "关闭",
      Menu_Shortcut_Title: "快捷键:",
      Menu_Shortcut_Items: [", 键减速", ".键加速"],

      Youtube_Action_TheaterMode: "Youtube - 自动视频网页全屏 - Theater Mode",
      Youtube_Action_Rate: "Youtube - 默认倍速播放",
      Youtube_Remove_Autoplay: "Youtube - 移除自动播放开关",
      Youtube_Remove_Subtitles: "Youtube - 移除字幕按钮",
      Youtube_Remove_Settings: "Youtube - 移除设置按钮",
      Youtube_Remove_TheaterMode: "Youtube - 移除影院模式按钮",

      Bilibili_Action_WebFullscreen: "Bilibili - 自动视频网页全屏",
      Bilibili_Action_Rate: "Bilibili - 自动倍速播放",
      Bilibili_Remove_Pip: "Bilibili - 自动移除画中画按钮",
      Bilibili_Remove_Wide: "Bilibili - 自动移除宽屏按钮",
      Bilibili_Remove_Speed: "Bilibili - 自动移除原始倍速按钮",
      Bilibili_Remove_Comments: "Bilibili - 自动移除评论输入区",
      Bilibili_Remove_Settings: "Bilibili - 自动移除设置按钮",
    },
    en: {
      Menu_Settings: "Settings Panel",
      Menu_Save: "Save",
      Menu_Close: "Close",
      Menu_Shortcut_Title: "Shortcut:",
      Menu_Shortcut_Items: [", key to decrease speed", ". key to increase speed"],

      Youtube_Action_TheaterMode: "Youtube - Auto Web Fullscreen - Theater Mode",
      Youtube_Action_Rate: "Youtube - Auto Playback",
      Youtube_Remove_Autoplay: "Youtube - Remove Autoplay Toggle",
      Youtube_Remove_Subtitles: "Youtube - Remove Subtitles Button",
      Youtube_Remove_Settings: "Youtube - Remove Settings Button",
      Youtube_Remove_TheaterMode: "Youtube - Remove Theater Mode Button",

      Bilibili_Action_WebFullscreen: "Bilibili - Auto Web Fullscreen",
      Bilibili_Action_Rate: "Bilibili - Auto Playback",
      Bilibili_Remove_Pip: "Bilibili - Auto Remove Picture-in-Picture Button",
      Bilibili_Remove_Wide: "Bilibili - Auto Remove Wide Button",
      Bilibili_Remove_Speed: "Bilibili - Auto Remove Original Speed Button",
      Bilibili_Remove_Comments: "Bilibili - Auto Remove Comments Input Area",
      Bilibili_Remove_Settings: "Bilibili - Auto Remove Settings Button",
    },
  };

  const settingPanelStyles = `
        #minimalSettingsPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 99999;
            font-family: sans-serif;
            display: none;
        }
        #minimalSettingsPanel.show {
            display: block;
        }
        #minimalSettingsPanel h2 {
            margin: 0 0 10px;
            font-size: 1.1em;
            text-align: center;
        }
        #minimalSettingsPanel .setting-item {
            margin-bottom: 10px;
        }
        #minimalSettingsPanel .setting-item input[type="text"] {
            width: 40px;
            margin-left: 8px;
            padding: 2px 4px;
            border: 1px solid #ccc;
        }
        #minimalSettingsPanel .buttons {
            margin-top: 15px;
            text-align: right;
        }
        #minimalSettingsPanel button {
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            background-color: #eee;
            border-radius: 3px;
        }
        .speed-control-button.active {
            border: 2px solid #007bff !important;
        }`;

  let youtubeLiveStreamCheck = null;

  const Common = {
    speeds: ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0"],
    shortcutSpeeds: ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0"],
    defaultSpeed: "2.0",
    colors: ["#072525", "#287F54", "#C22544"],
    currentLang: "en",
    settingPanelItems: [],
    settingPanelInitialized: false,
    settingPanelElement: null,
    speedIndicatorElement: null,
    speedIndicatorTimer: null,
    detectLanguage: function () {
      let userLang = navigator.language.toLowerCase();
      if (userLang.startsWith("zh")) {
        return "zh";
      }
      if (userLang.startsWith("en")) {
        return "en";
      }
      return "en";
    },
    geti18nText: function (key) {
      return i18nConfig[Common.currentLang][key];
    },
    initializePanel: function () {
      let panel = document.createElement("div");
      panel.id = "minimalSettingsPanel";
      let title = document.createElement("h2");
      title.textContent = Common.geti18nText("menu_settings");
      panel.appendChild(title);
      for (const [key, item] of Object.entries(Common.settingPanelItems)) {
        let functionDiv = document.createElement("div");
        functionDiv.className = "setting-item";
        panel.appendChild(functionDiv);
        let functionValue = GM_getValue(item.enableKey, false);
        let itemCheckBox = document.createElement("input");
        itemCheckBox.type = "checkbox";
        itemCheckBox.checked = functionValue;
        itemCheckBox.id = item.classId;
        functionDiv.appendChild(itemCheckBox);
        let itemTextLabel = document.createElement("label");
        itemTextLabel.setAttribute("for", item.classId);
        itemTextLabel.textContent = item.text;
        functionDiv.appendChild(itemTextLabel);
        if (item.valueKey) {
          let select = document.createElement("select");
          select.id = item.valueKey;
          select.style.marginLeft = "8px";
          Common.speeds.forEach((speed) => {
            let option = document.createElement("option");
            option.value = speed;
            option.textContent = speed + "x";
            select.appendChild(option);
          });
          select.value = GM_getValue(item.valueKey, Common.defaultSpeed);
          functionDiv.appendChild(select);
        }
      }

      // shortcut
      const shortcutContainer = document.createElement("div");
      shortcutContainer.style.marginTop = "15px";
      shortcutContainer.style.fontSize = "1.0em";
      shortcutContainer.style.color = "#666";
      shortcutContainer.style.fontWeight = "bold";
      shortcutContainer.style.display = "flex";
      shortcutContainer.style.flexDirection = "column";
      shortcutContainer.style.alignItems = "center";
      const shortcutTitleText = Common.geti18nText("Menu_Shortcut_Title");
      const titleElement = document.createElement("div");
      titleElement.textContent = shortcutTitleText;
      shortcutContainer.appendChild(titleElement);
      const shortcutItems = Common.geti18nText("Menu_Shortcut_Items");
      shortcutItems.forEach((itemText) => {
        const line = document.createElement("div");
        line.textContent = itemText;
        shortcutContainer.appendChild(line);
      });
      panel.appendChild(shortcutContainer);

      let buttons = document.createElement("div");
      buttons.className = "buttons";
      let saveBtn = document.createElement("button");
      saveBtn.id = "saveBtn";
      saveBtn.textContent = Common.geti18nText("Menu_Save");
      saveBtn.addEventListener("click", () => {
        Common.saveSettings();
      });
      let closeBtn = document.createElement("button");
      closeBtn.id = "closeBtn";
      closeBtn.textContent = Common.geti18nText("Menu_Close");
      closeBtn.addEventListener("click", () => {
        Common.togglePanel();
      });
      buttons.appendChild(saveBtn);
      buttons.appendChild(closeBtn);
      panel.appendChild(buttons);
      document.body.appendChild(panel);
      Common.settingPanelElement = panel;
      Common.settingPanelInitialized = true;
    },
    saveSettings: function () {
      for (const [key, item] of Object.entries(Common.settingPanelItems)) {
        const isChecked = document.getElementById(item.classId).checked;
        GM_setValue(item.enableKey, isChecked);
        if (item.valueKey) {
          const value = document.getElementById(item.valueKey).value;
          GM_setValue(item.valueKey, value);
        }
      }
      Common.settingPanelElement.classList.toggle("show");
    },
    togglePanel: function () {
      if (!Common.settingPanelInitialized) {
        Common.initializePanel();
      }
      Common.settingPanelElement.classList.toggle("show");
    },
    initSettingItems: function (currentUrl) {
      if (currentUrl.includes("youtube.com")) {
        Common.settingPanelItems = {
          Youtube_Action_TheaterMode: {
            classId: "Youtube_Action_TheaterMode",
            text: Common.geti18nText("Youtube_Action_TheaterMode"),
            enableKey: "Youtube_Action_TheaterMode",
          },
          Youtube_Action_Rate: {
            classId: "Youtube_Action_Rate",
            text: Common.geti18nText("Youtube_Action_Rate"),
            enableKey: "Youtube_Action_Rate_Enabled",
            valueKey: "Youtube_Action_Rate_Value",
          },
          Youtube_Remove_Autoplay: {
            classId: "Youtube_Remove_Autoplay",
            text: Common.geti18nText("Youtube_Remove_Autoplay"),
            enableKey: "Youtube_Remove_Autoplay",
          },
          Youtube_Remove_Subtitles: {
            classId: "Youtube_Remove_Subtitles",
            text: Common.geti18nText("Youtube_Remove_Subtitles"),
            enableKey: "Youtube_Remove_Subtitles",
          },
          Youtube_Remove_Settings: {
            classId: "Youtube_Remove_Settings",
            text: Common.geti18nText("Youtube_Remove_Settings"),
            enableKey: "Youtube_Remove_Settings",
          },
          Youtube_Remove_TheaterMode: {
            classId: "Youtube_Remove_TheaterMode",
            text: Common.geti18nText("Youtube_Remove_TheaterMode"),
            enableKey: "Youtube_Remove_TheaterMode",
          },
        };
      } else if (currentUrl.includes("bilibili.com")) {
        Common.settingPanelItems = {
          Bilibili_Action_WebFullscreen: {
            classId: "Bilibili_Action_WebFullscreen",
            text: Common.geti18nText("Bilibili_Action_WebFullscreen"),
            enableKey: "Bilibili_Action_WebFullscreen",
          },
          Bilibili_Action_Rate: {
            classId: "Bilibili_Action_Rate",
            text: Common.geti18nText("Bilibili_Action_Rate"),
            enableKey: "Bilibili_Rate_Enabled",
            valueKey: "Bilibili_Rate_Value",
          },
          Bilibili_Remove_Pip: {
            classId: "Bilibili_Remove_Pip",
            text: Common.geti18nText("Bilibili_Remove_Pip"),
            enableKey: "Bilibili_Remove_Pip",
          },
          Bilibili_Remove_Wide: {
            classId: "Bilibili_Remove_Wide",
            text: Common.geti18nText("Bilibili_Remove_Wide"),
            enableKey: "Bilibili_Remove_Wide",
          },
          Bilibili_Remove_Speed: {
            classId: "Bilibili_Remove_Speed",
            text: Common.geti18nText("Bilibili_Remove_Speed"),
            enableKey: "Bilibili_Remove_Speed",
          },
          Bilibili_Remove_Comments: {
            classId: "Bilibili_Remove_Comments",
            text: Common.geti18nText("Bilibili_Remove_Comments"),
            enableKey: "Bilibili_Remove_Comments",
          },
          Bilibili_Remove_Settings: {
            classId: "Bilibili_Remove_Settings",
            text: Common.geti18nText("Bilibili_Remove_Settings"),
            enableKey: "Bilibili_Remove_Settings",
          },
        };
      }
    },
    createSpeedButtons: function (panelCallback, btnClickCallback) {
      if (document.querySelector("#speedButtons")) {
        return;
      }
      let bgColor = Common.colors[0];
      let speedListDiv = document.createElement("div");
      speedListDiv.id = "speedButtons";
      speedListDiv.style.display = "flex";
      speedListDiv.style.alignItems = "center";
      speedListDiv.style.justifyContent = "center";
      speedListDiv.style.height = "100%";
      const handleButtonClick = (speed) => {
        Common.setPlaybackRate(speed);
      };
      for (let i = 0; i < Common.speeds.length; i++) {
        const speedValue = parseFloat(Common.speeds[i]);
        if (speedValue >= 1) {
          bgColor = Common.colors[1];
        }
        if (speedValue >= 1.5) {
          bgColor = Common.colors[2];
        }
        let btn = document.createElement("button");
        btn.style.backgroundColor = bgColor;
        btn.style.marginRight = "1px";
        btn.style.border = "1px solid #D3D3D3";
        btn.style.borderRadius = "2px";
        btn.style.color = "#ffffff";
        btn.style.cursor = "pointer";
        btn.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
        btn.style.display = "flex";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.width = "38px";
        btn.style.height = "24px";
        btn.style.fontSize = "14px";
        btn.textContent = Common.speeds[i] + "×";
        btn.className = "speed-control-button";
        btn.dataset.speed = Common.speeds[i];
        btn.addEventListener("click", () => {
          btnClickCallback ? btnClickCallback(Common.speeds[i]) : handleButtonClick(Common.speeds[i]);
        });
        speedListDiv.appendChild(btn);
      }
      panelCallback(speedListDiv);
    },
    removeSelector: function (selector) {
      let ele = document.querySelector(selector);
      if (ele) {
        ele.remove();
      }
    },
    setPlaybackRate: function (rate) {
      const video = document.getElementsByTagName("video")[0];
      if (video) {
        video.playbackRate = parseFloat(rate);
        Common.updateSpeedButtonHighlight(rate);
        Common.showSpeedIndicator(rate);
      }
    },
    showSpeedIndicator: function (rate) {
      if (Common.speedIndicatorTimer) {
        clearTimeout(Common.speedIndicatorTimer);
      }
      if (!Common.speedIndicatorElement) {
        const indicator = document.createElement("div");
        indicator.style.position = "fixed";
        indicator.style.top = "50%";
        indicator.style.left = "50%";
        indicator.style.transform = "translate(-50%, -50%)";
        indicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        indicator.style.color = "white";
        indicator.style.padding = "10px 20px";
        indicator.style.borderRadius = "8px";
        indicator.style.fontSize = "24px";
        indicator.style.fontWeight = "bold";
        indicator.style.zIndex = "2147483647";
        indicator.style.pointerEvents = "none";
        indicator.style.transition = "opacity 0.3s ease-out";
        indicator.style.opacity = "0";
        document.body.appendChild(indicator);
        Common.speedIndicatorElement = indicator;
      }

      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fullscreenElement) {
        if (Common.speedIndicatorElement.parentNode !== fullscreenElement) {
          fullscreenElement.appendChild(Common.speedIndicatorElement);
        }
      } else {
        if (Common.speedIndicatorElement.parentNode !== document.body) {
          document.body.appendChild(Common.speedIndicatorElement);
        }
      }

      Common.speedIndicatorElement.textContent = `${rate}x`;
      Common.speedIndicatorElement.style.opacity = "1";
      Common.speedIndicatorTimer = setTimeout(() => {
        Common.speedIndicatorElement.style.opacity = "0";
      }, 500);
    },
    updateSpeedButtonHighlight: function (rate) {
      const buttons = document.querySelectorAll(".speed-control-button");
      buttons.forEach((button) => button.classList.remove("active"));
      const activeButton = document.querySelector(`.speed-control-button[data-speed="${rate}"]`);
      if (activeButton) activeButton.classList.add("active");
    },
    handleKeydown: function (event) {
      const target = event.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      const video = document.getElementsByTagName("video")[0];
      if (!video) {
        return;
      }
      const currentRate = video.playbackRate;
      let currentIndex = Common.shortcutSpeeds.findIndex((speed) => parseFloat(speed) === currentRate);
      if (currentIndex === -1) {
        const closest = Common.shortcutSpeeds.reduce((prev, curr) => {
          return Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev;
        });
        currentIndex = Common.shortcutSpeeds.indexOf(closest);
      }
      let newIndex = currentIndex;
      if (event.code === "Comma") {
        if (currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
      } else if (event.code === "Period") {
        if (currentIndex < Common.shortcutSpeeds.length - 1) {
          newIndex = currentIndex + 1;
        }
      } else {
        return;
      }
      Common.setPlaybackRate(Common.shortcutSpeeds[newIndex]);
    },
  };
  const WebSite = {
    data: {
      youtubeLiveStreamStatus: false,
      youtubePrevRate: null,
      initialized: false, // 控制一次性初始化的标志位
      // YouTube广告相关
      youtubeAdDetected: false,
      youtubeAdPrevRate: null,
      youtubeAdCheckInterval: null,
    },
    selectors: {
      youtube: {
        // YouTube selectors listeners
        videoPanel: "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls",
        liveStreamIcon: "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button", // Youtube Live Stream check
        autoplayToggleBtn: "#movie_player .ytp-autonav-toggle",
        subtitlesBtn: "#movie_player .ytp-subtitles-button",
        settingsBtn: "#movie_player .ytp-settings-button",
        theaterMode: "#movie_player .ytp-size-button",
        finishListener: "yt-navigate-finish",
        liveStreamClass: "ytp-live-badge-is-livehead",
        adSelector: ".ytp-ad-player-overlay, .ytp-ad-player-overlay-layout",
      },
      bilibili: {
        /// Bilibili selectors
        playerContainer: "#bilibili-player",
        webFullClass: "mode-webscreen",
        speedBtn: ".bpx-player-control-bottom-left",
        videoPanel: ".bilibili-player, .bpx-player-container, #bilibiliPlayer",
        commentsPanel: "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-center",
        webFullBtn: "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web",
        pipBtn: "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-pip",
        wideBtn: "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-wide",
        speedsListBtn: "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate",
        settingsBtn: "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-setting",
      },
    },
    youtube: function () {
      if (window.location.href.includes("youtube.com/watch")) {
        const handleYoutubePage = async () => {
          console.log("执行Youtube页面脚本handler");
          try {
            let videopanel = await elmGetter.get(WebSite.selectors.youtube.videoPanel);
            console.log("添加倍速按钮");
            Common.createSpeedButtons(
              (moreSpeedsDiv) => {
                videopanel.before(moreSpeedsDiv);
                // 初始化时高亮当前播放速度按钮
                const video = document.getElementsByTagName("video")[0];
                if (video) {
                  Common.updateSpeedButtonHighlight(video.playbackRate.toString());
                }
              },
              (speed) => {
                Common.setPlaybackRate(speed);
                WebSite.data.youtubeLiveStreamStatus = false;
              },
            );
          } catch (error) {
            console.error("Failed create speed button elements:", error);
          }

          try {
            const removalConfigs = {
              Youtube_Remove_Autoplay: WebSite.selectors.youtube.autoplayToggleBtn,
              Youtube_Remove_Subtitles: WebSite.selectors.youtube.subtitlesBtn,
              Youtube_Remove_Settings: WebSite.selectors.youtube.settingsBtn,
              Youtube_Remove_TheaterMode: WebSite.selectors.youtube.theaterMode,
            };
            for (const key in removalConfigs) {
              if (GM_getValue(Common.settingPanelItems[key].enableKey, false)) {
                elmGetter.get(removalConfigs[key]).then((item) => {
                  console.log("移除按钮:", removalConfigs[key]);
                  item.remove();
                });
              }
            }
          } catch (error) {
            console.error("Failed autoremove buttons:", error);
          }

          // 自动进入影院模式
          if (GM_getValue(Common.settingPanelItems.Youtube_Action_TheaterMode.enableKey, false)) {
            elmGetter.get(WebSite.selectors.youtube.theaterMode).then((item) => {
              item.click();
            });
          }

          if (GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.enableKey, false)) {
            const rate = parseFloat(GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.valueKey, Common.defaultSpeed));
            console.log(`设置 ${rate} 倍速播放`);
            Common.setPlaybackRate(rate);
            WebSite.data.youtubeLiveStreamStatus = false;
          }
        };

        // 启动直播状态检测
        youtubeLiveStreamCheck = setInterval(() => {
          const element = document.querySelector(WebSite.selectors.youtube.liveStreamIcon);
          const isLive = element && element.classList.contains(WebSite.selectors.youtube.liveStreamClass);
          const isWatchPage = window.location.href.includes("youtube.com/watch");

          if (isWatchPage) {
            if (isLive && !WebSite.data.youtubeLiveStreamStatus) {
              // 检测到直播开始
              const rate = parseFloat(GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.valueKey, Common.defaultSpeed));
              Common.setPlaybackRate(1.0);
              console.log("已检测到直播，重置播放速度为1.0，原设定倍速: " + rate);
              WebSite.data.youtubeLiveStreamStatus = true;
              WebSite.data.youtubePrevRate = rate; // 保存用户设定的倍速
            } else if (!isLive && WebSite.data.youtubeLiveStreamStatus) {
              // 检测到直播结束，恢复用户设定的倍速
              const prevRate = WebSite.data.youtubePrevRate || parseFloat(GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.valueKey, Common.defaultSpeed));
              Common.setPlaybackRate(prevRate);
              console.log("直播已结束，恢复播放速度为" + prevRate);
              WebSite.data.youtubeLiveStreamStatus = false;
              WebSite.data.youtubePrevRate = null;
            }
          }
        }, 1000);

        // YouTube广告检测
        const checkForAd = () => {
          // 检测广告覆盖层元素是否存在（更可靠的方式）
          const adOverlay = document.querySelector(WebSite.selectors.youtube.adSelector);
          const video = document.getElementsByTagName("video")[0];

          if (adOverlay && !WebSite.data.youtubeAdDetected && video) {
            // 检测到广告开始
            const currentRate = video.playbackRate;
            WebSite.data.youtubeAdPrevRate = currentRate;
            Common.setPlaybackRate(1.0);
            console.log("已检测到广告，重置播放速度为1.0，原倍速: " + currentRate);
            WebSite.data.youtubeAdDetected = true;
          } else if (!adOverlay && WebSite.data.youtubeAdDetected && video) {
            // 广告已结束
            const prevRate = WebSite.data.youtubeAdPrevRate;
            if (prevRate !== null && prevRate !== 1.0) {
              Common.setPlaybackRate(prevRate);
              console.log("广告已结束，恢复播放速度为" + prevRate);
            }
            WebSite.data.youtubeAdDetected = false;
            WebSite.data.youtubeAdPrevRate = null;
          }
        };

        // 启动广告检测定时器
        WebSite.data.youtubeAdCheckInterval = setInterval(checkForAd, 500);

        handleYoutubePage();
      }
    },
    bilibili: function () {
      const handleBilibiliPage = async () => {
        try {
          await elmGetter.get(WebSite.selectors.bilibili.videoPanel);
          Common.createSpeedButtons((moreSpeedsDiv) => {
            let ele = document.querySelector(WebSite.selectors.bilibili.speedBtn);
            if (ele) {
              ele.after(moreSpeedsDiv);
              // 初始化时高亮当前播放速度按钮
              const video = document.getElementsByTagName("video")[0];
              if (video) {
                Common.updateSpeedButtonHighlight(video.playbackRate.toString());
              }
            }
          });
        } catch (error) {
          console.error("Failed create speed button elements:", error);
        }

        try {
          const removalConfigs = {
            Bilibili_Remove_Comments: WebSite.selectors.bilibili.commentsPanel,
            Bilibili_Remove_Pip: WebSite.selectors.bilibili.pipBtn,
            Bilibili_Remove_Wide: WebSite.selectors.bilibili.wideBtn,
            Bilibili_Remove_Speed: WebSite.selectors.bilibili.speedsListBtn,
            Bilibili_Remove_Settings: WebSite.selectors.bilibili.settingsBtn,
          };
          for (const key in removalConfigs) {
            if (GM_getValue(Common.settingPanelItems[key].enableKey, false)) {
              elmGetter.get(removalConfigs[key]).then((item) => {
                item.remove();
              });
            }
          }
        } catch (error) {
          console.error("Failed autoremove buttons:", error);
        }

        try {
          if (GM_getValue(Common.settingPanelItems.Bilibili_Action_WebFullscreen.enableKey, false)) {
            elmGetter.get(WebSite.selectors.bilibili.playerContainer).then((playItem) => {
              if (playItem.classList.contains(WebSite.selectors.bilibili.webFullClass)) {
                return;
              }
              elmGetter.get(WebSite.selectors.bilibili.webFullBtn).then((item) => {
                item.click();
              });
            });
          }
        } catch (error) {
          console.error("Failed webfull or auto rate:", error);
        }

        if (GM_getValue(Common.settingPanelItems.Bilibili_Action_Rate.enableKey, false)) {
          const rate = parseFloat(GM_getValue(Common.settingPanelItems.Bilibili_Action_Rate.valueKey, Common.defaultSpeed));
          Common.setPlaybackRate(rate);
        }
      };

      if (window.location.href.includes("bilibili.com/video")) {
        handleBilibiliPage();
      }
    },
  };

  function main() {
    // 每次页面加载时，都先清理所有可能存在的定时器
    if (youtubeLiveStreamCheck !== null) {
      clearInterval(youtubeLiveStreamCheck);
      youtubeLiveStreamCheck = null;
    }
    if (WebSite.data.youtubeAdCheckInterval !== null) {
      clearInterval(WebSite.data.youtubeAdCheckInterval);
      WebSite.data.youtubeAdCheckInterval = null;
    }
    // 重置广告检测状态
    WebSite.data.youtubeAdDetected = false;
    WebSite.data.youtubeAdPrevRate = null;
    Common.currentLang = Common.detectLanguage();
    Common.initSettingItems(window.location.href);

    // 一次性初始化的操作（只执行一次）
    if (!WebSite.data.initialized) {
      GM_addStyle(settingPanelStyles);
      GM_registerMenuCommand(Common.geti18nText("Menu_Settings"), Common.togglePanel);
      document.addEventListener("keydown", Common.handleKeydown);
      WebSite.data.initialized = true;
    }

    // 首次加载时执行
    if (window.location.href.includes("youtube.com/watch")) {
      console.log("首次执行Youtube脚本");
      WebSite.youtube();
    } else if (window.location.href.includes("bilibili.com/video")) {
      console.log("首次执行Bilibili脚本");
      WebSite.bilibili();
    }

    // YouTube 导航监听器也只注册一次
    if (window.location.href.includes("youtube.com") && !WebSite.data.youtubeNavListenerRegistered) {
      console.log("注册Youtube监听器");
      window.addEventListener(WebSite.selectors.youtube.finishListener, WebSite.youtube);
      WebSite.data.youtubeNavListenerRegistered = true;
    }
  }
  main();

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    // 这个监听器只为Bilibili的URL变化服务，以解决自动连播问题。
    // YouTube有自己的 'yt-navigate-finish' 事件监听器，不受此影响。
    if (url !== lastUrl && url.includes("bilibili.com/video")) {
      lastUrl = url;
      console.log(`Bilibili URL changed to: ${url}. Re-running main logic.`);
      main();
    }
  }).observe(document, { subtree: true, childList: true });
})();
