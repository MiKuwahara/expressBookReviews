const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) =>{
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => user.username === username);
    // Return true if any user with the same user is found, otherwise false
    if(userswithsamename.length > 0){
        return true;
    }else{
        return false;
    }
};
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!doesExist(username)){
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."});
        }else{
            return res.status(404).json({message: `Username ${username} already exists!`});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "All fields must be filled. Please try again."});
    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    // Check if isbn exists
    if(books[isbn]){
        return res.send(books[isbn]);
    }
    // Send response that isbn is not valid
    return res.send("Invalid ISBN.");
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Extract author parameter from request url
    const requestAuthor = req.params.author;
    // Obtain all the keys for the books object
    const keys = Object.keys(books);
    // Iterate through the books dictionary using the keys to get the author
    keys.map((key) => {
        let author = books[key].author;
        if(author === requestAuthor){
            return res.send(books[key])
        }
    });
    // Send response that author cannot be found
    return res.send(`There is no author with that name ${requestAuthor}.`);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Extract title parameter from the request url
    const requestTitle = req.params.title;
    const keys = Object.keys(books);
    keys.map((key)=>{
        let title = books[key].title;
        if(title === requestTitle){
            return res.send(books[key]);
        }
    });
    return res.send(`There is no book with the title ${requestTitle}.`);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]){
        return res.send(books[isbn].reviews)
    }
    return res.send("Invalid ISBN.");
});

module.exports.general = public_users;
