const ip_signal = document.getElementById("ip_signal");
const import_signal = document.getElementById("import_signal");
ip_signal.checked = true;
chosen_sig = 0;
let track_pad_avilable = 1;

var zeros_uploaded, poles_uploaded;
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
let unit_circle = document.getElementById('circle');
let id_conter = 0;
var button = document.getElementById('remove').checked;

let pad = document.getElementById("track_pad");
// let id_conter = 0;
const x_value = [];
const y_value = [];
let i = 0;
let x_length = 0;
const CSV = "../static/assets/data/magAndPhase.csv";


/*********************************/
image_count = 11;
var divValue, values = "";
let ids = [];
let selectedid = 0;
let filters = [];
let inputval = "";


let phase_btn = document.getElementById("phase");
let first_contaner = document.getElementById("first_contaner");
phase_btn.addEventListener("click", function () {
  first_contaner.style.display = "none";
});


let allpass_contaner = document.getElementById("allpass_contaner");
let return_btn = document.getElementById("home");
return_btn.addEventListener("click", function () {
  allpass_contaner.style.display = "none";
});
return_btn.click();

function drawTrackPad() {
  // var zerospoles = { 'zeros': zeros , 'poles': poles , 'input': y_value };
  var zerospoles = { 'zeros': zerosUpdated, 'poles': polesUpdated, 'input': y_value };
  console.log(JSON.stringify(zerospoles));
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

      console.log("new");
      makePlotly_trackpad(frequency, mag, [0, 3.15], null, "plot1", "Magntuide");
      makePlotly_trackpad(frequency, phase, [0, 3.15], null, "plot2", "Phase");

      makePlotly_trackpad(
        x_value,
        y_value,
        [x_length, x_length + 300],
        null,
        "plot",
        "input"
      );
      makePlotly_trackpad(
        x_value,
        output_signal,
        [x_length, x_length + 300],
        null,
        "out_plot",
        "output"
      );
    },
  });
}

function drawUploaded() {
  // var zerosandpoles = { 'zeros': zeros , 'poles': poles };
  var zerosandpoles = { 'zeros': zerosUpdated, 'poles': polesUpdated };
  console.log(JSON.stringify(zerosandpoles));
  $.ajax({
    url: "/importSignal",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(zerosandpoles),
    success: function (response) {
      dict_data = JSON.parse(response);

      frequency = dict_data.frequency;
      mag = dict_data.mag;
      phase = dict_data.phase;
      output_signal = dict_data.output_signal;

      console.log("new");
      makePlotly_trackpad(frequency, mag, [0, 3.15], null, "plot1", "Magntuide");
      makePlotly_trackpad(frequency, phase, [0, 3.15], null, "plot2", "Phase");

      makePlotly_trackpad(
        x_value,
        y_value,
        [x_length, x_length + 300],
        null,
        "plot",
        "input"
      );
      makePlotly_trackpad(
        x_value,
        output_signal,
        [x_length, x_length + 300],
        null,
        "out_plot",
        "output"
      );
    },
  });
}
function uploadedFilter() {
  console.log(JSON.stringify(zerosandpoles));
  $.ajax({
    url: "/importFilter",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(null),
    success: function (response) {
      dict_data = JSON.parse(response);

      zeros = dict_data.zeros;
      poles = dict_data.poles;

      // console.log("new_filter");
      // console.log(zeros,poles);

    },
  });
}
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


pad.addEventListener("mousemove", function (e) {
  if (track_pad_avilable) {
    i++;
    x_value.push(i);
    y_value.push(100 - (e.y - 30) + 100);
    if (i > 300) {
      x_length = i - 300;
    }
    // makePlotly_trackpad(
    //   x_value,
    //   y_value,
    //   [x_length, x_length + 300],
    //   [0, 200],
    //   "plot",
    //   "input"
    // );
    // makePlotly_trackpad(
    //   x_value,
    //   y_value,
    //   [x_length, x_length + 300],
    //   [0, 200],
    //   "out_plot",
    //   "output"
    // );
    drawTrackPad();
  }

});



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

  makePlotly_trackpad(x, y1, [0, 3.15], null, "plot1", "Magnitude response");
  makePlotly_trackpad(x, y2, [0, 3.15], null, "plot2", "Phase response");
}


makePlotly_trackpad(
  x_value,
  y_value,
  [x_length, x_length + 300],
  [0, 200],
  "plot",
  "input"
);
makePlotly_trackpad(
  x_value,
  y_value,
  [x_length, x_length + 300],
  [0, 200],
  "out_plot",
  "output"
);

let darg_flag = false;

function delet_element(div) {
  // console.log(div.id)
  if (document.getElementById('remove').checked) {
    let div_zero = document.getElementById(div.id);
    div_zero.style = "display:none"
    // remove = 0;
  }
  let ID = div.id;
  // console.log(zeros.length);
  for (var i = 0; i < Math.max(zeros.length, poles.length); i++) {
    // console.log(i);
    if (i < zeros.length) {
      console.log("in");
      console.log(div.id);
      if (zeros[i].id == ID) {
        console.log("before");
        zeros.splice(i, 1);
        console.log(zerosUpdated);
        zerosUpdated.splice(i, 1);
        console.log(zerosUpdated);
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
  if(darg_flag){
  document.getElementById('remove').checked = false;
  darg_flag = false
  }
}
// zeros_real = 0.344;
// zeros_img = 0.44;
let rect = unit_circle.getBoundingClientRect();
window.onload = function(){
  console.log("IM IN")
  if(uploaded){
    if(!(JSON.stringify(zeros_uploaded) === '{}')){
      for(zeros_item in zeros_uploaded){
      let x = zeros_item[0] * (250/2) + rect.left + (250/2);
      let y = rect.top + (250/2) - zeros_item[1] * (250/2);
      let zero = document.createElement('div');
      zero.setAttribute("class", "zero");
      zero.setAttribute('onclick', 'delet_element(this)');
      zero.setAttribute("id", 'zero' + id_conter);
      zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${y}px;left:${x}px; border-radius: 50%;z-index:100;`
      dragElement(zero);
      unit_circle.appendChild(zero);
      id_conter++;
      zflag = true;
      z = {X:x, Y:y, id:zero.id,  conjugate:false};
      zeros.push(z);
      }
    }
    else if(!(JSON.stringify(poles_uploaded) === '{}')){
      for(poles_item in poles_uploaded){
      let x = poles_item[0] * (250/2) + rect.left + (250/2);
      let y = rect.top + (250/2) - poles_item[1] * (250/2);
      let pole = document.createElement('div');
      pole.setAttribute("class", "zero");
      pole.setAttribute('onclick', 'delet_element(this)');
      pole.setAttribute("id", 'zero' + polecounter);
      pole.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${y}px;left:${x}px; border-radius: 50%;z-index:100;`
      dragElement(pole);
      unit_circle.appendChild(pole);
      id_conter++;
      pflag = true;
      p = {X:x, Y:y, id:pole.id,  conjugate:false};
      poles.push(p);
    }
  }
    NormalizeAndSend(poles, zeros);
  }
}
unit_circle.addEventListener('click', function (e) {
  if (document.getElementById('remove').checked) {
    // delet_element
  }
  else {
    if (document.getElementById('zero').checked) {
      z = { X: e.clientX, Y: e.clientY, id: 'zero' + id_conter, conjugate: false };
      let zero = document.createElement('div');
      zero.setAttribute("class", "zero");
      zero.setAttribute('onclick', 'delet_element(this)');
      zero.setAttribute("id", 'zero' + id_conter);
      // zero.setAttribute("ondrag", 'dragElement(this)');
      let zid = 'zero' + id_conter;
      zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${e.clientY}px;left:${e.clientX}px; border-radius: 50%;z-index:100;`
      dragElement(zero);
      unit_circle.appendChild(zero);
      id_conter++;
      zflag = true;
    }
    else if (document.getElementById('pole').checked) {
      p = { X: e.clientX, Y: e.clientY, id: 'pole' + polecounter, conjugate: false };
      let pole = document.createElement('div');
      pole.setAttribute('class', 'pole');
      pole.setAttribute('id', 'pole' + polecounter);
      pole.setAttribute('onclick', 'delet_element(this)');
      pole.innerHTML = '✖';
      pole.style = `color:white; width: 20px; height: 20px;position: absolute;top:${e.clientY}px;left:${e.clientX}px;`
      dragElement(pole);
      unit_circle.appendChild(pole);
      polecounter++;
      pflag = true;
    }
  }
  if (document.getElementById('conj').checked && !(document.getElementById('remove').checked)) {
    if (document.getElementById('zero').checked) {
      id_conter--;
      z.conjugate = true;
      let zero = document.createElement('div');
      zero.setAttribute("class", "zero");
      zero.setAttribute('onclick', 'delet_element(this)');
      zero.setAttribute("id", 'zero' + id_conter + 'Conj');
      zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;bottom:${(e.clientY + 302)}px;left:${e.clientX}px; border-radius: 50%;z-index:100`
      dragElement(zero);
      unit_circle.appendChild(zero);
      id_conter++;
    }
    else if (document.getElementById('pole').checked) {
      polecounter--;
      p.conjugate = true;
      let pole = document.createElement('div');
      pole.setAttribute('class', 'pole');
      pole.setAttribute('id', 'pole' + polecounter + 'Conj');
      pole.setAttribute('onclick', 'delet_element(this)');
      pole.innerHTML = '✖';
      pole.style = `color:white; width: 20px; height: 20px;position: absolute;bottom:${(e.clientY + 302)}px;left:${e.clientX}px;`
      dragElement(pole);
      unit_circle.appendChild(pole);
      polecounter++;
    }
  }
  if (zeros.length == 0 && !(JSON.stringify(z) === '{}')) { zeros.push(z); }
  else if (!(JSON.stringify(z) === '{}')) {
    if ((z.X != zeros[zeros.length - 1].X && z.Y != zeros[zeros.length - 1].Y)) {
      zeros.push(z);
    }
  }

  if (poles.length == 0 && !(JSON.stringify(p) === '{}')) { poles.push(p); }
  if (!(JSON.stringify(p) === '{}')) {
    if ((p.X != poles[poles.length - 1].X && p.Y != poles[poles.length - 1].Y)) {
      poles.push(p);
    }
  }

  console.log(zeros);
  // console.log(poles);
  NormalizeAndSend(poles, zeros);
});




//{X:e.clientX, Y:e.clientY, id:'pole' + polecounter, conjugate:false};
function NormalizeAndSend(poles, zeros) {
  let rect = unit_circle.getBoundingClientRect()
  if (zflag) {
    zerosUpdated = [];
    for (var i = 0; i < zeros.length; i++) {
      // if (zeros[i].id != zerosUpdated[i].id){
      let x = 2 * (zeros[i].X - rect.left - (250.0 / 2.0)) / 250.0;
      let y = 2 * (rect.top + (250.0 / 2.0) - zeros[i].Y) / 250.0;
      // console.log("The edited");
      // console.log(zeros);
      zerosUpdated.push({ X: x, Y: y, id: zeros[i].id, conjugate: zeros[i].conjugate });
      // }
      console.log(zerosUpdated)
    }
    zflag = false;
  }
  if (pflag) {
    polesUpdated = [];
    for (var i = 0; i < poles.length; i++) {
      let x = 2 * (poles[i].X - rect.left - (250.0 / 2.0)) / 250.0;
      let y = 2 * (rect.top + (250.0 / 2.0) - poles[i].Y) / 250.0;
      // console.log(poles)
      polesUpdated.push({ X: x, Y: y, id: poles[i].id, conjugate: poles[i].conjugate });
      console.log(polesUpdated);
    }
    pflag = false;
  }
  zeros = [[5], [3]]
  poles = [[2], [2]]
  drawTrackPad();
}

// console.log(id_conter+"Repeat");



function dragElement(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    drag = true;
    // elmnt.style.opacity = 0.1;
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
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.color = 'red';
    let rec = unit_circle.getBoundingClientRect();
    let elmntrec = elmnt.getBoundingClientRect();
    let xx = 2 * (e.clientX - rec.left - (250.0 / 2.0)) / 250.0;
    let yy = 2 * (rec.top + (250.0 / 2.0) - e.clientY) / 250.0;
    let mag = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2))
    if(mag>1){
    elmnt.style.opacity = 0.01;
    }
    else{
    elmnt.style.opacity = 1;
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    let rec = unit_circle.getBoundingClientRect();
    let xx = 2 * (window.event.clientX - rec.left - (250.0 / 2.0)) / 250.0;
    let yy = 2 * (rec.top + (250.0 / 2.0) - window.event.clientY) / 250.0;
    let mag = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2))
    if (drag) {
      elmnt.style = "display:none";
    }
    drag = false;
    // }
    if(mag>1){
      console.log("This is the mag");
      console.log(mag);
      document.getElementById('remove').checked = true;
      console.log(document.getElementById('remove').checked);
      // delet_element(elmnt);
      elmnt.onclick;
      // darg_flag = true;
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function signal_choice() {
  // console.log(document.querySelector('input[name="Signal-choice"]:checked').value);
  chosen_sig = document.querySelector('input[name="Signal-choice"]:checked').value;
  if (chosen_sig == 0) {
    //TRACK PAD
    drawTrackPad();
  }
  else {
    //IMPORTED SIGNAL
    // drawUploaded();
  }
}

function upload_filter() {
  var fiter_form = document.forms.namedItem("filter_upload");
  var filter_data = new FormData(fiter_form);
  filter_data.append("filter", $("#uploaded_filter")[0].files[0]);
  for (var p of filter_data) {
    console.log(1)
    console.log(p); // <- logs image in oData correctly
  }
  $.ajax({
    url: "/importFilter",
    type: "POST",
    method: "POST",
    data: filter_data,
    enctype: "multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    success: function (data) 
    {
      dict_data = JSON.parse(response);

      zeros_real  = dict_data.zeros_real;
      zeros_img   = dict_data.zeros_img;
      poles_real  = dict_data.poles_real;
      poles_img   = dict_data.poles_img;
      for (var i = 0; i<zeros_real.length;i++){
        zeros_uploaded.push([zeros_real[i], zeros_img[i]]);
      }
      for (var i = 0; i<poles_real.length;i++){
        poles_uploaded.push([poles_real[i], poles_img[i]]);
      }
    },
  });
  uploaded = true;
}
function upload_signal() {

  var sig_form = document.forms.namedItem("signal_upload");
  var sig_data = new FormData(sig_form);
  sig_data.append("signal", $("#uploaded_sig")[0].files[0]);
  for (var p of sig_data) {
    console.log(1)
    console.log(p); // <- logs image in oData correctly
  }
  $.ajax({

    // type: "POST",
    method: 'post',
    processData: false,
    contentType: false,
    cache: false,
    data: sig_data,
    enctype: 'multipart/form-data',
    url: "/importSignal",
    success: function (response)
    {
      console.log(response)
      dict_data = JSON.parse(response);
      console.log('importingggggggggggggggggggggggggggggggggggg')
      frequency     = dict_data.frequency;
      mag           = dict_data.mag;
      phase         = dict_data.phase;
      output_signal = dict_data.output_signal;
      input_signal  = dict_data.uploaded_signal_y,
      x_axis        = dict_data.uploaded_signal_x
  

      console.log("new");
      makePlotly_trackpad(frequency, mag, [0, 3.15], null, "plot1", "Magntuide");
      makePlotly_trackpad(frequency, phase, [0, 3.15], null, "plot2", "Phase");

      makePlotly_trackpad(
        x_axis,
        input_signal,
        null,
        null,
        "plot",
        "input"
      );
      console.log("new");

      makePlotly_trackpad(
        x_axis,
        output_signal,
        null,
        null,
        "out_plot",
        "output"
      );
    },
  }); 
}
const filter_upload_btn = document.getElementById("custom_btn");
const uploaded_filter_btn = document.getElementById("uploaded_filter");
const upload_signal_btn = document.getElementById("import_sig_label");
const uploader_signal_btn = document.getElementById("uploaded_sig");
const track_pad_check = document.getElementById("track_pad_check");

filter_upload_btn.addEventListener('click', function () { uploaded_filter_btn.click(); });
track_pad_check.addEventListener('click', function () { track_pad_avilable = 1 });
upload_signal_btn.addEventListener('click', function () {
  uploader_signal_btn.click();
  track_pad_avilable = 0;
});


phase_btn.addEventListener('click', function () {
  first_contaner.style.display = "none"
  allpass_contaner.style.display = "flex"
});
return_btn.addEventListener('click', function () {
  first_contaner.style.display = "flex"
  allpass_contaner.style.display = "none"
});


/******************************************************* */
/**********************LIST***************************** */
/******************************************************* */

$(document).ready(function () {
  var iCnt = 0;
  // CREATE A "DIV" ELEMENT AND DESIGN IT USING jQuery ".css()" CLASS.
  var container = $(document.createElement("div")).css({
    padding: "5px",
    width: "98%",
    margin: "auto",
    "background-color": "#080a49f1",
    "margin-top": "-40px",
    "border-radius": ".5rem",
    "gap": "20px",
    "row-gap": "10px",
    "display": "flex",
    "flex-wrap": "wrap",
    "z-index": "10"
  });

  function addValue() {
    // console.log(inputval);
    if (iCnt <= 7) {
      iCnt = iCnt + 1;

      // ADD TEXTBOX.
      if (inputval == "") {
        $(container).append(
          '<input type=text class="input" id=tb' +
          iCnt +
          " " +
          'value="0+0j" onfocus="myFunction()" onchange="GetTextValue()" style ="border-radius: 0.5rem;width: 250px;font-size: 1.2rem; font-weight: 900;    letter-spacing: 10px;"/>'
        );
      }
      else {
        $(container).append(
          '<input type=text class="input" id=tb' +
          iCnt +
          " " +
          "value=" +
          inputval +
          ' onfocus="myFunction()" onchange="GetTextValue()" style ="border-radius: 0.5rem;width: 250px;font-size: 1.2rem; font-weight: 900;    letter-spacing: 10px;"/>'
        );
      }
      ids.push("tb" + iCnt);
      // ADD SUBMIT BUTTON IF ATLEAST "1" ELEMENT HAS BEEN CREATED.
      if (iCnt == 1) {
        var divSubmit = $(document.createElement("div"));
        $(divSubmit).append(
          '<input type=button class="bt" ' +
          'onclick="GetTextValue()"' +
          "id=btSubmit value=Submit style='display:none;' />"
        );
      }

      $("#main").after(container, divSubmit);
      GetTextValue();
    }
    else {
      alert('Max number of filters is 8.')
      $("#btAdd").attr("disabled", "disabled");
    }
  }
  inputval = "";
  $("#btAdd").click(addValue);

  // REMOVE ONE ELEMENT PER CLICK.
  $("#btRemove").click(function () {
    if (iCnt != 0) {
      $("#" + selectedid).remove();
      iCnt = iCnt - 1;
      $("#btAdd").removeAttr("disabled").attr("class", "bt");
      GetTextValue();
    }

    if (iCnt == 0) {
      $(container).empty().remove();
      $("#btAdd").removeAttr("disabled").attr("class", "bt");
      GetTextValue();
    }
  });

  // REMOVE ALL THE ELEMENTS IN THE CONTAINER.
  $("#btRemoveAll").click(function () {
    $(container).empty().remove();

    $("#btSubmit").remove();
    iCnt = 0;

    $("#btAdd").removeAttr("disabled").attr("class", "bt");

    filters = [];
    GetTextValue();
  });
});


function GetTextValue() {
  filters = [];
  $(divValue).empty().remove();

  values = "";

  $(".input").each(function () {
    filters.push(this.value);
  });
  $.ajax({
    url: "/allpass",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(filters),
    success: function (response) {
      dict_data = JSON.parse(response);
      makePlotly_trackpad(dict_data["frequency"], dict_data["phase"], null, null, "allpass", "Allpass");
    },
  });
}

//IMAGE SLIDESHOW
function image_choice(x) {
  inputval = x;
  $("#btAdd").click();
  inputval = '';
}

document.addEventListener("DOMContentLoaded", function () {
  new Splide(".splide", {
    type: "loop",
    perPage: 3,
  }).mount();
});


for (let i = 0; i < image_count; i++) {
  console.log(i);
  document
    .querySelector("#new-all-pass-coef" + i)
    .addEventListener("click", function () {
      image_choice(document.querySelector("#new-all-pass-coef" + i).value);
    });
}


function myFunction() {
  selectedid = document.activeElement.id;
}


/******************************************************* */
/**********************Graph**************************** */
/******************************************************* */


GetTextValue();
makePlotly_trackpad([0, 1, 2, 3, 4, 4], [0, 1, 2, 3, 4, 4], null, null, "total-phase", "output");
