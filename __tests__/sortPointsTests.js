// require("whatwg-fetch")
// require("@testing-library/jest-dom/extend-expect")
// const domTesting = require("@testing-library/dom")
// const userEvent = require("@testing-library/user-event").default

const sortPoints = require("../src/lib/sortPoints");
describe("Check if Points are Sorted Correctly", function(){
    test("Sorts an array of points by ascending X", function(){
        const points = [
            {x: 3, y: 4},
            {x: 1, y: 4},
            {x: 2, y: 4},
        ]
        sortPoints(points)
        expect(points).toEqual([
            {x: 1, y: 4},
            {x: 2, y: 4},
            {x: 3, y: 4},
        ])
    })

    test("Handles empty array", function(){
        const points = []
        expect(points).toEqual([])
    })

    test("Handles Duplicate X-Values", function(){
        const points = [
            { x: 3, y: 2 },
            { x: 1, y: 4 },
            { x: 2, y: 1 },
            { x: 1, y: 3 },
        ]
        sortPoints(points)
        expect(points).toEqual([
            { x: 1, y: 4 },
            { x: 1, y: 3 },
            { x: 2, y: 1 },
            { x: 3, y: 2 },
        ])
    })
})