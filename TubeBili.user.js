// ==UserScript==
// @name              Youtube Bilibili Video Player Enhancer Tools
// @name:zh           油管哔哩哔哩视频播放器增强工具
// @name:zh-CN        油管哔哩哔哩视频播放器增强工具
// @name:en           Youtube Bilibili Video Player Enhancer Tools
// @name:en-US        Youtube Bilibili Video Player Enhancer Tools
// @description       Adds more speed buttons and more settings to YouTube and Bilibili video players.
// @description:en    Adds more speed buttons and more settings to YouTube and Bilibili video players.
// @description:en-US Adds more speed buttons and more settings to YouTube and Bilibili video players.
// @description:zh    油管哔哩哔哩视频播放器下添加更多倍速播放按钮及更多配置。
// @description:zh-CN 油管哔哩哔哩视频播放器下添加更多倍速播放按钮及更多配置。
// @namespace         com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @version           1.0.3
// @author            julong@111.com
// @homepage          https://github.com/julong111/tampermonkey-TubeBili
// @supportURL        https://github.com/julong111/tampermonkey-TubeBili/issues

// @match             *://*.youtube.com*
// @match             *://*.bilibili.com*
// @include           *://*.youtube.com*
// @include           *://*.bilibili.com*

// @grant             GM_addStyle
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @icon              https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @charset		      UTF-8
// @license           MIT
// ==/UserScript==

(function () {
    'use strict';
    const i18nConfig = {
        // 中文配置
        zh: {
            menu_settings: "设置面板",
            menu_save: "保存",
            menu_close: "关闭",

            Youtube_AutoTheaterMode: "Youtube - 自动视频网页全屏",
            Youtube_AutoRate2x: "Youtube - 自动2倍速播放",
            Youtube_AutoRemoveMiniplayer: "Youtube - 自动移除MiniPlayer按钮",

            Bilibili_AutoWebFullscreen: "Bilibili - 自动视频网页全屏",
            Bilibili_AutoRate2x: "Bilibili - 自动2倍速播放",
            Bilibili_AutoRemovePip: "Bilibili - 自动移除画中画按钮",
            Bilibili_AutoRemoveWide: "Bilibili - 自动移除宽屏按钮",
            Bilibili_AutoRemoveSpeed: "Bilibili - 自动移除原始倍速按钮",
            Bilibili_AutoRemoveComments: "Bilibili - 自动移除评论输入区",
            Bilibili_AutoRemoveSettings: "Bilibili - 自动移除设置按钮",
        },
        // 英文配置
        en: {
            menu_settings: "Settings Panel",
            menu_save: "Save",
            menu_close: "Close",

            Youtube_AutoTheaterMode: "Youtube - Auto Theater Mode",
            Youtube_AutoRate2x: "Youtube - Auto 2x Playback",
            Youtube_AutoRemoveMiniplayer: "Youtube - Auto Remove MiniPlayer Button",

            Bilibili_AutoWebFullscreen: "Bilibili - Auto Web Fullscreen",
            Bilibili_AutoRate2x: "Bilibili - Auto 2x Playback",
            Bilibili_AutoRemovePip: "Bilibili - Auto Remove Picture-in-Picture Button",
            Bilibili_AutoRemoveWide: "Bilibili - Auto Remove Wide Button",
            Bilibili_AutoRemoveSpeed: "Bilibili - Auto Remove Original Speed Button",
            Bilibili_AutoRemoveComments: "Bilibili - Auto Remove Comments Input Area",
            Bilibili_AutoRemoveSettings: "Bilibili - Auto Remove Settings Button",
        }
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
        }`;

    let isYoutubeListenerRegistered = false;
    let youtubeLiveStreamCheck = null;

    const Common = {
        speeds: [0.5, 1.0, 1.5, 2.0],
        colors: ['#072525', '#287F54', '#C22544'],
        currentLang: 'en',
        settingPanelItems: [],
        initSpeedBtnFlag: false,
        settingPanelInitialized: false,
        settingPanelElement: null,
        detectLanguage: function () {
            let userLang = navigator.language.toLowerCase();
            if (userLang.startsWith('zh')) {
                return 'zh';
            }
            if (userLang.startsWith('en')) {
                return 'en';
            }
            return 'en';
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
                let functionValue = GM_getValue(item.dataKey, false);
                let input1 = document.createElement("input");
                input1.type = "checkbox";
                input1.checked = functionValue;
                input1.id = item.classId;
                functionDiv.appendChild(input1);
                let label1 = document.createElement("label");
                label1.setAttribute("for", item.classId);
                label1.textContent = item.text;
                functionDiv.appendChild(label1);
            }
            let buttons = document.createElement("div");
            buttons.className = "buttons";
            let saveBtn = document.createElement("button");
            saveBtn.id = "saveBtn";
            saveBtn.textContent = Common.geti18nText("menu_save");
            saveBtn.addEventListener("click", () => {
                Common.saveSettings();
            });
            let closeBtn = document.createElement("button");
            closeBtn.id = "closeBtn";
            closeBtn.textContent = Common.geti18nText("menu_close");
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
                GM_setValue(item.dataKey, isChecked);
            }
            Common.settingPanelElement.classList.toggle('show');
        },
        togglePanel: function () {
            if (!Common.settingPanelInitialized) {
                Common.initializePanel();
            }
            Common.settingPanelElement.classList.toggle('show');
        },
        initSettingItems: function (currentUrl) {
            if (currentUrl.includes("youtube.com")) {
                Common.settingPanelItems = {
                    // Youtube_AutoTheaterMode: {
                    //     classId: "Youtube-AutoTheaterMode",
                    //     text: geti18nText("Youtube_AutoTheaterMode"),
                    //     dataKey: "Youtube-AutoTheaterMode",
                    // },
                    Youtube_AutoRate2x: {
                        classId: "Youtube-AutoRate2x",
                        text: Common.geti18nText("Youtube_AutoRate2x"),
                        dataKey: "Youtube-AutoRate2x",
                    },
                    Youtube_AutoRemoveMiniplayer: {
                        classId: "Youtube-AutoRemoveMiniplayer",
                        text: Common.geti18nText("Youtube_AutoRemoveMiniplayer"),
                        dataKey: "Youtube-AutoRemoveMiniplayer",
                    },
                };
            } else if (currentUrl.includes("bilibili.com")) {
                Common.settingPanelItems = {
                    Bilibili_AutoWebFullscreen: {
                        classId: "Bilibili-AutoWebFullscreen",
                        text: Common.geti18nText("Bilibili_AutoWebFullscreen"),
                        dataKey: "Bilibili-AutoWebFullscreen",
                    },
                    Bilibili_AutoRate2x: {
                        classId: "Bilibili-AutoRate2x",
                        text: Common.geti18nText("Bilibili_AutoRate2x"),
                        dataKey: "Bilibili-AutoRate2x",
                    },
                    Bilibili_AutoRemovePip: {
                        classId: "Bilibili-AutoRemovePip",
                        text: Common.geti18nText("Bilibili_AutoRemovePip"),
                        dataKey: "Bilibili-AutoRemovePip",
                    },
                    Bilibili_AutoRemoveWide: {
                        classId: "Bilibili-AutoRemoveWide",
                        text: Common.geti18nText("Bilibili_AutoRemoveWide"),
                        dataKey: "Bilibili-AutoRemoveWide",
                    },
                    Bilibili_AutoRemoveSpeed: {
                        classId: "Bilibili-AutoRemoveSpeed",
                        text: Common.geti18nText("Bilibili_AutoRemoveSpeed"),
                        dataKey: "Bilibili-AutoRemoveSpeed",
                    },
                    Bilibili_AutoRemoveComments: {
                        classId: "Bilibili-AutoRemoveComments",
                        text: Common.geti18nText("Bilibili_AutoRemoveComments"),
                        dataKey: "Bilibili-AutoRemoveComments",
                    },
                    Bilibili_AutoRemoveSettings: {
                        classId: "Bilibili-AutoRemoveSettings",
                        text: Common.geti18nText("Bilibili_AutoRemoveSettings"),
                        dataKey: "Bilibili-AutoRemoveSettings",
                    },
                };
            };
        },
        createSpeedButtons: function (selector, callback) {
            if (Common.initSpeedBtnFlag) {
                return;
            }
            let bgColor = Common.colors[0];
            let speedListDiv = document.createElement('div');
            speedListDiv.id = 'speedButtons';
            speedListDiv.style.display = 'flex';
            speedListDiv.style.alignItems = 'center';
            speedListDiv.style.justifyContent = 'center';
            speedListDiv.style.height = '100%';
            const handleButtonClick = (speed) => {
                document.getElementsByTagName('video')[0].playbackRate = speed;
            };
            for (let i = 0; i < Common.speeds.length; i++) {
                if (Common.speeds[i] >= 1) { bgColor = Common.colors[1]; }
                if (Common.speeds[i] >= 1.5) { bgColor = Common.colors[2]; }
                let btn = document.createElement('button');
                btn.style.backgroundColor = bgColor;
                btn.style.marginRight = '1px';
                btn.style.border = '1px solid #D3D3D3';
                btn.style.borderRadius = '2px';
                btn.style.color = '#ffffff';
                btn.style.cursor = 'pointer';
                btn.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
                btn.style.display = 'flex';
                btn.style.justifyContent = 'center';
                btn.style.alignItems = 'center';
                btn.style.width = '38px';
                btn.style.height = '24px';
                btn.style.fontSize = '14px';
                btn.textContent = Common.speeds[i].toString() + '×';
                btn.addEventListener('click', () => {
                    handleButtonClick(Common.speeds[i]);
                });
                speedListDiv.appendChild(btn);
            }
            callback(speedListDiv);
            Common.initSpeedBtnFlag = true;
        },
        waitForElement: function (selector, callback, interval = 200) {
            if (typeof selector !== 'string') {
                throw new TypeError('selector must be a string.');
            }
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function.');
            }
            let attempts = 0;
            const options = {
                interval: interval,
                maxAttempts: -1
            };
            const checkProcess = () => {
                let element = null;
                if (typeof selector === 'string') {
                    element = document.querySelector(selector);
                } else {
                    throw new TypeError('selector must be a string.');
                }
                if (element) {
                    callback(element);
                    return;
                }
                attempts++;
                if (options.maxAttempts !== -1 && attempts >= options.maxAttempts) {
                    console.error(`Common.waitForElement: Reached max attempts (${options.maxAttempts}), element not found.`);
                    return;
                }
                setTimeout(checkProcess, options.interval);
            };
            checkProcess();
        },
        removeSelector: function (selector) {
            let ele = document.querySelector(selector);
            if (ele) {
                ele.remove();
            }
        },
        setPlaybackRate: function (rate) {
            document.getElementsByTagName('video')[0].playbackRate = rate;
        }
    };
    const WebSite = {
        selectors: {
            youtube: {
                // YouTube selectors listeners
                videoPanel: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls',
                liveStreamIcon: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button', // Youtube Live Stream check
                miniPlayerBtn: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-miniplayer-button.ytp-button',
                finishListener: 'yt-navigate-finish',
                liveStreamClass: 'ytp-live-badge-is-livehead',
            },
            bilibili: {
                /// Bilibili selectors 
                playerContainer: '#bilibili-player',
                webFullClass: 'mode-webscreen',
                speedBtn: '.bpx-player-control-bottom-left',
                videoPanel: '.bilibili-player, .bpx-player-container, #bilibiliPlayer',
                commentsPanel: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-center',
                webFullBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web',
                pipBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-pip',
                wideBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-wide',
                speedsListBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate',
                settingsBtn: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-setting',
            }
        },
        youtube: function () {
            const handleYoutubePage = () => {
                if (!Common.initSpeedBtnFlag) {
                    // 创建速度按钮
                    Common.waitForElement(
                        WebSite.selectors.youtube.videoPanel,
                        (item) => {
                            Common.createSpeedButtons(WebSite.selectors.youtube.videoPanel, (moreSpeedsDiv) => {
                                item.before(moreSpeedsDiv);
                            });
                        }
                    );

                    let autoRate2x = GM_getValue(Common.settingPanelItems.Youtube_AutoRate2x.dataKey, false);
                    if (autoRate2x) {
                        Common.waitForElement(
                            WebSite.selectors.youtube.videoPanel,
                            (item) => {
                                Common.setPlaybackRate(2.0);
                            }
                        );
                    }

                    let removeMiniplayer = GM_getValue(Common.settingPanelItems.Youtube_AutoRemoveMiniplayer.dataKey, false);
                    if (removeMiniplayer) {
                        Common.waitForElement(
                            WebSite.selectors.youtube.miniPlayerBtn,
                            (item) => {
                                item.remove();
                            }
                        );
                    }

                    // TheaterMode无法监听事件，待开发 
                }
            };

            if (!isYoutubeListenerRegistered) {
                window.addEventListener(WebSite.selectors.youtube.finishListener, handleYoutubePage);
                isYoutubeListenerRegistered = true;
            }
            // 启动直播状态检测
            youtubeLiveStreamCheck = setInterval(() => {
                let element = document.querySelector(WebSite.selectors.youtube.liveStreamIcon);
                if (element) {
                    if (element.classList.contains(WebSite.selectors.youtube.liveStreamClass)) {
                        document.getElementsByTagName('video')[0].playbackRate = 1.0;
                        console.log('已检测到直播，重置播放速度为1.0');
                    }
                }
            }, 1000);
            handleYoutubePage();
        },
        bilibili: function () {
            const handleBilibiliPage = () => {
                // 清理旧的按钮，防止重复创建
                Common.removeSelector('#speedButtons');
                Common.initSpeedBtnFlag = false;

                // 创建速度按钮
                Common.waitForElement(
                    WebSite.selectors.bilibili.videoPanel,
                    (item) => {
                        Common.createSpeedButtons(WebSite.selectors.bilibili.videoPanel, (moreSpeedsDiv) => {
                            let ele = document.querySelector(WebSite.selectors.bilibili.speedBtn);
                            if (ele) {
                                ele.after(moreSpeedsDiv);
                            }
                        });
                    }, 1000
                );


                // 自动移除的元素
                const removalConfigs = {
                    Bilibili_AutoRemoveComments: WebSite.selectors.bilibili.commentsPanel,
                    Bilibili_AutoRemovePip: WebSite.selectors.bilibili.pipBtn,
                    Bilibili_AutoRemoveWide: WebSite.selectors.bilibili.wideBtn,
                    Bilibili_AutoRemoveSpeed: WebSite.selectors.bilibili.speedsListBtn,
                    Bilibili_AutoRemoveSettings: WebSite.selectors.bilibili.settingsBtn,
                };
                for (const key in removalConfigs) {
                    if (GM_getValue(Common.settingPanelItems[key].dataKey, false)) {
                        Common.waitForElement(
                            removalConfigs[key],
                            (item) => {
                                item.remove();
                            }, 1000
                        );
                    }
                }

                let autoRate2x = GM_getValue(Common.settingPanelItems.Bilibili_AutoRate2x.dataKey, false);
                if (autoRate2x) {
                    Common.setPlaybackRate(2.0);
                }

                let autoWebFullscreen = GM_getValue(Common.settingPanelItems.Bilibili_AutoWebFullscreen.dataKey, false);
                if (autoWebFullscreen) {
                    let playerContainerMode = document.querySelector(WebSite.selectors.bilibili.playerContainer);
                    if (playerContainerMode && playerContainerMode.classList.contains(WebSite.selectors.bilibili.webFullClass)) {
                        return;
                    }
                    Common.waitForElement(
                        WebSite.selectors.bilibili.webFullBtn,
                        (item) => {
                            item.click();
                        }, 1000
                    );
                }
            };

            const observerConfig = { childList: true, subtree: true };
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        const videoPlayer = document.querySelector(WebSite.selectors.bilibili.videoPanel);
                        if (videoPlayer) {
                            handleBilibiliPage();
                            observer.disconnect();
                        }
                    }
                }
            });
            observer.observe(document.body, observerConfig);
            handleBilibiliPage();
        }
    }

    function main() {
        // 每次页面加载时，都先清理所有可能存在的定时器
        if (youtubeLiveStreamCheck !== null) {
            clearInterval(youtubeLiveStreamCheck);
            youtubeLiveStreamCheck = null;
        }
        const currentUrl = window.location.href;
        Common.currentLang = Common.detectLanguage();
        Common.initSettingItems(currentUrl);
        GM_addStyle(settingPanelStyles);
        GM_registerMenuCommand(Common.geti18nText("menu_settings"), Common.togglePanel);

        if (currentUrl.includes("youtube.com")) {
            WebSite.youtube();
        } else if (currentUrl.includes("bilibili.com")) {
            WebSite.bilibili();
        }
    }
    main();
})();
