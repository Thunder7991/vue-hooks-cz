import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const root = fileURLToPath(new URL('.', import.meta.url));

const entry = (path: string) => resolve(root, path);

export default defineConfig({
  plugins: [
    dts({
      entryRoot: '.',
      outDir: 'dist',
      include: [
        'index.ts',
        'types/**/*.d.ts',
        'useGeolocation/**/*.ts',
        'useHighPrecisionTimer/**/*.ts',
        'useProviderInject/**/*.ts',
        'useUpdater/**/*.ts',
      ],
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: entry('index.ts'),
        'useGeolocation/index': entry('useGeolocation/index.ts'),
        'useGeolocation/dd': entry('useGeolocation/dd.ts'),
        'useHighPrecisionTimer/index': entry('useHighPrecisionTimer/index.ts'),
        'useProviderInject/index': entry('useProviderInject/index.ts'),
        'useUpdater/index': entry('useUpdater/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', 'dingtalk-jsapi'],
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
  },
});
