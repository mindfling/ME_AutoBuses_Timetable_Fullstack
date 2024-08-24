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

const createRow = (bus) => {
  const { id, busNumber, startPoint, endPoint, firstDepartureTime } = bus;

  const row = document.createElement("tr");
  row.classList = "tr";

  const cellNumber = document.createElement("td");
  cellNumber.classList = "route-number";
  cellNumber.textContent = busNumber;
  cellNumber.title = `Номер маршрута ${busNumber}`

  const cellRoute = document.createElement("td");
  cellRoute.classList.add('route')
  cellRoute.textContent = `${startPoint} -> ${endPoint}`;
  cellRoute.title = `Маршрут автобуса от ${startPoint} до ${endPoint}`;
  
  const cellDate = document.createElement("td");
  cellDate.classList.add('date')
  const todayDate = new Date().toLocaleDateString(); // todo
  cellDate.textContent = todayDate;
  cellDate.title = `Дата отправления ${todayDate}`;
  
  const cellTime = document.createElement("td");
  cellTime.classList.add('departure-time')
  cellTime.textContent = firstDepartureTime;
  cellTime.title = `Начало движения в ${firstDepartureTime}`;

  row.append(cellNumber, cellRoute, cellDate, cellTime);
  return row;
};

// ***
(async () => {
  console.log("async запрос");
  const buses = await getTimetable();
  console.log("buses: ", buses);

  const rows = buses.map((bus) => createRow(bus));

  result.append(...rows);
})();