import { getSetupTestCaseData } from '@data/setup/login.setup.spec.data';
import { test } from '@fixtures/leader-page.fixtures';
import { logTestCaseData } from '@utilities/helpers/test-helper.utils';
import { getEnvVariable } from '@utilities/helpers/env.utils';

const scenario1 = getSetupTestCaseData('001-register');

test.describe('Feature: Logins', () => {
  test.slow();
    test(`
      Test case: '${scenario1.testCaseData.testCase}'
      Description: '${scenario1.testCaseData.testDescription}'
      Tags: '${scenario1.testCaseData.tags}'
    `, async ({
      leaderLoginPage: loginPage,
    }) => {
      logTestCaseData(test.info(), scenario1.testCaseData);
      await test.step('Navigate to Login Page', async () => {
        await loginPage.navigateToLoginPage(getEnvVariable('URL'));
      })
      await test.step('Register a new User', async () => {
        await loginPage.clickRegisterButton();
        await loginPage.fillRegistrationForm(scenario1.userData!);
        
      })

     
    });
  });














  

















