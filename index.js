import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { DateTime } from "luxon";
const __filename = fileURLToPath(import.meta.url); // ???
const __dirname = dirname(__filename); // ???

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

const timeZone = "Europe/Moscow"; // временная зона 'UTC+3'


// возвращает следующий выезд данного автобуса
const getNextDeparture = (bus) => {

  const { 
    firstDepartureTime,  // время первого выезда
    frequencyMinutes,    // частота выездов через сколько минут следующий выезд
  } = bus;

  const [hours, minutes] = firstDepartureTime.split(":").map(Number); // парсерим bus.firstDepartureTime
  let departure = DateTime.now().set({ hours, minutes }).setZone(timeZone); // время выезда

  const now = DateTime.now().setZone(timeZone); // текущее время сейчас hh:mm:ss
  const endOfDay = DateTime.now().set({ hours: 23, minutes: 59, seconds: 59 }).setZone(timeZone); // завершение дня 23:59:59
  
  if (departure > endOfDay) {
    console.log("день окончился, следующий выезд завтра");
    departure = departure.startOf("day").plus({ days: 1 }).set({ hours, minutes }).setZone(timeZone); // сдвиг выезда на следующий день
  }

  // if (now > departure) {
  //   departure = departure.plus({ minutes: frequencyMinutes });
  // }

  // пересчет вариантов выездов до следующего автобуса
  while (now > departure) {
    departure = departure.plus({ minutes: frequencyMinutes });
    // console.log( "bus: ", bus.id, `${departure.hour}-${departure.minute}-${departure.second}`, );
  }
  // console.log("");

  return departure; // возвращаем время выезда
};


// вычисляем время отправляения автобуса
const sendUpdatedData = async () => {
  const buses = await loadBuses();
  // const now = DateTime.now().setZone(timeZone);
  const updatedBuses = buses.map((bus) => {
    return getNextDeparture(bus);
  });

  console.log('updatedBuses: ', updatedBuses.map(bus => bus.setLocale('ru').toFormat('( dd-MM-yyyy --- tt )')));
  return updatedBuses;
};

const updateBuses = sendUpdatedData(); // !!!!!




/////////////////////////////////////////////////////////////////
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
