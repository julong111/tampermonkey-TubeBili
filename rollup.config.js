import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const tampermonkeyHeader = readFileSync('./src/build/header-tampermonkey.js', 'utf8');
const userscriptsHeader = readFileSync('./src/build/header-userscripts.js', 'utf8');

function replaceHeaderInfo(str) {
  return str.replace(/\$\{version\}/g, pkg.version)
    .replace(/\$\{namezh\}/g, pkg.namezh)
    .replace(/\$\{nameen\}/g, pkg.nameen)
    .replace(/\$\{namespace\}/g, pkg.namespace)
    .replace(/\$\{author\}/g, pkg.author)
    .replace(/\$\{descriptionzh\}/g, pkg.descriptionzh)
    .replace(/\$\{descriptionen\}/g, pkg.descriptionen)
    .replace(/\$\{license\}/g, pkg.license)
    .replace(/\$\{icon\}/g, pkg.icon)
    .replace(/\$\{homepage\}/g, pkg.homepage)
    .replace(/\$\{supportURL\}/g, pkg.supportURL);
}

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.user.js',
      format: 'iife',
      banner: replaceHeaderInfo(tampermonkeyHeader),
    },
    plugins: [
      replace({
        preventAssignment: true,
        __TARGET__: JSON.stringify('tampermonkey'),
      }),
    ],
  },
  {
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.userscripts.js',
      format: 'iife',
      banner: replaceHeaderInfo(userscriptsHeader),
    },
    plugins: [
      replace({
        preventAssignment: true,
        __TARGET__: JSON.stringify('userscripts'),
      }),
    ],
  },
];