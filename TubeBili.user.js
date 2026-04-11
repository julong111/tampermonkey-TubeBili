// ==UserScript==
// @author           julong@111.com
// @namespace        com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @name             油管哔哩哔哩视频播放器增强工具
// @description      油管哔哩哔哩视频播放器下添加更多倍速播放按钮及更多配置。
// @name:en          Youtube Bilibili Video Player Enhancer Tools
// @description:en   Adds more speed buttons and more settings to YouTube and Bilibili video players.
// @version          2.0
// @license          MIT
// @icon             https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage         https://github.com/julong111/tampermonkey-TubeBili
// @supportURL       https://github.com/julong111/tampermonkey-TubeBili/issues
// @match            https://*.youtube.com*
// @match            https://*.bilibili.com*
// @include          https://*.youtube.com*
// @include          https://*.bilibili.com*
// @exclude          https://accounts.youtube.com/*
// @require          https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @grant            GM_addStyle
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @run-at           document-start
// ==/UserScript==

(function () {
  "use strict";

  // ==================== Bilibili 无限试用早期劫持 ====================
  // 必须在页面加载前执行，否则 B站代码会先执行
  const bilibiliUnlimitedTrialEarlyHook = function() {
    // 只在 Bilibili 视频页面执行
    if (!window.location.href.includes('bilibili.com/video')) return;
    
    // 检查功能是否启用（使用 localStorage 作为临时存储，因为 GM_getValue 可能不可用）
    const isEnabled = localStorage.getItem('Bilibili_Action_Unlimited_Trial') === 'true';
    if (!isEnabled) return;
    
    // 检查是否已登录
    if (document.cookie.includes('DedeUserID')) return;

    console.log("[无限试用1080P] 开始劫持 API...");

    // 劫持 Object.defineProperty - 欺骗试用资格检测
    const originDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
      if (prop === 'isViewToday' || prop === 'isVideoAble') {
        console.log("[无限试用1080P] 拦截到属性定义:", prop);
        descriptor = {
          get: () => true,
          enumerable: false,
          configurable: true
        };
      }
      return originDefineProperty.call(this, obj, prop, descriptor);
    };

    // 劫持 setTimeout - 延长试用倒计时
    // 必须使用 unsafeWindow，因为 B站播放器代码运行在页面真实环境中
    const originSetTimeout = unsafeWindow.setTimeout;
    unsafeWindow.setTimeout = function(func, delay, ...args) {
      if (delay === 30000 && func && typeof func === 'function') {
        const funcStr = func.toString();
        if (funcStr.includes('toast') || funcStr.includes('试用') || funcStr.includes('login') || funcStr.includes('trial')) {
          console.log("[无限试用1080P] 拦截试用倒计时");
          delay = 300000000;
        }
      }
      return originSetTimeout.call(this, func, delay, ...args);
    };

    console.log("[无限试用1080P] API 劫持完成");
  };

  // 立即执行早期劫持
  bilibiliUnlimitedTrialEarlyHook();

  const i18nConfig = {
    zh: {
      Menu_Settings: "设置面板",
      Menu_Save: "保存",
      Menu_Close: "关闭",
      Menu_Shortcut_Title: "快捷键:",
      Menu_Shortcut_Items: [", 键减速", ".键加速"],

      Youtube_Action_TheaterMode: "Youtube - 自动视频网页全屏",
      Youtube_Action_Rate: "Youtube - 自动倍速播放",

      Youtube_Remove_Autoplay: "Youtube - 移除自动播放开关",
      Youtube_Remove_Subtitles: "Youtube - 移除字幕按钮",
      Youtube_Remove_Settings: "Youtube - 移除设置按钮",
      Youtube_Remove_TheaterMode: "Youtube - 移除影院模式按钮",

      Bilibili_Action_WebFullscreen: "Bilibili - 自动视频网页全屏",
      Bilibili_Action_Rate: "Bilibili - 自动倍速播放",
      Bilibili_Action_Unlimited_Trial: "Bilibili - 未登录时无限试用1080P",

      Bilibili_Remove_Quality: "Bilibili - 移除分辨率按钮",
      Bilibili_Remove_Eplist: "Bilibili - 移除选集按钮",
      Bilibili_Remove_Pip: "Bilibili - 移除画中画按钮",
      Bilibili_Remove_Wide: "Bilibili - 移除宽屏按钮",
      Bilibili_Remove_Speed: "Bilibili - 移除原始倍速按钮",
      Bilibili_Remove_Comments: "Bilibili - 移除评论输入区",
      Bilibili_Remove_Settings: "Bilibili - 移除设置按钮",
      Bilibili_Remove_WebFullscreen: "Bilibili - 移除网页全屏按钮",
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
      Bilibili_Action_Unlimited_Trial: "Bilibili - Unlimited 1080P Trial (No Login)",

      Bilibili_Remove_Quality: "Bilibili - Remove Quality Button",
      Bilibili_Remove_Eplist: "Bilibili - Remove Episode List Button",
      Bilibili_Remove_Pip: "Bilibili - Remove Picture-in-Picture Button",
      Bilibili_Remove_Wide: "Bilibili - Remove Wide Button",
      Bilibili_Remove_Speed: "Bilibili - Remove Original Speed Button",
      Bilibili_Remove_Comments: "Bilibili - Remove Comments Input Area",
      Bilibili_Remove_Settings: "Bilibili - Remove Settings Button",
      Bilibili_Remove_WebFullscreen: "Bilibili - Remove Web Fullscreen Button",
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
        // 同步到 localStorage，供早期劫持使用
        localStorage.setItem(item.enableKey, isChecked.toString());
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
      // 同步所有设置到 localStorage，供早期劫持使用
      for (const [key, item] of Object.entries(Common.settingPanelItems)) {
        const value = GM_getValue(item.enableKey, false);
        localStorage.setItem(item.enableKey, value.toString());
      }

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
          Bilibili_Remove_Quality: {
            classId: "Bilibili_Remove_Quality",
            text: Common.geti18nText("Bilibili_Remove_Quality"),
            enableKey: "Bilibili_Remove_Quality",
          },
          Bilibili_Remove_Eplist: {
            classId: "Bilibili_Remove_Eplist",
            text: Common.geti18nText("Bilibili_Remove_Eplist"),
            enableKey: "Bilibili_Remove_Eplist",
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
          Bilibili_Remove_WebFullscreen: {
            classId: "Bilibili_Remove_WebFullscreen",
            text: Common.geti18nText("Bilibili_Remove_WebFullscreen"),
            enableKey: "Bilibili_Remove_WebFullscreen",
          },
          Bilibili_Action_Unlimited_Trial: {
            classId: "Bilibili_Action_Unlimited_Trial",
            text: Common.geti18nText("Bilibili_Action_Unlimited_Trial"),
            enableKey: "Bilibili_Action_Unlimited_Trial",
          },
        };
      }
    },
    createSpeedButtons: function (panelCallback, btnClickCallback) {
      console.log("添加倍速按钮");
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
        WebSite.data.youtubeFallbackRate = speed;
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
      WebSite.data.youtubeFallbackRate = Common.shortcutSpeeds[newIndex]; // 更新全局当前倍速
    },
  };
  const WebSite = {
    data: {
      initialized: false, // 控制一次性初始化的标志位
      youtubeLiveStreamStatus: false,
      // YouTube广告相关
      youtubeFallbackRate: null, // 全局变量，记录当前倍速
      youtubeAdDetected: false,
      youtubeAdCheckInterval: null,
      // 防止 main() 递归调用
      isMainRunning: false,
      // 防止 handleYoutubePage 并发执行
      isYoutubePageProcessing: false,
      // Bilibili 无限试用相关
      bilibiliUnlimitedTrialApplied: false,
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
        webFullClass: "bpx-state-entered",
        speedBtn: ".bpx-player-control-bottom-center",
        videoPanel: ".bpx-player-container",
        commentsPanel: ".bpx-player-sending-bar",
        qualityBtn: ".bpx-player-ctrl-quality",
        eplistBtn: ".bpx-player-ctrl-eplist",
        webFullBtn: ".bpx-player-ctrl-web",
        pipBtn: ".bpx-player-ctrl-pip",
        wideBtn: ".bpx-player-ctrl-wide",
        speedsListBtn: ".bpx-player-ctrl-playbackrate",
        settingsBtn: ".bpx-player-ctrl-setting",
        trialConfirmBtn: ".bpx-player-toast-confirm-login",
      },
    },
    bilibiliUnlimitedTrial: function () {
      console.log("[无限试用] 启动自动点击试用按钮...");

      // 自动点击试用按钮（API劫持已在早期完成）
      const trialClickInterval = setInterval(() => {
        const trialBtn = document.querySelector(WebSite.selectors.bilibili.trialConfirmBtn);
        if (trialBtn) {
          console.log("[无限试用] 检测到试用按钮，自动切换已完成");
          trialBtn.click();
        }
      }, 100);

      // 将定时器保存到 data 中，以便后续清理
      WebSite.data.bilibiliTrialClickInterval = trialClickInterval;

      console.log("[无限试用] 自动点击已启动");
    },
    youtube: function () {
      console.log("========== WebSite.youtube() 被调用 ==========");
      console.log("当前URL:", window.location.href);
      if (window.location.href.includes("youtube.com/watch")) {
        const handleYoutubePage = async () => {
          if (WebSite.data.isYoutubePageProcessing) {
            console.log("[跳过] handleYoutubePage 正在执行中，跳过此次调用");
            return;
          }
          WebSite.data.isYoutubePageProcessing = true;
          console.log(">>>> handleYoutubePage() 开始执行");
          try {
            let videopanel = await elmGetter.get(WebSite.selectors.youtube.videoPanel);
            console.log("[UI] videoPanel 元素已获取，准备添加倍速按钮");
            Common.createSpeedButtons(
              (moreSpeedsDiv) => {
                videopanel.before(moreSpeedsDiv);
                console.log("[UI] 倍速按钮已添加到 videoPanel 之前");
                // 初始化时高亮当前播放速度按钮
                const video = document.getElementsByTagName("video")[0];
                if (video) {
                  console.log("[UI] 当前视频播放速度:", video.playbackRate);
                  Common.updateSpeedButtonHighlight(video.playbackRate.toString());
                }
              },
              (speed) => {
                console.log("[交互] 用户点击速度按钮:", speed);
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
                  console.log("[UI] 移除按钮:", removalConfigs[key]);
                  item.remove();
                });
              }
            }
          } catch (error) {
            console.error("Failed autoremove buttons:", error);
          }

          // 自动进入影院模式
          if (GM_getValue(Common.settingPanelItems.Youtube_Action_TheaterMode.enableKey, false)) {
            console.log("[设置] 自动进入影院模式 已启用");
            elmGetter.get(WebSite.selectors.youtube.theaterMode).then((item) => {
              console.log("[操作] 点击影院模式按钮");
              item.click();
            });
          }

          const autoRateEnabled = GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.enableKey, false);
          console.log("[设置] 自动倍速播放:", autoRateEnabled ? "已启用" : "未启用");
          if (autoRateEnabled) {
            // 检查是否正在播放广告，如果正在播放广告则不设置倍速
            const adOverlay = document.querySelector(WebSite.selectors.youtube.adSelector);
            const adOverlayExists = !!adOverlay;
            console.log("[设置] 当前广告覆盖层存在:", adOverlayExists);
            if (!adOverlay) {
              const rate = parseFloat(GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.valueKey, Common.defaultSpeed));
              console.log("[设置] 准备设置倍速:", rate);
              Common.setPlaybackRate(rate);
              WebSite.data.youtubeLiveStreamStatus = false;
            } else {
              console.log("[跳过] 检测到广告，跳过倍速设置");
            }
          }
          console.log("<<<< handleYoutubePage() 执行完毕");
          WebSite.data.isYoutubePageProcessing = false;
        };

        handleYoutubePage();
      }
      console.log("========== WebSite.youtube() 执行完毕 ==========");
    },
    bilibili: function () {
      console.log("========== WebSite.bilibili() 被调用 ==========");
      console.log("当前URL:", window.location.href);
      const handleBilibiliPage = async () => {
        console.log(">>>> handleBilibiliPage() 开始执行");

        // 检查是否启用未登录无限试用1080P功能
        const unlimitedTrialEnabled = GM_getValue(Common.settingPanelItems.Bilibili_Action_Unlimited_Trial?.enableKey, false);
        console.log("[设置] 未登录无限试用1080P:", unlimitedTrialEnabled ? "已启用" : "未启用");

        if (unlimitedTrialEnabled && !WebSite.data.bilibiliUnlimitedTrialApplied) {
          // 检查是否已登录
          const isLoggedIn = document.cookie.includes("DedeUserID");
          console.log("[检测] 用户登录状态:", isLoggedIn ? "已登录" : "未登录");

          if (!isLoggedIn) {
            console.log("[操作] 应用无限试用1080P功能");
            WebSite.bilibiliUnlimitedTrial();
            WebSite.data.bilibiliUnlimitedTrialApplied = true;
          }
        }
        try {
          await elmGetter.get(WebSite.selectors.bilibili.videoPanel);
          console.log("[UI] videoPanel 元素已获取");
          Common.createSpeedButtons((moreSpeedsDiv) => {
            let ele = document.querySelector(WebSite.selectors.bilibili.speedBtn);
            if (ele) {
              ele.after(moreSpeedsDiv);
              console.log("[UI] 倍速按钮已添加到 speedBtn 之后");
              const video = document.getElementsByTagName("video")[0];
              if (video) {
                console.log("[UI] 当前视频播放速度:", video.playbackRate);
                Common.updateSpeedButtonHighlight(video.playbackRate.toString());
              }
            }
          });
        } catch (error) {
          console.error("Failed create speed button elements:", error);
        }

        try {
          const removalConfigs = {
            Bilibili_Remove_Quality: WebSite.selectors.bilibili.qualityBtn,
            Bilibili_Remove_Eplist: WebSite.selectors.bilibili.eplistBtn,
            Bilibili_Remove_Pip: WebSite.selectors.bilibili.pipBtn,
            Bilibili_Remove_Wide: WebSite.selectors.bilibili.wideBtn,
            Bilibili_Remove_Speed: WebSite.selectors.bilibili.speedsListBtn,
            Bilibili_Remove_Comments: WebSite.selectors.bilibili.commentsPanel,
            Bilibili_Remove_Settings: WebSite.selectors.bilibili.settingsBtn,
            Bilibili_Remove_WebFullscreen: WebSite.selectors.bilibili.webFullBtn,
          };
          // 启动定时任务，每秒检查并移除按钮
          setInterval(() => {
            for (const key in removalConfigs) {
              const enableKey = Common.settingPanelItems[key]?.enableKey;
              const isEnabled = GM_getValue(enableKey, false);
              if (isEnabled) {
                const item = document.querySelector(removalConfigs[key]);
                if (item) {
                  console.log("[UI] 移除按钮:", key);
                  item.remove();
                }
              }
            }
          }, 1000);
        } catch (error) {
          console.error("Failed autoremove buttons:", error);
        }

        try {
          if (GM_getValue(Common.settingPanelItems.Bilibili_Action_WebFullscreen.enableKey, false)) {
            console.log("[设置] 自动网页全屏 已启用");
            elmGetter.get(WebSite.selectors.bilibili.playerContainer).then((playItem) => {
              if (playItem.classList.contains(WebSite.selectors.bilibili.webFullClass)) {
                console.log("[跳过] 已是网页全屏模式");
                return;
              }
              elmGetter.get(WebSite.selectors.bilibili.webFullBtn).then((item) => {
                console.log("[操作] 点击网页全屏按钮");
                item.click();
              });
            });
          }
        } catch (error) {
          console.error("Failed webfull or auto rate:", error);
        }

        const autoRateEnabled = GM_getValue(Common.settingPanelItems.Bilibili_Action_Rate.enableKey, false);
        console.log("[设置] 自动倍速播放:", autoRateEnabled ? "已启用" : "未启用");
        if (autoRateEnabled) {
          const rate = parseFloat(GM_getValue(Common.settingPanelItems.Bilibili_Action_Rate.valueKey, Common.defaultSpeed));
          console.log("[设置] 准备设置倍速:", rate);
          Common.setPlaybackRate(rate);
        }
        console.log("<<<< handleBilibiliPage() 执行完毕");
      };

      if (window.location.href.includes("bilibili.com/video")) {
        handleBilibiliPage();
      }
      console.log("========== WebSite.bilibili() 执行完毕 ==========");
    },
  };

  function main() {
    // 防止递归调用
    if (WebSite.data.isMainRunning) {
      console.log("========== main() 正在执行中，跳过此次调用 ==========");
      return;
    }
    WebSite.data.isMainRunning = true;

    console.log("========== main() 开始执行 ==========");
    console.log("当前URL:", window.location.href);
    console.log("initialized状态:", WebSite.data.initialized);

    // 每次页面加载时，都先清理所有可能存在的定时器
    if (youtubeLiveStreamCheck !== null) {
      console.log("[清理] youtubeLiveStreamCheck 定时器");
      clearInterval(youtubeLiveStreamCheck);
      youtubeLiveStreamCheck = null;
    }
    if (WebSite.data.youtubeAdCheckInterval !== null) {
      console.log("[清理] youtubeAdCheckInterval 定时器");
      clearInterval(WebSite.data.youtubeAdCheckInterval);
      WebSite.data.youtubeAdCheckInterval = null;
    }
    if (WebSite.data.bilibiliTrialClickInterval !== null) {
      console.log("[清理] bilibiliTrialClickInterval 定时器");
      clearInterval(WebSite.data.bilibiliTrialClickInterval);
      WebSite.data.bilibiliTrialClickInterval = null;
    }
    // 重置广告检测状态
    console.log("[重置] youtubeAdDetected:", WebSite.data.youtubeAdDetected, "-> false");
    WebSite.data.youtubeAdDetected = false;
    // 重置Bilibili无限试用状态
    console.log("[重置] bilibiliUnlimitedTrialApplied:", WebSite.data.bilibiliUnlimitedTrialApplied, "-> false");
    WebSite.data.bilibiliUnlimitedTrialApplied = false;
    Common.currentLang = Common.detectLanguage();
    Common.initSettingItems(window.location.href);

    // 一次性初始化的操作（只执行一次）
    if (!WebSite.data.initialized) {
      console.log("========== 执行一次性初始化 ==========");
      GM_addStyle(settingPanelStyles);
      GM_registerMenuCommand(Common.geti18nText("Menu_Settings"), Common.togglePanel);
      document.addEventListener("keydown", Common.handleKeydown);
      if (window.location.href.includes("youtube.com/")) {
        // 初始化youtubeFallback倍速
        if (WebSite.data.youtubeFallbackRate === null) {
          WebSite.data.youtubeFallbackRate = parseFloat(GM_getValue(Common.settingPanelItems.Youtube_Action_Rate.valueKey, Common.defaultSpeed));
          console.log("[初始化] WebSite.data.youtubeAdfallbackRate = " + WebSite.data.youtubeFallbackRate);
        }
        // YouTube 导航监听器
        console.log("[注册] yt-navigate-finish 监听器 -> WebSite.youtube");
        window.addEventListener(WebSite.selectors.youtube.finishListener, WebSite.youtube);
        // YouTube 直播状态检测定时器
        console.log("[启动] youtubeLiveStreamCheck 定时器 (间隔1000ms)");
        youtubeLiveStreamCheck = setInterval(() => {
          const element = document.querySelector(WebSite.selectors.youtube.liveStreamIcon);
          const isLive = element && element.classList.contains(WebSite.selectors.youtube.liveStreamClass);
          const isWatchPage = window.location.href.includes("youtube.com/watch");

          if (isWatchPage) {
            // console.log("[直播检测] isLive:", isLive, "| youtubeLiveStreamStatus:", WebSite.data.youtubeLiveStreamStatus);
            if (isLive && !WebSite.data.youtubeLiveStreamStatus) {
              Common.setPlaybackRate(1.0);
              console.log("已检测到直播，重置播放速度为1.0");
              WebSite.data.youtubeLiveStreamStatus = true;
            } else if (!isLive && WebSite.data.youtubeLiveStreamStatus) {
              Common.setPlaybackRate(WebSite.data.youtubeFallbackRate);
              console.log("直播已结束，恢复播放速度为" + WebSite.data.youtubeFallbackRate);
              WebSite.data.youtubeLiveStreamStatus = false;
            }
          }
        }, 1000);
        // YouTube 广告检测定时器
        console.log("[启动] youtubeAdCheckInterval 定时器 (间隔500ms)");
        WebSite.data.youtubeAdCheckInterval = setInterval(() => {
          const adOverlay = document.querySelector(WebSite.selectors.youtube.adSelector);
          const video = document.getElementsByTagName("video")[0];

          if (adOverlay && !WebSite.data.youtubeAdDetected && video) {
            console.log("已检测到广告，重置播放速度为1.0");
            Common.setPlaybackRate(1.0);
            WebSite.data.youtubeAdDetected = true;
          } else if (!adOverlay && WebSite.data.youtubeAdDetected && video) {
            console.log("广告已结束，恢复播放速度为" + WebSite.data.youtubeFallbackRate);

            Common.setPlaybackRate(WebSite.data.youtubeFallbackRate);
            WebSite.data.youtubeAdDetected = false;
          }
        }, 200);
      }
      WebSite.data.initialized = true;
      console.log("========== 一次性初始化完成 ==========");
    }

    // 首次加载时执行
    if (window.location.href.includes("youtube.com/watch")) {
      console.log("[触发] 首次执行 -> WebSite.youtube()");
      WebSite.youtube();
    } else if (window.location.href.includes("bilibili.com/video")) {
      console.log("[触发] 首次执行 -> WebSite.bilibili()");
      WebSite.bilibili();
    }
    console.log("========== main() 执行完毕 ==========");
    WebSite.data.isMainRunning = false;
  }
  main();

  let lastUrl = location.href;
  console.log("[启动] MutationObserver 监听 Bilibili URL 变化");
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      console.log("========== MutationObserver 检测到URL变化 ==========");
      console.log("旧URL:", lastUrl);
      console.log("新URL:", url);
      lastUrl = url;
      if (url.includes("bilibili.com/video")) {
        console.log("[触发] Bilibili URL变化 -> main()");
        main();
      }
      console.log("========== MutationObserver 处理完毕 ==========");
    }
  }).observe(document, { subtree: true, childList: true });
})();
