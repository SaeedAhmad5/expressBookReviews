const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Retrieve the 'username' and 'password' from the request body
  const { username, password } = req.body;

  // Check if 'username' and 'password' are provided in the request
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username exists
  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the provided credentials are correct
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // If the credentials are correct, create a JWT token and save it in the session
  const token = jwt.sign({ username }, "your-secret-key", { expiresIn: "1h" });

  // Save the JWT token in the session
  req.session.token = token;

  // Return a success message with the JWT token
  return res.status(200).send("User auccessfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Retrieve the username from the session
  const username = req.session.username;

  // Check if the username is available in the session
  if (!username) {
    return res.status(401).json({ message: "Authentication required", token });
  }

  // Retrieve the review text from the request query
  const reviewText = req.query.review;

  // Check if review text is provided
  if (!reviewText) {
    return res
      .status(400)
      .json({ message: "Review text is required in the query" });
  }

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Check if the user has already posted a review for this ISBN
    if (books[isbn].reviews[username]) {
      // If the user has already posted a review, modify the existing one
      books[isbn].reviews[username] = reviewText;
    } else {
      // If the user has not posted a review, add a new one
      books[isbn].reviews[username] = reviewText;
    }

    return res
      .status(200)
      .send(
        `The Review for the book with ISBN ${isbn} has been added/modified successfully`
      );
  } else {
    // Book not found, return a 404 Not Found response
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Retrieve the username from the session
  const username = req.session.username;

  // Check if the username is available in the session
  if (!username) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Check if the user has posted a review for this ISBN
    if (books[isbn].reviews[username]) {
      // Delete the user's review for this ISBN
      delete books[isbn].reviews[username];

      return res
        .status(200)
        .send(
          `Review for the ISBN ${isbn} posted by the user ${username} deleted successfully`
        );
    } else {
      // If the user has not posted a review, return a 404 Not Found response
      return res
        .status(404)
        .json({ message: "Review not found for this user and ISBN" });
    }
  } else {
    // Book not found, return a 404 Not Found response
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
