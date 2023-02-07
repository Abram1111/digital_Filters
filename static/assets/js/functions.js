const ip_signal = document.getElementById("ip_signal");
const import_signal = document.getElementById("import_signal");
ip_signal.checked = true;
chosen_sig = 0;
let track_pad_avilable = 1;
let index = 0;
var zeros_uploaded = [], poles_uploaded = [];
let uploaded = false;

var remove = 0;
var polecounter = 0;
let zeros = [];
let zerosUpdated = [];
let polesUpdated = [];
let z = {};
let p = {};
let zflag = false;
let pflag = false;
let drag = false;
let poles = [];
let unit_circle = document.getElementById("circle");
let id_conter = 0;
var button = document.getElementById("remove").checked;
let darg_flag = false;

let pad = document.getElementById("track_pad");
// let id_conter = 0;
let x_value = [];
let itrator = 0;
let x_length = 0;
const CSV = "../static/assets/data/magAndPhase.csv";

/*********************************/
image_count = 11;
var divValue, values = "";
let ids = [];
let selectedid = 0;
let filters = [];
let inputval = "";
var phase = 0;
var phase_frequency = 0;


let first_contaner = document.getElementById("first_contaner");
let allpass_contaner = document.getElementById("allpass_contaner");

let input_signal = [];




function makePlotly_trackpad(x, y1, xrange, yrange, place, title) {
  let traces = [
    {
      x: x,
      y: y1,
      name: " input",
      xaxis: "time ",
      yaxis: "magintude",
      line: {
        color: "#080a49f1",
        width: 3,
      },
    },
  ];
  let layout = {
    title: title,
    yaxis: {
      range: yrange,
    },
    margin: {
      // autoexpand: false,
      b: 15,
      r: 0,
      // l: 0,
      t: 28,
    },

    xaxis: {
      range: xrange,
    },
    plot_bgcolor: "wight",
    paper_bgcolor: "transparent",
  };

  let config = {
    responsive: true,
  };

  Plotly.newPlot(place, traces, layout, config);
}


/***********************************************************************************************
**************************************  Moving Between Pages  **********************************
************************************************************************************************/
function phase_btn_action() {
  first_contaner.style.display = "none";
  GetTextValue();
  allpass_contaner.style.display = "block";
  allpass_contaner.style.top = 0;
}


function return_btn_action() {
  makePlotly_trackpad(phase_frequency, phase, null, "plot2", "Phase");
  allpass_contaner.style.display = "none";
  first_contaner.style.display = "flex";
}


/***********************************************************************************************
 *****************************************  Unit Circle  ***************************************
 ************************************************************************************************/

function unitcircle() {
  var zerospoles = {
    zeros: zerosUpdated,
    poles: polesUpdated,
    input: input_signal,
  };


  $.ajax({
    url: "/unitcircle",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(zerospoles),
    success: function (response) {
      dict_data = JSON.parse(response);

      frequency = dict_data.frequency;
      mag = dict_data.mag;
      phase = dict_data.phase;
      output_signal = dict_data.output_signal;

      if (chosen_sig == 1) {
        let stop_var = setInterval(function () {
          makePlotly_trackpad(x_value, input_signal, [index, index + 300], null, "plot", "Input");
          makePlotly_trackpad(x_value, output_signal, [index, index + 300], null, "out_plot", "Output");

          index += 10;
          if (index >= itrator - 300 || track_pad_avilable) {
            clearInterval(stop_var);
          }
        }, 200);
      }


      makePlotly_trackpad(frequency, mag, [0, 3.15], null, "plot1", "Magntuide");
      makePlotly_trackpad(frequency, phase, [0, 3.15], null, "plot2", "Phase");
      makePlotly_trackpad(x_value, input_signal, [x_length, x_length + 300], null, "plot", "Input");
      makePlotly_trackpad(x_value, output_signal, [x_length, x_length + 300], null, "out_plot", "Output");
    },
  });
}


function delet_element(div) {
  if (document.getElementById("remove").checked) {
    let div_zero = document.getElementById(div.id);
    div_zero.style = "display:none";
  }
  let ID = div.id;
  for (var i = 0; i < Math.max(zeros.length, poles.length); i++) {
    if (i < zeros.length) {
      if (zeros[i].id == ID) {
        zeros.splice(i, 1);
        zerosUpdated.splice(i, 1);
        z = {};
      }
    }
    if (i < poles.length) {
      if (poles[i].id == ID) {
        poles.splice(i, 1);
        polesUpdated.splice(i, 1);
        p = {};
      }
    }
  }
  if (darg_flag) {
    document.getElementById("remove").checked = false;
    darg_flag = false;
  }
}


function draw_uploaded(){
  if (uploaded) {
    if (!(JSON.stringify(zeros_real) === "{}")) {
      console.log("IM IN zero");
      for (var i = 0 ;i<zeros_real.length;i++) {
        let x = zeros_real[i] * (250 / 2) + rect.left + 250 / 2;
        let y = rect.top + 250 / 2 - zeros_img[i] * (250 / 2);
        let zero = document.createElement("div");
        zero.setAttribute("class", "zero");
        zero.setAttribute("onclick", "delet_element(this)");
        zero.setAttribute("id", "zero" + id_conter);
        zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${y}px;left:${x}px; border-radius: 50%;z-index:100;`;
        dragElement(zero);
        unit_circle.appendChild(zero);
        id_conter++;
        zflag = true;
        z = { X: x, Y: y, id: zero.id, conjugate: false };
        zeros.push(z);
      }
    } else if (!(JSON.stringify(poles_real) === "{}")) {
      console.log("IM IN");
      for (var i = 0 ; i<poles_real.length; i++) {
        let x = poles_real[i] * (250 / 2) + rect.left + 250 / 2;
        let y = rect.top + 250 / 2 - poles_img[i] * (250 / 2);
        let pole = document.createElement("div");
        pole.setAttribute("class", "pole");
        pole.setAttribute("onclick", "delet_element(this)");
        pole.setAttribute("id", "pole" + polecounter);
        pole.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${y}px;left:${x}px;z-index:100;`;
        
        dragElement(pole);
        unit_circle.appendChild(pole);
        polecounter++;
        pflag = true;
        p = { X: x, Y: y, id: pole.id, conjugate: false };
        poles.push(p);
      }
    }
    NormalizeAndSend(poles, zeros);
  }
}
  // );


function NormalizeAndSend(poles, zeros) {
  let rect = unit_circle.getBoundingClientRect();
  if (zflag) {
    zerosUpdated = [];
    for (var i = 0; i < zeros.length; i++) {
      let x = (2 * (zeros[i].X - rect.left - 250.0 / 2.0)) / 250.0;
      let y = (2 * (rect.top + 250.0 / 2.0 - zeros[i].Y)) / 250.0;
      zerosUpdated.push({
        X: x,
        Y: y,
        id: zeros[i].id,
        conjugate: zeros[i].conjugate,
      });
    }
    zflag = false;
  }
  if (pflag) {
    polesUpdated = [];
    for (var i = 0; i < poles.length; i++) {
      let x = (2 * (poles[i].X - rect.left - 250.0 / 2.0)) / 250.0;
      let y = (2 * (rect.top + 250.0 / 2.0 - poles[i].Y)) / 250.0;
      polesUpdated.push({
        X: x,
        Y: y,
        id: poles[i].id,
        conjugate: poles[i].conjugate,
      });
    }
    pflag = false;
  }
  zeros = [[5], [3]];
  poles = [[2], [2]];
  unitcircle();
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    if((document.getElementById("zero").checked && 'zero' == elmnt.className) || (document.getElementById("pole").checked && 'pole' == elmnt.className)){
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    }
    else{
      if('zero' == elmnt.className){
        document.getElementById("zero").checked = true;
        document.getElementById("pole").checked = false;
      }
      else{
        document.getElementById("pole").checked = true;
        document.getElementById("zero").checked = false;
      }
      document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
    drag = true;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    elmnt.style.color = "red";
    let rec = unit_circle.getBoundingClientRect();
    let elmntrec = elmnt.getBoundingClientRect();
    let xx = (2 * (e.clientX - rec.left - 250.0 / 2.0)) / 250.0;
    let yy = (2 * (rec.top + 250.0 / 2.0 - e.clientY)) / 250.0;
    let mag = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));
    if (mag > 1) {
      elmnt.style.opacity = 0.01;
    } else {
      elmnt.style.opacity = 1;
    }
  }
  
  function closeDragElement() {
    // stop moving when mouse button is released:
    let rec = unit_circle.getBoundingClientRect();
    let xx = (2 * (window.event.clientX - rec.left - 250.0 / 2.0)) / 250.0;
    let yy = (2 * (rec.top + 250.0 / 2.0 - window.event.clientY)) / 250.0;
    let mag = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));
    if (drag) {
      elmnt.style = "display:none";
    }
    drag = false;
    if (mag > 1) {
      document.getElementById("remove").checked = true;
      elmnt.onclick;
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }

}

/***********************************************************************************************
 *****************************************  Track Pad  ***************************************
 ************************************************************************************************/
