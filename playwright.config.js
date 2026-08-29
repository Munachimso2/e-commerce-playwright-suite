import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export default defineConfig({
  testDir: '.',
  testIgnore: ['sabbath-mission.spec.js', 'fixtures.spec.js'],
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    headless: true,
    navigationTimeout: 45000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
