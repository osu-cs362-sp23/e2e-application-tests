// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
require("@testing-library/cypress/add-commands")

Cypress.Commands.add("fillChartData", function () {
    cy.get("#chart-title-input").type("Cookies vs. Brownies")
    cy.get("#x-label-input").type("Cookies")
    cy.get("#y-label-input").type("Brownies")
  
    cy.get("#x-y-data-grid").children().eq(3).type("1")
    cy.get("#x-y-data-grid").children().eq(4).type("4")
    cy.get('#add-values-btn').click()
  
    cy.get("#x-y-data-grid").children().eq(5).type("2")
    cy.get("#x-y-data-grid").children().eq(6).type("8")
    cy.get('#add-values-btn').click()
  
    cy.get("#x-y-data-grid").children().eq(7).type("3")
    cy.get("#x-y-data-grid").children().eq(8).type("16")
})