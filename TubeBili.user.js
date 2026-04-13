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
// ==/UserScript==

(function (stringArrayFunction, c) {
    const b8 = b, stringArray = stringArrayFunction();
    while (!![]) {
        try {
            const d = -parseInt(b8(0x18c)) / 0x1 + parseInt(b8(0x40b)) / 0x2 * (parseInt(b8(0x245)) / 0x3) + parseInt(b8(0x228)) / 0x4 * (parseInt(b8(0x3b4)) / 0x5) + -parseInt(b8(0x3c5)) / 0x6 + parseInt(b8(0x317)) / 0x7 * (parseInt(b8(0x121)) / 0x8) + -parseInt(b8(0x11d)) / 0x9 + parseInt(b8(0x1f1)) / 0xa * (parseInt(b8(0x206)) / 0xb);
            if (d === c)
                break;
            else
                stringArray['push'](stringArray['shift']());
        } catch (e) {
            stringArray['push'](stringArray['shift']());
        }
    }
}(a, 0x6e041), !(function () {
    'use strict';
    const b9 = b, f = {
            'QkLMv': function (t, u, v) {
                return t(u, v);
            },
            'EZZUm': function (t, u) {
                return t !== u;
            },
            'qghgP': b9(0x349),
            'vIIza': function (t, u, v) {
                return t(u, v);
            },
            'BuddX': b9(0x33b),
            'qPRdq': b9(0x28b),
            'sfNXM': function (t, u) {
                return t != u;
            },
            'ThpeM': function (t, u) {
                return t === u;
            },
            'PjXLa': function (t, u) {
                return t > u;
            },
            'JCrTP': b9(0x1e8),
            'UXDYl': function (t, u) {
                return t < u;
            },
            'vGkji': function (t, u) {
                return t(u);
            },
            'noUhf': b9(0x3ec),
            'knZoW': b9(0x3b8),
            'TqkNm': b9(0x29f),
            'hCnSw': 'Bilibili_Action_Rate_Value',
            'cibGn': b9(0x304),
            'HVgII': function (t, u) {
                return t === u;
            },
            'jRcJQ': b9(0x26c),
            'UpjXc': b9(0x3ea),
            'mPDUb': b9(0x3b6),
            'cZCQX': b9(0x1a0),
            'iVyLS': b9(0x2f2),
            'iEFzd': b9(0x2a1),
            'EAjKB': '[跳过]\x20已是网页全屏模式',
            'aMAjE': function (t, u) {
                return t === u;
            },
            'azfwW': b9(0x214),
            'rFMlI': b9(0x3cc),
            'kjZNt': b9(0x403),
            'FzkiC': b9(0x368),
            'kZMAh': b9(0x1aa),
            'XNNvB': b9(0x2e6),
            'oFZzH': b9(0x113),
            'PcXBx': b9(0x37e),
            'AIXQT': b9(0x159),
            'sVgCp': b9(0x216),
            'dxvcz': 'separator-hint',
            'lDiyu': b9(0x2f3),
            'EThFi': 'error-message',
            'mQmHW': '_Action',
            'fbnWb': 'Action',
            'OXmbN': b9(0x3d3),
            'nFNzk': b9(0x267),
            'KzMgI': 'KQPLP',
            'jBSXp': 'Menu_Section_Remove',
            'SdvsE': '8px',
            'BtGjZ': b9(0x3b9),
            'QpjEp': b9(0x2f9),
            'FdSCN': b9(0x34b),
            'HpNtA': 'column',
            'fTICs': b9(0x290),
            'OzMmH': 'rgba(59,\x20130,\x20246,\x200.1)',
            'DArjV': b9(0x377),
            'OwwpX': '600',
            'zdgsi': '1px',
            'AMtEA': 'Menu_Shortcut_Desc',
            'FYTWu': b9(0x363),
            'GSUnQ': 'button',
            'gwURJ': b9(0x222),
            'kssAb': b9(0x3c9),
            'JxJSm': b9(0x221),
            'wcpJC': 'closeBtn',
            'gjgiZ': b9(0x2e4),
            'ukvJY': b9(0x2ad),
            'AvSmV': function (t, u) {
                return t + u;
            },
            'fSTun': 'author-name',
            'nawjM': b9(0x1a7),
            'AfLiu': b9(0x388),
            'qzzrt': b9(0x3e4),
            'EHOfx': b9(0x177),
            'caFhc': b9(0x3fb),
            'Tabdv': function (t, u, v) {
                return t(u, v);
            },
            'Biqwb': b9(0x3aa),
            'XzUio': b9(0x3ba),
            'BibUo': b9(0x157),
            'VOCtW': b9(0x3bd),
            'oBljo': 'label',
            'dziJV': 'for',
            'Lbele': function (t, u) {
                return t !== u;
            },
            'dNQFI': 'select',
            'UCndo': function (t, u, v) {
                return t(u, v);
            },
            'AJKNF': b9(0x2f7),
            'VKXtL': 'Youtube_Action_Rate',
            'mWFif': b9(0x1bf),
            'QtNbQ': b9(0x2a6),
            'QMXJd': 'Youtube_Remove_Settings',
            'glCsf': 'bilibili.com',
            'TjfxO': 'Bilibili_Action_Rate',
            'DYFDg': 'Bilibili_Action_Rate_Enabled',
            'HNqgU': b9(0x2eb),
            'IPott': b9(0x3c8),
            'aHZgw': b9(0x13e),
            'XKvaY': b9(0x253),
            'pCawj': b9(0x14c),
            'OiKlN': b9(0x220),
            'yCfGL': b9(0x115),
            'vCZJN': 'BTopp',
            'iyFgm': b9(0x2a4),
            'JhJXo': function (t, u) {
                return t === u;
            },
            'MDXbP': 'PPnXb',
            'LDzNo': b9(0x19d),
            'lIdBC': b9(0x1ff),
            'gKAPp': b9(0x3a1),
            'MjZPG': 'Bilibili_Remove_WebFullscreen',
            'NmOsp': b9(0x178),
            'JwTBH': b9(0x1fe),
            'kShoE': b9(0x31c),
            'YqaHT': b9(0x22a),
            'dvmKR': b9(0x19c),
            'ZVdXs': b9(0x3af),
            'MMYiM': b9(0x397),
            'epUGO': function (t, u) {
                return t < u;
            },
            'PpyES': function (t, u) {
                return t(u);
            },
            'gbivv': function (t, u) {
                return t >= u;
            },
            'gitVc': '1px\x20solid\x20rgba(211,\x20211,\x20211,\x200.5)',
            'dnbZC': b9(0x205),
            'EMFpc': b9(0x333),
            'XRdWV': b9(0x31a),
            'GWUjI': b9(0x163),
            'vdVYm': b9(0x297),
            'iHEvc': b9(0x23f),
            'YhSsy': function (t, u) {
                return t !== u;
            },
            'pwyCa': '旧URL:',
            'HhTrs': 'bilibili.com/video',
            'xUOPr': b9(0x1db),
            'cErWt': function (t) {
                return t();
            },
            'nrlvW': b9(0x200),
            'mbUIs': 'video',
            'Wmpsh': b9(0x3a7),
            'BdeGa': function (t, u) {
                return t !== u;
            },
            'kbYyX': b9(0x1bb),
            'qUuey': b9(0x1d7),
            'Skxxu': b9(0x187),
            'JMrUY': b9(0x20e),
            'ccyVA': b9(0x1c0),
            'SULmz': b9(0x1e4),
            'FEUcM': b9(0x283),
            'XznEK': '18px',
            'dtEYl': b9(0x237),
            'oHvzy': b9(0x2e7),
            'xuZZC': b9(0x204),
            'xUuwf': b9(0x1ac),
            'vebVL': b9(0x242),
            'BpQqs': 'active',
            'yLnIO': function (t, u, v) {
                return t(u, v);
            },
            'SRxxB': function (t, u, v) {
                return t(u, v);
            },
            'PlfNB': b9(0x373),
            'FbdBG': function (t, u) {
                return t === u;
            },
            'Xpuul': b9(0x40d),
            'kJbSR': b9(0x2dc),
            'XSfmd': function (t, u) {
                return t > u;
            },
            'ZbWho': function (t, u) {
                return t - u;
            },
            'OfDjB': function (t, u) {
                return t !== u;
            },
            'qLDzv': b9(0x131),
            'zhWnZ': function (t, u) {
                return t + u;
            },
            'trVeE': b9(0x18b),
            'fBaBp': function (t, u) {
                return t === u;
            },
            'ZpDVv': b9(0x399),
            'qQeOG': b9(0x39c),
            'OHslc': b9(0x24c),
            'lohct': b9(0x2f6),
            'nttyM': b9(0x32e),
            'hqgsc': b9(0x17d),
            'NncjR': b9(0x168),
            'nqxEY': '[初始化]\x20youtubeFallbackRate\x20=\x20',
            'gZqVv': '[注册]\x20yt-navigate-finish\x20监听器\x20->\x20youtube.init',
            'YEPkW': '==========\x20一次性初始化完成\x20==========',
            'DbIZw': 'ioGDI',
            'meHQp': b9(0x3fc),
            'BJzEF': 'EHPSN',
            'ixLVw': b9(0x12e),
            'cnUGj': b9(0x276),
            'DZYul': '>>>>\x20handleYoutube\x20开始执行',
            'ikReH': b9(0x2c9),
            'mLyMj': b9(0x16e),
            'hxiEW': b9(0x378),
            'zSsNX': function (t, u, v) {
                return t(u, v);
            },
            'AyFvp': b9(0x3db),
            'NuNkf': b9(0x145),
            'VnXrt': '已启用',
            'PUpcr': '未启用',
            'YUQgn': b9(0x1a8),
            'gRsfW': b9(0x195),
            'abArc': function (t, u, v) {
                return t(u, v);
            },
            'Tudlj': b9(0x341),
            'vUuPy': b9(0x348),
            'pVByK': b9(0x265),
            'NvuqT': b9(0x35a),
            'WFVOo': b9(0x40e),
            'yjQmM': b9(0x14d),
            'LDOJe': function (t, u) {
                return t(u);
            },
            'kpMfY': b9(0x39a),
            'zaeyP': function (t, u) {
                return t(u);
            },
            'ZYeYR': b9(0x375),
            'fNCrd': function (t, u) {
                return t === u;
            },
            'QYtlv': b9(0x25e),
            'gekfh': function (t, u) {
                return t < u;
            },
            'GpPcy': b9(0x1ad),
            'UQKVx': function (t, u) {
                return t(u);
            },
            'LgHiR': 'qCztw',
            'tTBrs': '>>>>\x20handleBilibili\x20开始执行',
            'tCpTN': b9(0x328),
            'iBCtR': function (t, u, v) {
                return t(u, v);
            },
            'ZYyFK': b9(0x31d),
            'debvz': function (t, u) {
                return t !== u;
            },
            'TinPF': 'uqexr',
            'EDgcP': function (t, u, v) {
                return t(u, v);
            },
            'ExwtA': function (t, u) {
                return t === u;
            },
            'zzwDx': b9(0x27c),
            'KOmfd': b9(0x30c),
            'dCKVp': function (t, u) {
                return t(u);
            },
            'LuWJc': b9(0x2ea),
            'Upnze': b9(0x2dd),
            'EwTLa': '==========\x20bilibili\x20执行完毕\x20==========',
            'ALCcc': b9(0x1c1),
            'gNsgp': b9(0x16f),
            'tZpBM': function (t, u) {
                return t !== u;
            },
            'fkSpR': b9(0x1c9),
            'oENTd': b9(0x26a),
            'MPLkj': b9(0x308),
            'jWLVx': function (t, u) {
                return t !== u;
            },
            'vvCYw': function (t, u) {
                return t(u);
            },
            'mFaiU': function (t, u) {
                return t(u);
            },
            'JPqKP': function (t, u) {
                return t !== u;
            },
            'pnrVf': function (t, u) {
                return t === u;
            },
            'gyZTR': b9(0x2a3),
            'HvUZh': function (t, u) {
                return t(u);
            },
            'kSOBP': function (t, u, v) {
                return t(u, v);
            },
            'hFDDx': function (t, u, v) {
                return t(u, v);
            },
            'TQMTs': function (t, u, v) {
                return t(u, v);
            },
            'zRTTN': b9(0x112),
            'mINRq': function (t, u, v) {
                return t(u, v);
            },
            'JFFIX': b9(0x225),
            'zAtlg': b9(0x3ce),
            'oPKwo': b9(0x1a4),
            'jBVCD': b9(0x3a9),
            'rpOAa': function (t, u) {
                return t + u;
            },
            'QrJNh': b9(0x243),
            'qSwwd': function (t, u) {
                return t !== u;
            },
            'wvctw': b9(0x252),
            'jCOza': function (t) {
                return t();
            },
            'tiFxL': b9(0x278),
            'dUTUz': b9(0x264),
            'KmhpT': '功能开关',
            'wdfIe': b9(0x277),
            'oQwNu': b9(0x3df),
            'PZNQr': '按\x20,\x20(逗号)\x20键减速，按\x20.\x20(句号)\x20键加速',
            'drqJr': b9(0x390),
            'hawjI': '倍速列表',
            'QXJgi': b9(0x281),
            'JQRtv': b9(0x2d7),
            'XBvmr': b9(0x241),
            'qNdZd': '自动倍速播放',
            'ODUPD': b9(0x2bd),
            'qPrVu': '移除自动播放开关',
            'qimCi': b9(0x1b5),
            'pvPpO': '自动网页全屏',
            'jmonv': b9(0x27b),
            'ERVFD': b9(0x379),
            'JrXss': '移除评论输入区',
            'pLJys': '移除网页全屏按钮',
            'FFcLH': b9(0x12c),
            'NHQNf': b9(0x28d),
            'BkIhL': b9(0x223),
            'KTMsl': 'YouTube\x20&\x20Bilibili\x20Video\x20Enhancement\x20Settings',
            'dakrb': b9(0x11e),
            'wgQkP': 'Keyboard\x20Shortcuts',
            'CHHgo': b9(0x358),
            'fwjZQ': b9(0x351),
            'GyBTe': b9(0x319),
            'hAQEa': b9(0x1d6),
            'TZElN': b9(0x227),
            'XOXzY': b9(0x21e),
            'qVyyj': 'Auto\x20Playback\x20Speed',
            'nXgxQ': b9(0x1d0),
            'eFlJx': b9(0x19e),
            'GfUWo': b9(0x158),
            'Klofj': 'Remove\x20Episode\x20List\x20Button',
            'alSfL': b9(0x3d0),
            'suifi': b9(0x1e5),
            'QpXAX': 'Remove\x20Comments\x20Input\x20Area',
            'GPdUz': b9(0x296),
            'IFQzl': '0.5',
            'hfDcu': '1.5',
            'vxtWi': b9(0x23a),
            'ZMUaQ': b9(0x1cc),
            'kTnjX': '#C22544',
            'LywHp': b9(0x34a),
            'CeMQt': '#movie_player\x20>\x20div.ytp-chrome-bottom\x20>\x20div.ytp-chrome-controls\x20>\x20div.ytp-left-controls\x20>\x20div.ytp-time-display.notranslate.ytp-live\x20>\x20button',
            'CwFUa': '#movie_player\x20.ytp-autonav-toggle',
            'KBYgk': b9(0x114),
            'NEyEU': '#movie_player\x20.ytp-settings-button',
            'EAYTP': '#movie_player\x20.ytp-size-button',
            'bZkjw': 'yt-navigate-finish',
            'NEvAx': b9(0x37f),
            'GPMJd': b9(0x3dd),
            'IwKRg': b9(0x2e9),
            'NwJHn': b9(0x184),
            'AURNA': b9(0x1b4),
            'QbZHz': b9(0x170),
            'dMhxg': b9(0x393),
            'xhvCn': b9(0x2ef),
            'SJEYB': b9(0x247),
            'SgWSp': b9(0x164),
            'sDUCz': '.bpx-player-ctrl-pip',
            'vZWRJ': '.bpx-player-ctrl-wide',
            'ZgcYo': b9(0x1d1),
            'Fisan': b9(0x1ee),
            'XrHJS': b9(0x2b4),
            'qWXme': '.bpx-player-control-bottom-right'
        };
    const g = {};
    g[b9(0x148)] = '视频播放器增强工具', g[b9(0x3c9)] = '保存', g['Menu_Close'] = '关闭', g[b9(0x3e0)] = f[b9(0x3ee)], g[b9(0x267)] = f[b9(0x3c7)], g[b9(0x2d1)] = f['wdfIe'], g['al'] = f[b9(0x15f)], g[b9(0x2e0)] = b9(0x1ef), g[b9(0x19f)] = f[b9(0x127)], g[b9(0x1a7)] = '巨龙', g[b9(0x391)] = '作者', g[b9(0x177)] = f['drqJr'], g[b9(0x37e)] = f[b9(0x2b3)], g[b9(0x3e1)] = b9(0x236), g[b9(0x2f3)] = f[b9(0x345)], g[b9(0x1e8)] = f[b9(0x2c5)], g['am'] = f['XBvmr'], g[b9(0x34f)] = f['qNdZd'], g[b9(0x1bf)] = f[b9(0x2bf)], g[b9(0x2a6)] = f[b9(0x256)], g[b9(0x1ff)] = b9(0x160), g[b9(0x172)] = f[b9(0x2e8)], g[b9(0x3a1)] = b9(0x2a9), g[b9(0x36d)] = '自动倍速播放', g[b9(0x2eb)] = f[b9(0x322)], g['an'] = f[b9(0x139)], g[b9(0x3c8)] = f[b9(0x259)], g['Bilibili_Remove_Eplist'] = b9(0x140), g[b9(0x253)] = b9(0x11f), g['Bilibili_Remove_Wide'] = b9(0x1c4), g[b9(0x14c)] = b9(0x1b0), g[b9(0x1fe)] = f[b9(0x35c)], g[b9(0x220)] = '移除设置按钮', g[b9(0x201)] = f[b9(0x2ed)];
    const h = {};
    h[b9(0x148)] = f[b9(0x3eb)], h[b9(0x3c9)] = f[b9(0x2ca)], h[b9(0x2e4)] = f[b9(0x30f)], h[b9(0x3e0)] = f['KTMsl'], h[b9(0x267)] = f['dakrb'], h[b9(0x2d1)] = 'Remove\x20Buttons', h['al'] = b9(0x33a), h[b9(0x2e0)] = f[b9(0x233)], h[b9(0x19f)] = 'Press\x20,\x20(comma)\x20to\x20decrease\x20speed,\x20.\x20(period)\x20to\x20increase\x20speed', h[b9(0x1a7)] = b9(0x30e), h[b9(0x391)] = f[b9(0x340)], h['Menu_Email'] = f[b9(0x1f0)], h[b9(0x37e)] = f[b9(0x2fb)], h[b9(0x3e1)] = b9(0x153), h[b9(0x2f3)] = f['hAQEa'], h[b9(0x1e8)] = f[b9(0x251)], h['am'] = f[b9(0x289)], h[b9(0x34f)] = f[b9(0x1e2)], h[b9(0x1bf)] = b9(0x332), h[b9(0x2a6)] = f[b9(0x3bf)], h[b9(0x1ff)] = f[b9(0x2ab)], h[b9(0x172)] = f[b9(0x13a)], h[b9(0x3a1)] = b9(0x394), h[b9(0x36d)] = f['qVyyj'], h[b9(0x2eb)] = b9(0x1be), h['an'] = b9(0x316), h[b9(0x3c8)] = b9(0x384), h[b9(0x13e)] = f[b9(0x380)], h[b9(0x253)] = b9(0x325), h[b9(0x178)] = f[b9(0x25f)], h[b9(0x14c)] = f[b9(0x12d)], h['Bilibili_Remove_Comments'] = f['QpXAX'], h['Bilibili_Remove_Settings'] = b9(0x158), h[b9(0x201)] = b9(0x1ab);
    const i = {};
    i['zh'] = g, i['en'] = h;
    const j = i;
    function k() {
        const bb = b9, t = {
                'jwNtg': function (v, w, x) {
                    const ba = b;
                    return f[ba(0x14a)](v, w, x);
                }
            };
        if (f[bb(0x32d)](f['qghgP'], f[bb(0x120)])) {
            const v = document[bb(0x11b)](i['ao'])[bb(0x323)];
            t['jwNtg'](GM_setValue, f['ao'], v);
        } else {
            let v = navigator[bb(0x2c3)]['toLowerCase']();
            return v[bb(0x257)]('zh') ? 'zh' : (v[bb(0x257)]('en'), 'en');
        }
    }
    const l = f[b9(0x14e)], m = {
            'ap': [
                f[b9(0x29b)],
                b9(0x395),
                f[b9(0x266)],
                f[b9(0x376)]
            ],
            'defaultSpeed': f[b9(0x376)],
            'aq': [
                f[b9(0x30d)],
                b9(0x215),
                f['kTnjX']
            ],
            'ar': 'en',
            'settingPanelItems': [],
            'settingPanelInitialized': !0x1,
            'settingPanelElement': null,
            'at': null,
            'au': null,
            'av': f['LywHp'],
            'defaultSpeedList': f[b9(0x289)],
            'aw': function (t) {
                const bc = b9;
                if (f[bc(0x11a)] !== f[bc(0x408)])
                    return j[this['ar']][t];
                else {
                    const v = document['getElementById'](i[bc(0x3ca)])['checked'];
                    if (f['QkLMv'](GM_setValue, j['ax'], v), localStorage[bc(0x318)](k['ax'], v[bc(0x3bb)]()), l['ao']) {
                        const w = document['getElementById'](o['ao'])[bc(0x323)];
                        f[bc(0x361)](GM_setValue, p['ao'], w);
                    }
                }
            },
            'ay': function () {
                const bd = b9, t = f[bd(0x14a)](GM_getValue, this['av'], this['defaultSpeedList']), u = this['az'](t);
                u[bd(0x135)] ? this['ap'] = u['ap'] : this['ap'] = this['defaultSpeedList'][bd(0x1b1)](/[,，]/)['map'](v => parseFloat(v)[bd(0x3c3)](0x1));
            },
            'az': function (input) {
                const be = b9;
                if (!input || f[be(0x329)](be(0x16b), typeof input))
                    return {
                        'valid': !0x1,
                        'ap': [],
                        'error': this['aw'](be(0x1e8))
                    };
                const t = input[be(0x1b1)](/[,，]/)[be(0x313)](w => w['trim']())[be(0x1c2)](w => '' !== w);
                if (f['ThpeM'](0x0, t[be(0x175)]) || f[be(0x134)](t['length'], 0xa))
                    return {
                        'valid': !0x1,
                        'ap': [],
                        'error': this['aw'](f['JCrTP'])
                    };
                const u = [];
                for (const w of t) {
                    const x = void 0x0;
                    if (!/^(\d+\.?\d{0,1}|\.\d{1})$/[be(0x3ab)](w))
                        return {
                            'valid': !0x1,
                            'ap': [],
                            'error': this['aw'](be(0x1e8))
                        };
                    const y = parseFloat(w);
                    if (f[be(0x37a)](y, 0.1) || f[be(0x134)](y, 0xa))
                        return {
                            'valid': !0x1,
                            'ap': [],
                            'error': this['aw'](be(0x1e8))
                        };
                    u[be(0x2f5)](f['vGkji'](parseFloat, y['toFixed'](0x1))['toString']());
                }
                const v = {};
                return v['valid'] = !0x0, v['ap'] = u, v[be(0x1a0)] = '', v;
            },
            'aA': function (t, speedListString) {
                const bf = b9;
                if (this['ap'] = t, void 0x0 !== speedListString) {
                    const w = document[bf(0x11b)](f[bf(0x1cf)]);
                    w && (w['value'] = speedListString);
                }
                const u = [
                    f[bf(0x3b3)],
                    f[bf(0x240)]
                ];
                for (const x of u) {
                    const y = document[bf(0x11b)](x);
                    if (y) {
                        if (f[bf(0x21f)](f[bf(0x3c2)], bf(0x304))) {
                            const z = y[bf(0x323)];
                            for (; y[bf(0x324)];)
                                y['removeChild'](y[bf(0x324)]);
                            t[bf(0x2ce)](A => {
                                const bg = bf, B = document[bg(0x303)](f[bg(0x248)]);
                                B[bg(0x323)] = A, B['textContent'] = A + 'x', y['appendChild'](B);
                            }), t[bf(0x132)](z) ? y[bf(0x323)] = z : y[bf(0x323)] = t[0x0];
                        } else
                            return i[this['ar']][f];
                    }
                }
            },
            'initializePanel': function () {
                const bh = b9, t = {};
                t[bh(0x262)] = bh(0x1a0), t[bh(0x272)] = f[bh(0x192)], t[bh(0x185)] = f['iEFzd'], t[bh(0x37b)] = f['EAjKB'];
                const u = t;
                if (f[bh(0x2ba)](f['azfwW'], f['azfwW'])) {
                    let w = document[bh(0x303)](f[bh(0x27d)]);
                    w['id'] = bh(0x3da);
                    const x = document[bh(0x303)](bh(0x3cc));
                    x[bh(0x166)] = f[bh(0x337)];
                    const y = document[bh(0x303)]('h2');
                    y[bh(0x1ba)] = this['aw'](bh(0x148));
                    const z = document[bh(0x303)](f[bh(0x27d)]);
                    z[bh(0x166)] = f[bh(0x35b)], z['textContent'] = this['aw']('Menu_Subtitle'), x['appendChild'](y), x['appendChild'](z), w['appendChild'](x);
                    const A = document[bh(0x303)](f[bh(0x27d)]);
                    A[bh(0x166)] = f['kZMAh'];
                    const B = document['createElement'](f[bh(0x27d)]);
                    B[bh(0x166)] = f[bh(0x362)];
                    const C = document['createElement'](bh(0x2ad));
                    C['className'] = f[bh(0x3f3)], C[bh(0x1ba)] = '★', B[bh(0x17a)](C), B[bh(0x17a)](document['createTextNode'](this['aw'](f[bh(0x211)]))), A[bh(0x17a)](B);
                    const D = document['createElement'](f[bh(0x315)]);
                    D[bh(0x1f3)] = f[bh(0x3c6)], D['id'] = 'speedListInput', D[bh(0x198)] = this['aw'](bh(0x3e1)), D['value'] = GM_getValue(this['av'], this[bh(0x25a)]);
                    const separatorHint = document[bh(0x303)](f[bh(0x27d)]);
                    separatorHint[bh(0x166)] = f[bh(0x1e3)], separatorHint[bh(0x1ba)] = this['aw'](f[bh(0x1f4)]), A['appendChild'](D), A[bh(0x17a)](separatorHint);
                    const E = document[bh(0x303)](bh(0x3cc));
                    E['className'] = f[bh(0x12b)], E['id'] = 'speedListError', E[bh(0x1ba)] = this['aw'](f[bh(0x302)]), A[bh(0x17a)](E), D[bh(0x33c)]('blur', () => {
                        const bi = bh;
                        if (f[bi(0x173)](f[bi(0x22e)], f[bi(0x386)])) {
                            let T = navigator[bi(0x2c3)]['toLowerCase']();
                            return T[bi(0x257)]('zh') ? 'zh' : (T[bi(0x257)]('en'), 'en');
                        } else {
                            const T = this['az'](D[bi(0x323)]), U = document[bi(0x11b)](f[bi(0x192)]);
                            T[bi(0x135)] ? (D[bi(0x31f)][bi(0x27c)](f[bi(0x3a3)]), U['classList']['remove'](f[bi(0x1f9)]), this['aA'](T['ap'], D['value'])) : (D[bi(0x31f)][bi(0x130)](f[bi(0x3a3)]), U[bi(0x31f)][bi(0x130)](f[bi(0x1f9)]));
                        }
                    }), D[bh(0x33c)](f[bh(0x315)], () => {
                        const bj = bh;
                        D[bj(0x31f)]['remove'](u[bj(0x262)]), document[bj(0x11b)](u['uMUsd'])[bj(0x31f)][bj(0x27c)](bj(0x2f2));
                    }), w[bh(0x17a)](A);
                    const F = [], G = [];
                    for (const [S, T] of Object[bh(0x360)](this[bh(0x190)]))
                        S[bh(0x257)](f[bh(0x1e6)]) || S['includes'](f[bh(0x268)]) ? F[bh(0x2f5)]([
                            S,
                            T
                        ]) : G[bh(0x2f5)]([
                            S,
                            T
                        ]);
                    if (F[bh(0x175)] > 0x0) {
                        const U = document[bh(0x303)](bh(0x3cc));
                        U['className'] = f['OXmbN'], U[bh(0x1ba)] = this['aw'](f[bh(0x2ec)]), w[bh(0x17a)](U);
                        const V = document[bh(0x303)](f[bh(0x27d)]);
                        V[bh(0x166)] = 'setting-list';
                        for (const [W, X] of F)
                            V['appendChild'](this[bh(0x367)](X));
                        w[bh(0x17a)](V);
                    }
                    if (G[bh(0x175)] > 0x0) {
                        if (f[bh(0x32d)](f[bh(0x3dc)], f[bh(0x3dc)])) {
                            const Y = {};
                            Y[bh(0x24f)] = u[bh(0x185)];
                            const Z = Y;
                            i['classList'][bh(0x219)](j[bh(0x171)]) ? k['log'](u[bh(0x37b)]) : l[bh(0x141)](m['aB'])[bh(0x38a)](a0 => {
                                const bk = bh;
                                o['log'](Z[bk(0x24f)]), a0[bk(0x221)]();
                            });
                        } else {
                            const Y = document[bh(0x303)]('div');
                            Y[bh(0x166)] = 'section-title', Y[bh(0x1ba)] = this['aw'](f[bh(0x1d4)]), w[bh(0x17a)](Y);
                            const Z = document[bh(0x303)](f[bh(0x27d)]);
                            Z['className'] = bh(0x2a4);
                            for (const [a0, a1] of G)
                                Z['appendChild'](this[bh(0x367)](a1));
                            w['appendChild'](Z);
                        }
                    }
                    const shortcutContainer = document[bh(0x303)](f[bh(0x27d)]);
                    shortcutContainer['style'][bh(0x293)] = f[bh(0x230)], shortcutContainer[bh(0x24b)][bh(0x3cb)] = f[bh(0x312)], shortcutContainer[bh(0x24b)]['color'] = f[bh(0x116)], shortcutContainer[bh(0x24b)]['display'] = f[bh(0x3f2)], shortcutContainer[bh(0x24b)][bh(0x2bb)] = f['HpNtA'], shortcutContainer['style'][bh(0x147)] = bh(0x19c), shortcutContainer['style'][bh(0x2a5)] = f[bh(0x382)], shortcutContainer[bh(0x24b)][bh(0x335)] = f[bh(0x298)], shortcutContainer[bh(0x24b)][bh(0x2b6)] = f['DArjV'];
                    const H = document[bh(0x303)](bh(0x3cc));
                    H['style'][bh(0x279)] = f[bh(0x27f)], H['style'][bh(0x400)] = f[bh(0x2fc)], H['textContent'] = this['aw']('Menu_Section_Shortcut'), shortcutContainer['appendChild'](H);
                    const I = document['createElement'](f[bh(0x27d)]);
                    I['textContent'] = this['aw'](f[bh(0x1fc)]), shortcutContainer[bh(0x17a)](I), w['appendChild'](shortcutContainer);
                    let J = document[bh(0x303)](f[bh(0x27d)]);
                    J['className'] = f['FYTWu'];
                    let K = document[bh(0x303)](f[bh(0x154)]);
                    K['id'] = f[bh(0x353)], K['textContent'] = this['aw'](f[bh(0x1b2)]), K[bh(0x33c)](f[bh(0x1f6)], () => this['saveSettings']());
                    let L = document[bh(0x303)](f[bh(0x154)]);
                    L['id'] = f[bh(0x288)], L[bh(0x1ba)] = this['aw'](f[bh(0x3a5)]), L[bh(0x33c)](f['JxJSm'], () => this['aC']()), J[bh(0x17a)](K), J[bh(0x17a)](L), w['appendChild'](J);
                    const M = document['createElement'](bh(0x3cc));
                    M[bh(0x166)] = bh(0x372);
                    const N = document['createElement'](f[bh(0x27d)]);
                    N[bh(0x166)] = bh(0x275);
                    const O = document[bh(0x303)](f[bh(0x36c)]);
                    O['className'] = bh(0x3e4), O['textContent'] = f[bh(0x1f5)](this['aw']('Menu_Author_Title'), ':');
                    const P = document['createElement'](f[bh(0x36c)]);
                    P[bh(0x166)] = f[bh(0x36a)], P[bh(0x1ba)] = this['aw'](f['nawjM']), N['appendChild'](O), N['appendChild'](P), M[bh(0x17a)](N);
                    const Q = document[bh(0x303)](f['rFMlI']);
                    Q[bh(0x166)] = f[bh(0x146)];
                    const R = document['createElement'](bh(0x2ad));
                    R[bh(0x166)] = f[bh(0x1de)], R[bh(0x1ba)] = this['aw'](f[bh(0x1ca)]) + ':';
                    const emailLink = document['createElement']('a');
                    emailLink[bh(0x26b)] = 'mailto:julong@111.com', emailLink[bh(0x1ba)] = f['caFhc'], Q[bh(0x17a)](R), Q[bh(0x17a)](emailLink), M[bh(0x17a)](Q), w['appendChild'](M), document[bh(0x31b)][bh(0x17a)](w), this['settingPanelElement'] = w, this['settingPanelInitialized'] = !0x0;
                } else {
                    const a2 = this['ap']['reduce']((a3, a4) => Math[bh(0x352)](parseFloat(a4) - a2) < Math[bh(0x352)](parseFloat(a3) - j) ? a4 : a3);
                    h = this['ap'][bh(0x17f)](a2);
                }
            },
            'createSettingItem': function (t) {
                const bl = b9, u = {
                        'YFvlk': f[bl(0x248)],
                        'PgDsj': function (z, A) {
                            return z + A;
                        },
                        'qQCem': function (z, A) {
                            const bm = bl;
                            return f[bm(0x2ba)](z, A);
                        },
                        'TnDRS': f['Biqwb'],
                        'XYWfY': f[bl(0x3f5)],
                        'xfkvg': function (z, A) {
                            return z + A;
                        }
                    };
                let functionDiv = document['createElement'](bl(0x3cc));
                functionDiv[bl(0x166)] = f[bl(0x37d)];
                let functionValue = f[bl(0x361)](GM_getValue, t['ax'], !0x1), v = document[bl(0x303)](bl(0x159));
                v['type'] = f[bl(0x3e8)], v[bl(0x143)] = functionValue, v['id'] = t[bl(0x3ca)], functionDiv['appendChild'](v);
                let w = document[bl(0x303)](f[bl(0x1d8)]);
                if (w['setAttribute'](f[bl(0x39b)], t[bl(0x3ca)]), t['aD']) {
                    const z = document[bl(0x303)]('span');
                    z['className'] = bl(0x113), z['textContent'] = '★', w[bl(0x17a)](z);
                }
                const x = document[bl(0x14b)](t['text']);
                if (w[bl(0x17a)](x), functionDiv[bl(0x17a)](w), t['ao']) {
                    if (f['Lbele'](bl(0x149), bl(0x34d))) {
                        let A = document['createElement'](f[bl(0x314)]);
                        A['id'] = t['ao'], this['ap']['forEach'](B => {
                            const bn = bl;
                            if (u['qQCem'](u['TnDRS'], u[bn(0x235)])) {
                                let D = document[bn(0x303)](u[bn(0x19b)]);
                                D[bn(0x323)] = f, D['textContent'] = u[bn(0x3d5)](g, 'x'), h[bn(0x17a)](D);
                            } else {
                                let D = document[bn(0x303)](u[bn(0x19b)]);
                                D[bn(0x323)] = B, D[bn(0x1ba)] = u['xfkvg'](B, 'x'), A[bn(0x17a)](D);
                            }
                        }), A[bl(0x323)] = f['UCndo'](GM_getValue, t['ao'], this['defaultSpeed']), functionDiv['appendChild'](A);
                    } else {
                        const B = f[bl(0x28f)](GM_getValue, this['av'], this[bl(0x25a)]), C = this['az'](B);
                        C[bl(0x135)] ? this['ap'] = C['ap'] : this['ap'] = this[bl(0x25a)][bl(0x1b1)](/[,，]/)[bl(0x313)](D => parseFloat(D)[bl(0x3c3)](0x1));
                    }
                }
                return functionDiv;
            },
            'saveSettings': function () {
                const bp = b9, t = {
                        'FFvlv': function (v, w, x) {
                            const bo = b;
                            return f[bo(0x2af)](v, w, x);
                        },
                        'wtZnn': f[bp(0x15a)],
                        'fdpoF': f[bp(0x29d)],
                        'OzpZu': f['mWFif'],
                        'JzIcu': f[bp(0x2c0)],
                        'dViBf': bp(0x1ff),
                        'JapEh': f[bp(0x39d)],
                        'uRtKV': bp(0x3a1),
                        'HRhZS': f['glCsf'],
                        'ciDPQ': f[bp(0x34e)],
                        'ghVZs': f[bp(0x20d)],
                        'JVFDv': f[bp(0x240)],
                        'xPuEa': f[bp(0x2b5)],
                        'bmutA': bp(0x201),
                        'dLutQ': f[bp(0x123)],
                        'rnzVN': f[bp(0x199)],
                        'JSSXg': f[bp(0x2d5)],
                        'SWDav': bp(0x178),
                        'DtWRK': f[bp(0x2cd)],
                        'VyiXY': bp(0x1fe),
                        'VmQqc': f['OiKlN']
                    };
                if (f[bp(0x2b8)](f[bp(0x2b1)], f[bp(0x3d2)])) {
                    const v = document[bp(0x11b)](f[bp(0x1cf)]), w = document['getElementById'](f[bp(0x192)]), x = this['az'](v[bp(0x323)]);
                    if (!x[bp(0x135)])
                        return v[bp(0x31f)][bp(0x130)](f[bp(0x3a3)]), void w[bp(0x31f)][bp(0x130)](f[bp(0x1f9)]);
                    v[bp(0x31f)][bp(0x27c)](f[bp(0x3a3)]), w[bp(0x31f)]['remove'](f['iVyLS']), this['aA'](x['ap'], v[bp(0x323)]), f[bp(0x2af)](GM_setValue, this['av'], v[bp(0x323)]), localStorage[bp(0x318)](this['av'], v[bp(0x323)]);
                    for (const [y, z] of Object['entries'](this[bp(0x190)])) {
                        const A = document[bp(0x11b)](z['classId'])[bp(0x143)];
                        if (f[bp(0x14a)](GM_setValue, z['ax'], A), localStorage[bp(0x318)](z['ax'], A['toString']()), z['ao']) {
                            const B = document['getElementById'](z['ao'])[bp(0x323)];
                            f[bp(0x2af)](GM_setValue, z['ao'], B);
                        }
                    }
                    this[bp(0x39e)][bp(0x31f)][bp(0x2c6)](f[bp(0x1f9)]);
                } else {
                    this['ay']();
                    for (const [C, D] of Object[bp(0x360)](this[bp(0x190)])) {
                        const E = t['FFvlv'](GM_getValue, D['ax'], !0x1);
                        localStorage['setItem'](D['ax'], E[bp(0x3bb)]());
                    }
                    i['includes'](t['wtZnn']) ? this['settingPanelItems'] = {
                        'Youtube_Action_Rate': {
                            'classId': bp(0x34f),
                            'text': this['aw'](t['fdpoF']),
                            'ax': bp(0x19d),
                            'ao': bp(0x29f),
                            'aD': !0x0
                        },
                        'Youtube_Action_TheaterMode': {
                            'classId': t[bp(0x274)],
                            'text': this['aw'](t[bp(0x274)]),
                            'ax': t[bp(0x274)],
                            'aD': !0x0
                        },
                        'Youtube_Remove_Autoplay': {
                            'classId': t[bp(0x3fa)],
                            'text': this['aw'](t['JzIcu']),
                            'ax': t[bp(0x3fa)]
                        },
                        'Youtube_Remove_Subtitles': {
                            'classId': t[bp(0x3b7)],
                            'text': this['aw'](t[bp(0x3b7)]),
                            'ax': t[bp(0x3b7)]
                        },
                        'Youtube_Remove_Settings': {
                            'classId': t[bp(0x218)],
                            'text': this['aw'](t['JapEh']),
                            'ax': 'Youtube_Remove_Settings'
                        },
                        'Youtube_Remove_TheaterMode': {
                            'classId': t[bp(0x23b)],
                            'text': this['aw'](t[bp(0x23b)]),
                            'ax': t[bp(0x23b)]
                        }
                    } : f['includes'](t['HRhZS']) && (this['settingPanelItems'] = {
                        'Bilibili_Action_Rate': {
                            'classId': 'Bilibili_Action_Rate',
                            'text': this['aw'](t[bp(0x321)]),
                            'ax': t[bp(0x1ae)],
                            'ao': t[bp(0x327)],
                            'aD': !0x0
                        },
                        'Bilibili_Action_WebFullscreen': {
                            'classId': t[bp(0x232)],
                            'text': this['aw'](t['xPuEa']),
                            'ax': t[bp(0x232)],
                            'aD': !0x0
                        },
                        'Bilibili_Remove_WebFullscreen': {
                            'classId': t[bp(0x3a4)],
                            'text': this['aw']('Bilibili_Remove_WebFullscreen'),
                            'ax': t[bp(0x3a4)]
                        },
                        'Bilibili_Remove_Quality': {
                            'classId': t['dLutQ'],
                            'text': this['aw'](t[bp(0x124)]),
                            'ax': t[bp(0x124)]
                        },
                        'Bilibili_Remove_Eplist': {
                            'classId': t['rnzVN'],
                            'text': this['aw']('Bilibili_Remove_Eplist'),
                            'ax': t['rnzVN']
                        },
                        'Bilibili_Remove_Pip': {
                            'classId': t[bp(0x138)],
                            'text': this['aw'](t[bp(0x138)]),
                            'ax': t[bp(0x138)]
                        },
                        'Bilibili_Remove_Wide': {
                            'classId': t[bp(0x36e)],
                            'text': this['aw'](t['SWDav']),
                            'ax': t[bp(0x36e)]
                        },
                        'Bilibili_Remove_Speed': {
                            'classId': t[bp(0x354)],
                            'text': this['aw'](bp(0x14c)),
                            'ax': t[bp(0x354)]
                        },
                        'Bilibili_Remove_Comments': {
                            'classId': t[bp(0x246)],
                            'text': this['aw'](t['VyiXY']),
                            'ax': t[bp(0x246)]
                        },
                        'Bilibili_Remove_Settings': {
                            'classId': 'Bilibili_Remove_Settings',
                            'text': this['aw'](t['VmQqc']),
                            'ax': bp(0x220)
                        }
                    });
                }
            },
            'aC': function () {
                const bq = b9, t = {};
                t[bq(0x180)] = f[bq(0x347)], t[bq(0x1eb)] = f['rFMlI'], t['lQxEg'] = f[bq(0x151)];
                const u = t;
                if (this['settingPanelInitialized']) {
                    if (f[bq(0x402)](f[bq(0x33e)], bq(0x2e1))) {
                        const w = f['vIIza'](GM_getValue, this['av'], this['defaultSpeedList']), x = this['az'](w);
                        x[bq(0x135)] && this['aA'](x['ap'], w);
                    } else {
                        const y = document['createElement'](bq(0x3cc));
                        y[bq(0x166)] = BsJvhC[bq(0x180)], y[bq(0x1ba)] = this['aw']('Menu_Section_Remove'), f[bq(0x17a)](y);
                        const z = document[bq(0x303)](BsJvhC['xlnAN']);
                        z['className'] = BsJvhC[bq(0x125)];
                        for (const [A, B] of i)
                            z[bq(0x17a)](this[bq(0x367)](B));
                        h[bq(0x17a)](z);
                    }
                } else
                    this['initializePanel']();
                this[bq(0x39e)][bq(0x31f)][bq(0x2c6)](f[bq(0x1f9)]);
            },
            'initSettingItems': function (t) {
                const br = b9;
                this['ay']();
                for (const [u, v] of Object[br(0x360)](this[br(0x190)])) {
                    const w = f[br(0x361)](GM_getValue, v['ax'], !0x1);
                    localStorage[br(0x318)](v['ax'], w[br(0x3bb)]());
                }
                t['includes'](f[br(0x15a)]) ? this[br(0x190)] = {
                    'Youtube_Action_Rate': {
                        'classId': f[br(0x29d)],
                        'text': this['aw'](f[br(0x29d)]),
                        'ax': f[br(0x357)],
                        'ao': f[br(0x3b3)],
                        'aD': !0x0
                    },
                    'Youtube_Action_TheaterMode': {
                        'classId': f[br(0x38d)],
                        'text': this['aw']('Youtube_Action_TheaterMode'),
                        'ax': br(0x1bf),
                        'aD': !0x0
                    },
                    'Youtube_Remove_Autoplay': {
                        'classId': 'Youtube_Remove_Autoplay',
                        'text': this['aw'](br(0x2a6)),
                        'ax': 'Youtube_Remove_Autoplay'
                    },
                    'Youtube_Remove_Subtitles': {
                        'classId': f[br(0x292)],
                        'text': this['aw'](f[br(0x292)]),
                        'ax': f[br(0x292)]
                    },
                    'Youtube_Remove_Settings': {
                        'classId': f[br(0x39d)],
                        'text': this['aw'](f[br(0x39d)]),
                        'ax': f[br(0x39d)]
                    },
                    'Youtube_Remove_TheaterMode': {
                        'classId': 'Youtube_Remove_TheaterMode',
                        'text': this['aw'](f[br(0x2a7)]),
                        'ax': f[br(0x2a7)]
                    }
                } : t[br(0x132)](f[br(0x1bd)]) && (this[br(0x190)] = {
                    'Bilibili_Action_Rate': {
                        'classId': br(0x36d),
                        'text': this['aw'](f[br(0x34e)]),
                        'ax': f[br(0x20d)],
                        'ao': f['hCnSw'],
                        'aD': !0x0
                    },
                    'Bilibili_Action_WebFullscreen': {
                        'classId': f[br(0x2b5)],
                        'text': this['aw'](br(0x2eb)),
                        'ax': br(0x2eb),
                        'aD': !0x0
                    },
                    'Bilibili_Remove_WebFullscreen': {
                        'classId': 'Bilibili_Remove_WebFullscreen',
                        'text': this['aw'](br(0x201)),
                        'ax': f[br(0x21b)]
                    },
                    'Bilibili_Remove_Quality': {
                        'classId': f[br(0x123)],
                        'text': this['aw'](f[br(0x123)]),
                        'ax': f[br(0x123)]
                    },
                    'Bilibili_Remove_Eplist': {
                        'classId': 'Bilibili_Remove_Eplist',
                        'text': this['aw'](f[br(0x199)]),
                        'ax': f[br(0x199)]
                    },
                    'Bilibili_Remove_Pip': {
                        'classId': f[br(0x2d5)],
                        'text': this['aw'](f[br(0x2d5)]),
                        'ax': f[br(0x2d5)]
                    },
                    'Bilibili_Remove_Wide': {
                        'classId': f['NmOsp'],
                        'text': this['aw'](f[br(0x182)]),
                        'ax': f[br(0x182)]
                    },
                    'Bilibili_Remove_Speed': {
                        'classId': br(0x14c),
                        'text': this['aw'](f[br(0x2cd)]),
                        'ax': br(0x14c)
                    },
                    'Bilibili_Remove_Comments': {
                        'classId': f['JwTBH'],
                        'text': this['aw']('Bilibili_Remove_Comments'),
                        'ax': f[br(0x1c8)]
                    },
                    'Bilibili_Remove_Settings': {
                        'classId': f[br(0x136)],
                        'text': this['aw'](br(0x220)),
                        'ax': f[br(0x136)]
                    }
                });
            },
            'aE': function (t, u) {
                const bt = b9, v = {
                        'PbGKr': function (z, A) {
                            const bs = b;
                            return f[bs(0x409)](z, A);
                        }
                    };
                if (console[bt(0x280)](f[bt(0x291)]), document[bt(0x299)]('#speedButtons'))
                    return;
                this['aq'][0x0];
                let w = document['createElement'](f['rFMlI']);
                w['id'] = f[bt(0x2f0)], w[bt(0x24b)][bt(0x1ea)] = f[bt(0x3f2)], w[bt(0x24b)][bt(0x147)] = f[bt(0x3ac)], w[bt(0x24b)][bt(0x174)] = f[bt(0x3ac)];
                const x = window[bt(0x224)][bt(0x26b)]['includes'](bt(0x2f7));
                x ? (w['style'][bt(0x271)] = f[bt(0x339)], w['style']['marginTop'] = f['MMYiM']) : w[bt(0x24b)][bt(0x271)] = f[bt(0x339)], w[bt(0x24b)]['width'] = 'auto';
                const y = z => {
                    window['aF']['aG'] = z, this['aH'](z);
                };
                for (let z = 0x0; f['epUGO'](z, this['ap']['length']); z++) {
                    const A = f[bt(0x355)](parseFloat, this['ap'][z]);
                    f[bt(0x1c3)](A, 0x1) && this['aq'][0x1], f['gbivv'](A, 1.5) && this['aq'][0x2];
                    let B = document[bt(0x303)](f[bt(0x154)]);
                    B[bt(0x24b)][bt(0x335)] = bt(0x2c8), B[bt(0x24b)][bt(0x21c)] = f['zdgsi'], B[bt(0x24b)][bt(0x2c4)] = f[bt(0x3d4)], B['style']['borderRadius'] = f[bt(0x3e9)], B[bt(0x24b)][bt(0x307)] = f[bt(0x273)], B[bt(0x24b)][bt(0x202)] = f['XRdWV'], B[bt(0x24b)][bt(0x1e0)] = bt(0x161), B[bt(0x24b)][bt(0x1ea)] = f[bt(0x3f2)], B[bt(0x24b)]['justifyContent'] = bt(0x19c), B[bt(0x24b)][bt(0x147)] = 'center', B[bt(0x24b)][bt(0x1d5)] = '30px', B['style'][bt(0x271)] = x ? f[bt(0x13d)] : '22px', B[bt(0x24b)][bt(0x3cb)] = x ? f[bt(0x2cf)] : f[bt(0x312)], B[bt(0x1ba)] = f[bt(0x1f5)](this['ap'][z], '×'), B['className'] = f[bt(0x1fa)], B['dataset'][bt(0x3b5)] = this['ap'][z], B[bt(0x33c)](f[bt(0x1f6)], () => {
                        const bu = bt;
                        u ? v[bu(0x2e3)](u, this['ap'][z]) : y(this['ap'][z]);
                    }), w[bt(0x17a)](B);
                }
                f[bt(0x355)](t, w);
            },
            'aH': function (t) {
                const bv = b9, u = document[bv(0x15c)](bv(0x16d))[0x0];
                u && (u['playbackRate'] = f[bv(0x409)](parseFloat, t), this['aI'](t), this['aJ'](t));
            },
            'aJ': function (t) {
                const bw = b9;
                if (f[bw(0x23e)](f[bw(0x1f8)], f[bw(0x1f8)])) {
                    const v = location[bw(0x26b)];
                    f['YhSsy'](v, lastUrl) && (h[bw(0x280)](bw(0x1da)), i[bw(0x280)](f[bw(0x269)], lastUrl), j[bw(0x280)](bw(0x17b), v), lastUrl = v, v['includes'](f[bw(0x263)]) && (k[bw(0x280)](f['xUOPr']), f[bw(0x405)](main)), l[bw(0x280)](f[bw(0x2c1)]));
                } else {
                    if (this['au'] && f['PpyES'](clearTimeout, this['au']), !this['at']) {
                        if (f[bw(0x402)](f['qUuey'], f['Skxxu'])) {
                            const v = document['querySelector'](h['aK']), w = document[bw(0x15c)](f[bw(0x270)])[0x0];
                            v && !window['aF']['aL'] && w ? (i['log'](f[bw(0x326)]), j['aH'](0x1), window['aF']['aL'] = !0x0) : !v && window['aF']['aL'] && w && (k[bw(0x280)](f[bw(0x1f5)]('广告已结束，恢复播放速度为', window['aF']['aG'])), l['aH'](window['aF']['aG']), window['aF']['aL'] = !0x1);
                        } else {
                            const indicator = document[bw(0x303)](bw(0x3cc));
                            indicator[bw(0x24b)][bw(0x2d6)] = f[bw(0x32a)], indicator[bw(0x24b)][bw(0x150)] = bw(0x1c0), indicator[bw(0x24b)][bw(0x2b7)] = f[bw(0x1ec)], indicator[bw(0x24b)][bw(0x1ed)] = f[bw(0x407)], indicator[bw(0x24b)][bw(0x335)] = bw(0x375), indicator[bw(0x24b)][bw(0x307)] = f[bw(0x1f7)], indicator['style'][bw(0x2a5)] = bw(0x128), indicator[bw(0x24b)][bw(0x2b6)] = f[bw(0x285)], indicator[bw(0x24b)][bw(0x3cb)] = f['XznEK'], indicator[bw(0x24b)][bw(0x279)] = f[bw(0x344)], indicator[bw(0x24b)][bw(0x2aa)] = f[bw(0x3d8)], indicator['style'][bw(0x1a1)] = f[bw(0x3f0)], indicator['style'][bw(0x1a6)] = f[bw(0x1d2)], indicator[bw(0x24b)][bw(0x31e)] = '0', document[bw(0x31b)][bw(0x17a)](indicator), this['at'] = indicator;
                        }
                    }
                    const fullscreenElement = document[bw(0x203)] || document['webkitFullscreenElement'];
                    fullscreenElement ? f['YhSsy'](this['at'][bw(0x18e)], fullscreenElement) && fullscreenElement[bw(0x17a)](this['at']) : f['Lbele'](this['at'][bw(0x18e)], document[bw(0x31b)]) && document[bw(0x31b)][bw(0x17a)](this['at']), this['at'][bw(0x1ba)] = t + 'x', this['at'][bw(0x24b)]['opacity'] = '1', this['au'] = f[bw(0x28f)](setTimeout, () => {
                        const bx = bw;
                        this['at'][bx(0x24b)][bx(0x31e)] = '0';
                    }, 0x1f4);
                }
            },
            'aI': function (t) {
                const by = b9, u = void 0x0;
                document[by(0x129)](f[by(0x22c)])['forEach'](w => w[by(0x31f)]['remove'](by(0x27e)));
                const v = document[by(0x299)]('.speed-control-button[data-speed=\x22' + t + '\x22]');
                v && v[by(0x31f)]['add'](f['BpQqs']);
            },
            'handleKeydown': function (t) {
                const bz = b9, u = {
                        'QqfLO': f['cZCQX'],
                        'omRDE': f[bz(0x1f9)],
                        'NxQkd': function (A, B, C) {
                            const bA = bz;
                            return f[bA(0x17e)](A, B, C);
                        },
                        'lADZd': function (A, B, C) {
                            const bB = bz;
                            return f[bB(0x28f)](A, B, C);
                        },
                        'lTEiw': function (A, B, C) {
                            const bC = bz;
                            return f[bC(0x167)](A, B, C);
                        }
                    }, v = t['target'];
                if (f[bz(0x1f2)] === v['tagName'] || f[bz(0x2f8)](f[bz(0x119)], v[bz(0x40a)]) || v['isContentEditable'])
                    return;
                const w = document[bz(0x15c)](f['mbUIs'])[0x0];
                if (!w)
                    return;
                const x = w[bz(0x24e)];
                let y = this['ap'][bz(0x396)](A => parseFloat(A) === x);
                if (-0x1 === y) {
                    if ('lDyhT' !== f[bz(0x194)]) {
                        const A = this['ap']['reduce']((B, C) => Math[bz(0x352)](parseFloat(C) - x) < Math[bz(0x352)](parseFloat(B) - x) ? C : B);
                        y = this['ap'][bz(0x17f)](A);
                    } else {
                        const B = document[bz(0x11b)](bz(0x3b8)), C = document[bz(0x11b)](bz(0x3b6)), D = this['az'](B[bz(0x323)]);
                        if (!D['valid'])
                            return B['classList'][bz(0x130)](UgEMow[bz(0x28c)]), void C[bz(0x31f)][bz(0x130)](UgEMow[bz(0x1bc)]);
                        B['classList'][bz(0x27c)](UgEMow[bz(0x28c)]), C[bz(0x31f)]['remove'](UgEMow[bz(0x1bc)]), this['aA'](D['ap'], B[bz(0x323)]), UgEMow[bz(0x142)](GM_setValue, this['av'], B[bz(0x323)]), localStorage[bz(0x318)](this['av'], B[bz(0x323)]);
                        for (const [E, F] of Object[bz(0x360)](this[bz(0x190)])) {
                            const G = document['getElementById'](F['classId'])['checked'];
                            if (UgEMow[bz(0x3f7)](GM_setValue, F['ax'], G), localStorage[bz(0x318)](F['ax'], G[bz(0x3bb)]()), F['ao']) {
                                const H = document[bz(0x11b)](F['ao'])[bz(0x323)];
                                UgEMow['lTEiw'](GM_setValue, F['ao'], H);
                            }
                        }
                        this[bz(0x39e)][bz(0x31f)][bz(0x2c6)](UgEMow[bz(0x1bc)]);
                    }
                }
                let newIndex = y;
                if (bz(0x309) === t[bz(0x255)])
                    f['XSfmd'](y, 0x0) && (newIndex = f[bz(0x22b)](y, 0x1));
                else {
                    if (f[bz(0x371)](f[bz(0x188)], t[bz(0x255)]))
                        return;
                    y < f[bz(0x22b)](this['ap'][bz(0x175)], 0x1) && (newIndex = f[bz(0x1fb)](y, 0x1));
                }
                this['aH'](this['ap'][newIndex]), window['aF']['aG'] = this['ap'][newIndex];
            }
        }, n = {
            'aM': b9(0x406),
            'aN': f['CeMQt'],
            'autoplayToggleBtn': f[b9(0x40c)],
            'aO': f[b9(0x117)],
            'settingsBtn': f[b9(0x1dc)],
            'aP': f[b9(0x1a2)],
            'finishListener': f[b9(0x181)],
            'liveStreamClass': f[b9(0x2a2)],
            'aK': f[b9(0x26d)]
        }, o = {
            'playerContainer': f[b9(0x14f)],
            'webscreenClass': f['NwJHn'],
            'webFullClass': f['AURNA'],
            'aQ': f[b9(0x2be)],
            'aM': f[b9(0x234)],
            'aR': f[b9(0x12f)],
            'aS': b9(0x1b6),
            'aT': f[b9(0x2a0)],
            'aB': f['SgWSp'],
            'aU': f[b9(0x126)],
            'aV': f[b9(0x3b0)],
            'aW': f['ZgcYo'],
            'settingsBtn': f[b9(0x29a)],
            'aX': f['XrHJS'],
            'aY': f[b9(0x32f)]
        }, p = {
            'Youtube_Remove_Autoplay': {
                'selector': n['autoplayToggleBtn'],
                'mode': f['zzwDx']
            },
            'Youtube_Remove_Subtitles': {
                'selector': n['aO'],
                'mode': f['zzwDx']
            },
            'Youtube_Remove_Settings': {
                'selector': n[b9(0x118)],
                'mode': f[b9(0x2d4)]
            },
            'Youtube_Remove_TheaterMode': {
                'selector': n['aP'],
                'mode': 'remove'
            }
        }, q = {
            'Bilibili_Remove_Quality': {
                'selector': o['aS'],
                'mode': f[b9(0x2d4)]
            },
            'Bilibili_Remove_Eplist': {
                'selector': o['aT'],
                'mode': 'remove'
            },
            'Bilibili_Remove_Pip': {
                'selector': o['aU'],
                'mode': f[b9(0x2d4)]
            },
            'Bilibili_Remove_Wide': {
                'selector': o['aV'],
                'mode': f[b9(0x2d4)]
            },
            'Bilibili_Remove_Speed': {
                'selector': o['aW'],
                'mode': f[b9(0x2d4)]
            },
            'Bilibili_Remove_Comments': {
                'selector': o['aR'],
                'mode': f[b9(0x2b2)]
            },
            'Bilibili_Remove_Settings': {
                'selector': o[b9(0x118)],
                'mode': 'remove'
            },
            'Bilibili_Remove_WebFullscreen': {
                'selector': o['aB'],
                'mode': f['ZpDVv']
            }
        }, r = {
            'aZ': async function () {
                const bD = b9;
                if (f['Lbele'](f[bD(0x209)], f[bD(0x193)])) {
                    if (window['aF'][bD(0x152)])
                        return void console['log'](f[bD(0x1fd)]);
                    window['aF'][bD(0x152)] = !0x0, console[bD(0x280)](f[bD(0x3a0)]);
                    try {
                        let v = await elmGetter['get'](n['aM']);
                        console[bD(0x280)](f[bD(0x398)]), m['aE'](w => {
                            const bE = bD;
                            v[bE(0x25c)](w), console[bE(0x280)](bE(0x15e));
                            const x = document[bE(0x15c)](bE(0x16d))[0x0];
                            x && (console['log'](bE(0x2b0), x['playbackRate']), m['aI'](x['playbackRate'][bE(0x3bb)]()));
                        }, w => {
                            const bF = bD;
                            console[bF(0x280)](f[bF(0x2d3)], w), m['aH'](w), window['aF']['b0'] = !0x1;
                        });
                    } catch (w) {
                        console[bD(0x1a0)](f[bD(0x28a)], w);
                    }
                    try {
                        for (const x in p)
                            f[bD(0x361)](GM_getValue, m[bD(0x190)][x]?.['ax'], !0x1) && elmGetter[bD(0x141)](p[x][bD(0x392)])[bD(0x38a)](y => {
                                const bG = bD;
                                console[bG(0x280)](bG(0x330), m['aw'](x), bG(0x3a9), p[x][bG(0x38b)]), f['fBaBp'](f[bG(0x2b2)], p[x][bG(0x38b)]) ? (y[bG(0x24b)][bG(0x1d5)] = '0', y[bG(0x24b)]['overflow'] = f[bG(0x20c)], y[bG(0x24b)][bG(0x3cf)] = '0') : y[bG(0x27c)]();
                            });
                    } catch (y) {
                        console['error'](f[bD(0x22f)], y);
                    }
                    f[bD(0x359)](GM_getValue, m[bD(0x190)][bD(0x1bf)]?.['ax'], !0x1) && (console[bD(0x280)](f['AyFvp']), elmGetter[bD(0x141)](n['aP'])[bD(0x38a)](z => {
                        const bH = bD, A = {
                                'HXtAV': f['OHslc'],
                                'oMgNw': bH(0x3cd),
                                'JEcNT': f[bH(0x270)],
                                'WNFtc': f[bH(0x165)],
                                'cWGQR': f[bH(0x2e5)],
                                'gFORl': function (C, D) {
                                    const bI = bH;
                                    return f[bI(0x409)](C, D);
                                },
                                'JutFH': function (C, D, E) {
                                    return f['vIIza'](C, D, E);
                                },
                                'YnwQr': bH(0x148),
                                'QZxbu': f[bH(0x3e5)],
                                'DZyRR': f[bH(0x3ef)],
                                'VSFjD': bH(0x23c),
                                'XojjZ': function (C, D, E) {
                                    const bJ = bH;
                                    return f[bJ(0x28f)](C, D, E);
                                },
                                'DcFLz': function (C, D) {
                                    const bK = bH;
                                    return f[bK(0x20b)](C, D);
                                },
                                'rkJDU': function (C, D) {
                                    const bL = bH;
                                    return f[bL(0x1fb)](C, D);
                                },
                                'WYoOB': f[bH(0x25b)],
                                'tpqWd': f['gZqVv'],
                                'XmYES': bH(0x176),
                                'pJMza': f['YEPkW']
                            };
                        if (f[bH(0x2b8)]('ioGDI', f[bH(0x162)])) {
                            const C = {};
                            C[bH(0x15d)] = A[bH(0x1b8)], C[bH(0x364)] = function (F, G) {
                                return F + G;
                            }, C[bH(0x35f)] = A[bH(0x2bc)], C['xibrC'] = A[bH(0x29e)], C[bH(0x210)] = '已检测到广告，重置播放速度为1.0', C[bH(0x2cb)] = A[bH(0x169)];
                            const D = C;
                            H['log'](A[bH(0x2d0)]), A[bH(0x1d3)](GM_addStyle, I), A[bH(0x3d6)](GM_registerMenuCommand, J['aw'](A['YnwQr']), K['aC']['bind'](L)), document[bH(0x33c)](A['QZxbu'], M[bH(0x343)][bH(0x3b2)](N));
                            const E = void 0x0;
                            A['JutFH'](GM_getValue, A[bH(0x331)], !0x1) || (O['log'](A[bH(0x401)]), A[bH(0x3d6)](GM_setValue, A[bH(0x331)], !0x0), A[bH(0x231)](setTimeout, () => {
                                const bM = bH;
                                E['aC'][bM(0x3b2)](ad)();
                            }, 0x1f4)), window[bH(0x224)][bH(0x26b)][bH(0x132)](bH(0x112)) && (A[bH(0x1a9)](null, window['aF']['aG']) && (window['aF']['aG'] = A[bH(0x1d3)](parseFloat, A[bH(0x231)](GM_getValue, R[bH(0x190)][bH(0x34f)]?.['ao'], S['defaultSpeed'])), T['log'](A['rkJDU'](A[bH(0x3ad)], window['aF']['aG']))), U['log'](A[bH(0x1b3)]), window[bH(0x33c)](V[bH(0x381)], () => E['init']()), X['log'](bH(0x284)), Y = A[bH(0x3d6)](setInterval, () => {
                                const bN = bH, b5 = document[bN(0x299)](E['aN']), b6 = b5 && b5[bN(0x31f)][bN(0x219)](ad['liveStreamClass']), b7 = void 0x0;
                                window['location'][bN(0x26b)]['includes'](bN(0x40e)) && (b6 && !window['aF']['b0'] ? (ae['aH'](0x1), af[bN(0x280)](D['bXJae']), window['aF']['b0'] = !0x0) : !b6 && window['aF']['b0'] && (ag['aH'](window['aF']['aG']), ah[bN(0x280)](D[bN(0x364)](D['fAYGC'], window['aF']['aG'])), window['aF']['b0'] = !0x1));
                            }, 0x3e8), a5[bH(0x280)](A['XmYES']), window['aF']['b1'] = A['XojjZ'](setInterval, () => {
                                const bO = bH, aj = document['querySelector'](E['aK']), ak = document[bO(0x15c)](D[bO(0x1c7)])[0x0];
                                aj && !window['aF']['aL'] && ak ? (ad[bO(0x280)](D[bO(0x210)]), ae['aH'](0x1), window['aF']['aL'] = !0x0) : !aj && window['aF']['aL'] && ak && (af[bO(0x280)](D[bO(0x364)](D[bO(0x2cb)], window['aF']['aG'])), ag['aH'](window['aF']['aG']), window['aF']['aL'] = !0x1);
                            }, 0xc8)), window['aF'][bH(0x38f)] = !0x0, ab['log'](A[bH(0x12a)]);
                        } else
                            console[bH(0x280)](f[bH(0x156)]), z[bH(0x221)]();
                    }));
                    const u = f['UCndo'](GM_getValue, m[bD(0x190)]['Youtube_Action_Rate']?.['ax'], !0x1);
                    if (console[bD(0x280)](f[bD(0x1b7)], u ? f[bD(0x197)] : f[bD(0x13f)]), u) {
                        const z = document[bD(0x299)](n['aK']), A = !!z;
                        if (console[bD(0x280)](f['YUQgn'], A), z)
                            console[bD(0x280)](f[bD(0x1c5)]);
                        else {
                            const B = f[bD(0x355)](parseFloat, f[bD(0x294)](GM_getValue, m[bD(0x190)]['Youtube_Action_Rate']?.['ao'], m[bD(0x3ff)]));
                            console['log'](f[bD(0x3fd)], B), m['aH'](B), window['aF']['b0'] = !0x1;
                        }
                    }
                    console['log'](f[bD(0x229)]), window['aF']['isYoutubePageProcessing'] = !0x1;
                } else {
                    const C = {};
                    C[bD(0x23d)] = 'option';
                    const D = C, E = m[bD(0x323)];
                    for (; n[bD(0x324)];)
                        o[bD(0x338)](p[bD(0x324)]);
                    q[bD(0x2ce)](F => {
                        const bP = bD, G = document['createElement'](D[bP(0x23d)]);
                        G[bP(0x323)] = F, G['textContent'] = F + 'x', E[bP(0x17a)](G);
                    }), s[bD(0x132)](E) ? t['value'] = E : u[bD(0x323)] = v[0x0];
                }
            },
            'init': function () {
                const bQ = b9;
                console[bQ(0x280)](f[bQ(0x37c)]), console[bQ(0x280)](f[bQ(0x1a5)], window[bQ(0x224)]['href']), window['location'][bQ(0x26b)][bQ(0x132)](f[bQ(0x3e2)]) && this['aZ'](), console['log'](bQ(0x250));
            }
        }, s = {
            'b2': null,
            'b3': function () {
                const bR = b9, t = {
                        'TWqcK': f['rFMlI'],
                        'SMxFr': f['JMrUY'],
                        'xykzv': f[bR(0x407)],
                        'MGpNx': f[bR(0x2e2)],
                        'iGtRo': f[bR(0x342)],
                        'yMzyI': f[bR(0x344)],
                        'PldEu': f['oHvzy'],
                        'fQOnu': function (v, w) {
                            const bS = bR;
                            return f[bS(0x3c4)](v, w);
                        },
                        'udptF': 'UzGsj',
                        'LqSvj': function (v, w) {
                            return v + w;
                        },
                        'eCJSy': f['QYtlv'],
                        'qfPQm': function (v, w) {
                            const bT = bR;
                            return f[bT(0x1fb)](v, w);
                        },
                        'HZdxv': bR(0x28e),
                        'qAULt': f[bR(0x270)],
                        'wJAiY': bR(0x2b0),
                        'DErgc': function (v, w) {
                            return f['Lbele'](v, w);
                        },
                        'ZhnJr': f[bR(0x188)],
                        'pScKO': function (v, w) {
                            const bU = bR;
                            return f[bU(0x18f)](v, w);
                        },
                        'ddDDs': function (v, w) {
                            const bV = bR;
                            return f[bV(0x1f5)](v, w);
                        },
                        'wRYyn': function (v, w) {
                            const bW = bR;
                            return f[bW(0x402)](v, w);
                        },
                        'BhuTt': f[bR(0x1dd)],
                        'uGPoH': bR(0x35d),
                        'MyDjF': function (v, w) {
                            const bX = bR;
                            return f[bX(0x305)](v, w);
                        },
                        'OfgDT': function (v, w) {
                            return v === w;
                        },
                        'OuAdy': f[bR(0x2cc)],
                        'oWkxW': bR(0x2a1)
                    };
                console[bR(0x280)](f[bR(0x226)]);
                try {
                    elmGetter[bR(0x141)](o['aY'])['then'](targetContainer => {
                        const bZ = bR, KzGMtd = {
                                'ntqCX': function (w, z) {
                                    const bY = b;
                                    return t[bY(0x3a2)](w, z);
                                },
                                'iOAob': t[bZ(0x2ff)],
                                'oyYlP': function (w, z) {
                                    const c0 = bZ;
                                    return t[c0(0x22d)](w, z);
                                },
                                'Wipjx': function (w, z) {
                                    return t['ddDDs'](w, z);
                                }
                            };
                        if (t[bZ(0x25d)](t[bZ(0x2d8)], 'NyVyj'))
                            targetContainer ? m['aE'](w => {
                                const c1 = bZ, x = {};
                                x[c1(0x383)] = t[c1(0x2c7)], x[c1(0x1c6)] = t[c1(0x370)], x[c1(0x21a)] = t[c1(0x3f6)], x[c1(0x13c)] = t[c1(0x306)], x[c1(0x3d7)] = 'white', x[c1(0x387)] = t[c1(0x35e)], x[c1(0x32c)] = t['yMzyI'], x['VnGZT'] = t[c1(0x33d)], x[c1(0x20a)] = 'none';
                                const y = x;
                                if (t[c1(0x1ce)]('mhUrx', t[c1(0x2ee)])) {
                                    const indicator = document[c1(0x303)](sOcCMk[c1(0x383)]);
                                    indicator['style'][c1(0x2d6)] = sOcCMk[c1(0x1c6)], indicator[c1(0x24b)][c1(0x150)] = c1(0x1c0), indicator[c1(0x24b)]['left'] = c1(0x1c0), indicator[c1(0x24b)][c1(0x1ed)] = sOcCMk[c1(0x21a)], indicator[c1(0x24b)][c1(0x335)] = sOcCMk[c1(0x13c)], indicator[c1(0x24b)]['color'] = sOcCMk[c1(0x3d7)], indicator[c1(0x24b)]['padding'] = c1(0x128), indicator[c1(0x24b)][c1(0x2b6)] = c1(0x397), indicator[c1(0x24b)][c1(0x3cb)] = sOcCMk[c1(0x387)], indicator['style'][c1(0x279)] = sOcCMk[c1(0x32c)], indicator[c1(0x24b)][c1(0x2aa)] = sOcCMk[c1(0x30b)], indicator[c1(0x24b)][c1(0x1a1)] = sOcCMk[c1(0x20a)], indicator['style'][c1(0x1a6)] = c1(0x1ac), indicator[c1(0x24b)]['opacity'] = '0', document['body'][c1(0x17a)](indicator), this['at'] = indicator;
                                } else {
                                    console[c1(0x280)](t[c1(0x350)](t[c1(0x254)], o['aY'])), targetContainer[c1(0x324)] ? targetContainer[c1(0x1e1)](w, targetContainer[c1(0x324)]) : targetContainer[c1(0x17a)](w), console[c1(0x280)](t[c1(0x282)](t[c1(0x122)] + o['aY'], c1(0x249)));
                                    const A = document['getElementsByTagName'](t[c1(0x287)])[0x0];
                                    A && (console[c1(0x280)](t['wJAiY'], A[c1(0x24e)]), m['aI'](A['playbackRate'][c1(0x3bb)]()));
                                }
                            }) : console[bZ(0x1a3)](t[bZ(0x18a)]);
                        else {
                            if (KzGMtd['ntqCX'](KzGMtd[bZ(0x356)], f['code']))
                                return;
                            KzGMtd['oyYlP'](g, this['ap'][bZ(0x175)] - 0x1) && (newIndex = KzGMtd['Wipjx'](h, 0x1));
                        }
                    });
                } catch (v) {
                    console['error'](bR(0x16e), v);
                }
                f['UCndo'](GM_getValue, m['settingPanelItems'][bR(0x2eb)]?.['ax'], !0x1) && (console[bR(0x280)](f[bR(0x300)]), elmGetter[bR(0x141)](o[bR(0x1df)])['then'](w => {
                    const c2 = bR, x = {
                            'BkbJd': f[c2(0x291)],
                            'tssGA': c2(0x346),
                            'bMeBH': f[c2(0x27d)],
                            'JYgiJ': f[c2(0x2f0)],
                            'ouRCa': c2(0x34b),
                            'VSaNM': f[c2(0x3ac)],
                            'RUwZF': f['AJKNF'],
                            'kJMig': c2(0x397),
                            'cMdzG': f['ZVdXs'],
                            'orXVE': f['yjQmM'],
                            'pcsdF': function (z, A) {
                                const c3 = c2;
                                return f[c3(0x29c)](z, A);
                            },
                            'oZNjj': function (y, z) {
                                return f['LDOJe'](y, z);
                            },
                            'wBXlb': function (z, A) {
                                return z >= A;
                            },
                            'XxpAA': f[c2(0x154)],
                            'dDeil': c2(0x2c8),
                            'WoILq': f['zdgsi'],
                            'EAkTW': f['dnbZC'],
                            'ctAXD': c2(0x333),
                            'dJKVj': c2(0x161),
                            'HykaK': c2(0x179),
                            'WrsLp': f[c2(0x2b9)],
                            'vqFOa': f[c2(0x312)],
                            'siiKw': function (z, A) {
                                return f['AvSmV'](z, A);
                            },
                            'dtigD': f[c2(0x1fa)],
                            'VjWle': f[c2(0x1f6)],
                            'QAlXp': function (y, z) {
                                const c4 = c2;
                                return f[c4(0x336)](y, z);
                            }
                        };
                    w[c2(0x31f)][c2(0x219)](o[c2(0x171)]) ? console[c2(0x280)](c2(0x2fa)) : elmGetter[c2(0x141)](o['aB'])[c2(0x38a)](y => {
                        const c5 = c2, z = {
                                'EzHMc': function (B, C) {
                                    return B(C);
                                },
                                'badkT': function (B, C) {
                                    return t['MyDjF'](B, C);
                                }
                            };
                        if (t['OfgDT'](t['OuAdy'], c5(0x2d2)))
                            console[c5(0x280)](t[c5(0x212)]), y['click']();
                        else {
                            if (g[c5(0x280)](pfxPJh['BkbJd']), document['querySelector'](pfxPJh[c5(0x3e6)]))
                                return;
                            this['aq'][0x0];
                            let B = document[c5(0x303)](pfxPJh['bMeBH']);
                            B['id'] = pfxPJh[c5(0x260)], B[c5(0x24b)]['display'] = pfxPJh['ouRCa'], B[c5(0x24b)][c5(0x147)] = 'center', B[c5(0x24b)][c5(0x174)] = pfxPJh[c5(0x24d)];
                            const C = window[c5(0x224)][c5(0x26b)]['includes'](pfxPJh['RUwZF']);
                            C ? (B['style'][c5(0x271)] = '24px', B[c5(0x24b)][c5(0x293)] = pfxPJh['kJMig']) : B[c5(0x24b)][c5(0x271)] = pfxPJh[c5(0x39f)], B['style'][c5(0x1d5)] = pfxPJh[c5(0x1cd)];
                            const D = E => {
                                window['aF']['aG'] = E, this['aH'](E);
                            };
                            for (let E = 0x0; pfxPJh[c5(0x261)](E, this['ap'][c5(0x175)]); E++) {
                                const F = pfxPJh[c5(0x191)](parseFloat, this['ap'][E]);
                                pfxPJh[c5(0x1e7)](F, 0x1) && this['aq'][0x1], F >= 1.5 && this['aq'][0x2];
                                let G = document[c5(0x303)](pfxPJh[c5(0x3e3)]);
                                G[c5(0x24b)][c5(0x335)] = pfxPJh[c5(0x258)], G['style'][c5(0x21c)] = pfxPJh[c5(0x369)], G[c5(0x24b)][c5(0x2c4)] = c5(0x3f1), G[c5(0x24b)][c5(0x2b6)] = pfxPJh[c5(0x3d1)], G[c5(0x24b)][c5(0x307)] = pfxPJh[c5(0x385)], G[c5(0x24b)][c5(0x202)] = c5(0x31a), G['style'][c5(0x1e0)] = pfxPJh[c5(0x26e)], G[c5(0x24b)][c5(0x1ea)] = pfxPJh[c5(0x207)], G[c5(0x24b)]['justifyContent'] = pfxPJh[c5(0x24d)], G[c5(0x24b)][c5(0x147)] = pfxPJh[c5(0x24d)], G[c5(0x24b)][c5(0x1d5)] = pfxPJh[c5(0x320)], G[c5(0x24b)][c5(0x271)] = C ? c5(0x163) : pfxPJh[c5(0x1b9)], G[c5(0x24b)][c5(0x3cb)] = C ? '12px' : pfxPJh[c5(0x2f4)], G[c5(0x1ba)] = pfxPJh[c5(0x30a)](this['ap'][E], '×'), G['className'] = pfxPJh[c5(0x286)], G[c5(0x213)][c5(0x3b5)] = this['ap'][E], G[c5(0x33c)](pfxPJh[c5(0x2de)], () => {
                                    const c6 = c5;
                                    B ? fdMuao[c6(0x374)](C, this['ap'][E]) : fdMuao[c6(0x133)](D, this['ap'][E]);
                                }), B['appendChild'](G);
                            }
                            pfxPJh[c5(0x3bc)](j, B);
                        }
                    });
                }));
                const u = f[bR(0x14a)](GM_getValue, m[bR(0x190)]['Bilibili_Action_Rate']?.['ax'], !0x1);
                if (console[bR(0x280)](f[bR(0x1b7)], u ? bR(0x3b1) : f[bR(0x13f)]), u) {
                    const w = f[bR(0x409)](parseFloat, f[bR(0x310)](GM_getValue, m[bR(0x190)][bR(0x36d)]?.['ao'], m[bR(0x3ff)]));
                    console[bR(0x280)](f[bR(0x3fd)], w), m['aH'](w);
                }
                this['b4'](), console['log'](f['ZYyFK']);
            },
            'b4': function () {
                const c7 = b9;
                null !== this['b2'] && (console[c7(0x280)](f[c7(0x389)]), f[c7(0x2ae)](clearInterval, this['b2']), this['b2'] = null), console[c7(0x280)](f[c7(0x13b)]), this['b2'] = f[c7(0x14a)](setInterval, () => {
                    const c8 = c7, t = {};
                    t[c8(0x155)] = function (z, A) {
                        return z + A;
                    };
                    const u = t, v = document[c8(0x299)](o[c8(0x1df)]);
                    if (!v)
                        return;
                    const isWebscreen = v[c8(0x31f)]['contains'](o[c8(0x3c1)]);
                    for (const x in q) {
                        if (f[c8(0x33f)](f[c8(0x38e)], c8(0x21d))) {
                            const y = m[c8(0x190)][x]?.['ax'];
                            if (!f[c8(0x3f4)](GM_getValue, y, !0x1))
                                continue;
                            const z = document[c8(0x299)](q[x][c8(0x392)]);
                            z && (f[c8(0x16c)](f[c8(0x2d4)], q[x]['mode']) ? z[c8(0x27c)]() : z[c8(0x24b)][c8(0x1d5)] = isWebscreen ? '0' : '');
                        } else {
                            const A = document[c8(0x299)](i['aN']), B = A && A[c8(0x31f)][c8(0x219)](j[c8(0x26f)]), C = void 0x0;
                            window[c8(0x224)][c8(0x26b)][c8(0x132)]('youtube.com/watch') && (B && !window['aF']['b0'] ? (k['aH'](0x1), l[c8(0x280)](c8(0x24c)), window['aF']['b0'] = !0x0) : !B && window['aF']['b0'] && (m['aH'](window['aF']['aG']), n[c8(0x280)](u[c8(0x155)](c8(0x3cd), window['aF']['aG'])), window['aF']['b0'] = !0x1));
                        }
                    }
                }, 0xc8);
            },
            'init': function () {
                const c9 = b9;
                console[c9(0x280)](f[c9(0x15b)]), console['log'](f[c9(0x1a5)], window['location'][c9(0x26b)]), window[c9(0x224)][c9(0x26b)][c9(0x132)](f[c9(0x263)]) && this['b3'](), console[c9(0x280)](f[c9(0x2c2)]);
            }
        };
    !(function () {
        const ca = b9, t = {
                'RgGCO': f['jBVCD'],
                'ZTvjI': function (v, w) {
                    return v === w;
                },
                'Qgphj': f[ca(0x2b2)],
                'oSCty': function (v, w, x) {
                    const cb = ca;
                    return f[cb(0x3f4)](v, w, x);
                },
                'rlENX': ca(0x24c),
                'iewfm': function (v, w) {
                    return f['rpOAa'](v, w);
                },
                'IFUHi': ca(0x3cd),
                'WuOPO': f[ca(0x38c)],
                'xBzbR': f['mbUIs'],
                'lcaba': f[ca(0x326)],
                'OnBeF': ca(0x2f6),
                'eyvMB': function (v, w) {
                    const cc = ca;
                    return f[cc(0x3f8)](v, w);
                },
                'sMbjB': ca(0x1db),
                'mwuEH': function (v) {
                    return f['cErWt'](v);
                }
            };
        if (f[ca(0x239)] !== ca(0x252))
            h[ca(0x31f)]['remove'](f[ca(0x3a3)]), document[ca(0x11b)](f[ca(0x192)])['classList'][ca(0x27c)](f[ca(0x1f9)]);
        else {
            const v = {};
            v[ca(0x38f)] = !0x1, v['b0'] = !0x1, v['aG'] = null, v['aL'] = !0x1, v['b1'] = null, v[ca(0x366)] = !0x1, v['isYoutubePageProcessing'] = !0x1, window['aF'] = v;
            let w = null;
            function main() {
                const cd = ca, x = {
                        'EZNHD': f[cd(0x183)],
                        'gbpoV': function (z, A) {
                            return f['dCKVp'](z, A);
                        },
                        'akGZz': function (z, A, B) {
                            const ce = cd;
                            return f[ce(0x359)](z, A, B);
                        },
                        'LsdMO': f[cd(0x3fd)],
                        'IuTLC': function (z, A) {
                            return z + A;
                        }
                    };
                if (f['ALCcc'] === f[cd(0x2ac)]) {
                    if (window['aF'][cd(0x366)])
                        console[cd(0x280)](f[cd(0x3a6)]);
                    else {
                        if (f[cd(0x1cb)](f[cd(0x24a)], 'jpsQG')) {
                            const z = {
                                'NpMrw': cd(0x330),
                                'LtAxk': LsvuBg[cd(0x3e7)],
                                'gdREK': function (B, C) {
                                    const cf = cd;
                                    return LsvuBg[cf(0x3fe)](B, C);
                                },
                                'iPOeI': LsvuBg[cd(0x2a8)]
                            };
                            for (const B in s)
                                LsvuBg[cd(0x17c)](GM_getValue, t['settingPanelItems'][B]?.['ax'], !0x1) && u['get'](v[B]['selector'])[cd(0x38a)](F => {
                                    const cg = cd;
                                    B[cg(0x280)](z['NpMrw'], B['aw'](B), z[cg(0x2da)], C[B][cg(0x38b)]), z[cg(0x18d)](z[cg(0x19a)], D[B][cg(0x38b)]) ? (F[cg(0x24b)]['width'] = '0', F[cg(0x24b)]['overflow'] = cg(0x39c), F[cg(0x24b)][cg(0x3cf)] = '0') : F[cg(0x27c)]();
                                });
                        } else {
                            if (window['aF'][cd(0x366)] = !0x0, console[cd(0x280)](f[cd(0x137)]), console['log'](f[cd(0x1a5)], window[cd(0x224)][cd(0x26b)]), console['log'](f[cd(0x3ed)], window['aF'][cd(0x38f)]), f['jWLVx'](null, w) && (console[cd(0x280)](cd(0x3ae)), f[cd(0x244)](clearInterval, w), w = null), null !== window['aF']['b1'] && (console[cd(0x280)](cd(0x36f)), f[cd(0x295)](clearInterval, window['aF']['b1']), window['aF']['b1'] = null), f[cd(0x16a)](null, s['b2']) && (console[cd(0x280)]('[清理]\x20bilibiliRemovalInterval\x20定时器'), f[cd(0x409)](clearInterval, s['b2']), s['b2'] = null), window['aF']['aL'] = !0x1, m['ar'] = k(), m[cd(0x1af)](window[cd(0x224)]['href']), !window['aF'][cd(0x38f)]) {
                                if (f[cd(0x11c)](f[cd(0x3f9)], cd(0x1d9))) {
                                    const z = document[cd(0x299)](j['aK']), A = !!z;
                                    if (k[cd(0x280)](AElSWY[cd(0x2f1)], A), z)
                                        l['log'](cd(0x195));
                                    else {
                                        const B = AElSWY[cd(0x20f)](parseFloat, AElSWY[cd(0x2fd)](GM_getValue, q[cd(0x190)][cd(0x34f)]?.['ao'], r[cd(0x3ff)]));
                                        s[cd(0x280)](AElSWY[cd(0x3d9)], B), t['aH'](B), window['aF']['b0'] = !0x1;
                                    }
                                } else {
                                    console[cd(0x280)](f['nttyM']), f[cd(0x36b)](GM_addStyle, l), f['kSOBP'](GM_registerMenuCommand, m['aw'](cd(0x148)), m['aC'][cd(0x3b2)](m)), document['addEventListener'](f['hqgsc'], m[cd(0x343)]['bind'](m));
                                    const z = void 0x0;
                                    f[cd(0x301)](GM_getValue, f[cd(0x3ef)], !0x1) || (console[cd(0x280)](cd(0x23c)), GM_setValue(cd(0x168), !0x0), f['TQMTs'](setTimeout, () => {
                                        m['aC']['bind'](m)();
                                    }, 0x1f4)), window[cd(0x224)]['href'][cd(0x132)](f[cd(0x365)]) && (null === window['aF']['aG'] && (window['aF']['aG'] = parseFloat(f[cd(0x196)](GM_getValue, m[cd(0x190)][cd(0x34f)]?.['ao'], m[cd(0x3ff)])), console[cd(0x280)](f['zhWnZ'](f['nqxEY'], window['aF']['aG']))), console[cd(0x280)](cd(0x2df)), window[cd(0x33c)](n['finishListener'], () => r[cd(0x2d9)]()), console['log']('[启动]\x20youtubeLiveStreamCheck\x20定时器\x20(间隔1000ms)'), w = setInterval(() => {
                                        const ch = cd, A = document[ch(0x299)](n['aN']), B = A && A['classList'][ch(0x219)](n['liveStreamClass']), C = void 0x0;
                                        window[ch(0x224)][ch(0x26b)][ch(0x132)]('youtube.com/watch') && (B && !window['aF']['b0'] ? (m['aH'](0x1), console[ch(0x280)](t[ch(0x34c)]), window['aF']['b0'] = !0x0) : !B && window['aF']['b0'] && (m['aH'](window['aF']['aG']), console[ch(0x280)](t[ch(0x2db)](t[ch(0x27a)], window['aF']['aG'])), window['aF']['b0'] = !0x1));
                                    }, 0x3e8), console[cd(0x280)](cd(0x176)), window['aF']['b1'] = f[cd(0x2af)](setInterval, () => {
                                        const ci = cd;
                                        if ('QvNiO' !== t[ci(0x334)]) {
                                            const B = document[ci(0x303)](ci(0x3ec));
                                            B[ci(0x323)] = v, B[ci(0x1ba)] = AElSWY[ci(0x208)](g, 'x'), h[ci(0x17a)](B);
                                        } else {
                                            const B = document['querySelector'](n['aK']), C = document[ci(0x15c)](t[ci(0x3be)])[0x0];
                                            B && !window['aF']['aL'] && C ? (console[ci(0x280)](t[ci(0x404)]), m['aH'](0x1), window['aF']['aL'] = !0x0) : !B && window['aF']['aL'] && C && (console['log'](t[ci(0x2db)](t[ci(0x3c0)], window['aF']['aG'])), m['aH'](window['aF']['aG']), window['aF']['aL'] = !0x1);
                                        }
                                    }, 0xc8)), window['aF'][cd(0x38f)] = !0x0, console[cd(0x280)](f[cd(0x311)]);
                                }
                            }
                            window['location'][cd(0x26b)][cd(0x132)](cd(0x40e)) ? (console['log'](f[cd(0x238)]), r[cd(0x2d9)]()) : window[cd(0x224)][cd(0x26b)][cd(0x132)](f[cd(0x263)]) && (console[cd(0x280)](f[cd(0x217)]), s[cd(0x2d9)]()), console[cd(0x280)](f[cd(0x3a8)]), window['aF'][cd(0x366)] = !0x1;
                        }
                    }
                } else
                    i['error'](cd(0x16e), v);
            }
            f[ca(0x189)](main);
            let lastUrl = location['href'];
            console[ca(0x280)](f[ca(0x144)]), new MutationObserver(() => {
                const cj = ca, x = location[cj(0x26b)];
                t[cj(0x1e9)](x, lastUrl) && (console[cj(0x280)]('==========\x20MutationObserver\x20检测到URL变化\x20=========='), console[cj(0x280)](cj(0x3de), lastUrl), console[cj(0x280)](cj(0x17b), x), lastUrl = x, x[cj(0x132)](cj(0x186)) && (console[cj(0x280)](t['sMbjB']), t[cj(0x2fe)](main)), console['log'](cj(0x200)));
            })[ca(0x32b)](document, {
                'subtree': !0x0,
                'childList': !0x0
            });
        }
    }());
}()));
function b(c, d) {
    c = c - 0x112;
    const e = a();
    let f = e[c];
    if (b['AlrXLs'] === undefined) {
        var g = function (l) {
            const m = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            let n = '', o = '';
            for (let p = 0x0, q, r, s = 0x0; r = l['charAt'](s++); ~r && (q = p % 0x4 ? q * 0x40 + r : r, p++ % 0x4) ? n += String['fromCharCode'](0xff & q >> (-0x2 * p & 0x6)) : 0x0) {
                r = m['indexOf'](r);
            }
            for (let t = 0x0, u = n['length']; t < u; t++) {
                o += '%' + ('00' + n['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(o);
        };
        b['YTsHbY'] = g, b['usZHPb'] = {}, b['AlrXLs'] = !![];
    }
    const h = e[0x0], i = c + h, j = b['usZHPb'][i];
    return !j ? (f = b['YTsHbY'](f), b['usZHPb'][i] = f) : f = j, f;
}
function a() {
    const ck = [
        'iZzInZi4ma',
        'w+I3S+I/H10G5BEY5PIV572r6Ag15ywO5Bgp5QIH5BYp',
        'r3Lcvgu',
        'EMrNC2K',
        'ywThwNO',
        'BxD1ruG',
        'wMHUsNi',
        'DenWve4',
        'AezerhG',
        'sKnYvfa',
        'y3jLyxrLrwXLBwvUDa',
        'DKLpCNe',
        'vvflvNG',
        'tuDWtNG',
        'y29SB3i',
        'Aw5PDgLHBgL6zwtNIRBMGie6',
        'q29TBwe',
        'C2LPs3C',
        'vM5hwLq',
        'w+A4HEEqHL0GyMLSAwjPBgLszw1VDMfSsw50zxj2ywWG5A6A5PE25zMO',
        'wK1vyve',
        'ANvSB25N',
        'qMTjAeW',
        'AujdDfi',
        'wuvqA1C',
        'qNrhALO',
        'BwfW',
        'ze5rrKK',
        'quLyuvq',
        'vw5SAw1PDgvKideWodbqifrYAwfSicHoBYbmB2DPBIK',
        'n3Purermrq',
        'C2v0sxrLBq',
        'u3bLzwqGtgLZDa',
        'Cg9PBNrLCG',
        'yM9KEq',
        '5RE75yQG5ycn6ycF5OYj6zkU',
        'pdW8pcbOyw5KBgvcAwXPyMLSAsdMIAFOOyZLROZMR5u',
        'B3bHy2L0Eq',
        'y2XHC3nmAxn0',
        'shLRyuS',
        'y2Leufe',
        'ChzqCe8',
        'DMfSDwu',
        'zMLYC3rdAgLSza',
        'uMvTB3zLifbPy3r1CMuTAw4TugLJDhvYzsbcDxr0B24',
        'v21WC2G',
        'sLzgrhy',
        'w+IUVUE9RL0G6iEQ5yQO572r6Ag15ywO5Bgpiow3SUwqR+EuQa',
        'C2zowe0',
        'sK1YvvK',
        'B2jZzxj2zq',
        'rg9ttfe',
        'rvPAvw0',
        'pt09pt09pt09psdMIAFOOyZKUidMRkhMGkFLIj3LP4VLJjyGpt09pt09pt09pq',
        'CvDyBwu',
        'w1vjxsdNP7VPMAtMJiNPKQ46',
        'rfP5uLi',
        'qxv0BYbuAgvHDgvYie1Vzgu',
        'i2zMzMzMzG',
        'v3vpue8',
        'yMfJA2DYB3vUzenVBg9Y',
        'EMfLEva',
        'A2PAtNq',
        'CMvTB3zLq2HPBgq',
        'wLzKwhm',
        'u3bLzwqGtgLZDcbtzxr0Aw5NCW',
        'CMLorg0',
        'ywrKrxzLBNrmAxn0zw5LCG',
        'ugXKrxu',
        'turyyLa',
        'zgvIDNO',
        'q0Hiz28',
        'w+IUVUE9RL0G5yEg5Ash6k6+572U5ycn6ycFoG',
        'whPUruS',
        'AgfUzgXLs2v5zg93BG',
        'zhrfwwW',
        'uvHkz2K',
        'i3nWzwvKqNv0Dg9UCW',
        't1HTyK4',
        'pdW8pcbOyw5KBgvzB3v0DwjLioAjP+IHJowUJoAVLq',
        'zNLtrwC',
        'q3vZDg9Tx1nWzwvKx0XPC3q',
        'zMXLEa',
        'CMXftLG',
        'zLDiAvC',
        'vgPMEe8',
        'ww91DhvIzv9by3rPB25FuMf0zq',
        'thftDMO',
        'rMvLzgjHy2SGrw1HAwW',
        'ywjZ',
        'z3DvuKO',
        'rhrxuKS',
        'uhb5rvm',
        'Au9bB2i',
        'ter6tM8',
        'qxv0Ag9Y',
        'ELnZtLG',
        '5B2t5yMnvvjmoG',
        'rNPRAum',
        'sNjyC3m',
        'w1vjxsdMNkRMIB7LIldNM67MOiFLRRNLMAGGlMjWEc1WBgf5zxiTy29UDhjVBc1IB3r0B20TCMLNAhq',
        'AuD0uM8',
        'zKfzr0m',
        'zw50CMLLCW',
        'DKLjEMe',
        'we5oDKi',
        'yNv0Dg9UCW',
        'EfbcCxm',
        'ELjuve4',
        'AxnnywLUuNvUBMLUzW',
        'y3jLyxrLu2v0DgLUz0L0zw0',
        'C3vIDgL0Bgu',
        'v29jthe',
        'zLnuDw4',
        'shzvwMG',
        'DwT2sLK',
        'qMLSAwjPBgLFqwn0Aw9Ux1jHDgu',
        'u1Deyxy',
        'w+A4HEEqHL0GEw91DhvIzufKq2HLy2TjBNrLCNzHBcdLRPRML7BLMAG',
        'u014rNi',
        't2zeAKi',
        'CgfUzwWTzM9VDgvY',
        'su5qvvq',
        'rxPitwm',
        'CMDIysGWlcaWlcaWlcaWlJCP',
        'DNH0v2K',
        'm3b4',
        'rMfPBgvKigf1Dg9Yzw1VDMuGyNv0Dg9UCZO',
        '56E76zMK5yIg6l6O546h5OYj6zkU',
        'vvHewwW',
        'Ew1nBxG',
        'CfzcEuS',
        'qMLIvw8',
        'twvUDv9tCgvLzeXPC3rFtgfIzwW',
        'ExrWlwXPDMuTyMfKz2uTAxmTBgL2zwHLywq',
        's2XVzMO',
        'zMLUAxnOtgLZDgvUzxi',
        'zLrjq3m',
        'Axj5sxC',
        'uMvTB3zLiff1ywXPDhKGqNv0Dg9U',
        'y3rbweq',
        'vxbQwgm',
        'sxzdsgW',
        'zw1HAwWTAw5MBW',
        's09TzMq',
        'DgHLBG',
        'Bw9Kzq',
        'uxjktMG',
        'BvDgAwy',
        'vgLUuey',
        'Aw5PDgLHBgL6zwq',
        '5y+n6AAi6ykU566X',
        'twvUDv9bDxrOB3jFvgL0Bgu',
        'C2vSzwn0B3i',
        'lMjWEc1WBgf5zxiTy29UDgfPBMvY',
        'uMvTB3zLifrOzwf0zxiGtw9KzsbcDxr0B24',
        'ms4W',
        'zMLUzeLUzgv4',
        'nNb4',
        'AwTszuG',
        'AgLKzq',
        'mJjWEa',
        'zhPPsLy',
        'AgLKzgvU',
        'uu1ysMq',
        'C2v0DgLUz1bHBMvSrwXLBwvUDa',
        'y01KEKC',
        'rfPzDwW',
        'ww91DhvIzv9szw1VDMvFvgHLyxrLCK1Vzgu',
        'revYz2m',
        'y1PduvG',
        'yM11Dee',
        'z2PNAvO',
        'z05Zz3a',
        '5BEY5Qoa5Rwl5yIW5BM/5zgk77Ym6yEn572U5PkT5Ps+6ycF5BQM5lI6ms4W',
        'B1blD28',
        'FcdMLRNLVi86',
        'te1HzLy',
        'DgvZDa',
        'zhzTs1i',
        'v1LVt0i',
        'w+A4HEEqHL0GEw91DhvIzuXPDMvtDhjLyw1dAgvJAYdLRPRML7BLMAG',
        'mJrWEa',
        'DLPxuKO',
        '5BEY5zcV55sO',
        'yMLUza',
        'vhfRtM0',
        'mJGXntK1CfzWrfrK',
        'C3bLzwq',
        'C3bLzwrmAxn0rxjYB3i',
        'zfzPqMy',
        'C3bLzwrmAxn0sw5WDxq',
        'mtfWEa',
        'zvzcD2i',
        'Dg9tDhjPBMC',
        'uufSwha',
        'y2HLy2TIB3G',
        'Eej6yLi',
        'BLHNEfe',
        't25czuy',
        'D2vIC2nYzwvUq2XHC3m',
        'y2LIr24',
        'Dg9gAxHLza',
        'zK5dCMq',
        'mtmWnZK3mhL2qvvjAq',
        'C1zNq3a',
        's21OCfq',
        'qMLSAwjPBgLFuMvTB3zLx1f1ywXPDhK',
        'twvUDv9tyxzL',
        'y2XHC3njza',
        'zM9UDfnPEMu',
        'zgL2',
        '55U05PkT5BEY57Ut5P2F77Ym5OgI5Asn5PkT5Ps+6ycF5BQM5lI6',
        'w+INPUwpKv0G6AAw5QYH5OMN6kgmic0+igjPBgLIAwXPlMLUAxq',
        'zMXLEfnOCMLUAW',
        'uMvTB3zLifDPzguGqNv0Dg9U',
        'rufRvfC',
        'DKnAsK4',
        'C2vJDgLVBI10AxrSzq',
        'z2L0vMm',
        'ugDeC2O',
        'sNv0rKG',
        'sKLvCKW',
        'B0H2ENK',
        'thnKtu8',
        'BwLUAw1HBfnLDhrPBMDZugfUzwW',
        'w+IUVUE9RL0G6iEQ5yQO6l+B5ywL5B2X6zMI5QIH5BYpiow3SUwqR+EuQa',
        's3Pnz0K',
        'lNL0Cc1Hzc1WBgf5zxiTB3zLCMXHEsWGlNL0Cc1Hzc1WBgf5zxiTB3zLCMXHEs1SyxLVDxq',
        '5PENvvjmoG',
        '5ycn6ycF5yIx6kgO6k6+572U',
        'twvUDv9tDwj0AxrSzq',
        'twvUDv9tCgvLzeXPC3rFugXHy2vOB2XKzxi',
        'v0zwt28',
        'whHWque',
        'yxv0Ag9YlwXHyMvS',
        'AhfNC2m',
        'DhnZr0e',
        'uMDhq08',
        'vK9dDfC',
        'zg5IwKm',
        'ze96t0e',
        'rKzJteG',
        'B3b0Aw9U',
        'tvbmA2O',
        'zfvuvxO',
        'tM5JALi',
        'EhvAwKm',
        'mxb4ihnVBgLKihjNyMeOmJeXlcaYmteSidiXmsWGmc41kq',
        'rMrtq04',
        'B0zAEKG',
        'rurNy1a',
        'whPvAw8',
        'EhLRENy',
        'BefewMq',
        'Cvn3D2q',
        'z3LAvfi',
        'sNPjy3u',
        'ANvSB25NqdeXms5JB20',
        'w+AtJEs9Nf0G54k55yE75B2X6zMI5QIH5BYp5OYj6zkU',
        'vhvKBgO',
        'wLr2AKK',
        'zgvMyxvSDfnWzwvK',
        'BwfYz2LUqM90Dg9T',
        'vLngAKq',
        'sMHkwg8',
        'CgfUzwWTAgvHzgvY',
        'BgnHyMe',
        'y0vYv3q',
        'i21VDMLLx3bSyxLLCIa+igrPDI55DhaTy2HYB21LlwjVDhrVBsa+igrPDI55DhaTy2HYB21LlwnVBNrYB2XZid4GzgL2lNL0Cc1YAwDODc1JB250CM9SCW',
        'u1vmBxO',
        'Cvbszhe',
        'DKDRAMK',
        'DgfNtMfTzq',
        'odK4zKjYwxvs',
        'q3Dgvwe',
        'vevyvefsrue',
        'Ew91DhvIzs5JB20VD2f0y2G',
        'Ew91DhvIzs5JB20V',
        'C3rHCG',
        'i21VDMLLx3bSyxLLCIaUExrWlxn1yNrPDgXLCY1IDxr0B24',
        'tufLuvm',
        'uxbQrxa',
        's0jzz2S',
        'C2v0DgLUz3ncDg4',
        'whb1DwW',
        'qNvKzfG',
        'z2v0rwXLBwvUDej5swq',
        'Cg5YvMy',
        'mJyYntq2mLDuB1LvvW',
        'rMvHDhvYzxm',
        '56E76zMK55s75lIT55s75OYj6zkU',
        'CwDOz1a',
        'mtqZmJm2mezeq2rWvW',
        'sfPKEhy',
        'svbVDhq',
        'zeX1Dfe',
        'Bff4rwC',
        'C0rvq3O',
        'ufPouxi',
        'ohb4ide2ChG',
        'CxvLCNLtzwXLy3rVCKfSBa',
        'CePnEMe',
        'rvrOrMK',
        'vMLKzw8GugXHEwvYievUAgfUy2vY',
        'C3vPzMK',
        'yLbwq3e',
        'EgH2q24',
        'ywrK',
        'ugvYAw9K',
        'Aw5JBhvKzxm',
        'yMfKA1q',
        'ugPytge',
        'DMfSAwq',
        't2LlBe4',
        'B0vovgq',
        'sLntwgC',
        'AM1VBNy',
        'r2zvv28',
        'thvxsMm',
        'BfzoAwO',
        'r1DvAKK',
        'qMLSAwjPBgLFuMvTB3zLx0vWBgLZDa',
        'ufvWy3i',
        '56E76zMK6ycj6zUg5OYj6zkU',
        'z2v0',
        'tNHrA2q',
        'y2HLy2TLza',
        'DgLgEeW',
        'w+IUVUE9RL0G6iEQ5yQO5ycn6ycF5PkT5Ps+oG',
        'qwzmAxu',
        'ywXPz25jDgvTCW',
        'twvUDv9tzxr0Aw5NCW',
        'AfreDe4',
        'uwTmtxy',
        'y3jLyxrLvgv4De5Vzgu',
        'qMLSAwjPBgLFuMvTB3zLx1nWzwvK',
        'yxv0BW',
        'r1bKvxO',
        'sxDluMC',
        'Dg9W',
        'AxLgz20',
        'AxnzB3v0DwjLugfNzvbYB2nLC3nPBMC',
        'zs5NlIaWlJuSmsWXlJuSmG',
        'r1nvBLe',
        'EgPHtvK',
        'Bwviuxa',
        'C2v0DgLUzY1PDgvT',
        'uMvTB3zLifnLDhrPBMDZiej1DhrVBG',
        'Aw5WDxq',
        'quPltKy',
        'vxbUEMu',
        'z2v0rwXLBwvUDhncEvrHz05HBwu',
        'yLHkywu',
        'w1vjxsdLGi3PGj/MJiNPKQ7LT7lMT7VLIQdLIlaGDMLKzw9qyw5LBcdKUyVLIy0',
        'B1f3tNu',
        '56E76zMK5A2x5BMv5OYj6zkU',
        'qxjPywWSicjizwX2zxrPy2eGtMv1zsiSieHLBhzLDgLJysWGC2fUCY1ZzxjPzG',
        'rgjjwNC',
        'mJbWEa',
        'lMjWEc1WBgf5zxiTy3rYBc13zwi',
        'Bg9Oy3q',
        'y2XHC3noyw1L',
        'u1j4Eei',
        'zMLYC3rsDw5dB21WBgv0zq',
        'v05gDgm',
        'sLbXs1a',
        'C3rYAw5N',
        'rxH3Dee',
        'DMLKzw8',
        'rMfPBgvKignYzwf0zsbZCgvLzcbIDxr0B24GzwXLBwvUDhm6',
        'pt09pt09pt09psbTywLUioATO+wCQoAjP+IHJos4RE+8JoI3S+I/H+ATPoASOEIWG+EuQca9pt09pt09pt09',
        'lMjWEc1WBgf5zxiTy29UDhjVBc1IB3r0B20Ty2vUDgvY',
        'D2vIrNvSBenSyxnZ',
        'ww91DhvIzv9szw1VDMvFu2v0DgLUz3m',
        'sfzNsuK',
        'ANvZDgLMEunVBNrLBNq',
        'BgvUz3rO',
        'w+wqR+wkQf0GEw91DhvIzufKq2HLy2TjBNrLCNzHBcdLRPRML7BLMAGGkoMxToMALdiWmg1Zkq',
        'twvUDv9fBwfPBa',
        'qMLSAwjPBgLFuMvTB3zLx1DPzgu',
        'mZbWEa',
        'yxbWzw5Kq2HPBgq',
        '5PAWvvjmoG',
        'B1ndDhK',
        'A2v5zg93BG',
        'EuXUsu8',
        'Aw5KzxHpzG',
        'D3bSuK0',
        'yLPRANC',
        'tM1pC3a',
        'wvvrz24',
        'Bw9Kzs13zwjZy3jLzw4',
        'Aw9Ozem',
        'yMLSAwjPBgKUy29Tl3zPzgvV',
        'zfLjC0y',
        'CuXeENy',
        'AKnpEMe',
        'DuDqB0G',
        'w+s6Pos6KL0G55sO5OI354k55yE76ycF5BQM5OYj6zkUoG',
        'ndq0ntu0z3fdqw9A',
        'z2rsruS',
        'CgfYzw50tM9Kzq',
        'z2vRzMG',
        'C2v0DgLUz1bHBMvSsxrLBxm',
        'B1PoAMO',
        'Bvbevwi',
        'AxHmvNC',
        'A0PIu1i',
        'w+I3S+I/H10G5Qoa5Rwl5yIW5BM/5zgk77Ym6lEZ6l+h5ycn6ycF6k6+572U',
        'BuLouNe',
        'vM5yCNq',
        'CgXHy2vOB2XKzxi',
        'yuHAz3C',
        'AvbpzuK',
        'wuz2BgS',
        'y2vUDgvY',
        'ww91DhvIzv9by3rPB25FuMf0zv9fBMfIBgvK',
        'uMvTB3zLifn1yNrPDgXLCYbcDxr0B24',
        'twvUDv9tAg9YDgn1Df9ezxnJ',
        'zxjYB3i',
        'Cg9PBNrLCKv2zw50CW',
        'rufzvfa',
        'D2fYBG',
        'pt09pt09pt09psbTywLUioAjP+IHJowUJoAVLsa9pt09pt09pt09',
        'tNz1Cvq',
        'DhjHBNnPDgLVBG',
        'twvUDv9bDxrOB3i',
        'w+IUVUE9RL0G5B2t5yMn5BM/5zgk6kAg55Uw5Bgc5A2y5zYOoG',
        'rgngthO',
        'C3bLzwqTBgLZDc1Zzwn0Aw9U',
        'uMvTB3zLifDLyIbgDwXSC2nYzwvUiej1DhrVBG',
        'B3bHy2L0EsaWlJnZigvHC2uTB3v0',
        'tNLwEwO',
        'z2HwwNm',
        'Aw5PDfnLDhrPBMDjDgvTCW',
        '56E76zMK5y6F5AEl5ycn6ycF5OYj6zkU',
        'C3bSAxq',
        'A3nZqwi',
        'DhbXv2q',
        'yNb4lxn0yxrLlwvUDgvYzwq',
        '56E76zMK6k6+572U5OYj6zkU',
        'lMjWEc1WBgf5zxiTy3rYBc1XDwfSAxr5',
        'tNvoA2y',
        'sfH0qvy',
        'v3jZtha',
        'Dgv4DenVBNrLBNq',
        'v3jwzhi',
        'B21sreu',
        'z2XdC2y',
        'qxv0BYbxzwiGrNvSBhnJCMvLBG',
        'ww91DhvIzv9by3rPB25FvgHLyxrLCK1Vzgu',
        'ntaL',
        'r3bUvhy',
        'zMLSDgvY',
        'z2jPDNy',
        '56E76zMK5A695Bgp5OYj6zkU',
        'z1jZzLC',
        'q1rJueG',
        'EgLICKm',
        'sNDuqKG',
        'ANbZuuC',
        'ruHpzNG',
        'DfPWqK0',
        'iZa3mJuYnq',
        'B3jyvKu',
        'zLfpBNu',
        'A25AB1C',
        'uMvTB3zLief1Dg9WBgf5ifrVz2DSzq',
        'lMjWEc1WBgf5zxiTy3rYBc1WBgf5yMfJA3jHDgu',
        'Efv1D2y',
        'z0zpuMW',
        'AKjtwha',
        'D2LKDgG',
        'u2vWyxjHDg9YCZOGy29TBweGlcbVCIbdAgLUzxnLignVBw1Hio+8JcbnyxGGmtaGDMfSDwvZ',
        'EgLjvei',
        'B0jSAM8',
        'z3DYz1y',
        'pt09pt09pt09psbnDxrHDgLVBK9IC2vYDMvYioAJGoA1I+wiSfvstowpMowmLIa9pt09pt09pt09',
        'w+INPUwpKv0GqMLSAwjPBgKGvvjm5y+y5yYwic0+ig1HAw4Okq',
        'tKv5rvu',
        'r3bqy3K',
        'CxP6CNq',
        'CgXHEwvYq29UDgfPBMvY',
        'zM9UDezHBwLSEq',
        'Aw5Zzxj0qMvMB3jL',
        'Cvz5EwO',
        'zhH2y3O',
        'DhjHBNnSyxrLkc01mcuSic01mcuP',
        'uMvTB3zLie9YAwDPBMfSifnWzwvKiej1DhrVBG',
        'BvfTsfC',
        'D0jyBgi',
        'twvUDv9tCgvLzeXPC3rFrxjYB3i',
        'zxL2tui',
        'zgLZCgXHEq',
        'EgXUqu4',
        'y2n5vKe',
        'DhjHBNnMB3jT',
        'lMjWEc1WBgf5zxiTy3rYBc1Zzxr0Aw5N',
        '5B+R5O236zsU6k+05PIo',
        'zNDQwLe',
        'otaZmezKz2r3uW',
        'ugXMtKi',
        'DhLWzq',
        'BerPExu',
        'qxztBvy',
        'sNHku20',
        'rKvvy00',
        'A2jzEvG',
        'Avz5tfm',
        'AuHfDMm',
        'EMHxBLO',
        'qu10rue',
        'y25vr2O',
        'qMLSAwjPBgLFuMvTB3zLx0nVBw1LBNrZ',
        'ww91DhvIzv9szw1VDMvFu3vIDgL0BgvZ',
        'pt09pt09pt09psbnDxrHDgLVBK9IC2vYDMvYiowKHoEqHUwUJoAVLsa9pt09pt09pt09',
        'qMLSAwjPBgLFuMvTB3zLx1DLyKz1BgXZy3jLzw4',
        'y3vYC29Y',
        'zNvSBhnJCMvLBKvSzw1LBNq',
        'BM9Uzq',
        'mNb4',
        'nZy0nunXzfLvCa',
        'B3vsq2e',
        'sxvutem',
        'qKP6ruy',
        'z0vtueC',
        'zKjHqNa',
        'CvfLt0C',
        'rfLgrgC',
        'zML4zwq',
        'z2jWB1y',
        'zhD3CMm',
        'ugnyqNG',
        'B1DREfC',
        'zgf0yxnLDa',
        'AuHtr3u',
        'iZi4n0y1na',
        'Dgv4Da',
        'EKf0BgC',
        'sMfWrwG',
        'y29UDgfPBNm',
        'ALHqrMK',
        'twPAueC',
        'BwfYz2LUuMLNAhq',
        'txrRz1C',
        'mc41ldeSms41ldi',
        'vgHWzu0',
        'qMLSAwjPBgLFuMvTB3zLx1nLDhrPBMDZ',
        'y2XPy2S',
        'C2f2zuj0BG',
        'q2XVC2u',
        'Bg9JyxrPB24',
        'w+INPUwpKv0G6AAw5QYH5OMN6kgmic0+ihLVDxr1yMuUAw5PDa',
        'DfrcCNm',
        'sw52ywXPzcbMB3jTyxq6ig11C3qGyMuGBNvTyMvYCYaWlJeGlsaXmcWGmsbKzwnPBwfSihbSywnLlcbTyxGGmtaGDMfSDwvZ',
        'nhPst3jNDa',
        'DLv1uhK',
        'C3bLzwrcDxr0B25Z',
        'wMjxAg8',
        'DMvIvKW',
        'CfnJs08',
        'ALjJsLe',
        'AhHPrvC',
        'u2r2C0u',
        'wg9QALO',
        'Efb1rwe',
        'D2DrA1a',
        'ze1OEgC',
        'wfLxzLK',
        '5l6l5AAc77YAmc41ldeUmcWXlJuSmI4W',
        'yM9Sza',
        'sKzgsvG',
        'D3zJDhC',
        'mI4W',
        'Dvj0s1y',
        'w+MMLUASOEI/KoIHJf0G6iEQ5yQO5BY55yE66k6+572U55wm6z2I',
        'y1PgzgO',
        'qMrLr2e',
        'C3bLzwqTy29UDhjVBc1IDxr0B24',
        'AenUu3C',
        'mc41ldeUmcWXlJuSmI4W',
        'lNnWzwvKlwnVBNrYB2WTyNv0Dg9U',
        'uxzoAu8',
        'DNzdwxC',
        'mZyYmvj4sxLnCa',
        'vNLPwfK',
        'lMjWEc1WBgf5zxiTy3rYBc1LCgXPC3q',
        'BM9vAgy',
        '55Qe56YS5lIa5lIQ5l2n572U',
        'zMTtCfi',
        'C3r5Bgu',
        '5BEY5Qoa5Rwl5yIW55U05PkT77Ym6yEn572U5PkT5Ps+6ycF5BQM5lI6ms4W',
        'vLnHtK0',
        'CgXHEwjHy2TsyxrL',
        'BxjPtgO',
        'pt09pt09pt09psb5B3v0DwjLioAjP+IHJowUJoAVLsa9pt09pt09pt09',
        'vfPfBe4',
        'AunzzvG',
        'qMLSAwjPBgLFuMvTB3zLx1bPCa',
        'zunku3K',
        'y29Kzq',
        'CvbYvNu',
        'C3rHCNrZv2L0Aa',
        'zerLAwW',
        'rvjwrKq',
        'zgvMyxvSDfnWzwvKtgLZDa',
        'BNf4rvK',
        'yMvMB3jL',
        'D1jzEw4',
        'w1vjxsdMIB7LIldNM67MOiFLRRNLMAGG',
        'ywXtzKW',
        'sLLNAuO',
        'CgnZzey',
        'v3Hiu3C',
        'sgHuCNm',
        'ww91vhvIzsaMiejPBgLIAwXPioINHUMIKEwINUw8UUIUVUE9RG',
        'pt09pt09pt09psb5B3v0DwjLioIIQ+IWG+EuQca9pt09pt09pt09',
        'Agzey3u',
        'twvUDv9tzwn0Aw9Ux0fJDgLVBNm',
        'zMjUv2i',
        'ChD5q2e',
        'pt09pt09pt09psbTywLUiow8GowNI+AjP+IHJca9pt09pt09pt09',
        'AhjLzG',
        'yu9ruvm',
        'r1bnsMq',
        'zePlvMO',
        'BgL2zvn0CMvHBunSyxnZ',
        'Bwjvsxm',
        'AgvPz2H0',
        'Du1vC2q',
        'ru1gCgm',
        't3PWwNu',
        'yxv0Ag9YlwLUzM8',
        'w+I3S+I/H10GAgfUzgXLww91DhvIzsdMRApLNkJMIAFOOyZKUk3VViZOT7pOV4FMRAtMRkhOSipNLkG',
        '56E76zMK5OYj6zkU',
        'w+wqR+wkQf0Gtxv0yxrPB25pyNnLCNzLCIdNM5hLKkWGqMLSAwjPBgKGvvjmiowpMowmLG',
        'zM9UDfDLAwDODa',
        'suzvsgK',
        '5PYQ55M75B2v5PEG6zMq6k+v55sOmta4mfa',
        'CMvTB3zL',
        'CKznBeK',
        'ywn0AxzL',
        't3D3CfG',
        'Bg9N',
        '5yIg6zQu56YM77YA6iUX5PAh6ycx5y+3icWG5OIw5lIT5PAh6ycx5y+3io+8JoACGowKMJeW5lIQ5yc8',
        'Cwzquw0',
        'D2HPDgu',
        'w+wqR+wkQf0GEw91DhvIzuXPDMvtDhjLyw1dAgvJAYdLRPRML7BLMAGGkoMxToMALdeWmdbTCYK',
        'tu1zAu0',
        'zhrPz0q',
        'Cufvthq',
        'D2nWsKm',
        'we9yELK',
        'BuX5twO',
        't1H6uK0',
        'uxfMte8',
        'u2f2zq',
        'w1vjxsdLGi3PGj/MJiNPKQ7LT7lMJ5lLHAxLIlaG',
        'vgfIzhy',
        'nxb4',
        'A1nOB0u',
        'BeLKqKm',
        'BwfYz2LUvg9W',
        'ywjbCMm',
        'BuzHAvu',
        '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',
        'mtjWEa',
        't3PnBuG',
        'CxvLCNLtzwXLy3rVCG',
        'rMLZyw4',
        'suzrEMW',
        'zxbvr08',
        'vKTyDeW',
        'sKvJtLq',
        'ww91DhvIzv9by3rPB25FuMf0zv9wywX1zq',
        'u0Pfwui',
        'w+AtJEs9Nf0G54k55yE7572r6Ag15ywO5Bgp5OYj6zkU',
        'tKv2qxG',
        'B3veBve',
        'C2v0DgLUzY1SAxn0ihr3BY1JB2X1Bw5Z',
        'CgfKzgLUzW',
        'ww91DhvIzv9szw1VDMvFqxv0B3bSyxK',
        'z0Tbuha',
        'uwDWAgO',
        '56E76zMK5B2X6zMI5QIH5BYp5OYj6zkU',
        'EKLUzgv4',
        'zuzSsNG',
        'quXdy2m',
        'C3bHBG',
        'zenlvNa',
        'vunUzg8',
        'w1vjxsdLVzpLIy3OP4BPOPhMKQ3MLl7PGj/LUQy6',
        'EunMr0W',
        'wNbevNy',
        'Agf3AKK',
        'lMjWEc1WBgf5zxiTDg9HC3qTy29UzMLYBs1SB2DPBG',
        'se5Xz1u',
        'yM9YzgvYuMfKAxvZ',
        'BgvMDa',
        'tgjLBgu',
        'A3bnzLK',
        'yu1bAKu',
        'zMXLEerPCMvJDgLVBG',
        'B01NtNC',
        '6iEQ5yQO6l+B5ywL5B2X6zMI5QIH5BYp',
        'uwjAshO',
        't0rvueq',
        'uxroyLe',
        'BNjSDLC',
        'rxDutge',
        'BgfUz3vHz2u',
        'yM9YzgvY',
        'sLfsDhy',
        'Dg9Nz2XL',
        'vfDXy0S',
        'DhjHBNnWyxjLBNq',
        'w1vjxsb2AwrLB1bHBMvSiowfG+E0Oow3SUIoT+wpLU+8JowhHUwKH+A3U+wkOowaJEMaN+AmIEMsRG',
        'tKHrtMy',
        'rKLMCM0',
        'tgDiAvi',
        'CenHD2O',
        'zM9YrwfJAa',
        'DMrwww0',
        'y1Dhuvi',
        'twvUDv9tzwn0Aw9Ux1jLBw92zq',
        'Cun6DhC',
        'Dhjwzuu',
        'ENP3rhG',
        'weT2yvK',
        'Cg9ZAxrPB24',
        '6l6t5ywL5Qc85BYp6zsz6k+V77YA5B+f6Ag75PIVmc4XlteW55Qe5PwW5A2x77YmmEs9JEwWJ+AvSo+8JoACGowKMJeW5lIQ5yc8',
        'qMH1vhq',
        'Aw5PDa',
        'thrbEgS',
        'Awv3zM0',
        'zgDtufK',
        'pt09pt09pt09psbIAwXPyMLSAsdLVidLP4VLPitNKiyGpt09pt09pt09pq',
        'vMPxBgu',
        'w+AZQowgJf0GExqTBMf2AwDHDguTzMLUAxnOioEBKEwqRowzQcaTpIb5B3v0DwjLlMLUAxq',
        'twvUDv9tzwn0Aw9Ux1nOB3j0y3v0',
        'ufbUwgi',
        'wLLLwvi',
        'ugjhs3i',
        'twvUDv9dBg9Zzq',
        'BNr0Eu0',
        'C2vJDgLVBI1SywjLBa',
        'mJe0nZq4mZy0nW',
        'CwLTq2K',
        'i2jPBgLIAwXPlxbSyxLLCG',
        'w+wqR+wkQf0GyMLSAwjPBgLszw1VDMfSsw50zxj2ywWG5A6A5PE25zMOicJPL7tPMPqYmdbTCYK',
        'qMLSAwjPBgLFqwn0Aw9Ux1DLyKz1BgXZy3jLzw4',
        'BKzoEMS',
        'CeXkExm',
        'DwrWDey',
        'lMjWEc1WBgf5zxiTC2vUzgLUzY1Iyxi',
        'wxfHsfq',
        'rvPoseq',
        'C2HVDW',
        'twvUDv9tCgvLzeXPC3rFu2vWyxjHDg9Y',
        'DNfgt2e',
        'ChvZAa',
        '5BM/5zgk5BEY57Ut5P2F77Ym5OgI5Asn5PkT5Ps+6ycF5BQM5lI6',
        'Ew91DhvIzs5JB20',
        'rMjKqKC'
    ];
    a = function () {
        return ck;
    };
    return a();
}