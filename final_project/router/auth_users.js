const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
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
public_users.get('/', async function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data[isbn]);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        let filteredBooks = {};

        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].author === author) {
                filteredBooks[key] = allBooks[key];
            }
        });

        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        let filteredBooks = {};

        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].title === title) {
                filteredBooks[key] = allBooks[key];
            }
        });

        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;