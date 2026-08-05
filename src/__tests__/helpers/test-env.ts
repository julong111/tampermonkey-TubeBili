// 测试默认环境：__TARGET__ 默认 undefined（走 userscripts 分支），各测试用 stubGlobal 覆盖
globalThis.__TARGET__ = undefined
