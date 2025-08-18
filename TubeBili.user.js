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
// @version           1.0.1
// @namespace         https://github.com/julong111/script-youtube-more-speeds
// @author            julong@111.com
// @homepage          https://github.com/julong111/script-youtube-more-speeds
// @supportURL        https://github.com/julong111/script-youtube-more-speeds/issues

// @match             *://*.youtube.com/watch*
// @match             *://*.bilibili.com/video/*
// @include           *://*.youtube.com/watch*
// @include           *://*.bilibili.com/video/*

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
    const speeds = [0.5, 1.0, 1.5, 2.0, 3.0];
    let speedBtn = false;
    const colors = ['#072525', '#287F54', '#C22544'];

    // YouTube selectors
    const youtubeVideoPanelSelector = '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls';
    const youtubeLiveStreamSelector = '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button'; // Youtube Live Stream check
    const youtubeMiniPlayerSelector = '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-miniplayer-button.ytp-button';
    // const youtubeTheaterModeSelector = '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-size-button.ytp-button';
    // const youtubeTheaterModeDataTitleNoTooltipDefault = "Theater mode";
    // // const youtubeTheaterModeDataTitleNoTooltipTheater = "Default view";

    /// Bilibili selectors
    const bilibiliVideoPanelSelector = '.bilibili-player, .bpx-player-container, #bilibiliPlayer'
    const bilibiliBtnSelector = '.bpx-player-control-bottom-left'
    // const bilibiliBtnSelector = '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-center > div'
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
        }
    };
    function detectLanguage() {
        const userLang = navigator.language.toLowerCase();
        if (userLang.startsWith('zh')) {
            return 'zh';
        }
        if (userLang.startsWith('en')) {
            return 'en';
        }
        return 'en';
    }

    // 在脚本中使用这个函数来设置当前语言
    const currentLang = detectLanguage();

    function geti18nText(key) {
        return i18nConfig[currentLang][key];
    }

    const panelCss = `
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
        }
    `;
    GM_addStyle(panelCss);

    const currentUrl = window.location.href;
    var SettingsItems = [];
    if (currentUrl.includes("youtube.com")) {
        SettingsItems = {
            // Youtube_AutoTheaterMode: {
            //     classId: "Youtube-AutoTheaterMode",
            //     text: geti18nText("Youtube_AutoTheaterMode"),
            //     dataKey: "Youtube-AutoTheaterMode",
            // },
            Youtube_AutoRate2x: {
                classId: "Youtube-AutoRate2x",
                text: geti18nText("Youtube_AutoRate2x"),
                dataKey: "Youtube-AutoRate2x",
            },
            Youtube_AutoRemoveMiniplayer: {
                classId: "Youtube-AutoRemoveMiniplayer",
                text: geti18nText("Youtube_AutoRemoveMiniplayer"),
                dataKey: "Youtube-AutoRemoveMiniplayer",
            },
        };
    } else if (currentUrl.includes("bilibili.com")) {
        SettingsItems = {
            Bilibili_AutoWebFullscreen: {
                classId: "Bilibili-AutoWebFullscreen",
                text: geti18nText("Bilibili_AutoWebFullscreen"),
                dataKey: "Bilibili-AutoWebFullscreen",
            },
            Bilibili_AutoRate2x: {
                classId: "Bilibili-AutoRate2x",
                text: geti18nText("Bilibili_AutoRate2x"),
                dataKey: "Bilibili-AutoRate2x",
            },
            Bilibili_AutoRemovePip: {
                classId: "Bilibili-AutoRemovePip",
                text: geti18nText("Bilibili_AutoRemovePip"),
                dataKey: "Bilibili-AutoRemovePip",
            },

            Bilibili_AutoRemoveWide: {
                classId: "Bilibili-AutoRemoveWide",
                text: geti18nText("Bilibili_AutoRemoveWide"),
                dataKey: "Bilibili-AutoRemoveWide",
            },
            Bilibili_AutoRemoveSpeed: {
                classId: "Bilibili-AutoRemoveSpeed",
                text: geti18nText("Bilibili_AutoRemoveSpeed"),
                dataKey: "Bilibili-AutoRemoveSpeed",
            },
            Bilibili_AutoRemoveComments: {
                classId: "Bilibili-AutoRemoveComments",
                text: geti18nText("Bilibili_AutoRemoveComments"),
                dataKey: "Bilibili-AutoRemoveComments",
            },
        };
    };

    let panelElement = null;
    let isInitialized = false;

    function initializePanel() {
        if (isInitialized) { return; }

        if (document.querySelector("#minimalSettingsPanel")) { return; }
        const panel = document.createElement("div");
        panel.id = "minimalSettingsPanel";

        // 将面板添加到文档中
        const title = document.createElement("h2");
        title.textContent = geti18nText("menu_settings");
        panel.appendChild(title);

        for (const [key, item] of Object.entries(SettingsItems)) {
            const functionDiv = document.createElement("div");
            functionDiv.className = "setting-item";
            panel.appendChild(functionDiv);

            const functionValue = GM_getValue(item.dataKey, true);

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
        saveBtn.textContent = geti18nText("menu_save");
        saveBtn.addEventListener("click", saveSettings);
        const closeBtn = document.createElement("button");
        closeBtn.id = "closeBtn";
        closeBtn.textContent = geti18nText("menu_close");
        closeBtn.addEventListener("click", togglePanel);
        buttons.appendChild(saveBtn);
        buttons.appendChild(closeBtn);
        panel.appendChild(buttons);

        document.body.appendChild(panel);

        panelElement = panel;

        isInitialized = true;
    }

    initializePanel();

    function saveSettings() {
        for (const [key, item] of Object.entries(SettingsItems)) {
            const isChecked = document.getElementById(item.classId).checked;
            GM_setValue(item.dataKey, isChecked);
        }
        panelElement.classList.toggle('show');
    }

    function togglePanel() {
        if (!isInitialized) {
            initializePanel();
        }
        panelElement.classList.toggle('show');
    }

    // 注册菜单命令
    GM_registerMenuCommand(geti18nText("menu_settings"), togglePanel);

    function addSpeeds(selector, callback) {
        if (speedBtn) {
            return;
        }

        let bgColor = colors[0];
        let moreSpeedsDiv = document.createElement('div');
        moreSpeedsDiv.id = 'more-speeds';

        for (let i = 0; i < speeds.length; i++) {

            if (speeds[i] >= 1) { bgColor = colors[1]; }
            if (speeds[i] >= 3) { bgColor = colors[2]; }

            let btn = document.createElement('button');
            btn.style.backgroundColor = bgColor;
            btn.style.marginRight = '4px';
            btn.style.border = '1px solid #D3D3D3';
            btn.style.borderRadius = '2px';
            btn.style.color = '#ffffff';
            btn.style.cursor = 'pointer';
            btn.style.fontFamily = 'monospace';
            btn.style.width = '45px';
            btn.style.height = '24px';
            btn.style.fontSize = '14px';
            btn.style.lineHeight = '24px';
            btn.style.textAlign = 'center';
            btn.style.display = 'inline-block';
            btn.textContent = speeds[i].toString() + '×';

            btn.addEventListener('click', () => {
                document.getElementsByTagName('video')[0].playbackRate = speeds[i]
            });
            moreSpeedsDiv.appendChild(btn);
        }

        callback(moreSpeedsDiv);

        speedBtn = true;
    }

    function waitForElement(selectorOrFunction, callback, targetClass = null, ...callbackArgs) {
        const defaultOptions = {
            interval: 300,
            maxAttempts: -1
        };

        let attempts = 0;

        // 检查参数类型
        if (typeof selectorOrFunction !== 'string' && typeof selectorOrFunction !== 'function') {
            throw new TypeError('selectorOrFunction must be a string or a function.');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function.');
        }

        const check = () => {
            let element = null;

            if (typeof selectorOrFunction === 'string') {
                element = document.querySelector(selectorOrFunction);
            } else {
                element = selectorOrFunction();
            }

            // 如果元素存在
            if (element) {
                // 如果传入了 targetClass，则进行类名检测
                if (targetClass) {
                    if (element.classList.contains(targetClass)) {
                        callback(...callbackArgs);
                        return;
                    }
                } else {
                    // 如果没有传入 targetClass，则直接执行回调
                    callback(...callbackArgs);
                    return;
                }
            }

            attempts++;
            if (defaultOptions.maxAttempts !== -1 && attempts >= defaultOptions.maxAttempts) {
                console.error(`waitForElement: Reached max attempts (${defaultOptions.maxAttempts}), element not found.`);
                return;
            }

            // 元素不存在或不包含指定类名，等待一段时间后再次检测
            setTimeout(check, defaultOptions.interval);
        };

        // 第一次立即检测
        check();
    }

    function removeSelector(selector) {
        let ele = document.querySelector(selector);
        if (ele) {
            ele.remove();
        }
    }

    function setPlaybackRate(rate) {
        document.getElementsByTagName('video')[0].playbackRate = rate;
    }

    // function dispatchKeyboardEvent(element, key) {
    //     const event = new KeyboardEvent('keydown', {
    //         key: key,
    //         code: `Key${key.toUpperCase()}`,
    //         bubbles: true,
    //         cancelable: true,
    //         keyCode: key.toUpperCase().charCodeAt(0), // 例如 'T' 的键码是 84
    //         which: key.toUpperCase().charCodeAt(0)    // 同样，兼容旧浏览器
    //     });
    //     element.dispatchEvent(event);
    // }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function canExecute() {
        const currentTime = Date.now();
        if (scriptExecuted && (currentTime - lastExecutionTime) < MIN_EXECUTION_INTERVAL) {
            console.log('执行间隔太短，跳过执行');
            return false;
        }
        return true;
    }

    if (currentUrl.includes("youtube.com")) {
        youtube();
    } else if (currentUrl.includes("bilibili.com")) {
        bilibili();
    }
    function youtube() {
        if (document.body && !speedBtn) {
            window.addEventListener('yt-navigate-finish', function () {
                if (!isInitialized) {
                    initializePanel();
                }
                setInterval(() => {
                    const element = document.querySelector(youtubeLiveStreamSelector);
                    if (element) {
                        if (element.classList.contains('ytp-live-badge-is-livehead')) {
                            document.getElementsByTagName('video')[0].playbackRate = 1.0;
                            // waitForElement(
                            //     youtubeLiveStreamSelector,
                            //     setPlaybackRate,
                            //     'ytp-live-badge-is-livehead', // livestream class
                            //     1.0 // 不传入额外参数
                            // );
                        }
                    }
                }, 1000);

                waitForElement(
                    youtubeVideoPanelSelector,
                    addSpeeds,
                    null, // 不传入类名
                    youtubeVideoPanelSelector,
                    (moreSpeedsDiv) => {
                        let ele = document.querySelector(youtubeVideoPanelSelector);
                        ele.before(moreSpeedsDiv);
                    }
                );

                let autoPlay = GM_getValue(SettingsItems.Youtube_AutoRate2x.dataKey, true);
                if (autoPlay) {
                    waitForElement(
                        youtubeVideoPanelSelector,
                        setPlaybackRate,
                        null,
                        2.0 // 不传入额外参数
                    );
                }

                let removeMiniplayer = GM_getValue(SettingsItems.Youtube_AutoRemoveMiniplayer.dataKey, false);
                if (removeMiniplayer) {
                    waitForElement(
                        youtubeMiniPlayerSelector,
                        removeSelector,
                        null,
                        youtubeMiniPlayerSelector // 不传入额外参数
                    );
                }

                // 无法监听事件，待开发
                // let autoTheaterMode = GM_getValue(SettingsItems.Youtube_AutoTheaterMode.dataKey, false);
                // if (autoTheaterMode) {
                //     let theaterButton = document.querySelector(youtubeTheaterModeSelector);
                //     if (theaterButton) {
                //         //
                //         waitForElement(
                //             '#movie_player > div.html5-video-container',
                //             (theaterButton) => { // ✅ 正确：使用 waitForElement 传递的最新元素
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
    }
    function bilibiliScreenMode() {
        let playerContainerMode = document.querySelector('.bpx-player-container.bpx-state-no-cursor');
        let dataScreenValue = playerContainerMode.getAttribute('data-screen');
        console.log("当前显示模式：" + dataScreenValue);
        if (dataScreenValue === 'normal') {
            return false;
        }
        if (dataScreenValue === 'web') {
            return true;
        }
        if (dataScreenValue === 'full') {
            return true;
        }
        return false;
    }
    function bilibili() {
        // const debouncedMain = debounce(bilibili, 3000);
        // if (document.readyState === 'complete' || document.readyState === 'interactive') {
        //     debouncedMain();
        // } else {
        //     document.addEventListener('DOMContentLoaded', debouncedMain);
        // }

        // let lastUrl = location.href;
        // const observer = new MutationObserver(() => {
        //     if (location.href !== lastUrl) {
        //         const currentVideoId = location.href.match(/\/video\/(BV\w+)/);
        //         const lastVideoId = lastUrl.match(/\/video\/(BV\w+)/);

        //         if (currentVideoId && (!lastVideoId || currentVideoId[1] !== lastVideoId[1])) {
        //             console.log('检测到新视频，重置状态并执行');
        //             scriptExecuted = false;
        //             setTimeout(debouncedMain, 1500);
        //         }
        //         lastUrl = location.href;
        //     }
        // });

        // observer.observe(document, { subtree: true, childList: true });

        waitForElement(
            bilibiliVideoPanelSelector,
            addSpeeds,
            null, // 不传入类名
            bilibiliBtnSelector,
            (moreSpeedsDiv) => {
                let ele = document.querySelector(bilibiliBtnSelector);
                ele.after(moreSpeedsDiv);
            }
        );

        let autoRemoveComments = GM_getValue(SettingsItems.Bilibili_AutoRemoveComments.dataKey, false);
        if (autoRemoveComments) {
            const commentPanel = document.querySelector('.bpx-player-control-bottom-center');
            if (commentPanel) {
                console.log('找到评论面板，尝试移除');
                commentPanel.style.display = 'none';
            } else {
                console.log('未找到评论面板');
            }
        }

        let autoRate2x = GM_getValue(SettingsItems.Bilibili_AutoRate2x.dataKey, true);
        if (autoRate2x) {
            setPlaybackRate(2.0); // 设置默认播放速度为2.0
        }

        let autoWebFullscreen = GM_getValue(SettingsItems.Bilibili_AutoWebFullscreen.dataKey, false);
        if (autoWebFullscreen) {
            if (bilibiliScreenMode()) {
                console.log('已处于网页全屏状态，跳过');
                return;
            }

            setInterval(() => {
                const fullscreenBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web');
                if (fullscreenBtn) {
                    console.log('找到并点击网页全屏按钮');
                    fullscreenBtn.click();
                } else {
                    console.log('未找到网页全屏按钮');
                }
            }, 2000);
        }

        let autoRemovePip = GM_getValue(SettingsItems.Bilibili_AutoRemovePip.dataKey, false);
        if (autoRemovePip) {
            const pipBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-pip');
            if (pipBtn) {
                pipBtn.remove();
                console.log('画中画按钮已移除');
            } else {
                console.log('未找到画中画按钮');
            }
        }

        let autoRemoveWide = GM_getValue(SettingsItems.Bilibili_AutoRemoveWide.dataKey, false);
        if (autoRemoveWide) {
            const wideBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-wide');
            if (wideBtn) {
                wideBtn.remove();
                console.log('宽屏按钮已移除');
            } else {
                console.log('未找到宽屏按钮');
            }
        }

        let autoRemoveSpeed = GM_getValue(SettingsItems.Bilibili_AutoRemoveSpeed.dataKey, false);
        if (autoRemoveSpeed) {
            const speedBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate');
            if (speedBtn) {
                speedBtn.remove();
                console.log('原始倍速按钮已移除');
            } else {
                console.log('未找到原始倍速按钮');
            }
        }



    }
})();
