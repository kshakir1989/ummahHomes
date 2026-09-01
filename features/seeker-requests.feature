Feature: Seeker apply and express interest
  As a Renter or Buyer
  I want to apply or express interest on owner-listed homes
  So that sellers can accept or deny my request

  Scenario: Renter applies to a rent listing
    Given I am signed in as a renter
    And I open a published rent listing
    When I submit an apply request
    Then the seller can see my submitted request

  Scenario: Buyer expresses interest on a sale listing
    Given I am signed in as a buyer
    And I open a published sale listing
    When I submit an express interest request
    Then the seller can see my submitted request

  Scenario: Seller accepts one request without closing others
    Given two renters have open requests on the same listing
    When the seller accepts the first request
    Then the second request remains submitted
