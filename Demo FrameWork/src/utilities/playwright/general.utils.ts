import { faker } from '@faker-js/faker';
import { addDays, format } from 'date-fns';

export class GeneralUtils {

// generate a random person name
  public static generatePersonFirstName(): string {
    return faker.person.firstName();
  }
  // Generate a random person last name
  public static generatePersonLastName(): string {
    return faker.person.lastName();
  }
  public static GenerateNumber(): Number {
    return faker.number.int({ min: 10000, max: 99999 });
  }


  // Generate a Subject
  public static generateSubject(): string {
    return faker.commerce.productName();
  }

  public static getCurrentDate(formatStr: string = 'MM/dd/yyyy', dateInput: string = 'today'): string {
    let offsetDays = 0;
  
    // Parse the dateInput to handle offsets like 'today+5' or 'today-10'
    const match = dateInput.match(/today([+-]\d+)?/i);
  
    if (match) {
      offsetDays = match[1] ? parseInt(match[1], 10) : 0; // Get the numeric offset
    } else if (dateInput.toLowerCase() === 'yesterday') {
      offsetDays = -1;
    } else if (dateInput.toLowerCase() === 'tomorrow') {
      offsetDays = 1;
    } else {
      throw new Error(`Received date value "${dateInput}" is not recognized`);
    }
  
    // Adjust the current date based on offsetDays
    const date = addDays(new Date(), offsetDays);
  
    // Return the formatted date
    return format(date, formatStr);
  }

  // Generate a reference id name
  public static generateReferenceId(): string {
    return faker.string.uuid();
  }

  // Generate a control number
  public static generateControlNumber(): string {
    return faker.string.uuid();
  }

  // Generate a random word
  public static generateRiskAssessment(): string {
    return faker.lorem.word();
  }

  // Generate a random word
  public static generateAdditionalNotes(): string {
    return faker.lorem.word();
  }

  // Generate a user email
  public static generateEmail(): string {
    return faker.internet.exampleEmail();
  }

  // Generate a random address
  public static generateAddress(): string {
    return faker.address.streetAddress();
  }

  // Generate a random phone number
  public static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  // Generate a random company name
  public static generateCompanyName(): string {
    return faker.company.name();
  }

  // Generate a random date
  public static generateDate(): Date {
    return faker.date.past();
  }

  // Generate a random sentence
  public static generateSentence(): string {
    return faker.lorem.sentence();
  }

  // Generate a random paragraph
  public static generateParagraph(): string {
    return faker.lorem.paragraph();
  }

  // Generate a random product name
  public static generateProductName(): string {
    return faker.commerce.productName();
  }

  // Generate a random price
  public static generatePrice(): string {
    return faker.commerce.price();
  }

  // Generate a random boolean
  public static generateBoolean(): boolean {
    return faker.datatype.boolean();
  }

  // Generate a random word
  public static generateWord(): string {
    return faker.lorem.word();
  }

  // Generate a random color
  public static generateColor(): string {
    return faker.color.human();
  }

  // Generate a random date and format it as MM/DD/YYYY
  public static generateFormattedDate(): string {
    const randomDate = faker.date.past(); // Generate a random past date

    // Format the date to MM/DD/YYYY
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(randomDate);

    return formattedDate;
  }
  
}