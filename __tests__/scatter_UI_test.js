/**
 * @jest-environment jsdom
 */

// import { generateChartImg } from "../src/lib/generateChartImg"
require("whatwg-fetch")
require("@testing-library/jest-dom/extend-expect")
const domTesting = require("@testing-library/dom")
const { clear } = require("console")
const userEvent = require("@testing-library/user-event").default

jest.mock(__dirname + "/../src/lib/generateChartImg", () => {
    return jest.fn().mockResolvedValue("http://placekitten.com/480/480")
})
const gen = require("../src/lib/generateChartImg")
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

    describe("Alerts displayed for missing chart data", () => {
        test("generating a chart without supplying axis labels or x and y inputs results in an error alert", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )

            const user = userEvent.setup()

            const clearButton = domTesting.getByTestId(document, "clear-chart-btn")
            await user.click(clearButton)

            const xLabel = domTesting.getByLabelText(document, "X label")
            const yLabel = domTesting.getByLabelText(document, "Y label")
            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")

            expect(x[0].value).toBe("")
            expect(y[0].value).toBe("")
            expect(xLabel.value).toBe("")
            expect(yLabel.value).toBe("")

            const alert = jest.spyOn(window, "alert").mockImplementation(() => {})
            const generate = domTesting.getByTestId(document, "generate-chart-btn")
            await user.click(generate)
            expect(alert).toHaveBeenCalled()

            const alertMessage = alert.mock.calls
            expect(alertMessage[0]).toContain("Error: No data specified!")
            alert.mockRestore()
        })

        test("generating a chart without axis labels WITH X and Y inputs results in an error alert", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )
            const user = userEvent.setup()
            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)

            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")

            await user.type(x[0], "3")
            await user.type(x[1], "1")
            await user.type(y[0], "3")
            await user.type(y[1], "1")

            const alert = jest.spyOn(window, "alert").mockImplementation(() => {})
            const generate = domTesting.getByTestId(document, "generate-chart-btn")
            await user.click(generate)
            expect(alert).toHaveBeenCalled()

            const alertMessage = alert.mock.calls
            expect(alertMessage).toContainEqual(["Error: Must specify a label for both X and Y!"])
            alert.mockRestore()
        })

        test("generating a chart without X and Y inputs WITH axis labels results in an error message", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )
            const user = userEvent.setup()
            const clearButton = domTesting.getByTestId(document, "clear-chart-btn")
            await user.click(clearButton)

            const xLabel = domTesting.getByLabelText(document, "X label")
            const yLabel = domTesting.getByLabelText(document, "Y label")

            await user.type(xLabel, "X-axis")
            await user.type(yLabel, "Y-axis")

            const alert = jest.spyOn(window, "alert").mockImplementation(() => {})
            const generate = domTesting.getByTestId(document, "generate-chart-btn")
            await user.click(generate)
            expect(alert).toHaveBeenCalled()

            const alertMessage = alert.mock.calls
            expect(alertMessage).toContainEqual(["Error: No data specified!"])
            alert.mockRestore()
        })

        test("generating a chart with X and Y inputs WITH axis labels results in no error message", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )
            const user = userEvent.setup()
            const clearButton = domTesting.getByTestId(document, "clear-chart-btn")
            await user.click(clearButton)
            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)

            const color = domTesting.getByLabelText(document, "Chart color")
            const title = domTesting.getByLabelText(document, "Chart title")
            const xLabel = domTesting.getByLabelText(document, "X label")
            const yLabel = domTesting.getByLabelText(document, "Y label")
            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")

            await user.type(title, "My Chart")
            await user.type(xLabel, "X-axis")
            await user.type(yLabel, "Y-axis")
            await user.type(x[0], "3")
            await user.type(x[1], "1")
            await user.type(y[0], "3")
            await user.type(y[1], "1")

            let alert = jest.spyOn(window, "alert").mockImplementation((msg) => {console.log(msg)})
            const generate = domTesting.getByTestId(document, "generate-chart-btn")
            await user.click(generate)
            expect(alert).not.toHaveBeenCalled()
        })
    })

    describe("Clearing Chart Data", () => {
        test("clear chart data button clears input fields for title, axes, X and Y data, and reduces number of data points to 0", async () => {
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )
            const user = userEvent.setup()
            const clearButton = domTesting.getByTestId(document, "clear-chart-btn")
            await user.click(clearButton)
            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)

            const title = domTesting.getByLabelText(document, "Chart title")
            const xLabel = domTesting.getByLabelText(document, "X label")
            const yLabel = domTesting.getByLabelText(document, "Y label")
            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")

            await user.type(title, "My Chart")
            await user.type(xLabel, "X-axis")
            await user.type(yLabel, "Y-axis")
            await user.type(x[0], "3")
            await user.type(x[1], "1")
            await user.type(y[0], "3")
            await user.type(y[1], "1")

            expect(title.value).toBe("My Chart")
            expect(xLabel.value).toBe("X-axis")
            expect(yLabel.value).toBe("Y-axis")
            expect(x[0].value).toBe("3")
            expect(x[1].value).toBe("1")
            expect(y[0].value).toBe("3")
            expect(y[1].value).toBe("1")
            await user.click(clearButton)

            const xNew = domTesting.getAllByLabelText(document, "X")
            const yNew = domTesting.getAllByLabelText(document, "Y")
            expect(title.value).toBe("")
            expect(xLabel.value).toBe("")
            expect(yLabel.value).toBe("")
            expect(xNew[0].value).toBe("")
            expect(yNew[0].value).toBe("")
        })
    })

    describe("Data correctly sent to chart generation function", () => {

        test("chart generation function receives user data when entering valid information for each field", async () => {
            
            initDomFromFiles(
                __dirname + "/../src/scatter/scatter.html",
                __dirname + "/../src/scatter/scatter.js"
            )
            const user = userEvent.setup()
            const clearButton = domTesting.getByTestId(document, "clear-chart-btn")
            await user.click(clearButton)
            const addButton = domTesting.getByTestId(document, "add-values-btn")
            await user.click(addButton)

            const title = domTesting.getByLabelText(document, "Chart title")
            const xLabel = domTesting.getByLabelText(document, "X label")
            const yLabel = domTesting.getByLabelText(document, "Y label")
            const x = domTesting.getAllByLabelText(document, "X")
            const y = domTesting.getAllByLabelText(document, "Y")

            await user.type(title, "My Chart")
            await user.type(xLabel, "X-axis")
            await user.type(yLabel, "Y-axis")
            await user.type(x[0], "3")
            await user.type(x[1], "1")
            await user.type(y[0], "3")
            await user.type(y[1], "1")

            const generateChartImg = require(__dirname + "/../src/lib/generateChartImg")
            expect(generateChartImg).toHaveBeenCalledWith("scatter", 
            [{"x": "1", "y": "1"}, 
            {"x": "3", "y": "3"}], 
            "X-axis", 
            "Y-axis", 
            "My Chart", 
            "#ff4500");
        })
    })
})
