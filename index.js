import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { DateTime } from "luxon";
const __filename = fileURLToPath(import.meta.url); // ??? в модулях нужно отдельно указывать
const __dirname = dirname(__filename); // ??? в модулях нужно отдельно указывать

const port = 3000;
const LOCAL = "http://localhost";
const URL = `${LOCAL}:${port}`;

// * загружаем всё расписание
const loadBuses = async () => {
  const data = await readFile(path.join(__dirname, "buses.json"), {
    encoding: "utf-8",
  });
  return JSON.parse(data);
};

const getNextDeparture = (bus) => {
  const { firstDepartureTime, frequencyMinutes } = bus; //todo

  const now = DateTime.now().setZone("UTC");

  const [hours, minutes] = firstDepartureTime.split(":").map(Number); // перебираем parseInt(n)

  let departure = DateTime.now().set({
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  })
  .setZone('UTC');

  // console.log("\ndeparture: ", departure);

  if (now > departure) {
    console.log("now is > departure");
    departure = departure.plus({ minutes: frequencyMinutes });
  } else {
    console.warn("now is < departure");
    console.log(bus);
  }

  const endOfDay = DateTime.now()
    .set({ hours: 23, minutes: 59, seconds: 59 })
    .setZone("UTC");

  if (departure > endOfDay) {
    console.log("departure is > endOfDay");
    departure = departure
      .startOf("day")
      .plus({ days: 1 })
      .set({ hours, minutes });
  } else {
    console.warn("departure is today < endOfDay");
  }
  console.log('departure: ', departure);

  return departure;
};

// вычисляем время отправляения автобуса
const sendUpdatedData = async () => {
  const buses = await loadBuses();

  const now = DateTime.now().setZone("UTC");
  console.log("now: UTC", now);

  const updatedBuses = buses.map((bus) => {
    //todo
    getNextDeparture(bus);

    console.log(
      bus.id,
      "автобус",
      bus.busNumber,
      bus.firstDepartureTime,
      bus.frequencyMinutes
    );
  });
};

const updateBuses = sendUpdatedData(); // !!!!!

const app = express();

// ** CORS Headers
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Origin", `${LOCAL}:5500`);
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:PORT');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // Помните, использование звёздочек в качестве маски может быть рискованным.
  next();
});

// * http://localhost:3000/timetable
app.get("/timetable", async (req, res) => {
  console.log("all time table");
  const data = await loadBuses();
  res.send(data); // ???
  // res.send(JSON.stringify(data)); // ???
});

// next-departure
app.get("/next", async (req, res) => {
  console.log("next");
  const data = await loadBuses();
  res.send(data); // ???
  // res.send(JSON.stringify(data)); // ???
});

// * http://localhost:3000/hello -> hello world
app.get("/hello", (req, res) => {
  console.log("helllo");
  res.send("Заголовок приветствия");
});

// launch server
app.listen(port, () => {
  console.log(`\nTHis server is running on ${LOCAL}:${port}\n`);
});

console.log("Hello server");
