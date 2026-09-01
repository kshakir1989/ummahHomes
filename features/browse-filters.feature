Feature: Browse search and filters
  As a visitor
  I want to search and filter Atlanta metro listings
  And control how many listings appear per row
  So that I can find homes efficiently

  Background:
    Given I am not signed in
    And I open public browse

  Scenario: Browse search bar is available
    Then I see the browse search bar
    And I see published listings

  Scenario: Open and close filters from the header
    When I open browse filters
    Then I see the browse filters panel
    When I close browse filters
    Then I do not see the browse filters panel

  Scenario: Filter listings by type
    When I open browse filters
    And I filter browse by listing type "home_sale"
    Then browse results only include listing type "home_sale"

  Scenario: Filter listings by city
    When I open browse filters
    And I filter browse by city "Atlanta"
    Then browse results only include city "Atlanta"

  Scenario: Search listings by query
    When I search browse for "Johns Creek"
    Then browse results mention "Johns Creek"

  Scenario: Change listings per row
    When I open browse filters
    And I set browse view to 3 columns
    Then browse view is set to 3 columns

  Scenario: Home button returns to entry
    When I tap home from browse
    Then I see the home brand
