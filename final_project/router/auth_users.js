const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //retrieves all users who have same username and password.
    //really ought to have only one valid entry imo
    let validusers = users.filter((user) => user.username === username && user.password === password);
    //checks that there's at least one valid user
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //unpack req
    const username = req.body.username;
    const password = req.body.password;
    //check if req has require inputs
    if(!username || !password){
        return res.status(400).send("Missing username or password!");
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign(
            {data: password},
            "wakistan",//this is a test secret string
            {expiresIn: 60 * 10}
        );
        /*
        "Session data is not saved in the cookie itself,
        just the session ID. Session data is stored server-side."
        So basically, the token is saved in the server but the session ID is stored as a cookie.
        Does that mean a hacker could retrieve and forge the session ID?
         */
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("Logged in!");
    }
    return res.status(208).send("Invalid user credentials.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.body.review;
    console.log(username);
    console.log(isbn);
    console.log(review);
    if(!username){
        //sends this error because we can't have a review without a username.
        return res.status(500).send("Error, somehow got authenticated but username is missing.")
    }
    if(!review){
        return res.status(400).send("I'd rather you don't add blank reviews.")
    }
    let book = books[isbn];
    if(!book){
        return res.status(404).send("Book not found!");
    }
    let reviews = book.reviews;
    delete reviews[username];
    reviews[username] = review;

    return res.status(200).send("Review added: " + review + " for " + username + ".");
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    if(!username){
        return res.status(500).send("How'd you get here without logging in?");
    }
    let book = books[isbn];
    if(!book){
        return res.status(404).send("How can one delete that which does not exist?");
    }
    let reviews = book.reviews;
    delete reviews[username];
    return res.status(200).send("Deleted review! Your terrible opinion will no longer embarase you!");
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
