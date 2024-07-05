Feature: Access to Home page

Scenario: User can access the home page and click on the join button
    Given a guest user
    When the user accesses the home page
    Then the user can click on the join button and be redirected to signup
