import { LocatorState } from '@interface/base/locator.interface';
import { Locator, Page, test, TestInfo } from '@playwright/test';
import path from 'path';
import fs from 'fs';

interface LocatorInfo {
  description: string;
  locator: Locator;
}

export class PlaywrightActionsFactory {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly shortTimeout: number = 10 * 1000;

  /**
   * @param page
   * @param testInfo
   */
  public constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  public maskValue(value: string): string {
    return '*'.repeat(value.length); // Masks the value with asterisks
  }

  public async click(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is clicked`, async (): Promise<void> => {
      await locatorInfo.locator.waitFor({ state: 'attached' });
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.click();
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is clicked`, {
        body: `🐾 "${locatorInfo.description}" is clicked`,
        contentType: 'text/plain',
      });
    });
  }

  public async forceClick(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is clicked`, async (): Promise<void> => {
      await locatorInfo.locator.waitFor({ state: 'attached' });
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.click({ force: true });
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is clicked`, {
        body: `🐾 "${locatorInfo.description}" is clicked`,
        contentType: 'text/plain',
      });
    });
  }

  /**
   * Scrolls the element into view.
   *
   * @param locatorInfo Information about the locator to scroll into view.
   */
  public async scrollIntoView(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`📜 Scrolling "${locatorInfo.description}" into view`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await this.testInfo.attach(
        `📜 "${locatorInfo.description}" scrolled into view`,
        {
          body: `📜 "${locatorInfo.description}" scrolled into view`,
          contentType: 'text/plain',
        },
      );
    });
  }

  public async navigateToURL(url: string): Promise<void> {
    await test.step(`⏩ Navigate to URL: ${url}`, async (): Promise<void> => {
      await this.page.goto(url);
      await this.testInfo.attach(`⏩ Navigated to URL: ${url}`, {
        body: `⏩ Navigated to URL: ${url}`,
        contentType: 'text/plain',
      });
    });
  }

  public async waitForURL(
    regex: RegExp,
    timeout: number = 30000,
  ): Promise<void> {
    await test.step(`⏳ Waiting for URL matching "${regex}"`, async (): Promise<void> => {
      await this.page.waitForURL(regex, {
        timeout,
        waitUntil: 'domcontentloaded',
      });
      await this.testInfo.attach(`⏳ URL matching "${regex}" is loaded`, {
        body: `⏳ URL matching "${regex}" is loaded`,
        contentType: 'text/plain',
      });
    });
  }

  public async sendKeys(
    locatorInfo: LocatorInfo,
    strValue: string,
    mask: boolean = false,
  ): Promise<void> {
    const displayedValue = mask ? this.maskValue(strValue) : strValue;
    await test.step(`🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.focus();
      await locatorInfo.locator.clear();
      await locatorInfo.locator.fill(strValue);
      await this.testInfo.attach(
        `🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`,
        {
          body: `🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`,
          contentType: 'text/plain',
        },
      );
    });
  }

  public async pressKey(
    locatorInfo: LocatorInfo,
    strValue: string,
  ): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is pressed with "${strValue}"`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.press(strValue);
      await this.testInfo.attach(
        `🐾 "${locatorInfo.description}" is pressed with "${strValue}"`,
        {
          body: `🐾 "${locatorInfo.description}" is pressed with "${strValue}"`,
          contentType: 'text/plain',
        },
      );
    });
  }

  /**
   * Set input files to a hidden file input for uploading documents
   *
   * @param locatorInfo Information about the file input locator
   * @param filePaths Array of file paths to be uploaded
   */
  public async getFilePath(fileName: string): Promise<string> {
    // Adjust the path to reflect the correct location of the assets directory
    const directoryPath = path.join(__dirname, '../../data/assets/');

    // Define an array of possible file extensions
    const possibleExtensions = ['png', 'jpg', 'jpeg', 'mp3', 'mp4', 'pdf'];

    // Check for the file with each extension
    for (const extension of possibleExtensions) {
      const fullFileName = `${fileName}.${extension}`;
      const filePath = path.join(directoryPath, fullFileName);

      // If the file exists, return its path
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }

    // If no file was found with any of the extensions, throw an error
    throw new Error(
      `File not found: ${fileName} with any of the extensions: ${possibleExtensions.join(', ')}`,
    );
  }

  public async setInputFiles(
    locatorInfo: LocatorInfo,
    filePaths: string | string[],
  ): Promise<void> {
    await test.step(`📂 Upload files to "${locatorInfo.description}"`, async (): Promise<void> => {
      // Ensure filePaths is an array for consistency
      const filesArray = Array.isArray(filePaths) ? filePaths : [filePaths];

      // Set the input files on the specified locator
      await locatorInfo.locator.setInputFiles(filesArray);

      await this.testInfo.attach(
        `📂 Files uploaded to "${locatorInfo.description}"`,
        {
          body: `Uploaded files: ${filesArray.join(', ')}`,
          contentType: 'text/plain',
        },
      );
    });
  }

  public async clearText(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is erased`, async (): Promise<void> => {
      await this.click(locatorInfo);
      await this.pressKey(locatorInfo, 'Control+A');
      await this.pressKey(locatorInfo, 'Backspace');
      await this.click(locatorInfo);
    });
  }

  public async scrollUntilVisible(
    locatorInfo: LocatorInfo,
    options?: {
      maxScrollAttempts?: number;
      scrollAmount?: number;
      scrollInterval?: number;
    },
  ): Promise<void> {
    const {
      maxScrollAttempts = 10,
      scrollAmount = 100,
      scrollInterval = 300,
    } = options || {};
    let attempts = 0;

    await test.step(`📜 Scrolling to make "${locatorInfo.description}" visible`, async (): Promise<void> => {
      try {
        while (attempts < maxScrollAttempts) {
          const isVisible = await locatorInfo.locator.isVisible();

          if (isVisible) {
            await this.testInfo.attach(
              `✅ "${locatorInfo.description}" is visible after scrolling.`,
              {
                body: `Scrolled ${attempts} times to make "${locatorInfo.description}" visible.`,
                contentType: 'text/plain',
              },
            );
            return;
          }

          await this.page.mouse.wheel(0, scrollAmount);
          await this.page.waitForTimeout(scrollInterval);
          attempts++;
        }

        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" is not visible after ${maxScrollAttempts} scrolling attempts.`,
          {
            body: `Failed to scroll ${maxScrollAttempts} times to make "${locatorInfo.description}" visible.`,
            contentType: 'text/plain',
          },
        );
        throw new Error(
          `"${locatorInfo.description}" is not visible after ${maxScrollAttempts} attempts.`,
        );
      } catch (error) {
        await this.testInfo.attach(
          `💥 Error while scrolling to "${locatorInfo.description}"`,
          {
            body: `Error: ${error.message}`,
            contentType: 'text/plain',
          },
        );
        throw error;
      }
    });
  }

  public async waitForUrlContains(
    substring: string,
    timeout?: number,
  ): Promise<void> {
    const effectiveTimeout = timeout ?? 30000; // Use the provided timeout or default to 30000

    await test.step(`⏳ Waiting for URL to contain substring: "${substring}"`, async (): Promise<void> => {
      const urlMatcher = async () => {
        const currentUrl = this.page.url();
        return currentUrl.includes(substring);
      };

      // Use a loop to wait until the substring is found or timeout is reached
      const startTime = Date.now();
      while (true) {
        // Check if the substring is found
        if (await urlMatcher()) {
          await this.testInfo.attach(
            `✅ URL contains substring: "${substring}"`,
            {
              body: `Found "${substring}" in URL: ${this.page.url()}`,
              contentType: 'text/plain',
            },
          );
          return;
        }

        // Check if timeout is reached
        if (Date.now() - startTime >= effectiveTimeout) {
          throw new Error(
            `💥 Timeout: "${substring}" not found in URL after ${effectiveTimeout / 1000} seconds.`,
          );
        }

        await this.page.waitForTimeout(500); // Polling interval
      }
    });
  }

  public async waitForDomLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  public async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  public async waitForElementState(
    locatorInfo: LocatorInfo,
    state: LocatorState,
    timeout = this.shortTimeout,
  ): Promise<void> {
    const message = `Waiting for locator '${locatorInfo.description}' to achieve '${state}' state`;

    await test.step(message, async () => {
      await locatorInfo.locator.waitFor({ state, timeout });
    });
  }

  public async embedFullPageScreenshot(description: string): Promise<void> {
    await test.step(
      `📸 "${description} - Full page screenshot`.trim(),
      async (): Promise<void> => {
        const screenshot: Buffer = await this.page.screenshot({
          fullPage: true,
        });
        await this.testInfo.attach(`📸 ${description}`, {
          body: screenshot,
          contentType: 'image/png',
        });
      },
    );
  }

  public async getText(locatorInfo: LocatorInfo): Promise<string> {
    return await test.step(`🐾 Retrieving text from "${locatorInfo.description}"`, async (): Promise<string> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      const textContent = await locatorInfo.locator.textContent();

      if (textContent === null) {
        throw new Error(
          `💥 No text content found in "${locatorInfo.description}"`,
        );
      }
      const trimmedText = textContent.trim();
      await this.testInfo.attach(
        `🐾 Text content of "${locatorInfo.description}"`,
        {
          body: `Retrieved text: "${trimmedText}"`,
          contentType: 'text/plain',
        },
      );

      return trimmedText;
    });
  }

  public async waitForVisibility(
    locatorInfo: LocatorInfo,
    timeout: number = 30000,
  ): Promise<void> {
    await test.step(`⏳ Waiting for "${locatorInfo.description}" to be visible`, async (): Promise<void> => {
      await locatorInfo.locator.waitFor({ state: 'visible', timeout });
      await this.testInfo.attach(`⏳ "${locatorInfo.description}" is visible`, {
        body: `⏳ "${locatorInfo.description}" is visible`,
        contentType: 'text/plain',
      });
    });
  }

  public async waitForSec(seconds: number): Promise<void> {
    await test.step(`⏳ Waiting for ${seconds} second(s)`, async (): Promise<void> => {
      await this.page.waitForTimeout(seconds * 1000); // Convert seconds to milliseconds
      await this.testInfo.attach(`⏳ Waited for ${seconds} second(s)`, {
        body: `Waited for ${seconds} second(s)`,
        contentType: 'text/plain',
      });
    });
  }

  /**
   * Get the count of elements for a given locator with error handling.
   *
   * @param locatorInfo Information about the locator whose count is needed.
   * @returns The count of elements matching the locator.
   */
  public async getElementCount(locatorInfo: LocatorInfo): Promise<number> {
    return await test.step(`🔢 Getting count of "${locatorInfo.description}" elements`, async (): Promise<number> => {
      try {
        // Wait for the locator to be attached before counting
        await locatorInfo.locator.waitFor({
          state: 'attached',
          timeout: this.shortTimeout,
        });

        // Get the count of elements
        const count = await locatorInfo.locator.count();

        // Attach the count to the test report
        await this.testInfo.attach(
          `🔢 Count for "${locatorInfo.description}": ${count}`,
          {
            body: `🔢 Count for "${locatorInfo.description}": ${count}`,
            contentType: 'text/plain',
          },
        );

        return count;
      } catch (error) {
        // Handle any errors that occur
        const errorMessage = `💥 Error while getting count for "${locatorInfo.description}": ${error.message}`;
        await this.testInfo.attach(errorMessage, {
          body: errorMessage,
          contentType: 'text/plain',
        });
        throw new Error(errorMessage);
      }
    });
  }

  public async selectDropdownOption(
    locatorInfo: LocatorInfo,
    optionValueOrLabel: string,
  ): Promise<void> {
    await test.step(`🔽 Selecting option "${optionValueOrLabel}" from "${locatorInfo.description}" dropdown`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();

      const options = await locatorInfo.locator.evaluate(
        (select: HTMLSelectElement) =>
          Array.from(select.options).map((option) => ({
            label: option.label,
            value: option.value,
          })),
      );

      const optionExists = options.some(
        (option) =>
          option.label === optionValueOrLabel ||
          option.value === optionValueOrLabel,
      );

      if (!optionExists) {
        throw new Error(
          `Option "${optionValueOrLabel}" not found in dropdown. Available options: ${options
            .map((o) => `label: ${o.label}, value: ${o.value}`)
            .join(', ')}`,
        );
      }

      await locatorInfo.locator.waitFor({ state: 'attached' });
      await locatorInfo.locator.waitFor({ state: 'visible' });

      if (options.some((option) => option.label === optionValueOrLabel)) {
        await locatorInfo.locator.selectOption({ label: optionValueOrLabel });
      } else {
        await locatorInfo.locator.selectOption({ value: optionValueOrLabel });
      }

      await this.testInfo.attach(
        `🔽 Selected option "${optionValueOrLabel}" from "${locatorInfo.description}"`,
        {
          body: `🔽 Selected option "${optionValueOrLabel}" from "${locatorInfo.description}"`,
          contentType: 'text/plain',
        },
      );
    });
  }

  public async toggleCheckbox(
    locatorInfo: LocatorInfo,
    enable: boolean,
  ): Promise<void> {
    await test.step(`🔲 Toggling checkbox for "${locatorInfo.description}"`, async () => {
      await locatorInfo.locator.waitFor({ state: 'attached' });
      const switchValue = await locatorInfo.locator.isChecked();

      if ((switchValue && !enable) || (!switchValue && enable)) {
        await this.click(locatorInfo);
        await this.testInfo.attach(
          `🔲 Checkbox for "${locatorInfo.description}" toggled to ${enable ? 'enabled' : 'disabled'}`,
          {
            body: `Checkbox was toggled to ${enable ? 'enabled' : 'disabled'}`,
            contentType: 'text/plain',
          },
        );
      } else {
        await this.testInfo.attach(
          `🔲 Checkbox for "${locatorInfo.description}" already in desired state: ${enable ? 'enabled' : 'disabled'}`,
          {
            body: `No toggle needed as the checkbox was already ${enable ? 'enabled' : 'disabled'}`,
            contentType: 'text/plain',
          },
        );
      }
    });
  }

  public async waitForElementAndClick(
    locatorInfo: LocatorInfo,
    timeout = this.shortTimeout,
  ): Promise<void> {
    const message = `Waiting for '${locatorInfo.description}' to be enabled and then clicking`;

    await test.step(message, async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        if (await locatorInfo.locator.isVisible()) {
          if (!(await locatorInfo.locator.isDisabled())) {
            await this.forceClick(locatorInfo);
            return;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      throw new Error(
        `Failed to wait for and click on '${locatorInfo.description}' within ${timeout} ms`,
      );
    });
  }
}
