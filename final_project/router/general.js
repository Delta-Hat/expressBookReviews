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
    console.log("calling get")
    let bookPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books)
        },5000);
    });
    bookPromise.then((retrievedBooks) => {
        return res.status(200).send(JSON.stringify(books,null,4));
    });
    bookPromise.catch(() =>{
        return res.status(404).send("Nope.avi");
    });
    console.log("finished calling get, await a response.")
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    console.log("Calling get book by isbn...");
    let isbn = req.params.isbn;
    let bookPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            let book = books[isbn];
            if(book){
                resolve(book);
            } else {
                reject("Book not found.");
            }
        },5000)
    })
    bookPromise.then((retrievedBook) => {
        return res.status(200).send(JSON.stringify(retrievedBook,null,4));
    });
    bookPromise.catch((error) => {
        return res.status(404).send(error);
    });
    console.log("Finished setting up book query by isbn.")
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    console.log("Calling get books by author...");
    const author = req.params.author.replaceAll("+"," ");
    const keys = Object.keys(books);
    
    //return res.status(200).send(results);
    let bookPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            try{
                let results = [];
                //console.log(author);
                //console.log(keys);
                for(let i = 0; i < keys.length; i++){
                    let key = keys[i];
                    let book = books[key];
                    if(book.author === author){
                        results.push(book);
                    }
                }
                resolve(results)
            } catch(error) {
                //honestly, I just wanted this here for completionist sake.
                //if there is an error, this is a more graceful way of handling it.
                reject(error);
            }
        }, 5000)
    })
    bookPromise.then((results) => {
        return res.status(200).send(JSON.stringify(results,null,4));
    })
    bookPromise.catch((error) => {
        return res.status(404).send(error);
    });
    console.log("Finished setting up query by author.");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    console.log("Calling GET book by title...");
    const title = req.params.title.replaceAll("+"," ");
    const keys = Object.keys(books);
    
    //I feel this is a better name
    //but I can't be bothered to change the previous functions.
    let bookTask = new Promise((resolve,reject) => {
        setTimeout(() => {
            try{
                console.log(title);
                console.log(keys);
                let results = [];
                for(let i = 0; i < keys.length; i++){
                    let key = keys[i];
                    let book = books[key];
                    if(book.title === title){
                        results.push(book);
                    }
                }
                resolve(results);
            } catch(error) {
                reject(error);
            }
        },5000);
    });
    bookTask.then((results) => {
        res.status(200).send(JSON.stringify(results,null,4));
    });
    bookTask.catch((error) => {
        res.status(404).send(error);
    });
    console.log("Finished initializing get book by title.");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        let reviews = book.reviews;
        return res.status(200).send(JSON.stringify(reviews,null,4));
    }
  
    return res.status(404).send("Book not found!");
});

module.exports.general = public_users;
