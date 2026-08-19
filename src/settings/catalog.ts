import { i18n } from '../core/i18n-constants.js';

export interface SettingItem {
  classId: string
  text: string
  enableKey: string
  valueKey?: string
  recommended?: boolean
  type?: 'checkbox' | 'radio' | 'radio-inline' | 'display-mode'
  radioOptions?: RadioOption[]
  radioName?: string
}

export interface RadioOption {
  value: string
  text: string
}

function getText(key: string, lang: string): string {
  return i18n[lang]?.[key] || key;
}

export function buildCatalog(url: string, lang: string): Record<string, SettingItem> {
  if (url.includes("youtube.com")) {
    return {
      Youtube_Action_Rate: {
        classId: "Youtube_Action_Rate",
        text: getText("Youtube_Action_Rate", lang),
        enableKey: "Youtube_Action_Rate_Enabled",
        valueKey: "Youtube_Action_Rate_Value",
        recommended: true
      },
      Youtube_Action_TheaterMode: {
        classId: "Youtube_Action_TheaterMode",
        text: getText("Youtube_Action_TheaterMode", lang),
        enableKey: "Youtube_Action_TheaterMode",
        recommended: true
      },
      Youtube_Action_SkipAd: {
        classId: "Youtube_Action_SkipAd",
        text: getText("Youtube_Action_SkipAd", lang),
        enableKey: "Youtube_Action_SkipAd_Enabled"
      },
      Youtube_Remove_Autoplay: {
        classId: "Youtube_Remove_Autoplay",
        text: getText("Youtube_Remove_Autoplay", lang),
        enableKey: "Youtube_Remove_Autoplay"
      },
      Youtube_Remove_Subtitles: {
        classId: "Youtube_Remove_Subtitles",
        text: getText("Youtube_Remove_Subtitles", lang),
        enableKey: "Youtube_Remove_Subtitles"
      },
      Youtube_Remove_Settings: {
        classId: "Youtube_Remove_Settings",
        text: getText("Youtube_Remove_Settings", lang),
        enableKey: "Youtube_Remove_Settings"
      },
      Youtube_Remove_TheaterMode: {
        classId: "Youtube_Remove_TheaterMode",
        text: getText("Youtube_Remove_TheaterMode", lang),
        enableKey: "Youtube_Remove_TheaterMode"
      },
      Youtube_Remove_FullScreen: {
        classId: "Youtube_Remove_FullScreen",
        text: getText("Youtube_Remove_FullScreen", lang),
        enableKey: "Youtube_Remove_FullScreen"
      }
    };
  } else if (url.includes("bilibili.com")) {
    return {
      Bilibili_Action_Rate: {
        classId: "Bilibili_Action_Rate",
        text: getText("Bilibili_Action_Rate", lang),
        enableKey: "Bilibili_Action_Rate_Enabled",
        valueKey: "Bilibili_Action_Rate_Value",
        recommended: true
      },
      Bilibili_DisplayMode_Enabled: {
        classId: "Bilibili_DisplayMode_Enabled",
        text: getText("Bilibili_DisplayMode_Enabled", lang),
        enableKey: "Bilibili_DisplayMode_Enabled",
        recommended: true,
        type: "display-mode",
        radioOptions: [
          { value: "web-fullscreen", text: getText("Bilibili_DisplayMode_WebFullscreen", lang) },
          { value: "wide", text: getText("Bilibili_DisplayMode_Wide", lang) }
        ],
        radioName: "bilibiliDisplayMode"
      },
      Bilibili_Action_AutoCloseLoginWindow: {
        classId: "Bilibili_Action_AutoCloseLoginWindow",
        text: getText("Bilibili_Action_AutoCloseLoginWindow", lang),
        enableKey: "Bilibili_Action_AutoCloseLoginWindow"
      },
      Bilibili_Remove_Pip: {
        classId: "Bilibili_Remove_Pip",
        text: getText("Bilibili_Remove_Pip", lang),
        enableKey: "Bilibili_Remove_Pip"
      },
      Bilibili_Remove_Speed: {
        classId: "Bilibili_Remove_Speed",
        text: getText("Bilibili_Remove_Speed", lang),
        enableKey: "Bilibili_Remove_Speed"
      },
      Bilibili_Remove_Comments: {
        classId: "Bilibili_Remove_Comments",
        text: getText("Bilibili_Remove_Comments", lang),
        enableKey: "Bilibili_Remove_Comments"
      }
    };
  }
  return {};
}
