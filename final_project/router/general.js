const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
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

//using async await with axios to get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/getBook");
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});
// Get the book list available in the shop
public_users.get("/getBook", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;

//   return res.status(300).json(books[isbn]);
// });

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const keys = Object.keys(books);

    const filtered_books = keys
      .map((key) => books[key])
      .filter((book) => book.author === author);
    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject("No books found for the given author");
    }
  })
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const keys = Object.keys(books);
    const filtered_titles = keys
      .map((key) => books[key])
      .filter((book) => book.title === title);

    if (filtered_titles.length > 0) {
      return res.status(200).json(filtered_titles);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for the given title." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books by title", error: error.message });
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
