const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Unable to register user."
        });
    }

    if (!isValid(username)) {
        return res.status(404).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  return new Promise((resolve) => {
    resolve(res.status(200).json(JSON.parse(JSON.stringify(books))));
  });
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {
        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        if (!allBooks[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(allBooks[isbn]);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book"
        });
    }

});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/');
    
    const books = response.data;

    let filteredBooks = {};

    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        filteredBooks[key] = books[key];
      }
    });

    return res.status(200).json(filteredBooks);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/books');

    const allBooks = response.data;
    let filteredBooks = {};

    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].title === title) {
        filteredBooks[key] = allBooks[key];
      }
    });

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/books');

    const allBooks = response.data;

    return res.status(200).json(allBooks[isbn]);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book"
    });
  }
});

module.exports.general = public_users;
