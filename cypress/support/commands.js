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
    //fill in title and labels
    cy.get("#chart-title-input").type("Cookies vs. Brownies")
    cy.get("#x-label-input").type("Cookies")
    cy.get("#y-label-input").type("Brownies")
  
    //add xy inputs
    for(let i = 0; i < 4; i++){
        cy.get('#add-values-btn').click()
    }

    //fill values into x fields
    cy.findAllByLabelText("X").then(function (xInputs) {
        cy.wrap(xInputs[0]).type("1")
        cy.wrap(xInputs[1]).type("2")
        cy.wrap(xInputs[2]).type("3")
        cy.wrap(xInputs[3]).type("4")
        cy.wrap(xInputs[4]).type("5")
    })
    
    //fill values into y fields
    cy.findAllByLabelText("Y").then(function (yInputs) {
        cy.wrap(yInputs[0]).type("4")
        cy.wrap(yInputs[1]).type("8")
        cy.wrap(yInputs[2]).type("16")
        cy.wrap(yInputs[3]).type("32")
        cy.wrap(yInputs[4]).type("64")
    })
})

Cypress.Commands.add("verifyChartData", function() {
    //must use "have.value" not "contain" as it is an input element, not <p>
    cy.get("#chart-title-input").should("have.value", "Cookies vs. Brownies")
    cy.get("#x-label-input").should("have.value", "Cookies")
    cy.get("#y-label-input").should("have.value", "Brownies")
  
    //assert x field values
    cy.findAllByLabelText("X").then(function (xInputs) {
        cy.wrap(xInputs[0]).should("have.value", "1")
        cy.wrap(xInputs[1]).should("have.value", "2")
        cy.wrap(xInputs[2]).should("have.value", "3")
        cy.wrap(xInputs[3]).should("have.value", "4")
        cy.wrap(xInputs[4]).should("have.value", "5")
    })
    
    //assert y field values
    cy.findAllByLabelText("Y").then(function (yInputs) {
        cy.wrap(yInputs[0]).should("have.value", "4")
        cy.wrap(yInputs[1]).should("have.value", "8")
        cy.wrap(yInputs[2]).should("have.value", "16")
        cy.wrap(yInputs[3]).should("have.value", "32")
        cy.wrap(yInputs[4]).should("have.value", "64")
    })
})