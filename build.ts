import { build } from 'bun'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const versionDir = `v${pkg.version}`

const targets = [
  {
    file: 'TubeBili.user.js',
    header: readFileSync('./src/build/header-tampermonkey.ts', 'utf8'),
    target: 'tampermonkey'
  },
  {
    file: 'TubeBili.userscripts.js',
    header: readFileSync('./src/build/header-userscripts.ts', 'utf8'),
    target: 'userscripts'
  }
]

function replaceHeaderInfo(str: string): string {
  return str
    .replace(/\$\{version\}/g, pkg.version)
    .replace(/\$\{namezh\}/g, pkg.namezh)
    .replace(/\$\{nameen\}/g, pkg.nameen)
    .replace(/\$\{namespace\}/g, pkg.namespace)
    .replace(/\$\{author\}/g, pkg.author)
    .replace(/\$\{descriptionzh\}/g, pkg.descriptionzh)
    .replace(/\$\{descriptionen\}/g, pkg.descriptionen)
    .replace(/\$\{license\}/g, pkg.license)
    .replace(/\$\{icon\}/g, pkg.icon)
    .replace(/\$\{homepage\}/g, pkg.homepage)
    .replace(/\$\{supportURL\}/g, pkg.supportURL)
}

async function buildTarget(target: (typeof targets)[number], dir: string) {
  await build({
    entrypoints: ['src/entry.ts'],
    outdir: `dist/${dir}`,
    naming: target.file,
    format: 'iife',
    minify: false,
    define: { __TARGET__: JSON.stringify(target.target) },
    banner: replaceHeaderInfo(target.header)
  })
}

for (const target of targets) {
  await buildTarget(target, versionDir)
  await buildTarget(target, 'latest')
}
