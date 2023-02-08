/***********************************************************************************************
 **************************************  Moving Between Pages  **********************************
 ************************************************************************************************/
let return_btn = document.getElementById("home");
let phase_btn = document.getElementById("phase");

phase_btn.addEventListener("click", phase_btn_action);
return_btn.addEventListener("click", return_btn_action);

/***********************************************************************************************
 *****************************************  Unit Circle  ***************************************
 ************************************************************************************************/
let rect = unit_circle.getBoundingClientRect();

unit_circle.addEventListener("click", function (e) {
  if (document.getElementById("remove").checked) {
    // delet_element
  } else {
    if (document.getElementById("zero").checked || zRemove ) {
      z = {
        X: e.clientX,
        Y: e.clientY,
        id: "zero" + id_conter,
        conjugate: false,
      };
      let zero = document.createElement("div");
      zero.setAttribute("class", "zero");
      zero.setAttribute("onclick", "delet_element(this)");
      zero.setAttribute("id", "zero" + id_conter);
      // zero.setAttribute("ondrag", 'dragElement(this)');
      let zid = "zero" + id_conter;
      zero.style = `cursor : move; background-color: white; width: 10px; height: 10px;position: absolute;top:${e.clientY}px;left:${e.clientX}px; border-radius: 50%;z-index:100;`;
      dragElement(zero);
      unit_circle.appendChild(zero);
      id_conter++;
      zflag = true;
    } else if (document.getElementById("pole").checked || pRemove) {
      p = {
        X: e.clientX,
        Y: e.clientY,
        id: "pole" + polecounter,
        conjugate: false,
      };
      let pole = document.createElement("div");
      pole.setAttribute("class", "pole");
      pole.setAttribute("id", "pole" + polecounter);
      pole.setAttribute("onclick", "delet_element(this)");
      pole.innerHTML = "✖";
      pole.style = `color:white; width: 20px; height: 20px;position: absolute;top:${e.clientY}px;left:${e.clientX}px;`;
      dragElement(pole);
      unit_circle.appendChild(pole);
      polecounter++;
      pflag = true;
    }
  }
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
  NormalizeAndSend(poles, zeros);
  update_flag=true;
  unitcircle();
});

/***********************************************************************************************
 *****************************************  Track Pad  ***************************************
 ************************************************************************************************/
pad.addEventListener("mousemove", function (e) {
  if (track_pad_avilable) {
    itrator++;
    x_value.push(itrator);
    input_signal.push(100 - (e.y - 30) + 100);
    if (itrator > 300) {
      x_length = itrator - 300;
    }
    update_flag=false;
    unitcircle();
  }
});

/******************************************************* */
/**********************UPLOAD*************************** */
/******************************************************* */

const upload_signal_btn = document.getElementById("import_sig_label");
const uploader_signal_btn = document.getElementById("uploaded_sig");
const track_pad_check = document.getElementById("track_pad_check");

const uploaded_filter_btn = document.getElementById("custom_btn");
uploaded_filter_btn.addEventListener("click", function () {
  upload_btn.click();
});
const upload_btn = document.getElementById("uploaded_filter");
upload_btn.addEventListener("change", upload_filter);

/******************************************************* */
/**********************UPLOAD*************************** */
/******************************************************* */
track_pad_check.addEventListener("click", function () {
  track_pad_avilable = 1;
});
upload_signal_btn.addEventListener("click", function () {
  uploader_signal_btn.click();
  track_pad_avilable = 0;
});

phase_btn.addEventListener("click", function () {
  first_contaner.style.display = "none";
  allpass_contaner.style.display = "flex";
});
return_btn.addEventListener("click", function () {
  first_contaner.style.display = "flex";
  allpass_contaner.style.display = "none";
});

/******************************************************* */
/**********************LIST***************************** */
/******************************************************* */

$(document).ready(function () {
  var listCounter = 0;
  // CREATE A "DIV" ELEMENT AND DESIGN IT USING jQuery ".css()" CLASS.
  var container = $(document.createElement("div")).css({
    padding: "5px",
    width: "98%",
    margin: "auto",
    "background-color": "transparent",
    "margin-left": "20px",
    "margin-top": "90px",
    "border-radius": ".5rem",
    gap: "20px",
    "row-gap": "10px",
    display: "flex",
    "flex-wrap": "wrap",
    "z-index": "10",
  });

  function addValue() {
    if (listCounter <= 11) {
      listCounter = listCounter + 1;

      // ADD TEXTBOX.
      if (inputval == "") {
        $(container).append(
          '<input type=text class="input" id=tb' +
            listCounter +
            " " +
            'value="0+0j" onfocus="myFunction()" onchange="GetTextValue()" style ="border-radius: 0.5rem;width: 250px;font-size: 1.2rem; font-weight: 900;    letter-spacing: 10px;"/>'
        );
      } else {
        $(container).append(
          '<input type=text class="input" id=tb' +
            listCounter +
            " " +
            "value=" +
            inputval +
            ' onfocus="myFunction()" onchange="GetTextValue()" style ="border-radius: 0.5rem;width: 250px;font-size: 1.2rem; font-weight: 900;    letter-spacing: 10px;"/>'
        );
      }
      ids.push("tb" + listCounter);
      // ADD SUBMIT BUTTON IF ATLEAST "1" ELEMENT HAS BEEN CREATED.
      if (listCounter == 1) {
        var divSubmit = $(document.createElement("div"));
        $(divSubmit).append(
          '<input type=button class="bt" ' +
            'onclick="GetTextValue()"' +
            "id=btSubmit value=Submit style='display:none;' />"
        );
      }

      $("#main").after(container, divSubmit);
      GetTextValue();
    } else {
      alert("Max number of filters is 8.");
      $("#btAdd").attr("disabled", "disabled");
    }
  }
  inputval = "";
  $("#btAdd").click(addValue);

  // REMOVE ONE ELEMENT PER CLICK.
  $("#btRemove").click(function () {
    if (listCounter != 0) {
      $("#" + selectedid).remove();
      listCounter = listCounter - 1;
      $("#btAdd").removeAttr("disabled").attr("class", "bt");
      GetTextValue();
    }

    if (listCounter == 0) {
      $(container).empty().remove();
      $("#btAdd").removeAttr("disabled").attr("class", "bt");
      GetTextValue();
    }
  });

  // REMOVE ALL THE ELEMENTS IN THE CONTAINER.
  $("#btRemoveAll").click(function () {
    $(container).empty().remove();

    $("#btSubmit").remove();
    listCounter = 0;

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
      dict_data["frequency"];
      makePlotly_trackpad(
        dict_data["frequency"],
        dict_data["phase"],
        null,
        null,
        "allpass",
        "Allpass"
      );
      phase = dict_data["phase"];
      phase_frequency = dict_data["frequency"];
      makePlotly_trackpad(
        dict_data["frequency"],
        dict_data["total phase"],
        null,
        null,
        "total-phase",
        "Phase Responce"
      );
      makePlotly_trackpad(
        dict_data["frequency"],
        dict_data["total phase"],
        null,
        null,
        "plot2",
        "Phase"
      );
    },
  });
}

//IMAGE SLIDESHOW
function image_choice(x) {
  inputval = x;
  $("#btAdd").click();
  inputval = "";
}

document.addEventListener("DOMContentLoaded", function () {
  new Splide(".splide", {
    type: "loop",
    perPage: 3,
  }).mount();
});

for (let i = 0; i < image_count; i++) {
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

makePlotly_trackpad(
  phase_frequency,
  phase,
  null,
  null,
  "total-phase",
  "phase_responce"
);

makePlotly_trackpad([0], [0], [0, 3.15], null, "plot1", "Magntuide");
makePlotly_trackpad([0], [0], [0, 3.15], null, "plot2", "Phase");
makePlotly_trackpad(
  [0],
  [0],
  [x_length, x_length + 300],
  null,
  "plot",
  "Input"
);
makePlotly_trackpad(
  [0],
  [0],
  [x_length, x_length + 300],
  null,
  "out_plot",
  "Output"
);
