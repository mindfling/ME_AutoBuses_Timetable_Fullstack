import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
console.log('__filename: ', __filename);
const __dirname = dirname(__filename);
console.log('__dirname: ', __dirname);


const port = 3000;
const LOCAL = "http://localhost";

const app = express();

const body = `<body style="background:#111; color:#0f3; font-family:sans-serif;">
  <h1>Hello World!!!</h1>
  <p>THis is our hello world answer</p>
</body>`;

const answer = ({title}, {text}) => {
  console.log({ title }, { text });

  return `<body style="background:#111;color:#0f3;font-family:sans-serif;font-size:10px;">
  <h1>${title}</h1>
  ${text ? `<p>${text}</p>` : ""}
</body>`;
};

app.get("/next-departure", (req, res) => {
  res.send(
    answer({
      title: "timetable next departure",
    })
  );
});

const name = 'aoue'

// http://localhost:3000/hello -> hello world
app.get("/hello", (req, res) => {
  console.log("helllo");
  // res.send("<h1>Hello World!!!</h1>");
  res.send(
    answer({
      text: "Это тектс приветствия",
      title: "Заголовок текста",
    })
  );
});

// * расписание здесь
const loadBuses = async () => {
  const data = await readFile("buses.json", {
    encoding: "utf-8",
  });
  const json = JSON.parse(data);
  console.log("json: ", json);
  return json;
};

// launch server
app.listen(port, () => {
  console.log(`THis server is running on ${LOCAL}:${port}\n`);
});

console.log("Hello server");
