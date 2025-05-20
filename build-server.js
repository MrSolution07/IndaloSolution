// build-server.js
import { build } from 'esbuild';

build({
  entryPoints: ['server/index.ts'],
  platform: 'node',
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
}).catch((err) => {
  console.error(err);
  process.exit(1);
});