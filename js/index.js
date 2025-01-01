let nowEditPos = -1;
// localStorage.clear();
function renderDate() {
  let year = document.getElementById("year").innerHTML;
  let month = document.getElementById("month").innerHTML - 1;
  let day = new Date(Number(year), Number(month) + 1, 0).getDate();
  let date = new Date(year, month, 1);
  let firstWeekDay = date.getDay();
  // let insert = document.getElementsByClassName("insert")[0];
  // let clickHandler = (e) => {
  //   document.getElementById("date").value = e.currentTarget.allDate;
  //   insert.style.display = "block";
  // };
  firstWeekDay--;
  if (firstWeekDay === -1) firstWeekDay = 6;
  let dayELe = document.getElementsByClassName("day");
  let origin = 1;
  // for (let i = 0; i < dayELe.length; i++) {
  //   dayELe[i].removeEventListener("click", clickHandler, false);
  // }
  for (let i = 0; i < firstWeekDay; i++) {
    dayELe[i].style.opacity = "0";
  }
  for (let i = firstWeekDay; i <= firstWeekDay + day - 1; i++) {
    let date = origin;
    let allDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
    dayELe[i].innerHTML = `<p>${date}</p>`;
    dayELe[i].style.display = "block";
    dayELe[i].style.opacity = "1";

    let toDoArr = findToDo(allDate);
    if (toDoArr.length) {
      for (let j = 0; j < toDoArr.length; j++) {
        dayELe[i].innerHTML += `<div data-pos="${
          toDoArr[j][1]
        }" class="todoList" style="background-color:${
          toDoArr[j][0].backgroundColor
        }">
        <p>${toDoArr[j][0].todo}</p>
        <p>${toDoArr[j][0].startTime + "~" + toDoArr[j][0].endTime}</p>
        </div>
        `;
      }
      // } else {
      //   dayELe[i].allDate = allDate;
      //   dayELe[i].addEventListener("click", clickHandler, false);
    }
    origin++;
  }
  for (var i = firstWeekDay + day; i < dayELe.length && i % 7 !== 0; i++) {
    dayELe[i].style.display = "block";
    dayELe[i].style.opacity = "0";
  }
  for (i; i < dayELe.length; i++) {
    dayELe[i].style.display = "none";
  }
}

function insertToDo(arr, insertData) {
  if (!arr.length || arr[0].date > insertData.date) {
    arr.unshift(insertData);
    return;
  }
  if (arr[arr.length - 1].date < insertData.date) {
    arr.push(insertData);
    return;
  }
  let start = 0,
    end = arr.length - 1,
    middle;
  while (1) {
    middle = Math.floor((start + end) / 2);
    if (insertData.date > arr[middle].date) {
      start = middle + 1;
      continue;
    }
    if (arr[middle - 1] && insertData.date < arr[middle - 1].date) {
      end = middle - 1;
      continue;
    }
    console.log(arr[middle]);
    for (let i = middle; arr[i] && arr[i].date == insertData.date; i++) {
      if (
        (insertData.startTime >= arr[i].startTime &&
          insertData.startTime < arr[i].endTime) ||
        (insertData.endTime > arr[i].startTime &&
          insertData.endTime <= arr[i].endTime) ||
        (insertData.startTime <= arr[i].startTime &&
          insertData.endTime >= arr[i].endTime)
      ) {
        alert(
          arr[i].date +
            " " +
            arr[i].startTime +
            "~" +
            arr[i].endTime +
            " 已被預約"
        );
        return;
      }
    }
    for (let i = middle - 1; arr[i] && arr[i].date == insertData.date; i--) {
      if (
        (insertData.startTime >= arr[i].startTime &&
          insertData.startTime < arr[i].endTime) ||
        (insertData.endTime > arr[i].startTime &&
          insertData.endTime <= arr[i].endTime) ||
        (insertData.startTime <= arr[i].startTime &&
          insertData.endTime >= arr[i].endTime)
      ) {
        alert(
          arr[i].date +
            " " +
            arr[i].startTime +
            "~" +
            arr[i].endTime +
            " 已被預約"
        );
        return;
      }
    }

    for (
      var i = middle;
      arr[i] &&
      arr[i].date == insertData.date &&
      arr[i].startTime < insertData.startTime;
      i++
    );
    for (
      ;
      arr[i - 1] &&
      arr[i - 1].date == insertData.date &&
      arr[i - 1].startTime > insertData.startTime;
      i--
    );

    arr.splice(i, 0, insertData);
    // alert(arr);
    return;
  }
}

function findToDo(findDate) {
  let arr = JSON.parse(localStorage.getItem("toDo"))
    ? JSON.parse(localStorage.getItem("toDo"))
    : [];
  let start = 0,
    end = arr.length - 1,
    middle;
  let ans = [];
  while (1) {
    if (start > end) {
      return ans;
    }
    middle = Math.floor((start + end) / 2);
    if (findDate < arr[middle].date) {
      end = middle - 1;
      continue;
    }
    if (findDate > arr[middle].date) {
      start = middle + 1;
      continue;
    }

    ans.push([arr[middle], middle]);
    for (let i = middle - 1; arr[i] && findDate == arr[i].date; i--) {
      ans.unshift([arr[i], i]);
    }
    for (let i = middle + 1; arr[i] && findDate == arr[i].date; i++) {
      ans.push([arr[i], i]);
    }
    return ans;
  }
}

function submit() {
  //localStorage.clear();
  if (!document.getElementById("date").value) {
    alert("請輸入日期");
  } else if (
    !document.getElementById("startTime").value ||
    !document.getElementById("endTime").value
  ) {
    alert("請輸入起始與結束時間");
  } else if (
    document.getElementById("startTime").value >=
    document.getElementById("endTime").value
  ) {
    alert("開始時間需早於結束時間");
  } else if (!document.getElementById("toDo").value) {
    alert("請輸入代辦事項");
  } else {
    let toDo = JSON.parse(localStorage.getItem("toDo"))
      ? JSON.parse(localStorage.getItem("toDo"))
      : [];

    let dateItem = {
      date: document.getElementById("date").value,
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      todo: document.getElementById("toDo").value,
      backgroundColor: document.getElementById("colorPicker").value,
    };
    insertToDo(toDo, dateItem);
    localStorage.setItem("toDo", JSON.stringify(toDo));
    // alert(localStorage.getItem("toDo"));
    let insert = document.getElementsByClassName("insert")[0];
    insert.style.display = "none";
    renderDate();
  }
}

function edit() {
  if (nowEditPos == -1) {
    edit.style.display = "none";
    return;
  }
  let edit = document.querySelector(".edit");
  edit.style.display = "none";
  let toDo = JSON.parse(localStorage.getItem("toDo"))
    ? JSON.parse(localStorage.getItem("toDo"))
    : [];
  let newDate = {
    date: document.getElementById("eDate").value,
    startTime: document.getElementById("eStartTime").value,
    endTime: document.getElementById("eEndTime").value,
    todo: document.getElementById("eToDo").value,
    backgroundColor: document.getElementById("eColorPicker").value,
  };
  let newTodo = toDo.slice();
  newTodo.splice(nowEditPos, 1);
  insertToDo(newTodo, newDate);
  if (newTodo.length === toDo.length) {
    localStorage.setItem("toDo", JSON.stringify(newTodo));
    renderDate();
  }
}

function check(checkboxChange, position) {
  let startTime, endTime, checkbox;
  if (position === "edit") {
    checkbox = document.getElementById("eAllDay");
    startTime = document.getElementById("eStartTime");
    endTime = document.getElementById("eEndTime");
  } else {
    checkbox = document.getElementById("allDay");
    startTime = document.getElementById("startTime");
    endTime = document.getElementById("endTime");
  }
  if (checkboxChange) {
    if (checkbox.checked) {
      startTime.value = "00:00";
      endTime.value = "23:59";
    }
  }
  if (startTime.value === "00:00" && endTime.value === "23:59") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
}

window.addEventListener("load", () => {
  let nowDate = new Date();
  document.getElementById("year").innerText = 1900 + nowDate.getYear();
  document.getElementById("month").innerText = nowDate.getMonth() + 1;
  renderDate();
  if (localStorage.getItem("daybg")) {
    let day = document.querySelectorAll(".day");
    day.forEach(function (index) {
      index.style.backgroundColor = localStorage.getItem("daybg");
      document.querySelector(".colorPicker").value =
        localStorage.getItem("daybg");
    });
  }
  let leftArrow = document.querySelector(".leftArrow");
  let rightArrow = document.querySelector(".rightArrow");
  let newEvent = document.querySelector(".newEvent");
  let month = document.querySelector("#month");
  let year = document.querySelector("#year");
  // let search = document.getElementById("search");
  let cancel = document.getElementById("cancel");
  let startTime = document.getElementById("startTime");
  let endTime = document.getElementById("endTime");
  let eStartTime = document.getElementById("eStartTime");
  let eEndTime = document.getElementById("eEndTime");
  let allDay = document.getElementById("allDay");
  let eAllDay = document.getElementById("eAllDay");
  let editCancel = document.getElementById("editCancel");
  let editDelete = document.getElementById("editDelete");
  let colorPicker = document.querySelector(".colorPicker");

  leftArrow.addEventListener("click", () => {
    month.innerHTML--;
    if (month.innerHTML == 0) {
      month.innerHTML = 12;
      year.innerHTML--;
    }
    renderDate();
  });
  rightArrow.addEventListener("click", () => {
    month.innerHTML++;
    if (month.innerHTML == 13) {
      month.innerHTML = 1;
      year.innerHTML++;
    }
    renderDate();
  });
  newEvent.addEventListener("click", () => {
    let year = document.getElementById("year").innerHTML;
    let month = document.getElementById("month").innerHTML.padStart(2, "0");
    let insert = document.getElementsByClassName("insert")[0];
    document.getElementById("date").value = `${year}-${month}-01`;
    check(false, "new");
    insert.style.display = "block";
  });
  // search.addEventListener("click", () => {
  //   if (!document.getElementById("date").value) {
  //     alert("請輸入查詢日期");
  //     return;
  //   }
  //   let ans = findToDo(document.getElementById("date").value);
  //   alert(ans);
  //   console.log(ans);
  // });
  cancel.addEventListener("click", () => {
    let insert = document.getElementsByClassName("insert")[0];
    insert.style.display = "none";
  });
  startTime.addEventListener("input", () => {
    check(false, "new");
  });
  endTime.addEventListener("input", () => {
    check(false, "new");
  });
  eStartTime.addEventListener("input", () => {
    check(false, "edit");
  });
  eEndTime.addEventListener("input", () => {
    check(false, "edit");
  });
  allDay.addEventListener("input", () => {
    check(true, "new");
  });
  eAllDay.addEventListener("input", () => {
    check(true, "edit");
  });
  editCancel.addEventListener("click", () => {
    let insert = document.getElementsByClassName("edit")[0];
    insert.style.display = "none";
  });
  editDelete.addEventListener("click", () => {
    if (confirm("確定要刪除嗎？")) {
      let toDo = JSON.parse(localStorage.getItem("toDo"))
        ? JSON.parse(localStorage.getItem("toDo"))
        : [];
      // alert(nowEditPos);
      if (nowEditPos != -1) toDo.splice(nowEditPos, 1);
      nowEditPos = -1;
      localStorage.setItem("toDo", JSON.stringify(toDo));
      renderDate();
      let edit = document.querySelector(".edit");
      edit.style.display = "none";
    }
  });
  colorPicker.addEventListener("input", () => {
    let day = document.querySelectorAll(".day");
    day.forEach(function (item) {
      item.style.backgroundColor = colorPicker.value;
    });
    localStorage.setItem("daybg", colorPicker.value);
  });
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("todoList") ||
      e.target.parentElement.classList.contains("todoList")
    ) {
      let myDayEle;
      if (e.target.classList.contains("todoList")) {
        myDayEle = e.target;
      } else {
        myDayEle = e.target.parentElement;
      }
      nowEditPos = myDayEle.getAttribute("data-pos");
      let toDo = JSON.parse(localStorage.getItem("toDo"))
        ? JSON.parse(localStorage.getItem("toDo"))
        : [];
      document.getElementById("eDate").value = toDo[nowEditPos].date;
      document.getElementById("eStartTime").value = toDo[nowEditPos].startTime;
      document.getElementById("eEndTime").value = toDo[nowEditPos].endTime;
      document.getElementById("eToDo").value = toDo[nowEditPos].todo;
      document.getElementById("eColorPicker").value =
        toDo[nowEditPos].backgroundColor;
      check(false, "edit");
      toDo[nowEditPos];
      let edit = document.querySelector(".edit");
      edit.style.display = "block";
    }
  });
});
