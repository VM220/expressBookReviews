const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let found_user = users.filter((user) => {
    return user.username === username;
  });
  if (found_user.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User registered successfully.Now you can login." });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(300).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);

  const filtered_books = keys
    .map((key) => books[key])
    .filter((book) => book.author === author);
  if (filtered_books.length > 0) {
    return res.status(300).json(filtered_books);
  } else {
    return res
      .status(300)
      .json({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const filtered_titles = keys
    .map((key) => books[key])
    .filter((book) => book.title === title);
  if (filtered_titles.length > 0) {
    return res.status(300).json(filtered_titles);
  } else {
    return res
      .status(300)
      .json({ message: "No books found for the given title." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn]["reviews"];
  return res.status(300).json(review);
});

module.exports.general = public_users;
