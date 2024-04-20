const users = [];
const books = [];

let db;

document.addEventListener("DOMContentLoaded", () => {
  const request = indexedDB.open("library", 1);

  // Setup the database and object store
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("users")) {
      const objectStore = db.createObjectStore("users", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("books")) {
      const objectStore = db.createObjectStore("books", { keyPath: "id" });
      objectStore.transaction.oncomplete = function (event) {
        const booksObjectStore = db
          .transaction("books", "readwrite")
          .objectStore("books");
        const BOOKS = [
          {
            id: "1",
            title: "Ksiązka 1",
            author: "Autor 1",
          },
          {
            id: "2",
            title: "Ksiązka 2",
            author: "Autor 2",
          },
          {
            id: "3",
            title: "Ksiązka 3",
            author: "Autor 3",
          },
          {
            id: "4",
            title: "Ksiązka 4",
            author: "Autor 4",
          },
        ];
        BOOKS.forEach((book) => {
          booksObjectStore.add(book);
        });
      };
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully");

    const usersTransaction = db.transaction(["users"], "readonly");
    const usersObjectStore = usersTransaction.objectStore("users");
    const getAllUsersRequest = usersObjectStore.getAll();

    getAllUsersRequest.onsuccess = function (event) {
      const usersFromDB = event.target.result;
      users.length = 0; 
      users.push(...usersFromDB); 
      console.log("Users synced from IndexedDB:", users);
    };

    getAllUsersRequest.onerror = function (event) {
      console.error(
        "Error retrieving users from IndexedDB:",
        event.target.error
      );
    };

    const booksTransaction = db.transaction(["books"], "readonly");
    const booksObjectStore = booksTransaction.objectStore("books");
    const getAllBooksRequest = booksObjectStore.getAll();

    getAllBooksRequest.onsuccess = function (event) {
      const booksFromDB = event.target.result;
      books.length = 0; 
      books.push(...booksFromDB);
      console.log("Books synced from IndexedDB:", users);
    };

    getAllBooksRequest.onerror = function (event) {
      console.error(
        "Error retrieving books from IndexedDB:",
        event.target.error
      );
    };
  };

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
  };
});


const addUserToDB = (user) => {
  const transaction = db.transaction(["users"], "readwrite");
  const objectStore = transaction.objectStore("users");
  const addUserRequest = objectStore.put(user);

  addUserRequest.onsuccess = function (event) {
    console.log("User added/updated successfully in IndexedDB");
  };

  addUserRequest.onerror = function (event) {
    console.error(
      "Error adding/updating user in IndexedDB:",
      event.target.error
    );
  };
};

const borrowBookDB = (userId, bookId) => {
  const transaction = db.transaction(["users"], "readwrite");
  const objectStore = transaction.objectStore("users");
  const getUserRequest = objectStore.get(userId);

  getUserRequest.onsuccess = function (event) {
    const user = getUserRequest.result;
    if (user) {
      user.booksBorrowed.push(books[bookId - 1]);
      addUserToDB(user);
    }
  };

  getUserRequest.onerror = function (event) {
    console.error("Error getting user from IndexedDB:", event.target.error);
  };
};

const returnBookDB = (userId, bookId) => {
  const transaction = db.transaction(["users"], "readwrite");
  const objectStore = transaction.objectStore("users");
  const getUserRequest = objectStore.get(userId);

  getUserRequest.onsuccess = function (event) {
    const user = getUserRequest.result;
    if (user) {
      user.booksBorrowed = user.booksBorrowed.filter(
        (book) => book.id !== bookId
      );
      addUserToDB(user);
    }
  };

  getUserRequest.onerror = function (event) {
    console.error("Error getting user from IndexedDB:", event.target.error);
  };
};

const submitForm = (e) => {
  const input = document.querySelector("#command");
  const command = input.value.split(" ")[0];
  const arguments = input.value.split(" ").slice(1);
  switch (command) {
    case "borrow":
      borrowBook(arguments[0], arguments[1]);
      break;
    case "return":
      returnBook(arguments[0], arguments[1]);
      break;
    case "list":
      listUserBooks(arguments[0]);
      break;
    case "books":
      console.log(books);
      break;
    case "details":
      showBookDetails(arguments[0]);
      break;
    default:
      console.error("Unknown command!");
      break;
  }
};

const borrowBook = (userId, bookId) => {
  const searchedUserIndex = users.findIndex((user) => user.id === userId);
  const searchedBookIndex = books.findIndex((book) => book.id === bookId);
  if (searchedBookIndex === -1) {
    console.error("Book does not exist!");
  } else if (searchedUserIndex === -1) {
    console.warn("User do not exist, creating a new user with given id...");
    users.push({ id: userId, booksBorrowed: [books[bookId - 1]] });
    addUserToDB({ id: userId, booksBorrowed: [books[bookId - 1]] });
  } else {
    if (
      users[searchedUserIndex].booksBorrowed.findIndex(
        (book) => book.id === bookId
      ) !== -1
    ) {
      console.warn("User has already borrowed this book!");
    } else {
      users[searchedUserIndex].booksBorrowed.push(books[bookId - 1]);
      borrowBookDB(userId, bookId);
    }
  }
};

const returnBook = (userId, bookId) => {
  const searchedUserIndex = users.findIndex((user) => user.id === userId);
  if (searchedUserIndex === -1) console.error("User do not exist!");
  else {
    if (
      users[searchedUserIndex].booksBorrowed.some((book) => book.id === bookId)
    ) {
      users[searchedUserIndex].booksBorrowed = users[
        searchedUserIndex
      ].booksBorrowed.filter((book) => book.id !== bookId);
      returnBookDB(userId, bookId);
    } else {
      console.error("User has not borrowed this book!");
    }
  }
};

const listUserBooks = (userId) => {
  const searchedUserIndex = users.findIndex((user) => user.id === userId);
  if (searchedUserIndex === -1) console.error("User do not exist!");
  else {
    console.log(`Books borrowed by user ${userId}:`);
    console.log(users[searchedUserIndex].booksBorrowed);
  }
};

const showBookDetails = (bookId) => {
  const searchedBookIndex = books.findIndex((book) => book.id === bookId);
  if (searchedBookIndex === -1) console.error("Book do not exist!");
  else {
    console.log("Book details:");
    console.log(books[searchedBookIndex]);
    console.log("Borrowers:");
    printBorrowers(bookId);
  }
};

const printBorrowers = (bookId) => {
  const searchedBookIndex = books.findIndex((book) => book.id === bookId);
  if (searchedBookIndex === -1) console.error("Book do not exist!");
  else {
    const borrowers = users.filter((user) =>
      user.booksBorrowed.some((book) => book.id === bookId)
    );
    console.log(borrowers);
  }
};
