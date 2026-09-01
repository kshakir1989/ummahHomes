Feature: Admin surface
  As an Admin
  I want to manage users and listings in one place
  So that I can moderate the demo marketplace

  Scenario: Admin views users and listings
    Given I am signed in as an admin
    When I open the admin surface
    Then I see users and listings tabs

  Scenario: Admin suspends a user
    Given I am signed in as an admin
    When I open the admin surface
    And I suspend demo user "user-1"
    Then that user shows as suspended

  Scenario: Admin unpublishes a listing
    Given I am signed in as an admin
    When I open the admin surface
    And I unpublish listing "listing-1"
    Then listing "listing-1" is no longer in public browse
