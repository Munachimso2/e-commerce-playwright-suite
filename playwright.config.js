import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  retries: 1,
  reporter: 'html',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
});
