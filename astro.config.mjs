import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

const { SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

export default defineConfig({
  site: SITE_URL,
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [mdx(), sitemap(), tailwind()]
});
