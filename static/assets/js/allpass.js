let ids = [];
let selectedid = 0;
let filters = [];
let inputval = '';

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
        // $("#btSubmit").remove();
        // return id;
      }

      // ADD BOTH THE DIV ELEMENTS TO THE "main" CONTAINER.
      $("#main").after(container, divSubmit);
      GetTextValue();
    }
    // AFTER REACHING THE SPECIFIED LIMIT, DISABLE THE "ADD" BUTTON.
    // (20 IS THE LIMIT WE HAVE SET)
    else {
      // $(container).append("<label>Reached the limit</label>");
      alert('Max number of filters is 8.')
      // $("#btAdd").attr("class", "bt-disable");
      $("#btAdd").attr("disabled", "disabled");
    }
  }
  inputval = "";
  $("#btAdd").click(addValue);

  // REMOVE ONE ELEMENT PER CLICK.
  $("#btRemove").click(function () {
    if (iCnt != 0) {
      // $("#tb" + iCnt).remove();
      $("#" + selectedid).remove();
      // console.log(selectedid);
      iCnt = iCnt - 1;
      $("#btAdd").removeAttr("disabled").attr("class", "bt");
      GetTextValue();
    }

    if (iCnt == 0) {
      $(container).empty().remove();

      // $("#btSubmit").remove();
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
    // console.log(filters);
  });
});

// PICK THE VALUES FROM EACH TEXTBOX WHEN "SUBMIT" BUTTON IS CLICKED.
var divValue,
  values = "";

function GetTextValue() {
  filters = [];
  $(divValue).empty().remove();

  values = "";

  $(".input").each(function () {
    // divValue = $(document.createElement("div")).css({
    //   padding: "5px",
    //   width: "200px",
    // });
    // values += this.value + "<br />";
    filters.push(this.value);
  });
  console.log(filters);
  //   $(divValue).append("<p><b>Your selected values</b></p>" + values);
  //   $("body").append(divValue);
  $.ajax({
    url: "/allpass",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(filters),
    success: function (response) {
      dict_data = JSON.parse(response);
      console.log(dict_data["phase"]);
      makePlotly_trackpad(dict_data["frequency"], dict_data["phase"], null, null, "allpass", "Allpass");
    },
  });
}

//IMAGE SLIDESHOW
function image_choice(x) {
  // console.log(x);
  // var val = document.getElementById("new-value").value=x;
  // console.log(val);
  // console.log(filters);
  // addValue()
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

image_count=11;
for (let i = 0; i < image_count; i++) {
  console.log(i);
  document
    .querySelector("#new-all-pass-coef" + i)
    .addEventListener("click", function () {
      image_choice(document.querySelector("#new-all-pass-coef" + i).value);
      console.log(document.querySelector("#new-all-pass-coef" + i).value);
    });
}
//   document
//     .querySelector("#new-all-pass-coef1")
//     .addEventListener("click", function () {
//       image_choice("3+5j");
//     });
// document
//   .querySelector("#new-all-pass-coef"+2)
//   .addEventListener("click", function () {
//     image_choice("2+0.2j");
//   });
// document
//   .querySelector("#new-all-pass-coef3")
//   .addEventListener("click", function () {
//     image_choice("0+3j");
//   });
// document
//   .querySelector("#new-all-pass-coef4")
//   .addEventListener("click", function () {
//     image_choice("7+1j");
//   });
// document
//   .querySelector("#new-all-pass-coef5")
//   .addEventListener("click", function () {
//     image_choice("6+0.5j");
//   });


function myFunction() {
  console.log("focused");
  // console.log(document.activeElement.id);
  selectedid = document.activeElement.id;
}

function change() {
  console.log("change");

}
/******************************************************* */
/**********************Graph**************************** */
/******************************************************* */


// makePlotly_trackpad(x_value, y_value, [x_length, x_length + 300], [0, 200], "allpass", "input");
// makePlotly_trackpad(x_value, y_value, [x_length, x_length + 300], [0, 200], "total-phase", "output");

makePlotly_trackpad([0, 1, 2, 3, 4, 4], [0, 1, 2, 3, 4, 4], null, null, "allpass", "input");
makePlotly_trackpad([0, 1, 2, 3, 4, 4], [0, 1, 2, 3, 4, 4], null, null, "total-phase", "output");
// console.log(CSV)