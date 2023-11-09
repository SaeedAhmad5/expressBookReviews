const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require("axios");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    if (userswithsamename.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Convert the books object to an array of books
  const bookList = Object.values(books);

  // Return the list of books as a JSON response
  res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Book found, return its details as a JSON response
    const bookDetails = books[isbn];
    return res.status(200).json(bookDetails);
  } else {
    // Book not found, return a 404 Not Found response
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;

  // Initialize an array to store books by the matching author
  const matchingBooks = [];

  // Iterate through the keys of the 'books' object
  for (const isbn in books) {
    if (books[isbn].author === author) {
      matchingBooks.push(books[isbn]);
    }
  }

  // Check if any books by the author were found
  if (matchingBooks.length > 0) {
    // Books found, return their details as a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // No books by the author found, return a 404 Not Found response
    return res.status(404).json({ message: "No books by the author found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title;

  // Initialize an array to store books with the matching title
  const matchingBooks = [];

  // Iterate through the keys (ISBNs) of the 'books' object
  for (const isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push(books[isbn]);
    }
  }

  // Check if any books with the matching title were found
  if (matchingBooks.length > 0) {
    // Books found, return their details as a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // No books with the matching title found, return a 404 Not Found response
    return res
      .status(404)
      .json({ message: "No books with the matching title found" });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Retrieve the reviews for the book
    const bookReviews = books[isbn].reviews;

    return res.status(200).json(bookReviews);
  } else {
    // Book not found, return a 404 Not Found response
    return res.status(404).json({ message: "Book not found" });
  }
});
// Task 10
// Function to get the list of books using Axios with Promise callbacks
const getBookListWithPromise = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/"
      ) // Replace with your actual API URL
      .then((response) => {
        resolve(response.data.books);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

// Function to get the list of books using Axios with async-await
const getBookListWithAsyncAwait = async () => {
  try {
    const response = await axios.get(
      "https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/"
    ); // Replace with your actual API URL
    return response.data.books;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Example usage with Promise callbacks
getBookListWithPromise()
  .then((bookList) => {
    console.log("Book List with Promise:", bookList);
  })
  .catch((error) => {
    console.error("Error with Promise:", error);
  });

// Example usage with async-await
(async () => {
  try {
    const bookList = await getBookListWithAsyncAwait();
    console.log("Book List with Async-Await:", bookList);
  } catch (error) {
    console.error("Error with Async-Await:", error);
  }
})();

// Task 11

const getBookDetailsWithPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`
      ) // Replace with your actual API URL
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

// Function to get book details based on ISBN using Axios with async-await
const getBookDetailsWithAsyncAwait = async (isbn) => {
  try {
    const response = await axios.get(
      `https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`
    ); // Replace with your actual API URL
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Example usage with Promise callbacks
const isbnForPromise = "1"; // Replace with an actual ISBN
getBookDetailsWithPromise(isbnForPromise)
  .then((bookDetails) => {
    console.log("Book Details with Promise:", bookDetails);
  })
  .catch((error) => {
    console.error("Error with Promise:", error);
  });

// Example usage with async-await
(async () => {
  const isbnForAsyncAwait = "2"; // Replace with an actual ISBN
  try {
    const bookDetails = await getBookDetailsWithAsyncAwait(isbnForAsyncAwait);
    console.log("Book Details with Async-Await:", bookDetails);
  } catch (error) {
    console.error("Error with Async-Await:", error);
  }
})();
//   Task 12
// Function to get book details based on author using Axios with Promise callbacks
const getBooksByAuthorWithPromise = (author) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`
      ) // Replace with your actual API URL
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

// Function to get book details based on author using Axios with async-await
const getBooksByAuthorWithAsyncAwait = async (author) => {
  try {
    const response = await axios.get(
      `https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`
    ); // Replace with your actual API URL
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Example usage with Promise callbacks
const authorForPromise = "Chinua Achebe"; // Replace with an actual author
getBooksByAuthorWithPromise(authorForPromise)
  .then((booksByAuthor) => {
    console.log("Books by Author with Promise:", booksByAuthor);
  })
  .catch((error) => {
    console.error("Error with Promise:", error);
  });

// Example usage with async-await
(async () => {
  const authorForAsyncAwait = "Hans Christian Andersen"; // Replace with an actual author
  try {
    const booksByAuthor = await getBooksByAuthorWithAsyncAwait(
      authorForAsyncAwait
    );
    console.log("Books by Author with Async-Await:", booksByAuthor);
  } catch (error) {
    console.error("Error with Async-Await:", error);
  }
})();

//   Task 13

const getBooksByTitleWithPromise = (title) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`
      ) // Replace with your actual API URL
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

// Function to get book details based on title using Axios with async-await
const getBooksByTitleWithAsyncAwait = async (title) => {
  try {
    const response = await axios.get(
      `https://saeedirfan23-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`
    ); // Replace with your actual API URL
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Example usage with Promise callbacks
const titleForPromise = "Pride and Prejudice"; // Replace with an actual title
getBooksByTitleWithPromise(titleForPromise)
  .then((booksByTitle) => {
    console.log("Books by Title with Promise:", booksByTitle);
  })
  .catch((error) => {
    console.error("Error with Promise:", error);
  });

// Example usage with async-await
(async () => {
  const titleForAsyncAwait = "The Divine Comedy"; // Replace with an actual title
  try {
    const booksByTitle = await getBooksByTitleWithAsyncAwait(
      titleForAsyncAwait
    );
    console.log("Books by Title with Async-Await:", booksByTitle);
  } catch (error) {
    console.error("Error with Async-Await:", error);
  }
})();
module.exports.general = public_users;
