const ip_signal = document.getElementById("ip_signal");
const import_signal = document.getElementById("import_signal");
ip_signal.checked = true;
chosen_sig = 0;
let track_pad_avilable = 1;

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
    y_value.push(100 - (e.y - 40) + 100);
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
// plotFromCSV();


// button.onclick = function() {remove = 1;}
// function delet_element(div) {
//   // console.log(div.id)
//   if (document.getElementById("remove").checked) {
//     let div_zero = document.getElementById(div.id);
//     div_zero.style = "display:none";
//     // remove = 0;
//   }
//   let ID = div.id;
//   for (var i = 0; i < Math.max(zeros.length, poles.length); i++) {
//     if (i < zeros.length) {
//       if (zeros[i].id == ID) {
//         zeros.splice(i, 1);
//         z = {};
//       }
//     }
//     if (i < poles.length) {
//       if (poles[i].id == ID) {
//         poles.splice(i, 1);
//         p = {};
//       }
//     }
//   }
// }
// unit_circle.addEventListener("click", function (e) {
//   if (document.getElementById("remove").checked) {
//     // delet_element
//   } else {
//     if (document.getElementById("zero").checked) {
//       z = {
//         X: e.clientX,
//         Y: e.clientY,
//         id: "zero" + id_conter,
//         conjugate: false,
//       };
//       let zero = document.createElement("div");
//       // console.log(e.x);
//       // console.log(e.y);
//       zero.setAttribute("class", "zero");
//       // zero.setAttribute("onmousedown", "mouseDown(e)")
//       zero.setAttribute("onclick", "delet_element(this)");
//       zero.setAttribute("id", "zero" + id_conter);
//       zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${e.clientY}px;left:${e.clientX}px; border-radius: 50%;z-index:100`;
//       // dragElement(zero, unit_circle);
//       unit_circle.appendChild(zero);
//       id_conter++;
//     } else if (document.getElementById("pole").checked) {
//       p = {
//         X: e.clientX,
//         Y: e.clientY,
//         id: "pole" + polecounter,
//         conjugate: false,
//       };
//       let pole = document.createElement("div");
//       pole.setAttribute("class", "pole");
//       pole.setAttribute("id", "pole" + polecounter);
//       // var ctx = pole.getContext('2d');
//       // ctx.beginPath();
//       // ctx.moveTo(e.x-15, e.y+15);
//       // ctx.lineTo(e.x+15, e.y-15);
//       // ctx.fillStyle = "black";
//       // ctx.fill();
//       // ctx.stroke();
//       pole.setAttribute("onclick", "delet_element(this)");
//       pole.innerHTML = "✖";
//       pole.style = `color:white; width: 20px; height: 20px;position: absolute;top:${e.clientY}px;left:${e.clientX}px;`;
//       // dragElement(pole, unit_circle);
//       unit_circle.appendChild(pole);
//       polecounter++;
//     }
//   }
//   if (
//     document.getElementById("conj").checked &&
//     !document.getElementById("remove").checked
//   ) {
//     if (document.getElementById("zero").checked) {
//       id_conter--;
//       z.conjugate = true;
//       let zero = document.createElement("div");
//       zero.setAttribute("class", "zero");
//       zero.setAttribute("onclick", "delet_element(this)");
//       zero.setAttribute("id", "zero" + id_conter + "Conj");
//       zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;bottom:${
//         e.clientY + 302
//       }px;left:${e.clientX}px; border-radius: 50%;z-index:100`;
//       // dragElement(zero, unit_circle);
//       unit_circle.appendChild(zero);
//       id_conter++;
//     } else if (document.getElementById("pole").checked) {
//       polecounter--;
//       p.conjugate = true;
//       let pole = document.createElement("div");
//       pole.setAttribute("class", "pole");
//       pole.setAttribute("id", "pole" + polecounter + "Conj");
//       pole.setAttribute("onclick", "delet_element(this)");
//       pole.innerHTML = "✖";
//       pole.style = `color:white; width: 20px; height: 20px;position: absolute;bottom:${
//         e.clientY + 302
//       }px;left:${e.clientX}px;`;
//       // dragElement(pole, unit_circle);
//       unit_circle.appendChild(pole);
//       polecounter++;
//     }
//   }
//   // console.log("Left"+unit_circle.getBoundingClientRect.left+"Right"+unit_circle.getBoundingClientRect.right)
//   if (zeros.length == 0 && !(JSON.stringify(z) === "{}")) {
//     zeros.push(z);
//   } else if (!(JSON.stringify(z) === "{}")) {
//     if (z.X != zeros[zeros.length - 1].X && z.Y != zeros[zeros.length - 1].Y) {
//       zeros.push(z);
//     }
//   }

//   if (poles.length == 0 && !(JSON.stringify(p) === "{}")) {
//     poles.push(p);
//   }
//   if (!(JSON.stringify(p) === "{}")) {
//     if (p.X != poles[poles.length - 1].X && p.Y != poles[poles.length - 1].Y) {
//       poles.push(p);
//     }
//   }

//   console.log(zeros);
//   console.log(poles);
//   NormalizeAndSend(poles, zeros);
// });

// function NormalizeAndSend(poles, zeros) {
//   let rect = unit_circle.getBoundingClientRect;
//   for (var i = 0; i < zeros.length; i++) {
//     zeros[i].x = (zeros[i].x - rect.left - 250 / 2) / 250;
//     zeros[i].y = (zeros[i].y - rect.top - 250 / 2) / 250;
//   }
//   for (var i = 0; i < poles.length; i++) {
//     poles[i].x = (poles[i].x - rect.left - 250 / 2) / 250;
//     poles[i].y = (poles[i].y - rect.top - 250 / 2) / 250;
//   }
// zeros=[[5],[3]]
// poles=[[2],[2]]

function delet_element(div) {
  // console.log(div.id)
  if (document.getElementById('remove').checked) {
      let div_zero = document.getElementById(div.id);
      div_zero.style = "display:none"
      // remove = 0;
  }
  let ID = div.id;
  // console.log(zeros.length);
  for(var i = 0 ;i<Math.max(zeros.length, poles.length);i++){
  // console.log(i);
      if(i<zeros.length){
          console.log("in");
          console.log(div.id);
          if(zeros[i].id == ID){
              console.log("before");
              zeros.splice(i, 1);
              console.log(zerosUpdated);
              zerosUpdated.splice(i, 1);
              console.log(zerosUpdated);
              z = {};
          }
      }
      if(i<poles.length){
              if(poles[i].id == ID){
                  poles.splice(i, 1);
                  polesUpdated.splice(i, 1);
                  p = {};
              }
          }
  }
}
unit_circle.addEventListener('click', function (e) {
  if (document.getElementById('remove').checked) {
      // delet_element
  }
  else {
      if (document.getElementById('zero').checked) {
          z = {X:e.clientX, Y:e.clientY, id:'zero' + id_conter, conjugate:false};
          let zero = document.createElement('div');
          zero.setAttribute("class", "zero");
          zero.setAttribute('onclick', 'delet_element(this)');
          zero.setAttribute("id", 'zero' + id_conter);
          // zero.setAttribute("ondrag", 'dragElement(this)');
          let zid = 'zero'+id_conter;
          zero.style = ` overflow:hidden;background-color: white; width: 10px; height: 10px;position: absolute;top:${e.clientY}px;left:${e.clientX}px; border-radius: 50%;z-index:100;`
          dragElement(zero);
          unit_circle.appendChild(zero);
          id_conter++;
          zflag = true;
      }
      else if (document.getElementById('pole').checked) {
          p = {X:e.clientX, Y:e.clientY, id:'pole' + polecounter, conjugate:false};
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
  if(zeros.length == 0 && !(JSON.stringify(z) === '{}')){zeros.push(z);}
  else if(!(JSON.stringify(z) === '{}'))
  {
      if((z.X != zeros[zeros.length-1].X && z.Y != zeros[zeros.length-1].Y))
      {
          zeros.push(z);
      }
  }

  if(poles.length == 0 && !(JSON.stringify(p) === '{}')){poles.push(p);}
  if(!(JSON.stringify(p) === '{}'))
  {
      if((p.X != poles[poles.length-1].X && p.Y != poles[poles.length-1].Y))
      {
          poles.push(p);
      }
  }

  console.log(zeros);
  // console.log(poles);
  NormalizeAndSend(poles, zeros);
});


//{X:e.clientX, Y:e.clientY, id:'pole' + polecounter, conjugate:false};
function NormalizeAndSend(poles, zeros){
  let rect = unit_circle.getBoundingClientRect()
  if(zflag){
  zerosUpdated = [];
  for (var i = 0; i<zeros.length;i++){
      // if (zeros[i].id != zerosUpdated[i].id){
          let x = 2*(zeros[i].X - rect.left-(250.0/2.0))/250.0;
          let y = 2*(rect.top +(250.0/2.0)-zeros[i].Y )/250.0;
          // console.log("The edited");
          // console.log(zeros);
          zerosUpdated.push({X:x, Y:y, id:zeros[i].id, conjugate:zeros[i].conjugate});
      // }
      console.log(zerosUpdated)
  }
  zflag = false;
}
  if(pflag){
    polesUpdated = [];
  for (var i = 0  ; i<poles.length;i++){
      let x = 2*(poles[i].X - rect.left-(250.0/2.0))/250.0;
      let y = 2*(rect.top +(250.0/2.0)-poles[i].Y)/250.0;
      // console.log(poles)
      polesUpdated.push({X:x, Y:y, id:poles[i].id, conjugate:poles[i].conjugate});
      console.log(polesUpdated);
  }
  pflag = false;
}
  zeros=[[5],[3]]
  poles=[[2],[2]]
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
    let rec = unit_circle.getBoundingClientRect();
    if(elmnt.style.top > rec.top || elmnt.style.left > rec.left){
      elmnt.hidden = true;
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    if(drag){
          elmnt.style = "display:none";
      }
      drag = false;
    // }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//  console.log(0);
// document.getElementById("Signal").addEventListener("click", function () {
//   //get value of checked radiobutton
//   let radiobtn = document.querySelector('input[name="Signal-choice"]:checked').value;

//   console.log(radiobtn);
// });

function signal_choice() {
  // console.log(document.querySelector('input[name="Signal-choice"]:checked').value);
  chosen_sig = document.querySelector('input[name="Signal-choice"]:checked').value;
  if (chosen_sig == 0) {
    //TRACK PAD
    drawTrackPad();
  }
  else {
    //IMPORTED SIGNAL
    drawUploaded();
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
    success: function (data) {
      signal_choice();
    },
  });

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
    url: "/importSignal",
    type: "POST",
    method: "POST",
    data: sig_data,
    enctype: "multipart/form-data",
    cache: false,
    contentType: false,
    processData: false,
    success: function (data) {
      signal_choice();
    },
  });
  // ev.preventDefault();
  // const upload_btn = document.getElementById("uploaded_filter");
  // const curFiles2 = upload_btn.files;
  // // file_name2 = curFiles2[0].name;
  // // console.log(curFiles2[0].name);
  // $.ajax({
  //   url: "/importFilter",
  //   type: "POST",
  //   contentType: "application/json",
  //   data: JSON.stringify(curFiles2[0].name),
  // }); 
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