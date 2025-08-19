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
    const speeds = [0.5, 1.0, 1.5, 2.0];
    const colors = ['#072525', '#287F54', '#C22544'];

    const i18nConfig = {
        // 中文配置
        zh: {
            menu_settings: "设置面板",
            menu_save: "保存",
            menu_close: "关闭",
            ///////
            Youtube_AutoTheaterMode: "Youtube - 自动视频网页全屏",
            Youtube_AutoRate2x: "Youtube - 自动2倍速播放",
            Youtube_AutoRemoveMiniplayer: "Youtube - 自动移除MiniPlayer按钮",
            //////
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
            ///////
            Youtube_AutoTheaterMode: "Youtube - Auto Theater Mode",
            Youtube_AutoRate2x: "Youtube - Auto 2x Playback",
            Youtube_AutoRemoveMiniplayer: "Youtube - Auto Remove MiniPlayer Button",
            //////
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

    // YouTube selectors listeners
    const youtubeSelector = {
        youtubeVideoPanelSelector: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls',
        youtubeLiveStreamSelector: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button', // Youtube Live Stream check
        youtubeMiniPlayerSelector: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-miniplayer-button.ytp-button',
        youtubeListenerFinish: 'yt-navigate-finish',
        youtubeLiveClass: 'ytp-live-badge-is-livehead',
    }

    /// Bilibili selectors
    const bilibiliSelectors = {
        bilibiliPlayerContainerSelector: '#bilibili-player',
        bilibiliWebFullClass: 'mode-webscreen',
        bilibiliBtnSelector: '.bpx-player-control-bottom-left',
        bilibiliVideoPanelSelector: '.bilibili-player, .bpx-player-container, #bilibiliPlayer',
        bilibiliCommentsSelector: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-center',
        webFullBtnSelector: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web',
        removePipSelector: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-pip',
        removeWideSelector: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-wide',
        speedListSelector: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate',
        removeSettingsSelector: '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-setting',

    }

    let currentLang = 'en';

    let settingPanelElement = null;
    let settingPanelInitialized = false;
    let settingPanelItems = [];
    let initSpeedBtnFlag = false;
    let currentUrl = window.location.href;

    // 通用工具函数 (common)
    const Common = {
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
            return i18nConfig[currentLang][key];
        },
        initializePanel: function () {
            if (settingPanelInitialized) { return; }

            if (document.querySelector("#minimalSettingsPanel")) { return; }
            const panel = document.createElement("div");
            panel.id = "minimalSettingsPanel";

            // 将面板添加到文档中
            const title = document.createElement("h2");
            title.textContent = Common.geti18nText("menu_settings");
            panel.appendChild(title);

            for (const [key, item] of Object.entries(settingPanelItems)) {
                const functionDiv = document.createElement("div");
                functionDiv.className = "setting-item";
                panel.appendChild(functionDiv);

                const functionValue = GM_getValue(item.dataKey, false);

                const input1 = document.createElement("input");
                input1.type = "checkbox";
                input1.checked = functionValue;
                input1.id = item.classId;
                functionDiv.appendChild(input1);

                const label1 = document.createElement("label");
                label1.setAttribute("for", item.classId);
                label1.textContent = item.text;
                functionDiv.appendChild(label1);
            }

            // 添加按钮
            const buttons = document.createElement("div");
            buttons.className = "buttons";
            const saveBtn = document.createElement("button");
            saveBtn.id = "saveBtn";
            saveBtn.textContent = Common.geti18nText("menu_save");
            saveBtn.addEventListener("click", Common.saveSettings);
            const closeBtn = document.createElement("button");
            closeBtn.id = "closeBtn";
            closeBtn.textContent = Common.geti18nText("menu_close");
            closeBtn.addEventListener("click", Common.togglePanel);
            buttons.appendChild(saveBtn);
            buttons.appendChild(closeBtn);
            panel.appendChild(buttons);

            document.body.appendChild(panel);

            settingPanelElement = panel;

            settingPanelInitialized = true;
        },
        saveSettings: function () {
            for (const [key, item] of Object.entries(settingPanelItems)) {
                const isChecked = document.getElementById(item.classId).checked;
                GM_setValue(item.dataKey, isChecked);
            }
            settingPanelElement.classList.toggle('show');
        },
        togglePanel: function () {
            if (!settingPanelInitialized) {
                Common.initializePanel();
            }
            settingPanelElement.classList.toggle('show');
        },
        initSettingItems: function () {
            if (currentUrl.includes("youtube.com")) {
                settingPanelItems = {
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
                settingPanelItems = {
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
            if (initSpeedBtnFlag) {
                return;
            }

            let bgColor = colors[0];
            let speedListDiv = document.createElement('div');
            speedListDiv.id = 'speedButtons';
            // 核心代码: 设置父容器为 Flexbox 布局
            speedListDiv.style.display = 'flex';
            // speedListDiv.style.flexWrap = 'wrap'; // 允许换行，以防按钮太多
            speedListDiv.style.alignItems = 'center'; // 垂直居中对齐
            speedListDiv.style.justifyContent = 'center'; // 水平居中对齐
            speedListDiv.style.height = '100%'; // 设置高度以适应按钮
            for (let i = 0; i < speeds.length; i++) {

                if (speeds[i] >= 1) { bgColor = colors[1]; }
                if (speeds[i] >= 1.5) { bgColor = colors[2]; }

                let btn = document.createElement('button');
                btn.style.backgroundColor = bgColor;
                btn.style.marginRight = '1px';
                btn.style.border = '1px solid #D3D3D3';
                btn.style.borderRadius = '2px';
                btn.style.color = '#ffffff';
                btn.style.cursor = 'pointer';
                btn.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';

                // 核心代码: 使用 Flexbox 布局
                btn.style.display = 'flex';
                btn.style.justifyContent = 'center'; // 水平居中
                btn.style.alignItems = 'center';     // 垂直居中

                btn.style.width = '38px';
                btn.style.height = '24px';
                btn.style.fontSize = '14px';

                btn.textContent = speeds[i].toString() + '×';

                btn.addEventListener('click', () => {
                    document.getElementsByTagName('video')[0].playbackRate = speeds[i]
                });
                speedListDiv.appendChild(btn);
            }

            callback(speedListDiv);

            initSpeedBtnFlag = true;
        },
        waitForElement: function (selector, callback, interval = 200) {
            let attempts = 0;

            const options = {
                interval: interval,
                maxAttempts: -1
            };

            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function.');
            }

            const checkProcess = () => {
                let element = null;

                if (typeof selector === 'string') {
                    element = document.querySelector(selector);
                } else {
                    throw new TypeError('selector must be a string.');
                }

                // 如果元素存在
                if (element) {
                    callback(element);
                    return;
                }

                attempts++;
                if (options.maxAttempts !== -1 && attempts >= options.maxAttempts) {
                    console.error(`Common.waitForElement: Reached max attempts (${options.maxAttempts}), element not found.`);
                    return;
                }
                // 元素不存在或不包含指定类名，等待一段时间后再次检测
                setTimeout(checkProcess, options.interval);
            };

            // 第一次立即检测
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
        youtube: function () {
            if (document.body && !initSpeedBtnFlag) {
                // 监听 YouTube 页面导航完成事件
                window.addEventListener(youtubeSelector.youtubeListenerFinish, function () {
                    // 直播状态检测
                    setInterval(() => {
                        let element = document.querySelector(youtubeSelector.youtubeLiveStreamSelector);
                        if (element) {
                            if (element.classList.contains(youtubeSelector.youtubeLiveClass)) {
                                document.getElementsByTagName('video')[0].playbackRate = 1.0;
                                console.log('已检测到直播，重置播放速度为1.0');
                            }
                        }
                    }, 1000);

                    // 创建速度按钮
                    Common.waitForElement(
                        youtubeSelector.youtubeVideoPanelSelector,
                        (item) => {
                            Common.createSpeedButtons(youtubeSelector.youtubeVideoPanelSelector, (moreSpeedsDiv) => {
                                item.before(moreSpeedsDiv);
                            });
                        }
                    );

                    // 自动2倍速播放
                    let autoRate2x = GM_getValue(settingPanelItems.Youtube_AutoRate2x.dataKey, false);
                    if (autoRate2x) {
                        Common.waitForElement(
                            youtubeSelector.youtubeVideoPanelSelector,
                            (item) => {
                                Common.setPlaybackRate(2.0);
                            }
                        );
                    }

                    // 自动移除 MiniPlayer 按钮
                    let removeMiniplayer = GM_getValue(settingPanelItems.Youtube_AutoRemoveMiniplayer.dataKey, false);
                    if (removeMiniplayer) {
                        // 删除 MiniPlayer 按钮
                        Common.waitForElement(
                            youtubeSelector.youtubeMiniPlayerSelector,
                            (item) => {
                                item.remove();
                            }
                        );
                    }

                    // 无法监听事件，待开发
                    // let autoTheaterMode = GM_getValue(SettingsItems.Youtube_AutoTheaterMode.dataKey, false);
                    // if (autoTheaterMode) {
                    //     let theaterButton = document.querySelector(youtubeTheaterModeSelector);
                    //     if (theaterButton) {
                    //         //
                    //         Common.waitForElement(
                    //             '#movie_player > div.html5-video-container',
                    //             (theaterButton) => { // ✅ 正确：使用 Common.waitForElement 传递的最新元素
                    //                 if (theaterButton.getAttribute("data-title-no-tooltip") == youtubeTheaterModeDataTitleNoTooltipDefault) {
                    //                     // 如果是，则模拟按下 'T' 键来切换到网页全屏
                    //                     dispatchKeyboardEvent(document.body, 't');
                    //                 }
                    //             },
                    //             null,
                    //             theaterButton
                    //         );
                    //     }
                    // }
                });
            }
        },
        bilibili: function () {
            // 创建速度按钮
            Common.waitForElement(
                bilibiliSelectors.bilibiliVideoPanelSelector,
                (item) => {
                    Common.createSpeedButtons(bilibiliSelectors.bilibiliVideoPanelSelector, (moreSpeedsDiv) => {
                        let ele = document.querySelector(bilibiliSelectors.bilibiliBtnSelector);
                        if (ele) {
                            ele.after(moreSpeedsDiv);
                        }
                    });
                }, 1000
            );

            // 删除评论框
            let autoRemoveComments = GM_getValue(settingPanelItems.Bilibili_AutoRemoveComments.dataKey, false);
            if (autoRemoveComments) {
                Common.removeSelector(bilibiliSelectors.bilibiliCommentsSelector);
            }

            // 全屏
            let autoWebFullscreen = GM_getValue(settingPanelItems.Bilibili_AutoWebFullscreen.dataKey, false);
            if (autoWebFullscreen) {
                let playerContainerMode = document.querySelector(bilibiliSelectors.bilibiliPlayerContainerSelector);
                if (playerContainerMode.classList.contains(bilibiliSelectors.bilibiliWebFullClass)) {
                    return;
                }
                Common.waitForElement(
                    bilibiliSelectors.webFullBtnSelector,
                    (item) => {
                        item.click();
                    }, 1000
                );
            }

            // 删除画中画
            let autoRemovePip = GM_getValue(settingPanelItems.Bilibili_AutoRemovePip.dataKey, false);
            if (autoRemovePip) {
                Common.waitForElement(
                    bilibiliSelectors.removePipSelector,
                    (item) => {
                        item.remove();
                    }, 1000
                );
            }

            // 删除宽屏
            let autoRemoveWide = GM_getValue(settingPanelItems.Bilibili_AutoRemoveWide.dataKey, false);
            if (autoRemoveWide) {
                Common.waitForElement(
                    bilibiliSelectors.removeWideSelector,
                    (item) => {
                        item.remove();
                    }, 1000
                );
            }

            // 删除原始倍速
            let autoRemoveSpeed = GM_getValue(settingPanelItems.Bilibili_AutoRemoveSpeed.dataKey, false);
            if (autoRemoveSpeed) {
                Common.waitForElement(
                    bilibiliSelectors.speedListSelector,
                    (item) => {
                        item.remove();
                    }, 1000
                );
            }

            // 删除设置按钮
            let autoRemoveSettings = GM_getValue(settingPanelItems.Bilibili_AutoRemoveSettings.dataKey, false);
            if (autoRemoveSettings) {
                Common.waitForElement(
                    bilibiliSelectors.removeSettingsSelector,
                    (item) => {
                        item.remove();
                    }, 1000
                );
            }

            let autoRate2x = GM_getValue(settingPanelItems.Bilibili_AutoRate2x.dataKey, false);
            if (autoRate2x) {
                Common.setPlaybackRate(2.0);
            }
        }
    }

    function main() {
        // Initialize common functions
        currentLang = Common.detectLanguage();
        // Initialize setting panel items
        Common.initSettingItems();
        // Initialize the settings panel
        Common.initializePanel();

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
