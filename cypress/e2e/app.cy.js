it("Chart is generated and displayed", function () {
  //visit home page
  cy.visit("/")

  //click Line link & verify URL redirection
  cy.findByRole("link", {name: "Line"}).click()
  cy.url().should("eq", "http://localhost:8080/line.html")

  //fill the line chart with labes & data
  cy.fillChartData()
  
  //verify image doesn't exist before
  cy.get("#chart-img").should("not.exist")

  //click Generate chart
  cy.get("#generate-chart-btn").click()

  //verify image exists and is visible to user
  cy.get("#chart-img")
    .should("exist")
    .and("be.visible")
})