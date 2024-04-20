import express from "express";
import morgan from "morgan";
import { join } from "path";

const app = express();
app.locals.pretty = app.get("env") === "development";

// Ustawienie Pug jako systemu szablonów
app.set("view engine", "pug");

// Ustawienie ścieżki do katalogu z szablonami
app.set("views", join(process.cwd(), "views"));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
const publicDirectoryPath = join(process.cwd(), "public");
app.use(express.static(publicDirectoryPath));

let students = [
  {
    fname: "Jan",
    lname: "Kowalski",
  },
  {
    fname: "Anna",
    lname: "Nowak",
  },
];

// Obsługa żądania GET na głównej stronie
app.get("/", (request, response) => {
  // Renderowanie szablonu 'index.pug'
  response.render("index", { students });
});

// Obsługa żądania GET na ścieżce '/submit'
app.get("/submit", (request, response) => {
  const name = request.query.name || "Guest";
  response.status(200).send(`Hello ${name}`);
});

// Obsługa żądania POST na głównej stronie
app.post("/", (request, response) => {
  const name = request.body.name || "Guest";
  response.status(200).send(`Hello ${name}`);
});

// Obsługa błędu 404 - strona nie znaleziona
app.use((request, response, next) => {
  response.status(404).send("Sorry, can't find that!");
});

app.listen(8000, () => {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
