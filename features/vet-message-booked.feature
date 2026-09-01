Feature: Vetting, messaging, and booked listings
  As a seeker and seller
  I want background-check stubs, messaging, and booked listings to close requests

  Scenario: Background check stub can pass
    Given I am signed in as a renter
    And I open a rent listing that requires a background check
    When I start and pass the background check stub
    Then I can send a message to the seller

  Scenario: Seller marks listing booked
    Given a renter has an open request on a listing
    When the seller marks the listing booked
    Then the open request becomes unavailable
    And seekers cannot apply to the booked listing
