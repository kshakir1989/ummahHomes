Feature: Mobile core flows
  As a mobile demo user
  I want browse, sign-in, and apply parity with web
  So that iOS and Android demos match stage-1 behavior

  @mobile
  Scenario: Browse listings on mobile
    Given the mobile app is launched
    When I open browse on mobile
    Then I see listing cards on mobile

  @mobile
  Scenario: Sign in and apply on mobile
    Given the mobile app is launched
    When I sign in as a renter on mobile
    And I open a rent listing on mobile
    And I submit apply on mobile
    Then the request is submitted on mobile
