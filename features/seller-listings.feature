Feature: Seller listings
  As a Seller
  I want to create and publish owner-listed homes
  So that seekers can browse my inventory

  Background:
    Given I am signed in as a seller

  Scenario: Create and publish a rent listing
    When I create a "home_rent" listing with required details
    And I publish the listing
    Then the listing appears in public browse

  Scenario: Block sale publish without fee stub
    When I create a "home_sale" listing with required details
    And I attempt to publish the listing
    Then publish is blocked for missing fee stub

  Scenario: Publish sale listing after fee stub
    When I create a "home_sale" listing with required details
    And I complete the listing fee stub
    And I publish the listing
    Then the listing appears in public browse
