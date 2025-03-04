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
    host: true
  }
});