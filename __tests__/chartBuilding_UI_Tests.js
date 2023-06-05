/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom/extend-expect")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const fs = require("fs")
const { url } = require("inspector")
const { dirname } = require("path")

function initDomFromFiles(htmlPath, jsPath){
    const html = fs.readFileSync(htmlPath, 'utf-8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
}

describe("Suite of Required Tests", () => {
    // test 1
    describe("Adding values in the chart builder", () => {
        test("button to add another input field creates another input field with empty x and y fields", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )

            const user = userEvent.setup()
            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")


            expect(x).toHaveLength(1)            
            expect(x[0]).toBeEmptyDOMElement()

            expect(y).toHaveLength(1)
            expect(y[0]).toBeEmptyDOMElement()
            

            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)

            const xFields = domTesting.getAllByLabelText(document, "X")
            const yFields = domTesting.getAllByLabelText(document, "Y")
            expect(xFields).toHaveLength(2)
            expect(yFields).toHaveLength(2)

            for( let xi of xFields ){
                expect(xi).toBeEmptyDOMElement()
            }
            for( let yi of yFields ){
                expect(yi).toBeEmptyDOMElement()
            }
        })

        test("clicking the add button with occupied fields does not alter field content", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )
            
            const user = userEvent.setup()
            const x = domTesting.getByLabelText(document, "X")
            const y = domTesting.getByLabelText(document, "Y")

            await user.type(x, "1")
            await user.type(y, "2")

            expect(x.value).toBe("1")
            expect(y.value).toBe("2")

            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)
            await user.click(addButton)

            const xFields = domTesting.getAllByLabelText(document, "X")
            const yFields = domTesting.getAllByLabelText(document, "Y")

            expect(xFields).toHaveLength(3)
            expect(xFields[0].value).toBe("1")
            expect(xFields[1].value).toBe("")
            expect(xFields[2].value).toBe("")

            expect(yFields).toHaveLength(3)
            expect(yFields[0].value).toBe("2")
            expect(yFields[1].value).toBe("")
            expect(xFields[2].value).toBe("")
        })
    })

    // test 2 (in progress)
    describe("Alerts displayed for missing chart data", () => {
        test("generating a chart without supplying axis labels or x and y inputs results in an error alert", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )

            // have to figure out way to reload page to reset x and y fields

            const user = userEvent.setup()
            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)

            const xLabel = domTesting.getByLabelText(document, "X label")
            const yLabel = domTesting.getByLabelText(document, "Y label")
            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")

            // expect(x[0].value).toBe("")
            // expect(x[1].value).toBe("")
            // expect(y[0].value).toBe("")
            // expect(y[1].value).toBe("")
            // expect(xLabel.value).toBe("")
            // expect(yLabel.value).toBe("")

            // const alert = jset.spyOn(window, "alert")
            // const generate = domTesting.getByTestId(document, "generate-chart-btn")
            // await user.click(generate)
            // expect(alert).toHaveBeenCalled()

        })
    })
})