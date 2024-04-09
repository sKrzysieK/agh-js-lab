const fs = require('fs');
const { exec } = require('child_process');

// Funkcja do odczytu wartości licznika z pliku
function readCounter(callback) {
    fs.readFile('counter.txt', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Jeśli plik nie istnieje, ustaw licznik na 0
                return callback(null, 0);
            } else {
                return callback(err);
            }
        }
        callback(null, parseInt(data));
    });
}

// Funkcja do zapisu wartości licznika do pliku
function writeCounter(counter, callback) {
    fs.writeFile('counter.txt', counter.toString(), callback);
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
    if (mode === '--sync') {
        readCounter((err, counter) => {
            if (err) {
                console.error('Błąd podczas odczytu licznika:', err);
                return;
            }
            counter++;
            writeCounter(counter, (err) => {
                if (err) {
                    console.error('Błąd podczas zapisu licznika:', err);
                    return;
                }
                displayCounter(counter);
            });
        });
    } else if (mode === '--async') {
        readCounter((err, counter) => {
            if (err) {
                console.error('Błąd podczas odczytu licznika:', err);
                return;
            }
            counter++;
            writeCounter(counter, (err) => {
                if (err) {
                    console.error('Błąd podczas zapisu licznika:', err);
                    return;
                }
                displayCounter(counter);
            });
        });
    } else {
        // Tryb interaktywny
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('Wprowadź komendy — naciśnięcie Ctrl+D kończy wprowadzanie danych');

        let commands = '';

        readline.on('line', async (input) => {
            try {
                const result = await executeCommand(input);
                console.log(result);
            } catch (error) {
                console.error('Błąd podczas wykonywania komendy:', error);
            }
        });

        readline.on('close', () => {
            console.log('Koniec wprowadzania komend');
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
