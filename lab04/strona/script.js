const serverUrl = "http://localhost:3000";

const booksDisplay = document.getElementById("books-display");
const userSelect = document.getElementById("user-select");

let pickedUser;
let userBorrowedBooks = [];

userSelect.addEventListener("change", (event) => {
  pickedUser = +event.target.value;
  fetchBooks();
  console.log("Picked user:", pickedUser);
});

async function fetchUsers() {
  await fetch(serverUrl + "/users")
    .then((response) => response.json())
    .then((data) => {
      // Po pobraniu danych generujemy opcje wyboru użytkowników
      userSelect.innerHTML = "";
      userBorrowedBooks = [];
      data.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        userBorrowedBooks.push({
          id: user.id,
          booksBorrowed: user.booksBorrowed,
        });
        userSelect.appendChild(option);
      });
      if (!pickedUser) {
        pickedUser = data[0].id;
      }
      userSelect.value = pickedUser;
    })
    .catch((error) => console.error("Error fetching users:", error));
}

async function fetchBooks() {
  await fetch(serverUrl + "/books")
    .then((response) => response.json())
    .then((data) => {
      // Po pobraniu danych generujemy wiersze tabeli z książkami
      booksDisplay.innerHTML = "";
      data.forEach((book) => {
        booksDisplay.innerHTML += `
          <div class="col-lg-4 col-md-6 mb-4">
          <div class="card">
            <div class="card-header bg-light text-black">${book.author}</div>
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <img
                src="${book.cover}"
                class="img-fluid mb-3 w-100"
                alt="Book Cover"
              />
              <p class="card-text">
                <strong>Kategoria:</strong> ${book.category}
              </p>
              <p class="card-text">
                <strong>Ilość egzemplarzy:</strong> ${book.copies_count}
              </p>
            </div>
            <div class="card-footer bg-primary text-white text-right">
              <button class="btn btn-light borrow-btn" data-book-id="${
                book.id
              }" ${checkIfUserCanBorrow(
          book.id,
          book.copies_count
        )}>Wypożycz</button>
              <button class="btn btn-light return-btn" data-book-id="${
                book.id
              }" ${checkIfUserCanReturn(book.id)}>Oddaj</button>
            </div>
          </div>
        </div>
        `;
      });

      // Pobierz wszystkie przyciski wypożyczania i oddawania książek
      const borrowButtons = document.querySelectorAll(".borrow-btn");
      const returnButtons = document.querySelectorAll(".return-btn");

      // Dodaj obsługę kliknięcia do każdego przycisku wypożyczania
      borrowButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const bookId = button.getAttribute("data-book-id");
          borrowBook(bookId);
        });
      });

      // Dodaj obsługę kliknięcia do każdego przycisku oddawania
      returnButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const bookId = button.getAttribute("data-book-id");
          returnBook(bookId);
        });
      });
    })
    .catch((error) => console.error("Error fetching books:", error));
}

fetchUsers();
fetchBooks();

const checkIfUserCanBorrow = (bookId, copies_count) => {
  if (copies_count === 0) {
    return "disabled";
  }
  const pickedUserData = userBorrowedBooks.find(
    (user) => user.id === pickedUser
  );
  if (pickedUserData) {
    if (pickedUserData.booksBorrowed.includes(bookId)) {
      return "disabled";
    } else {
      return "";
    }
  } else {
    return "";
  }
};

const checkIfUserCanReturn = (bookId) => {
  const pickedUserData = userBorrowedBooks.find(
    (user) => user.id === pickedUser
  );
  if (pickedUserData) {
    if (!pickedUserData.booksBorrowed.includes(bookId)) {
      return "disabled";
    } else {
      return "";
    }
  } else {
    return "";
  }
};

const borrowBook = async (bookId) => {
  const borrowData = {
    userId: +pickedUser,
    bookId: +bookId,
  };

  fetch(serverUrl + "/borrow", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(borrowData),
  }).then((response) => {
    fetchUsers();
    fetchBooks();
  });
};

const returnBook = async (bookId) => {
  const returnData = {
    userId: +pickedUser,
    bookId: +bookId,
  };

  fetch(serverUrl + "/return", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(returnData),
  }).then((response) => {
    fetchUsers();
    fetchBooks();
  });
};

const showReaderBooks = async () => {
  const readerData = {
    userId: +pickedUser,
  };

  try {
    const response = await fetch(serverUrl + "/reader", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(readerData),
    });

    // Read the response as JSON
    const data = await response.json();
    console.log(data);

    const readerBooksDisplay = document.getElementById("user-books-list");
    readerBooksDisplay.innerHTML = "";
    data.forEach((book) => {
      readerBooksDisplay.innerHTML += `
        <li class="list-group-item">${book.title} - ${book.author}</li>
      `;
    });

    // Refresh the users and books data
  } catch (error) {
    console.error("Error fetching reader books:", error);
  }
};
