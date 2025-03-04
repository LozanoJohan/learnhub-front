// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  server: {
    port: 4321,
    host: true,
    proxy: {
      // Proxy para la API de scraping de cursos (SIA, Coursera, etc.)
      '/api/courses': {
        target: 'http://localhost:8001/courses',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/courses/, ''),
      },
      // Proxy específico para la búsqueda vectorial
      '/api/courses/vector-search': {
        target: 'http://localhost:8001/courses/vector-search',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/courses\/vector-search/, ''),
      },
      // Proxy para obtener cursos relacionados
      '/api/courses/related': {
        target: 'http://localhost:8001/courses/related',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/courses\/related/, ''),
      }
    }
  }
});