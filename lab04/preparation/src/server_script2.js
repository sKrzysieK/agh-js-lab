const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const port = 8000;
const guestBookFilePath = "guestbook.txt";

// Sprawdzenie czy plik istnieje, jeśli nie, utwórz go
if (!fs.existsSync(guestBookFilePath)) {
  fs.writeFileSync(guestBookFilePath, "", "utf8");
}


const pageContent = fs.readFileSync("src/index.html", "utf8");

/**
 * Represents HTTP server.
 * @param {http.IncomingMessage} req - The request object.
 * @param {http.ServerResponse} res - The response object.
 * @returns {void}
 */
const server = http.createServer((req, res) => {
  // Obsługa żądania POST
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const formData = querystring.parse(body);
      const { name, message } = formData;
      const newEntry = `${name}\n${message}\n\n`;

      // Zapis nowego wpisu do pliku
      fs.appendFile(guestBookFilePath, newEntry, (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Błąd serwera");
          return;
        }
        // Przekierowanie na stronę główną po dodaniu wpisu
        res.writeHead(302, { Location: "/" });
        res.end();
      });
    });
  } else {
    // Obsługa żądania GET
    if (req.url === "/") {
      fs.readFile(guestBookFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Błąd serwera");
          return;
        }
        // Wysyłanie zawartości pliku index.html jako odpowiedź
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          pageContent.replace(
            "<!-- Lista gości zostanie wstawiona dynamicznie przez kod JavaScript -->",
            `
                    <div id="guestBook">
                        ${
                          data
                            ? data
                                .split("\n\n")
                                .map((entry) =>
                                  entry
                                    ? `
                            <div class="entry">
                                <h2>${entry.split("\n")[0]}</h2>
                                <p>${entry.split("\n")[1]}</p>
                            </div>
                        `
                                    : ""
                                )
                                .join("")
                            : "Brak wpisów"
                        }
                    </div>
                `
          )
        );
      });
    } else {
      // Obsługa innych ścieżek
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Nie znaleziono");
    }
  }
});

// Uruchomienie serwera
server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}/`);
});
