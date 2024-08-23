import express from "express";
import { readFile } from "node:fs/promises";
import url from "node:url";
import path from "node:path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("dirname: ", __dirname);

const PORT = 3000;
const LOCAL = 'http://localhost';
const LOCAL_URL = `${LOCAL}:${PORT}`;

const filePath = `${__dirname}\\buses.json`;

const loadbuses = async () => {
  console.log("filePath: ", filePath);
  const data = await readFile(filePath);
  return data;
};

const shortTimetable = async () => {
  const data = await loadbuses();
  // const arr = (await data).join();
  const arr = JSON.parse(data);
  const table = arr.map(
    (bus) => `${bus.busNumber}: ${bus.startPoint} - ${bus.endPoint}`
  );
  console.log("shortTimetable table: ", table);
  return table;
};

const app = express();

app.get("/hello", (req, res) => {
  const result = "hello world";
  console.log(result);
  res.send(result);
});

app.get("/next", async (req, res) => {
  try {
    const timetable = await loadbuses();
    res.send(timetable);
    // console.log("next timetable: ", timetable);
  } catch (error) {
    console.log("Some error occure", error);
  }
});

app.get("/short", async (req, res) => {
  try {
    const short = await shortTimetable();
    // console.log('short: ', short);
    res.send(short);
  } catch (error) {
    console.log("Some error occure", error);
  }
});


/* ? Page 404 */
app.use(function(req, res, next) {
  res.status(404).send('Вибачте, такої сторінки не існує!');
});


app.listen(PORT, () => {
  console.log(`\nServer express in running on ${LOCAL}:${PORT}\n\n`);
});

console.log("helllo index");