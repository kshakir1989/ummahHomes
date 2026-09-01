Feature: Public browse and auth gate
  As a visitor
  I want to browse published listings without signing in
  And be prompted to sign in before applying or messaging

  Scenario: Browse without signing in
    Given I am not signed in
    When I open public browse
    Then I see published listings

  Scenario: Apply requires sign in
    Given I am not signed in
    And I open a published rent listing
    When I tap the primary seeker CTA
    Then I am prompted to sign in
