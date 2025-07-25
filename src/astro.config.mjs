import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  experimental: {
    hybridOutput: true  // ← Add this line
  }
});