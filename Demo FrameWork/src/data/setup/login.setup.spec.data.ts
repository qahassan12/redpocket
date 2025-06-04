import { TestCaseData } from '@interface/base/testcase.interface';
import {  UserData } from '@interface/setup/login.interface';
import { generateRandomEmail } from '@utilities/helpers/random-data.utils';
interface LoginTestCaseData {
  userData?:UserData
  testCaseData: TestCaseData;
}
const loginTestData: { [key: string]: LoginTestCaseData } = {
  '001-register': {
    testCaseData: {
      tags: '@smoke @regression @login @admin ',
      testCase: '001-register',
      testDescription: 'Register a new User and verify login functionality',
      testSummary: 'This test case verifies the registration of a new user and checks if the user can log in successfully.',
    },
    userData: {
      FirstName: 'Admin',
      LastName: 'User',
      Address: '123 Main St',
      Apartment: 'Apt 1',
      City: 'Anytown',
      State: 'CA',
      Zip: '12345',
      Phone: '555-1234',
      Email: generateRandomEmail(),
      Password: 'Admin123!',
    }
  }
};

export function getSetupTestCaseData(testCase: string): LoginTestCaseData {
  const data = loginTestData[testCase.trim()];
  if (!data) {
    throw new Error(`Test case data not found for: ${testCase}`);
  }
  return data;
}


