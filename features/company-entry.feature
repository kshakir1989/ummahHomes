Feature: Company entry
  As a visitor
  I want a clear product entry page
  So that I can reach Browse or Sign in in a few obvious steps

  Scenario: Entry leads to browse
    Given I open the company entry page
    When I tap search listings
    Then I land on public browse

  Scenario: Entry leads to sign in
    Given I open the company entry page
    When I tap sign in from entry
    Then I am prompted to sign in
