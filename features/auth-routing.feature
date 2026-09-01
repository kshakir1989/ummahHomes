Feature: Demo auth routing
  As a demo user
  I want role-based sign in routing
  So that sellers and seekers land on the right home screen

  Scenario: Seller sign in routes to dashboard
    Given I open sign in
    When I sign in as demo role "seller"
    Then I land on the seller dashboard

  Scenario: Renter sign in routes to browse
    Given I open sign in
    When I sign in as demo role "renter"
    Then I land on public browse

  Scenario: Sign up opens and routes renter to browse
    Given I open sign up
    When I sign up as demo role "renter"
    Then I land on public browse
