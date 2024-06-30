Feature: Login Functionality

Scenario: Successful login with a registered user
  Given a registered user
  When I fill in the form data and press submit
  Then I should be redirected to the logged-in page

Scenario: Login attempt with an unregistered user
  Given an unregistered user
  When I fill in the form data and press submit
  Then an error message should appear
