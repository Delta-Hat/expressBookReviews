const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=> user.username === username);
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        if(!doesExist(username)){
            users.push({
                "username": username,
                "password": password
            })
            return res.status(201).send("User added!");
        } else {
            return res.status(403).send("User already exists.");
        }
    }
    return res.status(400).send("Missing either username or password!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        return res.status(200).send(JSON.stringify(book));
    }
    return res.status(404).send("Book not found.");
    //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author.replace("+"," ");
    let keys = Object.keys(books);
    let results = [];
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        let book = books[key];
        if(book.author === author){
            results.push(book);
        }
    }
    return res.status(200).send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title.replace("+"," ");
    let keys = Object.keys(books);
    let results = [];
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        let book = books[key];
        if(book.title === title){
            results.push(book);
        }
    }
    return res.status(200).send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        let reviews = book.reviews;
        return res.status(200).send(JSON.stringify(reviews));
    }
  
    return res.status(404).send("Book not found!");
});

module.exports.general = public_users;
