
function makePlotly_trackpad(x, y1, xrange, yrange, place, title) {
    let traces = [
        {
            x: x,
            y: y1,
            name: " input",
            xaxis: 'time ',
            yaxis: 'magintude',
            line: {
                color: "#080a49f1",
                width: 3
            }
        }
    ];
    let layout = {
        title: title,
        yaxis: {
            range: yrange
        },
        margin: {
            // autoexpand: false,
            b: 15,
            r: 0,
            // l: 0,
            t: 28

        },

        xaxis: {
          
            range: xrange
        },
        plot_bgcolor: 'wight',
        paper_bgcolor: 'transparent'
    };

    let config = {
        responsive: true,
    };

    Plotly.newPlot(place, traces, layout, config);
    
}

let pad = document.getElementById("track_pad");
// let id_conter = 0;
const x_value = [];
const y_value = [];
let i = 0;
let x_length = 0;
makePlotly_trackpad(x_value, y_value, [x_length, x_length + 300], [0, 200], "plot", "input");
makePlotly_trackpad(x_value, y_value, [x_length, x_length + 300], [0, 200], "out_plot", "output");
pad.addEventListener('mousemove', function (e) {
    i++;
    x_value.push(i);
    y_value.push(100 - (e.y - 40) + 100);
    if (i > 300) {
        x_length = i - 300;
    }
    makePlotly_trackpad(x_value, y_value, [x_length, x_length + 300], [0, 200], "plot", "input");
    makePlotly_trackpad(x_value, y_value, [x_length, x_length + 300], [0, 200], "out_plot", "output");


});

const CSV = "../static/assets/data/magAndPhase.csv";
function plotFromCSV() {
    Plotly.d3.csv(CSV, function (err, rows) {
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

    makePlotly_trackpad(x, y1, null,  null, 'plot1', "Magnitude response")
    makePlotly_trackpad(x, y2, null, null, 'plot2', "Phase response")


}

function makePlotly(x, y1, y2) {

    let trace1 =
    {
        x: x,
        y: y1,
        name : "magnitude response",
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
    let data = [trace1, trace2];
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