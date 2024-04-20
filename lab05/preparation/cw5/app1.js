import express from "express";
import morgan from "morgan";
import { join } from "path";

const app = express();

app.use(morgan("dev"));

const publicDirectoryPath = join(process.cwd(), "public");
app.use(express.static(publicDirectoryPath));

app.get("/", (request, response) => {
  response.send(`
    <!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>First Express application</title>
       </head>
       <body>
          <main>
             <h1>First Express application</h1>
             <form method="GET" action="/submit">
                <label for="name">Give your name</label>
                <input name="name">
                <br>
                <input type="submit">
                <input type="reset">
             </form>
             <!-- Wyświetlanie obrazka -->
             <img src="/images/example.jpg" alt="Example Image">
          </main>
       </body>
    </html>    
           `);
});

app.get("/submit", (request, response) => {
  response.set("Content-Type", "text/plain");
  response.send(`Hello ${request.query.name}`); // Send a response to the browser
});
app.listen(8000, () => {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
