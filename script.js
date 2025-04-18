//  Create the myLibrary Array
let myLibrary = [];

function loadLibraryFromLocalStorage() {
  const storedLibrary = localStorage.getItem("myLibrary");
  if (storedLibrary) {
    const parsedBooks = JSON.parse(storedLibrary);

    // Rehydrate books as class instances
    myLibrary = parsedBooks.map((bookData) => {
      const book = new Book(
        bookData.title,
        bookData.author,
        bookData.pages,
        bookData.isRead
      );
      book.id = bookData.id; // Reassign original ID
      return book;
    });
  } else {
    // Only add sample books if localStorage is empty
    addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
    addBookToLibrary("Digital Fortress", "Dan Brown", 510, false);
  }

  displayBooks();
}

// Define the Book Class
class Book {
  constructor(title, author, pages, isRead) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }

  //Method to toggle read status
  toggleReadStatus() {
    this.isRead = !this.isRead;
  }
}

// Define the addBookToLibrary Function
function addBookToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
  myLibrary.push(newBook);
  saveLibraryToLocalStorage();
  displayBooks(); // Update the UI after adding a new book
}

// Define the displayBooks Function
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

// Initialize form validation
function initializeFormValidation() {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");

  // Error spans
  const titleError = document.getElementById("titleError");
  const authorError = document.getElementById("authorError");
  const pageError = document.getElementById("pageError");

  //show error messages for each field
  function showError(input, errorSpan) {
    if (input.validity.valueMissing) {
      errorSpan.textContent = "This field is required.";
    } else if (input.validity.typeMismatch) {
      errorSpan.textContent = "Please enter a valid format";
    } else if (input.validity.tooShort) {
      errorSpan.textContent = `Should be at least ${input.minLength} characters; you entered ${input.value.length}`;
    } else if (input.validity.tooLong) {
      errorSpan.textContent = `Should be no more than ${input.maxLength} characters; you entered ${input.value.length}`;
    } else if (input.validity.rangeUnderflow) {
      errorSpan.textContent = `Value must be at least ${input.min}`;
    } else {
      errorSpan.textContent = "";
    }
  }

  // Input event listeners for real-time validation
  title.addEventListener("input", () => {
    if (title.validity.valid) {
      titleError.textContent = "";
    } else {
      showError(title, titleError);
    }
  });

  author.addEventListener("input", () => {
    if (author.validity.valid) {
      authorError.textContent = "";
    } else {
      showError(author, authorError);
    }
  });

  pages.addEventListener("input", () => {
    if (pages.validity.valid) {
      pageError.textContent = "";
    } else {
      showError(pages, pageError);
    }
  });
}

// Add a "New Book" Button and Form
const newBookForm = document.getElementById("new-book-form");
const newBookButton = document.getElementById("new-book-button");

newBookButton.addEventListener("click", () => {
  newBookForm.style.display = "block"; // Show the form
});

newBookForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from submitting by default

  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");
  const isRead = document.getElementById("is-read").checked;

  const titleError = document.getElementById("titleError");
  const authorError = document.getElementById("authorError");
  const pageError = document.getElementById("pageError");

  // Check each field's validity
  let isValid = true;

  if (!title.validity.valid) {
    showError(title, titleError);
    isValid = false;
  }

  if (!author.validity.valid) {
    showError(author, authorError);
    isValid = false;
  }

  if (!pages.validity.valid) {
    showError(pages, pageError);
    isValid = false;
  }

  if (!isValid) {
    return; // Stop form processing if validation fails
  }

  // If validation passes, add the new book to the library
  addBookToLibrary(title.value, author.value, pages.value, isRead);

  // Reset the form and hide it
  newBookForm.reset();
  newBookForm.style.display = "none";

  alert("Book added successfully!");
});

// Helper function to show errors
function showError(input, errorSpan) {
  if (input.validity.valueMissing) {
    errorSpan.textContent = "This field is required.";
  } else if (input.validity.typeMismatch) {
    errorSpan.textContent = "Please enter a valid format";
  } else if (input.validity.tooShort) {
    errorSpan.textContent = `Should be at least ${input.minLength} characters; you entered ${input.value.length}`;
  } else if (input.validity.tooLong) {
    errorSpan.textContent = `Should be no more than ${input.maxLength} characters; you entered ${input.value.length}`;
  } else if (input.validity.rangeUnderflow) {
    errorSpan.textContent = `Value must be at least ${input.min}`;
  } else {
    errorSpan.textContent = "";
  }
}

// Event Delegation for Remove and Toggle Read Buttons
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
    saveLibraryToLocalStorage(); // Updating local storage
    displayBooks(); // Refresh the UI
  }
}

// Function to Toggle Read Status
function toggleReadStatus(bookId) {
  const book = myLibrary.find((book) => book.id === bookId);
  if (book) {
    book.toggleReadStatus(); // Toggle the read status
    saveLibraryToLocalStorage();
    displayBooks(); // Refresh the UI
  }
}

function saveLibraryToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// Initialize validation
initializeFormValidation();
loadLibraryFromLocalStorage();
