import { Locator } from '@playwright/test';

export interface LocatorDetails {
  description: string;
  locator: Locator;
}

export type LocatorState = 'attached' | 'detached' | 'hidden' | 'visible';
