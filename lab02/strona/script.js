const users = [];
const books = [
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

const submitForm = (e) => {
  const input = document.querySelector("#command");
  const command = input.value.split(" ")[0];
  const arguments = input.value.split(" ").slice(1);
  let userId, bookId, searchedUserIndex, searchedBookIndex;
  switch (command) {
    case "borrow":
      if (arguments.length != 2) {
        console.error("Invalid arguments list!");
        break;
      }
      userId = arguments[0];
      bookId = arguments[1];
      searchedUserIndex = users.findIndex((user) => user.id === userId);
      searchedBookIndex = books.findIndex((book) => book.id === bookId);
      console.log(searchedUserIndex, searchedBookIndex);
      if (searchedUserIndex === -1) {
        console.warn("User do not exist, creating a new user with given id...");
        users.push({ id: userId, booksBorrowed: [books[bookId - 1]] });
      } else if (searchedBookIndex === -1) {
        console.error("Book do not exist!");
        break;
      } else {
        if (
          users[searchedUserIndex].booksBorrowed.findIndex(
            (book) => book.id === bookId
          ) === -1
        ) {
          console.warn("User has already borrowed this book!");
        } else {
          users[searchedUserIndex].booksBorrowed.push(books[bookId - 1]);
        }
      }
      break;
    case "return":
      if (arguments.length != 2) {
        console.error("Invalid arguments list!");
        break;
      }
      userId = arguments[0];
      bookId = arguments[1];
      searchedUserIndex = users.findIndex((user) => user.id === userId);
      searchedBookIndex = books.findIndex((book) => book.id === bookId);
      if (searchedUserIndex === -1) console.error("User do not exist!");
      else {
        if (
          users[searchedUserIndex].booksBorrowed.some(
            (book) => book.id === bookId
          )
        ) {
          users[searchedUserIndex].booksBorrowed = users[
            searchedUserIndex
          ].booksBorrowed.filter((book) => book.id !== bookId);
        } else {
          console.error("User has not borrowed this book!");
        }
      }
      break;
    case "list":
      if (arguments.length != 1) {
        console.error("Invalid arguments list!");
        break;
      }
      userId = arguments[0];
      searchedUserIndex = users.findIndex((user) => user.id === userId);
      if (searchedUserIndex === -1) console.error("User do not exist!");
      else console.log(users[searchedUserIndex].booksBorrowed);
      break;
    default:
      console.error("Unknown command!");
      break;
  }
};
