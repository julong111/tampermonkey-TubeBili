import resolve from '@rollup/plugin-node-resolve';
import { HEADER } from './src/header.js';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/TubeBili.user.js',
    format: 'iife',
    name: 'TubeBili',
    sourcemap: true,
    banner: HEADER
  },
  plugins: [
    resolve()
  ]
};
