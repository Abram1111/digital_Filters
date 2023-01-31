console.log("hello");
// var radius = 100;
// var canvas = document.getElementById("UnitCircle");
// var centerX = canvas.width / 2;
// var centerY = canvas.height / 2;

// function draw(){
//     var ctx = canvas.getContext('2d');
//     // var angels = [0, 2*(Math.PI)];
//     ctx.beginPath();
//     //Unit circle
//     ctx.arc(centerX, centerY, radius, 0, 2*(Math.PI));
//     // ctx.strokeStyle = 'grey';
//     // ctx.stroke();
//     //Imaginary Axis (Y-Axis)
//     ctx.moveTo(centerX, centerY - radius);
//     ctx.lineTo(centerX, centerY + radius);
//     //Real Axis (X-Axis)
//     ctx.moveTo(centerX - radius, centerY);
//     ctx.lineTo(centerX + radius, centerY);
//     ctx.lineWidth = 4;
//     ctx.fillStyle = "black";
//     ctx.fill();
//     ctx.strokeStyle = 'white';
//     ctx.stroke();
//     //Show the drawing
//     ctx.closePath();
// }
// canvas.addEventListener('click', function (e) {
//     let zero = document.createElement('canvas');
//     console.log(e.x);
//     console.log(e.y);
//     // zero.style = `background-color: green; width: 20px; height: 20px;position: absolute;top:${e.y-15}px;left:${e.x-15}px; border-radius: 50%;z-index:100`;
//     var ctx1 = zero.getContext('2d');
//     ctx1.beginPath();
//     ctx1.arc(e.x, e.y, 10, 0, 2*(Math.PI));
//     ctx1.fillStyle = "white";
//     ctx1.fill();
//     ctx1.closePath();
//     canvas.appendChild(zero);
// });
var remove = 0;
var polecounter = 0;
let zeros = [];
let z = {};
let p = {};
let poles = [];
let unit_circle = document.getElementById("circle");
let id_conter = 0;
var button = document.getElementById("remove").checked;
// button.onclick = function() {remove = 1;}
function delet_element(div) {
  // console.log(div.id)
  if (document.getElementById("remove").checked) {
    let div_zero = document.getElementById(div.id);
    div_zero.style = "display:none";
    // remove = 0;
  }
  let ID = div.id;
  for (var i = 0; i < Math.max(zeros.length, poles.length); i++) {
    if (i < zeros.length) {
      if (zeros[i].id == ID) {
        zeros.splice(i, 1);
        z = {};
      }
    }
    if (i < poles.length) {
      if (poles[i].id == ID) {
        poles.splice(i, 1);
        p = {};
      }
    }
  }
}
unit_circle.addEventListener("click", function (e) {
  if (document.getElementById("remove").checked) {
    // delet_element
  } else {
    if (document.getElementById("zero").checked) {
      z = {
        X: e.clientX,
        Y: e.clientY,
        id: "zero" + id_conter,
        conjugate: false,
      };
      let zero = document.createElement("div");
      // console.log(e.x);
      // console.log(e.y);
      zero.setAttribute("class", "zero");
      // zero.setAttribute("onmousedown", "mouseDown(e)")
      zero.setAttribute("onclick", "delet_element(this)");
      zero.setAttribute("id", "zero" + id_conter);
      zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;top:${e.clientY}px;left:${e.clientX}px; border-radius: 50%;z-index:100`;
      // dragElement(zero, unit_circle);
      unit_circle.appendChild(zero);
      id_conter++;
    } else if (document.getElementById("pole").checked) {
      p = {
        X: e.clientX,
        Y: e.clientY,
        id: "pole" + polecounter,
        conjugate: false,
      };
      let pole = document.createElement("div");
      pole.setAttribute("class", "pole");
      pole.setAttribute("id", "pole" + polecounter);
      // var ctx = pole.getContext('2d');
      // ctx.beginPath();
      // ctx.moveTo(e.x-15, e.y+15);
      // ctx.lineTo(e.x+15, e.y-15);
      // ctx.fillStyle = "black";
      // ctx.fill();
      // ctx.stroke();
      pole.setAttribute("onclick", "delet_element(this)");
      pole.innerHTML = "✖";
      pole.style = `color:white; width: 20px; height: 20px;position: absolute;top:${e.clientY}px;left:${e.clientX}px;`;
      // dragElement(pole, unit_circle);
      unit_circle.appendChild(pole);
      polecounter++;
    }
  }
  if (
    document.getElementById("conj").checked &&
    !document.getElementById("remove").checked
  ) {
    if (document.getElementById("zero").checked) {
      id_conter--;
      z.conjugate = true;
      let zero = document.createElement("div");
      zero.setAttribute("class", "zero");
      zero.setAttribute("onclick", "delet_element(this)");
      zero.setAttribute("id", "zero" + id_conter + "Conj");
      zero.style = `background-color: white; width: 10px; height: 10px;position: absolute;bottom:${
        e.clientY + 302
      }px;left:${e.clientX}px; border-radius: 50%;z-index:100`;
      // dragElement(zero, unit_circle);
      unit_circle.appendChild(zero);
      id_conter++;
    } else if (document.getElementById("pole").checked) {
      polecounter--;
      p.conjugate = true;
      let pole = document.createElement("div");
      pole.setAttribute("class", "pole");
      pole.setAttribute("id", "pole" + polecounter + "Conj");
      pole.setAttribute("onclick", "delet_element(this)");
      pole.innerHTML = "✖";
      pole.style = `color:white; width: 20px; height: 20px;position: absolute;bottom:${
        e.clientY + 302
      }px;left:${e.clientX}px;`;
      // dragElement(pole, unit_circle);
      unit_circle.appendChild(pole);
      polecounter++;
    }
  }
  // console.log("Left"+unit_circle.getBoundingClientRect.left+"Right"+unit_circle.getBoundingClientRect.right)
  if (zeros.length == 0 && !(JSON.stringify(z) === "{}")) {
    zeros.push(z);
  } else if (!(JSON.stringify(z) === "{}")) {
    if (z.X != zeros[zeros.length - 1].X && z.Y != zeros[zeros.length - 1].Y) {
      zeros.push(z);
    }
  }

  if (poles.length == 0 && !(JSON.stringify(p) === "{}")) {
    poles.push(p);
  }
  if (!(JSON.stringify(p) === "{}")) {
    if (p.X != poles[poles.length - 1].X && p.Y != poles[poles.length - 1].Y) {
      poles.push(p);
    }
  }

  console.log(zeros);
  console.log(poles);
  NormalizeAndSend(poles, zeros);
});

function NormalizeAndSend(poles, zeros) {
  let rect = unit_circle.getBoundingClientRect;
  for (var i = 0; i < zeros.length; i++) {
    zeros[i].x = (zeros[i].x - rect.left - 250 / 2) / 250;
    zeros[i].y = (zeros[i].y - rect.top - 250 / 2) / 250;
  }
  for (var i = 0; i < poles.length; i++) {
    poles[i].x = (poles[i].x - rect.left - 250 / 2) / 250;
    poles[i].y = (poles[i].y - rect.top - 250 / 2) / 250;
  }
  // zeros=[[5],[3]]
  // poles=[[2],[2]]
  var zerospoles = { zeros: zeros, poles: poles, input: y_value };
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
      makePlotly_trackpad(frequency, mag, [0, 1], null, "plot1", "Magntuide");
      makePlotly_trackpad(frequency, phase, [0, 1], null, "plot2", "Phase");

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
        output_signal,
        [x_length, x_length + 300],
        [0, 200],
        "out_plot",
        "output"
      );
    },
  });
}

// function mouseDown(e) {
//     e = e || window.event;
//     switch (e.which) {
//         case 1: alert('left'); break;
//         case 2: alert('middle'); break;
//         case 3: alert('right'); break;
//     }
// }

// const dragElement = (element, dragzone) => {
//     let pos1 = 0,
//         pos2 = 0,
//         pos3 = 0,
//         pos4 = 0;
//     //MouseUp occurs when the user releases the mouse button
//     const dragMouseUp = () => {
//         document.onmouseup = null;
//         //onmousemove attribute fires when the pointer is moving while it is over an element.
//         document.onmousemove = null;

//         element.classList.remove("drag");
//     };

//     const dragMouseMove = (event) => {

//         event.preventDefault();
//         //clientX property returns the horizontal coordinate of the mouse pointer
//         pos1 = pos3 - event.clientX;
//         //clientY property returns the vertical coordinate of the mouse pointer
//         pos2 = pos4 - event.clientY;
//         pos3 = event.clientX;
//         pos4 = event.clientY;
//         //offsetTop property returns the top position relative to the parent
//         element.style.top = `${element.offsetTop - pos2}px`;
//         element.style.left = `${element.offsetLeft - pos1}px`;
//     };

//     const dragMouseDown = (event) => {
//         event.preventDefault();

//         pos3 = event.clientX;
//         pos4 = event.clientY;

//         element.classList.add("drag");

//         document.onmouseup = dragMouseUp;
//         document.onmousemove = dragMouseMove;
//     };

//     dragzone.onmousedown = dragMouseDown;
// };
