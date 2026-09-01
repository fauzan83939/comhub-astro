import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid', // pages are static by default, /api routes run on server
  adapter: vercel()
});
