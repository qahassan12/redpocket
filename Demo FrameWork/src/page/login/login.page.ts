import { LocatorDetails } from '@interface/base/locator.interface';
import { UserData } from '@interface/setup/login.interface';
import { test, Page, TestInfo } from '@playwright/test';
import { PlaywrightActionsFactory } from '@utilities/playwright/playwright-actions.utils';



export class LoginPage {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly playwrightActionsFactory: PlaywrightActionsFactory;
  private readonly url: string;
  private readonly loginLocator: { [key: string]: LocatorDetails };

  /**
   * @param page
   * @param testInfo
   */
  public constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.playwrightActionsFactory = new PlaywrightActionsFactory(
      this.page,
      this.testInfo,
    );
   
    this.loginLocator = {
    registerButton: {
      description: 'Register Button',
      locator: this.page.locator("//a[normalize-space()='register']")
    },
    firstName: {
      description: 'First Name',
      locator: this.page.locator("//label[normalize-space()='First Name*']/following-sibling::input")
    },
    lastName: {
      description: 'Last Name',
      locator: this.page.locator("//label[normalize-space()='Last Name*']/following-sibling::input")
    },
    address: {
      description: 'Address',
      locator: this.page.locator("//label[normalize-space()='Address*']/following-sibling::input")
    },
    apartment: {
      description: 'Apartment',
      locator: this.page.locator("//label[normalize-space()='Apartment/Unit #']/following-sibling::input")
    },
    City: {
      description: 'City',
      locator: this.page.locator("//label[normalize-space()='City*']/following-sibling::input")
    },
    State: {
      description: 'State',
      locator: this.page.locator("//select[@name='state']")
    },
    Zip: {
      description: 'Zip',
      locator: this.page.locator("//label[normalize-space()='Zip Code*']/following-sibling::input")
    },
    Phone: {
      description: 'Phone',
      locator: this.page.locator("//label[normalize-space()='Phone Number*']/following-sibling::input")
    },
    Email: {
      description: 'Email',
      locator: this.page.locator("//label[normalize-space()='Email Address (also your username)*']/following-sibling::input")
    },
    Password: {
      description: 'Password',
      locator: this.page.locator("//label[normalize-space()='Password*']/following-sibling::input")
    },
    ConfirmPassword: {
      description: 'Confirm Password',
      locator: this.page.locator("//label[normalize-space()='Confirm password*']/following-sibling::input")
    },
    checkAgreement: {
      description: 'Check Agreement',
      locator: this.page.locator("//input[@type='checkbox']")
    },
    registered: {
      description: 'Register Button',
      locator: this.page.locator("//button[normalize-space()='REGISTER']")
    },
  
    
    
    
    
  }
}
public async navigateToLoginPage(url:string): Promise<void> {
  await this.page.goto(url);
}
public async clickRegisterButton(): Promise<void> {
  await this.playwrightActionsFactory.click(this.loginLocator.registerButton);

}
public async fillRegistrationForm(data:UserData): Promise<void> {
  await this.playwrightActionsFactory.waitForVisibility(this.loginLocator.firstName);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.firstName, data.FirstName);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.lastName, data.LastName);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.address, data.Address);  
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.apartment, data.Apartment);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.City, data.City);
  await this.playwrightActionsFactory.selectDropdownOption(this.loginLocator.State, data.State);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.Zip, data.Zip);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.Phone, data.Phone);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.Email, data.Email);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.Password, data.Password);
  await this.playwrightActionsFactory.sendKeys(this.loginLocator.ConfirmPassword, data.Password);
  await this.playwrightActionsFactory.click(this.loginLocator.checkAgreement);
  await this.playwrightActionsFactory.click(this.loginLocator.registered);




}

}
