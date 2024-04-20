const fs = require("fs");
const { exec } = require("child_process");

function readCounterSync() {
  try {
    const data = fs.readFileSync("counter.txt", "utf8");
    return parseInt(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return 0;
    } else {
      throw err;
    }
  }
}

function writeCounter(counter, callback) {
  fs.writeFile("counter.txt", counter.toString(), callback);
}

function readCounterAsync(callback) {
  fs.readFile("counter.txt", "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Jeśli plik nie istnieje, ustaw licznik na 0
        return callback(null, 0);
      } else {
        return callback(err);
      }
    }
    callback(null, parseInt(data));
  });
}

// Funkcja do wyświetlania wartości licznika
function displayCounter(counter) {
  console.log(`Liczba uruchomień: ${counter}`);
}

// Funkcja do wykonania komendy systemowej
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

// Główna funkcja obsługująca różne tryby działania (async lub sync)
function main(mode) {
  if (mode === "--sync") {
    try {
      let counter = readCounterSync();
      counter++;
      writeCounter(counter, (err) => {
        if (err) {
          console.error("Błąd podczas zapisu licznika:", err);
          return;
        }
        displayCounter(counter);
      });
    } catch (err) {
      console.error("Błąd podczas odczytu licznika:", err);
    }
  } else if (mode === "--async") {
    readCounterAsync((err, counter) => {
      if (err) {
        console.error("Błąd podczas odczytu licznika:", err);
        return;
      }
      counter++;
      writeCounter(counter, (err) => {
        if (err) {
          console.error("Błąd podczas zapisu licznika:", err);
          return;
        }
        displayCounter(counter);
      });
    });
  } else {
    // Tryb interaktywny
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(
      "Wprowadź komendy — naciśnięcie Ctrl+D kończy wprowadzanie danych"
    );


    readline.on("line", async (input) => {
      try {
        const result = await executeCommand(input);
        console.log(result);
      } catch (error) {
        console.error("Błąd podczas wykonywania komendy:", error);
      }
    });

    readline.on("close", () => {
      console.log("Koniec wprowadzania komend");
    });
  }
}

// Sprawdzenie argumentów wiersza poleceń
if (process.argv.length > 2) {
  const mode = process.argv[2];
  main(mode);
} else {
  // Tryb interaktywny
  main();
}
