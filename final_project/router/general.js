const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & Task 10: Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2 & Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 3 & Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = (author) => new Promise((resolve, reject) => {
      let matchingBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
          matchingBooks.push(books[key]);
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by this author");
      }
    });
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json({ booksbyauthor: booksByAuthor });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 4 & Task 13: Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = (title) => new Promise((resolve, reject) => {
      let matchingBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
          matchingBooks.push(books[key]);
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with this title");
      }
    });
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json({ booksbytitle: booksByTitle });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
