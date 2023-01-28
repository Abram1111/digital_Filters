const CSV ="../static/assets/data/magAndPhase.csv";

function plotFromCSV() {
    Plotly.d3.csv(CSV, function(err, rows) {
        processData(rows);
    });
}

function processData(allRows) {
    let x = [];
    let y1 = [];
    let y2 = [];
    let row;

    let i = 0;
    while (i < allRows.length) {
        row = allRows[i];
        x.push(row["frequency"]);
        y1.push(row["mag"]);
        y2.push(row["phase"]);
        i += 1;
    }

    makePlotly(x, y1, y2);
}

function makePlotly(x, y1, y2) {

    let trace1 =
        {
            x: x,
            y: y1,
            name: "magnitude response",
            xaxis: 'frequency ',
            yaxis: 'magintude in db',
            line: {
                color: "#387fba",
                width: 3
            }
        };
    
    let trace2 =
        {
            x: x,
            y: y2,
            name: "phase response",
            xaxis: 'frequency ',
            yaxis: 'phase',
            line: {
                color: "#54ba38",
                width: 3,
            }
            };
    let  data = [trace1, trace2];
    let layout1 = {
        title: "Magnitude response",
        // grid: {rows: 1, columns: 2, pattern: 'independent'},
    };
    let layout2 = {
        title: "Phase response",
        // grid: {rows: 1, columns: 2, pattern: 'independent'},
    };
    let config = { 
        responsive: true,
    };
    Plotly.newPlot("plot1", [trace1], layout1, config);
    Plotly.newPlot("plot2", [trace2], layout2, config);
}
plotFromCSV();