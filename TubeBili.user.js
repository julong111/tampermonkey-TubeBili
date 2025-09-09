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
// @version           1.0.6
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

// @require https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=

// @license           MIT
// ==/UserScript==

// 广告跳过，自动网页全屏(待实现)
//<div class="ytp-skip-ad" id="skip-ad:r" style="">
//<button class="ytp-skip-ad-button ytp-ad-component--clickable" id="skip-button:s" style="opacity: 0.5;">
//<div class="ytp-skip-ad-button__text">Skip</div>
//<span class="ytp-skip-ad-button__icon">
//<svg height="100%" viewBox="-6 -6 36 36" width="100%"><path d="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z" fill="#fff"></path></svg></span></button></div>

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

    // let isYoutubeListenerRegistered = false;
    let youtubeLiveStreamCheck = null;
    let currentVideoTitle = document.querySelector('title').text;

    const Common = {
        speeds: [0.5, 1.0, 1.5, 2.0, 3.0],
        colors: ['#072525', '#287F54', '#C22544'],
        currentLang: 'en',
        settingPanelItems: [],
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
        createSpeedButtons: function (selector, panelCallback, btnClickCallback) {
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
            document.getElementsByTagName('video')[0].playbackRate = rate;
        },
        // 定义一个通用的方法来设置 MutationObserver
        setupPlayerObserver: function(urlCheck, playerSelector, controlSelector, callback) {
            if (urlCheck(window.location.href)) {
                const playerContainer = document.querySelector(playerSelector);
                if (playerContainer) {
                    const observerConfig = { childList: true, subtree: true };
                    const playerObserver = new MutationObserver((mutations) => {
                        const hasControls = mutations.some(mutation =>
                            Array.from(mutation.addedNodes).some(node =>
                                node.matches && (node.matches(controlSelector) || node.querySelector(controlSelector))
                            )
                        );
                        if (hasControls) {
                            console.log(`MutationObserver 检测到 ${playerSelector} DOM变化，重新执行脚本`);
                            callback();
                        }
                    });
                    playerObserver.observe(playerContainer, observerConfig);
                }
            }
        },
    };
    const WebSite = {
        data: {
            youtubeLiveStreamStatus: false,
        },
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
            if (window.location.href.includes("youtube.com/watch")) {
                const handleYoutubePage = async () => {
                    console.log('执行Youtube页面脚本handler');
                    currentVideoTitle = document.querySelector('title').text;
                    if (!document.querySelector('#speedButtons')) {
                        try {
                            let videopanel = await elmGetter.get(WebSite.selectors.youtube.videoPanel);
                            console.log('添加更多倍速按钮');
                            Common.createSpeedButtons(WebSite.selectors.youtube.videoPanel, (moreSpeedsDiv) => {
                                videopanel.before(moreSpeedsDiv);
                            }, (speed) => {
                                document.getElementsByTagName('video')[0].playbackRate = speed;
                                WebSite.data.youtubeLiveStreamStatus = false;
                            });
                        } catch (error) {
                            console.error('Failed create speed button elements:', error);
                        }
                    }

                    try {
                        const removalConfigs = {
                            Youtube_AutoRemoveMiniplayer: WebSite.selectors.youtube.miniPlayerBtn,
                        };
                        for (const key in removalConfigs) {
                            if (GM_getValue(Common.settingPanelItems[key].dataKey, false)) {
                                elmGetter.get(removalConfigs[key]).then(item => {
                                    console.log('移除按钮:', removalConfigs[key]);
                                    item.remove();
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Failed autoremove buttons:', error);
                    }

                    if (GM_getValue(Common.settingPanelItems.Youtube_AutoRate2x.dataKey, false)) {
                        console.log('设置2倍速播放');
                        Common.setPlaybackRate(2.0);
                        WebSite.data.youtubeLiveStreamStatus = false;
                    }
                }; 

                // 启动直播状态检测
                youtubeLiveStreamCheck = setInterval(() => {
                    let element = document.querySelector(WebSite.selectors.youtube.liveStreamIcon);
                    if (element) {
                        if (element.classList.contains(WebSite.selectors.youtube.liveStreamClass) && !WebSite.data.youtubeLiveStreamStatus && window.location.href.includes("youtube.com/watch")) {
                            document.getElementsByTagName('video')[0].playbackRate = 1.0;
                            console.log('已检测到直播，重置播放速度为1.0');
                            WebSite.data.youtubeLiveStreamStatus = true;
                        }
                    }
                }, 1000);

                handleYoutubePage();
            }
        },
        bilibili: function () {
            const handleBilibiliPage = async () => {
                if (!document.querySelector('#speedButtons')) {
                    try {
                        await elmGetter.get(WebSite.selectors.bilibili.videoPanel);
                        Common.createSpeedButtons(WebSite.selectors.bilibili.videoPanel, (moreSpeedsDiv) => {
                            let ele = document.querySelector(WebSite.selectors.bilibili.speedBtn);
                            if (ele) {
                                ele.after(moreSpeedsDiv);
                            }
                        });
                    } catch (error) {
                        console.error('Failed create speed button elements:', error);
                    }
                }

                try {
                    const removalConfigs = {
                        Bilibili_AutoRemoveComments: WebSite.selectors.bilibili.commentsPanel,
                        Bilibili_AutoRemovePip: WebSite.selectors.bilibili.pipBtn,
                        Bilibili_AutoRemoveWide: WebSite.selectors.bilibili.wideBtn,
                        Bilibili_AutoRemoveSpeed: WebSite.selectors.bilibili.speedsListBtn,
                        Bilibili_AutoRemoveSettings: WebSite.selectors.bilibili.settingsBtn,
                    };
                    for (const key in removalConfigs) {
                        if (GM_getValue(Common.settingPanelItems[key].dataKey, false)) {
                            elmGetter.get(removalConfigs[key]).then(item => {
                                item.remove();
                            });
                        }
                    }
                } catch (error) {
                    console.error('Failed autoremove buttons:', error);
                }

                try {
                    if (GM_getValue(Common.settingPanelItems.Bilibili_AutoWebFullscreen.dataKey, false)) {
                        elmGetter.get(WebSite.selectors.bilibili.playerContainer).then(playItem => {
                            if (playItem.classList.contains(WebSite.selectors.bilibili.webFullClass)) {
                                return;
                            }
                            elmGetter.get(WebSite.selectors.bilibili.webFullBtn).then(item => {
                                item.click();
                            });
                        });
                    }
                } catch (error) {
                    console.error('Failed webfull or auto rate:', error);
                }

                if (GM_getValue(Common.settingPanelItems.Bilibili_AutoRate2x.dataKey, false)) {
                    Common.setPlaybackRate(2.0);
                }

                currentVideoTitle = document.querySelector('title').text;
            };

            if (window.location.href.includes("bilibili.com/video")) {
                handleBilibiliPage();
            }
        }
    }

    function main() {
        // 每次页面加载时，都先清理所有可能存在的定时器
        if (youtubeLiveStreamCheck !== null) {
            clearInterval(youtubeLiveStreamCheck);
            youtubeLiveStreamCheck = null;
        }
        Common.currentLang = Common.detectLanguage();
        Common.initSettingItems(window.location.href);
        GM_addStyle(settingPanelStyles);
        GM_registerMenuCommand(Common.geti18nText("menu_settings"), Common.togglePanel);

        // 首次加载时执行
        if (window.location.href.includes("youtube.com/watch")) {
            console.log('首次执行Youtube脚本');
            WebSite.youtube();
        } else if (window.location.href.includes("bilibili.com/video")) {
            console.log('首次执行Bilibili脚本');
            WebSite.bilibili();
        }

        if (window.location.href.includes("youtube.com")) {
            console.log('注册Youtube监听器');
            window.addEventListener(WebSite.selectors.youtube.finishListener, WebSite.youtube);
        }

        // 为 Bilibili 播放器设置观察者
        Common.setupPlayerObserver(
            (url) => url.includes("bilibili.com"),
            '#bilibili-player',
            WebSite.selectors.bilibili.speedBtn,
            WebSite.bilibili
        );
    }
    main();
})();
