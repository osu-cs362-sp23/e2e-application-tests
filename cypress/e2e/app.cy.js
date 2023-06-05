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

it("Chart data is maintained across chart types", function () {
  //visit home page
  cy.visit("/")

  //click Line link & verify URL redirection
  cy.findByRole("link", {name: "Line"}).click()
  cy.url().should("eq", "http://localhost:8080/line.html")

  //fill the line chart with labes & data
  cy.fillChartData()

  //click Scatter link & verify URL redirection
  cy.findByRole("link", {name: "Scatter"}).click()
  cy.url().should("eq", "http://localhost:8080/scatter.html")
  cy.verifyChartData() //verify chart data remains same

  //click Bar link & verify URL redirection
  cy.findByRole("link", {name: "Bar"}).click()
  cy.url().should("eq", "http://localhost:8080/bar.html")
  cy.verifyChartData()

  //click Line link & verify URL redirection
  cy.findByRole("link", {name: "Line"}).click()
  cy.url().should("eq", "http://localhost:8080/line.html")
  cy.verifyChartData()
})

it("Saving a chart to the gallery", function () {
  //visit home page
  cy.visit("/")

  //click Line link & verify URL redirection
  cy.findByRole("link", {name: "Line"}).click()
  cy.url().should("eq", "http://localhost:8080/line.html")

  //fill the line chart with labes & data
  cy.fillChartData()
  
  //click generate chart
  cy.get("#generate-chart-btn").click()

  //click save chart
  cy.get("#save-chart-btn").click()

  //click gallery and verify redirection to homepage where gallery is hosted
  cy.findByRole("link", {name: "Gallery"}).click()
  cy.url().should("eq", "http://localhost:8080/")

  //assert the chart is displayed via title
  cy.get(".chart-title")
    .should("exist")
    .and("contain", "Cookies vs. Brownies")
})