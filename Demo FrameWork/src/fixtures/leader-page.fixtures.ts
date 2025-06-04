import { LoginPage } from '@page/login/login.page';
import { test as base } from '@playwright/test';

type TestFixtures = {
  leaderLoginPage: LoginPage;
  

};

export const test = base.extend<TestFixtures>({
 
  leaderLoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page, base.info());
    await use(loginPage);
  },

});
export { test as leaderTest };
