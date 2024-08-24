import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;
const LOCAL = "http://localhost";

// * расписание здесь
const loadBuses = async () => {
  const data = await readFile("buses.json", {
    encoding: "utf-8",
  });
  const json = JSON.parse(data);
  return json;
};


const body = `<body style="background:#111; color:#0f3; font-family:sans-serif;">
  <h1>Hello World!!!</h1>
  <p>THis is our hello world answer</p>
</body>`;

const answer = ({ title, text }) => {
  return `<body style="background:#111;color:#0f3;font-family:sans-serif;font-size:10px;">
  <h1>${title}</h1>
  ${text ? `<p>${text}</p>` : ""}
</body>`;
};


const app = express();

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:PORT');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // Помните, использование звёздочек в качестве маски может быть рискованным.
  next();
});

// * http://localhost:3000/timetable
app.get("/timetable", async (req, res) => {
  console.log('all time table');
  const data = await loadBuses();
  res.send(data); // ???
  // res.send(JSON.stringify(data)); // ??? 
});


// * http://localhost:3000/hello -> hello world
app.get("/hello", (req, res) => {
  console.log("helllo");
  res.send(
    answer({
      text: "Это тектс приветствия",
      title: "Заголовок приветствия",
    })
  );
});

// launch server
app.listen(port, () => {
  console.log(`THis server is running on ${LOCAL}:${port}\n`);
});

console.log("Hello server");
