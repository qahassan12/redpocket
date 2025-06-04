import { mergeTests } from '@playwright/test';
import { leaderTest } from '@fixtures/leader-page.fixtures';

export const test = mergeTests(
  leaderTest,
);
