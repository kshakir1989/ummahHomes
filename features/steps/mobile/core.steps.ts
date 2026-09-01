/**
 * Detox + Gherkin mobile step map for features/mobile-core.feature.
 * Executable Detox scenarios live in e2e/mobile-core.e2e.ts and e2e/browse-filters.e2e.js.
 */
export const mobileCoreSteps = {
  "the mobile app is launched": "device.launchApp",
  "I open browse on mobile": "entry-search-submit → browse-search-input",
  "I see listing cards on mobile": "listing-card-listing-1 visible",
  "I sign in as a renter on mobile": "entry-sign-in → sign-in-role-renter → renter-dashboard",
  "I open a rent listing on mobile": "renter-dashboard-browse → listing-card-listing-2",
  "I submit apply on mobile": "listing-detail-primary-cta → seeker-request-submit",
  "the request is submitted on mobile": "browse-search-input visible",
  "I sign in as a seller on mobile": "entry-sign-in → sign-in-role-seller → role-picker-seller",
  "I land on seller dashboard on mobile": "seller-dashboard visible",
  "I sign up as a renter on mobile": "entry-sign-up → sign-up-role-renter",
  "I land on renter dashboard on mobile": "renter-dashboard visible",
  "I open browse filters on mobile": "browse-filters-toggle",
  "I see browse filters panel on mobile": "browse-filters-panel visible",
  "I tap home on mobile": "nav-home",
  "I see home brand on mobile": "entry-brand visible",
};
