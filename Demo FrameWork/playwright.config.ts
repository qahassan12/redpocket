import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";
import os from "node:os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config({ path: `./src/config/.env`});
const { BASE_URL, SKIP_GLOBAL_LOGIN } = process.env;

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Convert SKIP_GLOBAL_LOGIN to a boolean (default to false if not provided)
const skipGlobalLogin = SKIP_GLOBAL_LOGIN === 'true';

const config: PlaywrightTestConfig = {
  /* Directory where the tests are located. */
  testDir: "./src/specs/",
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [`list`, { printSteps: true }],
    [
      "allure-playwright",
      {
        detail: true,
        outputFolder: "allure-results",
        suiteTitle: true,
        environmentInfo: {
          OS: os.platform(),
          Architecture: os.arch(),
          NodeVersion: process.version,
          Url: BASE_URL,
        },
        categories: [
          {
            name: "Missing file errors",
            messageRegex: /^ENOENT: no such file or directory/,
          },
        ],
      },
    ],
    ["html", { open: "never" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    video: 'on',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 30 * 1000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    headless: process.env.CI ? false : false,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    /* Open the browser in full-screen mode */
    viewport: process.env.CI ? {width: 1920, height: 1200} : null,
    launchOptions: {
      args: process.env.CI ? [] : ['--start-maximized'],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    ...(skipGlobalLogin ? [] : [{
      name: 'setup',
      testMatch: ['**/login.setup.spec.ts'],
      use: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36 (KHTM, like Gecko) Chrome/109.0.5414.120 Safari/537.36'
      },
  }]),
  {
      name: "Chromium",
      testIgnore: ['**/login.setup.spec.ts'],
      dependencies: skipGlobalLogin ? [] : ['setup'],
      /* Specifying use in project overrides the global use, that's why have to redefine the viewport, launchOptions and userAgent */
      use: { 
        viewport: process.env.CI ? {width: 1920, height: 1200} : null,
        launchOptions: {
          args: process.env.CI ? [] : ['--start-maximized'],
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36 (KHTM, like Gecko) Chrome/109.0.5414.120 Safari/537.36'
      },
    },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    // },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
