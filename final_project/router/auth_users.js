const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return username !== undefined || username !== null;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({
      message: "Invalid login.Please check the username and password.",
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  const review = req.query.review || req.body.review;

  if (!username || !isValid(username)) {
    return res
      .status(403)
      .json({ message: "You must be logged in to write a review." });
  }

  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Unable to find book" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content missing" });
  }

  book.reviews[username] = review;
  return res.status(200).json({
    message: `Review for book ${isbn} has been added/updated`,
    reviews: book.reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  if (!username) {
    return res.status(401).json({ message: "User not logged in." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Unable to find book." });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review by this user not found." });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
