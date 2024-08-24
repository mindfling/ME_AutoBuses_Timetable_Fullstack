console.log("%cmain hello", "color:#0e0;");

const result = document.querySelector("#rowsresult");
console.log("result: ", result);

const API_URL = "http://localhost:3000";
// const API_URL = "http://127.0.0.1:3000";

const getData = async (url) => {
  try {
    // const response = await fetch(url,  { mode: 'no-cors' }); // ???
    const response = await fetch(url, { mode: "cors" }); // ???

    if (!response.ok) {
      console.log("response is not ok");
      throw new Error("Ошибка при получении данных:" + error);
    }

    const data = await response.json();
    console.log("data: ", data);

    return data;
  } catch (error) {
    console.log("Ошибка при получении данных");
    console.warn(error);
  }
};

const getTimetable = async () => {
  const timetable = await getData(`${API_URL}/timetable`);
  return timetable;
};

const createRow = (bus, index) => {
  const {
    id,
    busNumber,
    startPoint,
    endPoint,
    firstDepartureTime,
    frequencyMinutes,
  } = bus;

  const row = document.createElement("tr");
  row.classList = "tr";

  const cellIndex = document.createElement('td');
  cellIndex.classList.add('text-secondary')
  cellIndex.textContent = index;

  const cellID = document.createElement('td');
  cellID.classList = 'id';
  cellID.textContent = id;
  cellID.title = 'id of bus is ' + id;

  const cellNumber = document.createElement("td");
  cellNumber.classList = "route-number";
  cellNumber.classList.add("text-end");
  cellNumber.innerHTML = `<span class="text-secondary">№</span> ${busNumber}`;
  cellNumber.title = `Номер маршрута ${busNumber}`;

  const cellRoute = document.createElement("td");
  cellRoute.classList.add("route");
  cellRoute.classList.add("text-start");
  cellRoute.classList.add("text-white");
  // cellRoute.textContent = `${startPoint} -> ${endPoint}`;
  cellRoute.innerHTML = `<span class="text-secondary">от</span> ${startPoint} <span class="text-secondary">до</span> ${endPoint}`;
  cellRoute.title = `Маршрут автобуса от ${startPoint} до ${endPoint}`;

  const cellDate = document.createElement("td");
  cellDate.classList.add("date");
  const todayDate = new Date().toLocaleDateString(); // todo
  cellDate.textContent = todayDate;
  cellDate.title = `Дата отправления ${todayDate}`;

  const cellTime = document.createElement("td");
  cellTime.classList.add("departure-time");
  cellTime.textContent = firstDepartureTime;
  cellTime.title = `Начало движения в ${firstDepartureTime}`;

  const cellInterval = document.createElement('td');
  cellInterval.classList.add('interval');
  cellInterval.textContent = `${frequencyMinutes} минут`;
  cellInterval.title = `Интервал движения автобуса ${frequencyMinutes} минут`;
  
  row.append(cellIndex, cellID, cellNumber, cellRoute, cellDate, cellTime, cellInterval);
  return row;
};

// ***
(async () => {
  console.log("async запрос");
  const buses = await getTimetable();
  console.log("buses: ", buses);

  const rows = buses.map((bus, i) => createRow(bus, i));

  result.append(...rows);
})();
