// server.js

const http = require("http");
const url = require("url");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

// Wczytanie danych z plików JSON
const booksData = JSON.parse(fs.readFileSync("src/data/books.json"));
const usersData = JSON.parse(fs.readFileSync("src/data/users.json"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS POST, GET",
  "Access-Control-Max-Age": 2592000,
};

// Obsługa żądań
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  switch (req.method) {
    case "GET":
      switch (req.url) {
        case "/":
          console.log("GET request: /");
          displayHomePage(req, res);
          break;
        case "/books":
          console.log("GET request: /books");
          res.writeHead(200, {
            "Content-Type": "application/json",
            ...corsHeaders,
          });
          res.end(JSON.stringify(booksData));
          break;
        case "/users":
          console.log("GET request: /users");
          res.writeHead(200, {
            "Content-Type": "application/json",
            ...corsHeaders,
          });
          res.end(JSON.stringify(usersData));
          break;
        default:
          // Obsługa innych żądań GET
          console.log("Unknown request:", reqUrl.pathname, reqUrl.method);
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          break;
      }
      break;
    case "POST":
      switch (req.url) {
        case "/borrow":
          console.log("POST request: /borrow");
          handleBorrowRequest(req, res);
          break;
        case "/return":
          console.log("POST request: /return");
          handleReturnRequest(req, res);
          break;
        case "/reader":
          console.log("POST request: /reader");
          handleReaderRequest(req, res);
          break;
        default:
          // Obsługa innych żądań POST
          console.log("Unknown request:", reqUrl.pathname, reqUrl.method);
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          break;
      }
      break;
    default:
      console.log("Unknown request:", req.url, req.method);
      break;
  }
});

function displayHomePage(req, res) {
  fs.readFile("index.html", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
}

// Funkcja do obsługi wypożyczenia książki
function handleBorrowRequest(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { userId, bookId } = JSON.parse(body);

    // Tutaj możesz wykonać odpowiednie operacje, np. wypożyczenie książki
    // np. zapisanie informacji o wypożyczeniu w bazie danych
    // Znajdź użytkownika w bazie danych
    const user = usersData.find((user) => user.id === userId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
      return;
    }
    // Znajdź książkę w bazie danych
    const book = booksData.find((book) => book.id === bookId);
    if (!book) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Book not found");
      return;
    }

    // Sprawdź, czy książka jest dostępna
    if (!book.copies_count === 0) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Book not available");
      return;
    }
    // Sprawdź, czy użytkownik ma już wypożyczoną tę książkę
    if (user.booksBorrowed.includes(bookId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Book already borrowed");
      return;
    }
    // Wypożycz książkę
    user.booksBorrowed.push(bookId);
    book.copies_count--;

    // Odpowiedź serwera
    console.log(userId, bookId);
    res.statusCode = 200;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Book borrowed successfully");
  });
}

// Funkcja do obsługi sprzedaży książki
function handleReturnRequest(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { userId, bookId } = JSON.parse(body);

    // Znajdź użytkownika w bazie danych
    const user = usersData.find((user) => user.id === userId);
    if (!user) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
      return;
    }
    // Znajdź książkę w bazie danych
    const book = booksData.find((book) => book.id === bookId);
    if (!book) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Book not found");
      return;
    }

    // Sprawdź, czy użytkownik wypożyczył tę książkę
    const borrowedIndex = user.booksBorrowed.indexOf(bookId);
    if (borrowedIndex === -1) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Book not borrowed by user");
      return;
    }

    // Usuń książkę z listy wypożyczonych książek użytkownika
    user.booksBorrowed.splice(borrowedIndex, 1);
    book.copies_count++;

    // Odpowiedź serwera
    console.log(userId, bookId);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Book returned successfully");
  });
}

// Funkcja do obsługi wyświetlenia wykazu książek dla czytelnika
function handleReaderRequest(req, res) {
  //   res.setHeader("Content-Type", "text/plain");
  //   Obsługa wyświetlenia wykazu książek dla danego czytelnika
  //   Wczytaj dane z formularza
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { userId } = JSON.parse(body);

    // Znajdź użytkownika w bazie danych
    const user = usersData.find((user) => user.id === userId);
    // if (!user) {
    //   res.setHeader("Content-Type", "text/plain");
    //   res.end("User not found");
    //   return;
    // }

    // Znajdź książki wypożyczone przez użytkownika
    const borrowedBooks = booksData.filter((book) =>
      user.booksBorrowed.includes(book.id)
    );

    // Odpowiedź serwera
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify(borrowedBooks));
  });
}

// Serwer nasłuchuje na zdefiniowanym porcie
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
