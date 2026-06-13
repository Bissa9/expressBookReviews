const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let usersWithSameName = users.filter(
        (user) => user.username === username
    );

    return usersWithSameName.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter(
        (user) => user.username === username && user.password === password
    );

    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            { username: username },
            "access",
            { expiresIn: 3600 }
        );

        req.session.authorization = {
            accessToken
        };

        return res.status(200).json({
            message: "Login successful!"
        });
    }

    return res.status(401).json({
        message: "Invalid Login. Check username and password"
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
      message: "Review successfully added/updated",
      reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {

        delete books[isbn].reviews[username];

        return res.status(200).send(`Review for ISBN ${isbn} deleted`);
    }

    return res.status(404).send("No review found");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
