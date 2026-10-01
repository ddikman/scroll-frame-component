import { defineConfig } from 'vite';

export default defineConfig(({ mode }) =>
  mode === 'library'
    ? {
        build: {
          lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
            cssFileName: 'style',
          },
          rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
          },
        },
      }
    : {
        root: 'example',
        build: {
          outDir: '../dist-example',
          emptyOutDir: true,
        },
      },
);
