/**
 * @jest-environment jsdom
 */
const chartStorage = require("../src/lib/chartStorage")

describe("chartSaving", function(){
    beforeEach(function(){
        window.localStorage.clear()
    })
    describe("saveChart", function(){
        test("Save Chart in Storage", function(){
            const chart = {type: "line", data: [1, 2, 3, 4, 5]}
    
            chartStorage.saveChart(chart)
    
            const savedCharts = chartStorage.loadAllSavedCharts()
            expect(savedCharts).toHaveLength(1)
            expect(savedCharts[0]).toEqual(chart)
        })
        test("Overwrites Saved Data", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            const newChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            chartStorage.saveChart(ogChart, 0)
    
            let savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(1)
            expect(savedCharts[0]).toEqual(ogChart)
    
            chartStorage.saveChart(newChart, 0)
    
            savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(1)
            expect(savedCharts[0]).toEqual(newChart)
    
        })
        test("Chart is Appeneded if No Index is Specified", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            const newChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            chartStorage.saveChart(ogChart, 0)
            chartStorage.saveChart(newChart)
    
            const savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(2);
            expect(savedCharts[0]).toEqual(ogChart)
            expect(savedCharts[1]).toEqual(newChart)
    
        })
    })
    describe("loadAllSavedCharts", function(){
        test("Properly Loads One Chart", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            chartStorage.saveChart(ogChart, 0)
    
            savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(1)
    
        })
        test("Properly Houses One Chart", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            chartStorage.saveChart(ogChart, 0)
    
            savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(1)
            expect(savedCharts[0]).toEqual(ogChart)
    
        })
        test("Properly Loads Multiple Charts", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            const newChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            chartStorage.saveChart(ogChart, 0)
            chartStorage.saveChart(newChart, 1)
    
            savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(2)
    
        })
        test("Properly Houses Multiple Charts", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            const newChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            chartStorage.saveChart(ogChart, 0)
            chartStorage.saveChart(newChart, 1)
    
            savedCharts = chartStorage.loadAllSavedCharts();
            expect(savedCharts).toHaveLength(2)
            expect(savedCharts[0]).toEqual(ogChart)
            expect(savedCharts[1]).toEqual(newChart)
    
        })
    })
    describe("loadSavedChart", function(){
        test("Properly Loads One Chart", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            chartStorage.saveChart(ogChart, 0)

            savedCharts = chartStorage.loadAllSavedCharts()
            savedChart = chartStorage.loadSavedChart(0)
            expect(savedChart).toEqual(savedCharts[0] && ogChart)
        })
        test("Properly Specified Chart from Multiple Saves", function(){
            const ogChart = {type: "line", data: [1, 2, 3, 4, 5]}
            const newChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            chartStorage.saveChart(ogChart, 0)
            chartStorage.saveChart(newChart, 1)
        })
    })
    describe("updateCurrentChartData", function(){
        test("Properly Stores Current Chart Being Worked On", function(){
            const oldChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            const currentChart = {type: "line", data: [1, 2, 3, 4, 5]}

            chartStorage.updateCurrentChartData(oldChart)

            const chartDataO = chartStorage.loadCurrentChartData()
            expect(chartDataO).toEqual(oldChart)

            chartStorage.updateCurrentChartData(currentChart)

            const chartDataN = chartStorage.loadCurrentChartData()
            expect(chartDataN).toEqual(currentChart)
            expect(chartDataN).not.toEqual(chartDataO)
        })
    })
    describe("loadCurrentChartData", function(){
        test("Properly Loads Current Chart Being Worked On", function(){
            const oldChart = {type: "bar", data: [3, 4, 5, 6, 7]}
            const currentChart = {type: "line", data: [1, 2, 3, 4, 5]}

            chartStorage.updateCurrentChartData(oldChart)

            const chartDataO = chartStorage.loadCurrentChartData()
            expect(chartDataO).toEqual(oldChart)

            chartStorage.updateCurrentChartData(currentChart)

            const chartDataN = chartStorage.loadCurrentChartData()
            expect(chartDataN).toEqual(currentChart)
            expect(chartDataN).not.toEqual(chartDataO)
        })
    })

})