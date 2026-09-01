Feature: Home marketing entry
  As a visitor
  I want a polished home page with clear navigation
  So that I can discover listings and sign in

  Scenario: Home shows brand and navigation
    Given I open the company entry page
    Then I see the home brand
    And I see the home navigation links

  Scenario: Home bottom CTA leads to browse
    Given I open the company entry page
    When I tap the bottom browse CTA
    Then I land on public browse

  Scenario: Home sign up link opens sign up
    Given I open the company entry page
    When I tap sign up from entry
    Then I see the sign up screen
