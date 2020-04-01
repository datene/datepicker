const datetimepickerShell = document.querySelector(".datetimepicker");
const datetimepickerInput = datetimepickerShell.querySelector("input");
const dateWrapper = datetimepickerShell.querySelector(".date-wrapper");
const allDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let clicked = false;
let selectedMonth = new Date().getMonth();

const generateGrid = () => {
  const firstDayOfCurrentMonth = new Date(
    new Date().getFullYear(),
    selectedMonth,
    1
  );
  const lastDayOfCurrentMonth = new Date(
    new Date().getFullYear(),
    selectedMonth + 1,
    0
  );
  allDates = [];

  for (let i = 0; i < lastDayOfCurrentMonth.getDate(); i++) {
    const date = new Date(new Date().getFullYear(), selectedMonth, i + 1);
    allDates.push({
      isDay: true,
      date: date,
      day: allDays[date.getDay()]
    });
  }

  return padGrid(allDates);
};

const padGrid = allDates => {
  if (allDates[0].day !== "Sunday") {
    const day = allDates[0].date.getDay();
    for (let i = 0; i < day; i++) {
      allDates.unshift({
        isDay: false
      });
    }
  }
  if (allDates[allDates.length - 1] !== "Saturday") {
    const day = 7 - allDates[allDates.length - 1].date.getDay();
    for (let i = 0; i < day - 1; i++) {
      allDates.push({
        isDay: false
      });
    }
  }
  return allDates;
};

const handleDateSelect = event => {
  if (!event.currentTarget.dataset.date) return;
  datetimepickerInput.value = new Date(
    JSON.parse(event.currentTarget.dataset.date)
  ).toLocaleDateString();
};

const hideDateWrapper = () => {
  dateWrapper.innerHTML = "";
  dateWrapper.classList.add("hidden");
};

const handleSwitchMonth = event => {
  hideDateWrapper();
  selectedMonth += Number.parseInt(event.currentTarget.dataset.direction);
  drawGrid();
};

const handleEnter = event => {
  drawGrid();
};

const drawGrid = () => {
  if (dateWrapper.innerHTML !== "") return;
  dateWrapper.classList.remove("hidden");
  const grid = generateGrid().map(dateObject => {
    const date = document.createElement("a");
    date.classList.add("date");
    date.appendChild(
      document.createTextNode(dateObject.isDay ? dateObject.date.getDate() : "")
    );
    date.addEventListener("click", handleDateSelect);
    if (dateObject.isDay) {
      date.dataset.date = JSON.stringify(dateObject.date);
    }
    return date;
  });
  drawNav();
  populateDayLegend();
  populateDays(grid);
};

const drawNav = () => {
  const previous = document.createElement("a");
  previous.innerHTML = "&larr;";
  previous.dataset.direction = -1;
  previous.addEventListener("click", handleSwitchMonth);

  const next = document.createElement("a");
  next.innerHTML = "&rarr;";
  next.dataset.direction = 1;
  next.addEventListener("click", handleSwitchMonth);

  const nav = document.createElement("div");

  const title = document.createElement("p");
  const monthObject = new Date(
    new Date().getFullYear(),
    selectedMonth,
    new Date().getDate()
  );
  title.appendChild(
    document.createTextNode(
      `${monthObject.toLocaleString("default", {
        month: "long"
      })} ${monthObject.getFullYear()}`
    )
  );
  nav.classList.add("nav");
  nav.insertAdjacentElement("beforeend", previous);
  nav.insertAdjacentElement("beforeend", title);
  nav.insertAdjacentElement("beforeend", next);
  dateWrapper.insertAdjacentElement("beforeend", nav);
};

const populateDayLegend = () => {
  allDays.forEach(day => {
    dateWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div class="legend">
            ${day.substr(0, 3)}
        </div>
        `
    );
  });
};

const populateDays = grid => {
  grid.forEach(date => {
    dateWrapper.insertAdjacentElement("beforeend", date);
  });
};

const handleLeave = event => {
  event.path.includes(datetimepickerShell)
    ? (clicked = true)
    : (clicked = false);
  if (!clicked) {
    hideDateWrapper();
  }
};

datetimepickerInput.addEventListener("focus", handleEnter);
document.addEventListener("click", handleLeave);
