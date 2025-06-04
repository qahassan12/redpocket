import { Cookie, Page } from 'playwright/test';
import fs from 'fs';
import path from 'path';

// Base path for the cookies directory
const cookiesDirectory = path.resolve(__dirname, '../../cookies/');

/**
 * Store the browser's current storage state (cookies) into a file.
 * @param user - Identifier for the user (e.g., 'admin', 'leader').
 * @param page - The Playwright page instance.
 */
export async function storeCookies(user: string, page: Page): Promise<void> {
  const storageStatePath = path.resolve(cookiesDirectory, `${user}.json`);

  // Ensure the directory exists
  if (!fs.existsSync(cookiesDirectory)) {
    fs.mkdirSync(cookiesDirectory, { recursive: true });
  }

  // Save storage state to a file
  await page.context().storageState({ path: storageStatePath });
}

/**
 * Update the domain of specific cookies in the storage state file.
 * @param user - Identifier for the user (e.g., 'admin', 'leader').
 */
export async function updateCookieDomain(user: string): Promise<void> {
  const storageStatePath = path.resolve(cookiesDirectory, `${user}.json`);

  // Ensure the storage state file exists
  if (!fs.existsSync(storageStatePath)) {
    throw new Error(`Storage state file not found at ${storageStatePath}`);
  }

  // Read the storage state from the file
  const storageState: { cookies: Cookie[] } = JSON.parse(
    fs.readFileSync(storageStatePath, 'utf-8'),
  );

  // Ensure BASE_URL is valid
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined in the environment variables.');
  }

  const url = new URL(process.env.BASE_URL);
  const host = url.hostname;

  // Update the domain for specific cookies
  const updatedCookies = storageState.cookies.map((cookie: Cookie) => {
    if (['community_id_token', 'community_refresh_token'].includes(cookie.name)) {
      return {
        ...cookie,
        domain: host, // Update domain to match the host from BASE_URL
      };
    }
    return cookie; // Return other cookies unchanged
  });

  // Update the storage state with the modified cookies
  storageState.cookies = updatedCookies;

  // Save the updated storage state back to the file
  fs.writeFileSync(
    storageStatePath,
    JSON.stringify(storageState, null, 2),
    'utf-8',
  );
}
