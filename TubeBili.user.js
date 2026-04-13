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

(function (stringArrayFunction, c) {
    const cz = b, stringArray = stringArrayFunction();
    while (!![]) {
        try {
            const d = parseInt(cz(0x3ed)) / 0x1 * (parseInt(cz(0x3fa)) / 0x2) + -parseInt(cz(0x3de)) / 0x3 + parseInt(cz(0x369)) / 0x4 * (-parseInt(cz(0x39a)) / 0x5) + -parseInt(cz(0x35a)) / 0x6 * (parseInt(cz(0x258)) / 0x7) + -parseInt(cz(0x37d)) / 0x8 + -parseInt(cz(0x436)) / 0x9 * (parseInt(cz(0x476)) / 0xa) + parseInt(cz(0x460)) / 0xb * (parseInt(cz(0x402)) / 0xc);
            if (d === c)
                break;
            else
                stringArray['push'](stringArray['shift']());
        } catch (e) {
            stringArray['push'](stringArray['shift']());
        }
    }
}(a, 0x25e06), !(function () {
    'use strict';
    const cA = b, g = {
            'mZnZP': 'isViewToday',
            'dADSm': function (q, r) {
                return q !== r;
            },
            'GhtHB': cA(0x31d),
            'ySfeQ': cA(0x3b6),
            'FjpvL': function (q, r) {
                return q === r;
            },
            'WQoqV': function (q, r) {
                return q == r;
            },
            'TEbJI': cA(0x49f),
            'govqo': 'omFpw',
            'HgTzQ': cA(0x3ce),
            'NysNc': 'login',
            'YoluK': cA(0x27a),
            'ekqQN': cA(0x3f0),
            'qoIUA': function (q, r) {
                return q !== r;
            },
            'wNKHc': 'MKXIS',
            'qOGcx': cA(0x337),
            'uqcvN': 'true',
            'fqtrr': cA(0x3bf),
            'ZYuCE': cA(0x2a6),
            'zqjFC': cA(0x399),
            'RBKxU': cA(0x463),
            'ABpuV': cA(0x260),
            'GUYWY': cA(0x380),
            'Cwosk': 'nBWfh',
            'luoLf': cA(0x2b9),
            'CysiZ': function (q, r, s) {
                return q(r, s);
            },
            'Hhubk': cA(0x478),
            'jKxTX': function (q, r) {
                return q(r);
            },
            'IiboF': cA(0x365),
            'WsCBe': cA(0x427),
            'PwZgx': cA(0x350),
            'lihbl': function (q, r) {
                return q + r;
            },
            'yDBoe': cA(0x428),
            'kvmft': cA(0x464),
            'PbUsG': cA(0x305),
            'QgcgH': cA(0x40c),
            'ynLMX': cA(0x1fe),
            'dwVcU': cA(0x3a3),
            'BgDjg': cA(0x285),
            'flmeB': cA(0x21c),
            'CZrsb': 'input',
            'ZoNLN': cA(0x480),
            'oCTsE': 'label',
            'SDjSf': cA(0x2ce),
            'XisuM': cA(0x479),
            'cOTue': cA(0x30d),
            'UtBgZ': cA(0x342),
            'SPljM': cA(0x2d6),
            'JgLML': cA(0x353),
            'lNgcj': cA(0x220),
            'ALXoe': 'flex',
            'JaQrH': cA(0x483),
            'JTnmo': 'Menu_Shortcut_Title',
            'NJTEl': 'Menu_Shortcut_Items',
            'EWNWl': 'buttons',
            'alyOm': 'click',
            'qCCdD': cA(0x2f3),
            'tMrMK': 'Menu_Close',
            'BaTtc': function (q, r) {
                return q(r);
            },
            'ApEjT': cA(0x26f),
            'OCPCU': cA(0x3dd),
            'EOLAi': cA(0x45b),
            'oCZnI': cA(0x250),
            'lNLEi': cA(0x419),
            'waKwL': 'none',
            'fkvwR': cA(0x46d),
            'iFZdn': function (q, r) {
                return q !== r;
            },
            'qnmxm': 'czBfB',
            'vOrKm': function (q, r, s) {
                return q(r, s);
            },
            'uggMG': 'show',
            'bnhve': cA(0x361),
            'oFNtR': cA(0x3c2),
            'zZAdl': cA(0x2f8),
            'wPgAS': cA(0x396),
            'nDkkV': function (q, r, s) {
                return q(r, s);
            },
            'audOD': cA(0x295),
            'KpLmN': cA(0x408),
            'ucNYd': cA(0x448),
            'hSRxS': cA(0x36b),
            'EmqKX': cA(0x450),
            'KBMhp': 'Youtube_Remove_Autoplay',
            'NxwuB': 'Youtube_Remove_Subtitles',
            'Yheax': cA(0x2d3),
            'rpuuq': cA(0x461),
            'rjajk': cA(0x330),
            'bCXeL': 'Bilibili_Action_WebFullscreen',
            'BtxmL': 'Bilibili_Action_Rate',
            'WVGPL': cA(0x33b),
            'UQnuL': cA(0x303),
            'yOnJJ': 'Bilibili_Remove_Eplist',
            'RdNbR': 'Bilibili_Remove_Pip',
            'VApjR': cA(0x2a7),
            'qNjjj': cA(0x3c6),
            'uPEJE': cA(0x3cf),
            'fCbAZ': cA(0x290),
            'yHdzE': 'Bilibili_Remove_WebFullscreen',
            'TIGFM': function (q, r) {
                return q === r;
            },
            'RXyXR': cA(0x3a5),
            'dPBeg': function (q, r) {
                return q(r);
            },
            'luXBd': cA(0x306),
            'IFkAn': cA(0x2a0),
            'pPoVT': cA(0x2f5),
            'yQrbD': cA(0x406),
            'Fqyli': '100%',
            'gdkgN': function (q, r) {
                return q < r;
            },
            'EvWoz': function (q, r) {
                return q >= r;
            },
            'prenl': '1px\x20solid\x20#D3D3D3',
            'PPkGW': cA(0x373),
            'ORAuU': cA(0x21f),
            'MrFMq': cA(0x34b),
            'VcdOz': cA(0x26a),
            'UdkcC': cA(0x322),
            'ZJppA': cA(0x227),
            'rbiay': cA(0x25c),
            'WuVbp': 'Qowns',
            'CDDZW': cA(0x2d1),
            'StHZU': function (q, r) {
                return q < r;
            },
            'vpfIn': function (q, r) {
                return q(r);
            },
            'qYBqt': cA(0x266),
            'AyBog': '1px',
            'LbLNd': cA(0x271),
            'DZvdP': cA(0x241),
            'ZEdWb': function (q, r) {
                return q + r;
            },
            'PnTaF': cA(0x2f9),
            'WJjUe': cA(0x42e),
            'XrCYg': function (q, r) {
                return q !== r;
            },
            'onCSi': function (q, r) {
                return q !== r;
            },
            'moWzp': cA(0x45c),
            'jEwzY': cA(0x3b9),
            'DQHgs': function (q, r) {
                return q === r;
            },
            'TCdnX': function (q, r) {
                return q !== r;
            },
            'OJcgX': 'JillA',
            'AFkeQ': 'jRrTw',
            'zATqB': cA(0x453),
            'uFUmn': function (q, r) {
                return q > r;
            },
            'rJFyg': function (q, r) {
                return q - r;
            },
            'vvSKv': function (q, r) {
                return q !== r;
            },
            'DiQpo': cA(0x474),
            'EOFzH': function (q, r) {
                return q < r;
            },
            'AZweM': cA(0x1ed),
            'lhePL': 'culvy',
            'lzhKH': '[无限试用]\x20启动自动点击试用按钮...',
            'ljJwX': '[无限试用]\x20自动点击已启动',
            'HPxjd': cA(0x446),
            'sTejQ': cA(0x41a),
            'EvXrz': cA(0x2e5),
            'ORoQV': cA(0x3fe),
            'nmAyM': '>>>>\x20handleYoutube\x20开始执行',
            'kRLcH': cA(0x3ba),
            'YKvAl': cA(0x275),
            'aUPzc': 'Failed\x20create\x20speed\x20button\x20elements:',
            'xCHmH': function (q, r, s) {
                return q(r, s);
            },
            'DFwWg': cA(0x48e),
            'qPVbK': cA(0x1f1),
            'CrLqY': function (q, r, s) {
                return q(r, s);
            },
            'eIlvK': cA(0x2d0),
            'UgsPw': cA(0x3f1),
            'yEYmt': cA(0x4a2),
            'dcTjZ': '[跳过]\x20检测到广告，跳过倍速设置',
            'evptT': function (q, r) {
                return q !== r;
            },
            'agNmy': function (q, r) {
                return q !== r;
            },
            'FgyYI': cA(0x47b),
            'KpueO': cA(0x2a2),
            'AzYDI': '当前URL:',
            'QcKHO': 'youtube.com/watch',
            'KWfjk': 'BkziT',
            'eENnv': 'QGYQj',
            'PazFx': 'mnmyO',
            'CnuDS': '>>>>\x20handleBilibili\x20开始执行',
            'LTEmP': cA(0x2dc),
            'NdVfT': cA(0x236),
            'EaEIn': cA(0x41b),
            'YAWkg': cA(0x2c6),
            'fGHUG': cA(0x304),
            'qVLzx': 'spllk',
            'JEupR': function (q, r, s) {
                return q(r, s);
            },
            'xLrMz': '[设置]\x20自动网页全屏\x20已启用',
            'aMMqH': function (q, r, s) {
                return q(r, s);
            },
            'JQjOp': cA(0x4a0),
            'ectLT': function (q) {
                return q();
            },
            'TwUno': cA(0x2c3),
            'Lxdnl': cA(0x255),
            'ZOjVn': cA(0x232),
            'KwTPM': cA(0x397),
            'kyetQ': function (q, r) {
                return q !== r;
            },
            'MXYSC': cA(0x40d),
            'MrnpF': function (q, r) {
                return q !== r;
            },
            'BzzCo': '[清理]\x20bilibili\x20试用1080P\x20定时器',
            'PiWJh': function (q, r) {
                return q(r);
            },
            'otWgh': cA(0x328),
            'otBTa': cA(0x47d),
            'JzjtN': cA(0x20b),
            'QkESO': cA(0x31a),
            'WUZgi': function (q, r, s) {
                return q(r, s);
            },
            'jVRph': 'keydown',
            'sZwVa': cA(0x458),
            'dwZHd': function (q, r) {
                return q(r);
            },
            'dstQB': cA(0x3eb),
            'dEUJg': cA(0x468),
            'hJbjl': '==========\x20一次性初始化完成\x20==========',
            'ePgoP': cA(0x206),
            'mYWhh': cA(0x27f),
            'aaZUP': cA(0x272),
            'RXSJo': 'Bilibili_Rate_Enabled',
            'kBRsD': function (q, r) {
                return q === r;
            },
            'EiEeo': cA(0x345),
            'ZUXVD': cA(0x432),
            'IOtTf': cA(0x3b3),
            'plJWI': cA(0x424),
            'BbjzV': cA(0x2c4),
            'xWffx': cA(0x273),
            'qWgAX': cA(0x334),
            'QSxEf': cA(0x2bc),
            'EbfPj': ',\x20键减速',
            'kYcpQ': cA(0x43d),
            'qbhXm': cA(0x310),
            'PRkjl': cA(0x24e),
            'LYXju': cA(0x490),
            'JBbjs': cA(0x49e),
            'kotcl': 'Bilibili\x20-\x20自动视频网页全屏',
            'qNRiE': cA(0x2b2),
            'HqXEm': 'Bilibili\x20-\x20未登录时无限试用1080P',
            'pjzVU': 'Bilibili\x20-\x20移除分辨率按钮',
            'WopTi': cA(0x3a6),
            'WbTxK': cA(0x385),
            'QNeOF': cA(0x2ae),
            'bBKyR': cA(0x218),
            'tVHdT': 'Bilibili\x20-\x20移除网页全屏按钮',
            'hXOxq': cA(0x30f),
            'idyog': cA(0x261),
            'adXdP': cA(0x28a),
            'lAbsA': cA(0x3df),
            'zbywy': cA(0x42c),
            'MMkca': 'Youtube\x20-\x20Remove\x20Subtitles\x20Button',
            'LTLLl': cA(0x223),
            'rfpVm': cA(0x481),
            'CZDgj': 'Bilibili\x20-\x20Unlimited\x201080P\x20Trial\x20(No\x20Login)',
            'lxpIu': cA(0x1f2),
            'dHRgi': cA(0x200),
            'ryyhj': cA(0x1fa),
            'VXLWP': cA(0x38b),
            'veRFn': cA(0x2b4),
            'vdIHH': cA(0x20c),
            'FUdut': cA(0x49c),
            'tuWET': cA(0x21b),
            'WgWmb': '1.5',
            'wFdqz': cA(0x413),
            'kuzpN': cA(0x1f5),
            'xkFiB': cA(0x3d4),
            'IQeGZ': '2.5',
            'ACXgb': '3.5',
            'KbbMu': '4.0',
            'pIZWt': '#287F54',
            'RrqTb': cA(0x32d),
            'nzszp': cA(0x22b),
            'VNGXP': cA(0x282),
            'ghubs': cA(0x2ac),
            'FZWLy': cA(0x2a1),
            'AEUGj': cA(0x43a),
            'Otzop': 'yt-navigate-finish',
            'LgXoX': 'ytp-live-badge-is-livehead',
            'QxQyg': cA(0x34f),
            'Yivvq': cA(0x416),
            'GzwXv': cA(0x253),
            'nQfRN': cA(0x33e),
            'bfPsV': '.bpx-player-container',
            'IbzVe': cA(0x388),
            'sgXCO': cA(0x3ae),
            'LfPLs': cA(0x1f9),
            'bRcZb': cA(0x3e7),
            'IitVs': '.bpx-player-ctrl-setting',
            'siiXJ': '[启动]\x20MutationObserver\x20监听\x20Bilibili\x20URL\x20变化'
        };
    const h = void 0x0;
    (function () {
        const cC = cA, q = {
                'IpiwG': function (s, t) {
                    return s !== t;
                },
                'jkqub': g['mZnZP'],
                'VuRFT': function (s, t) {
                    const cB = b;
                    return g[cB(0x27c)](s, t);
                },
                'LgJbz': g[cC(0x3ac)],
                'fWUBJ': g[cC(0x3b7)],
                'LhfnA': function (s, t) {
                    const cD = cC;
                    return g[cD(0x2d9)](s, t);
                },
                'JARuy': function (s, t) {
                    return g['WQoqV'](s, t);
                },
                'YcRGw': g[cC(0x226)],
                'jTRQP': g[cC(0x3c8)],
                'azkgy': g[cC(0x22a)],
                'LTHaQ': g[cC(0x401)],
                'etILx': g[cC(0x435)],
                'TqHzq': g['ekqQN']
            };
        if (g[cC(0x459)](g[cC(0x43e)], cC(0x309))) {
            if (!window[cC(0x284)][cC(0x381)][cC(0x2b6)](g[cC(0x1ef)]))
                return;
            const s = void 0x0;
            if (!g[cC(0x2d9)](g[cC(0x398)], localStorage[cC(0x23d)](g[cC(0x293)])))
                return;
            if (document[cC(0x3ec)][cC(0x2b6)](g[cC(0x344)]))
                return;
            console['log'](g['zqjFC']);
            const originDefineProperty = Object[cC(0x213)];
            Object[cC(0x213)] = function (t, u, v) {
                const cE = cC;
                return q[cE(0x1ec)](q[cE(0x4a1)], u) && q[cE(0x3a0)](q[cE(0x2fa)], u) || (console[cE(0x2db)](q[cE(0x2bb)], u), v = {
                    'get': () => !0x0,
                    'enumerable': !0x1,
                    'configurable': !0x0
                }), originDefineProperty[cE(0x259)](this, t, u, v);
            };
            const originSetTimeout = unsafeWindow[cC(0x2de)];
            unsafeWindow['setTimeout'] = function (t, u, ...v) {
                const cF = cC;
                if (q[cF(0x3b8)](0x7530, u) && t && q[cF(0x445)](cF(0x482), typeof t)) {
                    if (q[cF(0x2ff)] !== q['jTRQP']) {
                        const x = t[cF(0x268)]();
                        (x[cF(0x2b6)](q[cF(0x3d9)]) || x['includes']('试用') || x[cF(0x2b6)](q[cF(0x2ca)]) || x[cF(0x2b6)](q['etILx'])) && (console[cF(0x2db)](q['TqHzq']), u = 0x11e1a300);
                    } else {
                        const y = h['bW'][cF(0x244)]((z, A) => Math[cF(0x357)](parseFloat(A) - y) < Math['abs'](parseFloat(z) - n) ? A : z);
                        k = l['bW'][cF(0x2cd)](y);
                    }
                }
                return originSetTimeout[cF(0x259)](this, t, u, ...v);
            }, console['log'](g[cC(0x35e)]);
        } else {
            let t = navigator['language'][cC(0x242)]();
            return t[cC(0x315)]('zh') ? 'zh' : (t[cC(0x315)]('en'), 'en');
        }
    }());
    const i = {};
    i['Menu_Settings'] = g[cA(0x39d)], i[cA(0x335)] = '保存', i[cA(0x46e)] = '关闭', i['Menu_Shortcut_Title'] = cA(0x393), i[cA(0x45e)] = [
        g[cA(0x324)],
        cA(0x28f)
    ], i[cA(0x408)] = cA(0x2c1), i[cA(0x448)] = g[cA(0x31c)], i[cA(0x3bc)] = g[cA(0x2e4)], i[cA(0x470)] = g['PRkjl'], i[cA(0x2d3)] = g[cA(0x48a)], i[cA(0x461)] = g[cA(0x300)], i[cA(0x40b)] = g[cA(0x40e)], i[cA(0x409)] = g[cA(0x31e)], i[cA(0x3bf)] = g[cA(0x2fb)], i[cA(0x303)] = g[cA(0x264)], i[cA(0x2eb)] = g[cA(0x262)], i[cA(0x27b)] = cA(0x22f), i[cA(0x2a7)] = g['WbTxK'], i['Bilibili_Remove_Speed'] = g['QNeOF'], i[cA(0x3cf)] = g[cA(0x358)], i['Bilibili_Remove_Settings'] = cA(0x270), i[cA(0x263)] = g[cA(0x22c)];
    const j = {};
    j[cA(0x3ff)] = g[cA(0x41e)], j[cA(0x335)] = cA(0x21e), j[cA(0x46e)] = g[cA(0x1f0)], j['Menu_Shortcut_Title'] = cA(0x407), j[cA(0x45e)] = [
        g[cA(0x39f)],
        cA(0x3ca)
    ], j[cA(0x408)] = g[cA(0x1ee)], j['Youtube_Action_Rate'] = cA(0x33d), j['Youtube_Remove_Autoplay'] = g[cA(0x44c)], j[cA(0x470)] = g[cA(0x2d5)], j[cA(0x2d3)] = g[cA(0x38a)], j[cA(0x461)] = g['rfpVm'], j['Bilibili_Action_WebFullscreen'] = cA(0x3aa), j['Bilibili_Action_Rate'] = cA(0x364), j[cA(0x3bf)] = g[cA(0x3e3)], j['Bilibili_Remove_Quality'] = g[cA(0x37c)], j[cA(0x2eb)] = g[cA(0x497)], j[cA(0x27b)] = g[cA(0x3a9)], j['Bilibili_Remove_Wide'] = g['VXLWP'], j[cA(0x3c6)] = g[cA(0x3f6)], j[cA(0x3cf)] = 'Bilibili\x20-\x20Remove\x20Comments\x20Input\x20Area', j[cA(0x290)] = g['vdIHH'], j[cA(0x263)] = g[cA(0x423)];
    const k = {};
    k['zh'] = i, k['en'] = j;
    const l = k, settingPanelStyles = cA(0x2f7);
    let m = null;
    const n = {};
    n[cA(0x2c9)] = !0x1, n['c9'] = !0x1, n['cm'] = null, n['cq'] = !0x1, n['cr'] = null, n[cA(0x417)] = !0x1, n[cA(0x46b)] = !0x1, n['cs'] = !0x1;
    const o = {
            'bX': [
                cA(0x3d4),
                g[cA(0x3e9)],
                g[cA(0x376)],
                g[cA(0x3b1)],
                cA(0x23a),
                g[cA(0x39b)]
            ],
            'bW': [
                g[cA(0x2b8)],
                g[cA(0x3e9)],
                g[cA(0x376)],
                g[cA(0x3b1)],
                g['IQeGZ'],
                g['kuzpN'],
                g[cA(0x2cc)],
                g['KbbMu']
            ],
            'defaultSpeed': g[cA(0x3b1)],
            'bY': [
                cA(0x2df),
                g['pIZWt'],
                g[cA(0x2ed)]
            ],
            'bZ': 'en',
            'settingPanelItems': [],
            'settingPanelInitialized': !0x1,
            'settingPanelElement': null,
            'c0': null,
            'c1': null,
            'detectLanguage': function () {
                const cG = cA;
                let q = navigator[cG(0x421)]['toLowerCase']();
                return q[cG(0x315)]('zh') ? 'zh' : (q[cG(0x315)]('en'), 'en');
            },
            'c2': function (q) {
                const cH = cA;
                if (g[cH(0x2d9)](g[cH(0x3d2)], g[cH(0x418)])) {
                    const s = void 0x0;
                    document[cH(0x2f1)](g['ABpuV'])[cH(0x3f5)](u => u['classList'][cH(0x279)](cH(0x380)));
                    const t = document['querySelector'](cH(0x2f2) + j + '\x22]');
                    t && t[cH(0x36f)]['add'](g[cH(0x382)]);
                } else
                    return l[o['bZ']][q];
            },
            'initializePanel': function () {
                const cJ = cA, q = {
                        'Pompw': g['yDBoe'],
                        'luiMV': function (A, B) {
                            const cI = b;
                            return g[cI(0x27c)](A, B);
                        },
                        'PfgEB': g[cJ(0x2aa)],
                        'BpbIF': 'Nclmk',
                        'gwDXr': g[cJ(0x36e)],
                        'TujSd': function (A, B) {
                            return A !== B;
                        },
                        'watLp': g[cJ(0x456)]
                    };
                let r = document[cJ(0x2fc)](cJ(0x305));
                r['id'] = g[cJ(0x36c)];
                let s = document[cJ(0x2fc)]('h2');
                s[cJ(0x2c7)] = o['c2'](g[cJ(0x274)]), r[cJ(0x389)](s);
                for (const [A, B] of Object[cJ(0x2e1)](o[cJ(0x2e7)])) {
                    if (g[cJ(0x459)](g[cJ(0x437)], g[cJ(0x437)])) {
                        const C = g[cJ(0x299)](GM_getValue, k['c3'], !0x1);
                        localStorage[cJ(0x37f)](n['c3'], C['toString']());
                    } else {
                        let functionDiv = document[cJ(0x2fc)](g[cJ(0x36e)]);
                        functionDiv[cJ(0x377)] = g['flmeB'], r[cJ(0x389)](functionDiv);
                        let functionValue = g[cJ(0x299)](GM_getValue, B['c3'], !0x1), C = document[cJ(0x2fc)](g[cJ(0x22e)]);
                        C[cJ(0x477)] = g[cJ(0x314)], C['checked'] = functionValue, C['id'] = B['classId'], functionDiv[cJ(0x389)](C);
                        let D = document['createElement'](g['oCTsE']);
                        if (D[cJ(0x3ea)](g[cJ(0x2c2)], B[cJ(0x47f)]), D[cJ(0x2c7)] = B[cJ(0x462)], functionDiv[cJ(0x389)](D), B['c4']) {
                            if (g[cJ(0x238)] !== g[cJ(0x238)]) {
                                const E = document[cJ(0x2e9)](k['c5']['c6']['c7']);
                                E && (n['log'](g[cJ(0x443)]), E[cJ(0x27d)]());
                            } else {
                                let E = document[cJ(0x2fc)](g[cJ(0x1f4)]);
                                E['id'] = B['c4'], E[cJ(0x457)]['marginLeft'] = g[cJ(0x2d8)], o['bX'][cJ(0x3f5)](F => {
                                    const cL = cJ, G = {
                                            'ylJYT': function (I, J) {
                                                const cK = b;
                                                return g[cK(0x2fd)](I, J);
                                            },
                                            'DXSaN': g['IiboF']
                                        };
                                    if (g[cL(0x2d9)](g[cL(0x42d)], g[cL(0x42d)])) {
                                        let I = document[cL(0x2fc)](g[cL(0x224)]);
                                        I[cL(0x422)] = F, I['textContent'] = g[cL(0x2b1)](F, 'x'), E['appendChild'](I);
                                    } else {
                                        const J = G['ylJYT'](parseFloat, GM_getValue(h[cL(0x2e7)]['Youtube_Action_Rate']['c4'], i[cL(0x209)]));
                                        j[cL(0x2db)](G['DXSaN'], J), k['c8'](J), l[cL(0x2d7)]['c9'] = !0x1;
                                    }
                                }), E['value'] = g[cJ(0x299)](GM_getValue, B['c4'], o['defaultSpeed']), functionDiv['appendChild'](E);
                            }
                        }
                    }
                }
                const shortcutContainer = document[cJ(0x2fc)](g['PbUsG']);
                shortcutContainer[cJ(0x457)][cJ(0x395)] = '15px', shortcutContainer[cJ(0x457)][cJ(0x378)] = g[cJ(0x360)], shortcutContainer[cJ(0x457)][cJ(0x25b)] = g[cJ(0x24b)], shortcutContainer['style'][cJ(0x202)] = g[cJ(0x323)], shortcutContainer[cJ(0x457)]['display'] = g[cJ(0x2a5)], shortcutContainer[cJ(0x457)][cJ(0x2da)] = g[cJ(0x210)], shortcutContainer[cJ(0x457)][cJ(0x341)] = cJ(0x406);
                const t = o['c2'](g['JTnmo']), u = document[cJ(0x2fc)](cJ(0x305));
                u['textContent'] = t, shortcutContainer[cJ(0x389)](u);
                const v = void 0x0;
                o['c2'](g[cJ(0x3ab)])[cJ(0x3f5)](F => {
                    const cM = cJ, G = {};
                    G[cM(0x23e)] = q[cM(0x2ba)];
                    const H = G;
                    if (q[cM(0x2bd)](q[cM(0x429)], q[cM(0x208)])) {
                        const line = document[cM(0x2fc)](q['gwDXr']);
                        line['textContent'] = F, shortcutContainer[cM(0x389)](line);
                    } else
                        k[cM(0x3a2)](H[cM(0x23e)], G);
                }), r[cJ(0x389)](shortcutContainer);
                let w = document[cJ(0x2fc)](g['PbUsG']);
                w['className'] = g[cJ(0x287)];
                let x = document[cJ(0x2fc)](cJ(0x266));
                x['id'] = cJ(0x20a), x[cJ(0x2c7)] = o['c2'](cJ(0x335)), x[cJ(0x3b4)](g[cJ(0x1f3)], () => {
                    const cN = cJ, F = {
                            'hBVnF': cN(0x227),
                            'pkqxK': function (H, I, J) {
                                return H(I, J);
                            }
                        };
                    if (q[cN(0x3d3)](q[cN(0x2cf)], q['watLp'])) {
                        const H = {};
                        H[cN(0x3a7)] = F['hBVnF'];
                        const I = H, J = {};
                        J['Youtube_Remove_Autoplay'] = k['c5']['ca'][cN(0x243)], J[cN(0x470)] = l['c5']['ca']['cb'], J[cN(0x2d3)] = m['c5']['ca']['settingsBtn'], J[cN(0x461)] = n['c5']['ca']['cc'];
                        const K = J;
                        for (const L in K)
                            F[cN(0x215)](GM_getValue, s[cN(0x2e7)][L]['c3'], !0x1) && t[cN(0x447)](K[L])[cN(0x495)](M => {
                                const cO = cN;
                                K[cO(0x2db)](I['OBtQM'], L['c2'](L)), M['remove']();
                            });
                    } else
                        o[cN(0x441)]();
                });
                let y = document[cJ(0x2fc)](cJ(0x266));
                y['id'] = g[cJ(0x3da)], y[cJ(0x2c7)] = o['c2'](g['tMrMK']), y[cJ(0x3b4)](g[cJ(0x1f3)], () => {
                    o['cd']();
                }), w[cJ(0x389)](x), w[cJ(0x389)](y), r[cJ(0x389)](w), document['body'][cJ(0x389)](r), o[cJ(0x313)] = r, o[cJ(0x267)] = !0x0;
            },
            'saveSettings': function () {
                const cP = cA;
                for (const [r, s] of Object['entries'](o[cP(0x2e7)])) {
                    if (g[cP(0x2d9)](g[cP(0x28e)], g[cP(0x28e)])) {
                        const t = document[cP(0x386)](s['classId'])[cP(0x415)];
                        if (g[cP(0x390)](GM_setValue, s['c3'], t), localStorage[cP(0x37f)](s['c3'], t[cP(0x268)]()), s['c4']) {
                            const u = document[cP(0x386)](s['c4'])[cP(0x422)];
                            g['CysiZ'](GM_setValue, s['c4'], u);
                        }
                    } else {
                        if (p['c1'] && g['BaTtc'](clearTimeout, q['c1']), !r['c0']) {
                            const indicator = document[cP(0x2fc)](g[cP(0x36e)]);
                            indicator[cP(0x457)]['position'] = g['ApEjT'], indicator[cP(0x457)][cP(0x3c4)] = g[cP(0x2a8)], indicator[cP(0x457)][cP(0x47c)] = g[cP(0x2a8)], indicator[cP(0x457)]['transform'] = cP(0x3d8), indicator[cP(0x457)][cP(0x47e)] = g['EOLAi'], indicator[cP(0x457)][cP(0x25b)] = g[cP(0x318)], indicator[cP(0x457)][cP(0x3ee)] = g['lNLEi'], indicator[cP(0x457)][cP(0x2ea)] = g[cP(0x2d8)], indicator[cP(0x457)]['fontSize'] = cP(0x241), indicator[cP(0x457)][cP(0x202)] = g[cP(0x323)], indicator[cP(0x457)]['zIndex'] = cP(0x42e), indicator['style'][cP(0x2be)] = g[cP(0x231)], indicator[cP(0x457)][cP(0x233)] = g[cP(0x2a3)], indicator[cP(0x457)][cP(0x48d)] = '0', document[cP(0x3d5)][cP(0x389)](indicator), C['c0'] = indicator;
                        }
                        const fullscreenElement = document['fullscreenElement'] || document[cP(0x2fe)];
                        fullscreenElement ? t['c0'][cP(0x30e)] !== fullscreenElement && fullscreenElement[cP(0x389)](u['c0']) : g['iFZdn'](v['c0'][cP(0x30e)], document[cP(0x3d5)]) && document[cP(0x3d5)]['appendChild'](w['c0']), x['c0'][cP(0x2c7)] = y + 'x', z['c0']['style'][cP(0x48d)] = '1', A['c1'] = setTimeout(() => {
                            const cQ = cP;
                            D['c0'][cQ(0x457)][cQ(0x48d)] = '0';
                        }, 0x1f4);
                    }
                }
                o[cP(0x313)]['classList'][cP(0x3cd)](g[cP(0x41d)]);
            },
            'cd': function () {
                const cR = cA;
                if (g[cR(0x44f)] !== g[cR(0x33a)])
                    o[cR(0x267)] || o[cR(0x2a4)](), o[cR(0x313)][cR(0x36f)]['toggle']('show');
                else {
                    const r = {
                            'VeIVA': function (u, v, x) {
                                return u(v, x);
                            },
                            'FeqYh': cR(0x227)
                        }, s = {};
                    s[cR(0x303)] = m['c5']['c6']['ce'], s['Bilibili_Remove_Eplist'] = n['c5']['c6']['cf'], s[cR(0x27b)] = o['c5']['c6']['cg'], s[cR(0x2a7)] = p['c5']['c6']['ch'], s[cR(0x3c6)] = q['c5']['c6']['ci'], s[cR(0x3cf)] = r['c5']['c6']['cj'], s['Bilibili_Remove_Settings'] = s['c5']['c6'][cR(0x47a)], s[cR(0x263)] = t['c5']['c6']['ck'];
                    const t = s;
                    setInterval(() => {
                        const cS = cR;
                        for (const H in t) {
                            const I = A[cS(0x2e7)][H]?.['c3'], J = void 0x0;
                            if (r[cS(0x40a)](GM_getValue, I, !0x1)) {
                                const K = document['querySelector'](t[H]);
                                K && (C[cS(0x2db)](r[cS(0x327)], H), K[cS(0x279)]());
                            }
                        }
                    }, 0x3e8);
                }
            },
            'initSettingItems': function (q) {
                const cT = cA;
                for (const [s, t] of Object[cT(0x2e1)](o['settingPanelItems'])) {
                    if (g[cT(0x459)](g[cT(0x2e8)], g[cT(0x222)])) {
                        const u = g[cT(0x44b)](GM_getValue, t['c3'], !0x1);
                        localStorage[cT(0x37f)](t['c3'], u[cT(0x268)]());
                    } else
                        j['cd']();
                }
                q[cT(0x2b6)](g['audOD']) ? o[cT(0x2e7)] = {
                    'Youtube_Action_TheaterMode': {
                        'classId': g['KpLmN'],
                        'text': o['c2'](g[cT(0x2cb)]),
                        'c3': cT(0x408)
                    },
                    'Youtube_Action_Rate': {
                        'classId': cT(0x448),
                        'text': o['c2'](g['ucNYd']),
                        'c3': g['hSRxS'],
                        'c4': g[cT(0x346)]
                    },
                    'Youtube_Remove_Autoplay': {
                        'classId': 'Youtube_Remove_Autoplay',
                        'text': o['c2'](g[cT(0x308)]),
                        'c3': g[cT(0x308)]
                    },
                    'Youtube_Remove_Subtitles': {
                        'classId': g['NxwuB'],
                        'text': o['c2'](g['NxwuB']),
                        'c3': g['NxwuB']
                    },
                    'Youtube_Remove_Settings': {
                        'classId': g[cT(0x29c)],
                        'text': o['c2'](g[cT(0x29c)]),
                        'c3': g[cT(0x29c)]
                    },
                    'Youtube_Remove_TheaterMode': {
                        'classId': g[cT(0x410)],
                        'text': o['c2'](g[cT(0x410)]),
                        'c3': g[cT(0x410)]
                    }
                } : q[cT(0x2b6)](g['rjajk']) && (o[cT(0x2e7)] = {
                    'Bilibili_Action_WebFullscreen': {
                        'classId': g[cT(0x362)],
                        'text': o['c2'](g[cT(0x362)]),
                        'c3': g[cT(0x362)]
                    },
                    'Bilibili_Action_Rate': {
                        'classId': 'Bilibili_Action_Rate',
                        'text': o['c2'](g['BtxmL']),
                        'c3': cT(0x332),
                        'c4': g[cT(0x24d)]
                    },
                    'Bilibili_Remove_Quality': {
                        'classId': g[cT(0x276)],
                        'text': o['c2'](g['UQnuL']),
                        'c3': g[cT(0x276)]
                    },
                    'Bilibili_Remove_Eplist': {
                        'classId': g[cT(0x288)],
                        'text': o['c2'](g['yOnJJ']),
                        'c3': g[cT(0x288)]
                    },
                    'Bilibili_Remove_Pip': {
                        'classId': g['RdNbR'],
                        'text': o['c2'](cT(0x27b)),
                        'c3': cT(0x27b)
                    },
                    'Bilibili_Remove_Wide': {
                        'classId': g[cT(0x321)],
                        'text': o['c2'](g[cT(0x321)]),
                        'c3': g['VApjR']
                    },
                    'Bilibili_Remove_Speed': {
                        'classId': g[cT(0x471)],
                        'text': o['c2'](g['qNjjj']),
                        'c3': g[cT(0x471)]
                    },
                    'Bilibili_Remove_Comments': {
                        'classId': g[cT(0x3b2)],
                        'text': o['c2'](g[cT(0x3b2)]),
                        'c3': g['uPEJE']
                    },
                    'Bilibili_Remove_Settings': {
                        'classId': g[cT(0x30b)],
                        'text': o['c2'](cT(0x290)),
                        'c3': g[cT(0x30b)]
                    },
                    'Bilibili_Remove_WebFullscreen': {
                        'classId': g['yHdzE'],
                        'text': o['c2'](cT(0x263)),
                        'c3': g[cT(0x493)]
                    }
                });
            },
            'cl': function (q, r) {
                const cV = cA, s = {
                        'WwIMx': g['PwZgx'],
                        'CvrHq': function (w, z) {
                            const cU = b;
                            return g[cU(0x2b1)](w, z);
                        },
                        'yVxUK': cV(0x21c),
                        'whwQh': g[cV(0x22e)],
                        'Pfofs': g['ZoNLN'],
                        'GZPCM': cV(0x473),
                        'FLTMG': g[cV(0x2c2)],
                        'wAoFr': g[cV(0x1f4)],
                        'RMhaB': cV(0x3f4),
                        'hErow': g[cV(0x25d)]
                    };
                if (console['log'](g[cV(0x3be)]), document[cV(0x2e9)](cV(0x33f)))
                    return;
                let t = o['bY'][0x0], u = document[cV(0x2fc)](g[cV(0x36e)]);
                u['id'] = g[cV(0x235)], u[cV(0x457)][cV(0x2ab)] = g[cV(0x2a5)], u['style'][cV(0x341)] = g['yQrbD'], u[cV(0x457)][cV(0x43c)] = g[cV(0x221)], u[cV(0x457)]['height'] = g[cV(0x3f9)];
                const v = w => {
                    const cW = cV, x = {
                            'Xjasj': s[cW(0x211)],
                            'lKfmV': function (z, A) {
                                const cX = cW;
                                return s[cX(0x2c0)](z, A);
                            },
                            'pzTOY': s[cW(0x29d)],
                            'pyjSu': function (z, A, B) {
                                return z(A, B);
                            },
                            'cvuqf': s['whwQh'],
                            'IhQoH': s[cW(0x281)],
                            'SoQdd': s[cW(0x240)],
                            'WagaY': s[cW(0x252)],
                            'biGmO': s[cW(0x201)]
                        };
                    if (s[cW(0x469)] === s[cW(0x338)]) {
                        let functionDiv = document[cW(0x2fc)](cW(0x305));
                        functionDiv['className'] = hAAFBE[cW(0x23c)], m[cW(0x389)](functionDiv);
                        let functionValue = hAAFBE[cW(0x391)](GM_getValue, n['c3'], !0x1), z = document[cW(0x2fc)](hAAFBE[cW(0x30c)]);
                        z['type'] = hAAFBE['IhQoH'], z[cW(0x415)] = functionValue, z['id'] = o['classId'], functionDiv[cW(0x389)](z);
                        let D = document[cW(0x2fc)](hAAFBE['SoQdd']);
                        if (D[cW(0x3ea)](hAAFBE[cW(0x34a)], p['classId']), D[cW(0x2c7)] = q[cW(0x462)], functionDiv[cW(0x389)](D), r['c4']) {
                            let E = document[cW(0x2fc)](hAAFBE[cW(0x40f)]);
                            E['id'] = w['c4'], E[cW(0x457)]['marginLeft'] = cW(0x342), x['bX'][cW(0x3f5)](F => {
                                const cY = cW;
                                let G = document[cY(0x2fc)](hAAFBE[cY(0x3bb)]);
                                G[cY(0x422)] = F, G['textContent'] = hAAFBE[cY(0x2bf)](F, 'x'), E['appendChild'](G);
                            }), E[cW(0x422)] = GM_getValue(y['c4'], z[cW(0x209)]), functionDiv[cW(0x389)](E);
                        }
                    } else
                        p[cW(0x2d7)]['cm'] = w, o['c8'](w);
                };
                for (let w = 0x0; g['gdkgN'](w, o['bX'][cV(0x3fd)]); w++) {
                    const x = g[cV(0x2fd)](parseFloat, o['bX'][w]);
                    g[cV(0x311)](x, 0x1) && (t = o['bY'][0x1]), g[cV(0x311)](x, 1.5) && (t = o['bY'][0x2]);
                    let y = document[cV(0x2fc)](cV(0x266));
                    y[cV(0x457)]['backgroundColor'] = t, y[cV(0x457)][cV(0x352)] = cV(0x372), y[cV(0x457)][cV(0x420)] = g[cV(0x3e8)], y[cV(0x457)][cV(0x2ea)] = g[cV(0x292)], y[cV(0x457)][cV(0x25b)] = g[cV(0x425)], y['style'][cV(0x454)] = cV(0x34c), y[cV(0x457)]['fontFamily'] = g['MrFMq'], y['style'][cV(0x2ab)] = cV(0x317), y[cV(0x457)][cV(0x43c)] = g[cV(0x221)], y[cV(0x457)][cV(0x341)] = g['yQrbD'], y[cV(0x457)][cV(0x2d4)] = '38px', y[cV(0x457)]['height'] = '24px', y['style'][cV(0x378)] = g[cV(0x22d)], y[cV(0x2c7)] = o['bX'][w] + '×', y[cV(0x377)] = g[cV(0x440)], y[cV(0x203)][cV(0x367)] = o['bX'][w], y[cV(0x3b4)]('click', () => {
                        const cZ = cV;
                        g[cZ(0x339)](g[cZ(0x38d)], g[cZ(0x38d)]) ? r ? r(o['bX'][w]) : g[cZ(0x3c0)](v, o['bX'][w]) : (k[cZ(0x2db)](cZ(0x277)), n['click']());
                    }), u[cV(0x389)](y);
                }
                q(u);
            },
            'cn': function (q) {
                const d0 = cA;
                let r = document[d0(0x2e9)](q);
                r && r['remove']();
            },
            'c8': function (q) {
                const d1 = cA;
                if (g['rbiay'] === g[d1(0x31b)]) {
                    const s = document['querySelector'](g[h]);
                    s && (i[d1(0x2db)](g[d1(0x42f)], j), s[d1(0x279)]());
                } else {
                    const s = document[d1(0x291)](g[d1(0x347)])[0x0];
                    s && (s[d1(0x228)] = parseFloat(q), o['co'](q), o['cp'](q));
                }
            },
            'cp': function (q) {
                const d2 = cA, r = {
                        'rAXnW': g['IFkAn'],
                        'OPkcr': d2(0x33f),
                        'ZYxlD': d2(0x305),
                        'VpFpx': g['pPoVT'],
                        'rNitF': g[d2(0x2a5)],
                        'ygMNI': g[d2(0x221)],
                        'RSgth': function (t, u) {
                            const d3 = d2;
                            return g[d3(0x28b)](t, u);
                        },
                        'EwMif': function (t, u) {
                            return g['vpfIn'](t, u);
                        },
                        'bWSNc': function (t, u) {
                            return t >= u;
                        },
                        'pzMja': g[d2(0x3a4)],
                        'dhtXS': g['AyBog'],
                        'DvfIq': g['prenl'],
                        'fJWOT': '#ffffff',
                        'GSBkO': d2(0x34c),
                        'eUIfu': d2(0x34b),
                        'pZjOi': g[d2(0x225)],
                        'uhsto': g[d2(0x26d)],
                        'qquhl': function (t, u) {
                            return g['ZEdWb'](t, u);
                        },
                        'pCkIM': g[d2(0x440)],
                        'IPqJr': g[d2(0x1f3)]
                    };
                if (g[d2(0x339)](g[d2(0x248)], d2(0x2f9))) {
                    if (o['c1'] && g[d2(0x3c0)](clearTimeout, o['c1']), !o['c0']) {
                        const indicator = document['createElement'](g['PbUsG']);
                        indicator[d2(0x457)][d2(0x37e)] = g['ApEjT'], indicator[d2(0x457)][d2(0x3c4)] = g[d2(0x2a8)], indicator[d2(0x457)][d2(0x47c)] = d2(0x3dd), indicator[d2(0x457)][d2(0x280)] = 'translate(-50%,\x20-50%)', indicator['style'][d2(0x47e)] = g[d2(0x3e1)], indicator[d2(0x457)]['color'] = g['oCZnI'], indicator[d2(0x457)][d2(0x3ee)] = d2(0x419), indicator[d2(0x457)][d2(0x2ea)] = g[d2(0x2d8)], indicator[d2(0x457)][d2(0x378)] = g[d2(0x26d)], indicator[d2(0x457)][d2(0x202)] = g['lNgcj'], indicator[d2(0x457)][d2(0x2e3)] = g[d2(0x1f8)], indicator[d2(0x457)][d2(0x2be)] = g['waKwL'], indicator[d2(0x457)][d2(0x233)] = g['fkvwR'], indicator['style'][d2(0x48d)] = '0', document[d2(0x3d5)][d2(0x389)](indicator), o['c0'] = indicator;
                    }
                    const fullscreenElement = document['fullscreenElement'] || document[d2(0x2fe)];
                    fullscreenElement ? g[d2(0x24c)](o['c0'][d2(0x30e)], fullscreenElement) && fullscreenElement[d2(0x389)](o['c0']) : g[d2(0x455)](o['c0']['parentNode'], document[d2(0x3d5)]) && document[d2(0x3d5)]['appendChild'](o['c0']), o['c0'][d2(0x2c7)] = q + 'x', o['c0']['style']['opacity'] = '1', o['c1'] = setTimeout(() => {
                        const d4 = d2;
                        o['c0']['style'][d4(0x48d)] = '0';
                    }, 0x1f4);
                } else {
                    if (r[d2(0x2db)](oCTlso[d2(0x2ef)]), document['querySelector'](oCTlso[d2(0x3d0)]))
                        return;
                    let t = s['bY'][0x0], u = document['createElement'](oCTlso[d2(0x2b5)]);
                    u['id'] = oCTlso[d2(0x1f7)], u[d2(0x457)]['display'] = oCTlso['rNitF'], u[d2(0x457)][d2(0x341)] = oCTlso['ygMNI'], u[d2(0x457)][d2(0x43c)] = oCTlso[d2(0x434)], u[d2(0x457)][d2(0x49b)] = d2(0x35b);
                    const v = a5 => {
                        const d5 = d2;
                        G[d5(0x2d7)]['cm'] = a5, H['c8'](a5);
                    };
                    for (let w = 0x0; oCTlso[d2(0x2e0)](w, G['bX'][d2(0x3fd)]); w++) {
                        const x = oCTlso[d2(0x2c5)](parseFloat, Q['bX'][w]);
                        oCTlso['bWSNc'](x, 0x1) && (t = R['bY'][0x1]), x >= 1.5 && (t = S['bY'][0x2]);
                        let y = document[d2(0x2fc)](oCTlso[d2(0x21d)]);
                        y[d2(0x457)][d2(0x47e)] = t, y[d2(0x457)]['marginRight'] = oCTlso['dhtXS'], y[d2(0x457)][d2(0x420)] = oCTlso[d2(0x39e)], y[d2(0x457)][d2(0x2ea)] = d2(0x373), y[d2(0x457)]['color'] = oCTlso[d2(0x207)], y[d2(0x457)]['cursor'] = oCTlso[d2(0x329)], y[d2(0x457)][d2(0x45d)] = oCTlso[d2(0x3c7)], y[d2(0x457)]['display'] = oCTlso[d2(0x320)], y[d2(0x457)][d2(0x43c)] = oCTlso[d2(0x434)], y['style'][d2(0x341)] = oCTlso['ygMNI'], y[d2(0x457)][d2(0x2d4)] = oCTlso[d2(0x301)], y[d2(0x457)][d2(0x49b)] = oCTlso[d2(0x43b)], y['style'][d2(0x378)] = d2(0x26a), y[d2(0x2c7)] = oCTlso[d2(0x326)](T['bX'][w], '×'), y[d2(0x377)] = oCTlso[d2(0x20e)], y[d2(0x203)][d2(0x367)] = U['bX'][w], y[d2(0x3b4)](oCTlso[d2(0x496)], () => {
                            t ? u(v['bX'][w]) : v(w['bX'][w]);
                        }), u['appendChild'](y);
                    }
                    F(u);
                }
            },
            'co': function (q) {
                const d6 = cA, r = void 0x0;
                document[d6(0x2f1)](g[d6(0x298)])['forEach'](t => t[d6(0x36f)][d6(0x279)]('active'));
                const s = document['querySelector'](d6(0x2f2) + q + '\x22]');
                s && s[d6(0x36f)][d6(0x35c)](g['GUYWY']);
            },
            'handleKeydown': function (q) {
                const d7 = cA, r = {};
                r[d7(0x3e5)] = d7(0x305), r[d7(0x384)] = g[d7(0x22a)], r[d7(0x343)] = g[d7(0x401)], r[d7(0x20d)] = g[d7(0x435)], r[d7(0x31f)] = g[d7(0x297)];
                const s = r;
                if (g['moWzp'] === g[d7(0x44a)]) {
                    const u = q['target'];
                    if (g[d7(0x204)] === u[d7(0x3b0)] || 'TEXTAREA' === u[d7(0x3b0)] || u[d7(0x475)])
                        return;
                    const v = document[d7(0x291)]('video')[0x0];
                    if (!v)
                        return;
                    const w = v[d7(0x228)];
                    let x = o['bW']['findIndex'](y => parseFloat(y) === w);
                    if (g[d7(0x229)](-0x1, x)) {
                        if (g[d7(0x1fd)](g[d7(0x1fc)], g[d7(0x26b)])) {
                            const y = o['bW'][d7(0x244)]((z, A) => Math['abs'](parseFloat(A) - w) < Math[d7(0x357)](parseFloat(z) - w) ? A : z);
                            x = o['bW'][d7(0x2cd)](y);
                        } else {
                            const line = document['createElement'](dCNMVR[d7(0x3e5)]);
                            line['textContent'] = j, shortcutContainer['appendChild'](line);
                        }
                    }
                    let newIndex = x;
                    if (g[d7(0x3ad)] === q['code'])
                        g['uFUmn'](x, 0x0) && (newIndex = g['rJFyg'](x, 0x1));
                    else {
                        if (g[d7(0x219)](g[d7(0x24f)], q[d7(0x412)]))
                            return;
                        g[d7(0x30a)](x, o['bW']['length'] - 0x1) && (newIndex = x + 0x1);
                    }
                    o['c8'](o['bW'][newIndex]), p[d7(0x2d7)]['cm'] = o['bW'][newIndex];
                } else {
                    const z = n['toString']();
                    (z[d7(0x2b6)](dCNMVR['zJIwf']) || z[d7(0x2b6)]('试用') || z['includes'](dCNMVR[d7(0x343)]) || z[d7(0x2b6)](dCNMVR['qeVhy'])) && (g[d7(0x2db)](dCNMVR[d7(0x31f)]), h = 0x11e1a300);
                }
            }
        }, p = {
            'data': n,
            'c5': {
                'ca': {
                    'ct': g[cA(0x319)],
                    'cu': g[cA(0x286)],
                    'autoplayToggleBtn': g[cA(0x45a)],
                    'cb': g['FZWLy'],
                    'settingsBtn': g['AEUGj'],
                    'cc': cA(0x439),
                    'finishListener': g[cA(0x249)],
                    'liveStreamClass': g[cA(0x28c)],
                    'cv': g['QxQyg']
                },
                'c6': {
                    'playerContainer': g[cA(0x43f)],
                    'webFullClass': g['GzwXv'],
                    'cw': g[cA(0x452)],
                    'ct': g[cA(0x1eb)],
                    'cj': g[cA(0x356)],
                    'ce': g['sgXCO'],
                    'cf': cA(0x3d7),
                    'ck': g[cA(0x333)],
                    'cg': cA(0x41f),
                    'ch': g[cA(0x23b)],
                    'ci': '.bpx-player-ctrl-playbackrate',
                    'settingsBtn': g[cA(0x3e2)],
                    'c7': '.bpx-player-toast-confirm-login'
                }
            },
            'cx': function () {
                const d8 = cA, q = {};
                q[d8(0x411)] = g['Hhubk'];
                const r = q;
                if (g[d8(0x229)](g[d8(0x48f)], g['lhePL'])) {
                    console[d8(0x2db)](g['lzhKH']);
                    const t = setInterval(() => {
                        const d9 = d8, u = document[d9(0x2e9)](p['c5']['c6']['c7']);
                        u && (console[d9(0x2db)](r[d9(0x411)]), u['click']());
                    }, 0x64);
                    p[d8(0x2d7)]['cy'] = t, console[d8(0x2db)](g[d8(0x374)]);
                } else
                    h['log'](g[d8(0x38f)], i), j['c8'](k), l['data']['c9'] = !0x1;
            },
            'ca': function () {
                const da = cA, q = {
                        'Wedco': g[da(0x224)],
                        'eMmva': function (r, s) {
                            const db = da;
                            return g[db(0x2d2)](r, s);
                        },
                        'TysCu': da(0x484),
                        'WqMcv': g[da(0x3af)],
                        'wKFqF': g[da(0x347)],
                        'ZGqHT': da(0x256),
                        'ZbyFv': function (r, s) {
                            const dc = da;
                            return g[dc(0x48c)](r, s);
                        },
                        'EqYdv': g[da(0x359)],
                        'rkaid': g[da(0x38f)],
                        'xaWeW': g['ZJppA'],
                        'Onali': g[da(0x239)],
                        'jgpch': function (r, s, t) {
                            return g['CrLqY'](r, s, t);
                        },
                        'vGmrY': da(0x2b0)
                    };
                if (console[da(0x2db)](g['KpueO']), console['log'](g[da(0x370)], window['location'][da(0x381)]), window[da(0x284)]['href'][da(0x2b6)](g[da(0x37a)])) {
                    const r = void 0x0;
                    ((async () => {
                        const dd = da, s = {};
                        s['hVMbr'] = g[dd(0x42f)], s[dd(0x3ef)] = g['HPxjd'], s[dd(0x3c5)] = function (w, z) {
                            return w !== z;
                        }, s['twSkQ'] = g[dd(0x465)], s[dd(0x487)] = dd(0x3d6), s['QGaRc'] = g[dd(0x32b)];
                        const t = s;
                        if (p[dd(0x2d7)]['isYoutubePageProcessing'])
                            return void console[dd(0x2db)](g[dd(0x2af)]);
                        p[dd(0x2d7)]['isYoutubePageProcessing'] = !0x0, console[dd(0x2db)](g['nmAyM']);
                        try {
                            if (g[dd(0x219)](g['kRLcH'], g[dd(0x24a)]))
                                g[dd(0x2d7)]['cm'] = h, i['c8'](j);
                            else {
                                let w = await elmGetter[dd(0x447)](p['c5']['ca']['ct']);
                                console[dd(0x2db)](g[dd(0x36a)]), o['cl'](x => {
                                    const de = dd, y = {};
                                    y[de(0x245)] = q[de(0x230)];
                                    const z = y;
                                    if (q[de(0x3cb)](q[de(0x404)], de(0x484))) {
                                        let B = document[de(0x2fc)](jSdjMx['JVCOx']);
                                        B['value'] = n, B['textContent'] = g + 'x', h[de(0x389)](B);
                                    } else {
                                        w[de(0x2ee)](x), console[de(0x2db)](q[de(0x3f3)]);
                                        const B = document[de(0x291)](q[de(0x26e)])[0x0];
                                        B && (console['log'](q[de(0x491)], B[de(0x228)]), o['co'](B[de(0x228)][de(0x268)]()));
                                    }
                                }, x => {
                                    const df = dd;
                                    q['ZbyFv'](df(0x47b), q[df(0x379)]) ? (s[df(0x2db)](t[df(0x400)], h['c2'](i)), j[df(0x279)]()) : (console['log'](q[df(0x307)], x), o['c8'](x), p[df(0x2d7)]['c9'] = !0x1);
                                });
                            }
                        } catch (x) {
                            console['error'](g[dd(0x234)], x);
                        }
                        try {
                            const y = {};
                            y[dd(0x3bc)] = p['c5']['ca'][dd(0x243)], y['Youtube_Remove_Subtitles'] = p['c5']['ca']['cb'], y[dd(0x2d3)] = p['c5']['ca'][dd(0x47a)], y[dd(0x461)] = p['c5']['ca']['cc'];
                            const z = y;
                            for (const A in z)
                                g[dd(0x331)](GM_getValue, o[dd(0x2e7)][A]['c3'], !0x1) && elmGetter[dd(0x447)](z[A])['then'](B => {
                                    const dg = dd;
                                    console[dg(0x2db)](q[dg(0x349)], o['c2'](A)), B[dg(0x279)]();
                                });
                        } catch (B) {
                            console['error'](g[dd(0x39c)], B);
                        }
                        g[dd(0x390)](GM_getValue, o['settingPanelItems'][dd(0x408)]['c3'], !0x1) && (console[dd(0x2db)](g[dd(0x486)]), elmGetter['get'](p['c5']['ca']['cc'])[dd(0x495)](C => {
                            const dh = dd, D = {};
                            D[dh(0x29b)] = t[dh(0x3ef)];
                            const E = D;
                            if (t['MWGYZ'](t[dh(0x246)], t['tLzzc']))
                                console[dh(0x2db)](t['QGaRc']), C[dh(0x27d)]();
                            else {
                                h['before'](i), j[dh(0x2db)](gnuWQr[dh(0x29b)]);
                                const G = document['getElementsByTagName'](dh(0x2d1))[0x0];
                                G && (k[dh(0x2db)](dh(0x256), G[dh(0x228)]), l['co'](G['playbackRate']['toString']()));
                            }
                        }));
                        const u = g['CrLqY'](GM_getValue, o[dd(0x2e7)][dd(0x448)]['c3'], !0x1);
                        if (console[dd(0x2db)](g['eIlvK'], u ? g[dd(0x265)] : dd(0x32c)), u) {
                            if (g[dd(0x27c)](g[dd(0x363)], dd(0x4a2))) {
                                const C = {};
                                C['KCaBW'] = '[无限试用]\x20检测到试用按钮，自动切换已完成';
                                const D = C;
                                h[dd(0x2db)](RnGTFT[dd(0x2f4)]);
                                const E = RnGTFT[dd(0x405)](setInterval, () => {
                                    const di = dd, F = document[di(0x2e9)](E['c5']['c6']['c7']);
                                    F && (n[di(0x2db)](D[di(0x3f2)]), F[di(0x27d)]());
                                }, 0x64);
                                k[dd(0x2d7)]['cy'] = E, l[dd(0x2db)](RnGTFT[dd(0x32a)]);
                            } else {
                                const C = document[dd(0x2e9)](p['c5']['ca']['cv']), D = !!C;
                                if (console['log'](dd(0x46f), D), C)
                                    console[dd(0x2db)](g[dd(0x351)]);
                                else {
                                    const E = g[dd(0x3c0)](parseFloat, g[dd(0x390)](GM_getValue, o[dd(0x2e7)]['Youtube_Action_Rate']['c4'], o[dd(0x209)]));
                                    console[dd(0x2db)](g['IiboF'], E), o['c8'](E), p[dd(0x2d7)]['c9'] = !0x1;
                                }
                            }
                        }
                        console['log']('<<<<\x20handleYoutube\x20执行完毕'), p[dd(0x2d7)][dd(0x46b)] = !0x1;
                    })());
                }
                console[da(0x2db)](da(0x289));
            },
            'c6': function () {
                const dj = cA, q = {
                        'TlRLL': g['ZJppA'],
                        'iZtVs': function (s, t) {
                            return s !== t;
                        },
                        'JmpvW': g[dj(0x34d)],
                        'yRWtz': '[UI]\x20倍速按钮已添加到\x20speedBtn\x20之后',
                        'dtDbd': dj(0x256),
                        'bwQGi': dj(0x277),
                        'iDGNd': g['GhtHB'],
                        'bNILe': g['ySfeQ'],
                        'RqhQd': g[dj(0x21a)],
                        'thKUP': g[dj(0x368)],
                        'CvPgA': g[dj(0x472)],
                        'ZIspt': function (s, t, u) {
                            return s(t, u);
                        },
                        'qkApD': g['LTEmP'],
                        'szxJH': g[dj(0x265)],
                        'KWgvn': '未启用',
                        'jkjVl': dj(0x2a6),
                        'seAkf': g['NdVfT'],
                        'vRhWg': g[dj(0x444)],
                        'dOlme': g[dj(0x354)],
                        'BsAXh': dj(0x29a),
                        'cfysD': function (s, t) {
                            const dk = dj;
                            return g[dk(0x1fd)](s, t);
                        },
                        'ahIbA': g['fGHUG'],
                        'PSKKH': 'KdbOm',
                        'Bpyve': g['aUPzc'],
                        'wzDjM': g[dj(0x2ad)],
                        'ywXZQ': function (s, t, u) {
                            const dl = dj;
                            return g[dl(0x205)](s, t, u);
                        },
                        'bPOSz': g[dj(0x39c)],
                        'qHLBv': g[dj(0x2f6)],
                        'VSNlk': g[dj(0x25f)],
                        'AsChu': g['eIlvK'],
                        'WRaJu': function (s, t, u) {
                            const dm = dj;
                            return g[dm(0x3b5)](s, t, u);
                        },
                        'HdLKq': g['IiboF']
                    };
                console[dj(0x2db)](g[dj(0x3dc)]), console[dj(0x2db)](dj(0x251), window[dj(0x284)][dj(0x381)]);
                const r = async () => {
                    const dn = dj, s = {
                            'Wmutu': q[dn(0x3d1)],
                            'zyIgF': q[dn(0x394)],
                            'IEEZG': function (w, z) {
                                const dp = dn;
                                return q[dp(0x3a8)](w, z);
                            },
                            'sRQKq': dn(0x25a),
                            'yvcEt': q[dn(0x1ff)],
                            'DfuUQ': q[dn(0x237)],
                            'jUGyt': q[dn(0x49a)],
                            'EomHv': q[dn(0x296)],
                            'emLXk': dn(0x3e6)
                        };
                    console[dn(0x2db)](q['CvPgA']);
                    const t = q[dn(0x2ec)](GM_getValue, o[dn(0x2e7)][dn(0x3bf)]?.['c3'], !0x1);
                    if (console['log'](q[dn(0x403)], t ? q['szxJH'] : q[dn(0x3f8)]), t && !p[dn(0x2d7)]['cs']) {
                        const w = document[dn(0x3ec)][dn(0x2b6)](q[dn(0x28d)]);
                        console['log'](q['seAkf'], w ? q[dn(0x489)] : q['dOlme']), w || (console['log'](q[dn(0x302)]), p['cx'](), p['data']['cs'] = !0x0);
                    }
                    try {
                        if (q[dn(0x3cc)](q[dn(0x212)], q[dn(0x23f)]))
                            await elmGetter[dn(0x447)](p['c5']['c6']['ct']), console[dn(0x2db)](dn(0x336)), o['cl'](x => {
                                const dq = dn, y = {
                                        'zjTFR': function (B, C, D) {
                                            return B(C, D);
                                        },
                                        'XRcti': q[dq(0x3d1)]
                                    };
                                let z = document[dq(0x2e9)](p['c5']['c6']['cw']);
                                if (z) {
                                    if (q[dq(0x3a8)](q[dq(0x2a9)], q[dq(0x2a9)]))
                                        for (const B in k) {
                                            const C = o[dq(0x2e7)][B]?.['c3'], D = void 0x0;
                                            if (y[dq(0x1f6)](GM_getValue, C, !0x1)) {
                                                const E = document[dq(0x2e9)](r[B]);
                                                E && (s[dq(0x2db)](y['XRcti'], B), E['remove']());
                                            }
                                        }
                                    else {
                                        z['after'](x), console[dq(0x2db)](q[dq(0x247)]);
                                        const B = document[dq(0x291)](dq(0x2d1))[0x0];
                                        B && (console['log'](q[dq(0x33c)], B[dq(0x228)]), o['co'](B[dq(0x228)]['toString']()));
                                    }
                                }
                            });
                        else {
                            let x = document[dn(0x2e9)](j);
                            x && x['remove']();
                        }
                    } catch (x) {
                        console[dn(0x3a2)](q[dn(0x44e)], x);
                    }
                    try {
                        if (q[dn(0x316)] !== q['wzDjM'])
                            j['c0']['style'][dn(0x48d)] = '0';
                        else {
                            const y = {};
                            y[dn(0x303)] = p['c5']['c6']['ce'], y[dn(0x2eb)] = p['c5']['c6']['cf'], y[dn(0x27b)] = p['c5']['c6']['cg'], y[dn(0x2a7)] = p['c5']['c6']['ch'], y[dn(0x3c6)] = p['c5']['c6']['ci'], y[dn(0x3cf)] = p['c5']['c6']['cj'], y[dn(0x290)] = p['c5']['c6'][dn(0x47a)], y['Bilibili_Remove_WebFullscreen'] = p['c5']['c6']['ck'];
                            const z = y;
                            q[dn(0x467)](setInterval, () => {
                                const dr = dn;
                                for (const A in z) {
                                    const B = o[dr(0x2e7)][A]?.['c3'], C = void 0x0;
                                    if (GM_getValue(B, !0x1)) {
                                        const D = document[dr(0x2e9)](z[A]);
                                        D && (console[dr(0x2db)](s[dr(0x26c)], A), D[dr(0x279)]());
                                    }
                                }
                            }, 0x3e8);
                        }
                    } catch (A) {
                        console['error'](q[dn(0x2e6)], A);
                    }
                    try {
                        GM_getValue(o[dn(0x2e7)][dn(0x40b)]['c3'], !0x1) && (console['log'](q[dn(0x499)]), elmGetter[dn(0x447)](p['c5']['c6'][dn(0x283)])[dn(0x495)](B => {
                            const ds = dn;
                            if (s[ds(0x37b)] !== s[ds(0x438)])
                                B[ds(0x36f)]['contains'](p['c5']['c6']['webFullClass']) ? console[ds(0x2db)](s['emLXk']) : elmGetter[ds(0x447)](p['c5']['c6']['ck'])[ds(0x495)](D => {
                                    const dt = ds;
                                    console[dt(0x2db)](s[dt(0x32e)]), D[dt(0x27d)]();
                                });
                            else
                                return HWnEDW[ds(0x269)](HWnEDW[ds(0x3db)], k) && HWnEDW['IEEZG'](HWnEDW[ds(0x49d)], l) || (m[ds(0x2db)](HWnEDW[ds(0x29f)], n), o = {
                                    'get': () => !0x0,
                                    'enumerable': !0x1,
                                    'configurable': !0x0
                                }), originDefineProperty[ds(0x259)](this, p, q, r);
                        }));
                    } catch (B) {
                        console[dn(0x3a2)](q[dn(0x3c3)], B);
                    }
                    const u = GM_getValue(o[dn(0x2e7)][dn(0x409)]['c3'], !0x1);
                    if (console[dn(0x2db)](q['AsChu'], u ? q[dn(0x3e4)] : q[dn(0x3f8)]), u) {
                        const C = parseFloat(q['WRaJu'](GM_getValue, o[dn(0x2e7)]['Bilibili_Action_Rate']['c4'], o['defaultSpeed']));
                        console[dn(0x2db)](q[dn(0x449)], C), o['c8'](C);
                    }
                    console[dn(0x2db)](dn(0x3f7));
                };
                window['location'][dj(0x381)]['includes'](g['qOGcx']) && g['ectLT'](r), console[dj(0x2db)](dj(0x430));
            }
        };
    function main() {
        const du = cA, q = {};
        q[du(0x38c)] = g['QcKHO'], q[du(0x216)] = function (s, t) {
            return s + t;
        }, q[du(0x32f)] = du(0x2e2), q[du(0x426)] = g['CDDZW'], q['VITij'] = g[du(0x46c)], q[du(0x498)] = function (s, t) {
            return s + t;
        }, q['PZkRE'] = g['Lxdnl'];
        const r = q;
        p[du(0x2d7)][du(0x417)] ? console[du(0x2db)](g[du(0x355)]) : (p[du(0x2d7)][du(0x417)] = !0x0, console[du(0x2db)](du(0x451)), console[du(0x2db)](g[du(0x370)], window[du(0x284)][du(0x381)]), console[du(0x2db)](g[du(0x20f)], p['data'][du(0x2c9)]), g['kyetQ'](null, m) && (console['log'](g[du(0x375)]), clearInterval(m), m = null), g[du(0x38e)](null, p['data']['cr']) && (console['log']('[清理]\x20youtube\x20广告检测\x20定时器'), clearInterval(p[du(0x2d7)]['cr']), p[du(0x2d7)]['cr'] = null), g['vvSKv'](null, p[du(0x2d7)]['cy']) && (console[du(0x2db)](g[du(0x214)]), g['PiWJh'](clearInterval, p['data']['cy']), p[du(0x2d7)]['cy'] = null), console[du(0x2db)](g[du(0x3fc)], p[du(0x2d7)]['cq'], g[du(0x488)]), p[du(0x2d7)]['cq'] = !0x1, console[du(0x2db)](g[du(0x44d)], p[du(0x2d7)]['cs'], g[du(0x488)]), p[du(0x2d7)]['cs'] = !0x1, o['bZ'] = o['detectLanguage'](), o[du(0x485)](window[du(0x284)][du(0x381)]), p['data'][du(0x2c9)] || (console[du(0x2db)](g['QkESO']), GM_addStyle(settingPanelStyles), g[du(0x371)](GM_registerMenuCommand, o['c2'](du(0x3ff)), o['cd']), document[du(0x3b4)](g['jVRph'], o['handleKeydown']), window[du(0x284)]['href'][du(0x2b6)](g['sZwVa']) && (null === p['data']['cm'] && (p[du(0x2d7)]['cm'] = g[du(0x387)](parseFloat, GM_getValue(o[du(0x2e7)][du(0x448)]['c4'], o['defaultSpeed'])), console[du(0x2db)](g['lihbl'](g[du(0x3c1)], p[du(0x2d7)]['cm']))), console[du(0x2db)](du(0x29e)), window[du(0x3b4)](p['c5']['ca'][du(0x3bd)], p['ca']), console[du(0x2db)](g[du(0x392)]), m = g[du(0x371)](setInterval, () => {
            const dv = du, s = document[dv(0x2e9)](p['c5']['ca']['cu']), t = s && s[dv(0x36f)][dv(0x2f0)](p['c5']['ca'][dv(0x431)]), u = void 0x0;
            window[dv(0x284)]['href'][dv(0x2b6)](r['VjKhF']) && (t && !p['data']['c9'] ? (o['c8'](0x1), console['log'](dv(0x2c8)), p[dv(0x2d7)]['c9'] = !0x0) : !t && p[dv(0x2d7)]['c9'] && (o['c8'](p[dv(0x2d7)]['cm']), console[dv(0x2db)](r[dv(0x216)](r[dv(0x32f)], p[dv(0x2d7)]['cm'])), p[dv(0x2d7)]['c9'] = !0x1));
        }, 0x3e8), console[du(0x2db)]('[启动]\x20youtubeAdCheckInterval\x20定时器\x20(间隔500ms)'), p[du(0x2d7)]['cr'] = g['nDkkV'](setInterval, () => {
            const dw = du, s = document['querySelector'](p['c5']['ca']['cv']), t = document[dw(0x291)](r[dw(0x426)])[0x0];
            s && !p[dw(0x2d7)]['cq'] && t ? (console[dw(0x2db)](r[dw(0x3fb)]), o['c8'](0x1), p[dw(0x2d7)]['cq'] = !0x0) : !s && p[dw(0x2d7)]['cq'] && t && (console[dw(0x2db)](r[dw(0x498)](r[dw(0x414)], p[dw(0x2d7)]['cm'])), o['c8'](p[dw(0x2d7)]['cm']), p['data']['cq'] = !0x1);
        }, 0xc8)), p[du(0x2d7)]['initialized'] = !0x0, console['log'](g[du(0x25e)])), window[du(0x284)][du(0x381)][du(0x2b6)](g[du(0x37a)]) ? (console[du(0x2db)](g['ePgoP']), p['ca']()) : window[du(0x284)][du(0x381)][du(0x2b6)](du(0x337)) && (console['log'](g[du(0x42a)]), p['c6']()), console[du(0x2db)](g[du(0x41c)]), p[du(0x2d7)][du(0x417)] = !0x1);
    }
    g[cA(0x46a)](main);
    let lastUrl = location[cA(0x381)];
    console[cA(0x2db)](g[cA(0x433)]), new MutationObserver(() => {
        const dx = cA, q = {};
        q['nJVQT'] = dx(0x295), q[dx(0x466)] = g[dx(0x2cb)], q[dx(0x1fb)] = g['ucNYd'], q[dx(0x294)] = g['hSRxS'], q[dx(0x340)] = g['EmqKX'], q[dx(0x254)] = g[dx(0x308)], q['LmCXC'] = g[dx(0x442)], q[dx(0x312)] = g[dx(0x29c)], q['SIGcD'] = g[dx(0x410)], q[dx(0x45f)] = dx(0x330), q[dx(0x3c9)] = g[dx(0x362)], q[dx(0x3a1)] = g['BtxmL'], q[dx(0x48b)] = g[dx(0x35f)], q[dx(0x278)] = 'Bilibili_Rate_Value', q[dx(0x366)] = g[dx(0x276)], q[dx(0x34e)] = dx(0x2eb), q[dx(0x348)] = dx(0x27b), q[dx(0x257)] = g[dx(0x321)], q[dx(0x325)] = g[dx(0x471)], q['jOPBT'] = g['uPEJE'], q[dx(0x383)] = g[dx(0x30b)], q[dx(0x36d)] = g[dx(0x493)];
        const r = q;
        if (g[dx(0x2b3)](g[dx(0x2b7)], g['ZUXVD'])) {
            for (const [t, u] of Object['entries'](S[dx(0x2e7)])) {
                const v = GM_getValue(u['c3'], !0x1);
                localStorage[dx(0x37f)](u['c3'], v[dx(0x268)]());
            }
            y[dx(0x2b6)](pVmiJn['nJVQT']) ? z['settingPanelItems'] = {
                'Youtube_Action_TheaterMode': {
                    'classId': pVmiJn[dx(0x466)],
                    'text': A['c2'](pVmiJn[dx(0x466)]),
                    'c3': pVmiJn['fVSLJ']
                },
                'Youtube_Action_Rate': {
                    'classId': pVmiJn[dx(0x1fb)],
                    'text': B['c2'](pVmiJn[dx(0x1fb)]),
                    'c3': pVmiJn['CoHEa'],
                    'c4': pVmiJn['RiFII']
                },
                'Youtube_Remove_Autoplay': {
                    'classId': pVmiJn[dx(0x254)],
                    'text': C['c2'](pVmiJn[dx(0x254)]),
                    'c3': pVmiJn[dx(0x254)]
                },
                'Youtube_Remove_Subtitles': {
                    'classId': 'Youtube_Remove_Subtitles',
                    'text': D['c2'](pVmiJn['LmCXC']),
                    'c3': dx(0x470)
                },
                'Youtube_Remove_Settings': {
                    'classId': pVmiJn['XuKNQ'],
                    'text': E['c2'](pVmiJn[dx(0x312)]),
                    'c3': dx(0x2d3)
                },
                'Youtube_Remove_TheaterMode': {
                    'classId': pVmiJn[dx(0x3e0)],
                    'text': F['c2'](pVmiJn[dx(0x3e0)]),
                    'c3': pVmiJn[dx(0x3e0)]
                }
            } : G['includes'](pVmiJn[dx(0x45f)]) && (H[dx(0x2e7)] = {
                'Bilibili_Action_WebFullscreen': {
                    'classId': pVmiJn[dx(0x3c9)],
                    'text': I['c2'](pVmiJn['rMOgF']),
                    'c3': pVmiJn[dx(0x3c9)]
                },
                'Bilibili_Action_Rate': {
                    'classId': pVmiJn[dx(0x3a1)],
                    'text': J['c2'](pVmiJn[dx(0x3a1)]),
                    'c3': pVmiJn['zzTAj'],
                    'c4': pVmiJn[dx(0x278)]
                },
                'Bilibili_Remove_Quality': {
                    'classId': pVmiJn[dx(0x366)],
                    'text': K['c2']('Bilibili_Remove_Quality'),
                    'c3': pVmiJn[dx(0x366)]
                },
                'Bilibili_Remove_Eplist': {
                    'classId': pVmiJn[dx(0x34e)],
                    'text': L['c2'](pVmiJn['bbYTO']),
                    'c3': dx(0x2eb)
                },
                'Bilibili_Remove_Pip': {
                    'classId': pVmiJn[dx(0x348)],
                    'text': M['c2'](pVmiJn[dx(0x348)]),
                    'c3': dx(0x27b)
                },
                'Bilibili_Remove_Wide': {
                    'classId': pVmiJn[dx(0x257)],
                    'text': N['c2'](pVmiJn['QEHUI']),
                    'c3': pVmiJn[dx(0x257)]
                },
                'Bilibili_Remove_Speed': {
                    'classId': pVmiJn[dx(0x325)],
                    'text': O['c2'](pVmiJn[dx(0x325)]),
                    'c3': pVmiJn[dx(0x325)]
                },
                'Bilibili_Remove_Comments': {
                    'classId': pVmiJn[dx(0x217)],
                    'text': P['c2'](dx(0x3cf)),
                    'c3': pVmiJn[dx(0x217)]
                },
                'Bilibili_Remove_Settings': {
                    'classId': pVmiJn[dx(0x383)],
                    'text': Q['c2'](pVmiJn[dx(0x383)]),
                    'c3': pVmiJn[dx(0x383)]
                },
                'Bilibili_Remove_WebFullscreen': {
                    'classId': dx(0x263),
                    'text': R['c2'](dx(0x263)),
                    'c3': pVmiJn[dx(0x36d)]
                }
            });
        } else {
            const t = location[dx(0x381)];
            g[dx(0x494)](t, lastUrl) && (console[dx(0x2db)](g[dx(0x2dd)]), console[dx(0x2db)](g[dx(0x27e)], lastUrl), console[dx(0x2db)](g[dx(0x42b)], t), lastUrl = t, t[dx(0x2b6)](g[dx(0x1ef)]) && (console['log'](g[dx(0x35d)]), g[dx(0x46a)](main)), console[dx(0x2db)](g['qWgAX']));
        }
    })[cA(0x492)](document, {
        'subtree': !0x0,
        'childList': !0x0
    });
}()));
function b(c, d) {
    c = c - 0x1eb;
    const e = a();
    let f = e[c];
    if (b['BqBWBH'] === undefined) {
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
        b['gENAHI'] = g, b['KWzFyE'] = {}, b['BqBWBH'] = !![];
    }
    const h = e[0x0], i = c + h, j = b['KWzFyE'][i];
    return !j ? (f = b['gENAHI'](f), b['KWzFyE'][i] = f) : f = j, f;
}
function a() {
    const dy = [
        'EgTgAui',
        'B2HZruC',
        'ug9TChC',
        'zLDvqKO',
        '6k6+572U6z2I5P2/',
        'BhvPtvy',
        'Cg9PBNrLCKv2zw50CW',
        'BeTMBvy',
        'q3zYshe',
        'ww91DhvIzsaTioIhQUwkQoINHUMIKEE9KEMHTEwfQowXJW',
        'u0rQu2y',
        '5BEY5Qoa5Rwl5yIW5BM/5zgk77Ym6yEn572U5PkT5Ps+6ycF5BQM5lI6ms4W',
        '5PAWvvjmoG',
        'rxDnAwy',
        '5PYQ55M75B2v',
        'Dgv4DenVBNrLBNq',
        '5BEY5Qoa5Rwl5yIW55U05PkT77Ym6yEn572U5PkT5Ps+6ycF5BQM5lI6ms4W',
        'Aw5PDgLHBgL6zwq',
        'tfriyve',
        's3bmBu4',
        'qunyz2i',
        'Aw5KzxHpzG',
        'zM9Y',
        'D2f0tha',
        'w+IUVUE9RL0G6iEQ5yQO5ycn6ycF5PkT5Ps+oG',
        'DMLKzw8',
        'zxzWDfq',
        'ww91DhvIzv9szw1VDMvFu2v0DgLUz3m',
        'D2LKDgG',
        'tu1Ry2e',
        'ms4Wzw0',
        'zgf0yq',
        'vxrcz1O',
        'rMPWDKW',
        'zMXLEerPCMvJDgLVBG',
        'Bg9N',
        'w+IUVUE9RL0G5PYQ55M75B2v5PEG6zMq6k+v55sOmta4mfa6',
        'su90vgy',
        'C2v0vgLTzw91Da',
        'iZa3mJuYnq',
        'uLnNDgG',
        'zw50CMLLCW',
        '55U05PkT5BEY57Ut5P2F77Ym5OgI5Asn5PkT5Ps+6ycF5BQM5lI6',
        'EKLUzgv4',
        'CwjOwg0',
        'w+AtJEs9Nf0G54k55yE75B2X6zMI5QIH5BYp5OYj6zkU',
        'yLbpu3O',
        'C2v0DgLUz1bHBMvSsxrLBxm',
        'ELPbzgW',
        'CxvLCNLtzwXLy3rVCG',
        'yM9YzgvYuMfKAxvZ',
        'qMLSAwjPBgLFuMvTB3zLx0vWBgLZDa',
        'wKLZChq',
        'uNjXvgi',
        'yMvMB3jL',
        'CKfyBLC',
        'y29UDgfPBNm',
        'CxvLCNLtzwXLy3rVCKfSBa',
        'lNnWzwvKlwnVBNrYB2WTyNv0Dg9Uw2rHDgeTC3bLzwq9iG',
        'y2XVC2vcDg4',
        't25HBgK',
        'C3bLzwrcDxr0B25Z',
        'EeXYtxO',
        'cIaGicaGicaGi21PBMLTywXtzxr0Aw5NC1bHBMvSihSkicaGicaGicaGicaGCg9ZAxrPB246igzPEgvKoWOGicaGicaGicaGicb0B3a6iduWjtSkicaGicaGicaGicaGBgvMDdOGntaLoWOGicaGicaGicaGicb0CMfUC2zVCM06ihrYyw5ZBgf0zsGTntaLlcaTntaLktSkicaGicaGicaGicaGD2LKDgG6idm1mhb4oWOGicaGicaGicaGicbWywrKAw5NoIaXnxb4oWOGicaGicaGicaGicbIywnRz3jVDw5KlwnVBg9YoIaJzJLMowy5oWOGicaGicaGicaGicbIB3jKzxi6idfWEcbZB2XPzcaJy2nJoWOGicaGicaGicaGicbIB3jKzxiTCMfKAxvZoIa1ChG7cIaGicaGicaGicaGigjVEc1ZAgfKB3C6idaGmNb4ideWChGGCMDIysGWlcaWlcaWlcaWlJiPoWOGicaGicaGicaGicb6lwLUzgv4oIa5otK5otSkicaGicaGicaGicaGzM9UDc1Myw1PBhK6ihnHBNmTC2vYAwy7cIaGicaGicaGicaGigrPC3bSyxK6ig5VBMu7cIaGicaGicaGFqOGicaGicaGicnTAw5PBwfSu2v0DgLUz3nqyw5LBc5ZAg93ihSkicaGicaGicaGicaGzgLZCgXHEtOGyMXVy2S7cIaGicaGicaGFqOGicaGicaGicnTAw5PBwfSu2v0DgLUz3nqyw5LBcbOmIb7cIaGicaGicaGicaGig1HCMDPBJOGmcaWideWChG7cIaGicaGicaGicaGigzVBNqTC2L6ztOGms4Xzw07cIaGicaGicaGicaGihrLEhqTywXPz246ignLBNrLCJSkicaGicaGicb9cIaGicaGicaGi21PBMLTywXtzxr0Aw5NC1bHBMvSic5Zzxr0Aw5NlwL0zw0GEWOGicaGicaGicaGicbTyxjNAw4TyM90Dg9ToIaXmhb4oWOGicaGicaGih0kicaGicaGicaJBwLUAw1HBfnLDhrPBMDZugfUzwWGlNnLDhrPBMCTAxrLBsbPBNb1DfT0ExbLpsj0zxH0iL0GEWOGicaGicaGicaGicb3Awr0AdOGndbWEdSkicaGicaGicaGicaGBwfYz2LUlwXLzNq6idHWEdSkicaGicaGicaGicaGCgfKzgLUzZOGmNb4idrWEdSkicaGicaGicaGicaGyM9YzgvYoIaXChGGC29SAwqGi2nJyZSkicaGicaGicb9cIaGicaGicaGi21PBMLTywXtzxr0Aw5NC1bHBMvSic5IDxr0B25ZihSkicaGicaGicaGicaGBwfYz2LUlxrVCdOGmtvWEdSkicaGicaGicaGicaGDgv4Dc1HBgLNBJOGCMLNAhq7cIaGicaGicaGFqOGicaGicaGicnTAw5PBwfSu2v0DgLUz3nqyw5LBcbIDxr0B24GEWOGicaGicaGicaGicbWywrKAw5NoIa1ChGGmtbWEdSkicaGicaGicaGicaGy3vYC29YoIbWB2LUDgvYoWOGicaGicaGicaGicbIB3jKzxi6idfWEcbZB2XPzcaJy2nJoWOGicaGicaGicaGicbIywnRz3jVDw5KlwnVBg9YoIaJzwvLoWOGicaGicaGicaGicbIB3jKzxiTCMfKAxvZoIaZChG7cIaGicaGicaGFqOGicaGicaGic5ZCgvLzc1JB250CM9Slwj1DhrVBI5Hy3rPDMuGEWOGicaGicaGicaGicbIB3jKzxi6idjWEcbZB2XPzcaJmda3yMzMicfPBxbVCNrHBNq7cIaGicaGicaGFq',
        'BhLSyKq',
        'DLDkA0m',
        'tgDkyNO',
        'shfyrw0',
        'y3jLyxrLrwXLBwvUDa',
        'AKT4vfG',
        'D2vIA2L0rNvSBhnJCMvLBKvSzw1LBNq',
        'wwnsr3C',
        'sKjIANm',
        'CfPQt2K',
        'qNnbwgG',
        'qMLSAwjPBgLFuMvTB3zLx1f1ywXPDhK',
        'EwvLC3a',
        'zgL2',
        'DvbTs0O',
        'CMTHAwq',
        's0jnAha',
        'seTqAvK',
        'ru9gEKG',
        'zKnIqvO',
        'y3z1Cwy',
        'C2vSzwn0',
        'CgfYzw50tM9Kzq',
        'u2v0DgLUz3mGugfUzwW',
        'ww91DhvIzsaTioENU+MzPoIhQUwkQoAsREAuVUw8GowfSW',
        'rxzxB3O',
        'whvltLe',
        'C2v0DgLUz1bHBMvSrwXLBwvUDa',
        'wM9ote4',
        'C3rHCNrZv2L0Aa',
        'D3PeAK0',
        'zMXLEa',
        'B0nABKK',
        'BNPZENa',
        'pt09pt09pt09psdMIAFOOyZKUidMRkhMGkFLIj3LP4VLJjyGpt09pt09pt09pq',
        'v3vwyNa',
        'A1LJCfe',
        'AxnwAwrLB0fIBgu',
        'Cu5sAuu',
        'rxDKs0K',
        'CK5PDey',
        'vKfWALi',
        'C3bLzwqTy29UDhjVBc1IDxr0B24',
        'Be5Ny2O',
        'rwjMugO',
        'DMPMue0',
        'Cxf1AgW',
        'rMvXwwG',
        'w+MhJEE9RL0GEw91DhvIzufKrgv0zwn0zwq6',
        'r1ncA08',
        'DKDTCLK',
        'rxzyCNO',
        '5PYQ5zcV55sO',
        'i0mYmJu0na',
        'ENLjz0y',
        'AhbKCKq',
        'yMLSAwjPBgKUy29T',
        'EeniBuG',
        'qMLSAwjPBgLFuMf0zv9fBMfIBgvK',
        'tgzqthm',
        'pt09pt09pt09psbnDxrHDgLVBK9IC2vYDMvYiowKHoEqHUwUJoAVLsa9pt09pt09pt09',
        'twvUDv9tyxzL',
        'w1vjxsb2AwrLB1bHBMvSiowfG+E0Oow3SUIoT+wpLG',
        'yMLSAwjPBgKUy29Tl3zPzgvV',
        'AevYB3C',
        'veLhrK0',
        'B0zoDfi',
        'qMLSAwjPBgLFuMf0zv9wywX1zq',
        'zhreyMq',
        'ww91DhvIzsaTief1Dg8GugXHEwjHy2S',
        'lMjWEc1WBgf5zxiTy29UDhjVBc1IB3r0B20Ty2vUDgvY',
        'i3nWzwvKqNv0Dg9UCW',
        'uMLgsuK',
        'ywXPz25jDgvTCW',
        'ohb4',
        'y1fMwuW',
        'wLL1q0u',
        'wMLLAu8',
        'rw1Xs1G',
        'q0rewLC',
        'AurQyMG',
        'EgfxzvC',
        'v2fNyvK',
        'qxjPywWSicjizwX2zxrPy2eGtMv1zsiSieHLBhzLDgLJysWGC2fUCY1ZzxjPzG',
        'Cg9PBNrLCG',
        's1DMAMS',
        'yMjzve8',
        'lNL0Cc1Hzc1WBgf5zxiTB3zLCMXHEsWGlNL0Cc1Hzc1WBgf5zxiTB3zLCMXHEs1SyxLVDxq',
        'B3b0Aw9U',
        'zgnuALO',
        'BwfYz2LUuMLNAhq',
        'iZy2nG',
        'wufxA2C',
        'wK9QvM4',
        'swj6vMu',
        'ywjZ',
        'yKjlEvi',
        'rMD5wuK',
        'nJzRrLr5CMC',
        'mtaWjq',
        'ywrK',
        'EfDMzNG',
        'uKjlEfu',
        'uLHtsM8',
        'u1bSAK0',
        'uxvKzey',
        'yKnyzuW',
        'EuvzBxq',
        'qMLSAwjPBgKGlsbbDxrVifbSyxLIywnR',
        'w+IUVUE9RL0G5yEg5Ash6k6+572U5ycn6ycFoG',
        'uhvjtgu',
        'C3bLzwq',
        'ugf6rNG',
        'mZaWmtjHCuDdAMC',
        'wuT2qwW',
        'ww91DhvIzv9by3rPB25FuMf0zv9fBMfIBgvK',
        'Ew5mtvG',
        'C1b3BwS',
        'ugjvC0C',
        'y2XHC3nmAxn0',
        'qxPzreK',
        'v1vAz2K',
        'mxb4',
        'mNb4',
        'BgPkD1G',
        'tvHzu0m',
        'v2DxBwi',
        'y2XHC3noyw1L',
        'zM9UDfnPEMu',
        'rxfzzhy',
        'uwnlse8',
        'ALvhExq',
        'BhHWsxu',
        'mJq1ndmZnKDNq3nbBW',
        'Cg9ZAxrPB24',
        'C2v0sxrLBq',
        'ywn0AxzL',
        'AhjLzG',
        'r1vzv1K',
        's0Xnrw4',
        'EKPjD2y',
        'qMLSAwjPBgKGlsdNP7VPMAtLRR3LSy/MJiNPKQ4',
        'z2v0rwXLBwvUDej5swq',
        'zhDAsgq',
        'lMjWEc1WBgf5zxiTC2vUzgLUzY1Iyxi',
        'yxbWzw5Kq2HPBgq',
        'tfrmtgW',
        'qMLSAwjPBgKGlsbszw1VDMuGv2LKzsbcDxr0B24',
        'vMPlAey',
        'uLH5wfi',
        'txjUCey',
        'qvP3zu0',
        'DK9Ys20',
        'ChLQu3u',
        'zevvsMC',
        '5B+R5O236zsUoG',
        'yNDrr2K',
        'BwfYz2LUvg9W',
        'D3n1yu4',
        'Aw5PDgLHBgL6zwtNIRBMGie6',
        'DxfJDK4',
        'w+AxOoMzKoIVLEEuQdeWodbqxsdLVidLP4SUlI4',
        'mte1t3z4wgzs',
        'A3v6Ce4',
        'rez3v2C',
        'uvn4rwy',
        'rhzMsxe',
        'ywryzfa',
        'vNvsrLq',
        'A0zHDhO',
        'zxjYB3i',
        'BwvUDv9Zzxr0Aw5NCW',
        'CvLcCxq',
        'z1jWr2O',
        'qMLSAwjPBgKGlsdNP7VPMAtPGiNPM4BMJiNPKQ4',
        't0j0uu0',
        'AvP0vNm',
        'CNL5AgO',
        'qMLSAwjPBgKGlsbbDxrVifDLyIbgDwXSC2nYzwvU',
        'tKPurwW',
        'r2H0sei',
        'EKfuCui',
        'lMjWEc1WBgf5zxiTy3rYBc1XDwfSAxr5',
        'sfb4AMq',
        'DgfNtMfTzq',
        'D0zKCxO',
        'DvbfsKu',
        'pt09pt09pt09psbnDxrHDgLVBK9IC2vYDMvYioAJGoA1I+wiSfvstowpMowmLIa9pt09pt09pt09',
        'ywrKrxzLBNrmAxn0zw5LCG',
        'yu1nCuG',
        'w+AxOoMzKoIVLEEuQdeWodbqxsdLSz7MGkFLRPRKUyK6',
        'EvnMzve',
        'tgHMBKe',
        'su5qvvq',
        'uhvfEeG',
        'wgPHC2O',
        'ww91DhvIzv9szw1VDMvFqxv0B3bSyxK',
        'zMLUAxnOtgLZDgvUzxi',
        'suzRqw4',
        'qMLSAwjPBgLFqwn0Aw9Ux1vUBgLTAxrLzf9uCMLHBa',
        'zfbczwC',
        'zhn0uui',
        'DerNDuK',
        'vLnoBgS',
        'Dg9W',
        'tvDhwvO',
        'qMLSAwjPBgLFuMvTB3zLx1nWzwvK',
        'zvvjzNu',
        'z292Cw8',
        'CK1pz0y',
        'lIbRzxKGDg8GAw5JCMvHC2uGC3bLzwq',
        'zu1TDMe',
        'y2z5C0q',
        'Dg9Nz2XL',
        'Dg9HC3q',
        'qMLSAwjPBgLFuMvTB3zLx0nVBw1LBNrZ',
        't1bRy3i',
        'vgXsteW',
        'q3DVC2S',
        'vhvQu2q',
        'mc41',
        'yM9KEq',
        'Bg1sz24',
        'lMjWEc1WBgf5zxiTy3rYBc1LCgXPC3q',
        'DhjHBNnSyxrLkc01mcuSic01mcuP',
        'yxPRz3K',
        'Cundzeq',
        'C1jrs3e',
        'sLfQt3a',
        'ntaL',
        'nZqZmdG4vMPgBNLz',
        'ww91DhvIzsaTief1Dg8Gv2vIiez1BgXZy3jLzw4GlsbuAgvHDgvYie1Vzgu',
        'u0Lhy0q',
        'ru9mqwK',
        'swL0vNm',
        'q1Pez2O',
        'C3P4sKG',
        'vxfkC1O',
        'w+I3S+I/H10G5BEY5PIV572r6Ag15ywO5Bgp5QIH5BYp',
        'lMjWEc1WBgf5zxiTy3rYBc13AwrL',
        'ChjLBMW',
        'Dhvxrvq',
        'C2v0qxr0CMLIDxrL',
        'w+wiNEwNI+wmLL0Gv2vIu2L0zs5KyxrHlNLVDxr1yMvbzgzHBgXIywnRuMf0zsa9ia',
        'y29VA2LL',
        'mti3tNjzDuDM',
        'CgfKzgLUzW',
        'CxnvAuq',
        'w+AxOoMzKoIVLEEuQdeWodbqxsdMI6BMIkROR5xNLkJLGjlORQhML7y',
        '5BEY5zcV55sO',
        's0nHqLC',
        'v3fny3y',
        'sffAAvC',
        'zM9YrwfJAa',
        'DMvsrM4',
        'pdW8pcbOyw5KBgvcAwXPyMLSAsdMIAFOOyZLROZMR5u',
        's1DNDM4',
        'rNf5BgK',
        'nJjIrujKr3i',
        'vKLuAwO',
        'B3rxz2G',
        'BgvUz3rO',
        'w+I3S+I/H10GAgfUzgXLww91DhvIzsdMRApLNkJMIAFOOyZKUk3VViZOT7pOV4FMRAtMRkhOSipNLkG',
        'twvUDv9tzxr0Aw5NCW',
        'AfznyNi',
        'tNLZtMm',
        'mJrIz1viyxq',
        'CwTbCeq',
        'vhLZq3u',
        'AMDWy2G',
        'y2vUDgvY',
        'u2HVCNrJDxq6',
        'ww91DhvIzv9by3rPB25FvgHLyxrLCK1Vzgu',
        'qMLSAwjPBgLFqwn0Aw9Ux1jHDgu',
        'vMvjvKe',
        'qMLSAwjPBgLFqwn0Aw9Ux1DLyKz1BgXZy3jLzw4',
        'v3vbDw0',
        'w+A4HEEqHL0GEw91DhvIzsbmAxzLu3rYzwfTioEBToAsREAJGoA1IYdLRPRML7BLMAG',
        'A290y2W',
        'yMLhBu8',
        'CNb1Dxe',
        'qxvLBgK',
        'y29Kzq',
        'mI4W',
        'ufPRuKu',
        'y2HLy2TLza',
        'i2jPBgLIAwXPlxbSyxLLCG',
        'AxnnywLUuNvUBMLUzW',
        'BhvVtgy',
        'mtbWEcaYmhb4',
        'CxHLBxu',
        '5BEY55M75B2v',
        'ywfAvva',
        'DwDNtuC',
        'AfHpEhe',
        'lMjWEc1WBgf5zxiTy3rYBc1WAxa',
        'yM9YzgvY',
        'BgfUz3vHz2u',
        'DMfSDwu',
        'rLvKDxq',
        '5PENvvjmoG',
        't1jbDvu',
        'AK5ZEee',
        'AeXHyuC',
        'rMfPBgvKihDLyMz1BgWGB3iGyxv0BYbYyxrLoG',
        'ugzNrui',
        'BvLxAgG',
        'qMjQELy',
        'ww91DhvIzsaTifjLBw92zsbbDxrVCgXHEsbuB2DNBgu',
        'v3ndqMu',
        'mJe0nZq4mZy0nW',
        'wKPWCee',
        'pt09pt09pt09psbIAwXPyMLSAsdMIAFOOyZLROZMR5uGpt09pt09pt09pq',
        'BgL2zvn0CMvHBunSyxnZ',
        'vhDIwMK',
        'C2LPweO',
        'EwDntKK',
        'ww9SDuS',
        'nJnIrwD2B1i',
        'qMDeAMC',
        'rw9Tshy',
        'i21VDMLLx3bSyxLLCIaUExrWlxnPEMuTyNv0Dg9U',
        'i21VDMLLx3bSyxLLCIaUExrWlxnLDhrPBMDZlwj1DhrVBG',
        'DwHZDg8',
        'ANvZDgLMEunVBNrLBNq',
        'ww91DhvIzsaTioIhQUwkQowaJEMaN+AsREAuVG',
        'D05lsgm',
        'wwL2DNe',
        'vwrRy0m',
        'C2f2zvnLDhrPBMDZ',
        'tNH3Dui',
        'sgH1yMS',
        'rwffsw4',
        'sKfsDxK',
        'w1vjxsdLGi3PGj/MJiNPKQ7LT7lMT7VLIQdLIlaGDMLKzw9qyw5LBcdKUyVLIy0',
        'z2v0',
        'ww91DhvIzv9by3rPB25FuMf0zq',
        'sgrms3e',
        'Bw9xENa',
        'BKrRA1y',
        'EMj5D3K',
        'sNPQDe4',
        'qNb5DMu',
        'yM5ODMu',
        'ww91DhvIzv9by3rPB25FuMf0zv9wywX1zq',
        'pt09pt09pt09psbTywLUiow8GowNI+AjP+IHJca9pt09pt09pt09',
        'BLfMuK4',
        'q29TBwe',
        'y3vYC29Y',
        'B25du2K',
        'uwDJz0G',
        'C3r5Bgu',
        'Ew91DhvIzs5JB20V',
        'Cw9jvue',
        'z2H1yNm',
        'CMDIysGWlcaWlcaWlcaWlJCP',
        'DMz3s2q',
        'zM9UDezHBwLSEq',
        'twvUDv9tAg9YDgn1Df9jDgvTCW',
        'wfbYB1C',
        'nJu2nZmWohbAD3jSyq',
        'ww91DhvIzv9szw1VDMvFvgHLyxrLCK1Vzgu',
        'Dgv4Da',
        'w+AxOoMzKoIVLEEuQdeWodbqxsdLROZMIja',
        'u3Hmq3m',
        'C1rLALe',
        'zLztteO',
        'ExDywLe',
        'w+wqR+wkQf0GEw91DhvIzuXPDMvtDhjLyw1dAgvJAYdLRPRML7BLMAGGkoMxToMALdeWmdbTCYK',
        'uK1Oyui',
        'zwn0tfq',
        'AxnzB3v0DwjLugfNzvbYB2nLC3nPBMC',
        'vhDvBM8',
        'B3bHy2L0EsaWlJnZigvHC2uTB3v0',
        'twvUDv9dBg9Zzq',
        'w+IUVUE9RL0G5B2t5yMn5BM/5zgk6kAg55Uw5Bgc5A2y5zYOoG',
        'ww91DhvIzv9szw1VDMvFu3vIDgL0BgvZ',
        'Cu5QAMO',
        'q251rfm',
        'BgfIzwW',
        'ugvYAw9K',
        'AxndB250zw50rwrPDgfIBgu',
        'mZGXmtKWqvv2zMzb',
        'DhLWzq',
        'w+AxOoMzKoIVLEEuQf0G5Qoa5Rwl5yIW6k+v55sO5OYj6zkU77Ym6iEQ5yQO5yIh5O2I5BEY5A6m5OIq',
        're9OywK',
        'C2v0DgLUz3ncDg4',
        'A1HTr3O',
        'BgvMDa',
        'lt4GzMfSC2u',
        'yMfJA2DYB3vUzenVBg9Y',
        'y2XHC3njza',
        'y2HLy2TIB3G',
        'ww91DhvIzsaTifjLBw92zsbuAgvHDgvYie1VzguGqNv0Dg9U',
        'zNvUy3rPB24',
        'y29SDw1U',
        'vwPAr3m',
        'Aw5PDfnLDhrPBMDjDgvTCW',
        'CvbwyKS',
        'DeX6EMm',
        'B3rcvge',
        'DLjOv2C',
        'tfLyANu',
        'ENPuqwO',
        'ywDoBxK',
        'B3bHy2L0Eq',
        'rMfPBgvKigf1Dg9Yzw1VDMuGyNv0Dg9UCZO',
        'BgHLueW',
        'ww91DhvIzsaTioENU+MzPoIUVUE9RUAmIEMsRG',
        'wKDXsfq',
        'B2jZzxj2zq',
        'EuHKEKu',
        'A3LLDfe',
        'DgHLBG',
        'svbXsNi',
        'zeHsz2K',
        'AxLSquO',
        'CuHmqNy',
        'uNfOuwq',
        'AgvPz2H0',
        'qMLSAwjPBgKGlsbszw1VDMuGv2vIiez1BgXZy3jLzw4GqNv0Dg9U',
        'ExzJrxq',
        'ww91DhvIzsaTioENU+MzPow9SEMzOUAOOEw8J+AmIEMsRG',
        'DfD0AwW',
        'pt09pt09pt09psbIAwXPyMLSAsdLVidLP4VLPitNKiyGpt09pt09pt09pq',
        'AMTXDwi',
        'wMH5rM4',
        'yMzqC1y',
        'sxbPD0C',
        'w+s6Pos6KL0G55sO5OI354k55yE76ycF5BQM5OYj6zkUoG',
        'BefIC0e',
        'Cu9hy3G',
        'Awr5B2C',
        'w+IUVUE9RL0G6iEQ5yQO6l+B5ywL5B2X6zMI5QIH5BYpiow3SUwqR+EuQa',
        'qMLSAwjPBgKGlsbszw1VDMuGuxvHBgL0EsbcDxr0B24',
        'ywX5t20',
        'y09uDwu',
        'mY4W',
        'EMPurLi',
        'vNbgChG',
        'v0PQvwu',
        'lMjWEc1WBgf5zxiTy3rYBc13zwi',
        'qMLSAwjPBgKGlsbszw1VDMuGugLJDhvYzs1PBI1qAwn0DxjLiej1DhrVBG',
        'EvfOCxi',
        't0PJz1G',
        'venKBLG',
        'BwLUAw1HBfnLDhrPBMDZugfUzwW',
        'AurhtMq',
        'qMLSAwjPBgKGlsbszw1VDMuGrxbPC29KzsbmAxn0iej1DhrVBG',
        'D0fVrNi',
        'zM9UDfDLAwDODa',
        'zgf0yxnLDa',
        'AKv3ELK',
        'sKv1Cfi',
        'w+INPUwpKv0G6AAw5QYH5OMN6kgmic0+ihLVDxr1yMu',
        'zKPxt1q',
        'qNbIsuy',
        'zgvMyxvSDfnWzwvK',
        'C2f2zuj0BG',
        'w+MhJEE9RL0GyMLSAwjPBgLvBMXPBwL0zwruCMLHBefWCgXPzwq6',
        'qMLSAwjPBgKGlsbszw1VDMuGu2v0DgLUz3mGqNv0Dg9U',
        'CwvwAhK',
        'CenRsu0',
        's3Duue0',
        'sMfrCKG',
        'v3DjtxG',
        'ywHjyKe',
        'zgvMAw5LuhjVCgvYDhK',
        'qNP6q28',
        'CgTXEeS',
        'ALHtyuK',
        'AK9qqLq',
        'qMLSAwjPBgKGlsdNP7VPMAtOR4tORRROVPpLHAxLJlO',
        'DNzts3y',
        'zuvoBNy',
        'ms4W',
        'C2v0DgLUzY1PDgvT',
        'ChPnAMe',
        'u2f2zq',
        'i2zMzMzMzG',
        'yM9Sza',
        'EvfYyKq',
        'D1bNqvm',
        'ww91DhvIzsaTifjLBw92zsbtzxr0Aw5NCYbcDxr0B24',
        'uhDAz3G',
        'tgjmtMq',
        'vevIsKK',
        'w1vjxsdNP7VPMAtMJiNPKQ46',
        'CgXHEwjHy2TsyxrL',
        'rffiz3m',
        'sgDuELe',
        'i21VDMLLx3bSyxLLCIa+igrPDI55DhaTy2HYB21LlwjVDhrVBsa+igrPDI55DhaTy2HYB21LlwnVBNrYB2XZid4GzgL2lNL0Cc1YAwDODc1JB250CM9SCW',
        'Dfzizfq',
        'vMnKt3O',
        'q1PYC2i',
        'qMLSAwjPBgKGlsdNP7VPMAtNLlVKUk3NLlVMJiNPKQ4',
        'v2vKy28',
        'D2flD0W',
        'pt09pt09pt09psbTywLUioATO+wCQoAjP+IHJos4RE+8JoI3S+I/H+ATPoASOEIWG+EuQca9pt09pt09pt09',
        'DhjHBNnPDgLVBG',
        'yvvqEMm',
        'CfbVvLq',
        'w+AJGoA1I10G55sO5OI355M75B2v54Q25OcboG',
        'yK5jtgu',
        'wgLZDu0',
        'BhPOs0G',
        'mI41',
        'yLjJwMi',
        'ChPut1K',
        'z2v0sxrLBq',
        'yLrUAuu',
        'ufnls0G',
        'r1Pqq00',
        'mJrWEa',
        'Dg9mB3DLCKnHC2u',
        'yxv0B3bSyxLuB2DNBgvcDg4',
        'CMvKDwnL',
        'sLzdt3G',
        'DhDtA1e',
        'EvjxDhO',
        'ug5uyuy',
        't3r6B3a',
        'A1jmy0G',
        'sMDmtuW',
        'whjdwwC',
        'v1zhueW',
        'ww91DhvIzsaTioENU+MzPowTL+w5LEAmIEMsRG',
        'rgLrCg8',
        'D2HPDgu',
        '5B2t5yMnvvjmoG',
        'rKXutuC',
        'yNb4lxn0yxrLlwvUDgvYzwq',
        'q2zLBKe',
        '5BM/5zgk5BEY57Ut5P2F77Ym5OgI5Asn5PkT5Ps+6ycF5BQM5lI6',
        'w1vjxsdLVzpLIy3OP4BPOPhMKQ3MLl7PGj/LUQy6',
        'uuvivuK',
        'mZeXntDtzxLZu2u',
        'y2fSBa',
        'AxnwAwv3vg9KyxK',
        'y29SB3i',
        'A01JAuu',
        'BhvyqMq',
        'AePIAMW',
        'EurcB2u',
        'lNnWzwvKlwnVBNrYB2WTyNv0Dg9U',
        'q2XVC2u',
        'v29WvgK',
        'qMLSAwjPBgLFuMvTB3zLx1DLyKz1BgXZy3jLzw4',
        'CgP6vLu',
        'vwDZuhC',
        'yNv0Dg9U',
        'C2v0DgLUz1bHBMvSsw5PDgLHBgL6zwq',
        'Dg9tDhjPBMC',
        'suvfwKC',
        'mtrWEa',
        'quzRzve',
        'v211Dhu',
        'rfP2zfa',
        'D0TgCuy',
        'zML4zwq',
        'qMLSAwjPBgKGlsdNP7VPMAtORR7NVA7MJiNPKQ4',
        'mZHWEa',
        'pt09pt09pt09psbTywLUioAjP+IHJowUJoAVLsa9pt09pt09pt09',
        'w+INPUwpKv0GqMLSAwjPBgKGvvjm5y+y5yYwic0+ig1HAw4Okq',
        'zhDwy1u',
        'w1vjxsb2AwrLB1bHBMvSiowfG+E0Oow3SUIoT+wpLU+8JowhHUwKH+A3U+wkOowaJEMaN+AmIEMsRG',
        'vvfUDuW',
        'w+AtJEs9Nf0G54k55yE7572r6Ag15ywO5Bgp5OYj6zkU',
        'tfDkqu8',
        'CMvTB3zL',
        'DhjPywW',
        'qMLSAwjPBgLFuMvTB3zLx1bPCa',
        'zefeu20',
        'y2XPy2S',
        'CgXkv0K',
        'w+INPUwpKv0G6AAw5QYH5OMN6kgmic0+igjPBgLIAwXP',
        'DhjHBNnMB3jT',
        'ugzVzNm',
        'i21VDMLLx3bSyxLLCIa+igrPDI55DhaTy2HYB21LlwjVDhrVBsa+igrPDI55DhaTy2HYB21LlwnVBNrYB2XZid4GzgL2lNL0Cc1Szwz0lwnVBNrYB2XZid4GzgL2lNL0Cc10Aw1LlwrPC3bSyxKUBM90CMfUC2XHDguUExrWlwXPDMuGpIbIDxr0B24',
        'CgXHEwvYq29UDgfPBMvY',
        'Bg9JyxrPB24',
        'y0H2rNy',
        'vK5hwfa',
        'rvDov2W',
        'Eu9UsKO',
        'pt09pt09pt09psb5B3v0DwjLioAjP+IHJowUJoAVLsa9pt09pt09pt09',
        'lcbRzxKGDg8GzgvJCMvHC2uGC3bLzwq',
        'u3riwLu',
        'tgDyB1G',
        'AMTQvMW',
        'Cw5TEg0',
        'lUMuRUwkOoMaNW',
        'qMLSAwjPBgLFuMvTB3zLx1nLDhrPBMDZ',
        'z2v0rwXLBwvUDhncEvrHz05HBwu',
        'ufbRr1C',
        'zNf0CNi',
        'q29irwe',
        'Ew91DhvIzs5JB20',
        'DgHlvva',
        'zwTXuu4',
        'qujWDvy',
        'q3LZAvO',
        'w+AtJEs9Nf0G5BQu55sO5PEG6zMq6k+v55sOmta4mfdLIP/OG70',
        'AgjrAvy',
        'wwHLyxG',
        'Evz4vuS',
        'w+AZQowgJf0GExqTBMf2AwDHDguTzMLUAxnOioEBKEwqRowzQcaTpIbxzwjtAxrLlNLVDxr1yMu',
        'rgz1vve',
        '5RE75yQG5ycn6ycF5OYj6zkU',
        'i21VDMLLx3bSyxLLCIaUExrWlxn1yNrPDgXLCY1IDxr0B24',
        'pt09pt09pt09psb5B3v0DwjLioIIQ+IWG+EuQca9pt09pt09pt09',
        'zMT2D1i',
        'Aw5PDgLHBgL6zvbHBMvS',
        'quXyB2u',
        'rgvKzvvZzxjjra',
        'qMLSAwjPBgLFuMvTB3zLx1DPzgu',
        't0nqq1u',
        'sM1WDLC',
        'A3zTzNq',
        'zgLZCgXHEq',
        'i21VDMLLx3bSyxLLCIaUExrWlwf1Dg9UyxyTDg9Nz2XL',
        'CvzmENG',
        'qMLSAwjPBgKGlsdNP7VPMAtLJP/LP4VLGi3PGj/MJiNPKQ4',
        't1jVuvy',
        'w+AxOoMzKoIVLEEuQf0G6iEQ5yQO54k55yE75BEY5zcV5yQO',
        'BgLOyMW',
        'qMLSAwjPBgKGlsdOH6RLIQJLGi3PGj/MKQ3MLl4',
        'A0jsC0q',
        'qMLSAwjPBgKGlsbszw1VDMuGt3jPz2LUywWGu3bLzwqGqNv0Dg9U',
        'wLL4Beq',
        'Aw5JBhvKzxm',
        'rwLfzw8'
    ];
    a = function () {
        return dy;
    };
    return a();
}