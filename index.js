const router = (id1, id2, id3) => {
  document.getElementById(id1).style.display = "none";
  document.getElementById(id2).style.display = "none";
  document.getElementById(id3).style.display = "flex";
  if(document.getElementById('time-table-head').innerHTML==='View Time Table' && document.getElementById('edit-time-table').style.display === 'flex' ){
      document.getElementById('edit-time-table').style.display='none'
      // console.log('hello')
      document.getElementById('week-table').style.display='flex'
      document.getElementById('time-table-head').innerHTML='Time Table'

  }
  
  if (document.getElementById('qrcode').style.display != 'none') {
    // showAlert('Started Camera');
    // startCamera();
    checkTimeAndExecute()
    document.getElementById('space').style.display = 'flex';
    document.getElementById('body').style.background = '#002233';
    document.getElementById('body').style.overflow = 'hidden';
    document.getElementById('navbar').style.background = 'black';
    document.getElementById('body').style.flexDirection = 'column';
    document.getElementById('body').style.position = 'relative';
    document.getElementById('body').style.display = 'flex';
    document.getElementById('body').style.backgroundPosition = 'center';
    document.getElementById('body').style.backgroundSize = 'cover';
    document.getElementById('wrapper').style.display = 'flex';
  }
  else if (document.getElementById('student-attendance').style.display === 'flex') {
    stopCamera();
    document.getElementById('body').style.overflow = 'none';
    document.getElementById('space').style.display = 'none';
    document.getElementById('navbar').style.background = '#002233';
    document.getElementById('body').style.background = 'white';
    document.getElementById('body').style.flexDirection = 'column';
    document.getElementById('body').style.position = 'relative';
    document.getElementById('body').style.display = 'flex';
    document.getElementById('body').style.backgroundPosition = 'center';
    document.getElementById('body').style.backgroundSize = 'cover';
    document.getElementById('wrapper').style.display = 'none';
  }
  else {
    stopCamera();
    document.getElementById('space').style.display = 'none';
    document.getElementById('wrapper').style.display = 'none';
    document.getElementById('navbar').style.background = 'none';
    document.getElementById('body').style.background = 'url("bgm.jpg") no-repeat';
    document.getElementById('body').style.flexDirection = 'column';
    document.getElementById('body').style.position = 'relative';
    document.getElementById('body').style.display = 'flex';
    document.getElementById('body').style.backgroundPosition = 'center';
    document.getElementById('body').style.backgroundSize = 'cover';
  }
};

let student = [];

function updateData(reg_no) {
  console.log('updating')
  const table = document.querySelector("#student-attendance table tbody");
  const newRow = document.createElement("tr");
  let subject = CaptureSubject()
  newRow.innerHTML = `
    <td class=heads>${student.length}</td>
    <td class=heads>${new Date().toISOString().split("T")[0]}</td>
    <td class=heads>${new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}</td class=heads>
    <td class=heads>${subject}</td>
    <td class=heads>Present</td>
    <td class=heads>${reg_no}</td>
  `;
  table.appendChild(newRow);
}
let timeout;
function showAlert(message) {
  let alertContainer = document.getElementById("alert-container");
  alertContainer.style.display = "flex";
  alertContainer.classList.add("slide-in");

  const alertElem = document.createElement("div");
  alertElem.className = "alert-dismissible";
  alertElem.innerHTML = `
    <button type="button" id="close" class='close' onclick="closeAlert()" data-dismiss="alert"> X </button>
    <div class='used'>
    ${message}
    </div>
  `;

  const container = document.getElementById("alert-container");
  let child = document.querySelectorAll('.close');
  if (child.length === 0) {
    container.appendChild(alertElem);
  }
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    closeAlert();
  }, 1300);
}

function closeAlert() {
  let alertContainer = document.getElementById("alert-container");
  alertContainer.classList.remove("slide-in");
  alertContainer.classList.add("slide-out");
  setTimeout(function () {
    alertContainer.style.display = "none";
    alertContainer.innerHTML = "";
    alertContainer.classList.remove("slide-out");
  }, 500);
}

let scanner = null;

function initializeScanner() {
  scanner = new Instascan.Scanner({
    video: document.getElementById("scanner"),
  });

  scanner.addListener("scan", function (content) {
    // console.log("QR Code content:", content);
    // let len = content.length
    // let content_int = parseInt(content)
    for (let i = 0; i < content.length; i++) {
      let str = content[i];
    
      if (!isNaN(str)) {
        if (!student.includes(content)) {
          student.push(content);
          showAlert(`Marked Attendance for Reg No: ${content}`);
          updateData(content);
        } 
        else {
          showAlert(`Attendance already marked for Reg no : ${content}`);
        }
      }else{
        showAlert("Invalid Qr Code !! ")
      }
    }

  });
}

function startCamera() {
  if (scanner === null) {
    initializeScanner();
  }

  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[0]); // Use the first available camera
      } else {
        console.error("No cameras found.");
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function stopCamera() {
  if (scanner !== null) {
    scanner.stop();
  }
}

$('.dropdown').click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find('.dropdown-menu').slideToggle(300);
});

$('.dropdown').focusout(function () {
  $(this).removeClass('active');
  $(this).find('.dropdown-menu').slideUp(300);
});

$('.dropdown .dropdown-menu li').click(function () {
  $(this).parents('.dropdown').find('span').text($(this).text());
  $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});

function getDropdownValues() {
  var selectedDay = $("#dayDropdown").siblings(".select").find("span").text();
  var selectedPeriod = $("#periodDropdown").siblings(".select").find("span").text();

  console.log("Selected Day: " + selectedDay);
  console.log("Selected Period: " + selectedPeriod);
  editCell(selectedDay, selectedPeriod);
}

function editCell(selectedDay, selectedPeriod) {
  if (selectedDay === 'Select Day' && selectedPeriod === 'Select Period') {
    showAlert(' Select  Day and Period To Update Time Table ');
  } else if (selectedDay === 'Select Day') {
    showAlert(' Select  Day To Update Time Table ');
  }
  else if (selectedPeriod === 'Select Period') {
    showAlert(` Select Period To Update Time Table on ${selectedDay} `);
  }
  else if (selectedDay != 'Select Day' && selectedPeriod != 'Select Period') {
    let cellId = selectedDay + "-period-" + selectedPeriod;
    console.log(cellId);
    let cellContent = document.getElementById(cellId);
    let newValue = prompt("Enter the new value:", cellContent.innerText);
    newValue = capitalizeFirstLetter(newValue)
    if (newValue !== null) {
      cellContent.innerText = newValue;
    }
    // console.log('hello');
    showAlert(`Updated Successfully ${newValue} on ${selectedDay} - ${selectedPeriod} th period `);
  }
}

function EditTimeTable() {
  document.getElementById('week-table').style.display = 'none';
  document.getElementById('edit-time-table').style.display = 'flex';
  document.getElementById('space').style.display = 'flex';
  document.getElementById('time-table-head').innerHTML='View Time Table'
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const timeTable = [
  {
    startTime: '09:00',
    endTime: '09:10',
    func: startCamera
  },
  {
    startTime: '10:00',
    endTime: '10:15',
    func: startCamera
  },
  {
    startTime: '11:00',
    endTime: '11:25',
    func: startCamera
  },
  {
    startTime: '13:15',
    endTime: '13:25',
    func: startCamera
  },
  {
    startTime: '14:15',
    endTime: '14:25',
    func: startCamera
  },
  {
    startTime: '15:14',
    endTime: '24:00',
    func: startCamera
  },
  // Add more time entries as needed
];

function checkTimeAndExecute() {
  let [currentTime,day] = getCurrentTime_Day()
  let level = true
  for (const entry of timeTable) {
    const { startTime, endTime, func } = entry;
    console.log(isTimeInRange(currentTime,startTime,endTime))
    if (isTimeInRange(currentTime, startTime, endTime)) {
      level = false
      console.log('check')
      showAlert('Started Camera');
      func();
    } 
  }
  if(level!=false) {
    stopCamera();
    const nextTimeLine = getNextTimeLine();
    console.log(nextTimeLine)
    if (nextTimeLine) {
      showAlert(`Sorry! Camera Will Start At ${nextTimeLine.startTime}`);
    }
  }
}

function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function isTimeInRange(currentTime, startTime, endTime) {
  return currentTime >= startTime && currentTime <= endTime;
}

function getTimeValue(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}// Date().getTime()

function getNextTimeLine() {
  const currentTime = new Date();
  const currentTimeValue = currentTime.getTime();
  let minDifference = Infinity;
  let nextTimeLine = null;

  for (const entry of timeTable) {
    const { startTime } = entry;
    const startTimeValue = getTimeValue(startTime);
    const difference = startTimeValue - currentTimeValue;

    if (difference > 0 && difference < minDifference) {
      minDifference = difference;
      nextTimeLine = entry;
    }
  }

  return nextTimeLine;
}

const interval = setInterval(checkTimeAndExecute, 1000);

const lastEndTime = new Date(timeTable[timeTable.length - 1].endTime);
setTimeout(function() {
  clearInterval(interval);
}, lastEndTime - Date.now());

function getCurrentTime_Day() {
  let currentTime = new Date();
  var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var todayDayIndex = currentTime.getDay();
  var todayDay = daysOfWeek[todayDayIndex];
  let formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return [formattedTime , todayDay]
}
function CaptureSubject(){
  let [current_time,day] = getCurrentTime_Day()
  if (isTimeInRange(current_time,'09:00','10:00')) {
    period_no = '1'
  } 
  else if (isTimeInRange(current_time,'10:00','11:00')) {
    period_no = '2'
  } 
  else if (isTimeInRange(current_time,'11:15','12:15')) {
    period_no = '3'
  } 
  else if (isTimeInRange(current_time,'13:00','14:00')) {
    period_no = '4'
  } 
  else if (isTimeInRange(current_time,'13:00','17:00')) {
    period_no = '5'
  } 
  else {
    period_no = '6'
  }
  day = capitalizeFirstLetter(day)
  return document.getElementById(`${day}-period-${period_no}`).innerHTML
}

function tableToJsonString() {
  const table = document.querySelector('.time_table');
  const rows = table.querySelectorAll('tr');
  const headers = Array.from(rows[0].querySelectorAll('.table-head'));

  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = Array.from(row.querySelectorAll('.table-head'));

    const rowData = {};
    for (let j = 0; j < headers.length; j++) {
      rowData[headers[j].textContent.trim()] = cells[j].textContent.trim();
    }

    data.push(rowData);
  }

  return JSON.stringify(data);
}

// Example usage:
const tableJsonString = tableToJsonString();
function saveTimetableData(data) {
  localStorage.setItem('timetableData', JSON.stringify(data));
}

// Function to retrieve the timetable data from local storage
function getTimetableData() {
  const data = localStorage.getItem('timetableData');
  return data ? JSON.parse(data) : null;
}
saveTimetableData(tableJsonString);

function populateTableFromStorage() {
  const timetableData = getTimetableData();

  if (timetableData) {
    const table = document.querySelector('.time_table');
    const rows = table.querySelectorAll('tr');
    const headers = Array.from(rows[0].querySelectorAll('.table-head'));

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll('.table-head'));

      const rowData = timetableData[i - 1];
      for (let j = 0; j < headers.length; j++) {
        const headerText = headers[j].textContent.trim();
        if (rowData.hasOwnProperty(headerText)) {
          cells[j].textContent = rowData[headerText];
        }
      }
    }
  }
}
populateTableFromStorage();
