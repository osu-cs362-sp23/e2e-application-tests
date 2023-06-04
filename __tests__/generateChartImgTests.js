const fs = require("fs")
const path = require("path")
const cwd = process.cwd();
const rest = require("msw").rest
const setupServer = require("msw/node").setupServer
const generateChartImg = require("../src/lib/generateChartImg")

// need to get the right path
const imgPath = path.join(cwd, "/img/chart.png")


const server = setupServer(
    rest.post(
        "https://quickchart.io/chart",
        function (req, res, ctx) {
            console.log("== Fake API called")
            const img = fs.readFileSync(imgPath)
            return res(ctx.set("Content-Type", "image/png"), ctx.body(img))
        }
    )
)

beforeAll(function () {
    server.listen()
})

afterAll(function () {
    server.close()
})

describe("generateImg", function(){
    test("generates a chart Img", async function(){
        const chartType = 'line';

        const chartData = [
        {x: 2012, y: 120},
        {x: 2013, y: 60},
        {x: 2014, y: 50},
        {x: 2015, y:180},
        {x: 2016, y:120},
        ];
        
        const xLabel = 'Years';
        const yLabel = 'Avg. Hours On';
        const title = 'Users';
        const color = '#ff0000';

        const imgUrl = await generateChartImg(chartType, chartData, xLabel, yLabel, title, color)

        expect(imgUrl).toContain("blob:nodedata:")
    })
})

