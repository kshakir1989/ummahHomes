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

  @mobile
  Scenario: Seller sign in routes to dashboard on mobile
    Given the mobile app is launched
    When I sign in as a seller on mobile
    Then I land on seller dashboard on mobile

  @mobile
  Scenario: Sign up routes renter to renter dashboard on mobile
    Given the mobile app is launched
    When I sign up as a renter on mobile
    Then I land on renter dashboard on mobile

  @mobile
  Scenario: Browse filters open on mobile
    Given the mobile app is launched
    When I open browse on mobile
    And I open browse filters on mobile
    Then I see browse filters panel on mobile

  @mobile
  Scenario: Home button returns to entry on mobile
    Given the mobile app is launched
    When I open browse on mobile
    And I tap home on mobile
    Then I see home brand on mobile
