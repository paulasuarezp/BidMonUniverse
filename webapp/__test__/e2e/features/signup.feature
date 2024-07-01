Feature: Signup Functionality

  Scenario: Failed Signup due to validation errors
    Given a user fills out the registration form incorrectly
    When the user submits the form
    Then they should see error messages