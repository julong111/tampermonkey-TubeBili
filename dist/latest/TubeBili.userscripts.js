// ==UserScript==
// @name               TubeBili - YouTube(油管) Bilibili(B站) 视频增强工具
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools
// @namespace          com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @version            2.1.1
// @author             julong@111.com
// @description        自动网页全屏、自定义倍速列表、快捷键一键调速、界面漂亮，让您摆脱繁琐操作，专注享受视频
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos
// @license            AGPL-3.0-only
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @match              *://*.youtube.com/*
// @match              *://*.bilibili.com/*
// @exclude            *://accounts.youtube.com/*
// @run-at             document-start
// @grant              none
// ==/UserScript==

(function () {
  'use strict';

  function createFloatingButton(name, callback) {
    if (document.getElementById('tubeBiliFloatingBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'tubeBiliFloatingBtn';
    btn.textContent = '\u2699\uFE0F';
    btn.title = name;
    Object.assign(btn.style, {
      position: 'fixed',
      top: '5%',
      right: '-25px',
      width: '40px',
      height: '40px',
      borderRadius: '8px 0 0 8px',
      background: 'rgba(59, 130, 246, 0.9)',
      opacity: '0.3',
      color: 'white',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      zIndex: '2147483647',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      WebkitBackdropFilter: 'blur(10px)',
      backdropFilter: 'blur(10px)',
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.right = '20px';
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1.1)';
      btn.style.background = 'rgba(37, 99, 235, 1)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.right = '-25px';
      btn.style.opacity = '0.3';
      btn.style.transform = 'scale(1)';
      btn.style.background = 'rgba(37, 99, 235, 0.8)';
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
    });

    const appendBtn = () => {
      if (document.body) {
        document.body.appendChild(btn);
      } else {
        requestAnimationFrame(appendBtn);
      }
    };
    appendBtn();

    const hideStyle = document.createElement('style');
    hideStyle.textContent = `
    body:has(#minimalSettingsPanel.show) #tubeBiliFloatingBtn {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.8);
    }
  `;
    if (document.head) document.head.appendChild(hideStyle);
  }

  const gm = {
    getValue(key, defaultValue) {
      try {
        const value = localStorage.getItem('TubeBili_' + key);
        if (value === null) return defaultValue;
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value) && value !== '') return Number(value);
        return value;
      } catch (e) {
        console.warn('[TubeBili] localStorage read failed:', e);
        return defaultValue;
      }
    },

    setValue(key, value) {
      try {
        localStorage.setItem('TubeBili_' + key, String(value));
        return Promise.resolve();
      } catch (e) {
        console.warn('[TubeBili] localStorage write failed:', e);
        return Promise.reject(e);
      }
    },

    addStyle(css) {
      const style = document.createElement('style');
      style.textContent = css;
      style.setAttribute('data-tubebili-style', 'true');
      if (document.head) {
        document.head.appendChild(style);
      } else {
        const addWhenReady = () => {
          if (document.head) {
            document.head.appendChild(style);
            document.removeEventListener('DOMContentLoaded', addWhenReady);
          }
        };
        document.addEventListener('DOMContentLoaded', addWhenReady);
      }
      return style;
    },

    registerMenuCommand(name, callback) {
      createFloatingButton(name, callback);
    }
  };

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
  width: 80px;
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
#speedButtons {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
}
#speedButtons.youtube {
  height: 32px;
  margin-top: 12px;
}
#speedButtons.bilibili {
  height: 32px;
}
.speed-control-button {
  background-color: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  color: #ffffff !important;
  margin-right: 1px;
  border-radius: 4px;
  cursor: pointer;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
}
.speed-control-button.youtube {
  background-color: rgba(15, 15, 15, 0.8) !important;
  height: 28px;
  font-size: 15px;
}
.speed-control-button.bilibili {
  height: 30px;
  font-size: 14px;
}
`;

  function injectStyles() {
    gm.addStyle(STYLES);
  }

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
      Youtube_Action_Rate: "自动倍速播放",
      Youtube_Action_TheaterMode: "自动进入影院模式",
      Youtube_Remove_Autoplay: "移除自动播放开关",
      Youtube_Remove_Subtitles: "移除字幕按钮",
      Youtube_Remove_Settings: "移除设置按钮",
      Youtube_Remove_TheaterMode: "移除影院模式按钮",
      Youtube_Remove_FullScreen: "移除全屏按钮",
      Bilibili_Action_Rate: "自动倍速播放",
      Bilibili_Action_WebFullscreen: "自动网页全屏",
      Bilibili_Action_AutoCloseLoginWindow: "自动关闭登录弹窗并恢复播放",
      Bilibili_Remove_Pip: "移除画中画按钮",
      Bilibili_Remove_Speed: "移除原始倍速按钮",
      Bilibili_Remove_Comments: "移除评论输入区"
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
      Youtube_Action_Rate: "Auto Playback Speed",
      Youtube_Action_TheaterMode: "Auto Theater Mode",
      Youtube_Remove_Autoplay: "Remove Autoplay Toggle",
      Youtube_Remove_Subtitles: "Remove Subtitles Button",
      Youtube_Remove_Settings: "Remove Settings Button",
      Youtube_Remove_TheaterMode: "Remove Theater Mode Button",
      Youtube_Remove_FullScreen: "Remove FullScreen Button",
      Bilibili_Action_Rate: "Auto Playback Speed",
      Bilibili_Action_WebFullscreen: "Auto Web Fullscreen",
      Bilibili_Action_AutoCloseLoginWindow: "Auto Close Login Window and Resume Playback",
      Bilibili_Remove_Pip: "Remove Picture-in-Picture Button",
      Bilibili_Remove_Speed: "Remove Original Speed Button",
      Bilibili_Remove_Comments: "Remove Comments Input Area"
    }
  };

  function t(key, lang = 'zh') {
    return i18n[lang]?.[key] || key;
  }

  function detectLanguage() {
    let userLang = navigator.language.toLowerCase();
    if (userLang.startsWith("zh")) return "zh";
    if (userLang.startsWith("en")) return "en";
    return "en";
  }

  function getText$1(key, lang) {
    return i18n[lang]?.[key] || key;
  }

  function buildCatalog(url, lang) {
    if (url.includes("youtube.com")) {
      return {
        Youtube_Action_Rate: {
          classId: "Youtube_Action_Rate",
          text: getText$1("Youtube_Action_Rate", lang),
          enableKey: "Youtube_Action_Rate_Enabled",
          valueKey: "Youtube_Action_Rate_Value",
          recommended: true
        },
        Youtube_Action_TheaterMode: {
          classId: "Youtube_Action_TheaterMode",
          text: getText$1("Youtube_Action_TheaterMode", lang),
          enableKey: "Youtube_Action_TheaterMode",
          recommended: true
        },
        Youtube_Remove_Autoplay: {
          classId: "Youtube_Remove_Autoplay",
          text: getText$1("Youtube_Remove_Autoplay", lang),
          enableKey: "Youtube_Remove_Autoplay"
        },
        Youtube_Remove_Subtitles: {
          classId: "Youtube_Remove_Subtitles",
          text: getText$1("Youtube_Remove_Subtitles", lang),
          enableKey: "Youtube_Remove_Subtitles"
        },
        Youtube_Remove_Settings: {
          classId: "Youtube_Remove_Settings",
          text: getText$1("Youtube_Remove_Settings", lang),
          enableKey: "Youtube_Remove_Settings"
        },
        Youtube_Remove_TheaterMode: {
          classId: "Youtube_Remove_TheaterMode",
          text: getText$1("Youtube_Remove_TheaterMode", lang),
          enableKey: "Youtube_Remove_TheaterMode"
        },
        Youtube_Remove_FullScreen: {
          classId: "Youtube_Remove_FullScreen",
          text: getText$1("Youtube_Remove_FullScreen", lang),
          enableKey: "Youtube_Remove_FullScreen"
        }
      };
    } else if (url.includes("bilibili.com")) {
      return {
        Bilibili_Action_Rate: {
          classId: "Bilibili_Action_Rate",
          text: getText$1("Bilibili_Action_Rate", lang),
          enableKey: "Bilibili_Action_Rate_Enabled",
          valueKey: "Bilibili_Action_Rate_Value",
          recommended: true
        },
        Bilibili_Action_WebFullscreen: {
          classId: "Bilibili_Action_WebFullscreen",
          text: getText$1("Bilibili_Action_WebFullscreen", lang),
          enableKey: "Bilibili_Action_WebFullscreen",
          recommended: true
        },
        Bilibili_Action_AutoCloseLoginWindow: {
          classId: "Bilibili_Action_AutoCloseLoginWindow",
          text: getText$1("Bilibili_Action_AutoCloseLoginWindow", lang),
          enableKey: "Bilibili_Action_AutoCloseLoginWindow"
        },
        Bilibili_Remove_Pip: {
          classId: "Bilibili_Remove_Pip",
          text: getText$1("Bilibili_Remove_Pip", lang),
          enableKey: "Bilibili_Remove_Pip"
        },
        Bilibili_Remove_Speed: {
          classId: "Bilibili_Remove_Speed",
          text: getText$1("Bilibili_Remove_Speed", lang),
          enableKey: "Bilibili_Remove_Speed"
        },
        Bilibili_Remove_Comments: {
          classId: "Bilibili_Remove_Comments",
          text: getText$1("Bilibili_Remove_Comments", lang),
          enableKey: "Bilibili_Remove_Comments"
        }
      };
    }
    return {};
  }

  const shortcutSpeedListKey = "Shortcut_Speed_List";
  const buttonSpeedListKey = "Button_Speed_List";

  const DEFAULT_SHORTCUT_SPEEDS = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0"];
  const DEFAULT_BUTTON_SPEEDS = ["0.5", "1.0", "1.5", "2.0"];
  const DEFAULT_SPEED = "1.0";

  function speedListError(lang) {
    return i18n[lang]?.["Menu_SpeedList_Error"] || "Menu_SpeedList_Error";
  }

  function validateSpeedList(input, lang = 'en') {
    if (!input || typeof input !== "string") {
      return { valid: false, speeds: [], error: speedListError(lang) };
    }
    const parts = input.split(/[,，]/).map((s) => s.trim()).filter((s) => s !== "");
    if (parts.length === 0 || parts.length > 10) {
      return { valid: false, speeds: [], error: speedListError(lang) };
    }
    const speeds = [];
    for (const part of parts) {
      const regex = /^(\d+\.?\d{0,1}|\.\d{1})$/;
      if (!regex.test(part)) {
        return { valid: false, speeds: [], error: speedListError(lang) };
      }
      const num = parseFloat(part);
      if (num < 0.1 || num > 10) {
        return { valid: false, speeds: [], error: speedListError(lang) };
      }
      speeds.push(parseFloat(num.toFixed(1)).toString());
    }
    return { valid: true, speeds, error: "" };
  }

  const settingsState = {
    shortcutSpeeds: [...DEFAULT_SHORTCUT_SPEEDS],
    buttonSpeeds: [...DEFAULT_BUTTON_SPEEDS],
    defaultSpeed: DEFAULT_SPEED,
    settingPanelItems: {},
    currentLang: 'en'
  };

  function initSettings(url) {
    settingsState.currentLang = detectLanguage();
    loadSpeedLists();
    settingsState.settingPanelItems = buildCatalog(url, settingsState.currentLang);
  }

  function loadSpeedLists() {
    const shortcutRaw = gm.getValue(shortcutSpeedListKey);
    if (shortcutRaw != null) {
      const result = validateSpeedList(shortcutRaw, settingsState.currentLang);
      if (result.valid) settingsState.shortcutSpeeds = result.speeds;
    }
    const buttonRaw = gm.getValue(buttonSpeedListKey);
    if (buttonRaw != null) {
      const result = validateSpeedList(buttonRaw, settingsState.currentLang);
      if (result.valid) settingsState.buttonSpeeds = result.speeds;
    }
  }

  function getShortcutSpeeds() {
    return [...settingsState.shortcutSpeeds];
  }

  function getButtonSpeeds() {
    return [...settingsState.buttonSpeeds];
  }

  function getDefaultSpeed() {
    return settingsState.defaultSpeed;
  }

  function getSettingPanelItems() {
    return { ...settingsState.settingPanelItems };
  }

  function getCurrentLang() {
    return settingsState.currentLang;
  }

  function setSpeedLists(shortcutSpeeds, buttonSpeeds) {
    settingsState.shortcutSpeeds = [...shortcutSpeeds];
    settingsState.buttonSpeeds = buttonSpeeds ? [...buttonSpeeds] : [...shortcutSpeeds];
  }

  let settingPanelInitialized = false;
  let settingPanelElement = null;

  function getText(key) {
    return t(key, getCurrentLang());
  }

  function createSpeedList(speeds, select) {
    speeds.forEach((speed) => {
      const option = document.createElement("option");
      option.value = speed;
      option.textContent = speed;
      select.appendChild(option);
    });
  }

  function updateSpeedSelects(shortcutSpeedsNew, buttonSpeedsNew, shortcutSpeedListString, buttonSpeedListString) {
    setSpeedLists(shortcutSpeedsNew, buttonSpeedsNew);

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
        createSpeedList(getShortcutSpeeds(), select);
        if (getShortcutSpeeds().includes(currentValue)) {
          select.value = currentValue;
        } else {
          select.value = getShortcutSpeeds()[0];
        }
      }
    }
  }

  function createSettingItem(item) {
    let functionDiv = document.createElement("div");
    functionDiv.className = "setting-item";
    let functionValue = gm.getValue(item.enableKey, false);
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
      createSpeedList(getShortcutSpeeds(), select);
      select.value = gm.getValue(item.valueKey, getDefaultSpeed());
      functionDiv.appendChild(select);
    }
    return functionDiv;
  }

  function initializePanel() {
    let panel = document.createElement("div");
    panel.id = "minimalSettingsPanel";
    if (getCurrentLang() === "en") {
      panel.classList.add("lang-en");
    }
    const header = document.createElement("div");
    header.className = "panel-header";
    const title = document.createElement("h2");
    title.textContent = getText("Menu_Settings");
    const subtitle = document.createElement("div");
    subtitle.className = "subtitle";
    subtitle.textContent = getText("Menu_Subtitle");
    header.appendChild(title);
    header.appendChild(subtitle);
    panel.appendChild(header);

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
    shortcutSpeedListLabel.appendChild(document.createTextNode(getText("Menu_ShortcutSpeedList_Label")));
    shortcutInputRow.appendChild(shortcutSpeedListLabel);
    const shortcutSpeedListInput = document.createElement("input");
    shortcutSpeedListInput.type = "text";
    shortcutSpeedListInput.id = "shortcutSpeedListInput";
    shortcutSpeedListInput.placeholder = getText("Menu_SpeedList_Placeholder");
    shortcutSpeedListInput.value = gm.getValue(shortcutSpeedListKey) ?? getShortcutSpeeds().join(",");
    shortcutInputRow.appendChild(shortcutSpeedListInput);
    shortcutSpeedListSection.appendChild(shortcutInputRow);
    const shortcutSeparatorHint = document.createElement("div");
    shortcutSeparatorHint.className = "separator-hint";
    shortcutSeparatorHint.id = "shortcutSeparatorHint";
    shortcutSeparatorHint.textContent = getText("Menu_SpeedList_Separator");
    shortcutSpeedListSection.appendChild(shortcutSeparatorHint);
    const shortcutErrorMessage = document.createElement("div");
    shortcutErrorMessage.className = "error-message";
    shortcutErrorMessage.id = "shortcutSpeedListError";
    shortcutErrorMessage.textContent = getText("Menu_SpeedList_Error");
    shortcutSpeedListSection.appendChild(shortcutErrorMessage);
    shortcutSpeedListInput.addEventListener("blur", () => {
      const result = validateSpeedList(shortcutSpeedListInput.value, getCurrentLang());
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

    const buttonSpeedListSection = document.createElement("div");
    buttonSpeedListSection.className = "speed-list-section";
    const buttonInputRow = document.createElement("div");
    buttonInputRow.className = "input-row";
    const buttonSpeedListLabel = document.createElement("div");
    buttonSpeedListLabel.className = "section-label";
    buttonSpeedListLabel.appendChild(document.createTextNode(getText("Menu_ButtonSpeedList_Label")));
    buttonInputRow.appendChild(buttonSpeedListLabel);
    const buttonSpeedListInput = document.createElement("input");
    buttonSpeedListInput.type = "text";
    buttonSpeedListInput.id = "buttonSpeedListInput";
    buttonSpeedListInput.placeholder = getText("Menu_SpeedList_Placeholder");
    buttonSpeedListInput.value = gm.getValue(buttonSpeedListKey) ?? getButtonSpeeds().join(",");
    buttonInputRow.appendChild(buttonSpeedListInput);
    buttonSpeedListSection.appendChild(buttonInputRow);
    const buttonSeparatorHint = document.createElement("div");
    buttonSeparatorHint.className = "separator-hint";
    buttonSeparatorHint.id = "buttonSeparatorHint";
    buttonSeparatorHint.textContent = getText("Menu_SpeedList_Separator");
    buttonSpeedListSection.appendChild(buttonSeparatorHint);
    const buttonErrorMessage = document.createElement("div");
    buttonErrorMessage.className = "error-message";
    buttonErrorMessage.id = "buttonSpeedListError";
    buttonErrorMessage.textContent = getText("Menu_SpeedList_Error");
    buttonSpeedListSection.appendChild(buttonErrorMessage);
    buttonSpeedListInput.addEventListener("blur", () => {
      const result = validateSpeedList(buttonSpeedListInput.value, getCurrentLang());
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

    const settingPanelItems = getSettingPanelItems();
    const actionItems = [];
    const removeItems = [];
    for (const [key, item] of Object.entries(settingPanelItems)) {
      if (key.startsWith("_Action") || key.includes("Action")) {
        actionItems.push([key, item]);
      } else {
        removeItems.push([key, item]);
      }
    }
    if (actionItems.length > 0) {
      const actionsTitle = document.createElement("div");
      actionsTitle.className = "section-title";
      actionsTitle.textContent = getText("Menu_Section_Actions");
      panel.appendChild(actionsTitle);
      const actionsList = document.createElement("div");
      actionsList.className = "setting-list";
      for (const [key, item] of actionItems) {
        actionsList.appendChild(createSettingItem(item));
      }
      panel.appendChild(actionsList);
    }
    if (removeItems.length > 0) {
      const removeTitle = document.createElement("div");
      removeTitle.className = "section-title";
      removeTitle.textContent = getText("Menu_Section_Remove");
      panel.appendChild(removeTitle);
      const removeList = document.createElement("div");
      removeList.className = "setting-list two-columns";
      for (const [key, item] of removeItems) {
        removeList.appendChild(createSettingItem(item));
      }
      panel.appendChild(removeList);
    }

    const shortcutContainer = document.createElement("div");
    shortcutContainer.className = "shortcut-container";
    const shortcutTitle = document.createElement("div");
    shortcutTitle.className = "shortcut-title";
    shortcutTitle.textContent = getText("Menu_Section_Shortcut");
    shortcutContainer.appendChild(shortcutTitle);
    const shortcutDesc = document.createElement("div");
    shortcutDesc.textContent = getText("Menu_Shortcut_Desc");
    shortcutContainer.appendChild(shortcutDesc);
    panel.appendChild(shortcutContainer);

    let buttons = document.createElement("div");
    buttons.className = "buttons";
    let saveBtn = document.createElement("button");
    saveBtn.id = "saveBtn";
    saveBtn.textContent = getText("Menu_Save");
    saveBtn.addEventListener("click", () => saveSettings());
    let closeBtn = document.createElement("button");
    closeBtn.id = "closeBtn";
    closeBtn.textContent = getText("Menu_Close");
    closeBtn.addEventListener("click", () => togglePanel());
    buttons.appendChild(saveBtn);
    buttons.appendChild(closeBtn);
    panel.appendChild(buttons);

    const footer = document.createElement("div");
    footer.className = "panel-footer";
    const authorInfo = document.createElement("div");
    authorInfo.className = "author-info";
    const authorLabel = document.createElement("span");
    authorLabel.className = "author-label";
    authorLabel.textContent = getText("Menu_Author_Title") + ":";
    const authorName = document.createElement("span");
    authorName.className = "author-name";
    authorName.textContent = getText("Menu_Author");
    authorInfo.appendChild(authorLabel);
    authorInfo.appendChild(authorName);
    footer.appendChild(authorInfo);
    const emailInfo = document.createElement("div");
    emailInfo.className = "email-info";
    const emailLabel = document.createElement("span");
    emailLabel.className = "author-label";
    emailLabel.textContent = getText("Menu_Email") + ":";
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:julong@111.com";
    emailLink.textContent = "julong@111.com";
    emailInfo.appendChild(emailLabel);
    emailInfo.appendChild(emailLink);
    footer.appendChild(emailInfo);
    panel.appendChild(footer);

    document.body.appendChild(panel);
    settingPanelElement = panel;
    settingPanelInitialized = true;
  }

  function saveSettings() {
    const shortcutSpeedListInput = document.getElementById("shortcutSpeedListInput");
    const shortcutErrorMessage = document.getElementById("shortcutSpeedListError");
    const shortcutResult = validateSpeedList(shortcutSpeedListInput.value, getCurrentLang());

    const buttonSpeedListInput = document.getElementById("buttonSpeedListInput");
    const buttonErrorMessage = document.getElementById("buttonSpeedListError");
    const buttonResult = validateSpeedList(buttonSpeedListInput.value, getCurrentLang());

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

    gm.setValue(shortcutSpeedListKey, shortcutSpeedListInput.value);
    gm.setValue(buttonSpeedListKey, buttonSpeedListInput.value);

    setSpeedLists(shortcutResult.speeds, buttonResult.speeds);
    updateSpeedSelects(shortcutResult.speeds, buttonResult.speeds, shortcutSpeedListInput.value, buttonSpeedListInput.value);

    const settingPanelItems = getSettingPanelItems();
    for (const [key, item] of Object.entries(settingPanelItems)) {
      const isChecked = document.getElementById(item.classId).checked;
      gm.setValue(item.enableKey, isChecked);
      if (item.valueKey) {
        const value = document.getElementById(item.valueKey).value;
        gm.setValue(item.valueKey, value);
      }
    }
    settingPanelElement.classList.toggle("show");
  }

  function togglePanel() {
    if (!settingPanelInitialized) {
      initializePanel();
    } else {
      const savedShortcutSpeedList = gm.getValue(shortcutSpeedListKey) ?? getShortcutSpeeds().join(",");
      const shortcutResult = validateSpeedList(savedShortcutSpeedList, getCurrentLang());

      const savedButtonSpeedList = gm.getValue(buttonSpeedListKey) ?? getButtonSpeeds().join(",");
      const buttonResult = validateSpeedList(savedButtonSpeedList, getCurrentLang());

      if (shortcutResult.valid && buttonResult.valid) {
        updateSpeedSelects(
          shortcutResult.speeds,
          buttonResult.speeds,
          savedShortcutSpeedList,
          savedButtonSpeedList
        );
      }
    }
    settingPanelElement.classList.toggle("show");
  }

  function waitElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          clearTimeout(timer);
          resolve(el);
        }
      });

      const observeTarget = document.documentElement || document.body;
      if (observeTarget) {
        observer.observe(observeTarget, {
          childList: true,
          subtree: true
        });
      }

      const timer = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
      }, timeout);
    });
  }

  function getVideoElement() {
    return document.getElementsByTagName("video")[0] || null;
  }

  let speedIndicatorElement = null;
  let speedIndicatorTimer = null;

  function showSpeedIndicator(rate) {
    if (speedIndicatorTimer) {
      clearTimeout(speedIndicatorTimer);
    }
    if (!speedIndicatorElement) {
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
      speedIndicatorElement = indicator;
    }
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
      if (speedIndicatorElement.parentNode !== fullscreenElement) {
        fullscreenElement.appendChild(speedIndicatorElement);
      }
    } else {
      if (speedIndicatorElement.parentNode !== document.body) {
        document.body.appendChild(speedIndicatorElement);
      }
    }
    speedIndicatorElement.textContent = `${rate}x`;
    speedIndicatorElement.style.opacity = "1";
    speedIndicatorTimer = setTimeout(() => {
      speedIndicatorElement.style.opacity = "0";
    }, 500);
  }

  function updateSpeedButtonHighlight(rate) {
    const buttons = document.querySelectorAll(".speed-control-button");
    buttons.forEach((button) => button.classList.remove("active"));
    const activeButton = document.querySelector(`.speed-control-button[data-speed="${rate}"]`);
    if (activeButton) activeButton.classList.add("active");
  }

  function createSpeedButtons(panelCallback, btnClickCallback) {
    if (document.querySelector("#speedButtons")) {
      return;
    }

    const speedListDiv = document.createElement("div");
    speedListDiv.id = "speedButtons";
    const isYoutube = window.location.href.includes("youtube.com");
    speedListDiv.classList.add(isYoutube ? "youtube" : "bilibili");

    const buttonSpeeds = getButtonSpeeds();
    for (let i = 0; i < buttonSpeeds.length; i++) {
      const btn = document.createElement("button");
      btn.className = "speed-control-button";
      if (isYoutube) {
        btn.classList.add("youtube");
      } else {
        btn.classList.add("bilibili");
      }
      btn.dataset.speed = buttonSpeeds[i];
      btn.textContent = buttonSpeeds[i] + "×";
      btn.addEventListener("click", () => {
        btnClickCallback(buttonSpeeds[i]);
      });
      speedListDiv.appendChild(btn);
    }
    panelCallback(speedListDiv);
  }

  function setPlaybackRate(rate) {
    const video = getVideoElement();
    if (!video) return;
    video.playbackRate = parseFloat(rate);
    updateSpeedButtonHighlight(rate);
    showSpeedIndicator(rate);
  }

  let shortcutHandler = null;

  function handleKeydown(event) {
    const target = event.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }
    const video = getVideoElement();
    if (!video) {
      return;
    }
    const currentRate = video.playbackRate;
    const shortcutSpeeds = getShortcutSpeeds();
    let currentIndex = shortcutSpeeds.findIndex((speed) => parseFloat(speed) === currentRate);
    if (currentIndex === -1) {
      const closest = shortcutSpeeds.reduce((prev, curr) => {
        return Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev;
      });
      currentIndex = shortcutSpeeds.indexOf(closest);
    }
    let newIndex = currentIndex;
    if (event.code === "Comma") {
      if (currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
    } else if (event.code === "Period") {
      if (currentIndex < shortcutSpeeds.length - 1) {
        newIndex = currentIndex + 1;
      }
    } else {
      return;
    }
    setPlaybackRate(shortcutSpeeds[newIndex]);
  }

  function initShortcuts() {
    if (shortcutHandler) return;
    shortcutHandler = handleKeydown;
    document.addEventListener("keydown", shortcutHandler);
  }

  function isYoutubePage(url) {
    return url.includes("youtube.com/");
  }

  function isYoutubeWatchPage(url) {
    return url.includes("youtube.com/watch");
  }

  function isBilibiliVideoPage(url) {
    return url.includes("bilibili.com/video") || url.includes("bilibili.com/bangumi/play");
  }

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
  function definePlatformAdapter(adapter) {
    const missing = REQUIRED_KEYS.filter((key) => !(key in adapter));
    if (missing.length > 0) {
      throw new Error(`PlatformAdapter missing keys: ${missing.join(', ')}`);
    }
    return Object.freeze({ ...adapter });
  }

  function getEnabledRemovalItems(removalItems) {
    const settingPanelItems = getSettingPanelItems();
    const enabledItems = [];
    for (const key in removalItems) {
      const itemConfig = settingPanelItems[key];
      if (!itemConfig) continue;
      if (gm.getValue(itemConfig.enableKey, false)) {
        enabledItems.push(removalItems[key]);
      }
    }
    return enabledItems;
  }

  function initYouTubeElementRemover(removalItems) {
    const enabledItems = getEnabledRemovalItems(removalItems);
    for (const item of enabledItems) {
      waitElement(item.selector).then((element) => {
        if (item.mode === "hide") {
          element.style.width = "0";
          element.style.overflow = "hidden";
          element.style.flexShrink = "0";
        } else {
          element.remove();
        }
      });
    }
  }

  const INTERVAL_YOUTUBE_LIVE_STREAM_CHECK = 1000;
  const INTERVAL_YOUTUBE_AD_CHECK = 200;

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

  const youtubeRemovalItems = {
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

  const youtubeState = {
    liveStreamStatus: false,
    fallbackRate: null,
    adDetected: false,
    adCheckInterval: null,
    liveStreamCheck: null,
    isPageProcessing: false
  };

  const youtubeHandlers = {
    // theaterMode() {
    //   waitElement(youtubeSelectors.theaterMode).then((item) => {
    //     item.click();
    //   });
    // },
    initListeners() {
      const settingPanelItems = getSettingPanelItems();
      if (youtubeState.fallbackRate === null) {
        const item = settingPanelItems.Youtube_Action_Rate;
        youtubeState.fallbackRate = parseFloat(
          gm.getValue(item?.valueKey, getDefaultSpeed())
        );
      }
      window.addEventListener(youtubeSelectors.finishListener, () => handleYoutubePage());
      youtubeState.liveStreamCheck = setInterval(() => {
        const element = document.querySelector(youtubeSelectors.liveStreamIcon);
        const isLive = element && element.classList.contains(youtubeSelectors.liveStreamClass);
        const isWatchPage = isYoutubeWatchPage(window.location.href);
        if (isWatchPage) {
          if (isLive && !youtubeState.liveStreamStatus) {
            setPlaybackRate(1);
            youtubeState.liveStreamStatus = true;
          } else if (!isLive && youtubeState.liveStreamStatus) {
            setPlaybackRate(youtubeState.fallbackRate);
            youtubeState.liveStreamStatus = false;
          }
        }
      }, INTERVAL_YOUTUBE_LIVE_STREAM_CHECK);
      youtubeState.adCheckInterval = setInterval(() => {
        const adOverlay = document.querySelector(youtubeSelectors.adSelector);
        const video = getVideoElement();
        if (adOverlay && !youtubeState.adDetected && video) {
          setPlaybackRate(1);
          youtubeState.adDetected = true;
        } else if (!adOverlay && youtubeState.adDetected && video) {
          setPlaybackRate(youtubeState.fallbackRate);
          youtubeState.adDetected = false;
        }
      }, INTERVAL_YOUTUBE_AD_CHECK);
    }
  };

  function cleanupYoutube() {
    if (youtubeState.liveStreamCheck !== null) {
      clearInterval(youtubeState.liveStreamCheck);
      youtubeState.liveStreamCheck = null;
    }
    if (youtubeState.adCheckInterval !== null) {
      clearInterval(youtubeState.adCheckInterval);
      youtubeState.adCheckInterval = null;
    }
    youtubeState.adDetected = false;
  }

  async function handleYoutubePage() {
    if (youtubeState.isPageProcessing) return;
    youtubeState.isPageProcessing = true;
    const settingPanelItems = getSettingPanelItems();

    try {
      let videoPanel = await waitElement(youtubeSelectors.videoPanel);
      createSpeedButtons(
        (moreSpeedsDiv) => {
          videoPanel.before(moreSpeedsDiv);
          const video = getVideoElement();
          if (video) {
            updateSpeedButtonHighlight(video.playbackRate.toString());
          }
        },
        setPlaybackRate
      );
    } catch (error) {
      console.error("Failed create speed button elements:", error);
    }

    const autoRateEnabled = gm.getValue(settingPanelItems.Youtube_Action_Rate?.enableKey, false);
    if (autoRateEnabled) {
      const adOverlay = document.querySelector(youtubeSelectors.adSelector);
      if (!adOverlay) {
        const rate = parseFloat(gm.getValue(settingPanelItems.Youtube_Action_Rate?.valueKey, getDefaultSpeed()));
        setPlaybackRate(rate);
        youtubeState.liveStreamStatus = false;
      }
    }

    youtubeState.isPageProcessing = false;
  }

  const youtubeAdapter = definePlatformAdapter({
    id: 'youtube',
    matches: (url) => isYoutubePage(url),
    isWatchPage: (url) => isYoutubeWatchPage(url),
    init: () => youtubeHandlers.initListeners(),
    onPage: () => {
      handleYoutubePage();
      initYouTubeElementRemover(youtubeRemovalItems);
    },
    cleanup: cleanupYoutube,
  });

  const BILIBILI_REMOVAL_INTERVAL = 1000;

  function initBilibiliElementRemover(removalItems, bilibiliSelectors) {
    const enabledItems = getEnabledRemovalItems(removalItems);
    return setInterval(() => {
      const playerEl = document.querySelector(bilibiliSelectors.playerContainer);
      if (!playerEl) return;
      const isWebFullScreen = playerEl.classList.contains(bilibiliSelectors.webscreenClass);
      for (const item of enabledItems) {
        const element = document.querySelector(item.selector);
        if (!element) continue;
        if (item.mode === "remove") {
          element.remove();
        } else {
          if (isWebFullScreen) {
            element.style.width = "0";
          } else {
            element.style.width = "";
          }
        }
      }
    }, BILIBILI_REMOVAL_INTERVAL);
  }

  const AUTO_CLOSE_LOGIN_WINDOW_INTERVAL = 1000;

  function initAutoCloseLoginWindowGuard(closeBtnSelector, onDialogClosed) {
    return setInterval(() => {
      const closeBtn = document.querySelector(closeBtnSelector);
      if (!closeBtn) return;
      closeBtn.click();
      const video = getVideoElement();
      if (video && video.paused) {
        video.play().catch(() => {});
      }
      if (onDialogClosed) {
        onDialogClosed();
      }
    }, AUTO_CLOSE_LOGIN_WINDOW_INTERVAL);
  }

  const BILIBILI_RATE_RETRY_DELAY = 500;

  const BILIBILI_WEB_FULLSCREEN_GESTURE_WINDOW = 1000;

  const bilibiliSelectors = {
    playerContainer: "#bilibili-player",
    webscreenClass: "mode-webscreen",
    videoPanel: ".bpx-player-container",
    commentsPanel: ".bpx-player-sending-bar",
    webFullBtn: ".bpx-player-ctrl-web",
    fullScreenBtn: ".bpx-player-ctrl-full",
    pipBtn: ".bpx-player-ctrl-pip",
    speedsListBtn: ".bpx-player-ctrl-playbackrate",
    LoginWindowCloseBtn: ".bili-mini-close-icon",
    speedBtnPostionTarget: ".bpx-player-control-bottom-right"
  };

  const bilibiliRemovalItems = {
    Bilibili_Remove_Pip: {
      selector: bilibiliSelectors.pipBtn,
      mode: "remove"
    },
    Bilibili_Remove_Speed: {
      selector: bilibiliSelectors.speedsListBtn,
      mode: "remove"
    },
    Bilibili_Remove_Comments: {
      selector: bilibiliSelectors.commentsPanel,
      mode: "remove"
    }
  };

  const bilibiliState = {
    removalInterval: null,
    autoCloseLoginWindowInterval: null,
    urlObserver: null,
    lastUrl: '',
    displayMode: 'normal',
    desiredMode: 'normal',
    lastUserGesture: 0,
    webFullscreenObserver: null,
    gestureListenersRegistered: false,
    removeGestureListeners: null
  };

  function markUserGesture() {
    bilibiliState.lastUserGesture = Date.now();
  }

  function getDisplayMode() {
    if (document.fullscreenElement) return 'fullscreen';
    const container = document.querySelector(bilibiliSelectors.videoPanel);
    const screen = container ? container.getAttribute('data-screen') : null;
    if (screen === 'web') return 'web-fullscreen';
    if (screen === 'full') return 'fullscreen';
    return 'normal';
  }

  function updateDisplayMode() {
    const mode = getDisplayMode();
    if (mode === bilibiliState.displayMode) return;
    bilibiliState.displayMode = mode;
    if (mode === 'normal') {
      if (Date.now() - bilibiliState.lastUserGesture < BILIBILI_WEB_FULLSCREEN_GESTURE_WINDOW) {
        bilibiliState.desiredMode = 'normal';
      }
      return;
    }
    bilibiliState.desiredMode = mode;
    bilibiliState.lastUserGesture = 0;
  }

  function markUserExitMode() {
    const mode = getDisplayMode();
    if (mode === 'web-fullscreen' || mode === 'fullscreen') {
      bilibiliState.desiredMode = 'normal';
    }
  }

  function onFullscreenControlKeydown(e) {
    markUserGesture();
    if (e.key === 'Escape' || e.key === 'Esc' || e.key === 'f' || e.key === 'F') {
      markUserExitMode();
    }
  }

  function onFullscreenControlClick(e) {
    const mode = getDisplayMode();
    if (
      (mode === 'fullscreen' && e.target.closest?.(bilibiliSelectors.fullScreenBtn)) ||
      (mode === 'web-fullscreen' && e.target.closest?.(bilibiliSelectors.webFullBtn))
    ) {
      markUserExitMode();
    }
  }

  function ensureDisplayModeListeners() {
    if (bilibiliState.gestureListenersRegistered) return;
    window.addEventListener('pointerdown', markUserGesture, true);
    window.addEventListener('keydown', onFullscreenControlKeydown, true);
    document.addEventListener('click', onFullscreenControlClick, true);
    document.addEventListener('fullscreenchange', updateDisplayMode);
    bilibiliState.removeGestureListeners = () => {
      window.removeEventListener('pointerdown', markUserGesture, true);
      window.removeEventListener('keydown', onFullscreenControlKeydown, true);
      document.removeEventListener('click', onFullscreenControlClick, true);
      document.removeEventListener('fullscreenchange', updateDisplayMode);
    };
    bilibiliState.gestureListenersRegistered = true;
  }

  function removeDisplayModeListeners() {
    if (bilibiliState.gestureListenersRegistered) {
      bilibiliState.removeGestureListeners?.();
      bilibiliState.removeGestureListeners = null;
      bilibiliState.gestureListenersRegistered = false;
    }
  }

  function setupDisplayModeTracking() {
    if (bilibiliState.webFullscreenObserver) {
      bilibiliState.webFullscreenObserver.disconnect();
      bilibiliState.webFullscreenObserver = null;
    }
    bilibiliState.displayMode = getDisplayMode();
    bilibiliState.desiredMode = bilibiliState.displayMode;
    waitElement(bilibiliSelectors.videoPanel).then((container) => {
      if (bilibiliState.webFullscreenObserver) return;
      updateDisplayMode();
      const observer = new MutationObserver(updateDisplayMode);
      observer.observe(container, { attributes: true, attributeFilter: ['data-screen'] });
      bilibiliState.webFullscreenObserver = observer;
    }).catch(() => {});
  }

  const bilibiliHandlers = {
    webFullscreen() {
      waitElement(bilibiliSelectors.videoPanel).then(() => {
        if (getDisplayMode() === 'web-fullscreen') return;
        waitElement(bilibiliSelectors.webFullBtn).then((item) => {
          item.click();
        });
      });
    },
    enterFullscreen() {
      waitElement(bilibiliSelectors.videoPanel).then(() => {
        if (getDisplayMode() === 'fullscreen') return;
        waitElement(bilibiliSelectors.fullScreenBtn).then((item) => {
          item.click();
        });
      });
    },
    initUrlObserver(callback) {
      bilibiliState.lastUrl = location.href;
      bilibiliState.urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== bilibiliState.lastUrl) {
          bilibiliState.lastUrl = url;
          if (isBilibiliVideoPage(url)) {
            callback();
          }
        }
      });
      bilibiliState.urlObserver.observe(document, { subtree: true, childList: true });
    },
    startRemoval() {
      if (bilibiliState.removalInterval !== null) {
        clearInterval(bilibiliState.removalInterval);
        bilibiliState.removalInterval = null;
      }
      bilibiliState.removalInterval = initBilibiliElementRemover(bilibiliRemovalItems, bilibiliSelectors);
    },
    startAutoCloseLoginWindowGuard() {
      const settingPanelItems = getSettingPanelItems();
      if (bilibiliState.autoCloseLoginWindowInterval !== null) {
        clearInterval(bilibiliState.autoCloseLoginWindowInterval);
        bilibiliState.autoCloseLoginWindowInterval = null;
      }
      if (gm.getValue(settingPanelItems.Bilibili_Action_AutoCloseLoginWindow?.enableKey, false)) {
        bilibiliState.autoCloseLoginWindowInterval = initAutoCloseLoginWindowGuard(
          bilibiliSelectors.LoginWindowCloseBtn,
          () => {
            if (bilibiliState.desiredMode === 'web-fullscreen') {
              bilibiliHandlers.webFullscreen();
            } else if (bilibiliState.desiredMode === 'fullscreen') {
              bilibiliHandlers.enterFullscreen();
            }
          }
        );
      }
    }
  };

  function cleanupBilibili() {
    if (bilibiliState.removalInterval !== null) {
      clearInterval(bilibiliState.removalInterval);
      bilibiliState.removalInterval = null;
    }
    if (bilibiliState.autoCloseLoginWindowInterval !== null) {
      clearInterval(bilibiliState.autoCloseLoginWindowInterval);
      bilibiliState.autoCloseLoginWindowInterval = null;
    }
    if (bilibiliState.urlObserver !== null) {
      bilibiliState.urlObserver.disconnect();
      bilibiliState.urlObserver = null;
    }
    if (bilibiliState.webFullscreenObserver !== null) {
      bilibiliState.webFullscreenObserver.disconnect();
      bilibiliState.webFullscreenObserver = null;
    }
    removeDisplayModeListeners();
    bilibiliState.displayMode = 'normal';
    bilibiliState.desiredMode = 'normal';
  }

  function handleBilibiliPage() {
    const settingPanelItems = getSettingPanelItems();

    waitElement(bilibiliSelectors.speedBtnPostionTarget).then((targetContainer) => {
      if (targetContainer) {
        createSpeedButtons((moreSpeedsDiv) => {
          if (targetContainer.firstChild) {
            targetContainer.insertBefore(moreSpeedsDiv, targetContainer.firstChild);
          } else {
            targetContainer.appendChild(moreSpeedsDiv);
          }
          const video = getVideoElement();
          if (video) {
            updateSpeedButtonHighlight(video.playbackRate.toString());
          }
        }, setPlaybackRate);
      }
    });

    const autoRateEnabled = gm.getValue(settingPanelItems.Bilibili_Action_Rate?.enableKey, false);
    if (autoRateEnabled) {
      const rate = parseFloat(gm.getValue(settingPanelItems.Bilibili_Action_Rate?.valueKey, getDefaultSpeed()));
      let retryCount = 0;
      const setRateWithRetry = () => {
        const video = getVideoElement();
        if (video) {
          setPlaybackRate(rate);
        } else {
          retryCount++;
          setTimeout(setRateWithRetry, BILIBILI_RATE_RETRY_DELAY);
          if (retryCount % 10 === 0) {
            console.log(`[等待] 视频元素加载中... (已尝试${retryCount}次)`);
          }
        }
      };
      setRateWithRetry();
    }
  }

  const bilibiliAdapter = definePlatformAdapter({
    id: 'bilibili',
    matches: (url) => isBilibiliVideoPage(url),
    isWatchPage: (url) => isBilibiliVideoPage(url),
    init: (onPageChange) => bilibiliHandlers.initUrlObserver(onPageChange),
    onPage: () => {
      handleBilibiliPage();
      const settingPanelItems = getSettingPanelItems();
      if (gm.getValue(settingPanelItems.Bilibili_Action_WebFullscreen?.enableKey, false)) {
        bilibiliHandlers.webFullscreen();
      }
      bilibiliHandlers.startRemoval();
      bilibiliHandlers.startAutoCloseLoginWindowGuard();
      ensureDisplayModeListeners();
      setupDisplayModeTracking();
    },
    cleanup: cleanupBilibili,
  });

  const adapters = [youtubeAdapter, bilibiliAdapter];

  const sys = {
    initialized: false,
    isMainRunning: false,
    currentLang: 'en'
  };

  function logSection(msg) {
    console.log(`========== ${msg} ==========`);
  }

  function getAdapter(url) {
    return adapters.find((adapter) => adapter.matches(url)) || null;
  }

  function main() {
    if (sys.isMainRunning) return;
    sys.isMainRunning = true;
    logSection("main 开始执行");
    const url = window.location.href;

    if (!sys.initialized) {
      sys.currentLang = detectLanguage();
      initSettings(url);

      logSection("执行一次性初始化");
      injectStyles();
      gm.registerMenuCommand(t("Menu_Settings", sys.currentLang), togglePanel);
      initShortcuts();

      const adapter = getAdapter(url);
      if (adapter) {
        adapter.init(() => main());
      }

      const isFirstRun = gm.getValue("firstRunComplete", false);
      if (!isFirstRun) {
        gm.setValue("firstRunComplete", true);
        setTimeout(() => togglePanel(), 500);
      }

      sys.initialized = true;
      logSection("一次性初始化完成");
    }

    const adapter = getAdapter(url);
    if (adapter && adapter.isWatchPage(url)) {
      adapter.onPage();
    }

    logSection("main 执行完毕");
    sys.isMainRunning = false;
  }

  const cleanup = () => {
    adapters.forEach((adapter) => adapter.cleanup());
  };

  window.addEventListener("beforeunload", cleanup);
  main();

})();
