// Step 1: Define the Book Constructor
function Book(title, author, pages, isRead) {
  this.id = crypto.randomUUID(); // Unique ID for each book
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// Step 2: Create the myLibrary Array
const myLibrary = [];

// Step 3: Define the addBookToLibrary Function
function addBookToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
  myLibrary.push(newBook);
  displayBooks(); // Update the UI after adding a new book
}

// Step 4: Define the displayBooks Function
function displayBooks() {
  const booksContainer = document.getElementById("books-container");
  booksContainer.innerHTML = ""; // Clear the existing display

  myLibrary.forEach((book) => {
    // Create a DOM element for each book (e.g., a card)
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-card");
    bookElement.setAttribute("data-id", book.id); // Associate DOM element with book ID

    // Add book details to the DOM element
    bookElement.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> <span class="status">${
        book.isRead ? "Read" : "Not Read"
      }</span></p>
      <button class="toggle-read-btn" data-id="${book.id}">Toggle Read</button>
      <button class="remove-btn" data-id="${book.id}">Remove</button>
    `;

    // Append the book element to the container
    booksContainer.appendChild(bookElement);
  });
}

// Step 5: Add a “New Book” Button and Form
const newBookForm = document.getElementById("new-book-form");
const newBookButton = document.getElementById("new-book-button");

newBookButton.addEventListener("click", () => {
  newBookForm.style.display = "block"; // Show the form
});

newBookForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission

  // Get form data
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("is-read").checked;

  // Add the new book to the library
  addBookToLibrary(title, author, pages, isRead);

  // Reset the form and hide it
  newBookForm.reset();
  newBookForm.style.display = "none";
});

// Step 6: Event Delegation for Remove and Toggle Read Buttons
document
  .getElementById("books-container")
  .addEventListener("click", (event) => {
    const target = event.target;

    // Handle Remove Button Click
    if (target.classList.contains("remove-btn")) {
      const bookId = target.getAttribute("data-id");
      removeBookFromLibrary(bookId);
    }

    // Handle Toggle Read Button Click
    if (target.classList.contains("toggle-read-btn")) {
      const bookId = target.getAttribute("data-id");
      toggleReadStatus(bookId);
    }
  });

// Function to Remove a Book
function removeBookFromLibrary(bookId) {
  const bookIndex = myLibrary.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    myLibrary.splice(bookIndex, 1); // Remove the book from the array
    displayBooks(); // Refresh the UI
  }
}

// Function to Toggle Read Status
function toggleReadStatus(bookId) {
  const book = myLibrary.find((book) => book.id === bookId);
  if (book) {
    book.toggleReadStatus(); // Toggle the read status
    displayBooks(); // Refresh the UI
  }
}

// Add a prototype method to Book to toggle isRead
Book.prototype.toggleReadStatus = function () {
  this.isRead = !this.isRead;
};

// Initial setup: Add a couple of books to the library for testing
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
addBookToLibrary("Digital Fortress", "Dan Brown", "510", "read");
