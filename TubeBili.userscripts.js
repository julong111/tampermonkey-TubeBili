// ==UserScript==
// @name               TubeBili - YouTube(油管) Bilibili(B站) 视频增强工具 (Safari/通用版)
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools (Safari/Universal)
// @namespace          com.julong.userscripts.TubeBiliVideoPlayerEnhancerTools
// @version            2.0.1-safari
// @author             julong@111.com
// @description        自动网页全屏、自定义倍速列表、快捷键一键调速、界面漂亮，让您摆脱繁琐操作，专注享受视频 | by julong
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos | by julong
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @match              https://*.youtube.com/*
// @match              https://*.bilibili.com/*
// @exclude            https://accounts.youtube.com/*
// @run-at             document-start
// ==/UserScript==

(function () {
  'use strict';

  // ========== GM API Polyfill for Safari/Userscripts ==========
  const GM_Polyfill = {
    getValue: function(key, defaultValue) {
      try {
        const value = localStorage.getItem('TubeBili_' + key);
        return value !== null ? value : defaultValue;
      } catch (e) {
        console.warn('[TubeBili] localStorage access failed:', e);
        return defaultValue;
      }
    },
    setValue: function(key, value) {
      try {
        localStorage.setItem('TubeBili_' + key, String(value));
      } catch (e) {
        console.warn('[TubeBili] localStorage write failed:', e);
      }
    },
    addStyle: function(css) {
      const style = document.createElement('style');
      style.textContent = css;
      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          document.head.appendChild(style);
        });
      }
    },
    registerMenuCommand: function(name, callback) {
      // Create a floating button as menu command replacement
      if (document.getElementById('tubeBiliFloatingBtn')) return;
      
      const floatingBtn = document.createElement('button');
      floatingBtn.id = 'tubeBiliFloatingBtn';
      floatingBtn.textContent = '⚙️';
      floatingBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      `;
      floatingBtn.addEventListener('mouseenter', () => {
        floatingBtn.style.transform = 'scale(1.1)';
        floatingBtn.style.background = 'rgba(37, 99, 235, 1)';
      });
      floatingBtn.addEventListener('mouseleave', () => {
        floatingBtn.style.transform = 'scale(1)';
        floatingBtn.style.background = 'rgba(59, 130, 246, 0.9)';
      });
      floatingBtn.addEventListener('click', callback);
      
      // Wait for body if not present
      if (document.body) {
        document.body.appendChild(floatingBtn);
      } else {
        window.addEventListener('load', () => document.body.appendChild(floatingBtn));
      }
      
      // Add style to hide button when panel is open
      const hideStyle = document.createElement('style');
      hideStyle.textContent = `
        body:has(#minimalSettingsPanel.show) #tubeBiliFloatingBtn {
          opacity: 0;
          pointer-events: none;
        }
      `;
      if (document.head) document.head.appendChild(hideStyle);
    }
  };

  // Apply Polyfills if native GM APIs are missing
  if (typeof window.GM_getValue === 'undefined') {
    window.GM_getValue = GM_Polyfill.getValue.bind(GM_Polyfill);
  }
  if (typeof window.GM_setValue === 'undefined') {
    window.GM_setValue = GM_Polyfill.setValue.bind(GM_Polyfill);
  }
  if (typeof window.GM_addStyle === 'undefined') {
    window.GM_addStyle = GM_Polyfill.addStyle.bind(GM_Polyfill);
  }
  if (typeof window.GM_registerMenuCommand === 'undefined') {
    window.GM_registerMenuCommand = GM_Polyfill.registerMenuCommand.bind(GM_Polyfill);
  }

  // ========== ElementGetter Inline Implementation ==========
  const elmGetter = {
    get: function(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            clearTimeout(timer);
            resolve(element);
          }
        });

        observer.observe(document.documentElement || document.body, {
          childList: true,
          subtree: true
        });

        const timer = setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
        }, timeout);
      });
    }
  };

  // bilibili 1080P无登录无限试用时间（毫秒） todo
  // const AD_TRIAL_DELAY = 3e4;        // 30秒广告试用延迟
  // const EXTENDED_TRIAL_DELAY = 3e8;   // 延长后的试用延迟（约9.5年）
  // const PROPERTIES_TO_OVERRIDE = ['isViewToday', 'isVideoAble'];

  // // 如果用户已登录，则无需继续执行此脚本
  // if (!document.cookie.includes('DedeUserID')) {
  //   // 每次加载新视频时启用试用（必须在最开始执行）
  //   const originDefineProperty = Object.defineProperty;
  //   Object.defineProperty = function (obj, prop, descriptor) {
  //     if (PROPERTIES_TO_OVERRIDE.includes(prop)) {
  //       descriptor = {
  //         get: () => true,
  //         enumerable: !1,
  //         configurable: !0
  //       }
  //     }
  //     return originDefineProperty.call(this, obj, prop, descriptor);
  //   }

  //   // 通过覆盖 "setTimeout" 延长试用时间
  //   const originSetTimeout = unsafeWindow.setTimeout;
  //   unsafeWindow.setTimeout = function (func, delay) {
  //     if (delay === AD_TRIAL_DELAY) delay = EXTENDED_TRIAL_DELAY;
  //     return originSetTimeout.call(this, func, delay);
  //   }
  // }

  const i18n = {
    zh: {
      Menu_Settings: "TubeBili - Youtube & Bilibili 视频播放器增强工具",
      Menu_Save: "保存",
      Menu_Close: "关闭",
      Menu_Subtitle: "设置面板",
      Menu_Section_Actions: "功能开关",
      Menu_Section_Remove: "移除按钮",
      Menu_Section_SpeedList: "倍速列表设置",
      Menu_Section_Shortcut: "快捷键说明",
      Menu_Shortcut_Desc: "按 , (逗号) 键减速，按 . (句号) 键加速",
      Menu_Author: "巨龙",
      Menu_Author_Title: "作者",
      Menu_Email: "反馈邮箱",
      Menu_ShortcutSpeedList_Label: "快捷按键倍速列表",
      Menu_ButtonSpeedList_Label: "按钮倍速列表",
      Menu_SpeedList_Placeholder: "例如：0.5,1.0,1.5,2.0",
      Menu_SpeedList_Separator: "分隔符：英文逗号 , 或中文逗号 ，最多10个值",
      Menu_SpeedList_Error: "输入格式错误：必须是0.1-10的数字，1位小数，最多10个值",
      Menu_SpeedList_Default: "0.5,1.0,1.5,2.0",
      Youtube_Action_Rate: "自动倍速播放",
      Youtube_Action_TheaterMode: "自动进入影院模式",
      Youtube_Remove_Autoplay: "移除自动播放开关",
      Youtube_Remove_Subtitles: "移除字幕按钮",
      Youtube_Remove_Settings: "移除设置按钮",
      Youtube_Remove_TheaterMode: "移除影院模式按钮",
      Youtube_Remove_FullScreen: "移除全屏按钮",
      Bilibili_Action_Rate: "自动倍速播放",
      Bilibili_Action_WebFullscreen: "自动网页全屏",
      Bilibili_Action_Unlimited_Trial: "未登录无限试用1080P",
      Bilibili_Remove_Quality: "移除分辨率按钮",
      Bilibili_Remove_Eplist: "移除选集按钮",
      Bilibili_Remove_Pip: "移除画中画按钮",
      Bilibili_Remove_Wide: "移除宽屏按钮",
      Bilibili_Remove_Speed: "移除原始倍速按钮",
      Bilibili_Remove_Comments: "移除评论输入区",
      Bilibili_Remove_Settings: "移除设置按钮",
      Bilibili_Remove_WebFullscreen: "移除网页全屏按钮",
      Bilibili_Remove_Volume: "移除音量按钮",
      Bilibili_Remove_FullScreen: "移除全屏按钮"
    },
    en: {
      Menu_Settings: "TubeBili - YouTube Bilibili Video Player Enhancer Tools",
      Menu_Save: "Save",
      Menu_Close: "Close",
      Menu_Subtitle: "Settings Panel",
      Menu_Section_Actions: "Features",
      Menu_Section_Remove: "Remove Buttons",
      Menu_Section_SpeedList: "Speed List Settings",
      Menu_Section_Shortcut: "Keyboard Shortcuts",
      Menu_Shortcut_Desc: "Press , (comma) to decrease speed, . (period) to increase speed",
      Menu_Author: "julong",
      Menu_Author_Title: "Author",
      Menu_Email: "Feedback Email",
      Menu_ShortcutSpeedList_Label: "Shortcut Speed List",
      Menu_ButtonSpeedList_Label: "Button Speed List",
      Menu_SpeedList_Placeholder: "e.g. 0.5,1,1.5,2",
      Menu_SpeedList_Separator: "Separators: comma , or Chinese comma ， Max 10 values",
      Menu_SpeedList_Error: "Invalid format: must be numbers 0.1 - 10, 1 decimal place, max 10 values",
      Menu_SpeedList_Default: "0.5,1,1.5,2",
      Youtube_Action_Rate: "Auto Playback Speed",
      Youtube_Action_TheaterMode: "Auto Theater Mode",
      Youtube_Remove_Autoplay: "Remove Autoplay Toggle",
      Youtube_Remove_Subtitles: "Remove Subtitles Button",
      Youtube_Remove_Settings: "Remove Settings Button",
      Youtube_Remove_TheaterMode: "Remove Theater Mode Button",
      Youtube_Remove_FullScreen: "Remove FullScreen Button",
      Bilibili_Action_Rate: "Auto Playback Speed",
      Bilibili_Action_WebFullscreen: "Auto Web Fullscreen",
      Bilibili_Action_Unlimited_Trial: "Unlimited 1080P Trial (No Login)",
      Bilibili_Remove_Quality: "Remove Quality Button",
      Bilibili_Remove_Eplist: "Remove Episode List Button",
      Bilibili_Remove_Pip: "Remove Picture-in-Picture Button",
      Bilibili_Remove_Wide: "Remove Wide Button",
      Bilibili_Remove_Speed: "Remove Original Speed Button",
      Bilibili_Remove_Comments: "Remove Comments Input Area",
      Bilibili_Remove_Settings: "Remove Settings Button",
      Bilibili_Remove_WebFullscreen: "Remove Web Fullscreen Button",
      Bilibili_Remove_Volume: "Remove Volume Button",
      Bilibili_Remove_FullScreen: "Remove FullScreen Button"
    }
  };
  const Common = {
    speeds: ["0.5", "1.0", "1.5", "2.0"],
    buttonSpeeds: ["0.5", "1.0", "1.5", "2.0"],
    defaultSpeed: "2.0",
    colors: ["#072525", "#287F54", "#C22544"],
    settingPanelItems: [],
    settingPanelInitialized: false,
    settingPanelElement: null,
    speedIndicatorElement: null,
    speedIndicatorTimer: null,
    shortcutSpeedListKey: "Shortcut_Speed_List",
    buttonSpeedListKey: "Button_Speed_List",
    defaultSpeedList: "0.5,1,1.5,2",
    speedListKey: "Speed_List", // Deprecated but kept for potential legacy compatibility if needed, otherwise unused in new logic
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
      console.log(key)
      return i18n[sys.currentLang][key];
    },
    loadSpeedList: function () {
      // 加载快捷键倍速列表
      const savedShortcutSpeedList = GM_getValue(this.shortcutSpeedListKey, this.defaultSpeedList);
      const shortcutSpeedListResult = this.validateSpeedList(savedShortcutSpeedList);
      if (shortcutSpeedListResult.valid) {
        this.speeds = shortcutSpeedListResult.speeds;
      } else {
        this.speeds = this.defaultSpeedList.split(/[,，]/).map((s) => parseFloat(s).toFixed(1));
      }

      // 加载按钮倍速列表
      const savedButtonSpeedList = GM_getValue(this.buttonSpeedListKey, this.defaultSpeedList);
      const buttonSpeedListResult = this.validateSpeedList(savedButtonSpeedList);
      if (buttonSpeedListResult.valid) {
        this.buttonSpeeds = buttonSpeedListResult.speeds;
      } else {
        this.buttonSpeeds = this.defaultSpeedList.split(/[,，]/).map((s) => parseFloat(s).toFixed(1));
      }
    },
    validateSpeedList: function (input) {
      if (!input || typeof input !== "string") {
        return { valid: false, speeds: [], error: this.geti18nText("Menu_SpeedList_Error") };
      }
      const parts = input.split(/[,，]/).map((s) => s.trim()).filter((s) => s !== "");
      if (parts.length === 0 || parts.length > 10) {
        return { valid: false, speeds: [], error: this.geti18nText("Menu_SpeedList_Error") };
      }
      const speeds = [];
      for (const part of parts) {
        const regex = /^(\d+\.?\d{0,1}|\.\d{1})$/;
        if (!regex.test(part)) {
          return { valid: false, speeds: [], error: this.geti18nText("Menu_SpeedList_Error") };
        }
        const num = parseFloat(part);
        if (num < 0.1 || num > 10) {
          return { valid: false, speeds: [], error: this.geti18nText("Menu_SpeedList_Error") };
        }
        speeds.push(parseFloat(num.toFixed(1)).toString());
      }
      return { valid: true, speeds, error: "" };
    },
    createSpeedList(speeds, select) {
      speeds.forEach((speed) => {
        const option = document.createElement("option");
        option.value = speed;
        option.textContent = speed;
        select.appendChild(option);
      });
    },
    updateSpeedSelects: function (shortcutSpeeds, buttonSpeeds, shortcutSpeedListString, buttonSpeedListString) {
      this.speeds = shortcutSpeeds;
      this.buttonSpeeds = buttonSpeeds || shortcutSpeeds;
      
      if (shortcutSpeedListString !== void 0) {
        const shortcutSpeedListInput = document.getElementById("shortcutSpeedListInput");
        if (shortcutSpeedListInput) {
          shortcutSpeedListInput.value = shortcutSpeedListString;
        }
      }
      
      if (buttonSpeedListString !== void 0) {
        const buttonSpeedListInput = document.getElementById("buttonSpeedListInput");
        if (buttonSpeedListInput) {
          buttonSpeedListInput.value = buttonSpeedListString;
        }
      }
      
      const selectIds = ["Youtube_Action_Rate_Value", "Bilibili_Action_Rate_Value"];
      for (const selectId of selectIds) {
        const select = document.getElementById(selectId);
        if (select) {
          const currentValue = select.value;
          while (select.firstChild) {
            select.removeChild(select.firstChild);
          }
          this.createSpeedList(shortcutSpeeds, select);
          if (shortcutSpeeds.includes(currentValue)) {
            select.value = currentValue;
          } else {
            select.value = shortcutSpeeds[0];
          }
        }
      }
    },
    initializePanel: function () {
      let panel = document.createElement("div");
      panel.id = "minimalSettingsPanel";
      if (sys.currentLang === "en") {
        panel.classList.add("lang-en");
      }
      const header = document.createElement("div");
      header.className = "panel-header";
      const title = document.createElement("h2");
      title.textContent = this.geti18nText("Menu_Settings");
      const subtitle = document.createElement("div");
      subtitle.className = "subtitle";
      subtitle.textContent = this.geti18nText("Menu_Subtitle");
      header.appendChild(title);
      header.appendChild(subtitle);
      panel.appendChild(header);
      
      // 快捷按键倍速列表设置区域
      const shortcutSpeedListSection = document.createElement("div");
      shortcutSpeedListSection.className = "speed-list-section";
      const shortcutInputRow = document.createElement("div");
      shortcutInputRow.className = "input-row";
      const shortcutSpeedListLabel = document.createElement("div");
      shortcutSpeedListLabel.className = "section-label";
      const starSpan = document.createElement("span");
      starSpan.className = "star";
      starSpan.textContent = "★";
      shortcutSpeedListLabel.appendChild(starSpan);
      shortcutSpeedListLabel.appendChild(document.createTextNode(this.geti18nText("Menu_ShortcutSpeedList_Label")));
      shortcutInputRow.appendChild(shortcutSpeedListLabel);
      const shortcutSpeedListInput = document.createElement("input");
      shortcutSpeedListInput.type = "text";
      shortcutSpeedListInput.id = "shortcutSpeedListInput";
      shortcutSpeedListInput.placeholder = this.geti18nText("Menu_SpeedList_Placeholder");
      shortcutSpeedListInput.value = GM_getValue(this.shortcutSpeedListKey, this.defaultSpeedList);
      shortcutInputRow.appendChild(shortcutSpeedListInput);
      shortcutSpeedListSection.appendChild(shortcutInputRow);
      const shortcutSeparatorHint = document.createElement("div");
      shortcutSeparatorHint.className = "separator-hint";
      shortcutSeparatorHint.id = "shortcutSeparatorHint";
      shortcutSeparatorHint.textContent = this.geti18nText("Menu_SpeedList_Separator");
      shortcutSpeedListSection.appendChild(shortcutSeparatorHint);
      const shortcutErrorMessage = document.createElement("div");
      shortcutErrorMessage.className = "error-message";
      shortcutErrorMessage.id = "shortcutSpeedListError";
      shortcutErrorMessage.textContent = this.geti18nText("Menu_SpeedList_Error");
      shortcutSpeedListSection.appendChild(shortcutErrorMessage);
      shortcutSpeedListInput.addEventListener("blur", () => {
        const result = this.validateSpeedList(shortcutSpeedListInput.value);
        const errorEl = document.getElementById("shortcutSpeedListError");
        const separatorEl = document.getElementById("shortcutSeparatorHint");
        if (!result.valid) {
          shortcutSpeedListInput.classList.add("error");
          errorEl.classList.add("show");
          separatorEl.classList.add("hidden");
        } else {
          shortcutSpeedListInput.classList.remove("error");
          errorEl.classList.remove("show");
          separatorEl.classList.remove("hidden");
        }
      });
      shortcutSpeedListInput.addEventListener("input", () => {
        shortcutSpeedListInput.classList.remove("error");
        document.getElementById("shortcutSpeedListError").classList.remove("show");
        document.getElementById("shortcutSeparatorHint").classList.remove("hidden");
      });
      panel.appendChild(shortcutSpeedListSection);

      // 按钮倍速列表设置区域
      const buttonSpeedListSection = document.createElement("div");
      buttonSpeedListSection.className = "speed-list-section";
      const buttonInputRow = document.createElement("div");
      buttonInputRow.className = "input-row";
      const buttonSpeedListLabel = document.createElement("div");
      buttonSpeedListLabel.className = "section-label";
      buttonSpeedListLabel.appendChild(document.createTextNode(this.geti18nText("Menu_ButtonSpeedList_Label")));
      buttonInputRow.appendChild(buttonSpeedListLabel);
      const buttonSpeedListInput = document.createElement("input");
      buttonSpeedListInput.type = "text";
      buttonSpeedListInput.id = "buttonSpeedListInput";
      buttonSpeedListInput.placeholder = this.geti18nText("Menu_SpeedList_Placeholder");
      buttonSpeedListInput.value = GM_getValue(this.buttonSpeedListKey, this.defaultSpeedList);
      buttonInputRow.appendChild(buttonSpeedListInput);
      buttonSpeedListSection.appendChild(buttonInputRow);
      const buttonSeparatorHint = document.createElement("div");
      buttonSeparatorHint.className = "separator-hint";
      buttonSeparatorHint.id = "buttonSeparatorHint";
      buttonSeparatorHint.textContent = this.geti18nText("Menu_SpeedList_Separator");
      buttonSpeedListSection.appendChild(buttonSeparatorHint);
      const buttonErrorMessage = document.createElement("div");
      buttonErrorMessage.className = "error-message";
      buttonErrorMessage.id = "buttonSpeedListError";
      buttonErrorMessage.textContent = this.geti18nText("Menu_SpeedList_Error");
      buttonSpeedListSection.appendChild(buttonErrorMessage);
      buttonSpeedListInput.addEventListener("blur", () => {
        const result = this.validateSpeedList(buttonSpeedListInput.value);
        const errorEl = document.getElementById("buttonSpeedListError");
        const separatorEl = document.getElementById("buttonSeparatorHint");
        if (!result.valid) {
          buttonSpeedListInput.classList.add("error");
          errorEl.classList.add("show");
          separatorEl.classList.add("hidden");
        } else {
          buttonSpeedListInput.classList.remove("error");
          errorEl.classList.remove("show");
          separatorEl.classList.remove("hidden");
        }
      });
      buttonSpeedListInput.addEventListener("input", () => {
        buttonSpeedListInput.classList.remove("error");
        document.getElementById("buttonSpeedListError").classList.remove("show");
        document.getElementById("buttonSeparatorHint").classList.remove("hidden");
      });
      panel.appendChild(buttonSpeedListSection);
      const actionItems = [];
      const removeItems = [];
      for (const [key, item] of Object.entries(this.settingPanelItems)) {
        if (key.startsWith("_Action") || key.includes("Action")) {
          actionItems.push([key, item]);
        } else {
          removeItems.push([key, item]);
        }
      }
      if (actionItems.length > 0) {
        const actionsTitle = document.createElement("div");
        actionsTitle.className = "section-title";
        actionsTitle.textContent = this.geti18nText("Menu_Section_Actions");
        panel.appendChild(actionsTitle);
        const actionsList = document.createElement("div");
        actionsList.className = "setting-list";
        for (const [key, item] of actionItems) {
          actionsList.appendChild(this.createSettingItem(item));
        }
        panel.appendChild(actionsList);
      }
      if (removeItems.length > 0) {
        const removeTitle = document.createElement("div");
        removeTitle.className = "section-title";
        removeTitle.textContent = this.geti18nText("Menu_Section_Remove");
        panel.appendChild(removeTitle);
        const removeList = document.createElement("div");
        removeList.className = "setting-list two-columns";
        for (const [key, item] of removeItems) {
          removeList.appendChild(this.createSettingItem(item));
        }
        panel.appendChild(removeList);
      }
      const shortcutContainer = document.createElement("div");
      shortcutContainer.className = "shortcut-container";
      const shortcutTitle = document.createElement("div");
      shortcutTitle.className = "shortcut-title";
      shortcutTitle.textContent = this.geti18nText("Menu_Section_Shortcut");
      shortcutContainer.appendChild(shortcutTitle);
      const shortcutDesc = document.createElement("div");
      shortcutDesc.textContent = this.geti18nText("Menu_Shortcut_Desc");
      shortcutContainer.appendChild(shortcutDesc);
      panel.appendChild(shortcutContainer);
      let buttons = document.createElement("div");
      buttons.className = "buttons";
      let saveBtn = document.createElement("button");
      saveBtn.id = "saveBtn";
      saveBtn.textContent = this.geti18nText("Menu_Save");
      saveBtn.addEventListener("click", () => this.saveSettings());
      let closeBtn = document.createElement("button");
      closeBtn.id = "closeBtn";
      closeBtn.textContent = this.geti18nText("Menu_Close");
      closeBtn.addEventListener("click", () => this.togglePanel());
      buttons.appendChild(saveBtn);
      buttons.appendChild(closeBtn);
      panel.appendChild(buttons);
      const footer = document.createElement("div");
      footer.className = "panel-footer";
      const authorInfo = document.createElement("div");
      authorInfo.className = "author-info";
      const authorLabel = document.createElement("span");
      authorLabel.className = "author-label";
      authorLabel.textContent = this.geti18nText("Menu_Author_Title") + ":";
      const authorName = document.createElement("span");
      authorName.className = "author-name";
      authorName.textContent = this.geti18nText("Menu_Author");
      authorInfo.appendChild(authorLabel);
      authorInfo.appendChild(authorName);
      footer.appendChild(authorInfo);
      const emailInfo = document.createElement("div");
      emailInfo.className = "email-info";
      const emailLabel = document.createElement("span");
      emailLabel.className = "author-label";
      emailLabel.textContent = this.geti18nText("Menu_Email") + ":";
      const emailLink = document.createElement("a");
      emailLink.href = "mailto:julong@111.com";
      emailLink.textContent = "julong@111.com";
      emailInfo.appendChild(emailLabel);
      emailInfo.appendChild(emailLink);
      footer.appendChild(emailInfo);
      panel.appendChild(footer);
      document.body.appendChild(panel);
      this.settingPanelElement = panel;
      this.settingPanelInitialized = true;
    },
    createSettingItem: function (item) {
      let functionDiv = document.createElement("div");
      functionDiv.className = "setting-item";
      let functionValue = GM_getValue(item.enableKey, false);
      let itemCheckBox = document.createElement("input");
      itemCheckBox.type = "checkbox";
      itemCheckBox.checked = functionValue;
      itemCheckBox.id = item.classId;
      functionDiv.appendChild(itemCheckBox);
      let itemTextLabel = document.createElement("label");
      itemTextLabel.setAttribute("for", item.classId);
      if (item.recommended) {
        const star = document.createElement("span");
        star.className = "star";
        star.textContent = "★";
        itemTextLabel.appendChild(star);
      }
      const textNode = document.createTextNode(item.text);
      itemTextLabel.appendChild(textNode);
      functionDiv.appendChild(itemTextLabel);
      if (item.valueKey) {
        let select = document.createElement("select");
        select.id = item.valueKey;
        this.createSpeedList(this.speeds, select);
        select.value = GM_getValue(item.valueKey, this.defaultSpeed);
        functionDiv.appendChild(select);
      }
      return functionDiv;
    },
    saveSettings: function () {
      const shortcutSpeedListInput = document.getElementById("shortcutSpeedListInput");
      const shortcutErrorMessage = document.getElementById("shortcutSpeedListError");
      const shortcutResult = this.validateSpeedList(shortcutSpeedListInput.value);

      const buttonSpeedListInput = document.getElementById("buttonSpeedListInput");
      const buttonErrorMessage = document.getElementById("buttonSpeedListError");
      const buttonResult = this.validateSpeedList(buttonSpeedListInput.value);

      if (!shortcutResult.valid) {
        shortcutSpeedListInput.classList.add("error");
        shortcutErrorMessage.classList.add("show");
        return;
      }
      if (!buttonResult.valid) {
        buttonSpeedListInput.classList.add("error");
        buttonErrorMessage.classList.add("show");
        return;
      }

      shortcutSpeedListInput.classList.remove("error");
      shortcutErrorMessage.classList.remove("show");
      buttonSpeedListInput.classList.remove("error");
      buttonErrorMessage.classList.remove("show");

      GM_setValue(this.shortcutSpeedListKey, shortcutSpeedListInput.value);
      localStorage.setItem(this.shortcutSpeedListKey, shortcutSpeedListInput.value);
      
      GM_setValue(this.buttonSpeedListKey, buttonSpeedListInput.value);
      localStorage.setItem(this.buttonSpeedListKey, buttonSpeedListInput.value);

      this.updateSpeedSelects(shortcutResult.speeds, buttonResult.speeds, shortcutSpeedListInput.value, buttonSpeedListInput.value);

      for (const [key, item] of Object.entries(this.settingPanelItems)) {
        const isChecked = document.getElementById(item.classId).checked;
        GM_setValue(item.enableKey, isChecked);
        localStorage.setItem(item.enableKey, isChecked.toString());
        if (item.valueKey) {
          const value = document.getElementById(item.valueKey).value;
          GM_setValue(item.valueKey, value);
        }
      }
      this.settingPanelElement.classList.toggle("show");
    },
    togglePanel: function () {
      if (!this.settingPanelInitialized) {
        this.initializePanel();
      } else {
        const savedShortcutSpeedList = GM_getValue(this.shortcutSpeedListKey, this.defaultSpeedList);
        const shortcutSpeedListResult = this.validateSpeedList(savedShortcutSpeedList);
        
        const savedButtonSpeedList = GM_getValue(this.buttonSpeedListKey, this.defaultSpeedList);
        const buttonSpeedListResult = this.validateSpeedList(savedButtonSpeedList);

        if (shortcutSpeedListResult.valid && buttonSpeedListResult.valid) {
          this.updateSpeedSelects(
            shortcutSpeedListResult.speeds, 
            buttonSpeedListResult.speeds, 
            savedShortcutSpeedList, 
            savedButtonSpeedList
          );
        }
      }
      this.settingPanelElement.classList.toggle("show");
    },
    initSettingItems: function (currentUrl) {
      this.loadSpeedList();
      for (const [key, item] of Object.entries(this.settingPanelItems)) {
        const value = GM_getValue(item.enableKey, false);
        localStorage.setItem(item.enableKey, value.toString());
      }
      if (currentUrl.includes("youtube.com")) {
        this.settingPanelItems = {
          Youtube_Action_Rate: {
            classId: "Youtube_Action_Rate",
            text: this.geti18nText("Youtube_Action_Rate"),
            enableKey: "Youtube_Action_Rate_Enabled",
            valueKey: "Youtube_Action_Rate_Value",
            recommended: true
          },
          Youtube_Action_TheaterMode: {
            classId: "Youtube_Action_TheaterMode",
            text: this.geti18nText("Youtube_Action_TheaterMode"),
            enableKey: "Youtube_Action_TheaterMode",
            recommended: true
          },
          Youtube_Remove_Autoplay: {
            classId: "Youtube_Remove_Autoplay",
            text: this.geti18nText("Youtube_Remove_Autoplay"),
            enableKey: "Youtube_Remove_Autoplay"
          },
          Youtube_Remove_Subtitles: {
            classId: "Youtube_Remove_Subtitles",
            text: this.geti18nText("Youtube_Remove_Subtitles"),
            enableKey: "Youtube_Remove_Subtitles"
          },
          Youtube_Remove_Settings: {
            classId: "Youtube_Remove_Settings",
            text: this.geti18nText("Youtube_Remove_Settings"),
            enableKey: "Youtube_Remove_Settings"
          },
          Youtube_Remove_TheaterMode: {
            classId: "Youtube_Remove_TheaterMode",
            text: this.geti18nText("Youtube_Remove_TheaterMode"),
            enableKey: "Youtube_Remove_TheaterMode"
          },
          Youtube_Remove_FullScreen: {
            classId: "Youtube_Remove_FullScreen",
            text: this.geti18nText("Youtube_Remove_FullScreen"),
            enableKey: "Youtube_Remove_FullScreen"
          }
        };
      } else if (currentUrl.includes("bilibili.com")) {
        this.settingPanelItems = {
          Bilibili_Action_Rate: {
            classId: "Bilibili_Action_Rate",
            text: this.geti18nText("Bilibili_Action_Rate"),
            enableKey: "Bilibili_Action_Rate_Enabled",
            valueKey: "Bilibili_Action_Rate_Value",
            recommended: true
          },
          Bilibili_Action_WebFullscreen: {
            classId: "Bilibili_Action_WebFullscreen",
            text: this.geti18nText("Bilibili_Action_WebFullscreen"),
            enableKey: "Bilibili_Action_WebFullscreen",
            recommended: true
          },
          Bilibili_Remove_WebFullscreen: {
            classId: "Bilibili_Remove_WebFullscreen",
            text: this.geti18nText("Bilibili_Remove_WebFullscreen"),
            enableKey: "Bilibili_Remove_WebFullscreen"
          },
          Bilibili_Remove_Quality: {
            classId: "Bilibili_Remove_Quality",
            text: this.geti18nText("Bilibili_Remove_Quality"),
            enableKey: "Bilibili_Remove_Quality"
          },
          Bilibili_Remove_Eplist: {
            classId: "Bilibili_Remove_Eplist",
            text: this.geti18nText("Bilibili_Remove_Eplist"),
            enableKey: "Bilibili_Remove_Eplist"
          },
          Bilibili_Remove_Pip: {
            classId: "Bilibili_Remove_Pip",
            text: this.geti18nText("Bilibili_Remove_Pip"),
            enableKey: "Bilibili_Remove_Pip"
          },
          Bilibili_Remove_Wide: {
            classId: "Bilibili_Remove_Wide",
            text: this.geti18nText("Bilibili_Remove_Wide"),
            enableKey: "Bilibili_Remove_Wide"
          },
          Bilibili_Remove_Speed: {
            classId: "Bilibili_Remove_Speed",
            text: this.geti18nText("Bilibili_Remove_Speed"),
            enableKey: "Bilibili_Remove_Speed"
          },
          Bilibili_Remove_Comments: {
            classId: "Bilibili_Remove_Comments",
            text: this.geti18nText("Bilibili_Remove_Comments"),
            enableKey: "Bilibili_Remove_Comments"
          },
          Bilibili_Remove_Settings: {
            classId: "Bilibili_Remove_Settings",
            text: this.geti18nText("Bilibili_Remove_Settings"),
            enableKey: "Bilibili_Remove_Settings"
          },
          Bilibili_Remove_Volume: {
            classId: "Bilibili_Remove_Volume",
            text: this.geti18nText("Bilibili_Remove_Volume"),
            enableKey: "Bilibili_Remove_Volume"
          },
          Bilibili_Remove_FullScreen: {
            classId: "Bilibili_Remove_FullScreen",
            text: this.geti18nText("Bilibili_Remove_FullScreen"),
            enableKey: "Bilibili_Remove_FullScreen"
          }
        };
      }
    },
    createSpeedButtons: function (panelCallback, btnClickCallback) {
      console.log("添加倍速按钮");
      if (document.querySelector("#speedButtons")) {
        return;
      }
      this.colors[0];
      let speedListDiv = document.createElement("div");
      speedListDiv.id = "speedButtons";
      speedListDiv.style.display = "flex";
      speedListDiv.style.alignItems = "center";
      speedListDiv.style.justifyContent = "center";
      const isYoutube = window.location.href.includes("youtube.com");
      if (isYoutube) {
        speedListDiv.style.height = "32px";
        speedListDiv.style.marginTop = "12px";
      } else {
        speedListDiv.style.height = "32px";
      }
      speedListDiv.style.width = "auto";
      const handleButtonClick = (speed) => {
        this.setPlaybackRate(speed);
      };
      // 使用buttonSpeeds来创建界面按钮
      for (let i = 0; i < this.buttonSpeeds.length; i++) {
        const speedValue = parseFloat(this.buttonSpeeds[i]);
        if (speedValue >= 1) {
          this.colors[1];
        }
        if (speedValue >= 1.5) {
          this.colors[2];
        }
        let btn = document.createElement("button");
        // btn.style.backgroundColor = "transparent";
        // 【修改】背景色：改为白色半透明
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        // 【新增】毛玻璃模糊效果
        btn.style.backdropFilter = "blur(8px)";
        // 兼容 Safari/Chrome
        btn.style.webkitBackdropFilter = "blur(8px)";
        // 【新增】边框：增加细微白色边框以增强轮廓感
        btn.style.border = "1px solid rgba(255, 255, 255, 0.4)";
        // 【修改】文字颜色：因为背景变白，建议将文字颜色改为深色以保证清晰度
        // btn.style.color = "#333333"; 

        btn.style.marginRight = "1px";
        // btn.style.border = "1px solid rgba(211, 211, 211, 0.5)";
        btn.style.borderRadius = "4px";
        btn.style.color = "#ffffff";
        btn.style.cursor = "pointer";
        btn.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
        btn.style.display = "flex";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.width = "40px";
        btn.style.height = isYoutube ? "28px" : "30px";
        btn.style.fontSize = isYoutube ? "15px" : "14px";
        btn.textContent = this.buttonSpeeds[i] + "×";
        btn.className = "speed-control-button";
        btn.dataset.speed = this.buttonSpeeds[i];
        btn.addEventListener("click", () => {
          btnClickCallback ? btnClickCallback(this.buttonSpeeds[i]) : handleButtonClick(this.buttonSpeeds[i]);
        });
        speedListDiv.appendChild(btn);
      }
      panelCallback(speedListDiv);
    },
    setPlaybackRate: function (rate) {
      const video = document.getElementsByTagName("video")[0];
      if (video) {
        video.playbackRate = parseFloat(rate);
        this.updateSpeedButtonHighlight(rate);
        this.showSpeedIndicator(rate);
      }
    },
    showSpeedIndicator: function (rate) {
      if (this.speedIndicatorTimer) {
        clearTimeout(this.speedIndicatorTimer);
      }
      if (!this.speedIndicatorElement) {
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
        this.speedIndicatorElement = indicator;
      }
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fullscreenElement) {
        if (this.speedIndicatorElement.parentNode !== fullscreenElement) {
          fullscreenElement.appendChild(this.speedIndicatorElement);
        }
      } else {
        if (this.speedIndicatorElement.parentNode !== document.body) {
          document.body.appendChild(this.speedIndicatorElement);
        }
      }
      this.speedIndicatorElement.textContent = `${rate}x`;
      this.speedIndicatorElement.style.opacity = "1";
      this.speedIndicatorTimer = setTimeout(() => {
        this.speedIndicatorElement.style.opacity = "0";
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
      let currentIndex = this.speeds.findIndex((speed) => parseFloat(speed) === currentRate);
      if (currentIndex === -1) {
        const closest = this.speeds.reduce((prev, curr) => {
          return Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev;
        });
        currentIndex = this.speeds.indexOf(closest);
      }
      let newIndex = currentIndex;
      if (event.code === "Comma") {
        if (currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
      } else if (event.code === "Period") {
        if (currentIndex < this.speeds.length - 1) {
          newIndex = currentIndex + 1;
        }
      } else {
        return;
      }
      this.setPlaybackRate(this.speeds[newIndex]);
    }
  };
  const sys = {
    initialized: false,
    youtubeLiveStreamStatus: false,
    youtubeFallbackRate: null,
    youtubeAdDetected: false,
    youtubeAdCheckInterval: null,
    isMainRunning: false,
    isYoutubePageProcessing: false,
    youtubeLiveStreamCheck: null,
    removalInterval: null,
    bilibiliUrlObserver: null,
    currentLang: "en",
    lastUrl: ""
  };
  const bilibiliSelectors = {
    playerContainer: "#bilibili-player",
    webscreenClass: "mode-webscreen",
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
    volumeBtn: ".bpx-player-ctrl-volume",
    fullScreenBtn: ".bpx-player-ctrl-full",
    trialConfirmBtn: ".bpx-player-toast-confirm-login",
    speedBtnPostionTarget: ".bpx-player-control-bottom-right"
  };
  const youtubeSelectors = {
    videoPanel: "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls",
    liveStreamIcon: "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button",
    autoplayToggleBtn: "#movie_player .ytp-autonav-toggle",
    subtitlesBtn: "#movie_player .ytp-subtitles-button",
    settingsBtn: "#movie_player .ytp-settings-button",
    theaterMode: "#movie_player .ytp-size-button",
    fullScreenBtn: "#movie_player .ytp-fullscreen-button",
    finishListener: "yt-navigate-finish",
    liveStreamClass: "ytp-live-badge-is-livehead",
    adSelector: ".ytp-ad-player-overlay, .ytp-ad-player-overlay-layout"
  };
  const youtube_removal_items = {
    Youtube_Remove_Autoplay: {
      selector: youtubeSelectors.autoplayToggleBtn,
      mode: "remove"
    },
    Youtube_Remove_Subtitles: {
      selector: youtubeSelectors.subtitlesBtn,
      mode: "remove"
    },
    Youtube_Remove_Settings: {
      selector: youtubeSelectors.settingsBtn,
      mode: "remove"
    },
    Youtube_Remove_TheaterMode: {
      selector: youtubeSelectors.theaterMode,
      mode: "remove"
    },
    Youtube_Remove_FullScreen: {
      selector: youtubeSelectors.fullScreenBtn,
      mode: "remove"
    }
  };
  const bilibili_removal_items = {
    Bilibili_Remove_Quality: {
      selector: bilibiliSelectors.qualityBtn,
      mode: "remove"
    },
    Bilibili_Remove_Eplist: {
      selector: bilibiliSelectors.eplistBtn,
      mode: "remove"
    },
    Bilibili_Remove_Pip: {
      selector: bilibiliSelectors.pipBtn,
      mode: "remove"
    },
    Bilibili_Remove_Wide: {
      selector: bilibiliSelectors.wideBtn,
      mode: "remove"
    },
    Bilibili_Remove_Speed: {
      selector: bilibiliSelectors.speedsListBtn,
      mode: "remove"
    },
    Bilibili_Remove_Comments: {
      selector: bilibiliSelectors.commentsPanel,
      // mode: "hide"
      mode: "remove"
    },
    Bilibili_Remove_Settings: {
      selector: bilibiliSelectors.settingsBtn,
      mode: "remove"
    },
    Bilibili_Remove_WebFullscreen: {
      selector: bilibiliSelectors.webFullBtn,
      // mode: "hide"
      mode: "remove"
    },
    Bilibili_Remove_Volume: {
      selector: bilibiliSelectors.volumeBtn,
      mode: "remove"
    },
    Bilibili_Remove_FullScreen: {
      selector: bilibiliSelectors.fullScreenBtn,
      mode: "remove"
    }
  };
  async function handleYoutubePage() {
    var _a, _b, _c, _d;
    if (sys.isYoutubePageProcessing) {
      console.log("[跳过] handleYoutube 正在执行中，跳过此次调用");
      return;
    }
    sys.isYoutubePageProcessing = true;
    console.log(">>>> handleYoutube 开始执行");
    try {
      let videoPanel = await elmGetter.get(youtubeSelectors.videoPanel);
      console.log("[UI] videoPanel 元素已获取，准备添加倍速按钮");
      Common.createSpeedButtons(
        (moreSpeedsDiv) => {
          videoPanel.before(moreSpeedsDiv);
          console.log("[UI] 倍速按钮已添加到 videoPanel 之前");
          const video = document.getElementsByTagName("video")[0];
          if (video) {
            console.log("[UI] 当前视频播放速度:", video.playbackRate);
            Common.updateSpeedButtonHighlight(video.playbackRate.toString());
          }
        },
        (speed) => {
          console.log("[交互] 用户点击速度按钮:", speed);
          Common.setPlaybackRate(speed);
        }
      );
    } catch (error) {
      console.error("Failed create speed button elements:", error);
    }
    try {
      for (const key in youtube_removal_items) {
        if (GM_getValue((_a = Common.settingPanelItems[key]) == null ? void 0 : _a.enableKey, false)) {
          elmGetter.get(youtube_removal_items[key].selector).then((item) => {
            console.log("[UI] 移除按钮:", Common.geti18nText(key), "| 方式:", youtube_removal_items[key].mode);
            if (youtube_removal_items[key].mode === "hide") {
              item.style.width = "0";
              item.style.overflow = "hidden";
              item.style.flexShrink = "0";
            } else {
              item.remove();
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed autoremove buttons:", error);
    }
    if (GM_getValue((_b = Common.settingPanelItems.Youtube_Action_TheaterMode) == null ? void 0 : _b.enableKey, false)) {
      console.log("[设置] 自动进入影院模式 已启用");
      elmGetter.get(youtubeSelectors.theaterMode).then((item) => {
        console.log("[操作] 点击影院模式按钮");
        item.click();
      });
    }
    const autoRateEnabled = GM_getValue((_c = Common.settingPanelItems.Youtube_Action_Rate) == null ? void 0 : _c.enableKey, false);
    console.log("[设置] 自动倍速播放:", autoRateEnabled ? "已启用" : "未启用");
    if (autoRateEnabled) {
      const adOverlay = document.querySelector(youtubeSelectors.adSelector);
      const adOverlayExists = !!adOverlay;
      console.log("[设置] 当前广告覆盖层存在:", adOverlayExists);
      if (!adOverlay) {
        const rate = parseFloat(GM_getValue((_d = Common.settingPanelItems.Youtube_Action_Rate) == null ? void 0 : _d.valueKey, Common.defaultSpeed));
        console.log("[设置] 准备设置倍速:", rate);
        Common.setPlaybackRate(rate);
        sys.youtubeLiveStreamStatus = false;
      } else {
        console.log("[跳过] 检测到广告，跳过倍速设置");
      }
    }
    console.log("<<<< handleYoutube 执行完毕");
    sys.isYoutubePageProcessing = false;
  }
  async function handleBilibiliPage() {
    var _a, _b, _c;
    console.log(">>>> handleBilibili 开始执行");
    try {
      elmGetter.get(bilibiliSelectors.speedBtnPostionTarget).then((targetContainer) => {
        if (targetContainer) {
          Common.createSpeedButtons((moreSpeedsDiv) => {
            console.log("[UI] 找到目标容器 " + bilibiliSelectors.speedBtnPostionTarget);
            if (targetContainer.firstChild) {
              targetContainer.insertBefore(moreSpeedsDiv, targetContainer.firstChild);
            } else {
              targetContainer.appendChild(moreSpeedsDiv);
            }
            console.log("[UI] 倍速按钮已插入到 " + bilibiliSelectors.speedBtnPostionTarget + "的第一个位置");
            const video = document.getElementsByTagName("video")[0];
            if (video) {
              console.log("[UI] 当前视频播放速度:", video.playbackRate);
              Common.updateSpeedButtonHighlight(video.playbackRate.toString());
            }
          });
        } else {
          console.warn("[UI] 未找到目标容器 "+ bilibiliSelectors.speedBtnPostionTarget);
        }
      });
    } catch (error) {
      console.error("创建倍速按钮失败:", error);
    }
    if (GM_getValue((_a = Common.settingPanelItems.Bilibili_Action_WebFullscreen) == null ? void 0 : _a.enableKey, false)) {
      console.log("[设置] 自动网页全屏 已启用");
      elmGetter.get(bilibiliSelectors.playerContainer).then((playItem) => {
        if (playItem.classList.contains(bilibiliSelectors.webFullClass)) {
          console.log("[跳过] 已是网页全屏模式");
          return;
        }
        elmGetter.get(bilibiliSelectors.webFullBtn).then((item) => {
          console.log("[操作] 点击网页全屏按钮");
          item.click();
        });
      });
    }
    const autoRateEnabled = GM_getValue((_b = Common.settingPanelItems.Bilibili_Action_Rate) == null ? void 0 : _b.enableKey, false);
    console.log("[设置] 自动倍速播放:", autoRateEnabled ? "已启用" : "未启用");
    if (autoRateEnabled) {
      const rate = parseFloat(GM_getValue((_c = Common.settingPanelItems.Bilibili_Action_Rate) == null ? void 0 : _c.valueKey, Common.defaultSpeed));
      console.log("[设置] 准备设置倍速:", rate);
      
      // 持续重试直到视频元素就绪并成功设置倍速
      let retryCount = 0;
      const setRateWithRetry = () => {
        const video = document.getElementsByTagName("video")[0];
        if (video) {
          Common.setPlaybackRate(rate);
          console.log("[成功] 已设置倍速为:", rate);
        } else {
          retryCount++;
          setTimeout(setRateWithRetry, 500);
          if (retryCount % 10 === 0) {
            console.log(`[等待] 视频元素加载中... (已尝试${retryCount}次)`);
          }
        }
      };
      
      setRateWithRetry();
    }
    console.log("[启动] bilibili定时移除 定时器 (间隔200ms)");
    this.removalInterval = setInterval(() => {
      var _a2;
      const playerEl = document.querySelector(bilibiliSelectors.playerContainer);
      if (!playerEl) return;
      const isWebFullScreen = playerEl.classList.contains(bilibiliSelectors.webscreenClass);
      for (const key in bilibili_removal_items) {
        const enableKey = (_a2 = Common.settingPanelItems[key]) == null ? void 0 : _a2.enableKey;
        if (!GM_getValue(enableKey, false)) continue;
        const item = document.querySelector(bilibili_removal_items[key].selector);
        if (!item) continue;
        if (bilibili_removal_items[key].mode === "remove") {
          item.remove();
        } else {
          if (isWebFullScreen) {
            item.style.width = "0";
          } else {
            item.style.width = "";
          }
        }
      }
    }, 1000);
    console.log("<<<< handleBilibili 执行完毕");
  }
  const STYLES = `
  #minimalSettingsPanel {
    font-size: 12px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    padding: 10px;
    background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
    border: 1px solid #d1d5db;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 2147403647 !important;
    display: none;
  }
  #minimalSettingsPanel.lang-en {
    width: 600px;
  }
  #minimalSettingsPanel.show {
    display: block;
  }
  #minimalSettingsPanel .panel-header {
    text-align: center;
    /*  margin-bottom: 20px;
    padding-bottom: 15px; */
    border-bottom: 2px solid #e5e7eb;
  }
  #minimalSettingsPanel .panel-header h2 {
    margin: 0;
    font-size: 21px;
    color: #1f2937;
    font-weight: 600;
  }
  #minimalSettingsPanel .panel-header .subtitle {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }
  #minimalSettingsPanel .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    margin: 5px 0 5px 0;
    padding-left: 8px;
    border-left: 3px solid #3b82f6;
  }
  #minimalSettingsPanel .setting-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  #minimalSettingsPanel .setting-list.two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  #minimalSettingsPanel .setting-item {
    display: flex;
    align-items: center;
    padding: 2px 12px;
    background-color: rgba(240, 240, 240, 0.8);
    border-radius: 6px;
    transition: background-color 0.2s;
    white-space: nowrap;
  }
  #minimalSettingsPanel .setting-item:hover {
    background-color: rgba(59, 130, 246, 0.1);
  }
  #minimalSettingsPanel .setting-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    cursor: pointer;
    accent-color: #3b82f6;
    flex-shrink: 0;
  }
  #minimalSettingsPanel .setting-item label {
    flex: 1;
    cursor: pointer;
    font-size: 15px;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  #minimalSettingsPanel .setting-item label .star {
    color: #f59e0b;
    margin-right: 4px;
  }
  #minimalSettingsPanel .setting-item select {
    width: 50px;
    margin-left: 12px;
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
  }
  #minimalSettingsPanel .buttons {
    margin-top: 10px;
    text-align: center;
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  #minimalSettingsPanel .buttons button {
    padding: 8px 24px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s;
  }
  #minimalSettingsPanel .buttons #saveBtn {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }
  #minimalSettingsPanel .buttons #saveBtn:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }
  #minimalSettingsPanel .buttons #closeBtn {
    background-color: #e5e7eb;
    color: #374151;
  }
  #minimalSettingsPanel .buttons #closeBtn:hover {
    background-color: #d1d5db;
  }
  #minimalSettingsPanel .panel-footer {
    margin-top: 10px;
    padding-top: 5px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 13px;
    color: #9ca3af;
  }
  #minimalSettingsPanel .panel-footer .author-info {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    /*margin-bottom: 4px;*/
  }
  #minimalSettingsPanel .panel-footer .author-info .author-label {
    color: #6b7280;
  }
  #minimalSettingsPanel .panel-footer .author-info .author-name {
    color: #374151;
    font-weight: 500;
  }
  #minimalSettingsPanel .panel-footer .email-info {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  #minimalSettingsPanel .panel-footer .email-info a {
    color: #3b82f6;
    text-decoration: none;
  }
  #minimalSettingsPanel .panel-footer .email-info a:hover {
    text-decoration: underline;
  }
  #minimalSettingsPanel .speed-list-section {
    margin-top: 5px;
    /* padding: 10px;*/
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
  }
  #minimalSettingsPanel .speed-list-section .input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  #minimalSettingsPanel .speed-list-section .section-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    flex-shrink: 0;
  }
  #minimalSettingsPanel .speed-list-section .section-label .star {
    color: #f59e0b;
    margin-right: 4px;
  }
  #minimalSettingsPanel .speed-list-section input[type="text"] {
    flex: 0 0 auto;
    min-width: 200px;
    max-width: 300px;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    ime-mode: disabled;
  }
  #minimalSettingsPanel .speed-list-section input[type="text"]:focus {
    outline: none;
    border-color: #3b82f6;
    ime-mode: disabled;
  }
  #minimalSettingsPanel .speed-list-section input[type="text"].error {
    border-color: #ef4444;
    background-color: #fef2f2;
  }
  #minimalSettingsPanel .speed-list-section .separator-hint {
    font-size: 12px;
    color: #9ca3af;
    display: block;
  }
  #minimalSettingsPanel .speed-list-section .separator-hint.hidden {
    display: none;
  }
  #minimalSettingsPanel .speed-list-section .error-message {
    font-size: 13px;
    color: #ef4444;
    display: none;
  }
  #minimalSettingsPanel .speed-list-section .error-message.show {
    display: block;
  }
  .speed-control-button.active {
    border: 2px solid #007bff !important;
  }
  #minimalSettingsPanel .shortcut-container {
    margin-top: 15px;
    font-size: 14px;
    color: #6b7280;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: rgba(59, 130, 246, 0.1);
    border-radius: 6px;
  }
  #minimalSettingsPanel .shortcut-container .shortcut-title {
    font-weight: 600;
    margin-bottom: 4px;
  }
`;
  const INTERVALS = {
    YOUTUBE_LIVE_STREAM_CHECK: 1e3,
    YOUTUBE_AD_CHECK: 200
  };
  function logSection(title) {
    console.log(`========== ${title} ==========`);
  }
  function isYoutubePage() {
    return window.location.href.includes("youtube.com/");
  }
  function isYoutubeWatchPage() {
    return window.location.href.includes("youtube.com/watch");
  }
  function isBilibiliVideoPage() {
    return window.location.href.includes("bilibili.com/video") || window.location.href.includes("bilibili.com/bangumi/play");
  }
  function main() {
    if (sys.isMainRunning) {
      console.log("========== main 正在执行中，跳过此次调用 ==========");
      return;
    }
    sys.isMainRunning = true;
    logSection("main 开始执行");
    console.log("当前URL:", window.location.href);
    console.log("initialized状态:", sys.initialized);
    if (!sys.initialized) {
      sys.currentLang = Common.detectLanguage();
      Common.initSettingItems(window.location.href);
      
      // 加载倍速列表
      Common.loadSpeedList();
      
      logSection("执行一次性初始化");
      GM_addStyle(STYLES);
      GM_registerMenuCommand(Common.geti18nText("Menu_Settings"), Common.togglePanel.bind(Common));
      document.addEventListener("keydown", Common.handleKeydown.bind(Common));
      if (isYoutubePage()) {
        initYoutubeListeners();
      } else if (isBilibiliVideoPage()) {
        initBilibiliListener();
      }
      const isFirstRun = GM_getValue("firstRunComplete", false);
      if (!isFirstRun) {
        console.log("[首次运行] 自动弹出设置界面");
        GM_setValue("firstRunComplete", true);
        setTimeout(() => {
          Common.togglePanel();
        }, 500);
      }
      sys.initialized = true;
      logSection("一次性初始化完成");
    }
    if (isYoutubeWatchPage()) {
      console.log("[触发] 首次执行 -> youtube.init");
      handleYoutubePage().then((r) => console.log("handleYoutubePage result:", r)).catch((e) => console.error("handleYoutubePage error:", e));
    } else if (isBilibiliVideoPage()) {
      console.log("[触发] 首次执行 -> bilibili.init");
      handleBilibiliPage().then((r) => console.log("handleBilibiliPage result:", r)).catch((e) => console.error("handleBilibiliPage error:", e));
    }
    logSection("main 执行完毕");
    sys.isMainRunning = false;
  }
  function initYoutubeListeners() {
    var _a;
    if (sys.youtubeFallbackRate === null) {
      sys.youtubeFallbackRate = parseFloat(
        GM_getValue((_a = Common.settingPanelItems.Youtube_Action_Rate) == null ? void 0 : _a.valueKey, Common.defaultSpeed)
      );
      console.log("[初始化] youtubeFallbackRate = " + sys.youtubeFallbackRate);
    }
    console.log("[注册] yt-navigate-finish 监听器 -> youtube.init");
    window.addEventListener(youtubeSelectors.finishListener, () => handleYoutubePage());
    console.log(`[启动] youtubeLiveStreamCheck 定时器 (间隔${INTERVALS.YOUTUBE_LIVE_STREAM_CHECK}ms)`);
    sys.youtubeLiveStreamCheck = setInterval(() => {
      const element = document.querySelector(youtubeSelectors.liveStreamIcon);
      const isLive = element && element.classList.contains(youtubeSelectors.liveStreamClass);
      const isWatchPage = isYoutubeWatchPage();
      if (isWatchPage) {
        if (isLive && !sys.youtubeLiveStreamStatus) {
          Common.setPlaybackRate(1);
          console.log("已检测到直播，重置播放速度为1.0");
          sys.youtubeLiveStreamStatus = true;
        } else if (!isLive && sys.youtubeLiveStreamStatus) {
          Common.setPlaybackRate(sys.youtubeFallbackRate);
          console.log("直播已结束，恢复播放速度为" + sys.youtubeFallbackRate);
          sys.youtubeLiveStreamStatus = false;
        }
      }
    }, INTERVALS.YOUTUBE_LIVE_STREAM_CHECK);
    console.log(`[启动] youtubeAdCheckInterval 定时器 (间隔${INTERVALS.YOUTUBE_AD_CHECK}ms)`);
    sys.youtubeAdCheckInterval = setInterval(() => {
      const adOverlay = document.querySelector(youtubeSelectors.adSelector);
      const video = document.getElementsByTagName("video")[0];
      if (adOverlay && !sys.youtubeAdDetected && video) {
        console.log("已检测到广告，重置播放速度为1.0");
        Common.setPlaybackRate(1);
        sys.youtubeAdDetected = true;
      } else if (!adOverlay && sys.youtubeAdDetected && video) {
        console.log("广告已结束，恢复播放速度为" + sys.youtubeFallbackRate);
        Common.setPlaybackRate(sys.youtubeFallbackRate);
        sys.youtubeAdDetected = false;
      }
    }, INTERVALS.YOUTUBE_AD_CHECK);
  }
  function initBilibiliListener() {
    sys.lastUrl = location.href;
    console.log("[启动] MutationObserver 监听 Bilibili URL 变化");
    sys.bilibiliUrlObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== sys.lastUrl) {
        logSection("MutationObserver 检测到URL变化");
        console.log("旧URL:", sys.lastUrl);
        console.log("新URL:", url);
        sys.lastUrl = url;
        if (isBilibiliVideoPage()) {
          console.log("[触发] Bilibili URL变化 -> main()");
          main();
        }
        logSection("MutationObserver 处理完毕");
      }
    });
    sys.bilibiliUrlObserver.observe(document, { subtree: true, childList: true });
  }
  function cleanup() {
    if (sys.youtubeLiveStreamCheck !== null) {
      console.log("[清理] youtube直播 定时器");
      clearInterval(sys.youtubeLiveStreamCheck);
      sys.youtubeLiveStreamCheck = null;
    }
    if (sys.youtubeAdCheckInterval !== null) {
      console.log("[清理] youtube广告 定时器");
      clearInterval(sys.youtubeAdCheckInterval);
      sys.youtubeAdCheckInterval = null;
    }
    if (sys.bilibiliUrlObserver !== null) {
      console.log("[清理] bilibili MutationObserver");
      sys.bilibiliUrlObserver.disconnect();
      sys.bilibiliUrlObserver = null;
    }
    sys.youtubeAdDetected = false;
  }
  window.addEventListener("beforeunload", cleanup);
  main();

})();