import { expect, Locator, Page, test, TestInfo } from '@playwright/test';

interface LocatorInfo {
  description: string;
  locator: Locator;
}

export class PlaywrightVerificationsFactory {
  private readonly page: Page;
  private readonly testInfo: TestInfo;

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

  public async verifyTitle(expectedTitle: string): Promise<void> {
    await test.step(`🧪 Verifying page title: ${expectedTitle}`, async (): Promise<void> => {
      const actualTitle = await this.page.title();
      const message = `Expected Title: ${expectedTitle} and Actual Title: ${actualTitle}`;
      await this.testInfo.attach(`🧪 ${message}`, {
        body: message,
        contentType: 'text/plain',
      });
      expect(actualTitle, message).toBe(expectedTitle);
    });
  }

  public async verifyContains(
    haystack: string,
    needle: string,
    message?: string,
  ): Promise<void> {
    const isContained = haystack.includes(needle);

    await test.step(`🧪 Verifying if actual : "${haystack}" contains the expected : "${needle}"`, async () => {
      await this.testInfo.attach(
        isContained
          ? `✅ "${haystack}" contains the expected substring: "${needle}"`
          : `💥 "${haystack}" does NOT contain the expected substring: "${needle}"`,
        {
          body: message || `Expected "${needle}" to be found in "${haystack}"`,
          contentType: 'text/plain',
        },
      );

      expect(
        isContained,
        message || `Expected "${needle}" to be found in "${haystack}"`,
      ).toBeTruthy();
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

  public async verifyValue(
    locatorInfo: LocatorInfo,
    expectedValue: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying if "${locatorInfo.description}" value is displayed as expected`, async (): Promise<void> => {
      await locatorInfo.locator.evaluate((element) => {
        element.scrollIntoView({ block: 'start' });
      });
      const actualValue: string = await locatorInfo.locator.inputValue();
      if (actualValue === expectedValue) {
        await this.embedFullPageScreenshot(
          `✅ "${locatorInfo.description}" value is displayed as Expected = "${expectedValue}" ; Actual = "${actualValue}" - Screenshot`,
        );
        await this.testInfo.attach(
          `✅ "${locatorInfo.description}" value is displayed as Expected = "${expectedValue}" ; Actual = "${actualValue}"`,
          {
            body: `✅ "${locatorInfo.description}" value is displayed as expected = "${expectedValue}" ; actual = "${actualValue}"`,
            contentType: 'text/plain',
          },
        );
      } else {
        await this.embedFullPageScreenshot(
          `💥 "${locatorInfo.description}" value is NOT displayed. Expected = "${expectedValue}" ; Actual = "${actualValue}" - Screenshot`,
        );
        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" value is NOT displayed. Expected = "${expectedValue}" ; Actual = "${actualValue}"`,
          {
            body: `💥 "${locatorInfo.description}" value is NOT displayed as expected = "${expectedValue}" ; actual = "${actualValue}"`,
            contentType: 'text/plain',
          },
        );
      }
      await expect.soft(locatorInfo.locator).toHaveValue(expectedValue);
    });
  }

  public async getText(locatorInfo: LocatorInfo): Promise<null | string> {
    const elementTextContent =
      await test.step(`🐾 "${locatorInfo.description}" text is obtained`, async (): Promise<
        null | string
      > => {
        await locatorInfo.locator.evaluate((element) => {
          element.scrollIntoView({ block: 'start' });
        });
        return locatorInfo.locator.textContent();
      });
    return elementTextContent;
  }

  public async verifyText(
    locatorInfo: LocatorInfo,
    strExpectedText: string,
    mask: boolean = false,
  ): Promise<void> {
    const displayedText = mask
      ? this.maskValue(strExpectedText)
      : strExpectedText;

    await test.step(`🧪 Verifying if "${locatorInfo.description}" text is displayed as expected`, async (): Promise<void> => {
      const actualText: null | string = await this.getText(locatorInfo);

      if (actualText?.includes(strExpectedText)) {
        await this.embedFullPageScreenshot(
          `✅ "${locatorInfo.description}" text is displayed as Expected = "${displayedText}" ; Actual = "${actualText}" - Screenshot`,
        );
        await this.testInfo.attach(
          `✅ "${locatorInfo.description}" text is displayed as Expected = "${displayedText}" ; Actual = "${actualText}"`,
          {
            body: `✅ "${locatorInfo.description}" text is displayed as expected = "${displayedText}" ; actual = "${actualText}"`,
            contentType: 'text/plain',
          },
        );
      } else {
        await this.embedFullPageScreenshot(
          `💥 "${locatorInfo.description}" text is NOT displayed as Expected = "${displayedText}" ; Actual = "${actualText}" - Screenshot`,
        );
        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" text is NOT displayed as Expected = "${displayedText}" ; Actual = "${actualText}"`,
          {
            body: `💥 "${locatorInfo.description}" text is NOT displayed as expected = "${displayedText}" ; actual = "${actualText}"`,
            contentType: 'text/plain',
          },
        );
      }

      await expect.soft(locatorInfo.locator).toContainText(strExpectedText);
    });
  }

  public async verifyExist(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🧪 Verifying if "${locatorInfo.description}" exists`, async (): Promise<void> => {
      
      try {
        await locatorInfo.locator.waitFor({ state: 'visible' });
      } catch (error) {
        await this.embedFullPageScreenshot(
          `💥 "${locatorInfo.description}" does NOT exist or is not visible - Screenshot`
        );
        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" does NOT exist or is not visible`,
          {
            body: `💥 "${locatorInfo.description}" does NOT exist or is not visible`,
            contentType: 'text/plain',
          }
        );
        throw new Error(`💥 "${locatorInfo.description}" does NOT exist or is not visible`);
      }
  
      const isVisible = await locatorInfo.locator.isVisible();
      if (isVisible) {
        await this.embedFullPageScreenshot(
          `✅ "${locatorInfo.description}" exists and is visible - Screenshot`
        );
        await this.testInfo.attach(
          `✅ "${locatorInfo.description}" exists and is visible`,
          {
            body: `✅ "${locatorInfo.description}" exists and is visible`,
            contentType: 'text/plain',
          }
        );
      } else {
        await this.embedFullPageScreenshot(
          `💥 "${locatorInfo.description}" does NOT exist or is not visible - Screenshot`
        );
        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" does NOT exist or is not visible`,
          {
            body: `💥 "${locatorInfo.description}" does NOT exist or is not visible`,
            contentType: 'text/plain',
          }
        );
        throw new Error(`💥 "${locatorInfo.description}" does NOT exist or is not visible`);
      }
      await expect.soft(locatorInfo.locator).toBeVisible();
    });
  } 

  public async verifyElementsCount(
    locatorInfo: LocatorInfo,
    expectedCount: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying "${locatorInfo.description}" list of elements count`, async (): Promise<void> => {
      
      try {
        await locatorInfo.locator.first().waitFor({ state: 'visible' });
      } catch (error) {
        await this.embedFullPageScreenshot(`💥 "${locatorInfo.description}" list of elements is NOT visible - Screenshot`);
        await this.testInfo.attach(`💥 "${locatorInfo.description}" list of elements is NOT visible`, {
          body: `💥 No elements found or did not load in time for "${locatorInfo.description}"`,
          contentType: 'text/plain',
        });
        throw new Error(`💥 No elements found or did not load in time for "${locatorInfo.description}"`);
      }
  
      const elements = await locatorInfo.locator.all();
      const actualCount = elements.length;
      const expectedCountNumber = parseInt(expectedCount, 10);
  
      for (const element of elements) {
        await element.scrollIntoViewIfNeeded();
      }
  
      await this.embedFullPageScreenshot(`✅ "${locatorInfo.description}" list of elements is visible - Screenshot`);
  
      if (actualCount === expectedCountNumber) {
        await this.testInfo.attach(`✅ Elements count matches for "${locatorInfo.description}"`, {
          body: `✅ Expected count: ${expectedCountNumber}, Actual count: ${actualCount}`,
          contentType: 'text/plain',
        });
      } else {
        await this.embedFullPageScreenshot(`💥 Count mismatch for "${locatorInfo.description}" - Screenshot`);
        await this.testInfo.attach(`💥 Elements count mismatch for "${locatorInfo.description}"`, {
          body: `💥 Expected count: ${expectedCountNumber}, Actual count: ${actualCount}`,
          contentType: 'text/plain',
        });
        throw new Error(`💥 Expected count (${expectedCountNumber}) does NOT match actual count (${actualCount}) for "${locatorInfo.description}"`);
      }
    });
  }

  public async assertAreEqual(
    expected: number | string,
    actual: number | string,
    message?: string,
  ): Promise<void> {
    const stepMessage = `🧪 Verifying if "${expected}" equals "${actual}"`;
    await test.step(stepMessage, async (): Promise<void> => {
      await this.embedFullPageScreenshot(stepMessage);
      await expect(actual, message).toBe(expected);
    });
  }

  public async assertAreTrue(actual: boolean, message?: string): Promise<void> {
    await test.step('🧪 Verifying if given value is true."', async (): Promise<void> => {
      await expect(actual, message).toBeTruthy();
    });
  }

  public async assertHidden(
    locatorInfo: LocatorInfo,
    message?: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying if "${locatorInfo.description}" is hidden`, async (): Promise<void> => {
      const isHidden = await locatorInfo.locator.isHidden();
      if (isHidden) {
        await this.embedFullPageScreenshot(
          `✅ "${locatorInfo.description}" is hidden - Screenshot`,
        );
        await this.testInfo.attach(
          `✅ "${locatorInfo.description}" is hidden`,
          {
            body: `✅ "${locatorInfo.description}" is hidden`,
            contentType: 'text/plain',
          },
        );
      } else {
        await this.embedFullPageScreenshot(
          `💥 "${locatorInfo.description}" is visible, but should be hidden - Screenshot`,
        );
        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" is visible, but should be hidden`,
          {
            body: `💥 "${locatorInfo.description}" is visible, but should be hidden`,
            contentType: 'text/plain',
          },
        );
      }
      await expect(locatorInfo.locator, message).toBeHidden();
    });
  }

  public async assertGreaterThanOrEqualTo(
    expected: number,
    actual: number,
    message?: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying if "${expected}" is greater than or equal to "${actual}"`, async (): Promise<void> => {
      await expect(actual, message).toBeGreaterThanOrEqual(expected);
    });
  }

  public async assertGreaterThan(
    expected: number,
    actual: number,
    message?: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying if "${expected}" is greater than"${actual}"`, async (): Promise<void> => {
      await expect(expected, message).toBeGreaterThan(actual);
    });
  }

  public async assertElementHasClass(
    locatorInfo: LocatorInfo,
    className: ReadonlyArray<RegExp | string> | RegExp | string,
    message?: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying if "${locatorInfo.description} has class: ${className} present on it." `, async (): Promise<void> => {
      await expect(locatorInfo.locator, message).toHaveClass(className);
    });
  }

  public async assertElementIsEnabled(
    locatorInfo: LocatorInfo,
    message?: string,
  ): Promise<void> {
    await test.step(`🧪 Verifying if "${locatorInfo.description} is enabled." `, async (): Promise<void> => {
      await expect(locatorInfo.locator, message).toBeEnabled();
    });
  }

  public async assertElementCount(
    locatorInfo: LocatorInfo,
    count: number,
    message?: string,
  ): Promise<void> {
    await expect(await locatorInfo.locator, message).toHaveCount(count);

    await this.testInfo.attach(
      `✅ "Expecting ${locatorInfo.description} to have count: ${count}`,
      {
        body: `✅ "Expecting ${locatorInfo.description} to have count: ${count}`,
        contentType: 'text/plain',
      },
    );
  }
}
