import express from "express";
import morgan from "morgan";
import { join } from "path";
import studentsRouter from "./routes/index.js";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const PORT = 8000;

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

app.use(studentsRouter);

app.get("/", async (req, res) => {
  res.send("Hello World! Go to /students");
});

// Obsługa błędu 404 - strona nie znaleziona
app.use((request, response, next) => {
  response.status(404).send("Sorry, can't find that!");
});

app.listen(PORT, () => {
  console.log(`The server was started on port ${PORT}`);
});
