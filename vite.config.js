import { defineConfig } from 'vite';

export default defineConfig({
  base: '/tarot-ghibli/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        reading: 'reading.html',
        explore: 'explore.html'
      }
    }
  }
});
