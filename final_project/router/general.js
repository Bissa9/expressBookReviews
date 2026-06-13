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
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let book = books[isbn]
  if(book) {
    return res.status(200).json(book)
  } else {
    return res.status(404).json({message: "Book not found"})
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author
  let result = {}

  let keys = Object.keys(books)
  keys.forEach((key) => {
    if(books[key].author === authorName){
        result[key] = books[key]
    }
  })
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titleName = req.params.title;
    let result = {};

    let keys = Object.keys(books);

    keys.forEach((key) => {
        if (books[key].title === titleName) {
            result[key] = books[key];
        }
    });
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let book = books[isbn]

  if(book){
    return res.status(200).json(book.reviews)
  }else {
    return res.status(404).json({message: "Book not found"});
  }

});

module.exports.general = public_users;
