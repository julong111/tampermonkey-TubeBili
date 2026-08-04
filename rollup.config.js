import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const tampermonkeyHeader = readFileSync('./src/build/header-tampermonkey.js', 'utf8');
const userscriptsHeader = readFileSync('./src/build/header-userscripts.js', 'utf8');

const versionDir = `v${pkg.version}`;

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

function makeConfig(file, header, target) {
  const base = {
    input: 'src/main.js',
    plugins: [
      replace({
        preventAssignment: true,
        __TARGET__: JSON.stringify(target),
      }),
    ],
  };
  return [
    {
      ...base,
      output: {
        file: `dist/${versionDir}/${file}`,
        format: 'iife',
        banner: replaceHeaderInfo(header),
      },
    },
    {
      ...base,
      output: {
        file: `dist/latest/${file}`,
        format: 'iife',
        banner: replaceHeaderInfo(header),
      },
    },
  ];
}

export default [
  ...makeConfig('TubeBili.user.js', tampermonkeyHeader, 'tampermonkey'),
  ...makeConfig('TubeBili.userscripts.js', userscriptsHeader, 'userscripts'),
];
