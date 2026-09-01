/**
 * Detox + Gherkin mobile step map for features/mobile-core.feature.
 * Executable Detox scenarios live in e2e/mobile-core.e2e.ts (Jest Detox runner).
 */
export const mobileCoreSteps = {
  "the mobile app is launched": "device.launchApp",
  "I open browse on mobile": "entry-search-submit → browse",
  "I see listing cards on mobile": "Owner-listed cards visible",
  "I sign in as a renter on mobile": "sign-in-role-renter",
  "I open a rent listing on mobile": "listing-card-listing-2",
  "I submit apply on mobile": "seeker-request-submit",
  "the request is submitted on mobile": "return to browse",
};
