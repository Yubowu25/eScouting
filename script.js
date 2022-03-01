dataValues = [false, 0, 0, 0, 0, 0, 0, false, 0, 0, 0, false, "", false, "", ""];
dataLabels = ["Taxi", "Auto High", "Auto Low", "Auto Missed", "Tele High", "Tele Low", "Tele Missed", "Attempted Climb", "Climb Level", "Climb Time", "Defence Time", "Penalty", "Yeet", "Oof", "QATA", "Drivetrain Type"];
dataLabelsAlt = ["auto3", "auto0", "auto2", "auto1", "teleop0", "teleop2", "teleop1", "irrelevant", "irrelevant", "endgame3", "teleop3", "Penalty"]
dataStorage = [];
autoPos = [0, 0];
phase = "before";
teamNum = 0;
matchNum = "";

var img = new Image();
img.src = 'field.png';
var canvas = document.getElementById('fieldCanvas');
var ctx = canvas.getContext('2d');
img.onload = function () {
  fill_canvas(img);
}
function returnToEditScreen(){
  document.getElementById("qataPage").style.display = "flex";
  document.getElementById("qrscreen").style.display = "none";
}
function gameReset(){
  if (confirm("Reset the game?")) {
    reset();
    transitionPage(3);
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("startPageMatch").value--;
  } else {
    return;
  }
}
function reset() {
  dataValues = [false, 0, 0, 0, 0, 0, 0, false, 0, 0, 0, false, "", false, "", ""];
  autoPos = [0, 0];
  phase = "before";
  defenseBool = false;
  climbBool = false;
  teamNum = 0;
  matchNum = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fill_canvas(img);
}

function startTimer() {
  timer = 150; // should be 150
  phase = "auto";
  delay = true;
  updateTimer();
  timerInt = setInterval(updateTimer, 1000); //<----- should be 1000

  //grab team number and match number and add them to the infobar
  teamNum = document.getElementById('startPageTeam').value;
  matchNum = document.getElementById('startPageMatch').value;
  document.getElementById('teamDisplay').innerHTML = "Team: " + teamNum;
  document.getElementById('matchDisplay').innerHTML = "Match: " + matchNum;

  /* //game canvas thingy
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  img.src = '/field.png';
  fill_canvas(img);
  */
}
function updateTimer() {
  if (timer == 135 && delay) {
    timer = 136; //136??? check delay
    delay = !delay
  }
  if (timer == 135 && !delay) {
    phase = "teleop"
    transitionPage("tele")
    document.getElementById("counterLabel0").innerHTML = 0;
    document.getElementById("counterLabel1").innerHTML = 0;
    document.getElementById("counterLabel2").innerHTML = 0;
    document.getElementById("counterLabel3").innerHTML = 0;
  }
  if (timer == 30) {
    phase = "endgame";
    transitionPage("endgame")
  }
  if (timer == 0) {
    document.getElementById("timerDisplay").innerHTML = timer;
    console.log("Game over");
    timer -= 1;
    phase = "after";
    transitionPage("after")
  }
  if (timer > 0) {
    document.getElementById("timerDisplay").innerHTML = timer;
    console.log(timer);
    timer -= 1;
  }
  //console.log(phase);
}

defenseBool = false;
climbBool = false;
setInterval(updateDataTimer, 1000);
function updateDataTimer() { //updates climb and defense timers
  if (defenseBool == true && timer > 30) { // defense
    dataValues[10]++;
    document.getElementById("counterLabel3").innerHTML = dataValues[10];
  }
  if (climbBool == true && timer > 0) { // climb
    dataValues[9]++;
    document.getElementById("counterLabel3").innerHTML = dataValues[9];
  }
}

function getIndex(label) {
  return dataLabels.indexOf(label);
}

function setButtonLabel(index) { // finish this later
  console.log("label set");
  document.getElementById('containerTopLeft').innerHTML = dataLabels[index];
}

let colorState = "r"
document.getElementById("startPageColor").addEventListener("click", function () {
  if (colorState == "r") {
    document.getElementById("startPageColor").style.backgroundColor = "#73C2FB";
    colorState = "b"
  }
  else {
    document.getElementById("startPageColor").style.backgroundColor = "#FF6961";
    colorState = "r"
  }
});

function fill_canvas(img) {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
}

function autoClick(evt) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fill_canvas(img);
  var pos = getMousePos(canvas, event);
  if (colorState == "b") {
    ctx.strokeStyle = "blue";
  } else {
    ctx.strokeStyle = "red";
  }
  ctx.fillStyle = "#ffd1dc";
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  autoPos[0] = Math.round(pos.x);
  autoPos[1] = Math.round(pos.y);
  console.log("canvas clicked, x: " + autoPos[0] + ", y: " + autoPos[1]);
}


/*
function gameClick(evt) {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  //fill_canvas(img);
  var pos = getMousePos(canvas, event);
  if (colorState == "b") {
    ctx.strokeStyle = "blue";
  } else {
    ctx.strokeStyle = "red";
  }
  ctx.fillStyle = "#ffd1dc";
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  //add some method to save the data
  //console.log("canvas clicked, x: " + autoPos[0] + ", y: " + autoPos[1]);
}
*/
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
}

state = false;
hotKeys = true;
function toggleNotes() {
  if (state) {
    document.getElementById("qata").style.display = "flex";
    //document.getElementById("gameCanvas").style.display = "flex";
    document.getElementById("qata").focus();
    hotKeys = false;
  } else {
    dataValues[14] = document.getElementById("qata").innerText;
    document.getElementById("qata").style.display = "none";
    //document.getElementById("gameCanvas").style.display = "none";
    hotKeys = true;
  }
  state = !state;
}
function generateTable() {
  console.log("table generated nya~~~")
  var body = document.getElementById("tableContainer");

  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");


  for (var i = 0; i < 11; i++) {
    // creates a table row
    var row = document.createElement("tr");
    row.setAttribute('onclick', 'editTable(' + i + ')')
    row.setAttribute('id', 'tr' + i + '')

    for (var j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      if (j == 0) {
        tableContent = dataLabels[i];
      }
      if (j == 1) {
        tableContent = dataValues[i];
      }
      var cell = document.createElement("td");
      var cellText = document.createTextNode(tableContent);
      cell.appendChild(cellText);
      if (j == 0) {
        cell.setAttribute('id', 'qataPageCellID' + i + '')
        cell.setAttribute('class', 'qataPageCellID')
      }
      if (j == 1) {
        cell.setAttribute('id', 'qataPageCellNumber' + i + '')
        cell.setAttribute('class', 'qataPageCellNumber')
      }
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("id", "qataPageTable")
}

function transitionPage(i) {
  if (i == 0) { //starting page to standby
    console.log("redirecting to standby/ready page nya~~");
    document.getElementById("startPage").style.display = "none";
    document.getElementById("readyPage").style.display = "inherit";
  }
  if (i == 1) { //standby to main page
    console.log("redirecting to main page uwu~~");
    document.getElementById("readyPage").style.display = "none";
    document.getElementById("mainPage").style.display = "inherit";
    document.getElementById("infoBar").style.display = "flex";
    document.getElementById("containerBottomRight").childNodes[0].nodeValue = "Auto Mobility";
    document.getElementById("counterLabel3").innerHTML = "false";
    document.getElementById("resetButton").style.display = "inherit";
    startTimer()
  }
  if (i == "tele") { //auto to tele label change
    document.getElementById("containerBottomRight").childNodes[0].nodeValue = "Defense Timer";
    document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    document.getElementById("counterLabel3").innerHTML = "0";
  }
  if (i == "endgame") {
    document.getElementById("containerBottomRight").childNodes[0].nodeValue = "Climb Timer";
    document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    document.getElementById("counterLabel3").innerHTML = "0";
  }
  if (i == "after") { //main to qata
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("qataPage").style.display = "flex"
    document.getElementById("qataPageGeneral").value = document.getElementById("qata").value;
    document.getElementById("qata").style.display = "none";
    console.log("qata page pulled nya~")
    document.getElementById("resetButton").style.display = "none";
    //check if climb was attempted
    //console.log("climb time: " + dataValues[9]);
    if (dataValues[9] > 0) {
      dataValues[7] = true;
    } else {
      dataValues[7] = false;
    }
    generateTable();
    document.getElementById("qataPageCellNumber7").innerHTML = dataValues[7];
  }
  if (i == 2) { //qata to qr screen <--------------------------------- END SCREEN!
    document.getElementById("qataPage").style.display = "none";
    document.getElementById("qrscreen").style.display = "inherit";

    //pull value from oof
    var oof = document.getElementById("qataPageSwitch3");
    dataValues[13] = oof.checked;
    console.log(dataValues[13]);
    //pull value from penalty
    var penalty = document.getElementById("qataPageSwitch2");
    dataValues[11] = penalty.checked;
    console.log(dataValues[11]);
    //pull value from climb success
    var climbS = document.getElementById("qataPageSwitch0");
    //pull value from climb attempt
    var climbA = document.getElementById("qataPageSwitch2");
    //pull value from drive train
    dataValues[15] = document.getElementById("qataPageDT").value.replace(/\n/g, ' ').replace(/\,/g, ';');
    //pull value from yeet distance
    dataValues[12] = document.getElementById("qataPageYD").value.replace(/\n/g, ' ').replace(/\,/g, ';');
    //pull value from general qata
    dataValues[14] = document.getElementById("qataPageGeneral").value.replace(/\n/g, ' ').replace(/\,/g, ';');

    console.log(dataValues);
    for (let i = 0; i < dataValues.length; i++) { //convert boolean to 1/0
      console.log(typeof dataValues[i])
      if (typeof dataValues[i] == "boolean") {
        if (dataValues[i] == true) {
          dataValues[i] = 1;
        } else {
          dataValues[i] = 0;
        }
      }
    }
    console.log(dataValues);
    var output = dataValues.slice(0, 11).concat(autoPos).concat(dataValues.slice(11)).toString();
    console.log(output);

    //generate qr code
    var typeNumber = 0;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(output);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag();

    //post data string
    document.getElementById("dataString").innerHTML = output;

  }
  if (i == 3) { //qr to start page
    if (confirm("Reset the game?")) {
      //save data string to storage
      console.log(dataValues);
      var output = dataValues.slice(0, 11).concat(autoPos).concat(dataValues.slice(11)).toString();
      console.log(output);
      dataStorage.push(matchNum + "," + teamNum + "," + output);
      console.log(dataStorage);
      
      document.getElementById("qrscreen").style.display = "none";
      document.getElementById("startPage").style.display = "inherit";
      document.getElementById("infoBar").style.display = "none";
      document.getElementById("tableContainer").innerHTML = "";
      console.log(dataValues);
      reset();
  
      //reset start page fields
      document.getElementById("startPageTeam").value = "";
      document.getElementById("startPageMatch").value++;
  
      document.getElementById("qataPageInput").innerHTML = "[N]"
      document.getElementById("qataPageSwitch2").checked = false;
      document.getElementById("qataPageSwitch3").checked = false;
  
      document.getElementById("qata").value = "";
      document.getElementById("qataPageDT").value = "";
      document.getElementById("qataPageYD").value = "";
  
      document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.1)";

      //reset main page labels
      document.getElementById("counterLabel0").innerHTML = "0";
      document.getElementById("counterLabel1").innerHTML = "0";
      document.getElementById("counterLabel2").innerHTML = "0";
      document.getElementById("counterLabel3").innerHTML = "false";
      
  
      clearInterval(timerInt);
      console.log("restarting");
    } else {
      return;
    }
  }
}

climbLevel = 0
climbLabel = ["None", "Low", "Mid", "High", "Traversal"]
climbPoints = 0
function cLevel(mode) {
  if (mode == 0) {
    climbLevel = climbLevel + 1;
  } else {
    climbLevel = climbLevel - 1;
  }
  if (climbLevel > 4) {
    climbLevel = 0;
  }
  if (climbLevel < 0) {
    climbLevel = 4;
  }
  document.getElementById("qataPageInput").innerHTML = "[" + climbLabel[climbLevel][0] + "]";
  dataValues[8] = climbLevel;
  document.getElementById("qataPageCellNumber8").innerHTML = climbLevel;
}

function clickEvent(boxNumber, type) {
  let clickID = phase + boxNumber.toString()
  console.log(clickID);
  if (clickID == "teleop3") {
    defenseBool = !defenseBool
    console.log("Defense: " + defenseBool);
    if (defenseBool) {
      document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    } else {
      document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    }
    return;
  }
  if (clickID == "auto3") {
    dataValues[0] = !dataValues[0]
    document.getElementById("counterLabel3").innerHTML = dataValues[0];
    if (dataValues[0]) {
      document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    } else {
      document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    }
    return;
  }
  if (clickID.startsWith("endgame")) {
    if (clickID == "endgame3") {
      climbBool = !climbBool;
      console.log("Climb: " + climbBool);
      if (climbBool) {
        document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      } else {
        document.getElementById("containerBottomRight").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      }
      return;
    }
    else {
      clickID = "teleop" + boxNumber.toString()
      console.log(clickID + "converted")
    }
  }

  let clickLocation = dataLabelsAlt.indexOf(clickID)
  let dataType = typeof dataValues[clickLocation];
  if (dataType == "boolean") {
    dataValues[clickLocation] = !dataValues[clickLocation]
  }
  if (dataType == "number" && type == 1) {
    dataValues[clickLocation]--;
  } else if (dataType == "number") {
    dataValues[clickLocation]++;
  }

  //update the counter
  document.getElementById("counterLabel" + boxNumber.toString()).innerHTML = dataValues[clickLocation];
  console.log(dataValues);
}

//hotkeys switch
window.addEventListener('keydown', function (keystroke) {
  if (hotKeys) {
    switch (keystroke.key) {
      case 'd': //low
        clickEvent(2);
        console.log("low")
        break;
      case 'D': //subtract low
        clickEvent(2, 1);
        console.log("nya~")
        break;
      case 'f': //high
        clickEvent(0);
        console.log("high")
        break;
      case 'F': //subtract high
        clickEvent(0, 1);
        console.log("nya~")
        break;
      case 'j': //missed
        clickEvent(1);
        console.log("missed")
        break;
      case 'J': //subtract missed
        clickEvent(1, 1);
        console.log("nya~")
        break;
      case 'k': //timers and auto mobility
        if (phase == "auto") {
          clickEvent(3);
          console.log("auto nya")
        }
        if (phase == "teleop") {
          //defenseBool = !defenseBool;
          clickEvent(3);
          console.log("tele nya")
        }
        if (phase == "endgame") {
          //climbBool = !climbBool;
          clickEvent(3);
          console.log("avengers endgam nya")
        }
        break;
      case 'K':
        clickEvent(3);
        console.log("other button")
        break;
      case 'Enter': //enter testing
        //clickEvent(3, 1);
        console.log("entered");
        if (phase == "before" && document.getElementById("startPage").style.display == "none") {
          transitionPage(1);
          console.log("starting");
        }
        break;
    }
  }
  if ((keystroke.key == 'Alt') && (phase != "after")) {
    toggleNotes();
  }
  //console.log(keystroke.key)
}, false);

let currentlyEditing = 0
function editTable(i) {
  for (let j = 0; j < 11; j++) {
    document.getElementById("tr" + j).style.color = "#999999";
  }
  document.getElementById("tr" + i).style.color = "#ffd1dc";
  currentlyEditing = i;
}
function edit(state) {
  if (state == 0) {
    let dataType = typeof dataValues[currentlyEditing];
    if (dataType == "boolean") { dataValues[currentlyEditing] = !dataValues[currentlyEditing] }
    if (dataType == "number" && currentlyEditing == 8) {
      cLevel(0);
    } else if (dataType == "number") {
      dataValues[currentlyEditing]++
    }
  }
  if (state == 1) {
    let dataType = typeof dataValues[currentlyEditing];
    if (dataType == "boolean") { dataValues[currentlyEditing] = !dataValues[currentlyEditing] }
    if (dataType == "number" && currentlyEditing == 8) {
      cLevel(1);
    } else if (dataType == "number") {
      dataValues[currentlyEditing]--;
    }
  }
  document.getElementById("qataPageCellNumber" + currentlyEditing).innerHTML = dataValues[currentlyEditing];
}
